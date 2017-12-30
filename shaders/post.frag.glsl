precision mediump float;

// #pragma glslify: blendAdd = require(glsl-blend/add)
// #pragma glslify: blendAverage = require(glsl-blend/average)
// #pragma glslify: blendColorBurn = require(glsl-blend/color-burn)
// #pragma glslify: blendColorDodge = require(glsl-blend/color-dodge)
// #pragma glslify: blendDarken = require(glsl-blend/darken)
// #pragma glslify: blendDifference = require(glsl-blend/difference)
// #pragma glslify: blendExclusion = require(glsl-blend/exclusion)
// #pragma glslify: blendGlow = require(glsl-blend/glow)
// #pragma glslify: blendHardLight = require(glsl-blend/hard-light)
// #pragma glslify: blendHardMix = require(glsl-blend/hard-mix)
// #pragma glslify: blendLighten = require(glsl-blend/lighten)
// #pragma glslify: blendLinearBurn = require(glsl-blend/linear-burn)
#pragma glslify: blendLinearDodge = require(glsl-blend/linear-dodge)
// #pragma glslify: blendLinearLight = require(glsl-blend/linear-light)
// #pragma glslify: blendMultiply = require(glsl-blend/multiply)
// #pragma glslify: blendNegation = require(glsl-blend/negation)
// #pragma glslify: blendNormal = require(glsl-blend/normal)
// #pragma glslify: blendOverlay = require(glsl-blend/overlay)
// #pragma glslify: blendPhoenix = require(glsl-blend/phoenix)
// #pragma glslify: blendPinLight = require(glsl-blend/pin-light)
// #pragma glslify: blendReflect = require(glsl-blend/reflect)
// #pragma glslify: blendScreen = require(glsl-blend/screen)
// #pragma glslify: blendSoftLight = require(glsl-blend/soft-light)
// #pragma glslify: blendSubtract = require(glsl-blend/subtract)
// #pragma glslify: blendVividLight = require(glsl-blend/vivid-light)

#pragma glslify: grain = require(glsl-film-grain)
#pragma glslify: luma = require(glsl-luma)

const float zoom = 2.0;

varying vec2 uv;

uniform sampler2D tex;
uniform float time, width, height;

void main() {
  vec2 resolution = vec2(width, height);

  vec3 texColor = texture2D(tex, uv).rgb;

  // // apply grain
  // vec3 grain = vec3(grain(uv, resolution * zoom, time));
  // vec3 color = blendLinearDodge(texColor, grain);

  float brightness = clamp(pow(luma(texColor) * 1.5, 3.0), 0.0, 1.0);

  gl_FragColor = vec4(vec3(brightness), 1.0);
}