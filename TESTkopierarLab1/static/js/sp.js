/*
  Created: Jan 14 2018
  Author: Kahin Akram Hassan
*/

function sp(data){

    this.data = data;
    var div = '#scatter-plot';

    var height = 500;
    var parentWidth = $(div).parent().width();
    var margin = {top: 20, right: 20, bottom: 60, left: 40},
        width = parentWidth - margin.right - margin.left,
        height = height - margin.top - margin.bottom;

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var tooltip = d3.select(div).append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var xScale = d3.scaleLinear().range([0, width]);
    var yScale = d3.scaleLinear().range([height, 0]);

	var xCol = "Personal_earnings";
	var yCol = "Unemployment_rate";
	var country = "Country";
	var circle_size = "Household_income";
	var circleRadius = 2;
	
    /* Task 2
      Initialize 4 (x,y,country,circle-size)
      variables and assign different data attributes from the data filter
      Then use domain() and extent to scale the axes
	  
      x and y domain code here*/
	
		xScale.domain(d3.extent(data, function(d){return d[xCol]}));
		yScale.domain(d3.extent(data, function(d){return d[yCol]}));  
	

    var svg = d3.select(div).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");

        /* ~~ Task 3 Add the x and y Axis and title  ~~ */
		//xAxis
	svg.append("g")
		.attr("transform", "translate(0, " + height +")")
		.call(d3.axisBottom(xScale))
		.append("text")
		.attr("transform", "translate("+ (width/2) +", " + (height + 35) + ")")
		.style("text-anchor", "middle")
		.text(xCol);
		
		//yAxis
	svg.append("g")
		//.attr("transform", "translate(0)")
		.call(d3.axisLeft(yScale))
		.attr("transform", "rotate(-90)")
		//.attr("y", 0 - margin.left)
		//.attr("x", 0 -(height/2))
		//.attr("dy", "1em")
		.style("text-anchor", "middle")
		.text(yCol);
			
		

        /* ~~ Task 4 Add the scatter dots. ~~ */
	
	var circles = svg.selectAll("dots").data(data)
		.enter().append("circle")
		.attr("class", "circle")		
		.attr("class", "non_brushed")
		.attr("cx", function(d) {return xScale(d[xCol]); })
		.attr("cy", function(d) {return yScale(d[yCol]); })
		.attr("r",  function(d) {return d[circle_size]/10000; })
		.style("fill", function(d) {return color(d[country]);})
		.style("stroke-width", 5);

        /* ~~ Task 5 create the brush variable and call highlightBrushedCircles() ~~ */
		
	var brush = d3.brush().on("start brush end", highlightBrushedCircles);
	
	svg.append("g")
		.attr("class", "brush")
		.call(brush);
		
	 
				 //return value.every(function(v){
			//? null : "red" 
				 

         //highlightBrushedCircles function
         function highlightBrushedCircles() {
             if (d3.event.selection != null) {
                 // revert circles to initial style
                 circles.attr("class", "non_brushed");
                 var brush_coords = d3.brushSelection(this);
                 // style brushed circles
                   circles.filter(function (){
                            var cx = d3.select(this).attr("cx");
                            var cy = d3.select(this).attr("cy");
                            return isBrushed(brush_coords, cx, cy);
                  })
                  .attr("class", "brushed");
                   var d_brushed =  d3.selectAll(".brushed").data();


                   /* ~~~ Call pc or/and map function to filter ~~~ */
				   
					//console.log(d_brushed);
					
					
					//var array = [];
					//array.push(d_brushed);
					map.selectCountry(d_brushed);
				   

             }
         }//highlightBrushedCircles
         function isBrushed(brush_coords, cx, cy) {
              var x0 = brush_coords[0][0],
                  x1 = brush_coords[1][0],
                  y0 = brush_coords[0][1],
                  y1 = brush_coords[1][1];
             return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
         }//isBrushed



         //Select all the dots filtered
         this.selectDots = function(value){
			 
				var dots = d3.selectAll('.non_brushed');
				dots.style('stroke', function(d){
					
						return value.properties.name == d.Country ? "blue" : null 
		
				});
				
         };


}//End
