precision mediump float;

uniform float time;

varying vec2 uv;

const float NUM_COLUMNS = 20.0;
const float MOD_BY = 1.0 / NUM_COLUMNS;

void main () {
  float modtime = sin(time);
  float modtime2 = cos(time + 0.7);

  float value = length(vec2(uv.x - 0.5, uv.y - 0.5)) * 1.5;
  // value = pow(value, 2.0);

  vec3 color = vec3(value); //clamp(0.0, 1.0, value + 0.1));
  color = smoothstep(0.0, 1.0, color + 0.2);
  color.r = pow(color.r, 3.0 * modtime);
  color.b = pow(color.b, 7.0 * modtime2);

  // color = pow(color, 3.0);
  color = clamp(color + 0.1, 0.0, 1.0);

  gl_FragColor = vec4(color, 1.0);
}
