/*
  Created: Jan 14 2018
  Author: Kahin Akram Hassan
*/
function map(data, world_map_json){

  this.data = data;
  this.world_map_json = world_map_json;

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
	 .translate([width / 2.8, height * 3.2]);
	 
  var path = d3.geoPath()
      .projection(projection);

  var svg = d3.select(div).append("svg")
      .attr("width", width)
      .attr("height", height)
      .call(zoom);

  var g = svg.append("g");
  
  
  var countries = topojson.feature(world_map_json,
    world_map_json.objects.sverige).features;


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
      .style("fill", function(d) { return partyColors[getColorIndex(d.properties.KNKOD)]; })
	  

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

  function getColorIndex(countyCode){
    var largest = 0.0;
    var counter = 0;
    var index = 0;
    for(var i = 0; i < data.length; i++)
    {
      if(data[i].region.match(/\d+/) == countyCode)
      {
        if(parseFloat(data[i].Year2014) > largest)
        {
          largest = data[i].Year2014;
          index = counter;
        }
        counter++;
      }
    }
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

}
