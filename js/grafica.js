var date1 = [{
	    'date': '1',
	        1: '63.4',
	        2: '62.7',
	        3: '72.2'
	}, {
	    'date': '2',
	        1: '58',
            2: '0',
	        3: '67.7'
	}, {
	    'date': '3',
	        1: '53.3',
	        2: '59.1',
	        3: '69.4'
	}, {
	    'date': '4',
	        1: '35.7',
	        2: '58.8',
	        3: '68'
	},  ];

var date2 = [{
	    'date': '1',
	        1: '63.4',
	        2: '62.7',
	        3: '72.2'
	}, {
	    'date': '2',
	        1: '58',
	        2: '59.9',
	        3: '67.7'
	}, {
	    'date': '3',
	        1: '53.3',
	        2: '59.1',
	        3: '69.4'
	}, {
	    'date': '4',
	        1: '35.7',
	        2: '58.8',
	        3: '68'
	}, {
	    'date': '5',
	        1: '34.2',
	        2: '58.7',
	        3: '72.4'
	}];


var date3 = [ {'date':'0',1:'2',2:'2'},{'date':'1',1:'3',2:'2'},{'date':'2',1:'2',2:'2'},{'date':'3',1:'2',2:'2'},{'date':'4',1:'2',2:'2'}];


/* Some global vars */


var total_steps=73;  //Definirá el número de pasos de la trayectoria

var jsonArr = [];   //Establece el array/json que contendrá los datos

var num_tot_traj = 2; //Establece el número total de trayectorias a dibujar

var json_aux="";  //Variable aux, para actualizar el array con datos de websocket

var last_energy;  //Contiene la última energia procesada


/* Graphic margins */


	var margin = {
	    top: 10,
	    right: 15,
	    bottom: 100,
	    left: 40
	}, margin2 = {
	    top: 430,
	    right: 10,
	    bottom: 20,
	    left: 400
	}, width = 420 - margin.left - margin.right, /*960*/
	    height = 480 - margin.top - margin.bottom,
	    height2 = 480 - margin2.top - margin2.bottom;

	var parseDate = d3.time.format("%Y%m%d").parse;

    /* Establece las unidades de los ejes) x,y */
	var x = d3.scale.linear().range([0, width]),   /* d3.time.scale().range([0, width]),*/
	    x2 = d3.scale.linear().range([0, width]),
	    y = d3.scale.linear().range([height, 0]),
	    y2 = d3.scale.linear().range([height2, 0]);
    
    /* Establece las posiciones de los ejes */ 
	var xAxis = d3.svg.axis().scale(x).orient("bottom"),
	    xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
	    yAxis = d3.svg.axis().scale(y).orient("left"),
	    yAxis2 = d3.svg.axis().scale(y2).orient("left").ticks(2);

	var color = d3.scale.category10();

	

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var line = d3.svg.line().x(function (d) {
	    return x(d.date); 
	})
	    .y(function (d) {
	    return y(d.probability);
	});

	var line2 = d3.svg.line().x(function (d) {
	    return x2(d.date);
	})
	    .y(function (d) {
	    return y2(d.probability);
	});

	var svg = d3.select("#graph").append("svg").attr("width",
	width + margin.left + margin.right).attr("height",
	height + margin.top + margin.bottom);

	svg.append("defs").append("clipPath").attr("id", "clip").append("rect")
	    .attr("width", width).attr("height", height);

	var div = d3.select("body").append("div").attr("class", "tooltip")
	    .style("opacity", 0);

	var focus = svg.append("g").attr("transform",
	    "translate(" + margin.left + "," + margin.top + ")");

	var context = svg.append("g").attr("transform",
	    "translate(" + margin2.left + "," + margin2.top + ")");

    
    /* Draw X axis */
    focus.append("g").attr("class", "x axis").attr("transform",
	    "translate(0," + height + ")").call(xAxis);
    
    /* Draw y axis */
	focus.append("g").attr("class", "y axis").call(yAxis);
    

	svg.append("g")
	    .attr("class", "y axis")
	    .append("text")
	    .attr("transform", "rotate(-90)")
	    .attr("y", 6)
	    .attr("dy", ".71em")
	    .style("text-anchor", "end")
	    .text("Energy");

	


inicializar_json();


/* Initialize graph data array */
function inicializar_json(){

            //alert("En inicializar");
            console.log ( "inicializar_json()" );
    
            /* Inicializamos el array a ceros */
            
            for (var i = 1; i <= total_steps; i++){
                var json_aux = new Object();
                json_aux.date=i;
                for (var g=1;g<=num_tot_traj;g++){
                    json_aux[g]=0;
                }
                jsonArr.push(json_aux); 
            }
            
            document.miForm.max.value=total_steps;
            document.miForm.min.value=1;
            document.miForm.current.value = 4;
            document.miForm.rango.value= 4;
            
            update(jsonArr);  // Inicializa los valores del array con los datos a ceros
       
          //  actualizar_json(50,2,3);


        }

/* Update data array with websocket data */
        function actualizar_json(step,traj,energy){
            
            console.log ("En json_actualizar: "+step+"-"+traj+"-"+energy);
            for (var j=0; j<jsonArr.length; j++) {
              var json_aux = jsonArr[j];    
              if (json_aux['date'] == step) {
                  (jsonArr[j])[traj] = energy;
                //alert(jsonArr);
                break;
              }
            }
            
            // Antes de borrar tomamos un último valor de energía para hacer la media
            last_energy = energy;
            
            borrar();  //borramos la gráfica actual
            
            console.log("Antes de update"+jsonArr);
            
            //if step=10{
            //    adapt_data();
            //}
            
            
            update(jsonArr);
            
        }


