queue()
  .defer(d3.csv,'static/data/Swedish_Election_2014.csv')
  .defer(d3.json,'static/maps/sverige-topo.json')
  .await(draw);

var sp, pc, map;

var x, y, country, circle_size;

function draw(error, data, world_map_json){
  if (error) throw error;

  sp = new sp(data);
  pc = new pc(data);
  map = new map(data, world_map_json);

}