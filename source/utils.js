function floatColor(intColor) {
  if (typeof intColor === 'string') {
    const matches = intColor.match(/#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/)
    intColor = matches.slice(1, 4).map(string => parseInt(string, 16))
  }
  return intColor.map(value => value / 255.0)
}

function lerp(from, to, alpha) {
  return from + (to - from) * alpha
}

function mix(from, to, mix) {
  return (mix * from) + ((1.0 - mix) * to)
}

function wrapRadians(radians) {
  radians = radians % (Math.PI * 2.0)
  if (radians > Math.PI) {
    radians -= Math.PI * 2.0
  }
  return radians
}

function computeDelta(force) {
  return {
    x: Math.cos(force.angle) * force.magnitude,
    y: Math.sin(force.angle) * force.magnitude
  }
}

function normalize(vector) {
  if (vector.x === 0.0 && vector.y === 0.0) {
    return {x: 0.0, y: 0.0}
  }
  const vectorMagnitude = magnitude(vector)
  return {
    x: vector.x / vectorMagnitude,
    y: vector.y / vectorMagnitude
  }
}

function magnitude(vector) {
  return Math.sqrt(vector.x * vector.x + vector.y * vector.y)
}

function angle(vector) {
  return Math.atan2(vector.y, vector.x)
}

function dot(vectorA, vectorB) {
  return vectorA.x * vectorB.x + vectorA.y * vectorB.y
}

module.exports = {
  floatColor,
  lerp,
  mix,
  wrapRadians,
  computeDelta,
  normalize,
  magnitude,
  angle,
  dot
}
