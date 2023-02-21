const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

window.addEventListener('resize', resizeCanvas, false);

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    context.rect(20, 20, 150, 100);
    context.stroke();
}

resizeCanvas();