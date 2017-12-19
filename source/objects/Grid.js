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

  count: 6
})
