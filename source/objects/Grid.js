import {regl} from '../global'

export default regl({
  frag: require('../../shaders/grid.frag.glsl'),
  vert: require('../../shaders/grid.vert.glsl'),

  attributes: {
    position: [
      [-1, 0, -1], [-1, 0, 1], [1, 0, 1],
      [1, 0, 1], [1, 0, -1], [-1, 0, -1]
    ]
  },
  count: 6,

  uniforms: {
    color: [0.0, 0.0, 0.5]
  },

  blend: {
    enable: true,
    func: {
      src: 1,
      dst: 'one minus src alpha'
    }
  }
})
