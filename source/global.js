import reglModule from 'regl'
import cameraModule from 'regl-camera'

const regl = reglModule()
const camera = cameraModule(regl, {distance: 3})

module.exports = {
  regl,
  camera
}
