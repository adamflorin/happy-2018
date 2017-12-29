precision mediump float;

attribute vec3 position;

uniform mat4 projection, view;
uniform vec3 zenithColor, horizonColor;

varying vec3 vColor;

const float scale = 5.0;

void main() {
  vec3 scalePosition = position * scale;

  float gradient = abs(position.y);
  gradient = pow(gradient, 2.0);
  vColor = mix(zenithColor, horizonColor, vec3(gradient));

  gl_Position = projection * view * vec4(scalePosition, 1.0);
}
