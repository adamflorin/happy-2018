precision mediump float;

const float zoom = 2.0;

varying vec2 uv;

uniform sampler2D tex;
uniform float time, width, height;

void main() {
  vec2 resolution = vec2(width, height);

  vec3 texColor = texture2D(tex, uv).rgb;

  gl_FragColor = vec4(vec3(texColor), 1.0);
}
