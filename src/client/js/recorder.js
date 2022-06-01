const startBtn = document.getElementById("startBtn");

const handleStart = async() => {
    const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
    });
    return;
}

startBtn.addEventListener("click", handleStart);