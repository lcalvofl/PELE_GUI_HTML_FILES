var output;
var canvas;
//var wsUri	= "ws://84.88.51.169:9002/"; 
var wsViz           = "ws://localhost:9005";          // viz server
var wsPseudoPele    = "ws://localhost:9002";

//var wsViz           = "ws://84.88.51.169:9005";          // viz server
//var wsPseudoPele    = "ws://84.88.51.169:9002";


var webSocketViz;
var webSocketPele;
var reader          = new FileReader();
var ctx;
var imgdata;
var stop 	= false;


var mouseDownFlag = false;


//var imageheight = 512;
//var imagewidth	= 512;

function init() 
{ 
	output = document.getElementById("output"); 

	// cheking for websocket support
	if (window.WebSocket)
	{
		connectAndCallbacks();
	}
	else
	{
		console.log ("This browser does not support Websocket.");
	}

	
	// adding mouse events
	canvas = document.getElementById('canvas');

	canvas.addEventListener( "contextmenu", preventDefaultHandler,	true );
	canvas.addEventListener( "mousedown", 	mouseDownHandler,       true );
    canvas.addEventListener( "mouseup",	    mouseUpHandler,         true );
    canvas.addEventListener( "mousemove", 	mouseMoveHandler, 	    true );
    canvas.addEventListener( "mousewheel", 	mouseWheelHandler,      true );

  	//document.addEventListener("keydown", 	keyDownHandler, false );
  	//document.addEventListener("keyup", 	keyUpHandler, 		false );

/*
	canvas.addEventListener("mousedown", mouseDown, false );
	canvas.addEventListener("mousemove", mouseMove, false );
	canvas.addEventListener("mouseup",	mouseUp, false );
*/

//	canvas.addEventListener("keypress", keys, true );


	ctx 	= canvas.getContext('2d');
	imgdata = ctx.getImageData(0,0,canvas.width,canvas.height);

	
	

}

// for viz websocke
function connectAndCallbacks ()
{
	webSocketViz		    = new WebSocket ( wsViz ); 
	webSocketViz.onopen 	= function(evt) { onOpen	(evt)	}; 
	webSocketViz.onclose 	= function(evt) { onClose	(evt)	}; 
	webSocketViz.onmessage	= function(evt) { onMessage	(evt)	}; 
	webSocketViz.onerror 	= function(evt) { onError	(evt)	};

	// sets websocket's binary messages as ArrayBuffer type
	//websocket.binaryType = "arraybuffer";	
	// sets websocket's binary messages as Blob type by default is Blob type
	//websocket.binaryType = "blob";
	
	reader.onload		= function(evt) { readBlob		(evt) };
	reader.onloadend	= function(evt) { nextBlob		(evt) };
	reader.onerror		= function(evt) { fileReaderError 	(evt) };

	peripherals		= new Peripherals ();
	peripherals.init(webSocketViz);
}


// connection has been opened viz websocke
function onOpen(evt)
{
	
}

function fileReaderError (e)
{
	console.error("FileReader error. Code " + event.target.error.code);
}

// this method is launched when FileReader ends loading the blob
function nextBlob (e)
{
	if (!stop)
		webSocketViz.send ("GiveMeMore");
	//console.log (stop);
}

// readBlob is called when reader.readAsBinaryString(blob); from onMessage method occurs
function readBlob (e)
{
	//console.log (canvas.width, canvas.height );
	var i,j=0;

    // if receiving float images
	//img = new Float32Array(reader.result);
 
	// if receiving unsigned byte images
	img = new Uint8Array(reader.result);

//console.log (imgdata.data.length);

// TODO: send data as  picture format to avoid this:

	//console.log ("result: ", + reader.target.result);
//	console.log("Blob size ", + reader.result.length + " ", + reader.result[10]);
//	console.log("Blob size ", + img.length + " ", + img[10]);


	// if img is float
/*
    for(i=0;i<imgdata.data.length;i+=4)
	{
		imgdata.data[i]		= img[j  ] * 255; //.charCodeAt(j);
		imgdata.data[i+1] 	= img[j+1] * 255; //reader.result.charCodeAt(j+1);
		imgdata.data[i+2] 	= img[j+2] * 255; //reader.result.charCodeAt(j+2);
		imgdata.data[i+3] 	= 255;
		j+=3;
	}
*/

 	 for(i=0;i<imgdata.data.length;i+=4)
	{
		imgdata.data[i]		= img[j  ] ; //.charCodeAt(j);
		imgdata.data[i+1] 	= img[j+1] ; //reader.result.charCodeAt(j+1);
		imgdata.data[i+2] 	= img[j+2] ; //reader.result.charCodeAt(j+2);
		imgdata.data[i+3] 	= 255;
		j+=3;
	}

	ctx.putImageData(imgdata,0,0);

}

// message from the server
function onMessage(e)
{
	if (typeof e.data == "string")
	{
		console.log ("String msg: ", e, e.data);
	}
	else if (e.data instanceof Blob)
	{
		var blob = e.data;

		//console.log ("Blob msg: ", blob);

		//reading data from Blob
		//reader.readAsBinaryString(blob);
		reader.readAsArrayBuffer(blob);

	}
	else if (e.data instanceof ArrayBuffer)
	{
		var img = new Uint8Array(e.data); 

		console.log("Array msg:", + img[63] );


	}


	//websocket.close ();
}

// is there is an error viz websocke
function onError (e)
{
	console.log("There was an error with Visualization server: ", e);
	// Custom functions for handling errors
	// handleErrors (e);
}

// when closing viz websocke
function onClose (e)
{
	console.log ("Connection closed", e);
	
}


function onOpenPele (e)
{
    webSocketPele.send ("STSIM");
}

function onClosePele (e)
{
    console.log ("PSEUDO PELE server has closed the connection.");
}

function onMessagePele (e)
{
    if (typeof e.data == "string")
    {
        //console.log ("String msg: ", e, e.data);
        //console.log (isACK (e.data));
        
        if (isMTRIC(e.data))
        {
            parseMTRICdata (e.data);
            // call d3 trayectory1  - trayectory2  - Aquí meteríamos el update() !! Se ha llamado desde
            //console.log ( mtrcTraj1 );
        }
        
        
	}
	else if (e.data instanceof Blob)
	{
	
	}
	else if (e.data instanceof ArrayBuffer)
	{
        
	}    
}

function onErrorPele (e)
{
    console.log ("There was an error with PSEUDO PELE server: ", e);
}


function initWebSocketPele ()
{
    webSocketPele		    = new WebSocket ( wsPseudoPele ); 
	webSocketPele.onopen 	= function(evt) { onOpenPele	(evt)	}; 
	webSocketPele.onclose 	= function(evt) { onClosePele	(evt)	}; 
	webSocketPele.onmessage	= function(evt) { onMessagePele	(evt)	}; 
	webSocketPele.onerror 	= function(evt) { onErrorPele	(evt)	};
}

function startingConnection()
{
	alert('Streaming ON...');
    
    initWebSocketPele ();

	webSocketViz.send ("STSIM");
	stop = false;

}
    
function closingConnection()
{
    alert('Streaming OFF...');
	webSocketViz.send ("END  ");
	stop = true;


	
	//websocket.close ();
}


window.addEventListener("load", init, false);  

