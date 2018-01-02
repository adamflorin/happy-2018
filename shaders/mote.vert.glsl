precision mediump float;

#pragma glslify: rotateY = require(glsl-y-rotate/rotateY)
#pragma glslify: rotateX = require(glsl-y-rotate/rotateX)

attribute vec3 position;

uniform mat4 projection, view;
uniform float time, scale;
uniform vec3 shadowColor, lightAColor, lightBColor;
uniform vec2 objectPosition;

varying vec3 surfacePosition, lightPosition;
varying vec3 vShadowColor, vLightAColor, vLightBColor;

const float reverseLimit = 2.0;

void main() {
  float distanceToCenter = distance(objectPosition, vec2(0.0));

  // scale
  surfacePosition = position * (scale * (distanceToCenter + 0.4));

  // rotate
  surfacePosition = rotateY(objectPosition.x) * surfacePosition;
  surfacePosition = rotateX(-objectPosition.y) * surfacePosition;

  // translate
  surfacePosition.x += (objectPosition.x * reverseLimit);
  surfacePosition.z -= (objectPosition.y * reverseLimit);

  // light position
  lightPosition = vec3(0.0, 0.0, 1.0);

  // pass light colors through
  vShadowColor = shadowColor;
  vLightAColor = lightAColor;
  vLightBColor = lightBColor;

  gl_Position = projection * view * vec4(surfacePosition, 1.0);
}
