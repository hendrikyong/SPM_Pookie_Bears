document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');

    createGrid(5) // start at 5x5 grid

});

function createGrid(size) {
    grid.innerHTML='';

    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    for (let i = 0; i < size * size; i++) {
        const box = document.createElement('div');
        box.classList.add('grid-box');
        box.addEventListener('click', () => {
            if (demolishMode) {
                demolishBuilding(box);
            }
            else {
                placeBuilding(box);
            }
        });
        grid.appendChild(box);
    }
}

function expandGrid(size) {
    createGrid(size);
}