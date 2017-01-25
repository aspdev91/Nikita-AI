function FaceDetectRec(cmd){
    cam.TakePicture('/storage/external_SD/NikitaFaceIdentityRecc.jpg'); 
    setTimeout(() => {ProcessFaceDetectImage(cmd)},1000)
    faceDetectCommand = cmd;
}

// function DelayImageProcessing(cmd){
//     ProcessFaceDetectImage(faceDetectCommand);
// }

function ProcessFaceDetectImage(cmd){
    let img = app.ReadFile('/storage/external_SD/MyPic3.jpg','base64')
    let formattedImg = 'data:image/jpeg;base64,' + img
    parsedImg = makeblob(formattedImg)
    
    ConfirmNameAndAction(cmd) 
}

function ConfirmNameAndAction(cmd){
	if(cmd.includes("introduce") || cmd.includes("meet") || cmd.includes("this is my")){
		speech.SetOnResult( speech_OnResultName );
		recName = cmd.split(" ")
		recName = recName[recName.length -1]
		app.TextToSpeech(`Nice to meet you. ${recName}, right?`,1,1,Listen);
	} else {
		SendRequestFaceId('detect')
	}
}

function SendRequestFaceId( intent, faceId, personId, name ) { 
    var httpRequest = new XMLHttpRequest(); 
    var api_key = ''
    if(intent == 'detect'){
	    let url = 'https://api.projectoxford.ai/face/v1.0/detect'
	    httpRequest.onreadystatechange = function() { HandleReplyFaceId(httpRequest, intent); };  
	    httpRequest.open("POST", url, true); 
	    httpRequest.setRequestHeader("Ocp-Apim-Subscription-Key",
	    api_key); 
	    httpRequest.setRequestHeader("Content-Type",
	    "application/octet-stream"); 
	    httpRequest.send(parsedImg); 
	} else if(intent == 'identify') {
		let url = 'https://api.projectoxford.ai/face/v1.0/identify'
	    httpRequest.onreadystatechange = function() { HandleReplyFaceId(httpRequest, intent); };  
	    httpRequest.open("POST", url, true); 
	    httpRequest.setRequestHeader("Ocp-Apim-Subscription-Key",
	    api_key); 
	    httpRequest.setRequestHeader("Content-Type",
	    "application/json"); 
	    params = {
	    	"faceIds": [faceId],
	    	"personGroupId": 'nikita',
			"maxNumOfCandidatesReturned":1,
    		"confidenceThreshold": 0.3
    	}
    	httpRequest.send(JSON.stringify(params));
	} else if(intent == 'train'){
	    let url = 'https://api.projectoxford.ai/face/v1.0/persongroups/nikita/train'
	    httpRequest.onreadystatechange = function() { HandleReplyFaceId(httpRequest, intent); };  
	    httpRequest.open("POST", url, true); 
	    httpRequest.setRequestHeader("Ocp-Apim-Subscription-Key",
	    api_key); 
	    httpRequest.send(null); 	
	} else if(intent == 'add a person'){
	    let url = 'https://api.projectoxford.ai/face/v1.0/persongroups/nikita/persons'
	    httpRequest.onreadystatechange = function() { HandleReplyFaceId(httpRequest, intent); };  
	    httpRequest.open("POST", url, true); 
	    httpRequest.setRequestHeader("Ocp-Apim-Subscription-Key", api_key); 
	    httpRequest.setRequestHeader("Content-Type",
	    "application/json"); 	   
	    userData = '0/' + GetCurrentTime()
	    console.log(userData);
	    console.log(name)
	    params = { "name":name, "userData":userData} 
	    httpRequest.send(JSON.stringify(params)); 	 	  		
	} else if(intent == 'add a person face'){
	    let url = 'https://api.projectoxford.ai/face/v1.0/persongroups/nikita/persons/' + personId + '/persistedFaces'
	    console.log(personId)
	    httpRequest.onreadystatechange = function() { HandleReplyFaceId(httpRequest, intent); };  
	    httpRequest.open("POST", url, true); 
	    httpRequest.setRequestHeader("Ocp-Apim-Subscription-Key",
	    api_key); 
	    httpRequest.setRequestHeader("Content-Type",
	    "application/octet-stream"); 
	    httpRequest.send(parsedImg); 	 	  		
	} else if(intent == 'get a person'){
		let url = 'https://api.projectoxford.ai/face/v1.0/persongroups/nikita/persons/' + personId
	    httpRequest.onreadystatechange = function() { HandleReplyFaceId(httpRequest, intent); };  
	    httpRequest.open("GET", url, true); 
	    httpRequest.setRequestHeader("Ocp-Apim-Subscription-Key",
	    api_key); 
	    httpRequest.send(null);
	}
    app.ShowProgress( "Loading..." ); 
} 

function HandleReplyFaceId( httpRequest, intent ) { 
    if( httpRequest.readyState==4 ){ 
        //If we got a valid response. 
        if( httpRequest.status==200 ){ 
            console.log( "Response: " + httpRequest.status + httpRequest.responseText); 
            FaceRecEngine(intent, JSON.parse(httpRequest.responseText))
        } else if( httpRequest.status==202 && intent=="train" ){
            console.log("Training request performed")   
        }
        //An error occurred 
        else{
           console.log( "Error: " + httpRequest.status + httpRequest.responseText); 
           app.TextToSpeech( "There was an error performing the recognition. Mike, check the debug log.", 1, 1)
        }
    } 
  app.HideProgress(); 
} 

function FaceRecEngine(intent, result){
	if(intent == "add a person"){
		SendRequestFaceId("add a person face", null,result["personId"],null)
	} else if(intent == "add a person face"){
		SendRequestFaceId("train")
	} else if(intent == "detect"){
	    if(result[0] == undefined){
		    app.TextToSpeech("I don't see anyone in sight... Am I going crazy?")  
	    } else{
		    SendRequestFaceId("identify", result[0]["faceId"])
	    }
	} else if(intent == "identify"){
	    if(result[0]["candidates"][0] == undefined){
		    app.TextToSpeech("I can't recognize this person. Try different lighting or retraining my recognition model.")  
	    } else{
	        SendRequestFaceId("get a person",null,result[0]["candidates"][0]["personId"])
	    }
	} else if(intent == "get a person"){
		app.TextToSpeech(`You must be ${result["name"]}. Let me know if you need anything!`,1,1,SendRequestFaceId("add a person face", null,result["personId"],null)) 
	}
}

function speech_OnResultName(results, partial){
	if( !partial ){
		speech.SetOnResult( speech_OnResult )
		let cmd = results[0].toLowerCase();
		console.log( cmd );
		if(cmd.includes("yes") || cmd.includes("yeah")){ SendRequestFaceId("add a person",null,null,recName)}
		else if(cmd.includes("no")){ SendRequestFaceId("add a person", cmd.split("no ")[1]) }
	}
}

function speech_OnResultName(results, partial){
	if( !partial ){
		speech.SetOnResult( speech_OnResult )
		let cmd = results[0].toLowerCase();
		console.log( cmd );
		if(cmd.includes("yes") || cmd.includes("yeah")){ SendRequestFaceId("add a person",null,null,recName)}
		else if(cmd.includes("no")){ SendRequestFaceId("add a person", cmd.split("no ")[1]) }
	}
}

function GetCurrentTime(){
    let today = new Date(); 
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return date+' '+time;
}


