import reglModule from 'regl'

const regl = reglModule()

var drawSpinningStretchyTriangle = regl({
  frag: `
  void main() {
    gl_FragColor = vec4(1, 0, 0, 1);
  }`,

  vert: `
  attribute vec2 position;
  uniform float angle, scale, width, height;
  void main() {
    float aspect = width / height;
    gl_Position = vec4(
      scale * (cos(angle) * position.x - sin(angle) * position.y),
      aspect * scale * (sin(angle) * position.x + cos(angle) * position.y),
      0,
      1.0);
  }`,

  attributes: {
    position: [[0, -1], [-1, 0], [1, 1]]
  },

  uniforms: {
    angle: (context, props) => props.speed * context.tick,
    scale: regl.prop('scale'),
    width: regl.context('viewportWidth'),
    height: regl.context('viewportHeight'),
  },

  count: 3
})

regl.frame(() => {
  regl.clear({
    color: [0, 0, 0, 1]
  })
  drawSpinningStretchyTriangle({
    scale: 0.2,
    speed: 0.02
  })
})
