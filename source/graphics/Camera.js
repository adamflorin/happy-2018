import identity from 'gl-mat4/identity'
import lookAt from 'gl-mat4/lookAt'
import perspective from 'gl-mat4/perspective'
import {regl} from '../global'

let eye = [0.0, 0.0, 3.0]
let center = [0.0, 0.0, 0.0]
let up = [0.0, 1.0, 0.0]
let view = identity(new Float32Array(16))

let fovy = Math.PI / 4.0
let near = 0.01
let far = 1000.0
let projection = identity(new Float32Array(16))

export default regl({
  uniforms: {
    view: (context, props) => {
      return lookAt(
        view,
        props.eye || eye,
        props.center || center,
        props.up || up
      )
    },
    projection: (context, props) => {
      const aspect = context.viewportWidth / context.viewportHeight
      return perspective(
        projection,
        props.fovy || fovy,
        aspect,
        props.near || near,
        props.far || far
      )
    }
  }
})
