
var ACK_HEADER    = "ACK  ";
var END_HEADER    = "END  ";
var STVIS_HEADER  = "STVIS";
var STSIM_HEADER  = "STSIM";
var TRAJ_HEADER   = "TRAJ ";
var MTRIC_HEADER  = "MTRIC";
var ACC_FIELD     = "ACC  ";
var REJ_FIELD     = "REJ  ";

var ACCEPTED_STEPS_FIELD_NAME   = "AcceptedSteps";
var ENERGY_FIELD_NAME           = "Energy";

var trajectory1 = new Array ();
var trajectory2 = new Array ();

var mtrcTraj1;
var mtrcTraj2;

var jsonArr = [];



///////////////////////////////////////////////////////////////
/// \brief
/// Is it an ACK message?
///
/// \param str [In] Message payload.
///
/// \return True if it is an ACK message. False otherwise.
///
///////////////////////////////////////////////////////////////

function isACK(msg)
{
    return msg == ACK_HEADER;
}

///////////////////////////////////////////////////////////////
/// \brief
/// Create an ACK text message payload.
///
/// \return An ACK text message payload.
///
///////////////////////////////////////////////////////////////
function createACK()
{
    return ACK_HEADER;
}


///////////////////////////////////////////////////////////////
/// \brief
/// Is it an END message?
///
/// \param msg [In] Message payload.
///
/// \return True if it is an END message. False otherwise.
///
///////////////////////////////////////////////////////////////
function isEND(msg)
{
    return msg == END_HEADER;
}

///////////////////////////////////////////////////////////////
/// \brief
/// Create an END text message payload.
///
/// \return An END text message payload.
///
///////////////////////////////////////////////////////////////
function createEND()
{
    return END_HEADER;
}



///////////////////////////////////////////////////////////////
/// \brief
/// Create an STSIM text message payload.
///
/// \return An STSIM text message payload.
///
///////////////////////////////////////////////////////////////
function createSTSIM()
{
    return STSIM_HEADER;
}

///////////////////////////////////////////////////////////////
/// \brief
/// Is it a MTRIC message?
///
/// \param msg [In] Message payload.
///
/// \return True if it is a MTRIC message. False otherwise.
///
///////////////////////////////////////////////////////////////
function isMTRIC(msg)
{
    return msg.substr (0, 5) == MTRIC_HEADER;
}

///////////////////////////////////////////////////////////////
/// \brief
/// parse the data fields from a MTRIC message and store the in arrays
/// to be displayed by d3
///
/// \param msg [In] The MTRIC message payload.
///
/// \returns a MTRICMsg object with the data from the message.
///////////////////////////////////////////////////////////////
function parseMTRICdata(msg)
{
    var mtric = new Object();
    var index;
    var msgLines;
    
    mtric.trajectoryNumber  = msg.substr ( 5, 5);
    mtric.stepNumber        = msg.substr (10, 5);
    mtric.acceptanceField   = msg.substr (15, 5);  
    
    if (mtric.acceptanceField == ACC_FIELD)
    {
        mtric.isAcceptedStep    = true;
        
//MTRIC    2  157ACC  AcceptedSteps=73
//Energy=-6728.26
        msgLines    = msg.substr ( 20, msg.length );
        field       = msgLines.split("\n");
            
        if (field[0].substr (0,ACCEPTED_STEPS_FIELD_NAME.length) != ACCEPTED_STEPS_FIELD_NAME)
        {
            console.error ( "First line of MTRIC message should start with '",  ACCEPTED_STEPS_FIELD_NAME, "' but found line", field[0] ); 
            return;
        }
        
        mtric.acceptedSteps = field[0].split("=")[1];
        
        if (field[1].substr (0,ENERGY_FIELD_NAME.length) != ENERGY_FIELD_NAME)
        {
            console.error ("Second line of MTRIC message should start with '", ENERGY_FIELD_NAME, "' but found line ", field[1] );
            return;
        }
        
        mtric.energy = field[1].split("=")[1];
       
        
    }
    else if (mtric.acceptanceField == REJ_FIELD)
    {
        mtric.isAcceptedStep = false;
    }
    else
        console.error ("Unrecognized acceptance field in MTRIC message.");
    
    console.log(mtric);
    // Tendrá que estar todo en una misma gráfica. Anteriormente se ha incializado el Array de Datos
    // Según número de pasos y número de trayectorias, en este caso 2
    
    /*if (mtric.trajectoryNumber == 1 )
    {
        mtrcTraj1 = mtric;
        trajectory1.push (mtric);
    }
    else if (mtric.trajectoryNumber == 2)
    {
        mtrcTraj2 = mtric;
        trajectory2.push (mtric);
    }*/
    
    // access the trajectory 1 energy
    // console.log (parseFloat (trajectory1[0].energy));
    //
   // alert("Antes de actualizar");
    if (mtric.isAcceptedStep)
        actualizar_json(parseInt(mtric.acceptedSteps),parseInt(mtric.trajectoryNumber),parseFloat(mtric.energy));
    
    
}

