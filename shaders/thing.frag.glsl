precision mediump float;

#pragma glslify: noise = require('glsl-noise/simplex/3d')

varying vec3 vpos;

void main () {
  float value = noise(vpos * 255.0);
  gl_FragColor = vec4(value, value, value, 1.0);
}
