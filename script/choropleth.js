/*

*/

function choropleth(data, sverige_json){
    var div = '#choropleth';
    var parentWidth = $(div).parent().width();
    var margin = {top: 0, right: 0, bottom: 0, left: 0}, 
                 width = parentWidth - margin.left - margin.right, 
                 hight = 500 - margin.top - margin.bottom;


    var geoData = {type: "FeatureCollection", features: geoFormat(data)};
    var countries_features = topojson.feature(world_map_json,
        world_map_json.objects.countries).features;
    var countries = g.selectAll(".country").data(countries_features);

     var colors = colorbrewer.Set3[10];

    draw(countries);

    function draw(countries){
        //Add code here.
        countries.enter().insert("path")
            .attr("class", "country")
            .attr("d", path)
            .attr("id", function (d) { return d.id; })
                .attr("title", function (d) { return d.properties.name; })
                .style("fill", function(d) {return colors[0]})
    }
  
}