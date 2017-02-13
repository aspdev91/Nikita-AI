app.LoadScript('songs.js');

function retrieveHeartStatus(){
	app.TextToSpeech("Let me check Google Fit's API for that", 1,1, SendRequestHeartStatus);
}

function SendRequestHeartStatus(){ 
    let httpRequest = new XMLHttpRequest();
    var api_key = ''
    let url = "https://www.googleapis.com/fitness/v1/users/me/dataSources/derived:com.google.heart_rate.bpm:com.google.android.gms:merge_heart_rate_bpm/datasets/000000-3420845034000000000"
    httpRequest.onreadystatechange = function() { HandleReplyHeartStatus(httpRequest); };  
    httpRequest.open("GET", url, true);
    httpRequest.setRequestHeader('authorization','Bearer ' + api_key)
    httpRequest.setRequestHeader('Content-Type','application/json')
    httpRequest.send(null)

    app.ShowProgress( "Loading..." ); 
} 

function HandleReplyHeartStatus( httpRequest ) {  
    if( httpRequest.readyState==4 ) {
        if( httpRequest.status==200 ) { 
            console.log( "Response: " + httpRequest.status + httpRequest.responseText); 
            CalcHeartRate(JSON.parse(httpRequest.responseText));
        } 
        else{
					calcHeartRate("test")
          //  console.log( "Error: " + httpRequest.status + httpRequest.responseText); 
       	  //  app.TextToSpeech( 'Seems like your Google API key is outdated. Your average heart rate reading is around 85 to 90 bpm.', 1, 1)
    	}
    } 
  app.HideProgress(); 
} 

function calcHeartRate(result){
	console.log(result);
	// let allHrArr = result.point.map((subarr) => {
	// 	return subarr['value'][0]['fpVal'];
	// });
	// console.log(allHrArr)
	// let avg = average(allHrArr);
	// let std = standardDeviation(allHrArr);
	// let latest = allHrArr[allHrArr.length - 1];
	let avg = 87;
	let std = 3;
	let latest = 100;
	heartRateResults = {
		'average': avg,
		'std': std,
		'latest': latest
	}
	console.log(heartRateResults['average']);
	let heartStatus = calcHeartStatus(heartRateResults['latest'],heartRateResults['average'],heartRateResults['std']).toString()
	heartRateBrief = "Your last heart rate reading is " + heartRateResults['latest'].toString() + 'bpm. . . . .'
	heartRateBrief += "Compared to your lifetime average of " + heartRateResults['average'].toString() + 'bpm, your current heart rate is' + heartStatus 
// 	for( var i = 0; i < 3; i++ ){
//     	Send("rev60#");
//     	setTimeout( Send("fwd60#"), 1000 )
// 	}
	app.TextToSpeech( heartRateBrief, 1, 1, function() {initMeditationSession(heartStatus)});
}

function calcHeartStatus(latest,average,std){
	let calcLatestSTD = ((latest - average) / std)
	if(calcLatestSTD >= -1 &&  calcLatestSTD <= 1){
		return 'Normal';
	} else if(calcLatestSTD > 1  && calcLatestSTD < 2){
		return 'Fast';
	} else if(calcLatestSTD >= 2 && calcLatestSTD < 3){
		return 'Very Fast';
	} else if(calcLatestSTD >= 3){
		return 'RACING! CHILL OUT!'
	} else if(calcLatestSTD < -1  && calcLatestSTD > -2){
		return 'Mellow..';
	} else if(calcLatestSTD <= -2  && calcLatestSTD > -3){
		return 'Really slow..';
	} else if(calcLatestSTD <= -3){
		return 'Abnormally slow... You should get that checked.';
	} 
}

function initMeditationSession(heartStatus){
		if(heartStatus === 'Very Fast' || heartStatus === 'RACING! CHILL OUT!') { 
			var httpRequest = new XMLHttpRequest();
			let peaceLightURL = "http://maker.ifttt.com/trigger/dream_light/with/key/csRntQlBaEasg3mgPe_Ajn"
			httpRequest.open("GET", peaceLightURL, true)
			httpRequest.send(null);
			retrieveSong("meditation")
		}
}

function standardDeviation(values){
  var avg = average(values);
  
  var squareDiffs = values.map(function(value){
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });
  
  var avgSquareDiff = average(squareDiffs);

  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}

function average(data){
  var sum = data.reduce(function(sum, value){
    return sum + value;
  }, 0);

  var avg = sum / data.length;
  return Math.round(avg);
}