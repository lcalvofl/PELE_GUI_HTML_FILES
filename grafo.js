var margin = {top: 20, right: 50, bottom: 30, left: 50},
    width = 512 - margin.left - margin.right,
    height = 480 - margin.top - margin.bottom;
//960 ancho y 500 alto
var parseDate = d3.time.format("%d-%b-%y").parse,
    bisectDate = d3.bisector(function(d) { return d.step; }).left,
    formatValue = d3.format(",.2f"),
    formatCurrency = function(d) { return "Energy: " + formatValue(d); };

var x = d3.scale.linear()//d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d.step); })
    .y(function(d) { return y(d.energy); });

var svg = d3.select("#graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var traj1 = new Array();   //Valores para la trayectoria 1
var traj2 = new Array();   //Valores para la trayectoria 1

d3.tsv("data.tsv", function(error, data) 
{
    data.forEach(function(d) {
        d.step = d.step; //parseDate(d.date);
        d.energy = +d.energy;
      
        /*initializing array
        if (d.traj==1){
            traj1.push(d.energy);
        else{
            traj2.push(d.energy);
        }*/
    
        traj1.push(d.energy);  //Pushing energy values to the array
        //traj2.push('value2');
    });
    
    data.sort(function(a, b) 
    {
        return a.step - b.step;
    });

    
    x.domain([data[0].step, data[data.length - 1].step]);
    y.domain(d3.extent(data, function(d) { return d.energy; }));


//function paint_data(dato, color){    
//}

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
  .append("text")
      .attr("transform", "rotate(0)")
      .attr("x", 0)
      .attr("dx", "28.71em")
      .style("text-anchor", "end")
      .text("Steps");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Energy (A)");

  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);

  var focus = svg.append("g")
      .attr("class", "focus")
      .style("display", "none");

  focus.append("circle")
      .style("fill","steelblue") /* steelblue*/
      .attr("r", 4.5);

  focus.append("text")
      .attr("x", 9)
      .attr("dy", ".35em");

  svg.append("rect")
    .datum(data)
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .on("mouseover", function() { focus.style("display", null); })
      .on("mouseout", function() { focus.style("display", "none"); })
      .on("dblclick", mousecall)   // Cojemos el evento doble click y llamamos a la funcion mousecall, que calvula el valor mediante la posicion
      .on("mousemove", mousemove);
    
  function mostrar_punto(step, energy, traj){
    alert ("Event Double Click detected: "+step +" "+energy+" "+ traj );
    startingConnection();
  }

  function mousemove() {
    var x0 = x.invert(d3.mouse(this)[0]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.step > d1.step - x0 ? d1 : d0;
    focus.attr("transform", "translate(" + x(d.step) + "," + y(d.energy) + ")");
    focus.select("text").text(formatCurrency(d.energy));
  }
    
    
 function mousecall() {
    var x0 = x.invert(d3.mouse(this)[0]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.step > d1.step - x0 ? d1 : d0;
        
    mostrar_punto(d.step,d.energy,1);  // Llamamos con step, energía y trajectoria = 1 en este caso
  }
    
    
    
    
});
