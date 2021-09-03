const canvas = document.querySelector(".board");
const ctx = canvas.getContext("2d");
const colorPalette = document.querySelector("#colorChange");
const widthScale = document.querySelector("#lineWidth");
const saveButton = document.querySelector("#btnSave");
const clearButton = document.querySelector("#btnClear");
const backButton = document.querySelector("#btnBack");
const eraserButton = document.querySelector("#btnEraser");
const undoButton = document.querySelector("#btnUndo");
const redoButton = document.querySelector("#btnRedo");
// Audio
const signalCanvas = document.querySelector(".visualizer");
const signalCanvasCtx = signalCanvas.getContext("2d");

let start = document.getElementById("btnStart");
let stop = document.getElementById("btnStop");
let audio = document.querySelector("audio");
let playAudio = document.getElementById("audioPlay");
audio.controls = false;

const helper = {
  isDrawing: false,
  SHAPE: "round",
  CURSOR: "crosshair",
  savePath: [],
  index: -1, //It means that savePath is empty for now.
  popped: [], //Store the paths that are already out of savePath array.
  widthOffset: 700,
  heightOffset: 150,
};
let audioCtx;
const audioHelper = {
  chunk: [],
};
let audioIN = { audio: true };
canvas.width = window.innerWidth - helper.widthOffset;
canvas.height = window.innerHeight - helper.heightOffset;
ctx.lineCap = helper.SHAPE;
ctx.lineJoin = helper.SHAPE;
canvas.style.cursor = helper.CURSOR;
ctx.strokeStyle = colorPalette.value;
ctx.lineWidth = widthScale.value;
// >>>------------> Draw Logic <------------<<<
const startDrawing = (e) => {
  helper.isDrawing = !helper.isDrawing;
  ctx.beginPath();
  ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
};
const endDrawing = (e) => {
  helper.isDrawing = !helper.isDrawing;
  helper.savePath.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  helper.index += 1;
};
const draw = (e) => {
  if (!helper.isDrawing) return;
  ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
  ctx.stroke();
};
const enterCanvas = (e) => {
  ctx.beginPath();
};
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", endDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseover", enterCanvas);
// ------------------------------------------------
const clearCanvas = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath(); // clear existing drawing paths
  helper.savePath = [];
  helper.index = -1;
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
clearButton.addEventListener("click", clearCanvas, false);
backButton.addEventListener("click", manageBackBtn);
saveButton.addEventListener("click", manageSaveBtn);
// >>>------------> Audio Section <------------<<<
navigator.mediaDevices
  .getUserMedia(audioIN)
  .then((mediaStreamObj) => {
    if ("srcObject" in audio) {
      audio.srcObject = mediaStreamObj;
    } else {
      audio.src = window.URL.createObjectURL(mediaStreamObj);
    }
    let mediaRecorder = new MediaRecorder(mediaStreamObj);
    start.addEventListener("click", () => {
      mediaRecorder.start();
      start.classList.add("recording");
      stop.classList.remove("play");

    });
    stop.addEventListener("click", () => {
      start.classList.remove("recording");
      stop.classList.add("play");
      mediaRecorder.stop();
    });
    mediaRecorder.ondataavailable = function (e) {
      audioHelper.chunk.push(e.data);
      // console.log(audioHelper.chunk) this is a [Blob]
    };
    mediaRecorder.onstop = function () {
      let audioData = new Blob(audioHelper.chunk, { type: "audio/mp3;" });
      // audioHelper.chunk = [];
      let audioSrc = window.URL.createObjectURL(audioData);
      playAudio.src = audioSrc;
    };
    visualizer(mediaStreamObj);
  })
  .catch((err) => {
    console.log(err.name, err.message);
  });
function visualizer(mediaStreamObj) {
  audioCtx = new AudioContext();
  const source = audioCtx.createMediaStreamSource(mediaStreamObj);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  source.connect(analyser);
  draw();
  function draw() {
    const WIDTH = signalCanvas.width;
    const HEIGHT = signalCanvas.height;
    requestAnimationFrame(draw);
    analyser.getByteTimeDomainData(dataArray);
    signalCanvasCtx.fillStyle = 'rgb(200, 200, 200)';
    signalCanvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    signalCanvasCtx.lineWidth = 2;
    signalCanvasCtx.strokeStyle = 'rgb(0, 0, 0)';
    signalCanvasCtx.beginPath();
    let sliceWidth = WIDTH * 1.0 / bufferLength;
    let x = 0;
    for(let i = 0; i < bufferLength; i++) {

      let v = dataArray[i] / 128.0;
      let y = v * HEIGHT/2;

      if(i === 0) {
        signalCanvasCtx.moveTo(x, y);
      } else {
        signalCanvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }
    signalCanvasCtx.lineTo(signalCanvas.width, signalCanvas.height/2);
    signalCanvasCtx.stroke();

  }
}
// >>>------------> Width Scale <------------<<<
widthScale.addEventListener("change", () => {
  ctx.lineWidth = widthScale.value;
  ctx.beginPath(); // clear existing drawing paths
});
// >>>------------> Color Palette <------------<<<
colorPalette.addEventListener("change", () => {
  ctx.strokeStyle = colorPalette.value;
  ctx.globalCompositeOperation = "source-over";
  ctx.beginPath(); // clear existing drawing paths
});
// >>>------------> Erase Button <------------<<<
/*Pixel-based eraser (Recommended solution : globalCompositeOperation)*/
const erase = () => (ctx.globalCompositeOperation = "destination-out");
eraserButton.addEventListener("click", erase);
// >>>------------> Undo Button <------------<<<
const undo = () => {
  if (helper.index <= 0) {
    clearCanvas();
  } else {
    helper.popped.push(helper.savePath.pop());
    helper.index -= 1;
    ctx.putImageData(helper.savePath[helper.index], 0, 0);
  }
};
undoButton.addEventListener("click", undo);
// >>>------------> Redo Button <------------<<<
const redo = () => {
  if (helper.popped.length == 0) {
    return;
  } else {
    helper.savePath.push(helper.popped.pop());
    helper.index += 1;
    ctx.putImageData(helper.savePath[helper.index], 0, 0);
  }
};
redoButton.addEventListener("click", redo);
