var c = document.getElementById('renderingCanvas')
var gl = c.getContext('experimental-webgl');
gl.clearColor(0,0,0.8,1);
gl.clear(gl.COLOR_BUFFER_BIT);
console.log(c);
