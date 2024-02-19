const canvas = document.getElementById("glCanvas");
const gl = canvas.getContext("webgl");

if (!gl) {
  alert("Unable to initialize WebGL. Your browser may not support it.");
}

const vertexShaderSource = `
            attribute vec2 position;

            void main() {
                gl_Position = vec4(position, 0.0, 1.0);
                gl_PointSize = 5.0; // Adjust point size as needed
            }
        `;

const fragmentShaderSource = `
            precision mediump float;
            uniform vec4 color;

            void main() {
                gl_FragColor = color; // Set point color
            }
        `;

function compileShader(gl, source, type) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(
      "An error occurred compiling the shaders:",
      gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
const fragmentShader = compileShader(
  gl,
  fragmentShaderSource,
  gl.FRAGMENT_SHADER
);
const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);

const positionBuffer = gl.createBuffer();
const positionAttribLocation = gl.getAttribLocation(shaderProgram, "position");
gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(positionAttribLocation);

// Initialize buffer with initial flower data
const initialPoints = generateFlower();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(initialPoints), gl.STATIC_DRAW);

let clickCount = 0;
canvas.addEventListener("click", updateFlower);

function generateFlower() {
  const numPetals = Math.floor(Math.random() * (10 - 3 + 1)) + 3;
  const numPointsPerPetal = 60000;
  const numPoints = numPetals * numPointsPerPetal;
  const points = [];

  for (let i = 0; i < numPoints; i++) {
    const petalIndex = Math.floor(i / numPointsPerPetal);
    const angle = ((i % numPointsPerPetal) / numPointsPerPetal) * 2 * Math.PI;
    const radius = 0.5 + 0.5 * Math.sin(numPetals * angle);
    const x = radius * Math.cos(angle + (petalIndex * 2 * Math.PI) / numPetals);
    const y = radius * Math.sin(angle + (petalIndex * 2 * Math.PI) / numPetals);
    points.push(x, y);
  }

  return points;
}

function updateFlower() {
  clickCount++;
  const color =
    clickCount % 2 === 0 ? [1.0, 0.0, 0.0, 1.0] : [0.0, 1.0, 0.0, 1.0];
  const colorUniformLocation = gl.getUniformLocation(shaderProgram, "color");
  gl.uniform4fv(colorUniformLocation, color);

  const points = generateFlower();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionAttribLocation);

  gl.drawArrays(gl.POINTS, 0, points.length / 2);
}
