function init() {
    // Get the canvas element
    const canvas = document.getElementById("myCanvas");
    
    // Get the WebGL context
    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("Failed to get WebGL context.");
      return;
    }
    
    // Create vertex shader
    const vsSource = `
      attribute vec3 aPosition;
      void main() {
        gl_Position = vec4(aPosition, 1.0);
      }
    `;
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vsSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error("Vertex shader compilation failed:", gl.getShaderInfoLog(vertexShader));
      return;
    }
    
    // Create fragment shader
    const fsSource = `
      void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Red color
      }
    `;
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fsSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error("Fragment shader compilation failed:", gl.getShaderInfoLog(fragmentShader));
      return;
    }
    
    // Create shader program
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking failed:", gl.getProgramInfoLog(program));
      return;
    }
    
    // Set up vertex data
    const vertices = new Float32Array([
      -0.5, -0.5, 0.0, // Left bottom corner
      0.5, -0.5, 0.0, // Right bottom corner
      0.0, 0.5, 0.0, // Top corner
    ]);
    
    // Create vertex buffer object
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    // Get attribute location
    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);
    
    // Clear canvas
    gl.clearColor(0.0, 0.0, 0.0, 0.5); // Black background
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // Draw triangle
    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  
  window.onload = init;
  