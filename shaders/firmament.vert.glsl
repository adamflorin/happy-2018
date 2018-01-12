precision mediump float;

#define M_PI 3.1415926535897932384626433832795

#pragma glslify: rotateY = require(glsl-y-rotate/rotateY)

attribute vec3 position;

uniform mat4 projection, view;
uniform float time, rotationPeriod;

varying vec3 vPosition;

const float scale = 100.0;

void main() {
  vec3 scalePosition = position * scale;

  vPosition = scalePosition;

  scalePosition = rotateY((time / rotationPeriod) * (M_PI * 2.0)) * scalePosition;

  gl_Position = projection * view * vec4(scalePosition, 1.0);
}
