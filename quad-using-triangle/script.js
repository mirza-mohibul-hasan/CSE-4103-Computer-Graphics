const canvas = document.getElementById("myCanvas");
const gl = canvas.getContext("webgl");

if (!gl) {
  alert("WebGL context not available!");
  return;
}

// Vertex shader source code
const vertexShaderSource = `
attribute vec2 aPosition;
attribute vec3 aColor;
uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;

void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 0.0, 1.0);
    gl_PointSize = 10.0; // Optional: set point size for debugging
}
`;

// Fragment shader source code
const fragmentShaderSource = `
precision mediump float;
uniform vec3 uColor;

void main() {
    gl_FragColor = vec4(uColor, 1.0);
}
`;

// Create and compile shaders
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

gl.shaderSource(vertexShader, vertexShaderSource);
gl.shaderSource(fragmentShader, fragmentShaderSource);

gl.compileShader(vertexShader);
gl.compileShader(fragmentShader);

// Check for shader compilation errors
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
  console.error(
    "Vertex shader compilation error:",
    gl.getShaderInfoLog(vertexShader)
  );
  return;
}

if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
  console.error(
    "Fragment shader compilation error:",
    gl.getShaderInfoLog(fragmentShader)
  );
  return;
}

// Create and link shader program
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

// Check for program linking errors
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  console.error("Program linking error:", gl.getProgramInfoLog(program));
  return;
}

// Create vertex buffer with quad vertices and colors
const vertices = [
  -0.5,
  -0.5,
  1.0,
  0.0,
  0.0, // Bottom left, red
  -0.5,
  0.5,
  0.0,
  1.0,
  0.0, // Top left, green
  0.5,
  0.5,
  0.0,
  0.0,
  1.0, // Top right, blue
  0.5,
  -0.5,
  1.0,
  0.0,
  1.0, // Bottom right, purple
];

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

// Create attribute pointers for vertex positions and colors
const aPositionLocation = gl.getAttribLocation(program, "aPosition");
const aColorLocation = gl.getAttribLocation(program, "aColor");

gl.vertexAttribPointer(
  aPositionLocation,
  2,
  gl.FLOAT,
  false,
  6 * Float32Array.BYTES_PER_ELEMENT,
  0
);
gl.vertexAttribPointer(
  aColorLocation,
  3,
  gl.FLOAT,
  false,
  6 * Float32Array.BYTES_PER_ELEMENT,
  2 * Float32Array.BYTES_PER_ELEMENT
);

gl.enableVertexAttribArray(aPositionLocation);
gl.enableVertexAttribArray(aColorLocation);

// Uniforms for projection and model-view matrices
const uProjectionMatrixLocation = gl.getUniformLocation(
  program,
  "uProjectionMatrix"
);
const uModelViewMatrixLocation = gl.getUniformLocation;
