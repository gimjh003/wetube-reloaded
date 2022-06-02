import {createFFmpeg, fetchFile} from "@ffmpeg/ffmpeg";
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

const handleDownload = async() => {
    const ffmpeg = createFFmpeg({log:true});
    await ffmpeg.load();
    ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile));
    await ffmpeg.run("-i", "recording.webm", "-r", "60", "recording.mp4");
    const mp4File = ffmpeg.FS("readFile", "recording.mp4");
    const mp4Blob = new Blob(mp4File.buffer, {type: "video/mp4"});
    const mp4Url = URL.createObjectURL(mp4Blob);
    const a = document.createElement("a");
    a.href = mp4Url;
    a.download = "recording.mp4";
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