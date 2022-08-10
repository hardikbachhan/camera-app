let recordBtn = document.querySelector(".record-btn");
let recordBtnCont = document.querySelector(".record-btn-cont");
let captureBtn = document.querySelector(".capture-btn");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let timer = document.querySelector(".timer");
let timerCont = document.querySelector(".timer-cont");
let video = document.querySelector("video");
let mediaRecorder;
let constraints = {
    video: true,
    audio: false,
};
let filterColor = "transparent";

// this wil store the video mediastream.
let chunks = [];
navigator.mediaDevices.getUserMedia(constraints)
.then ((stream) => {
    video.srcObject = stream;
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.addEventListener("start", () => {
        console.log("rec-started");
    });
    // 11s, timeslice -> 2s, chunks = [0-2, 2-4, 4-6, 6-8, 8-10, 10-11]
    mediaRecorder.addEventListener("dataavailable", (e) => {
        chunks.push(e.data);
        // single blob of video created
        console.log("rec started");

    });
    mediaRecorder.addEventListener("stop", () => {
        let blob = new Blob(chunks, {type: "video/mp4"});
        console.log("rec-stopped");
        let videoURL = URL.createObjectURL(blob);
        console.log(videoURL);

        let a = document.createElement("a");
        a.href = videoURL;
        a.download = "myVideo.mp4";
        a.click();
    });
})

let isRecording = false;
recordBtnCont.addEventListener("click", () => {
    if (!isRecording) {
        mediaRecorder.start();
        startTimer();
        recordBtn.classList.add("scale-record");
        timer.style.display = "flex";
    } else {
        mediaRecorder.stop();
        // stopTimer();
        recordBtn.classList.remove("scale-record");
        timer.style.display = "none";
    }
    isRecording = !isRecording;
});

let timerId;
function startTimer() {
    timer.style.display = "block";
    let counter = 0;
    function displayTimer() {
        let totalSeconds = counter;
        let hours = Number.parseInt(totalSeconds / 3600);
        totalSeconds = totalSeconds % 3600;

        let minutes = Number.parseInt(hours / 60);
        totalSeconds = totalSeconds % 60;

        let seconds = totalSeconds;

        hours = hours < 10 ? `0${hours}` : hours;
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        seconds = seconds < 10 ? `0${seconds}` : seconds;

        timer.innerText = `${hours}:${minutes}:${seconds}`;

        counter++;
    }
    timerId = setInterval(displayTimer, 1000);
}

function stopTimer() {
    clearInterval(timerId);
    timer.innerText = "00:00:00";
    timer.style.display = "none";
}

captureBtnCont.addEventListener("click", () => {
    captureBtn.classList.add("scale-capture");
    // canvas
    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    context.fillStyle = filterColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    let image = canvas.toDataURL("image/jpeg");
    let a = document.createElement("a");
    a.href = image;
    a.download = "myPic.jpeg";
    a.click();

    setTimeout(() => {
        captureBtn.classList.remove("scale-capture")
    }, 1000);
});

// adding filter on video
let allFilters = document.querySelectorAll(".filter");
let filterLayer = document.querySelector(".filter-layer");
allFilters.forEach((filterEle) => {
    filterEle.addEventListener("click", () => {
        filterColor = window.getComputedStyle(filterEle).getPropertyValue("background-color");
        filterLayer.style.backgroundColor = filterColor;
    });
});