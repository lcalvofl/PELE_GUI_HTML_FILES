    
var jsonArr = [];

var total_steps=5;
var num_tot_traj = 2;

    //actualizar datos json
function llamar(){
    
    inicializar_json(0,1,80);
    /*sumar_json(1,2,40);
    sumar_json(0,2,35);
    sumar_json(1,1,30);
    sumar_json(3,1,60);*/
}


function inicializar_json(step,traj,energy){

    

    for (var i = 0; i < total_steps; i++){

                var json_aux = "{";

                json_aux = json_aux + "'date':'"+i+"',";

                for (var g=1;g<=num_tot_traj;g++){
                    if(g==num_tot_traj){
                      json_aux = json_aux+""+g+":'2'";
                    }else{
                      json_aux = json_aux+""+g+":'2',";
                    }
                }

    json_aux=json_aux+"}";


    
    //Inicializar el array a zeros
   
        jsonArr.push(json_aux);
    }

    alert(jsonArr);


}
   