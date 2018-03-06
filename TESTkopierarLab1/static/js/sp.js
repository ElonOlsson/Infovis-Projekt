function sp(data){

    this.data = data;
    var div = '#scatter-plot';
    var height = 500;
    var parentWidth = $(div).parent().width();
    var margin = {top: 20, right: 20, bottom: 60, left: 40},
        width = parentWidth - margin.right - margin.left,
        height = height - margin.top - margin.bottom;

    // The order of : Moderaterna, Centerpartiet, Folkpartiet, Kristdemokraterna, Miljöpartiet, Socialdemokraterna, Vänsterpartiet, Sverigedemokraterna, Övriga
    var partyColors = ['#004b8d', '#51ba66', '#3d70a4', '#6d94bb', '#379c47', '#d82f27', '#b02327', '#e7e518', '#BDC3C7'];
 
    var tooltip = d3.select(div).append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    
    const partys = ["M", "C", "F", "KD", "MP", "S", "V", "SD", "Övriga"];
    
    var xScale = d3.scaleBand().domain(partys).padding(0.3).range([0,width]);
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
		.attr("class", "y axis")
        .call(d3.axisLeft(yScale));

    svg.append("text")
        .attr("transform","translate(" + width/4 +" , 10)")
        .attr("class", "title")
        .attr("font-size", 26)
        .text("Röststatistik i sverige år " + document.getElementById("year").value);
        
        
    // append the rectangles for the bar chart
    function updateBar() {

        d3.selectAll(".title").text( "Röststatistik i sverige år " + document.getElementById("year").value);

        const t = d3.transition()
        .duration(750);

        var theYear = "y" + document.getElementById("year").value;

        var index = -1;

        var bar = svg.selectAll("rect").data(data, d => d.parti)                          //här,
        .exit().remove();
        
        bar.data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return xScale(d.parti); })
        .attr("width", xScale.bandwidth())
        .attr("y", function(d) { return yScale(d[theYear]); })
        .attr("height", function(d) { return height - yScale(d[theYear]); })
        .style("fill", function (d) { index++; return partyColors[index]; } );

        bar.append("text")
            .attr("class", "value")
            .attr("y", height / 2)
            .attr("dx", margin.right) //margin right
            .attr("dy", ".35em") //vertical align middle
            .attr("text-anchor", "middle")
            .text(function(d){
                return (d[theYear]);
            })

        svg.selectAll("text")
            .data(data)
            .enter().append("text")
            .text(function(d) {
                return d[theYear];
            })
            .attr("x", function(d) { return xScale(d.parti); })
            .attr("y", function(d) { return yScale(d[theYear]); })

    }

    updateBar();
    
    d3.select("#year")
        .on("change", updateBar);
		
    this.selectedMunicipaliti = function(value, nowData) {
      //if (value.properties.KNKOD == data) och hämta vilket årtal för att hämta från rätt dataset

      var key = Object.keys(nowData[0])[2];
      var region = Object.keys(nowData[0])[0];
      var counter = 0;
      var index = 0;
      var barChartData = [];
      var theYear = "y" + document.getElementById("year").value;

      for (var i = 0; i < nowData.length; i++) {
        if (nowData[i][region].match(/\d+/) == value.properties.KNKOD) {
          barChartData.push({
            parti: partys[counter],
            [theYear]: nowData[i][key]
          });

          ++counter;

          console.log("bra data nu då eller? : " + JSON.stringify(barChartData));
        }

        if (counter == 9) break;
      }

      data = barChartData;

      updateBar();
    };
    


}//End
