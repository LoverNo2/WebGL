import * as webglUtils from '../node_modules/webgl-utils.js/es/index.js'

function createShader(gl, type, source) {
  var shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (success) {
    return shader
  }

  console.log(gl.getShaderInfoLog(shader))
  gl.deleteShader(shader)
}

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  var success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (success) {
    return program
  }

  console.log(gl.getProgramInfoLog(program))
  gl.deleteProgram(program)
}

function main() {
  var canvas = document.querySelector('#webglCanvas')
  var gl = canvas.getContext('webgl')

  var vertexShaderSource = document.querySelector('#vertex-shader-2d').text
  var fragmentShaderSource = document.querySelector('#fragment-shader-2d').text
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

  var program = createProgram(gl, vertexShader, fragmentShader)
  gl.useProgram(program)

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
  // gl.bufferData 将顶点数据 [0, 0, 0, 0.5, 0.7, 0] 传入GPU
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 0, 0.5, 0.7, 0]), gl.STATIC_DRAW)

  webglUtils.resizeCanvasToDisplaySize(gl.canvas)
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  var positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
  gl.enableVertexAttribArray(positionAttributeLocation)

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2 // 2 components per iteration
  var type = gl.FLOAT // the data is 32bit floats
  var normalize = false // don't normalize the data
  var stride = 0 // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0 // start at the beginning of the buffer
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)
  // 核心功能是​​建立 ​​顶点缓冲区对象（VBO）数据与着色器属性间的映射关系​​，通过参数精细化控制数据解析方式（类型、步长、归一化等）

  gl.drawArrays(gl.TRIANGLES, 0, 3)
  // - 1.从绑定的缓冲区中按指定顺序读取顶点数据
  // - 2.为每个顶点执行顶点着色器
  // - 3.基于指定的图元类型（三角形）组装顶点
  // - 4.为每个片段执行片段着色器
  // - 5.最终将结果渲染到画布上
}

main()
