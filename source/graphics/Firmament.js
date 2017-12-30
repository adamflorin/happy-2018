import icosphere from 'icosphere'
import {regl} from '../global'

const mesh = icosphere(1)

export default regl({
  frag: require('../../shaders/firmament.frag.glsl'),
  vert: require('../../shaders/firmament.vert.glsl'),

  attributes: {
    position: mesh.positions
  },
  elements: mesh.cells,

  uniforms: {
    zenithColor: regl.prop('zenithColor'),
    horizonColor: regl.prop('horizonColor')
  },

  cull: {
    enable: true,
    face: 'back'
  },
  frontFace: 'cw',
})
