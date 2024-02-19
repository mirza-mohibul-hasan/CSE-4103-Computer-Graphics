const canvas = document.getElementById("glCanvas");
const gl = canvas.getContext("webgl");

// Vertex Shader source
const vsSource = `
attribute vec3 aVertexPosition;

void main() {
  gl_Position = vec4(aVertexPosition, 1.0);
}
`;

// Fragment Shader source
const fsSource = `
precision mediump float;

uniform vec3 color;

void main() {
  gl_FragColor = vec4(color, 1.0);
}
`;

// Create and compile shaders
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

gl.shaderSource(vertexShader, vsSource);
gl.shaderSource(fragmentShader, fsSource);

gl.compileShader(vertexShader);
gl.compileShader(fragmentShader);

// Check for shader compilation errors
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
  console.error("Error compiling vertex shader:", gl.getShaderInfoLog(vertexShader));
  return;
}

if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
  console.error("Error compiling fragment shader:", gl.getShaderInfoLog(fragmentShader));
  return;
}

// Create and link shader program
const shaderProgram = gl.createProgram();

gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);

gl.linkProgram(shaderProgram);

// Check for program linking errors
if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
  console.error("Error linking program:", gl.getProgramInfoLog(shaderProgram));
  return;
}

// Create vertex data for the triangle
const vertices = new Float32Array([
  // Top point
  0.0, 1.0, 0.0,
  // Bottom left point
  -0.8, -1.0, 0.0,
  // Bottom right point
  0.8, -1.0, 0.0,
]);

// Create a buffer object to store vertex data
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// Get attribute location in shader program
const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "aVertexPosition");

// Set viewport and background color
gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Use the shader program
gl.useProgram(shaderProgram);

// Bind vertex buffer and enable position attribute
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

// Set uniform color for red lines
gl.uniform3f(gl.getUniformLocation(shaderProgram, "color"), 1.0, 0.0, 0.0);

// Draw the triangle with lines
gl.drawArrays(gl.LINE_LOOP, 0, 3);

// Calculate positions for green lines
const midpoints = [
  [-0.4, 0.0, 0.0],
  [0.4, 0.0, 0.0],
];
// Set uniform color for green lines
gl.uniform3f(gl.getUniformLocation(shaderProgram, "color"), 0.0, 1.0, 0.0);

// Draw green lines from top point to each midpoint
for (const midpoint of midpoints) {
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    // Top point
    0.0, 1.0, 0.0,
    // Midpoint
    midpoint[0], midpoint[1], midpoint[2],
  ]), gl.STATIC_DRAW);

  // Draw the line
  gl.drawArrays(gl.LINE_STRIP, 0, 2);
}

