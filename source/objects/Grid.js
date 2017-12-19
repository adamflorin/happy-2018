import {regl} from '../global'

export default regl({
  frag: require('../../shaders/grid.frag.glsl'),
  vert: require('../../shaders/grid.vert.glsl'),

  attributes: {
    position: [ -4, -4, 4, -4, 0, 4 ] // lol render in oversized triangle
  },
  count: 3,

  blend: {
    enable: true,
    func: {
      src: 1,
      dst: 'one minus src alpha'
    }
  }
})
