import { _setColor, _setBackgroundColor, _points } from "./script.js";

let points = new Float32Array([
    -0.5, 0.5,
    0.5, 0.5,
    0.5, -0.5,
    -0.5, 0.5,
    0.5, -0.5,
    -0.5, -0.5,
]);

export function _load() {
    _setBackgroundColor([0.0, 0.0, 0.0, 1.0]);
}

export function _update(dt) {
    points[3*2 + 0] += 0.1 * dt;
    if (points[3*2 + 0] > .5) points[3*2 + 0] = -0.5;
}

export function _draw() {
    _setColor([1.0, 0.8, 0.5, 1.0]);
    _points(points);
}