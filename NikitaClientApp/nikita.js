
//Load required scripts.
app.LoadScript( "Colors.js" );
app.LoadPlugin( "GalleryPick" );
app.LoadScript( "quotes.js" );
app.LoadScript( "songs.js" );
app.LoadScript( "mta.js" );
app.LoadScript( "news.js" );
app.LoadScript( "heart_rate.js" );
app.LoadScript( "emotions.js");
// app.LoadScript( "weather.js" );
app.LoadScript( "maps.js" );
// app.LoadScript( "uber.js" );
// app.LoadScript( "face_identity_rec.js");
app.LoadScript( "face_emotion_rec.js");
app.LoadScript( "hand_gesture_detection.js");
// app.LoadScript( "FaceIdentityRec.js");


//Init some global variables.
var program = "";
var prog = [];
var timer = 0;
var count = 0;
var checkColors = true;

//Called when application is started.
function OnStart()
{
    //Fix orientation to Portrait. 
    app.SetOrientation( "Portrait" );
    
    //Stop screen turning off.
    app.PreventScreenLock( true );
    
    //Create a main layout with objects vertically centered.
    lay = app.CreateLayout( "Linear", "VCenter,FillXY" );   
    lay.SetBackground( "/res/drawable/pattern_carbon", "repeat" );

    //Create program screen layout.
    layScreen = app.CreateLayout( "Linear", "Horizontal" );
    layScreen.SetBackground( "/res/drawable/lego_screen" );
    layScreen.SetMargins( 0,0,0,0.05 );
    lay.AddChild( layScreen );
    
    //Create program screen text view.
    txtScreen = app.CreateText( "", 0.85,0.2, "left" );
    txtScreen.SetMargins( 0.02,0.02,0.02,0.02 );
    layScreen.AddChild( txtScreen );
    

    //Create special buttons.
    laySpec = app.CreateLayout( "Linear", "Horizontal" );
    CreateButtons( laySpec, ["Buz","Del","Clr","Voice","Face","Hand"], "#424242" );
    lay.AddChild( laySpec );
    
    
    //Create tiny camera view control (virtualy invisible).
    var sw = app.GetScreenWidth(); 
    var sh = app.GetScreenHeight();
    cam = app.CreateCameraView( 1, 1 );
    cam.SetOnReady( cam_OnReady );
    lay.AddChild( cam ); 

    //Add layout to app.    
    app.AddLayout( lay );

    //Say something.
    app.SetVolume( "system", 1 )
    // app.TextToSpeech( "Hi Michael", 1, 1 );
    
    //Create recognition object and set callbacks.
    speech = app.CreateSpeechRec("Partial,NoBeep");
    speech.SetOnResult( speech_OnResult );
    speech.SetOnError( speech_OnError );
    
    //Create USB serial object.
    usb = app.CreateUSBSerial(); 
    if( !usb ) 
    {
        app.ShowPopup( "Please connect your Orion and restart" );
        return;
        return;
    }
    usb.SetOnReceive( usb_OnReceive );
    app.ShowPopup( "Connected" );
}

//Create multiple buttons of a given type.
function CreateButtons( lay, names, color )
{
    for( var i=0; i<names.length; i++ )
    {
        btn = app.CreateButton( names[i], 0.1, -1, "Custom" );
        btn.SetStyle( color, color, 4 );
        btn.SetOnTouch( OnButton );
        lay.AddChild( btn );
    }
}

//Called when a button is touched
function OnButton()
{
    var name = this.GetText();
    var isNum = parseInt(name) > -1;
    
    if( name=="Del" ) Delete();
    else if( name=="Clr" ) Clear();
    else if( name=="Voice" ) Voice();
    else if( name=="Face" ) faceEmotionRecog();
    else if( name == "Hand" ) recognizeHandGesture();
    else if( isNum ) AddValue( name );
    else AddCommand( name );
}

