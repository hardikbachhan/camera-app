const backBtn = document.querySelector(".back");
backBtn.addEventListener("click", () => {
    location.assign("./index.html");
});

setTimeout(() => {
    if (db) {
        let galleryCont = document.querySelector(".gallery-cont");

        let imageDBTransaction = db.transaction("image", "readonly");
        let imageStore = imageDBTransaction.objectStore("image");
        let imageRequest = imageStore.getAll();
        imageRequest.onsuccess = () => {
            if (imageRequest.result !== undefined) {
                // console.log("Images -> ", imageRequest.result);
                let imageResult = imageRequest.result;
                imageResult.forEach(imageObj => {
                    // console.log(imageObj);
                    let url = imageObj.url;
                    // console.log(url);
                    // create a img container
                    let imageEle = document.createElement("div");
                    imageEle.setAttribute("class", "media-cont");
                    imageEle.setAttribute("id", imageObj.id);
                    // add img to that container
                    imageEle.innerHTML = `
                        <div class="media">
                        <img src="${url}" />
                        </div>
                        <div class="delete action-btn">DELETE</div>
                            <div class="download action-btn">DOWNLOAD</div>
                    `;
                    // append child in gallery-cont
                    galleryCont.appendChild(imageEle);

                    let deleteBtn = imageEle.querySelector(".delete");
                    deleteBtn.addEventListener("click", deleteListener);

                    let downloadBtn = imageEle.querySelector(".download");
                    downloadBtn.addEventListener("click", downloadListener);

                });
            } else {
                console.error("no such images");
            };
        }

        let videoDBTransaction = db.transaction("video", "readonly");
        let videoStore = videoDBTransaction.objectStore("video");
        let videoRequest = videoStore.getAll();

        videoRequest.onsuccess = () => {
            let videoResult = videoRequest.result;
            videoResult.forEach((videoObj) => {
                let videoElem = document.createElement("div");
                videoElem.setAttribute("class", "media-cont");
                videoElem.setAttribute("id", videoObj.id);
                let url = URL.createObjectURL(videoObj.blobData);
                videoElem.innerHTML = `
                    <div class="media">
                    <video autoplay loop mute src="${url}" />
                    </div>
                    <div class="delete action-btn">DELETE</div>
                    <div class="download action-btn">DOWNLOAD</div>
                `;
                galleryCont.appendChild(videoElem);

                let deleteBtn = videoElem.querySelector(".delete");
                deleteBtn.addEventListener("click", deleteListener);

                let downloadBtn = videoElem.querySelector(".download");
                downloadBtn.addEventListener("click", downloadListener);
            });
        }
    }
}, 300);

function deleteListener(e) {
    // get id from e
    let parentCont = e.target.parentElement;
    // console.log(parentCont);
    let id = parentCont.getAttribute("id");
    // console.log(id);
    // go into the db of video/img
    let mediaType = id.split("-")[0];
    // console.log(mediaType);
    // get that video/img via id
    // delete it
    if (mediaType == "img") {
        let imageDBTransaction = db.transaction("image", "readwrite");
        let imageStore = imageDBTransaction.objectStore("image");
        imageStore.delete(id);
    } else {
        let videoDBTransaction = db.transaction("image", "readwrite");
        let videoStore = videoDBTransaction.objectStore("image");
        videoStore.delete(id);
    }
    // delete from frontend
    e.target.parentElement.remove();
}

function downloadListener(e) {
    let parentCont = e.target.parentElement;
    let id = parentCont.getAttribute("id");
    let mediaType = id.split("-")[0];
    // console.log(mediaType);
    if (mediaType == "img") {
        let imageDBTransaction = db.transaction("image", "readonly");
        let imageStore = imageDBTransaction.objectStore("image");
        let imageRequest = imageStore.get(id.split("-")[1]);
        // console.log(imageRequest);
        imageRequest.onsuccess = () => {
            let imageURL = imageRequest.result.url;
            let a = document.createElement("a");
            a.href = imageURL;
            a.download = `img-${id}`;
            a.click();
        }
    } else {
        let videoDBTransaction = db.transaction("video", "readonly");
        let videoStore = videoDBTransaction.objectStore("video");
        let videoRequest = videoStore.get(id.split("-")[0]);
        console.log(videoRequest);
        videoRequest.onsuccess = () => {
            let videoURL = URL.createObjectURL(videoRequest.result.blobData);
            let a = document.createElement("a");
            a.href = videoURL;
            a.download = `video-${id}`;
            a.click();
        }
    }
}