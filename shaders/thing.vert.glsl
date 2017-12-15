// precision mediump float;

#pragma glslify: rotateY = require(glsl-y-rotate/rotateY)
#pragma glslify: snoise = require('glsl-noise/simplex/3d')

attribute vec3 position, normal;

uniform float time, angle, scale, width, height;

varying vec3 vpos;
varying vec3 vnormal;

void main() {
  vnormal = normal;

  float aspect = width / height;
  vec3 newPosition = position * scale;
  newPosition += vnormal * snoise(position) * 0.05;
  newPosition.y *= aspect;
  vpos = newPosition;
  newPosition = rotateY(angle) * newPosition;

  gl_Position = vec4(newPosition, 1.0);
}
