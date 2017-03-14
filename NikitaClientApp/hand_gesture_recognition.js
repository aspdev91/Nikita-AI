app.LoadScript("nikita.js")

function recognizeHandGesture(cmd) {
    cam.TakePicture('/storage/emulated/0/nikita_right1.jpg');
    setTimeout(() => { processHandGesture(cmd) }, 1000)
    faceDetectCommand = cmd;
}

// function DelayImageProcessing(cmd){
//     ProcessFaceDetectImage(faceDetectCommand);
// }

function processHandGesture(cmd) {
    let img = app.ReadFile('/storage/emulated/0/nikita_hand_right.jpg', 'base64')
    let formattedImg = 'data:image/jpeg;base64,' + img
    parsedImg = makeblob(img)


    sendRequestHandGesture()
}


function sendRequestHandGesture() {
    var httpRequest = new XMLHttpRequest();
    let url = 'http://72.226.12.17:4000/'
    httpRequest.onreadystatechange = function () { handleReplyHandGesture(httpRequest); };
    httpRequest.open("POST", url, true);
    httpRequest.setRequestHeader("Content-Type",
        "application/octet-stream");
    httpRequest.send(parsedImg);
    app.ShowProgress("Loading...");
}

function handleReplyHandGesture(httpRequest) {
    if (httpRequest.readyState == 4) {
        //If we got a valid response. 
        if (httpRequest.status == 200) {
            console.log("Response: " + httpRequest.status + httpRequest.responseText);
            handGestureRecEngine(JSON.parse(httpRequest.responseText))
        }
        //An error occurred 
        else {
            console.log("Error: " + httpRequest.status + httpRequest.responseText);
            app.TextToSpeech("There was an error performing the hand gesture recognition. Mike, check the debug log.", 1, 1)
        }
    }
    app.HideProgress();
}

function handGestureRecEngine(result) {
    console.log(result.body)
    if (result.direction === "left") {
        VoiceCommand( "lft100#", 3000, "Turning left" )
    } else {
        VoiceCommand( "rgt100#", 3000, "Turning right" )
    }
}



var makeblob = function (dataURL) {
            var BASE64_MARKER = ';base64,';
            if (dataURL.indexOf(BASE64_MARKER) == -1) {
                var parts = dataURL.split(',');
                var contentType = parts[0].split(':')[1];
                var raw = decodeURIComponent(parts[1]);
                return new Blob([raw], { type: contentType });
            }
            var parts = dataURL.split(BASE64_MARKER);
            var contentType = parts[0].split(':')[1];
            var raw = window.atob(parts[1]);
            var rawLength = raw.length;

            var uInt8Array = new Uint8Array(rawLength);

            for (var i = 0; i < rawLength; ++i) {
                uInt8Array[i] = raw.charCodeAt(i);
            }

            return new Blob([uInt8Array], { type: contentType });
        }
