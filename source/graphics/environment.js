import wrapREGL from 'regl'

const regl = wrapREGL({
  extensions: ['OES_standard_derivatives']
})

module.exports = {
  regl
}
