precision mediump float;

#pragma glslify: rotate = require(glsl-y-rotate/rotateY)

const float scale = 0.5;

attribute vec3 position;

uniform float time, width, height;
uniform vec3 shadowColor, lightAColor, lightBColor;

varying vec3 surfacePosition, lightPosition;
varying vec3 vShadowColor, vLightAColor, vLightBColor;

void main() {
  // scale
  surfacePosition = position * scale;

  // aspect
  float aspect = width / height;
  surfacePosition.y *= aspect;

  // rotate
  float angle = sin(time);
  surfacePosition = rotate(angle) * surfacePosition;

  // animate light position
  lightPosition = vec3(sin(time), cos(time), -0.25);

  // pass light colors through
  vShadowColor = shadowColor;
  vLightAColor = lightAColor;
  vLightBColor = lightBColor;

  gl_Position = vec4(surfacePosition, 1.0);
}
