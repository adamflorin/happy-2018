precision mediump float;

varying vec3 vPosition;

const float yThreshold = -5.0;
const float yGradientRange = 50.0;
const float gradient = 0.18;
const float highColor = 0.98;

void main() {
  float shade = clamp(abs(vPosition.y - yThreshold), 0.0, yGradientRange) / yGradientRange;
  shade = 1.0 - pow(1.0 - shade, 6.0);
  shade = mix(highColor - gradient, highColor, shade);
  if (vPosition.y < yThreshold) {
    shade *= 0.96;
  }
  gl_FragColor = vec4(vec3(shade), 1.0);
}
