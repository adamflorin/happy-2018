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

module.exports = {
  mix,
  wrapRadians,
  computeDelta
}
