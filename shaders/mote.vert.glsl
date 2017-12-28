precision mediump float;

#pragma glslify: rotateY = require(glsl-y-rotate/rotateY)
#pragma glslify: rotateX = require(glsl-y-rotate/rotateX)

attribute vec3 position;

uniform float time, width, height, scale;
uniform vec3 shadowColor, lightAColor, lightBColor;
uniform vec2 objectPosition;

varying vec3 surfacePosition, lightPosition;
varying vec3 vShadowColor, vLightAColor, vLightBColor;

void main() {
  // scale
  surfacePosition = position * scale;
  surfacePosition.x += objectPosition.x;
  surfacePosition.y += objectPosition.y;

  // aspect
  float aspect = width / height;
  surfacePosition.y *= aspect;

  // rotate
  surfacePosition = rotateY(objectPosition.x) * surfacePosition;
  surfacePosition = rotateX(-objectPosition.y) * surfacePosition;

  // animate light position
  lightPosition = vec3(sin(time), cos(time), -0.0);

  // pass light colors through
  vShadowColor = shadowColor;
  vLightAColor = lightAColor;
  vLightBColor = lightBColor;

  gl_Position = vec4(surfacePosition, 1.0);
}