/* Update data array with last energy received */
        function adapt_data(){
            
            //console.log ("En json_actualizar: "+step+"-"+traj+"-"+energy);
            for (var j=0; j<jsonArr.length; j++) {
              var json_aux = jsonArr[j];    
              if ((json_aux[j])[1] == 0) {   //Actualizamos ceros de la rtayectoria 1
                  (jsonArr[j])[1] = last_energy;
              }
                
              if ((json_aux[j])[2] == 0) {   //Actualizamos ceros de la trayectoria 2
                  (jsonArr[j])[2] = last_energy;
              }
                
            }
            
        }



    function borrar(){
        
   // alert("antes de borrar");
    var lineas = svg.selectAll(".topic");
    lineas.remove();
        
        
    }

    function llamada(){}

/* Update graph with new values */
	function update(date) {

	    date.forEach(function (d) {
	        d.date = d.date; /* parseDate(d.date); */
	    });

	    color.domain(d3.keys(date[1]).filter(function (key) {   //LCF 0
	        return key !== "date";
	    }));

	    var topics = color.domain().map(function (name) {
	        return {
	            name: name,
	            values: date.map(function (d) {
	                return {
	                    date: d.date,
	                    probability: +d[name]
	                };
	            })
	        };
	    });



	    x.domain(d3.extent(date, function (d) {
	        return d.date;
	    }));

	    y.domain([d3.min(topics, function (c) {
	        return d3.min(c.values, function (v) {
	            return v.probability;
	        });
	    }) - .01,
	    d3.max(topics, function (c) {
	        return d3.max(c.values, function (v) {
	            return v.probability;
	        });
	    })]);

	    x2.domain(x.domain());
	    y2.domain(y.domain());


        
/* Update axis */
        
	    d3.transition(svg).select('.y.axis')
	        .call(yAxis);

	    d3.transition(svg).select('.x.axis')
	        .call(xAxis);

	    var smallTopic = context.selectAll(".topic").data(topics);

	    var topic = focus.selectAll(".topic").data(topics);

	    var smallTopicEnter = smallTopic.enter().append("g").attr("class", "topic");

	    var topicEnter = topic.enter().append("g").attr("class", "topic");
        
  
    
        
        /* Pintar líneas de la gráfica */

	    topicEnter.append("path").attr("class", line)
	        .attr("clip-path", "url(#clip)")
	        .attr("d", function (d) {
	        return line(d.values);
	    })
	        .style("stroke", function (d) {
	        return color(d.name);
	    });

      
        /* Draw points */
        
	    topicEnter.append("g").selectAll(".dot")
	        .data(function (d) {
	        return d.values
	    }).enter().append("circle").attr("clip-path", "url(#clip)")
	        .attr("stroke", function (d) {
	        return color(this.parentNode.__data__.name)
	    })
	        .attr("cx", function (d) {
	        return x(d.date);
	    })
	        .attr("cy", function (d) {
	        return y(d.probability);
	    })
	        .attr("r", 2)
            .attr("fill", function (d) {
	           return color(this.parentNode.__data__.name)
	        })
            .attr("fill-opacity", 1)
	        .attr("stroke-width", 2)
            .on("mouseover", function (d) {
	        div.transition().duration(100).style("opacity", .9);
	        div.html("Traj: "+this.parentNode.__data__.name + "<br/>" + "Value: "+d.probability+"Step: "+d.date).style("left", (d3.event.pageX) + "px")
            .style("top",      (d3.event.pageY - 28) + "px").attr('r', 5);
	        d3.select(this).attr('r', 6)
	        })
            .on("click", function (d) { alert('Accion: Clik con:'+this.parentNode.__data__.name+'-'+d.probability+'-'+d.date);
	        
	        })
            .on("mouseout", function (d) {
	        div.transition().duration(100).style("opacity", 0)
	        d3.select(this).attr('r', 2);
	    });

	    // Transition selecting 'topic'
	    topicUpdate = d3.transition(topic);
	    smallTopicUpdate = d3.transition(smallTopic);

	    // Transition selecting 'path'
	    topicUpdate.select('path')
	        .transition().duration(600)
	        .attr("d", function (d) {
	        return line(d.values);
	    });

	    /*topicEnter.append("g").selectAll(".dot").transition().duration(600)
	        .data(function (d) {
	        return d.values
	    }).enter().append("circle").attr("clip-path", "url(#clip)")
	        .attr("stroke", function (d) {
	        return color(this.parentNode.__data__.name)
	    })
	        .attr("cx", function (d) {
	        return x(d.date);
	    })
	        .attr("cy", function (d) {
	        return y(d.probability);
	    })
	        .attr("r", 5)
	        .attr("fill", "white").attr("fill-opacity", .5)
	        .attr("stroke-width", 2).on("mouseover", function (d) {
	        div.transition().duration(100).style("opacity", .9);
	        div.html(this.parentNode.__data__.name + "<br/>" + d.probability).style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY - 28) + "px").attr('r', 8);
	        d3.select(this).attr('r', 8)
	    }).on("mouseout", function (d) {
	        div.transition().duration(100).style("opacity", 0)
	        d3.select(this).attr('r', 5);
	    });*/

	    smallTopicUpdate.select('path')
	        .transition().duration(600)
	        .attr("d", function (d) {
	        return line2(d.values);
	    });

	    topic.exit().remove();
	    smallTopic.exit().remove();

	}

