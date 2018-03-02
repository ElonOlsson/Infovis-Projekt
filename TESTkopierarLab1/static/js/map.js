/*
  Created: Jan 14 2018
  Author: Kahin Akram Hassan
*/
function Map(data2014, data2010, data2006, data2002, pcYear, sweden_map_json){
  //constructor;

  this.data2014 = data2014;
  this.data2010 = data2010;
  this.data2006 = data2006;
  this.data2002 = data2002;

  this.sweden_map_json = sweden_map_json;

  //active dataset
  var data = data2014;
  this.data = data;
  
  //var data = data2002;
  var time = 0;

  var div = '#world-map';
  var parentWidth = $(div).parent().width();
  var margin = {top: 0, right: 0, bottom: 0, left: 0},
            width = parentWidth - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

  /*~~ Task 10  initialize color variable ~~*/
  // Don't need no shitty colorscheme no more
  //var colorScheme = d3.scaleOrdinal(d3.schemeCategory20c);

  // The order of : Moderaterna, Centerpartiet, Folkpartiet, Kristdemokraterna, Miljöpartiet, Socialdemokraterna, Vänsterpartiet, Sverigedemokraterna, Övriga
  var partyColors = ['#004b8d', '#51ba66', '#3d70a4', '#6d94bb', '#379c47', '#d82f27', '#b02327', '#e7e518', '#BDC3C7'];
  
   //initialize zoom
   var zoom = d3.zoom()
    .scaleExtent([1, 10])
    .on('zoom', move);


  //initialize tooltip
  var tooltip = d3.select(div).append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);


  /*~~ Task 11  initialize projection and path variable ~~*/
  var projection = d3.geoMercator()
	 .scale(950)
	 .translate([width *-0.1, height * 3.2]);
	 
  var path = d3.geoPath()
      .projection(projection);

  var svg = d3.select(div).append("svg")
      .attr("width", width)
      .attr("height", height)
      .call(zoom);

  var g = svg.append("g");
  
  
  var countries = topojson.feature(sweden_map_json,
    sweden_map_json.objects.sverige).features;


  var country = g.selectAll(".sverige").data(countries);

  /*~~ Task 12  initialize color array ~~*/
  // Dont need this initialization no more
  /*var cc = [];
	data.forEach(function(d){
		
		cc[d["region"].match(/\d+/)] = colorScheme(d["region"]);
	
  }); */
  	
  country.enter().insert("path")
      .attr("class", "region")

        /*~~ Task 11  add path variable as attr d here. ~~*/
      .attr("d", path)
      .attr("id", function(d) { return d.properties.KNKOD; })
      .attr("title", function(d) { return d.properties.KNNAMN; })
      .style("fill", function(d) { return partyColors[getColorIndex(d.properties.KNKOD)]; })    //colormapping
	  
      //tooltip
      .on("mousemove", function(d) {
        d3.select(this).style('stroke','white');

        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
        tooltip
        .attr("style", "left:"+(mouse[0]+30)+"px;top:"+(mouse[1]+30)+"px")
        .html(d.properties.KNNAMN);
      })
      .on("mouseout",  function(d) {

          d3.select(this).style('stroke','none');
          tooltip.transition()
              .duration(500)
              .style("opacity", 0);
      })
      //selection
      .on("click",  function(d) {
			// var countryObject = [{ "Country": d.properties.name}];
			pc.selectLine(d);
			sp.selectDots(d);
      });

  function move() {
      g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
      g.attr("transform", d3.event.transform);
  }

  // pseudo function för att updatera data.
  this.updateData = function (){  //dataSet as argument
    country.exit().remove();
    // Lyckas vi inte att konvertera den nya datan från array till json, är jag inte säker på att indexeringen d.properties.KNKOD fungerar till exempel

    //change dataset with switch.
    var sliderElement = document.getElementById("selected_year");
    var datasetName = "data" + sliderElement.value;

    switch(datasetName){
      case "data2002":
        data = data2002;
        this.data = data;
        console.log("this is now the data: " + data);
        break;
      case "data2006":
        data = data2006;
        console.log("this is now the data: " + data);
        break;
      case "data2010":
        data = data2010;
        console.log("this is now the data: " + data);
        break;
      case "data2014":
        data = data2014;
        console.log("this is now the data: " + data);
        break;
    }

    var test = 0;
    country.enter().insert("path")
    .attr("class", "region")
    .attr("d", path)
    .attr("id", function(d) { return d.properties.KNKOD; })
    .attr("title", function(d) { return d.properties.KNNAMN; })
    .style("fill", function(d) { test+= getColorIndex(d.properties.KNKOD); return partyColors[getColorIndex(d.properties.KNKOD)]; })
    console.log("test: "+test);
    // hoppas att funktionaliteten med "mousemove" och "mouseout" fortfarande fungerar, annars måste det kanske skickas med in här också
  }

  // Denna function returnerar ett index beroende på vilket parti som är mest röstat på i en kommun
  // Timar också hur lång tid den tar att exekevera
  function getColorIndex(countyCode){
    var start = new Date().getTime();
    var key = Object.keys(data[0])[2];
    var largest = 0.0;
    var counter = 0;
    var index = 0;

    for(var i = 0; i < data.length; i++)
    {
      if(data[i].region.match(/\d+/) == countyCode)   //Object.keys(data[0])[0].match(/\d+/)
      {
        if(parseFloat(data[i][key]) > largest)
        {
          largest = data[i][key];
          index = counter;
        }
        counter++;
      }
    }
    var end = new Date().getTime();
    time = time + (end - start);
    return index; 
  }
  


    /*~~ Highlight countries when filtering in the other graphs~~*/
  this.selectCountry = function(value){
	  
		var country = d3.selectAll('.regionen');
			country.style('stroke', function(d){
				
				return value.every(function(v){
			
					return v.region != d.properties.KNName ? "red": null
					
			})? null : "red" 
		});

  }
  console.log('Execution time: ' + time);

}
