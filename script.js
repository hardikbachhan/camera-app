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

// this wil store the video mediastream.
let chunks = [];
navigator.mediaDevices.getUserMedia(constraints)
.then ((stream) => {
    video.srcObject = stream;
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.addEventListener("start", () => {
        console.log("rec-started");
    });
    mediaRecorder.addEventListener("dataavailable", (e) => {
        chunks.push(e.data);
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

captureBtnCont.addEventListener("click", () => {
    captureBtn.classList.add("scale-capture");
    setTimeout(() => {
        captureBtn.classList.remove("scale-capture")
    }, 1000);
});

let isRecording = false;
recordBtnCont.addEventListener("click", () => {
    if (!isRecording) {
        mediaRecorder.start();
        recordBtn.classList.add("scale-record");
        timer.style.display = "flex";
    } else {
        mediaRecorder.stop();;
        recordBtn.classList.remove("scale-record");
        timer.style.display = "none";
    }
    isRecording = !isRecording;
});
