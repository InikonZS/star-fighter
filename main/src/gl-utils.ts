export function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  var shader = gl.createShader(type);   
  gl.shaderSource(shader, source);     
  gl.compileShader(shader);             
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
 
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return false;
}

export function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
 
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return false;
}

export function createShaderFromSource(gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource:string){
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  var program = createProgram(gl, vertexShader, fragmentShader);
  if (program){
    return program;
  }
  return false;
}

export function isPowerOf2(value: number) {
  return (value & (value - 1)) == 0;
}

export function createTexture(gl: WebGLRenderingContext, textureUrl: string, onLoad: (texture: WebGLTexture)=>void){
  // Create a texture.
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // Fill the texture with a 1x1 blue pixel.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 255]));
  // Asynchronously load an image
  //var image = new Image();
  let image = document.createElement('img');
  //image.style.cssText ='display:none';
  image.crossOrigin ='';
  //document.body.appendChild(image);
  image.addEventListener('load', function() {
    // Now that the image has loaded make copy it to the texture.
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);

      // проверяем, что размер изображения равен степени двойки в обоих измерениях
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      // Да, степень двойки. Генерируем мипмап.
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      // Нет, это не степень двойки. Отключаем мипмапы и устанавливаем режим CLAMP_TO_EDGE
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
    onLoad(texture);
  });
  image.src = textureUrl;
}

export function createTextureFromImg(gl: WebGLRenderingContext, imgElement: HTMLImageElement, onLoad: (texture: WebGLTexture)=>void){
  // Create a texture.
  let image = imgElement;
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // Fill the texture with a 1x1 blue pixel.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 255]));
  // Asynchronously load an image
  //var image = new Image();
  //let image = document.createElement('img');
  //image.style.cssText ='display:none';
  //image.crossOrigin ='';
  //document.body.appendChild(image);
  //image.addEventListener('load', function() {
    // Now that the image has loaded make copy it to the texture.
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);

    // проверяем, что размер изображения равен степени двойки в обоих измерениях
  if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
    // Да, степень двойки. Генерируем мипмап.
    gl.generateMipmap(gl.TEXTURE_2D);
  } else {
    // Нет, это не степень двойки. Отключаем мипмапы и устанавливаем режим CLAMP_TO_EDGE
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  }
  onLoad(texture);
 // });
}

export function createBuffer(gl: WebGLRenderingContext, list: Array<number>){
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(list), gl.STATIC_DRAW); 
  return positionBuffer;
}

export function setBuffer(gl: WebGLRenderingContext, buffer: WebGLBuffer, location: number, size: number){
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  // Указываем атрибуту, как получать данные от positionBuffer (ARRAY_BUFFER)
  //var size_ = size;          // 2 компоненты на итерацию
  var type = gl.FLOAT;   // наши данные - 32-битные числа с плавающей точкой
  var normalize = false; // не нормализовать данные
  var stride = 0;        // 0 = перемещаться на size * sizeof(type) каждую итерацию для получения следующего положения
  var offset = 0;        // начинать с начала буфера
  gl.vertexAttribPointer(
  location, size, type, normalize, stride, offset);  
}

export default {
  createShader,
  createProgram,
  createShaderFromSource,
  createTexture,
  createTextureFromImg,
  createBuffer,
  setBuffer
};