const canvas = document.getElementById('drawing-area');
const canvasContext = canvas.getContext('2d');

const state = {
    mousedown: false
};

let selected = 0;
let affine = 1;

let n = 4;
let x = [];
x[0] = new Complex(1, 0);
x[1] = new Complex(0, 1);
x[2] = new Complex(1, 1);
x[3] = new Complex(1, -1);
x[4] = new Complex(0, -1);

function normalizeProj(y) {
    let norm = 0;
    for (let c of y) norm += c.abs();
    
    if (norm == 0) { throw "null norm" }
    for (let c of y) c = c.div(norm);
}

const sizes = [5, 5, 5, 5, 5]
const colors = [
    'rgba(245, 228, 39, 1)',
    'rgba(245, 129, 39, 1)',
    'rgba(39, 245, 99, 1)',
    'rgba(39, 172, 245, 1)',
    'rgba(245, 39, 103, 1)'
]

function drawSpecial() {
    const specials = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]];
    for (let p of specials) {
        let [sx, sy] = coordToScreen(p[0], p[1]);
        canvasContext.beginPath();
        canvasContext.arc(sx, sy, 2, 0, 2 * Math.PI, false);
        canvasContext.fillStyle = 'rgba(255, 255, 255, 1)';
        canvasContext.fill();
    }
}

function drawAffine(y, i) {
    for (let j = 0; j <= n; j++) {
        if (j !== i) {
            const yj = y[j].div(y[i]);
            let [sx, sy] = coordToScreen(yj.re, yj.im);
            const radius = (j === selected) ? 1.4*sizes[j] : sizes[j];
            canvasContext.beginPath();
            canvasContext.arc(sx, sy, radius, 0, 2 * Math.PI, false);
            canvasContext.fillStyle = colors[j];
            canvasContext.fill();
            canvasContext.font = (j === selected) ? "20px Arial" : "15px Arial";
            canvasContext.fillText(j.toString(), sx, sy-5);
        }
    }
}

function drawPoints(y) {
    clearCanvas();
}

addEventListener('keydown', handleKey);

canvas.addEventListener('mousedown', handleWritingStart);
canvas.addEventListener('mousemove', handleWritingInProgress);
canvas.addEventListener('mouseup', handleDrawingEnd);
canvas.addEventListener('mouseout', handleDrawingEnd);

canvas.addEventListener('touchstart', handleWritingStart);
canvas.addEventListener('touchmove', handleWritingInProgress);
canvas.addEventListener('touchend', handleDrawingEnd);

function handleKey(e) {
    for (let i = 0; i <= n; i++) {
        if (i.toString().localeCompare(e.key) === 0 && x[i].abs() > 0){
            affine = i;
            break;
        }
    }

    if (e.key.localeCompare('p') === 0) selected = 0;
    if (e.key.localeCompare('q') === 0) selected = 1;
    if (e.key.localeCompare('w') === 0) selected = 2;
    if (e.key.localeCompare('e') === 0) selected = 3;
    if (e.key.localeCompare('r') === 0) selected = 4;

    draw();
}

function draw() {
    clearCanvas();
    drawAffine(x, affine);
    drawSpecial();
}

function handleWritingStart(event) {
    event.preventDefault();

    state.mousedown = true;
    state.previous = getMousePositionOnCanvas(event);

    draw();
}

function handleWritingInProgress(event) {
    event.preventDefault();

    if (state.mousedown) {
        const mousePos = getMousePositionOnCanvas(event);

        if (affine !== selected) {
            const dx = (mousePos.x - state.previous.x) / scale;
            const dy = - (mousePos.y - state.previous.y) / scale;
            x[selected] = x[selected].add(x[affine].mul(Complex(dx, dy)));
        }

        state.previous = mousePos;

        draw();
    }
}

function handleDrawingEnd(event) {
    event.preventDefault();

    if (state.mousedown) {
        draw();
    }

    state.mousedown = false;
}

function clearCanvas() {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
}

const scale = 100;

function coordToScreen(cx, cy) {
    const sx = canvas.width / 2 + cx * scale;
    const sy = canvas.height / 2 - cy * scale;
    return [sx, sy];
}

function screenToCoord(sx, sy) {
    const cx = ( sx - canvas.width / 2 ) / scale;
    const cy = ( canvas.height / 2 - sy ) / scale;
    return [cx, cy];
}

function getMousePositionOnCanvas(event) {
    const clientX = event.clientX || event.touches[0].clientX;
    const clientY = event.clientY || event.touches[0].clientY;
    const { offsetLeft, offsetTop } = event.target;
    const canvasX = clientX - offsetLeft;
    const canvasY = clientY - offsetTop;

    return { x: canvasX, y: canvasY };
}