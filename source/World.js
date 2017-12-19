import {regl, camera} from './global'
import drawLump from './objects/Lump'

regl.frame(() => {
  regl.clear({
    color: [0.15, 0.15, 0.15, 1.0],
    depth: true
  })
  camera(() => {
    drawLump([
      {
        scale: 0.3,
        speed: 0.005
      },
      {
        scale: 0.3,
        speed: -0.002
      },
      {
        scale: 0.3,
        speed: 0.009
      }
    ])
  })
})
