precision mediump float;

attribute vec3 position;

uniform mat4 projection, view;

varying vec3 vPosition;

const float scale = 100.0;

void main() {
  vec3 scalePosition = position * scale;

  vPosition = scalePosition;

  gl_Position = projection * view * vec4(scalePosition, 1.0);
}
