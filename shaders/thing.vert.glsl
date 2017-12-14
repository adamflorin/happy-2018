attribute vec2 position;

uniform float angle, scale, width, height;

varying vec3 vpos;

void main() {
  float aspect = width / height;
  vpos = vec3(
    scale * (cos(angle) * position.x - sin(angle) * position.y),
    aspect * scale * (sin(angle) * position.x + cos(angle) * position.y),
    0.0
  );
  gl_Position = vec4(vpos, 1.0);
}
