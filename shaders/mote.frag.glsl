#extension GL_OES_standard_derivatives : enable

precision mediump float;

#pragma glslify: hsl2rgb = require(glsl-hsl2rgb)

varying float vDistanceToCenter, vHue;
varying vec3 surfacePosition, lightPosition;
varying vec3 vShadowColor, vLightAColor, vLightBColor;

float lambert(vec3 lightPosition, vec3 normal);

void main() {
  vec3 fdx = dFdx(surfacePosition);
  vec3 fdy = dFdy(surfacePosition);
  vec3 normal = normalize(cross(fdx, fdy));

  float value1 = lambert(lightPosition, normal);

  vec3 light2Position = vec3(-lightPosition.x, -lightPosition.y, lightPosition.z);
  float value2 = lambert(light2Position, normal);

  vec3 color = hsl2rgb(vHue, 0.9, 0.6);
  color = mix(color, vLightAColor, vec3(value1, value1, value1));
  color = mix(color, vLightBColor, vec3(value2, value2, value2));

  float alpha = 0.6 + vDistanceToCenter * 0.4;

  gl_FragColor = vec4(color, alpha);
}

float lambert(vec3 lightPosition, vec3 normal) {
  vec3 lightDirection = normalize(lightPosition - surfacePosition);
  float value = max(0.0, dot(lightDirection, normal));

  // now make effect more subtle
  return mix(0.0, 0.2, value);
}
