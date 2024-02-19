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
      }
    `;
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vsSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error("Vertex shader compilation failed:", gl.getShaderInfoLog(vertexShader));
      return;
    }
    const fsSource1 = `
      precision mediump float;
      void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Solid red
      }
    `;
    
    const fsSource2 = `
      precision mediump float;
      void main() {
        gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0); // Solid green
      }
    `;
    
    const fragmentShader1 = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader1, fsSource1);
    gl.compileShader(fragmentShader1);
    if (!gl.getShaderParameter(fragmentShader1, gl.COMPILE_STATUS)) {
      console.error("Fragment shader 1 compilation failed:", gl.getShaderInfoLog(fragmentShader1));
      return;
    }
  
    const fragmentShader2 = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader2, fsSource2);
    gl.compileShader(fragmentShader2);
    if (!gl.getShaderParameter(fragmentShader2, gl.COMPILE_STATUS)) {
      console.error("Fragment shader 2 compilation failed:", gl.getShaderInfoLog(fragmentShader2));
      return;
    }

    const program1 = gl.createProgram();
    gl.attachShader(program1, vertexShader);
    gl.attachShader(program1, fragmentShader1);
    gl.linkProgram(program1);
    if (!gl.getProgramParameter(program1, gl.LINK_STATUS)) {
      console.error("Program 1 linking failed:", gl.getProgramInfoLog(program1));
      return;
    }
    const program2 = gl.createProgram();
    gl.attachShader(program2, vertexShader);
    gl.attachShader(program2, fragmentShader2);
    gl.linkProgram(program2);
    if (!gl.getProgramParameter(program2, gl.LINK_STATUS)) {
      console.error("Program 2 linking failed:", gl.getProgramInfoLog(program2));
      return;
    }
    const vertices = new Float32Array([
      // ft
      -0.5, -0.5, 0.0, // Bottom left corner
      0.5, -0.5, 0.0, // Bottom right corner
      0.5, 0.5, 0.0, // Top corner
  
      // st
      -0.5, -0.5, 0.0, // Bottom left corner
      0.5, 0.5, 0.0, // Top corner
      -0.5, 0.5, 0.0, // Top right corner
    ]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  
    // ft
    gl.useProgram(program1);
    const aPosition1 = gl.getAttribLocation(program1, "aPosition");
    gl.vertexAttribPointer(aPosition1, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition1);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  
    // st
    gl.useProgram(program2);
    const aPosition2 = gl.getAttribLocation(program2, "aPosition");
    gl.vertexAttribPointer(aPosition2, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition2);
    gl.drawArrays(gl.TRIANGLES, 3, 3);
  }
  
  window.onload = init;
  