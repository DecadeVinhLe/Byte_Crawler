/* Account database client (Supabase). Sign up, log in, load and save progress.
   No library is needed: it talks to the Supabase auth and REST endpoints with fetch.
   It stays switched off (BCCloud.enabled === false) until js/config.js has both values,
   and then the browser-only demo login in js/result.js keeps working as before.

   This file only moves data. js/result.js owns the game state and decides how to merge it:
     BCCloud.configure({collect: function(){ return {xp,done,quiz,boss,rec} },
                        merge:   function(remoteProgress){ ... }});
   Saving is debounced: BCCloud.queue() pulls the saved copy, merges it, then upserts. */
(function(){
"use strict";
var CFG=window.BC_CONFIG||{},
 BASE=String(CFG.SUPABASE_URL||"").trim().replace(/\/+$/,""),
 KEY=String(CFG.SUPABASE_ANON_KEY||"").trim(),
 ON=/^https?:\/\/[^\s/]+/i.test(BASE)&&KEY.length>20,
 SK="bc_session",UPSERT="/rest/v1/progress?on_conflict=user_id",
 sess=null,cfg={},timer=0,busy=false,dirty=false,refreshing=null,listeners=[],state="idle";

function lsGet(k){try{return localStorage.getItem(k)}catch(e){return null}}
function lsSet(k,v){try{localStorage.setItem(k,v)}catch(e){}}
function lsDel(k){try{localStorage.removeItem(k)}catch(e){}}
function now(){return Math.floor(Date.now()/1000)}
function emit(s){state=s;listeners.slice().forEach(function(f){try{f(s)}catch(e){}})}

/* ---- one fetch wrapper: JSON in, JSON out, errors as plain objects ---- */
function req(method,path,body,o){o=o||{};
 var h={apikey:KEY,"Content-Type":"application/json"};
 /* the newer "publishable" keys are not JWTs and must travel in apikey only */
 if(o.token||/^eyJ/.test(KEY))h.Authorization="Bearer "+(o.token||KEY);
 if(o.prefer)h.Prefer=o.prefer;
 return fetch(BASE+path,{method:method,headers:h,body:body==null?undefined:JSON.stringify(body),keepalive:!!o.keepalive}).then(function(r){
  return r.text().then(function(t){var d=null;try{d=t?JSON.parse(t):null}catch(e){}
   if(r.ok)return d;
   throw{status:r.status,code:d&&(d.error_code||d.code||d.error)||"",msg:d&&(d.msg||d.message||d.error_description||d.error)||""}})},
  function(){throw{offline:true}})}

/* ---- session ---- */
function setSession(d){
 if(!d||!d.access_token||!d.refresh_token||!d.user)throw{msg:"bad session"};
 var md=d.user.user_metadata||{};
 sess={access_token:d.access_token,refresh_token:d.refresh_token,
  expires_at:d.expires_at||now()+(d.expires_in||3600),
  user:{id:d.user.id,email:String(d.user.email||"").toLowerCase(),name:String(md.name||"")}};
 lsSet(SK,JSON.stringify(sess))}
function clearSession(){sess=null;lsDel(SK)}
function loadSession(){
 try{var s=JSON.parse(lsGet(SK)||"null");
  if(s&&s.access_token&&s.refresh_token&&s.user&&s.user.id)sess=s}catch(e){}}
function pub(){return sess?{id:sess.user.id,email:sess.user.email,name:sess.user.name}:null}

/* a usable access token, refreshed when it is about to expire */
function token(force){
 if(!sess)return Promise.reject({auth:true});
 if(!force&&sess.expires_at-60>now())return Promise.resolve(sess.access_token);
 if(!refreshing){
  refreshing=req("POST","/auth/v1/token?grant_type=refresh_token",{refresh_token:sess.refresh_token})
   .then(function(d){setSession(d)},function(e){if(!e.offline){clearSession();emit("signedout")}throw e})
   .then(function(){refreshing=null;return sess.access_token},function(e){refreshing=null;throw e})}
 return refreshing}
function authed(method,path,body,o){
 function go(force){return token(force).then(function(t){o=o||{};o.token=t;return req(method,path,body,o)})}
 return go(false).catch(function(e){return e&&e.status===401&&sess?go(true):Promise.reject(e)})}

/* ---- plain-language errors ---- */
function explain(e){
 e=e||{};var c=String(e.code||"").toLowerCase(),m=String(e.msg||"").toLowerCase();
 if(e.offline)return"Can't reach the server. Check your connection and try again.";
 if(c==="invalid_credentials"||m.indexOf("invalid login")>-1)return"Email or password is not right.";
 if(c==="email_not_confirmed"||m.indexOf("not confirmed")>-1)return"Confirm your email first: open the link we sent you, then log in.";
 if(c==="user_already_exists"||m.indexOf("already registered")>-1)return"That email already has an account. Use Log in instead.";
 if(c==="weak_password"||m.indexOf("password should")>-1)return"Choose a stronger password (at least 6 characters).";
 if(c==="signup_disabled")return"Sign-ups are turned off right now.";
 if(e.status===429||c.indexOf("rate_limit")>-1)return"Too many tries. Wait a minute and try again.";
 if(e.auth)return"Please log in again.";
 return"Something went wrong"+(e.status?" ("+e.status+")":"")+". Try again in a moment."}

/* ---- accounts ---- */
function signUp(email,pw,name){
 return req("POST","/auth/v1/signup",{email:email,password:pw,data:{name:name}}).then(function(d){
  if(d&&d.access_token&&d.user){setSession(d);return{status:"signed-in",user:pub()}}
  return{status:"confirm"}})}
function signIn(email,pw){
 return req("POST","/auth/v1/token?grant_type=password",{email:email,password:pw}).then(function(d){setSession(d);return pub()})}
function restore(){
 if(!sess)return Promise.resolve(null);
 return token(false).then(function(){return pub()},function(e){return e&&e.offline?pub():null})}
function signOut(){
 var go=(dirty&&sess&&!busy?sync().catch(function(){}):Promise.resolve());
 return go.then(function(){
  var t=sess&&sess.access_token;clearSession();clearTimeout(timer);dirty=false;busy=false;
  if(t)req("POST","/auth/v1/logout",null,{token:t}).catch(function(){});
  emit("idle")})}

/* ---- data ---- */
function pull(){
 var id=sess&&sess.user.id;if(!id)return Promise.reject({auth:true});
 return Promise.all([
  authed("GET","/rest/v1/progress?select=xp,done,quiz,boss,rec&user_id=eq."+encodeURIComponent(id)),
  authed("GET","/rest/v1/profiles?select=display_name&id=eq."+encodeURIComponent(id))
 ]).then(function(r){
  var p=r[0]&&r[0][0]||null,n=r[1]&&r[1][0]||null;
  return{progress:p,name:n&&n.display_name||null,hasProfile:!!n}})}
function row(p){return{user_id:sess.user.id,xp:p.xp|0,done:p.done||{},quiz:p.quiz||{},boss:p.boss?1:0,rec:p.rec||{}}}
function push(p){return authed("POST",UPSERT,[row(p)],{prefer:"resolution=merge-duplicates,return=minimal"})}
function ensureProfile(){
 var nm=(sess.user.name||sess.user.email.split("@")[0]||"Adventurer").slice(0,40);if(nm.length<2)nm="Adventurer";
 return authed("POST","/rest/v1/profiles?on_conflict=id",[{id:sess.user.id,display_name:nm}],{prefer:"resolution=ignore-duplicates,return=minimal"})}

/* pull the saved copy, let the game merge it, then upsert the merged result */
function sync(){
 return pull().then(function(r){
  if(r.progress&&cfg.merge)cfg.merge(r.progress);
  return(r.hasProfile?Promise.resolve():ensureProfile()).then(function(){return push(cfg.collect())})})}

function queue(){
 if(!ON||!sess||!cfg.collect)return;
 dirty=true;emit("pending");clearTimeout(timer);timer=setTimeout(run,800)}
function run(){
 if(busy||!dirty||!sess)return;
 busy=true;dirty=false;emit("saving");
 sync().then(function(){busy=false;if(dirty){emit("pending");timer=setTimeout(run,300)}else emit("saved")},
  function(e){busy=false;dirty=true;
   if(!sess)return;
   if(e&&e.offline)emit("offline");else if(e&&(e.auth||e.status===401))emit("signedout");else emit("error")})}

addEventListener("online",function(){if(dirty)run()});
/* last-chance save when the tab closes; keepalive lets the request outlive the page */
addEventListener("pagehide",function(){
 if(!dirty||!sess||!cfg.collect||sess.expires_at<=now())return;
 try{req("POST",UPSERT,[row(cfg.collect())],{token:sess.access_token,prefer:"resolution=merge-duplicates,return=minimal",keepalive:true}).catch(function(){})}catch(e){}});

loadSession();
window.BCCloud={
 enabled:ON,
 configure:function(o){cfg=o||{}},
 user:pub,restore:restore,signUp:signUp,signIn:signIn,signOut:signOut,
 pull:pull,queue:queue,explain:explain,
 onStatus:function(f){listeners.push(f)},
 status:function(){return state}
};
})();
