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
    if(video.paused){
        video.play();
    } else{
        video.pause();
    }
    playBtn.innerText = video.paused? "Play":"Pause";
    return;
}

const handleMute = (e) => {
    if(video.muted){
        video.muted = false;
        volumeRange.value = video.volume;
    } else {
        volumeRange.value = 0;
        video.muted = true;
    }
    muteBtn.innerText = video.muted ? "Unmute":"Mute";
    return;
}

const handleVolumeChange = (e) => {
    muteBtn.innerText = "Mute";
    video.muted = false;
    video.volume = e.target.value;
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

const handleKeydown = (event) => {
    console.log(event.code);
    if(event.code=="Escape"){
        document.exitFullscreen();
        fullScreen.innerText = "Enter Fullscreen";
    }
    if(event.code=="KeyF"){
        videoContainer.requestFullscreen();
        fullScreen.innerText = "Exit Fullscreen";   
    }
    if(event.code=="Space"){
        handlePlay();
    }
    return
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
document.addEventListener("keydown", handleKeydown);