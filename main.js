const artRoom = {
  canvas: document.querySelector(".board"),
  colorPalette: document.querySelector("#colorChange"),
  widthScale: document.querySelector("#lineWidth"),
  saveButton: document.querySelector("#btnSave"),
  clearButton: document.querySelector("#btnClear"),
  backButton: document.querySelector("#btnBack"),
  eraserButton: document.querySelector("#btnEraser"),
  undoButton: document.querySelector("#btnUndo"),
  redoButton: document.querySelector("#btnRedo"),
};
const audioRoom = {
  signalCanvas: document.querySelector(".visualizer"),
  start: document.getElementById("btnStart"),
  stop: document.getElementById("btnStop"),
  audio: document.querySelector("audio"),
  playAudio: document.getElementById("audioPlay"),
};
audioRoom.audio.controls = false;
audioRoom.signalCanvas.style.borderRadius = "5px";
const ctx = artRoom.canvas.getContext("2d");
const signalCanvasCtx = audioRoom.signalCanvas.getContext("2d");
let audioCtx;
const audioHelper = {
  chunk: [],
};
let audioIN = { audio: true };
// ---------------->>
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
artRoom.canvas.width = window.innerWidth - helper.widthOffset;
artRoom.canvas.height = window.innerHeight - helper.heightOffset;
ctx.lineCap = helper.SHAPE;
ctx.lineJoin = helper.SHAPE;
artRoom.canvas.style.cursor = helper.CURSOR;
ctx.strokeStyle = artRoom.colorPalette.value;
ctx.lineWidth = artRoom.widthScale.value;
// >>>------------> Draw Logic <------------<<<
const startDrawing = (e) => {
  helper.isDrawing = !helper.isDrawing;
  ctx.beginPath();
  ctx.moveTo(e.clientX - artRoom.canvas.offsetLeft, e.clientY - artRoom.canvas.offsetTop);
};
const endDrawing = (e) => {
  helper.isDrawing = !helper.isDrawing;
  helper.savePath.push(ctx.getImageData(0, 0, artRoom.canvas.width, artRoom.canvas.height));
  helper.index += 1;
};
const draw = (e) => {
  if (!helper.isDrawing) return;
  ctx.lineTo(e.clientX - artRoom.canvas.offsetLeft, e.clientY - artRoom.canvas.offsetTop);
  ctx.stroke();
};
const enterCanvas = (e) => {
  ctx.beginPath();
};
artRoom.canvas.addEventListener("mousedown", startDrawing);
artRoom.canvas.addEventListener("mouseup", endDrawing);
artRoom.canvas.addEventListener("mousemove", draw);
artRoom.canvas.addEventListener("mouseover", enterCanvas);
// ------------------------------------------------
const clearCanvas = () => {
  ctx.clearRect(0, 0, artRoom.canvas.width, artRoom.canvas.height);
  ctx.beginPath(); // clear existing drawing paths
  helper.savePath = [];
  helper.index = -1;
};
const manageBackBtn = () => {
  artRoom.canvas.style.display = "block";
  document.getElementById("saveArea").style.display = "none";
  document.getElementById("tools").style.display = "block";
};
const manageSaveBtn = () => {
  document.getElementById("saveArea").style.display = "block";
  document.getElementById("tools").style.display = "none";
};
artRoom.clearButton.addEventListener("click", clearCanvas, false);
artRoom.backButton.addEventListener("click", manageBackBtn);
artRoom.saveButton.addEventListener("click", manageSaveBtn);
// >>>------------> Audio Section <------------<<<
navigator.mediaDevices
  .getUserMedia(audioIN)
  .then((mediaStreamObj) => {
    if ("srcObject" in audioRoom.audio) {
      audioRoom.audio.srcObject = mediaStreamObj;
    } else {
      audioRoom.audio.src = window.URL.createObjectURL(mediaStreamObj);
    }
    let mediaRecorder = new MediaRecorder(mediaStreamObj);
    audioRoom.start.addEventListener("click", () => {
      mediaRecorder.start();
      audioRoom.start.classList.add("recording");
      audioRoom.stop.classList.remove("play");
    });
    audioRoom.stop.addEventListener("click", () => {
      audioRoom.start.classList.remove("recording");
      audioRoom.stop.classList.add("play");
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
      audioRoom.playAudio.src = audioSrc;
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
    const WIDTH = audioRoom.signalCanvas.width;
    const HEIGHT = audioRoom.signalCanvas.height;
    requestAnimationFrame(draw);
    analyser.getByteTimeDomainData(dataArray);
    signalCanvasCtx.fillStyle = "#343a40";
    signalCanvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    signalCanvasCtx.lineWidth = 2;
    signalCanvasCtx.strokeStyle = "#26e07f";
    signalCanvasCtx.beginPath();
    let sliceWidth = (WIDTH * 1.0) / bufferLength;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      let v = dataArray[i] / 128.0;
      let y = (v * HEIGHT) / 2;
      if (i === 0) {
        signalCanvasCtx.moveTo(x, y);
      } else {
        signalCanvasCtx.lineTo(x, y);
      }
      x += sliceWidth;
    }
    signalCanvasCtx.lineTo(audioRoom.signalCanvas.width, audioRoom.signalCanvas.height / 2);
    signalCanvasCtx.stroke();
  }
}
// >>>------------> Width Scale <------------<<<
artRoom.widthScale.addEventListener("change", () => {
  ctx.lineWidth = artRoom.widthScale.value;
  ctx.beginPath(); // clear existing drawing paths
});
// >>>------------> Color Palette <------------<<<
artRoom.colorPalette.addEventListener("change", () => {
  ctx.strokeStyle = artRoom.colorPalette.value;
  ctx.globalCompositeOperation = "source-over";
  ctx.beginPath(); // clear existing drawing paths
});
// >>>------------> Erase Button <------------<<<
/*Pixel-based eraser (Recommended solution : globalCompositeOperation)*/
const erase = () => (ctx.globalCompositeOperation = "destination-out");
artRoom.eraserButton.addEventListener("click", erase);
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
artRoom.undoButton.addEventListener("click", undo);
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
artRoom.redoButton.addEventListener("click", redo);
