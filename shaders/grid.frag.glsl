precision mediump float;

uniform float time;

varying vec2 uv;

const float NUM_COLUMNS = 20.0;
const float MOD_BY = 1.0 / NUM_COLUMNS;

void main () {
  float value = 1.0 - clamp(0.0, 1.0, length(vec2(uv.x - 0.5, uv.y - 0.5)));
  value = pow(value, 3.0);

  gl_FragColor = vec4(value, 0.0, 0.0, value);
}
