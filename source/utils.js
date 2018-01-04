function mix(from, to, mix) {
  return (from * mix) + (1.0 - mix) * to
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

function dot(vectorA, vectorB) {
  return vectorA.x * vectorB.x + vectorA.y * vectorB.y
}

module.exports = {
  mix,
  wrapRadians,
  computeDelta,
  normalize,
  magnitude,
  dot
}