//Handle Run button.
function btnRun_OnTouch()
{
    if( this.GetText()=="Run" )
    {
        //Get command list to an array.
        prog = program.split(",");
        RunProgram();
        btnRun.SetText( "Stop" );
    }
    else
    {
        clearTimeout( timer );
        btnRun.SetText( "Run" );
    }
}

//Called when we get data from Orion.
function usb_OnReceive( data )
{
   console.log( data );
   
   //Extract ultrasonic distance measurement.
   var dist = ExtractVal( data, "dist" );
   
   //Stop and reverse robot if objects get too close.
  if( dist > 0 && dist < 15 )
  { 
      app.TextToSpeech( "Hello, I'm Nikita!", 1, 1 );
      Send( "fwd60#" );
      timer = setTimeout( Stop, 500 );
  }
}

//Extract values from serial data.
function ExtractVal( data, name )
{
   var val = 0;
   var matches = data.match( RegExp("dist:(.*?);") );
   if( matches ) val = matches[1];
   return val;
}

//Add a command to program.
function AddCommand( cmd )
{
    if( program.length>0 ) program += ", ";
    program += cmd;
    txtScreen.SetText( program );
}

//Add value to program
function AddValue( val )
{
    program += val;
    txtScreen.SetText( program );
}

//Delete last entry.
function Delete()
{
    program = program.slice(0,-1);
    txtScreen.SetText( program );
}

//Clear program
function Clear()
{
    program = "";
    txtScreen.SetText( program );
}

//Start face recognition

//Start voice recognition.
function Voice()
{
    speech.Cancel();
    let acknowledgements = ["Yes Mike?","How can I help?","What's up, Mike?","Talk to me","Mike, I'm listening","Tell me what you need, Mike"]
    var randSelAck = acknowledgements[Math.floor(Math.random() * acknowledgements.length)];
    app.TextToSpeech( randSelAck, 1, 1, Listen);
}

function Listen()
{
    //Start recognizing.
    setTimeout(speech.Recognize(),1000);
}

