document.addEventListener("DOMContentLoaded", init);

let gl;
let shaderProgram;
let vertexBuffer;

let angle = 0;
let size = 0.0001; // Initial size
let vertices = [];

function init() {
  const canvas = document.getElementById("webgl-canvas");
  gl = canvas.getContext("webgl");

  if (!gl) {
    console.error(
      "Unable to initialize WebGL. Your browser may not support it."
    );
    return;
  }

  // Vertex shader program
  const vsSource = `
        attribute vec4 aVertexPosition;
        uniform float uPointSize;
        varying vec4 vColor;

        void main(void) {
          gl_Position = aVertexPosition;
          gl_PointSize = uPointSize;
          vColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
      `;

  // Fragment shader program
  const fsSource = `
        precision mediump float;
        varying vec4 vColor;

        void main(void) {
          gl_FragColor = vColor;
        }
      `;

  shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  gl.useProgram(shaderProgram);

  vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  const aVertexPosition = gl.getAttribLocation(
    shaderProgram,
    "aVertexPosition"
  );
  gl.vertexAttribPointer(aVertexPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aVertexPosition);

  render();
  canvas.addEventListener("click", increaseSpiralSize);
}

function increaseSpiralSize() {
  angle += 2;
  size += 0.0005;
  render();
}

function render() {
  calculateSpiralVertices();
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.uniform1f(gl.getUniformLocation(shaderProgram, "uPointSize"), size);
  gl.drawArrays(gl.POINTS, 0, vertices.length / 2);
}

function calculateSpiralVertices() {
  const numPoints = 360;
  vertices = [];

  for (let i = 0; i < numPoints; i++) {
    const theta = (i / numPoints) * angle;
    const x = size * theta * Math.cos(theta);
    const y = size * theta * Math.sin(theta);

    vertices.push(x, y);
  }
}

function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error(
      "Unable to initialize the shader program: " +
        gl.getProgramInfoLog(shaderProgram)
    );
    return null;
  }

  return shaderProgram;
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(
      "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
