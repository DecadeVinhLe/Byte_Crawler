/* Image paths. <img data-k="key"> elements get their src from here. */
var IMG={
  door:"assets/images/door.png",
  rogue:"assets/images/rogue.png",
  ruins:"assets/images/ruins.jpg",
  arches:"assets/images/arches.png",
  mapA:"assets/images/mapA.jpg",
  knight:"assets/images/knight.png",
  mage:"assets/images/mage.png",
  ranger:"assets/images/ranger.png",
  dragon:"assets/images/dragon.png",
  dragon2:"assets/images/dragon2.png"};
document.querySelectorAll("img[data-k]").forEach(function(i){i.src=IMG[i.dataset.k]});
