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
  progressColor: "#2FC4FF",
  height: 48,
  backend: "MediaElement",
  scrollParent: false,
});
// Load audio
wavesurfer.load("audio.mp3");
playPause.addEventListener("click", (e) => {
  wavesurfer.playPause();
});
wavesurfer.on("ready",(e)=>{
    duration.textContent = timeCalcultor(wavesurfer.getDuration(e));
})
