import {regl, camera} from './global'
import drawLump from './objects/Lump'

regl.frame(() => {
  regl.clear({
    color: [0.15, 0.15, 0.15, 1.0],
    depth: true
  })
  camera(() => {
    drawLump({
      scale: 0.5,
      speed: 0.005
    })
  })
})
