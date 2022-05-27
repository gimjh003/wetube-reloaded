console.log("video player");
const video = document.querySelector("video")
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");

video.volume = 0.5;

const handlePlay = (e) => {
    if(video.paused){
        video.play();
    } else{
        video.pause();
    }
    playBtn.innerText = video.paused? "Play":"Pause";
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
}

const handleVolumeChange = (e) => {
    muteBtn.innerText = "Mute";
    video.muted = false;
    video.volume = e.target.value;
}

playBtn.addEventListener("click", handlePlay);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);