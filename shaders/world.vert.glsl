precision mediump float;

attribute vec2 position;

varying vec2 uv;

void main() {
  uv = 0.5 * (position + 1.0);
  gl_Position = vec4(position, 0, 1);
}
