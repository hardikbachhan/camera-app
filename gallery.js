const backBtn = document.querySelector(".back");
backBtn.addEventListener("click", () => {
    location.assign("./index.html");
});

setTimeout(() => {
    if (db) {
        let imageDBTransaction = db.transaction("image", "readonly");
        let imageStore = imageDBTransaction.objectStore("image");
        let imageRequest = imageStore.getAll();
        imageRequest.onsuccess = () => {
            if (imageRequest.result !== undefined) {
                console.log("Images -> ", imageRequest.result);
                let imageResult = imageRequest.result;
                let galleryCont = document.querySelector(".gallery-cont");
                imageResult.forEach(imageObj => {
                    // console.log(imageObj);
                    let url = imageObj.url;
                    console.log(url);
                    // create a img container
                    let imageEle = document.createElement("div");
                    imageEle.setAttribute("class", "media-cont");
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
                });
            } else {
                console.error("no such images");
            }
        }
    }
}, 300);