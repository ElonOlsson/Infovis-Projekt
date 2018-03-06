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
    var partyColors = ['#004b8d', '#51ba66', '#3d70a4', '#6d94bb', '#379c47', '#d82f27', '#b02327', '#e7e518', '#BDC3C7'];
  
    var tooltip = d3.select(div).append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    
    const partys = ["M", "C", "F", "KD", "MP", "S", "V", "SD", "Övriga"];

    var xScale = d3.scaleBand().domain(partys).padding(0.3).range([0,width]);
    var yScale = d3.scaleLinear().domain([0,50]).range([height, 0]);
    const scale = d3.scaleLinear()
        .domain([0, 39.85])
        .range([0, height]);
        console.log(39.85);
   
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
   
    function y(d) {
        var theYear = "y" + document.getElementById("year").value;
        return height - scale(d[theYear]);
    }    
        
    // append the rectangles for the bar chart
    function updateBar(dataObject) {                                                            //nu använder jag dataObject här istället för data för att inte blanda ihop.
        const BAR_WIDTH = 24;                                                                   //dataObject ser ut som barChartData{} i selectedMunicipaliti-funktionen längst ner
        const BAR_GAP = 2;                                                                      //i denna funktionen användes tidigare hela datasettet så nu måste det ändras :
        const t = d3.transition()
        .duration(750);
        var theYear = "y" + document.getElementById("year").value;

        var index = -1;

        var bar = svg.selectAll("rect").data(dataObject, d => d.parti)                          //definitivt här,
        .exit().remove();
        bar.transition(t)
        .attr("transform", (d, i) => `translate(${i * (BAR_WIDTH + BAR_GAP)},${y(d)})`);        //eventuellt här,
        bar.data(dataObject)                                                                    //här,
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return xScale(d.parti); })                             //här,
                .attr("width", xScale.bandwidth())
                .attr("y", function(d) { return yScale(d[theYear]); })                          //här,
                .attr("height", function(d) { return height - yScale(d[theYear]); })            //här,
                .style("fill", function (d) { index++; return partyColors[index]; } );          // och här.
                
        bar.append("text")
            .attr("class", "lable")
            .attr("x", function(d){return xScale(d.parti)})
            .attr("y", function(d){return yScale(d[theYear])})
            //.attr("text-anchor", "end")
            .attr("dy", ".75em")
            .text(function(d){return d[theYear] + "%";});   // den verkar inte gå in i denna funktionen över huvudtaget. Fattar nada. Här är exemplet: http://bl.ocks.org/juan-cb/faf62e91e3c70a99a306
            //.attr("x", function(d){
            //    return Math.max(width , d[theYear]);
    /*.attr("class","label")
	  .attr("x", (function(d) { return xScale(d.food) + xScale.rangeBand() / 2 ; }  ))
	  .attr("y", function(d) { return yScale(d.quantity) + 1; })
	  .attr("dy", ".75em")
	  .text(function(d) { return d.quantity; });  */
            //}
            
        bar.selectAll(".bar").transition()
            .duration(500)

        bar.exit().remove();
    }//updateBar

    d3.select("#year")
        .on("change", updateBar);

    var reformedData = reformDataToObject(data);

    function reformDataToObject(currentData){   //this is for whole sweden, using the pcYear.csv 
        // Moderaterna, Centerpartiet, Folkpartiet, Kristdemokraterna, Miljöpartiet, Socialdemokraterna, Vänsterpartiet, Sverigedemokraterna, Övriga
        var theYear = "y" + document.getElementById("year").value;
        var newData = [
            {"parti": "M", theYear: currentData[0][theYear]}, 
            {"parti": "C", theYear: currentData[1][theYear]},
            {"parti": "F", theYear: currentData[2][theYear]},
            {"parti": "KD", theYear: currentData[3][theYear]},
            {"parti": "MP", theYear: currentData[4][theYear]},
            {"parti": "S", theYear: currentData[5][theYear]},
            {"parti": "V", theYear: currentData[6][theYear]},
            {"parti": "SD", theYear: currentData[7][theYear]},
            {"parti": "Övriga", theYear: currentData[8][theYear]}
        ];
        console.log("vad i hög?! : " + JSON.stringify(newData[0]));
        return newData;
    }

    updateBar(reformedData);

    // Value is one element in the JSON-file, ie. one muni after a click on the map. nowData is the active dataset.
    // This function if for when a muni is selected, not using the pcYear.csv.
    this.selectedMunicipaliti = function(value, nowData){  

        //if (value.properties.KNKOD == data) och hämta vilket årtal för att hämta från rätt dataset
        
        var key = Object.keys(nowData[0])[2];
        var region = Object.keys(nowData[0])[0];
        var counter = 0;
        var index = 0;
        var barChartData=[];
        var theYear = "y" + document.getElementById("year").value;

        for(var i = 0; i < nowData.length; i++){
            if(nowData[i][region].match(/\d+/) == value.properties.KNKOD ){
                
                barChartData.push({"parti": partys[counter], [theYear]: nowData[i][key]}); 
                    
                ++counter;

                console.log("bra data nu då eller? : " + JSON.stringify(barChartData));
            }
            if(counter==9) break;  
        }    

        updateBar(barChartData);
    };


}//End
