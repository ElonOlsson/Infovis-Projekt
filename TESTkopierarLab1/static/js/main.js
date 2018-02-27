function draw(error, data, world_map_json){
  if (error) throw error;
  
  map = new map(data, world_map_json);
}

d3.queue()
    .defer(d3.csv, 'static/data/Swedish_Election_2014.csv')
    .defer(d3.csv, 'static/data/Swedish_Election_2010.csv')
    .defer(d3.csv, 'static/data/Swedish_Election_2006.csv')
    .defer(d3.csv, 'static/data/Swedish_Election_2002.csv')
    .defer(d3.json,'static/maps/world-topo.json')
    .await(function(error, d2014, d2010, d2006, d2002) {
        data['2002'] = d2002;
        data['2006'] = d2006;
        data['2010'] = d2010;
        data['2014'] = d2014;
        draw('2014');
    });

var slider = d3.select('#year');
slider.on('change', function() {
    draw(this.value, world_map_json);
});


/*
queue()
  .defer(d3.csv,'static/data/data.csv')
  .defer(d3.json,'static/maps/world-topo.json')
  .await(draw);

var sp, pc, map;

function draw(error, data, world_map_json){
  if (error) throw error;

  sp = new sp(data);
  pc = new pc(data);
  map = new map(data, world_map_json);


}
*/
