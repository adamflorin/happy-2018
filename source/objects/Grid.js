import {regl} from '../global'

export default regl({
  frag: require('../../shaders/grid.frag.glsl'),
  vert: require('../../shaders/grid.vert.glsl'),

  attributes: {
    position: [
      [-1, -1], [-1, 1], [1, 1],
      [1, 1], [1, -1], [-1, -1]
    ]
  },

  blend: {
    enable: true,
    func: {
      src: 1,
      dst: 'one minus src alpha'
    }
  },

  count: 6
})
