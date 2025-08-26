import * as webglUtils from '../node_modules/webgl-utils.js/es/index.js'

function main() {
  var gl = document.querySelector('#webglCanvas').getContext('webgl')

  var program = webglUtils.createProgramFromScripts(gl, ['vertex-shader-2d', 'fragment-shader-2d'])
  gl.useProgram(program)

  var positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
  // 取得逻辑通道编号index
  var resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution')
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height)

  var positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  var positions = [10, 20, 980, 20, 10, 680, 10, 690, 980, 30, 980, 690]
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

  webglUtils.resizeCanvasToDisplaySize(gl.canvas)
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  // 这个脚本中没有显示地创建VAO（Vertex Array Object），使用的是默认VAO，VAO 主要包含以下配置状态：
  // - 1.​​绑定的 VBO（Vertex Buffer Object）​​
  // 存储实际顶点数据（位置、颜色、法线等），VAO 通过引用 VBO 的 ID(由gl.createBuffer()返回) 关联数据源
  // - 2.​​绑定的 EBO（Element Buffer Object，可选）​​
  // 存储顶点索引数据，用于减少重复顶点的绘制开销
  // ​- 3.​顶点属性指针配置（Vertex Attribute Pointers）​​
  // 定义如何从 VBO 中解析每个顶点的属性（如位置、颜色）。关键参数包括：
  //  - 3.1 index：属性在着色器中的位置（如 layout(location=0)），用于标识着色器输入变量的位置
  //  - 3.2 size：属性分量数（如位置 vec3对应 size=3）
  //  - 3.3 type：数据类型（如 GL_FLOAT）
  //  - 3.4 normalized：是否归一化。
  //  - 3.5 stride：顶点步长（字节数，即一个顶点占用的总字节）
  //  - 3.6 offset：属性在顶点结构内的偏移量（字节）
  //  4.​​属性通道启用状态​​
  // 记录哪些顶点属性通道被启用（通过 glEnableVertexAttribArray）

  gl.enableVertexAttribArray(positionAttributeLocation)
  // - 1.通过顶点属性的位置索引启用对应的顶点属性数组通道(顶点属性数组通道是 GPU 中​​专用于接收顶点数据的逻辑通路​​，每个通道对应一个顶点属性索引)，
  // GPU 默认关闭所有属性通道，调用此函数后，指定通道被标记为“激活”状态，允许后续从绑定的缓冲区（VBO）中读取数据
  // - 2.更新顶点数组对象（VAO）状态，启动状态被记录在当前绑定的顶点数组对象中，VAO存储了所有顶点属性的配置（如是否启用、数据格式、步长等）
  // 该方法会修改VAO内部对应属性的enable标志为true，确保渲染时使用缓冲区数据而非默认常量值（如 glVertexAttrib3f(0, 1.0, 0.0, 0.0)）
  // - 3.必须与 glVertexAttribPointer配合使用：后者定义数据的解析规则（如偏移量、数据类型）
  // 而 glEnableVertexAttribArray决定是否应用这些规则

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  var size = 2 // 2 components per iteration
  var type = gl.FLOAT // the data is 32bit floats
  var normalize = false // don't normalize the data
  var stride = 0 // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0 // start at the beginning of the buffer
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)
  // - 1.绑定当前缓冲区到顶点属性​​：将通过 gl.bindBuffer绑定的缓冲区（VBO）与指定的顶点属性（通过 index标识）关联起来，
  // gl.ARRAY_BUFFER是 WebGL 中专门用于存储​​顶点属性数据​​（如位置、颜色、法线等）的缓冲区目标
  // - 2.数据布局定义​​：通过参数指定如何从缓冲区中提取数据
  // - 3.​属性状态更新​​：方法执行后，WebGL 内部会更新顶点属性对象（Vertex Array Object, VAO）的状态，记录参数信息
  // - 4.启用属性数组​​：需额外调用 gl.enableVertexAttribArray(index)激活该属性，否则 WebGL 会使用默认属性值（如 vec4(0.0, 0.0, 0.0, 1.0)）而非缓冲区数据

  var primitiveType = gl.TRIANGLES
  var offset = 0
  var count = 6
  gl.drawArrays(primitiveType, offset, count)
  // - 1. ​​​从绑定的 VBO 中读取3个顶点数据
  // - 2. ​​​顶点着色器接收顶点属性作为输入
  // - 3. ​​图元组装与光栅化​​
  // - 4. ​​​​片段着色器调用
}

main()
