precision mediump float;

// #pragma glslify: blendAdd = require(glsl-blend/add)
// #pragma glslify: blendAverage = require(glsl-blend/average)
// #pragma glslify: blendColorBurn = require(glsl-blend/color-burn)
// #pragma glslify: blendColorDodge = require(glsl-blend/color-dodge)
#pragma glslify: blendDarken = require(glsl-blend/darken)
// #pragma glslify: blendDifference = require(glsl-blend/difference)
// #pragma glslify: blendExclusion = require(glsl-blend/exclusion)
// #pragma glslify: blendGlow = require(glsl-blend/glow)
#pragma glslify: blendHardLight = require(glsl-blend/hard-light)
// #pragma glslify: blendHardMix = require(glsl-blend/hard-mix)
// #pragma glslify: blendLighten = require(glsl-blend/lighten)
// #pragma glslify: blendLinearBurn = require(glsl-blend/linear-burn)
// #pragma glslify: blendLinearDodge = require(glsl-blend/linear-dodge)
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

varying vec2 uv;

uniform sampler2D tex;
uniform float umm;
uniform float time;

void main() {
  float modtime = sin(time) * 0.25 + 0.75;

  vec2 uvl = uv;
  uvl.x += 0.5;
  vec2 uvr = uv;
  uvr.x -= 0.5;
  vec3 rgbl = texture2D(tex, uvl).rgb;
  vec3 rgbr = texture2D(tex, uvr).rgb;
  vec3 fg2 = blendDarken(rgbl, rgbr);

  vec3 bg = vec3(1.0, 0.231, 0.863);
  vec3 fg = texture2D(tex, uv).rgb;

  vec3 color = blendHardLight(bg, fg);
  color = blendHardLight(color * modtime, fg2 * modtime);

  // now apply curves
  color.r = 4.0 * pow(color.r - 0.5, 2.0);
  color.g = 4.0 * pow(color.g - 0.5, 2.0);
  color.b = 4.0 * pow(color.b - 0.5, 2.0);

  gl_FragColor = vec4(color, 1.0);
}
