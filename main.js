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
// <<---Audio--->>
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
const audioPlayer = {
  duration: document.querySelector("#duration"),
  current: document.querySelector("#current"),
  playPause: document.querySelector("#playPause"),
  song: "audio.mp3",
  peaks: [],
};
let timeCalcultor = (value) => {
  let second = Math.floor(value % 60);
  let minute = Math.floor(value / 60);
  if (second < 10) {
    second = "0" + second;
  }
  return minute + ":" + second;
};
// Prepare wavesurfer object
wavesurfer = WaveSurfer.create({
  audioContext: {},
  container: "#wave",
  waveColor: "#d8f3dc",
  progressColor: "#06d6a0",
  height: 48,
  backend: "MediaElement",
  scrollParent: false,
  barWidth : 2,
  barMinHeight :1,
});
for (let i = 0; i < 100; i++) {
  audioPlayer.peaks.push(Math.random());
}
// Load audio
wavesurfer.load(audioPlayer.song, audioPlayer.peaks);
audioPlayer.playPause.addEventListener("click", (e) => {
  wavesurfer.playPause();
});
wavesurfer.on("ready", (e) => {
  audioPlayer.duration.textContent = timeCalcultor(wavesurfer.getDuration(e));
});
wavesurfer.on("audioprocess", (e) => {
  audioPlayer.current.textContent = timeCalcultor(wavesurfer.getCurrentTime(e));
});
// navigator.mediaDevices
//   .getUserMedia(audioIN)
//   .then((mediaStreamObj) => {
//     if ("srcObject" in audio) {
//       audio.srcObject = mediaStreamObj;
//     } else {
//       audio.src = window.URL.createObjectURL(mediaStreamObj);
//     }
//     let mediaRecorder = new MediaRecorder(mediaStreamObj);
//     start.addEventListener("click", () => {
//       mediaRecorder.start();
//       start.classList.add("recording");
//       stop.classList.remove("play");
//     });
//     stop.addEventListener("click", () => {
//       start.classList.remove("recording");
//       stop.classList.add("play");
//       mediaRecorder.stop();
//     });
//     mediaRecorder.ondataavailable = function (e) {
//       audioHelper.chunk.push(e.data);
//       // console.log(e.data) this is a [Blob]
//     };
//     mediaRecorder.onstop = function () {
//       let audioData = new Blob(audioHelper.chunk, { type: "audio/mp3;" });
//       // audioHelper.chunk = [];
//       let audioSrc = window.URL.createObjectURL(audioData);
//       playAudio.src = audioSrc;
//     };
//   })
//   .catch((err) => {
//     console.log(err.name, err.message);
//   });
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