//Called with the recognition result(s).
function speech_OnResult( results, partial )
{
    if( !partial )
    {
        //Check for 'Nikita' key word.
        var cmd = results[0].toLowerCase();
        console.log( cmd );
        if( cmd=="nikita" || cmd=="wall e" || cmd=="all" )
        {
            speech.Cancel();
            let acknowledgements = ["Yes Mike?","How can I help?","What's up, Mike?","Talk to me","Mike, I'm listening","Tell me what you need, Mike"]
            var randSelAck = acknowledgements[Math.floor(Math.random() * acknowledgements.length)];
            app.TextToSpeech( randSelAck, 1, 1, Listen);
            return;
        }
        //Check for motion commands.
        else if( cmd.includes("go this") || cmd.includes("way") || cmd.includes("direction")) { app.TextToSpeech("Alright, I'll make an emergency call right away",1,1,callEmergency)}
        else if( cmd.includes("emergency") || cmd.includes("police") || cmd.includes("ambulance")) { app.TextToSpeech("Alright, I'll make an emergency call right away",1,1,callEmergency)}
        else if( cmd.includes("get to") || cmd.includes("go to") || cmd.includes("travel to")){ recognizeHandGesture() }
        else if( cmd.includes("who are you") || cmd.includes("what's your name")) { app.TextToSpeech("I'm Nikita, Michael's personal AI",1,1)}
        else if( cmd.includes("weather") ) { retrieveWeather(cmd);}
        else if( cmd.includes("stop playing")) { player.Stop(); }
        else if( cmd.includes("listen up") || cmd.includes("feel me") || cmd.includes("funeral")|| cmd.includes("mia") || cmd.includes("mio")  || cmd.includes("fuel") || cmd.includes("listen to me") ) { emotionAnalysis() }
        else if( cmd.includes("heart") || cmd.includes("park") || cmd.includes("hard rate") ) { retrieveHeartStatus() }
        else if( cmd.includes("wall-e stop talking") ) { speech.Cancel(); }
        else if( cmd.includes("get the news at") || cmd.includes("what's happening on ") || cmd.includes("tell me the news at") || cmd.includes("the news at") || cmd.includes("what's going on at")){ retrieveNews(cmd);}
        else if( cmd.includes("train leaving") || cmd.includes("the next train") || cmd.includes("the next trains") ) { RetrieveTrainSchedule() }
        else if( cmd=="right" || cmd=="ford" )  VoiceCommand( "rev60#", 3000, "Moving forward" );
        else if( cmd=="stop" )   VoiceCommand( "stp", 3000, "Stopping" );
        else if( cmd=="reverse" )  VoiceCommand( "fwd60#", 3000, "Reversing" );
        else if( cmd=="left" )  VoiceCommand( "lft100#", 3000, "Turning" );
        else if( cmd=="forward" || cmd=="go straight" || cmd=="ford" || cmd=="fore word" ) VoiceCommand( "rgt100#", 3000, "Going straight" )
        else if( cmd=="turn around" )  VoiceCommand( "rgt100#", 6000, "Turning" );
        else if( cmd=="who is the best" || cmd=="who's the best"  ) VoiceCommand("stp",9000,"Michael is the best")
        // else if( cmd=="say hi to mom" ) VoiceCommand("stp",1000,"Hi Chow");
        // else if( cmd=="say hi to dad" ) VoiceCommand("stp",1000,"Hi Lock");
        else if( cmd=="take a pick" || cmd=='take pick' || cmd=='take a photo' || cmd=='check my emotions' || cmd=='look at me' ) { FaceEmotionRecog() }
        else if( cmd.includes("say hi") || cmd.includes("meet my") || cmd.includes("who is") || cmd.includes("introduce you") ) { FaceDetectRec(cmd); }
        else if( cmd=="inspire me" || cmd=="enlighten me" || cmd=="quote of the day" || cmd=="tell me about love" ) { retrieveQuote(cmd); }
        else if( cmd.includes("in love") || cmd==" need motivation" || cmd=="i'm pumped" ) { retrieveSong(cmd); }
       
        //Else Restart recognition.
        // else 
        //     if( !speech.IsListening() ) speech.Recognize();
    }
}

//Handle voice commands.
function VoiceCommand( cmd, time, voice )
{
    Send( cmd );
    timer = setTimeout( Stop, time );
    app.TextToSpeech( voice, 1, 1, OnSpeechDone );
}

//Called if recognition fails.
function speech_OnError( error )
{
    //Restart recognition.
    app.TextToSpeech( "I didn't understand. Try again", 1, 1, Listen )
}

//Called when TextToSpeech is complete.
function OnSpeechDone()
{
    //Restart recognition.
    if( !speech.IsListening() ) speech.Recognize();
}


//Run the program.
function RunProgram()
{
    //Get and remove first element in program.
    var elem = prog.shift();
    
    //Check for end of program.
    if( !elem ) 
    {   
        btnRun.SetText( "Run" );
        Stop();
        app.TextToSpeech( "Program complete", 0.1,1.5 );
        return;
    }
    
    //Get text part and numeric part.
    elem = elem.trim();
    var cmd = elem.slice( 0,3 );
    var val = parseFloat(elem.slice(3));
    
    //Execute appropriate function.
    switch( cmd ) 
    {
        case "Fwd": Send( "rev60#" ); break;
        case "Rev": Send( "fwd60#" ); break;
        case "Lft": Send( "lft100#" ); break;
        case "Rgt": Send( "rgt100#" ); break;
        case "Stp": Send( "stp" ); break;
    }
    
    //Call this function again after delay.
    timer = setTimeout( RunProgram, val*1000 );
}

//Send a command to rover.
function Send( cmd )
{
    console.log( cmd );
    if( !usb ) return;
    usb.Write( cmd );
}

//Send stop command to rover.
function Stop()
{
   Send( "stp" );
}

//Called when camera is ready.
function cam_OnReady()
{    
    //Start preview.
  
    cam.StartPreview();

}
