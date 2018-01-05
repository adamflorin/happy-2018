import identity from 'gl-mat4/identity'
import lookAt from 'gl-mat4/lookAt'
import perspective from 'gl-mat4/perspective'
import {regl} from './environment'

let eye = [0.0, 0.5, 3.0]
let center = [0.0, 0.0, 0.0]
let up = [0.0, 1.0, 0.0]
let viewMatrix = identity(new Float32Array(16))

let fovy = Math.PI / 4.0
let near = 0.01
let far = 1000.0
let projectionMatrix = identity(new Float32Array(16))

const seeThroughCamera = regl({
  uniforms: {
    view: (context, props) => {
      eye = props.eye || eye
      center = props.center || center
      up = props.up || up
      viewMatrix = lookAt(viewMatrix, eye, center, up)
      return viewMatrix
    },
    projection: (context, props) => {
      const aspect = context.viewportWidth / context.viewportHeight
      projectionMatrix = perspective(
        projectionMatrix,
        props.fovy || fovy,
        aspect,
        props.near || near,
        props.far || far
      )
      return projectionMatrix
    }
  }
})

module.exports = {
  seeThroughCamera,
  viewMatrix,
  projectionMatrix,
  eye
}
