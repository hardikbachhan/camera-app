let openRequest = indexedDB.open("myDatabase");
let db;

openRequest.addEventListener("success", () => {
    console.log("Connection established successfully.");
    db = openRequest.result;
    // console.log(db);
})

openRequest.addEventListener("upgradeneeded", () => {
    // triggers if the client had no database
    // ...perform initialization...
    console.log("db upgraded OR initializated.");
    db = openRequest.result;

    db.createObjectStore("video", { keypath: "id" });
    db.createObjectStore("image", { keypath: "id" });
});

openRequest.addEventListener("error", () => {
    console.error("Error", openRequest.error);
});

// schema -> blue print -> how does my db look like, what all can i store in my db.
