import icosphere from 'icosphere'
import {regl} from './environment'

const mesh = icosphere(1)

const distortions = []
mesh.positions.forEach(position => {
  distortions.push(Math.random())
})

export default regl({
  frag: require('../../shaders/mote.frag.glsl'),
  vert: require('../../shaders/mote.vert.glsl'),

  attributes: {
    position: mesh.positions,
    distortion: distortions,
  },
  elements: mesh.cells,

  uniforms: {
    time: regl.context('time'),
    hue: regl.prop('hue'),
    lightAColor: regl.prop('lightAColor'),
    lightBColor: regl.prop('lightBColor'),
    objectPosition: regl.prop('objectPosition'),
    scale: regl.prop('scale')
  },

  blend: {
    enable: true,
    func: {
      src: 'src alpha',
      dst: 'one minus src alpha'
    },
    equation: 'add'
  }
})
