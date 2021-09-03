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
// ---Audio---
const audioCanvas = document.querySelector(".visualizer");
const audioCanvasCtx = audioCanvas.getContext("2d");
const record = document.querySelector(".record");
const stop = document.querySelector(".stop");
let audioCtx;
stop.disabled = true;
const helper = {
  isDrawing: false,
  SHAPE: "round",
  CURSOR: "crosshair",
  savePath: [],
  index: -1, //It means that savePath is empty for now.
  popped: [], //Store the paths that are already out of savePath array.
  offset: 110,
};
const audioHelper = {
  dataArray: [],
};
let audioIN = { audio: true };
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - helper.offset;
ctx.lineCap = helper.SHAPE;
ctx.lineJoin = helper.SHAPE;
canvas.style.cursor = helper.CURSOR;
ctx.strokeStyle = colorPalette.value;
ctx.lineWidth = widthScale.value;
// >>>------------> Draw Logic <------------<<<
const startDrawing = (e) => {
  helper.isDrawing = !helper.isDrawing;
  ctx.beginPath();
  ctx.moveTo(e.clientX, e.clientY);
};
const endDrawing = (e) => {
  helper.isDrawing = !helper.isDrawing;
  helper.savePath.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  helper.index += 1;
};
const draw = (e) => {
  if (!helper.isDrawing) return;
  ctx.lineTo(e.clientX, e.clientY);
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
// >>>------------> Audio Room <------------<<<
navigator.mediaDevices.getUserMedia(audioIN).then((stream) => {
  var mediaRecorder = new MediaRecorder(stream);
  // console.log(mediaRecorder);
  visualize(stream);
  record.addEventListener("click", () => {
    mediaRecorder.start();
    console.log(mediaRecorder.state);
    console.log("recorder started");
    record.style.background = "red";
    stop.disabled = false;
    record.disabled = true;
  });
  stop.addEventListener("click", () => {
    mediaRecorder.stop();
    console.log(mediaRecorder.state);
    console.log("recorder stopped");
    record.style.background = "";
    record.style.color = "";
    // mediaRecorder.requestData();
    stop.disabled = true;
    record.disabled = false;
  });
  function visualize(stream) {
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    console.log(audioCtx);
    // createMediaStreamSource() function returns a MediaStreamAudioSourceNode :
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    source.connect(analyser);
    // //analyser.connect(audioCtx.destination);
    drawSignal();
    function drawSignal() {
      const WIDTH = audioCanvas.width;
      const HEIGHT = audioCanvas.height;
      // requestAnimationFrame(drawSignal);
      analyser.getByteTimeDomainData(dataArray);
      audioCtx.fillStyle = "rgb(200, 200, 200)";
      audioCtx.fillRect(0, 0, WIDTH, HEIGHT);
      audioCtx.lineWidth = 2;
      audioCtx.strokeStyle = "rgb(0, 0, 0)";
      audioCtx.beginPath();
      let sliceWidth = (WIDTH * 1.0) / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        let v = dataArray[i] / 128.0;
        let y = (v * HEIGHT) / 2;
        if (i === 0) {
          audioCtx.moveTo(x, y);
        } else {
          audioCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      audioCtx.lineTo(audioCanvas.width, audioCanvas.height / 2);
      audioCtx.stroke();
    }
  }
});

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
