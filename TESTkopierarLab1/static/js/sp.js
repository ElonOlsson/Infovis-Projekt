function sp(data){

    this.data = data;
    var div = '#scatter-plot';

    var height = 500;
    var parentWidth = $(div).parent().width();
    var margin = {top: 20, right: 20, bottom: 60, left: 40},
        width = parentWidth - margin.right - margin.left,
        height = height - margin.top - margin.bottom;

  //  var color = d3.scaleOrdinal(d3.schemeCategory20); // partyColors
   // The order of : Moderaterna, Centerpartiet, Folkpartiet, Kristdemokraterna, Miljöpartiet, Socialdemokraterna, Vänsterpartiet, Sverigedemokraterna, Övriga
    var color = ['#004b8d', '#51ba66', '#3d70a4', '#6d94bb', '#379c47', '#d82f27', '#b02327', '#e7e518', '#BDC3C7'];
  
    var tooltip = d3.select(div).append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    
    const partys = ["M", "C", "F", "KD", "MP", "S", "V", "SD", "Övriga"];
    
    var xScale = d3.scaleBand().domain(partys).range([0,width]);
    var yScale = d3.scaleLinear().domain([0,50]).range([height, 0]);
   
    var svg = d3.select(div).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");
    
		//xAxis
	svg.append("g")
		.attr("transform", "translate(0, " + height +")")
		.call(d3.axisBottom(xScale))
		.append("text")
		.attr("transform", "translate("+ (width/2) +", " + (height + 35) + ")")
		.style("text-anchor", "middle")
		.text("Parti");
		
		//yAxis
	svg.append("g")
		.attr("transform", "translate(0)")
		.call(d3.axisLeft(yScale))
		.attr("transform", "rotate(-90)")
		.attr("y", 0 - margin.left)
		.attr("x", 0 -(height/2))
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.text("Procent röster");
			
	/*var circles = svg.selectAll("dots").data(data)
		.enter().append("circle")
		.attr("class", "circle")		
		.attr("class", "non_brushed")
		.attr("cx", function(d) {return xScale(d["y2006"]); })
		.attr("cy", function(d) {return yScale(d["y2002"]); })
		.attr("r",  function(d) {return d["y2014"]/10000; })
		.style("fill", function(d) {return color[d["parti"]];})
        .style("stroke-width", 5); */
        
          // append the rectangles for the bar chart
    var bar = svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return xScale(d.parti); })
        .attr("width", xScale.bandwidth())
        .attr("y", function(d) { return yScale(d.y2014); })
        .attr("height", function(d) { return height - yScale(d.y2014); });
    
        bar.append("text")
        .attr("class", "value")
        .attr("x", xScale.bandwidth()/2)
        .attr("text-anchor", "end")
        .style('fill', 'white')
        .text(function(d){return d.value + "%";})
/*
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

*/
            /* ~~~ Call pc or/and map function to filter ~~~ */
            
            //console.log(d_brushed);
            
            
            //var array = [];
            //array.push(d_brushed);
/*            map.selectCountry(d_brushed);
            

        }
    }//highlightBrushedCircles
    function isBrushed(brush_coords, cx, cy) {
        var x0 = brush_coords[0][0],
            x1 = brush_coords[1][0],
            y0 = brush_coords[0][1],
            y1 = brush_coords[1][1];
        return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
    }//isBrushed

*/

    //Select all the dots filtered
    this.selectDots = function(value){
        
        var dots = d3.selectAll('.non_brushed');
        dots.style('stroke', function(d){
            
            return value.properties.name == d.Country ? "blue" : null 

        });
        
    };


}//End
