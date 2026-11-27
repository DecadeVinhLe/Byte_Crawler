/* Image paths. <img data-k="key"> elements get their src from here. */
var IMG={
  door:"assets/images/door.png",
  rogue:"assets/images/rogue.png?v=2",
  knightS:"assets/images/knight-sheet.png",mageS:"assets/images/mage-sheet.png",rangerS:"assets/images/ranger-sheet.png",rogueS:"assets/images/rogue-sheet.png",
  ruins:"assets/images/ruins.jpg",
  arches:"assets/images/arches.png",
  mapA:"assets/images/mapA.jpg",
  knight:"assets/images/knight.png?v=2",
  mage:"assets/images/mage.png?v=2",
  ranger:"assets/images/ranger.png?v=2",
  dragon:"assets/images/dragon.png",
  dragon2:"assets/images/dragon2.png"};
document.querySelectorAll("img[data-k]").forEach(function(i){i.src=IMG[i.dataset.k]});
