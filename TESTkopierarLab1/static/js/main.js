
var map;

function draw(activeData, data2014, data2010, data2006, data2002, pcYear, sweden_map_json){
  
  map = new Map(activeData, sweden_map_json);
  pc = new pc(pcYear);
  balls = new sp(data2014, data2010, data2006, data2002);

}

var q=d3.queue()
    .defer(d3.csv, 'static/data/Swedish_Election_2014.csv')
    .defer(d3.csv, 'static/data/Swedish_Election_2010.csv')
    .defer(d3.csv, 'static/data/Swedish_Election_2006.csv')
    .defer(d3.csv, 'static/data/Swedish_Election_2002.csv')
    .defer(d3.csv, 'static/data/pcYear.csv')                  //#1
    .defer(d3.json,'static/maps/sverige-topo.json')
    .await(function(error, d2014, d2010, d2006, d2002, pcYear, sweden_map_json) {
      if (error) throw error;  
      draw(d2014, d2014, d2010, d2006, d2002, pcYear, sweden_map_json);
    });

//var slider = d3.select('#year');
//slider.on('change', function() {
//    draw(this.value, world_map_json);
//});
function updateData() {
  var slider = document.getElementById("selected_year");
  var datasetName = "data" + slider.value;

/*  Ingenting fungerar och den skriver ut en till karta oavsett om man kör draw eller Map direkt...
d3.queue()
  .defer(d3.csv, 'static/data/Swedish_Election_'+slider.value+'.csv')
  .defer(d3.json,'static/maps/sverige-topo.json')
  .await(function(error, active, karta){
    if (error) throw error;
    map = new Map(active, karta);
  })
*/


  //map.updateMap(map[datasetName]); 
  console.log("hallå? (om det är 28.4 => datasettet fortfarande 2014): " + map.data[0].Year2014); 
  console.log("datasetName: " + datasetName);
  console.log("map[datasetName]: " + map[datasetName]); 
  console.log("vafan är q: " + q);



  //map = new Map(map[datasetName], map['sweden_map_json']);
 
    
}

// #1
/*
  pcYear was created by ourselfs with the source: valmyndigheten @ https://www.val.se/valresultat/riksdag-landsting-och-kommun/2014/valresultat.html
*/