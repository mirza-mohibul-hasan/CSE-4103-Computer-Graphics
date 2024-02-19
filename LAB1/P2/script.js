function init() {
  const canvas = document.getElementById("myCanvas");

  const gl = canvas.getContext("webgl");
  if (!gl) {
    console.error("Failed to get WebGL context.");
    return;
  }
  const vsSource = `
    attribute vec3 aPosition;
    varying vec4 vColor;

    void main() {
      gl_Position = vec4(aPosition, 1.0);
      // Pass color to fragment shader
      vColor = gl_Position * 0.5 + 0.5;
    }
  `;
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vsSource);
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error("Vertex shader compilation failed:", gl.getShaderInfoLog(vertexShader));
    return;
  }
  const fsSource = `
    precision mediump float;
    varying vec4 vColor;

    void main() {
      gl_FragColor = vColor;
    }
  `;
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fsSource);
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error("Fragment shader compilation failed:", gl.getShaderInfoLog(fragmentShader));
    return;
  }
  
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program linking failed:", gl.getProgramInfoLog(program));
    return;
  }
  const vertices = new Float32Array([
    -0.5, -0.5, 1.0, // Bottom left corner
    0.5, -0.5, 1.0, // Bottom right corner
    0.5, 0.5, 1.0, // Top right corner
    -0.5, -0.5, 0.0, // Bottom left corner
    0.5, 0.5, 0.0, // Top right corner
    -0.5, 0.5, 1.0, // Top left corner
  ]);
  
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  
  const aPosition = gl.getAttribLocation(program, "aPosition");
  gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aPosition);
  
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
 
  gl.useProgram(program);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

window.onload = init;
