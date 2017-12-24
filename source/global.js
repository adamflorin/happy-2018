import reglModule from 'regl'
import cameraModule from 'regl-camera'

const regl = reglModule({
  extensions: ['OES_standard_derivatives']
})

const camera = cameraModule(regl, {distance: 3})

module.exports = {
  regl,
  camera
}
