import { _load, _update, _draw } from "./main.js";

let gl = null;
let glCanvas = null;

// Aspect ratio and coordinate system
// details

let aspectRatio;
let scalingFactor;
let globalColor = [1.0, 1.0, 1.0, 1.0];
let bgColor = [0.0, 0.0, 0.0, 1.0];

export function _setColor(color) {
    globalColor = color;
}

export function _setBackgroundColor(color) {
    bgColor = color;
}

let dt = 1/60;

// Rendering data shared with the
// scalers.

let uScalingFactor;
let uGlobalColor;
let aVertexPosition;

// Animation timing

let shaderProgram;
let previousTime = 0.0;

const default_vertex_shader = `
    attribute vec2 aVertexPosition;

    uniform vec2 uScalingFactor;

    void main(void) {
        gl_Position = vec4(aVertexPosition * uScalingFactor, 0.0, 1.0);
    }
`;

const default_fragment_shader = `
    uniform highp vec4 uGlobalColor;

    void main() {
        gl_FragColor = uGlobalColor;
    }
`;

window.addEventListener("load", startup, false);

function startup() {
    glCanvas = document.getElementById("glcanvas");
    gl = glCanvas.getContext("webgl");

    const shaderSet = [
        {
            type: gl.VERTEX_SHADER,
            code: default_vertex_shader,
        },
        {
            type: gl.FRAGMENT_SHADER,
            code: default_fragment_shader,
        },
    ];

    shaderProgram = buildShaderProgram(shaderSet);

    aspectRatio = glCanvas.width / glCanvas.height;
    scalingFactor = [1.0, aspectRatio];

    _load();

    loop();
}


function buildShaderProgram(shaderInfo) {
    const program = gl.createProgram();

    shaderInfo.forEach((desc) => {
        const shader = compileShader(desc.code, desc.type);

        if (shader) {
            gl.attachShader(program, shader);
        }
    });

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log("Error linking shader program:");
        console.log(gl.getProgramInfoLog(program));
    }

    return program;
}

function compileShader(code, type) {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, code);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log(
            `Error compiling ${
                type === gl.VERTEX_SHADER ? "vertex" : "fragment"
            } shader:`
        );
        console.log(gl.getShaderInfoLog(shader));
    }
    return shader;
}


export function _points(vertexArray) {
    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STREAM_DRAW);

    let vertexNumComponents = 2;
    let vertexCount = vertexArray.length / vertexNumComponents;

    gl.useProgram(shaderProgram);

    uScalingFactor = gl.getUniformLocation(shaderProgram, "uScalingFactor");
    uGlobalColor = gl.getUniformLocation(shaderProgram, "uGlobalColor");

    gl.uniform2fv(uScalingFactor, scalingFactor);
    gl.uniform4fv(uGlobalColor, globalColor);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    aVertexPosition = gl.getAttribLocation(shaderProgram, "aVertexPosition");

    gl.enableVertexAttribArray(aVertexPosition);
    gl.vertexAttribPointer(
        aVertexPosition,
        vertexNumComponents,
        gl.FLOAT,
        false,
        0,
        0
    );

    gl.drawArrays(gl.POINTS, 0, vertexCount);

    gl.deleteBuffer(vertexBuffer);
}

function loop() {
    gl.viewport(0, 0, glCanvas.width, glCanvas.height);
    gl.clearColor(bgColor[0], bgColor[1], bgColor[2], bgColor[3]);
    gl.clear(gl.COLOR_BUFFER_BIT);

    _update(dt)
    _draw()

    requestAnimationFrame((currentTime) => {
        dt = (currentTime - previousTime) / 1000.0;
        previousTime = currentTime;
        loop();
    });
}