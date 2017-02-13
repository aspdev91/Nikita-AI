function retrieveSong(cmd){
	console.log('cmd',cmd)
	songSelection = {
		'sadness': '/storage/emulated/0/mp3/DontWorryBeHappy.mp3',
		'less angry': '/storage/external_SD/mp3/Yellow.mp3',
		'joy': '/storage/external_SD/mp3/Happy.mp3',
		'meditation': '/storage/emulated/0/mp3/Meditation.mp3'
	}
	speech.Cancel();
	song = songSelection[cmd]
	player = app.CreateMediaPlayer();
	player.SetFile( song )
	player.SetOnReady( player_OnReady );
	player.SetOnComplete( player_OnComplete );
	while(player.IsPlaying()){
	    Send("rgt100#");
	    setTimeout( Send("lft100#"), 1000 )
	}
		
}

function player_OnReady()
{
	//Get file duration.

	dur = player.GetDuration();
	app.ShowPopup( "Ready" );
	player.SeekTo( 0 );	
	app.TextToSpeech('Here, try some meditation',1,1,player.Play());
}

//Called when playback has finished.
function player_OnComplete()
{
	app.ShowPopup( "Finished" );

}