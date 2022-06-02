const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const init = async() => {
    stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
    });
    video.srcObject = stream;
    video.play();
    return;
}

init();

const handleDownload = () => {
    const a = document.createElement("a");
    a.href = videoFile;
    a.download = "recording.webm";
    document.body.appendChild(a);
    a.click();
}

const handleStop = () => {
    recorder.stop();
    startBtn.innerText = "Download Recording";
    startBtn.removeEventListener("click", handleStop);
    startBtn.addEventListener("click", handleDownload);
    return;
}

const handleStart = () => {
    startBtn.innerText = "Stop Recording";
    startBtn.removeEventListener("click", handleStart);
    startBtn.addEventListener("click", handleStop);
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => {
        videoFile = URL.createObjectURL(e.data);
        video.srcObj = null;
        video.src = videoFile;
        video.loop = true;
        video.play();
    }
    recorder.start();
    return;
}

startBtn.addEventListener("click", handleStart);