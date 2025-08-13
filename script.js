document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("game-container");

    for (let i = 0; i < 16; i++) {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        tile.textContent = "";
        container.appendChild(tile);
    }

    // Пример генерации плитки с числом
    function addTile() {
        const emptyTiles = Array.from(document.querySelectorAll(".tile")).filter(t => t.textContent === "");
        if (emptyTiles.length > 0) {
            const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            randomTile.textContent = Math.random() > 0.5 ? 2 : 4;
        }
    }

    addTile();
    addTile();
});
