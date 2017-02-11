app.LoadScript("nikita.js")

function recognizeHandGesture(cmd) {
    cam.TakePicture('/storage/external_SD/nikita_hand_gesture_recognition.jpg');
    setTimeout(() => { processHandGesture(cmd) }, 1000)
    faceDetectCommand = cmd;
}

// function DelayImageProcessing(cmd){
//     ProcessFaceDetectImage(faceDetectCommand);
// }

function processHandGesture(cmd) {
    let img = app.ReadFile('/storage/external_SD/nikita_hand_gesture_recognition.jpg', 'base64')
    let formattedImg = 'data:image/jpeg;base64,' + img
    parsedImg = makeblob(formattedImg)

    sendRequestHandGesture()
}


function sendRequestHandGesture() {
    var httpRequest = new XMLHttpRequest();
    let url = 'https://api.projectoxford.ai/face/v1.0/detect'
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
    if (result.direction === "left") {
        VoiceCommand( "lft100#", 3000, "Turning left" )
    } else {
        VoiceCommand( "rev100#", 3000, "Turning right" )
    }
}
