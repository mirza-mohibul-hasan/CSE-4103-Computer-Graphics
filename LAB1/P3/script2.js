function init() {
  const canvas = document.getElementById("myCanvas");
  const gl = canvas.getContext("webgl");

  if (!gl) {
    console.error("Failed to get WebGL context.");
    return;
  }

  const vertexShaderSource = `
    attribute vec3 aPosition;
    void main() {
      gl_Position = vec4(aPosition, 1.0);
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;
    uniform vec4 uColor;
    void main() {
      gl_FragColor = uColor;
    }
  `;

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  if (!vertexShader || !fragmentShader) {
    console.error("Failed to create shaders.");
    return;
  }

  const program = createProgram(gl, vertexShader, fragmentShader);

  if (!program) {
    console.error("Failed to create program.");
    return;
  }

  gl.useProgram(program);

  const vertices = new Float32Array([
    0.0,  0.8, 0.0,   // Top vertex
   -0.8, -0.8, 0.0,   // Bottom-left vertex
    0.8, -0.8, 0.0,   // Bottom-right vertex
    0.0,  0.8, 0.0,   // Top vertex (again) to close the triangle
    0.0, -0.8, 0.0,   // Midpoint for the first dividing line
   -0.4,  0.0, 0.0,   // Left vertex for the second dividing line
    0.4,  0.0, 0.0,    // Right vertex for the second dividing line
  ]);

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const aPosition = gl.getAttribLocation(program, "aPosition");
  gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aPosition);

  const uColor = gl.getUniformLocation(program, "uColor");

  // redlines
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.uniform4fv(uColor, [1.0, 0.0, 0.0, 1.0]);
  gl.drawArrays(gl.LINE_LOOP, 0, 4);

  gl.uniform4fv(uColor, [0.2, 1.0, 0.0, 1.0]);

  gl.drawArrays(gl.LINES, 3, 2);

  gl.drawArrays(gl.LINES, 5, 2);
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compilation failed:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program linking failed:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

window.onload = init;