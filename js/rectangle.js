import * as webglUtils from '../node_modules/webgl-utils.js/es/index.js'

function main() {
  let gl = document.querySelector('#webglCanvas').getContext('webgl')

  webglUtils.resizeCanvasToDisplaySize(gl.canvas)
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  let program = webglUtils.createProgramFromScripts(gl, ['vertex-shader-2d', 'fragment-shader-2d'])
  gl.useProgram(program)

  let positionAttributeLocation = gl.getAttribLocation(program, 'a_position')

  let resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution')
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height)

  let colorUniformLocation = gl.getUniformLocation(program, 'u_color')

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(positionAttributeLocation)

  for (let i = 0; i < 70; ++i) {
    setRectangle(gl, randomInt(gl.canvas.width / 3), randomInt(gl.canvas.height / 3))
    gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }
}

function randomInt(range) {
  return Math.floor(Math.random() * range)
}

function setRectangle(gl, width, height) {
  let x1 = randomInt(gl.canvas.width - width)
  let y1 = randomInt(gl.canvas.height - height)
  let x2 = x1 + width
  let y2 = y1 + height
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
    gl.STATIC_DRAW
  )
}

main()
