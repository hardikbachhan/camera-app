let uid = new ShortUniqueId();
const recordBtn = document.querySelector(".record-btn");
const recordBtnCont = document.querySelector(".record-btn-cont");
const captureBtn = document.querySelector(".capture-btn");
const captureBtnCont = document.querySelector(".capture-btn-cont");
const timer = document.querySelector(".timer");
const timerCont = document.querySelector(".timer-cont");
const video = document.querySelector("video");
const gallery = document.querySelector(".gallery");
let mediaRecorder;
let constraints = {
    video: true,
    audio: false,
};
let filterColor = "transparent";

// this will store the video mediastream.
let chunks = [];
navigator.mediaDevices.getUserMedia(constraints)
.then ((stream) => {
    video.srcObject = stream;
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.addEventListener("start", () => {
        chunks = [];
        // console.log("rec-started");
    });
    // 11s, timeslice -> 2s, chunks = [0-2, 2-4, 4-6, 6-8, 8-10, 10-11]
    mediaRecorder.addEventListener("dataavailable", (e) => {
        chunks.push(e.data);
        // single blob of video created
        // console.log("rec started");

    });
    mediaRecorder.addEventListener("stop", () => {
        let blob = new Blob(chunks, {type: "video/mp4"});
        console.log("rec-stopped");
        let videoURL = URL.createObjectURL(blob);
        // console.log(videoURL);

        if (db) {
            let videoId = uid();
            let dbTransaction = db.transaction("video", "readwrite");
            let videoStore = dbTransaction.objectStore("video");
            let videoEntry = {
                id: videoId,
                blobData: blob,
            };
            let addRequest = videoStore.add(videoEntry, videoId);
            addRequest.onsuccess = function () {
                console.log("videoEntry added to the videoStore", addRequest.result);
            };
        }
        // let a = document.createElement("a");
        // a.href = videoURL;
        // a.download = "myVideo.mp4";
        // a.click();
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
    let imageURL = canvas.toDataURL("image/jpeg");

    if (db) {
        let imageId = uid();
        let dbTransaction = db.transaction("image", "readwrite");
        let imageStore = dbTransaction.objectStore("image");
        let imageEntry = {
            id: `img-${imageId}`,
            url: imageURL,
        };
        let addRequest = imageStore.add(imageEntry, imageId);
        addRequest.onsuccess = function () {
            console.log("imageEntry added to the imageStore", addRequest.result);
        }
        addRequest.onerror = function () {
            console.error("imageEntry not added to the imageStore", addRequest.error);
        }
    }

    // let a = document.createElement("a");
    // a.href = image;
    // a.download = "myPic.jpeg";
    // a.click();

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

gallery.addEventListener("click", () => {
    location.assign("./gallery.html");
})