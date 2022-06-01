console.log("video player");
const video = document.querySelector("video")
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currenTime = document.getElementById("currenTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreen = document.getElementById("fullScreen");
const videoContainer = document.getElementById("videoContainer");
const videoController = document.getElementById("videoController");

video.volume = 0.5;

const handlePlay = () => {
    if (video.paused) {
        video.play();
        playBtn.className = "fas fa-pause";
      } else {
        video.pause();
        playBtn.className = "fas fa-play";
      }
      return;
}

const handleMute = (e) => {
    if (video.muted) {
        video.muted = false;
        volumeRange.value = video.volume;
        muteBtn.className = "fas fa-volume-up";
    } else {
        video.muted = true;
        volumeRange.value = 0;
        muteBtn.className = "fas fa-volume-mute";
    }
    return;
}

const handleVolumeChange = (e) => {
    if (video.muted) {
        video.muted = false;
        volumeBtn.className = "fas fa-volume-mute";
    if (value === "0") {
        volumeBtn.className = "fas fa-volume-off";
    } else {
        volumeBtn.className = "fas fa-volume-up";
    }
    video.volume = volumeValue = value;
    }
    return;
}

const formatTime = (seconds) => {
    return new Date(seconds*1000).toISOString().substring(14,19);
}

const handleLoadedMetadata = () => {
    totalTime.innerText = formatTime(video.duration);
    timeline.value = 0;
    timeline.max = video.duration;
    return
};

const handleTimeUpdate = () => {
    currenTime.innerText = formatTime(video.currentTime)
    timeline.value = video.currentTime;
    return
}

const handleTimeChange = (e) => {
    video.currentTime = e.target.value;
    return
}

let videoPaused = false;

const handleMouseDown = () => {
    videoPaused = video.paused? true:false;
    video.pause();
    return
}

const handleMouseUp = () => {
    if(videoPaused){
        video.pause();
    }else{
        video.play();
    }
    return
}

const handleFullScreen = () => {
    if(!document.fullscreenElement){
        videoContainer.requestFullscreen();
        fullScreen.innerText = "Exit Fullscreen";   
    } else{
        document.exitFullscreen();
        fullScreen.innerText = "Enter Fullscreen";
    }
    return;
}

let controlsTimeout = null;
let mouseMovementTimeout = null;

const hideControls = () => videoController.classList.remove("showing");

const handleMouseMove = () => {
    if(controlsTimeout){
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }
    if(mouseMovementTimeout){
        clearTimeout(mouseMovementTimeout)
        controlsMovementTimeout = null;
    }
    videoController.classList.add("showing");
    mouseMovementTimeout = setTimeout(hideControls, 3000);
    return;
}

const handleMouseLeave = () => {
    controlsTimeout = setTimeout(hideControls, 3000);
    return;
}

const handleKeyDown = (event) => {
    if (event.code === "Escape") {
      document.exitFullscreen();
      fullScreen.innerText = "Enter fullscreen";
    }
    if (event.code === "KeyF") {
      videoContainer.requestFullscreen();
      fullScreen.innerText = "Exit fullscreen";
    }
    if (event.code === "Space") {
      handlePlay();
    }
    if (event.code === "ArrowRight") {
      timeline.value += 1;
      video.currentTime += 1;
    }
    if (event.code === "ArrowLeft") {
      if (video.currentTime > 0) {
        timeline.value -= 1;
        video.currentTime -= 1;
      }
    }
    return;
  };

if (video.readyState === 4) {
    handleLoadedMetadata();
  }

playBtn.addEventListener("click", handlePlay);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);
timeline.addEventListener("input", handleTimeChange);
timeline.addEventListener("mousedown", handleMouseDown);
timeline.addEventListener("mouseup", handleMouseUp);
fullScreen.addEventListener("click", handleFullScreen);
document.addEventListener("keydown", handleKeyDown);