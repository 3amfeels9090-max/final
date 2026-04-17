const gallery = [
    "photo1.jpeg",
    "photo2.jpg",
    "photo3.jpg",
    "photo4.jpg",
    "photo5.jpg",
    "photo6.jpg",
    "photo7.jpg",
    "photo8.jpeg",
    "pic1.jpg",
    "pic2.jpg",
    "pic3.jpg",
    "pic4.jpg",
    "pic5.jpg"
];

function shuffleArray(items) {
    const shuffled = [...items];

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }

    return shuffled;
}

function randomBetween(min, max) {
    return min + Math.random() * (max - min);
}

function randomInt(min, max) {
    return Math.floor(randomBetween(min, max + 1));
}

function pickImage(lastImage, offset, imagePool) {
    if (!imagePool.length) {
        return "";
    }

    let chosen = imagePool[offset % imagePool.length];
    let attempts = 0;

    while (chosen === lastImage && attempts < 8) {
        chosen = imagePool[randomInt(0, imagePool.length - 1)];
        attempts += 1;
    }

    return chosen;
}

function createTile(image, width, rowIndex, tileIndex) {
    const tile = document.createElement("div");
    tile.className = "grid-tile";
    tile.style.setProperty("--tile-width", `${width}px`);

    const objectX = randomBetween(26, 74);
    const objectY = randomBetween(24, 76);
    const img = document.createElement("img");
    img.src = image;
    img.alt = `Memory ${rowIndex + 1}-${tileIndex + 1}`;
    img.loading = "lazy";
    img.decoding = "async";
    img.style.objectPosition = `${objectX.toFixed(1)}% ${objectY.toFixed(1)}%`;

    tile.appendChild(img);
    return tile;
}

function createRow(rowIndex, rowHeight, viewportWidth, imagePool) {
    const row = document.createElement("div");
    row.className = "grid-row";

    const track = document.createElement("div");
    track.className = "grid-track";

    const strip = document.createElement("div");
    strip.className = "grid-strip";

    let totalWidth = 0;
    let tileIndex = 0;
    let lastImage = "";
    const minimumStripWidth = Math.max(viewportWidth * 1.65, viewportWidth + rowHeight * 4);

    while (totalWidth < minimumStripWidth) {
        const width = Math.round(randomBetween(rowHeight * 0.72, rowHeight * 1.28));
        const image = pickImage(lastImage, rowIndex + tileIndex, imagePool);
        strip.appendChild(createTile(image, width, rowIndex, tileIndex));
        totalWidth += width;
        lastImage = image;
        tileIndex += 1;
    }

    const duration = randomBetween(42, 68);
    if (rowIndex % 2 === 1) {
        track.classList.add("reverse");
    }

    track.style.setProperty("--row-shift", `${totalWidth}px`);
    track.style.setProperty("--row-duration", `${duration.toFixed(2)}s`);
    track.appendChild(strip);
    track.appendChild(strip.cloneNode(true));

    row.appendChild(track);
    return row;
}

function buildGrid() {
    const grid = document.getElementById("movingGrid");
    if (!grid) {
        return;
    }

    const imagePool = shuffleArray(gallery);

    const rowCount = window.innerWidth < 700 ? 7 : 6;
    const rowHeight = Math.ceil(window.innerHeight / rowCount);

    document.documentElement.style.setProperty("--row-count", String(rowCount));
    grid.innerHTML = "";

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
        grid.appendChild(createRow(rowIndex, rowHeight, window.innerWidth, imagePool));
    }
}

let rebuildTimer = null;
buildGrid();

const finalNoteBtn = document.querySelector(".final-note-btn");

if (finalNoteBtn) {
    finalNoteBtn.addEventListener("click", (event) => {
        event.preventDefault();

        document.body.classList.add("page-leaving");

        window.setTimeout(() => {
            window.location.href = finalNoteBtn.href;
        }, 650);
    });
}

window.addEventListener("resize", () => {
    window.clearTimeout(rebuildTimer);
    rebuildTimer = window.setTimeout(buildGrid, 150);
});
