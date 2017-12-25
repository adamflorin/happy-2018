import icosphere from 'icosphere'
import {regl} from '../global'

const mesh = icosphere(1)

export default regl({
  frag: require('../../shaders/mote.frag.glsl'),
  vert: require('../../shaders/mote.vert.glsl'),

  attributes: {
    position: mesh.positions
  },

  elements: mesh.cells,

  uniforms: {
    time: regl.context('time'),
    width: regl.context('viewportWidth'),
    height: regl.context('viewportHeight'),
    shadowColor: regl.prop('shadowColor'),
    lightAColor: regl.prop('lightAColor'),
    lightBColor: regl.prop('lightBColor'),
    objectPosition: regl.prop('objectPosition')
  }
})
