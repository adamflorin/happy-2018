import icosphere from 'icosphere'
import angleNormals from 'angle-normals'
import {regl} from '../global'

const mesh = icosphere(5)
const normals = angleNormals(mesh.cells, mesh.positions)

export default regl({
  frag: require('../../shaders/lump.frag.glsl'),
  vert: require('../../shaders/lump.vert.glsl'),

  attributes: {
    position: mesh.positions,
    normal: normals
  },

  elements: mesh.cells,

  uniforms: {
    angle: (context, props) => {
      return props.speed * context.tick
    },
    time: regl.context('time'),
    scale: regl.prop('scale'),
    width: regl.context('viewportWidth'),
    height: regl.context('viewportHeight'),
  }
})
