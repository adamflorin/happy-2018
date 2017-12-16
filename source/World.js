import {regl, camera} from './global'
import drawLump from './objects/Lump'
import drawSdf from './objects/Sdf'

regl.frame(() => {
  regl.clear({
    color: [0.15, 0.15, 0.15, 1.0],
    depth: true
  })
  camera(() => {
    drawSdf()

    // drawLump({
    //   scale: 0.3,
    //   speed: 0.005
    // })
  })
})
