precision mediump float;

#pragma glslify: rotateY = require(glsl-y-rotate/rotateY)
#pragma glslify: rotateX = require(glsl-y-rotate/rotateX)

attribute vec3 position;
attribute float distortion;

uniform mat4 projection, view;
uniform float time, scale;
uniform vec3 baseColor, lightAColor, lightBColor;
uniform vec2 objectPosition;

varying float vDistanceToCenter, vDistortion;
varying vec3 surfacePosition, lightPosition;
varying vec3 vBaseColor, vLightAColor, vLightBColor;

const float reverseLimit = 2.0;

void main() {
  vDistanceToCenter = distance(objectPosition, vec2(0.0));
  vDistortion = distortion;
  vBaseColor = baseColor;

  // scale
  surfacePosition = position * scale;

  // distort
  surfacePosition *= 1.0 + vec3(distortion * vDistanceToCenter * 5.0);

  // rotate
  surfacePosition = rotateY(objectPosition.x) * surfacePosition;
  surfacePosition = rotateX(-objectPosition.y) * surfacePosition;

  // translate
  surfacePosition.x += (objectPosition.x * reverseLimit);
  surfacePosition.z -= (objectPosition.y * reverseLimit);

  // light position
  lightPosition = vec3(0.0, 0.0, 5.0);

  // pass light colors through
  vLightAColor = lightAColor;
  vLightBColor = lightBColor;

  gl_Position = projection * view * vec4(surfacePosition, 1.0);
}
