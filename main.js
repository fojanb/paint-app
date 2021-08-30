const canvas = document.querySelector(".board");
const ctx = canvas.getContext("2d");
const colorPalette = document.querySelector("#colorChange");
const widthScale = document.querySelector("#lineWidth");
const saveButton = document.querySelector("#btnSave");
const clearButton = document.querySelector("#btnClear");
const backButton = document.querySelector("#btnBack");
const eraserButton = document.querySelector("#btnEraser");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 80;
let isDrawing = false;
const options = {
  SHAPE: "round",
};
// ------------------------#
// Canvas initializations
ctx.lineCap = options.SHAPE;
ctx.lineJoin = options.SHAPE;
canvas.style.cursor = "crosshair";
ctx.strokeStyle = colorPalette.value;
ctx.lineWidth = widthScale.value;
// ------------------------#
const draw = (e) => {
  if (isDrawing) {
    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.closePath();
    ctx.stroke();
    ctx.moveTo(e.clientX, e.clientY);
  } else {
    ctx.moveTo(e.clientX, e.clientY);
  }
};
const startDraw = (e) => {
  isDrawing = !isDrawing;
  ctx.moveTo(e.clientX, e.clientY);
  // ctx.beginPath();
  canvas.addEventListener("mousemove", draw);
};
const endDraw = () => {
  isDrawing = !isDrawing;
  canvas.removeEventListener("mousemove", draw);
};
const clearCanvas = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath(); // clear existing drawing paths
};
const manageBackBtn = () => {
  canvas.style.display = "block";
  document.getElementById("saveArea").style.display = "none";
  document.getElementById("tools").style.display = "block";
};
const manageSaveBtn = () => {
  document.getElementById("saveArea").style.display = "block";
  document.getElementById("tools").style.display = "none";
};
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", endDraw);
clearButton.addEventListener("click", clearCanvas, false);
backButton.addEventListener("click", manageBackBtn);
saveButton.addEventListener("click", manageSaveBtn);
// >>>------------> Audio Section <------------<<<
let audioIN = { audio: true };
navigator.mediaDevices
  .getUserMedia(audioIN)
  .then((mediaStreamObj) => {
    let audio = document.querySelector("audio");
    if ("srcObject" in audio) {
      audio.srcObject = mediaStreamObj;
    } else {
      audio.src = window.URL.createObjectURL(mediaStreamObj);
    }
    audio.onloadedmetadata = function () {
      audio.play();
    };
    let start = document.getElementById("btnStart");
    let stop = document.getElementById("btnStop");
    let playAudio = document.getElementById("audioPlay");
    let mediaRecorder = new MediaRecorder(mediaStreamObj);
    start.addEventListener("click", () => {
      mediaRecorder.start();
    });
    stop.addEventListener("click", () => {
      mediaRecorder.stop();
    });
    mediaRecorder.ondataavailable = function (e) {
      dataArray.push(e.data);
    };
    let dataArray = [];
    mediaRecorder.onstop = function () {
      let audioData = new Blob(dataArray, { type: "audio/mp3;" });
      dataArray = [];
      let audioSrc = window.URL.createObjectURL(audioData);
      playAudio.src = audioSrc;
    };
  })
  .catch((err) => {
    console.log(err.name, err.message);
  });
// >>>------------> Width Scale <------------<<<
widthScale.addEventListener("change", () => {
  ctx.lineWidth = widthScale.value;
  ctx.beginPath(); // clear existing drawing paths
});
// >>>------------> Color Palette <------------<<<
// const erase = () => {
//   ctx.globalCompositeOperation = "destination-out";
// }
// eraserButton.addEventListener("click", erase);

colorPalette.addEventListener("change", () => {
  ctx.strokeStyle = colorPalette.value;
  ctx.beginPath();
});
// >>>------------> Erase Button <------------<<<
/*Pixel-based eraser (redraw)*/
let eraser = true; //Toggle variable
const color = "#080014"; 
const erase = () => {
  const erasing = () => {
    ctx.strokeStyle = color;
    ctx.lineWidth = widthScale.value * 2;
    ctx.beginPath();
  };
  eraserButton.classList.add("eraserBtn");
  if (eraser) {
    canvas.style.cursor = "url('./assets/eraser.png'),auto ";
    canvas.addEventListener("mouseover", erasing);
  } else {
    ctx.strokeStyle = colorPalette.value;
    console.log(ctx.strokeStyle);
    eraserButton.classList.remove("eraserBtn");
    canvas.removeEventListener("mouseover", erasing);
    ctx.lineWidth = widthScale.value;
    canvas.style.cursor = "crosshair";
  }
  eraser = !eraser;
};

eraserButton.addEventListener("click", erase);
