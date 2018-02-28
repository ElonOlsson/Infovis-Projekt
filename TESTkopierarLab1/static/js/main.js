function draw(data2014, data2010, data2006, data2002, sweden_map_json){
  
  map = new map(data2014, data2010, data2006, data2002, sweden_map_json);
  pc = new pc(data2014, data2010, data2006, data2002);
  balls = new sp(data2014, data2010, data2006, data2002);

}

d3.queue()
    .defer(d3.csv, 'static/data/Swedish_Election_2014.csv')
    .defer(d3.csv, 'static/data/Swedish_Election_2010.csv')
    .defer(d3.csv, 'static/data/Swedish_Election_2006.csv')
    .defer(d3.csv, 'static/data/Swedish_Election_2002.csv')
    .defer(d3.json,'static/maps/sverige-topo.json')
    .await(function(error, d2014, d2010, d2006, d2002, sweden_map_json) {
      if (error) throw error;  
      draw(d2014, d2010, d2006, d2002, sweden_map_json);
    });

var slider = d3.select('#year');
slider.on('change', function() {
    //draw(this.value, world_map_json);
});

