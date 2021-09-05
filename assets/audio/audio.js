duration = document.querySelector("#duration");
current = document.querySelector("#current");
playPause = document.querySelector("#playPause");
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
  container: "#wave",
  waveColor: "#cdedff",
  progressColor: "#1AAFFF",
  height: 48,
  backend: "MediaElement",
  scrollParent: false,
});
// Load audio
let song = "audio.mp3";
wavesurfer.load(song,11625);
playPause.addEventListener("click", (e) => {
  wavesurfer.playPause();
});
wavesurfer.on("ready", (e) => {
  duration.textContent = timeCalcultor(wavesurfer.getDuration(e));
});
wavesurfer.on("audioprocess", (e) => {
  current.textContent = timeCalcultor(wavesurfer.getCurrentTime(e));
});
// wavesurfer.on("play", (e) => {
//   playPause.classList.remove("fa fa-play");
//   playPause.classList.add("fa fa-pause");
// });
