precision mediump float;

varying vec3 vColor, vPosition;

const float pi = 3.1415;

void main() {
  vec3 color = vColor;

  float yPlanAngle = atan(vPosition.z, vPosition.x);
  if (
    (mod(yPlanAngle, pi / 16.0) < 0.003) &&
    (mod(abs(vPosition.y), 0.1) < 0.003)
  ) {
    color += 0.4;
  }

  gl_FragColor = vec4(color, 1.0);
}
