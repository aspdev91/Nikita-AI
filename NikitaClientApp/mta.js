function RetrieveTrainSchedule(){
	SendRequestMTA();
}

function SendRequestMTA(){ 
    var httpRequest = new XMLHttpRequest();
    url = 'http://mtaapi.herokuapp.com/api?id=G18S'
    httpRequest.onreadystatechange = function() { HandleReplyMTA(httpRequest); };  
    httpRequest.open("GET", url, true); 
    httpRequest.send(null);
    
    app.ShowProgress( "Loading..." ); 
} 

function HandleReplyMTA( httpRequest ){  
    if( httpRequest.readyState==4 ){
        if( httpRequest.status==200 ){ 
            console.log( "Response: " + httpRequest.status + httpRequest.responseText);
            GetLatestTime(JSON.parse(httpRequest.responseText).result.arrivals)
        } 
        else 
           console.log( "Error: " + httpRequest.status + httpRequest.responseText); 
    } 
  app.HideProgress(); 
} 

function GetLatestTime(schedule){

	let formattedTimes = schedule.map((element) => {
		return timeParser(element)
	})

	let sortedResult = formattedTimes.sort().unique();

	let cTime = new Date();
	let cHour = cTime.getHours();
	let cMinute = cTime.getMinutes();
	let timeNow = '';
	cHour.toString().length == 2 ? timeNow += cHour : timeNow += '0' + cHour;
	cMinute.toString().length == 2 ? timeNow += cMinute : timeNow += '0' + cMinute;
	console.log(sortedResult)
	let arrivalTimes = findNextArrivalTimes(sortedResult, timeNow)
	let result = 'The next M R trains will arrive at 46th street Astoria in ' + arrivalTimes[0].toString() + ' ' + arrivalTimes[1].toString() + ' and ' + arrivalTimes[2].toString() + 'minutes'
	return result 
}



function timeParser(time){
	return time.slice(0,2) + time.slice(3,5)
}

function inMinutes(time){
	return Number(time.slice(0,2)) * 60 + Number(time.slice(2,4))
}

function findNextArrivalTimes(array, number) {
    var num = 0;
    for (var i = array.length - 1; i >= 0; i--) {
        if(Math.abs(number - array[i]) < Math.abs(number - array[num])){
            num = i;
        }
    }
    number = inMinutes(number)
    	return [inMinutes(array[num+1]) - number,inMinutes(array[num+2]) - number, inMinutes(array[num+3]) - number]
}

