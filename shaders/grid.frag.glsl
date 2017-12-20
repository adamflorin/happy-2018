precision mediump float;

uniform float time;

varying vec2 uv;

const float NUM_COLUMNS = 20.0;
const float MOD_BY = 1.0 / NUM_COLUMNS;

void main () {
  // float value = mod(uv.x,  MOD_BY) < (MOD_BY * 0.5) ? 1.0 : 0.0;
  float value = mod(uv.x + time * 0.1,  MOD_BY) * (NUM_COLUMNS / 2.0);
  value = 1.0 - pow(1.0 - value, 3.0);
  gl_FragColor = vec4(value, 0.0, 0.0, value);
}
