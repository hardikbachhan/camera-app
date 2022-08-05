let recordBtn = document.querySelector(".record-btn");
let recordBtnCont = document.querySelector(".record-btn-cont");
let captureBtn = document.querySelector(".capture-btn");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let timer = document.querySelector(".timer");
let timerCont = document.querySelector(".timer-cont");


captureBtnCont.addEventListener("click", () => {
    captureBtn.classList.add("scale-capture");
    setTimeout(() => {
        captureBtn.classList.remove("scale-capture")
    }, 1000);
});

let isRecording = false;
recordBtnCont.addEventListener("click", () => {
    if (!isRecording) {
        recordBtn.classList.add("scale-record");
        timer.style.display = "flex";
    } else {
        recordBtn.classList.remove("scale-record");
        timer.style.display = "none";
    }
    isRecording = !isRecording;
});
