precision mediump float;

#pragma glslify: snoise = require('glsl-noise/simplex/3d')

varying vec2 uv;

uniform sampler2D tex;
uniform float time;

void main() {
  vec3 rgb = texture2D(tex, uv).xyz;
  float noiseValue = snoise(vec3(uv * 500.0, time * 2.0));
  noiseValue = pow(noiseValue, 5.0);
  rgb = max(rgb, noiseValue);
  gl_FragColor = vec4(rgb, 1.0);
}
