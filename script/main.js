/*
    code taken from TNM048 course lab3 
*/
 queue()
.defer(d3.csv, 'data/Swedish_Population_Statistics.csv')
.defer(d3.jason, 'map-sweden-boilerplate-master/sverige.topojson')
.await(draw);

var choroplethVariable;

function draw(error, data, world_map_jason){
    if(error) throw error;

    choroplethVariable = new choropleth(data, world_map_jason);
}
