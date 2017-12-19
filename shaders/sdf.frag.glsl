precision mediump float;

uniform float time, width, height;

const vec3 up = vec3(0.0, 1.0, 0.0);

vec2 doModel(vec3 p);

#pragma glslify: getNormal = require('glsl-sdf-normal', map = doModel)
#pragma glslify: raytrace  = require('glsl-raytrace', map = doModel, steps = 90)
#pragma glslify: camera    = require('glsl-turntable-camera')
#pragma glslify: sphere = require('glsl-sdf-sphere')
#pragma glslify: opU 	= require('glsl-sdf-ops/union')

vec2 doModel(vec3 position) {
  const float spacing = 0.4;
  float radius1 = mix(0.8, 0.9, abs(4.0 * mod(time * 0.8, 0.5) - 1.0));
  float radius2 = mix(0.8, 0.9, abs(4.0 * mod(time * 0.8 + 0.2, 0.5) - 1.0));

  position.x -= spacing;

  vec3 position2 = position;
  position2.x += spacing * 2.0;

  return opU(
    vec2(sphere(position, radius1), 0.0),
    vec2(sphere(position2, radius2), 1.0)
  );
}

void main() {
  vec4 color = vec4(0.1, 0.1, 0.1, 1.0);
  vec3 rayOrigin, rayDirection;

  vec2 iResolution = vec2(width, height);
  float angle  = time * 1.75;
  float height = 0.5;
  float dist   = 3.0;
  camera(angle, height, dist, iResolution, rayOrigin, rayDirection);

  vec2 t = raytrace(rayOrigin, rayDirection);
  if (t.x > -0.5) {
    vec3 pos = rayOrigin + t.x * rayDirection;
    vec3 nor = getNormal(pos, 0.1);
    float value = dot(nor, up);
    value = mix(0.3, 0.9, value);
    color = vec4(value, value, value, 1.0);
  }

  gl_FragColor = color;
}
