const canvas = document.getElementById('drawing-area');
const canvasContext = canvas.getContext('2d');
const clearButton = document.getElementById('clear-button');
const state = {
    mousedown: false
};

const radius = 10;

canvas.addEventListener('mousedown', handleWritingStart);
canvas.addEventListener('mousemove', handleWritingInProgress);
canvas.addEventListener('mouseup', handleDrawingEnd);
canvas.addEventListener('mouseout', handleDrawingEnd);

canvas.addEventListener('touchstart', handleWritingStart);
canvas.addEventListener('touchmove', handleWritingInProgress);
canvas.addEventListener('touchend', handleDrawingEnd);

clearButton.addEventListener('click', handleClearButtonClick);

function handleWritingStart(event) {
    event.preventDefault();

    const mousePos = getMousePositionOnCanvas(event);

    clearCanvas();

    canvasContext.beginPath();
    canvasContext.arc(mousePos.x, mousePos.y, radius, 0, 2 * Math.PI, false);
    canvasContext.fillStyle = 'green';
    canvasContext.fill();
    canvasContext.lineWidth = 5;
    canvasContext.strokeStyle = '#003300';
    canvasContext.stroke();

    state.mousedown = true;
}

function handleWritingInProgress(event) {
    event.preventDefault();

    if (state.mousedown) {
        const mousePos = getMousePositionOnCanvas(event);

        clearCanvas();

        canvasContext.beginPath();
        canvasContext.arc(mousePos.x, mousePos.y, radius, 0, 2 * Math.PI, false);
        canvasContext.fillStyle = 'green';
        canvasContext.fill();
        canvasContext.lineWidth = 5;
        canvasContext.strokeStyle = '#003300';
        canvasContext.stroke();
    }
}

function handleDrawingEnd(event) {
    event.preventDefault();

    state.mousedown = false;
}

function handleClearButtonClick(event) {
    event.preventDefault();

    clearCanvas();
}

function getMousePositionOnCanvas(event) {
    const clientX = event.clientX || event.touches[0].clientX;
    const clientY = event.clientY || event.touches[0].clientY;
    const { offsetLeft, offsetTop } = event.target;
    const canvasX = clientX - offsetLeft;
    const canvasY = clientY - offsetTop;

    return { x: canvasX, y: canvasY };
}

function clearCanvas() {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
}