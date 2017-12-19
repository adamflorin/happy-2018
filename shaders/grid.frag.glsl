precision mediump float;

varying vec2 uv;

void main () {
  float value = mod(uv.x,  0.01) < 0.001 ? 1.0 : 0.0;

  gl_FragColor = vec4(value, value, value, 1.0);
}
