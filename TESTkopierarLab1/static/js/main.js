queue()
  .defer(d3.csv,'static/data/Swedish_Population_Statistics.csv')
  .defer(d3.json,'static/maps/sverige-topo.json')
  .await(draw);

var sp, pc, map;

function draw(error, data, world_map_json){
  if (error) throw error;

  sp = new sp(data);
  pc = new pc(data);
  map = new map(data, world_map_json);

}
