precision mediump float;

varying vec2 uv;

uniform sampler2D tex;

void main() {
  vec3 rgb = texture2D(tex, uv).xyz;
  gl_FragColor = vec4(rgb, 1.0);
}
