precision mediump float;

#define M_PI 3.1415926535897932384626433832795

varying vec3 vPosition;

const float yThreshold = -5.0;
const float yGradientRange = 50.0;
const float gradient = 0.18;
const float highColor = 0.98;

void main() {
  // "gallery" shading
  float shade = clamp(abs(vPosition.y - yThreshold), 0.0, yGradientRange) / yGradientRange;
  shade = 1.0 - pow(1.0 - shade, 6.0);
  shade = mix(highColor - gradient, highColor, shade);

  // darken lower half of sphere
  if (vPosition.y < yThreshold) {
    shade *= 0.96;
  }

  // darken one side of sphere
  float unitAngle = abs(atan(vPosition.z, vPosition.x) / M_PI);
  shade *= mix(1.0, 0.3, smoothstep(0.0, 1.0, pow(unitAngle, 2.0)));

  gl_FragColor = vec4(vec3(shade), 1.0);
}
