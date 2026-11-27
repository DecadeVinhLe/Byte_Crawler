/* Image paths. <img data-k="key"> elements get their src from here. */
var IMG={
  door:"assets/images/door.png",
  rogue:"assets/images/rogue.png",
  ruins:"assets/images/ruins.jpg",
  arches:"assets/images/arches.png",
  mapA:"assets/images/mapA.jpg",
  knight:"assets/images/knight.png?v=2",
  mage:"assets/images/mage.png",
  ranger:"assets/images/ranger.png",
  dragon:"assets/images/dragon.png?v=2",
  dragon2:"assets/images/dragon2.png",
  /* hero attack sprite sheets: 3x3 frames of 256px each */
  sheetKnight:"assets/images/sheet-knight.png",
  sheetMage:"assets/images/sheet-mage.png",
  sheetRanger:"assets/images/sheet-ranger.png",
  sheetRogue:"assets/images/sheet-rogue.png"};
document.querySelectorAll("img[data-k]").forEach(function(i){i.src=IMG[i.dataset.k]});
