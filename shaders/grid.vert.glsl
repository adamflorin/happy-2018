precision mediump float;

attribute vec3 position;

uniform mat4 projection, view;

void main() {
  gl_Position = projection * view * vec4(position, 1.0);
}
