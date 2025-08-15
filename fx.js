function applyTileAnimation(tile, previousPosition, merged) {
  if (previousPosition) {
    const diffX = previousPosition.x - tile.x;
    const diffY = previousPosition.y - tile.y;
    tile.el.style.transform = `translate(${diffX * 100}%, ${diffY * 100}%)`;
    requestAnimationFrame(() => {
      tile.el.style.transform = "translate(0, 0)";
    });
  }

  if (tile.isNew) {
    tile.el.classList.add("tile-new");
  }

  if (merged) {
    tile.el.classList.add("tile-merge");
    setTimeout(() => tile.el.classList.remove("tile-merge"), 150);
  }
}