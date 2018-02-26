var width = 960,
    height = 500;

var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height);

d3.json('sverige.topojson', function(data) {
  var subunits = topojson.feature(data, data.objects.sverige);

  var counties = data.objects.sverige.geometries;

  var projection = d3.geo.mercator()
      .scale(1)
      .translate([0, 0]);

  var path = d3.geo.path()
      .projection(projection);

  var b = path.bounds(topojson.merge(data, counties)),
      s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
      t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

  projection.scale(s).translate(t);
console.log(data)
  svg.selectAll('.munic')
      .data(subunits.features)
    .enter().append('path')
      .attr('class', function(d) { return 'munic munic--' + d.properties.KNKOD; })
      .attr('d', d3.geo.path().projection(projection));

});
