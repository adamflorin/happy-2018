import {regl} from './environment'

export default regl({
  frag: require('../../shaders/sdf.frag.glsl'),
  vert: require('../../shaders/sdf.vert.glsl'),

  attributes: {
    position: [
      [-1, -1], [-1, 1], [1, 1],
      [1, 1], [1, -1], [-1, -1]
    ]
  },

  uniforms: {
    time: regl.context('time'),
    width: regl.context('viewportWidth'),
    height: regl.context('viewportHeight')
  },

  count: 6
})
