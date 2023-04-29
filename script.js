const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 800;

const increaseBtn = document.getElementById('increase');
const decreaseBtn = document.getElementById('decrease');
const sizeEl = document.getElementById('size');
const colorEl = document.getElementById('color');

const undoBtn = document.getElementById('undo');
const clearBtn = document.getElementById('clear');


let isPressed = false;
let size = 6;
let x = undefined; 
let y = undefined;
let color = colorEl.value;

let canvasUndoStateStack = [];
let getPrevCanvas = getCanvasFromLs();



if (getPrevCanvas !== undefined) {
  // create an image element
  var img = new Image();

  // set the source of the image element to the data URL
  img.src = getPrevCanvas;

  img.onload = function() {
    // draw the image on the canvas
    ctx.drawImage(img, 0, 0);
  };
}



//Buttons Event Listener
increaseBtn.addEventListener('click', ()=> {
  size += 3;
  size = updateLineSize(size);
})

decreaseBtn.addEventListener('click', ()=> {
  size -= 3;
  size = updateLineSize(size);
})

colorEl.addEventListener('change', ()=> {
  color = colorEl.value;
})

undoBtn.addEventListener('click', ()=> {
  if (canvasUndoStateStack.length > 0) {
    canvasUndoStateStack.pop();
  } 
  if (canvasUndoStateStack.length > 0) {
    ctx.putImageData(canvasUndoStateStack[canvasUndoStateStack.length - 1], 0, 0);
    saveToLs();
  }
  if (canvasUndoStateStack.length === 0) {
    clearBtn.click();
    saveToLs();
  }
})

clearBtn.addEventListener(('click'), ()=> {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  canvasUndoStateStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  
  saveToLs ();
});



//Canvas Event Listener - Mouse Click
canvas.addEventListener('mousedown', (e)=> {
  isPressed = true;
  x = e.offsetX;
  y = e.offsetY;

})

canvas.addEventListener('mouseup', ()=>{
  isPressed = false;
  
  x = undefined;
  y = undefined;

  canvasUndoStateStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  saveToLs();
})

canvas.addEventListener('mousemove', (e)=>{
  if (isPressed) {
    let x2 = e.offsetX;
    let y2 = e.offsetY;

    drawCircle(x, y);
    drawLine(x, y, x2, y2);
  
    x = x2;
    y = y2;
    // drawLine(x, y, x2, y2);
  }
})



//Canvas Event Listener - Touchscreen
canvas.addEventListener('touchstart', (e)=>{
  e.preventDefault(); // Prevent default touch actions like scrolling

  isPressed = true;
  const touch = e.touches[0]; // Get the first touch point

  x = touch.clientX - canvas.offsetLeft;
  y = touch.clientY - canvas.offsetTop;
  
});

canvas.addEventListener('touchmove', (e)=>{
  e.preventDefault();

  const touch = e.touches[0];
  const x2 = touch.clientX - canvas.offsetLeft;
  const y2 = touch.clientY - canvas.offsetTop;

  if (isPressed) {

    drawCircle(x, y);
    drawLine(x, y , x2, y2);
  }

  x = x2;
  y = y2;
});

canvas.addEventListener('touchend', (e)=>{
  e.preventDefault();

  isPressed = false;

  x = undefined;
  y = undefined;

  canvasUndoStateStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  saveToLs();

});

function drawCircle(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, size, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2 * size;
  ctx.stroke();
}

function updateLineSize(size) {
  if (size > 30) {
    size = 30;
  } else if (size < 3) {
    size = 3
  }
  sizeEl.innerHTML = size;
  return size;
}

function saveToLs () {
  // get the image data from the canvas
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // convert the image data to a Base64-encoded string
  var dataURL = canvas.toDataURL();

  // store the data in local storage
  localStorage.setItem("myImageData", dataURL);
}

function getCanvasFromLs () {
  // get the data from local storage
  let dataURL = localStorage.getItem("myImageData");

  return dataURL || undefined;
}