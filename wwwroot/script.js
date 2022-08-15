// This function is called by our blazor page's OnAfterRenderAsync method 
// to wire up blazor to the javascript
function setBlazorPageReference(blazorPageHook) {
    window.blazorPageHook = blazorPageHook;
}

//This function is called when you try to upload an image
function saveFileToBlazor() {
    const fileField = document.querySelector('#file-input');
    if (fileField.files.length <= 0) {
        alert("You need to add a file, goofball");
        return;
    }
    // get a handle on the file reference
    const file = document.querySelector('#file-input').files[0];  
    // Create a filereader instance from FileReader() API
    var fileReader = new FileReader(); 

    //Add a listener to the file  reader
    fileReader.addEventListener("load", function () {
        // When the image is loaded, we want to get a Unit8Array of the file so we can stream it up to blazor
        const base64ImageSrc = new Uint8Array(fileReader.result);
        //we add the data stream-able data to a function which our blazor code will call to get the data stream 
        window.fileDataStream = function () {
            return base64ImageSrc;
        };

        //Finally, invoke the save file back on our blazor page to come fetch the fileDataStream,
        //passing along the file name and type for processing purposes
        window.blazorPageHook.invokeMethodAsync('SaveFile',
            file.name,
            file.type)
            .then(result => {
                alert(result);
                fileField.value = null;
            });

       
    }, false);

    //now try to process the file's data via the file reader
    if (file) {
        fileReader.readAsArrayBuffer(file);
       
    } else {
        reject("No file selected");
    }
}
