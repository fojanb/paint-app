const audioPlayer = {
  duration: document.querySelector("#duration"),
  current: document.querySelector("#current"),
  playPause: document.querySelector("#playPause"),
  song: "audio.mp3",
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
  waveColor: "#cdedff",
  progressColor: "#1AAFFF",
  height: 48,
  backend: "MediaElement",
  scrollParent: false,
});
let peaks = [];
for (let i = 0; i < 100; i++) {
  peaks.push(Math.random());
}
// Load audio
wavesurfer.load(audioPlayer.song, peaks);
audioPlayer.playPause.addEventListener("click", (e) => {
  wavesurfer.playPause();
});
wavesurfer.on("ready", (e) => {
  audioPlayer.duration.textContent = timeCalcultor(wavesurfer.getDuration(e));
});
wavesurfer.on("audioprocess", (e) => {
  audioPlayer.current.textContent = timeCalcultor(wavesurfer.getCurrentTime(e));
});

// wavesurfer.on("play", (e) => {
//   playPause.classList.remove("fa fa-play");
//   playPause.classList.add("fa fa-pause");
// });
