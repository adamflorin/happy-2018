precision mediump float;

#pragma glslify: snoise = require('glsl-noise/simplex/3d')

varying vec3 vpos, vnormal;

void main () {
  float combo = vnormal.x * vnormal.y * vnormal.z;
  combo = 1.0 - pow((1.0 - combo), 10.0);

  float noiseValue = snoise(vpos * 80.0);
  noiseValue = clamp(pow(noiseValue, 5.0) * 2.0, 0.0, 1.0);
  combo *= noiseValue;

  gl_FragColor = vec4(combo, combo, combo, 1.0);
}
