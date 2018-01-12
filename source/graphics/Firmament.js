import icosphere from 'icosphere'
import {regl} from './environment'

const mesh = icosphere(1)

export default regl({
  frag: require('../../shaders/firmament.frag.glsl'),
  vert: require('../../shaders/firmament.vert.glsl'),

  attributes: {
    position: mesh.positions
  },
  elements: mesh.cells,

  uniforms: {
    time: regl.context('time'),
    rotationPeriod: regl.prop('rotationPeriod')
  },

  cull: {
    enable: true,
    face: 'back'
  },
  frontFace: 'cw',
})
