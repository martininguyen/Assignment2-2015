function classes(root) {
  var classes = [];

  function recurse(name, node) {
    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
    else classes.push({name: node.name, idName: node.idName, size: node.size, img : node.img });
  }

  recurse(null, root);
  return {children: classes};
}

function processData(data) {
    var arr = [];
    data.users.forEach(function(user) {
        arr.push({ name : user.username, idName : user.id, img: user.profile_picture, size : user.counts.follows });
    })
    return { children : arr };
}

var diameter = 960;

var svg = d3.select('#chart').append('svg') 
    .attr('width', diameter) 
    .attr('height', diameter);

var bubble = d3.layout.pack()
    .size([diameter, diameter])
    .padding(10)
    .value(function(d) { return d.size });

d3.json('/igFollowers', function(err, data) {
    var nodes = bubble.nodes(processData(data))
    .filter(function(d) { return !d.children; });
    var tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return ['<p class="tip">', 'Name : ' + d.name, '</p>','<p class="tip">', 'Follower Counts : ' + d.size,'</p>'].join(''); });

    var vis = svg.selectAll('circle')
    .data(nodes, function(d) { return d.name; });


    vis.enter()
    .append('pattern')
    .attr('id', function(d) {
        return d.idName;
    })
    .attr('width', '50%')
    .attr('height', '50%')
    .append('image')
    .attr('xlink:href', function(d) {
        return d.img;
    })
    .attr('x', '1')
    .attr('y', '1')
    .attr('width', function(d) {
        return d.r * 2;
    })
    .attr('height', function(d) {
        return d.r * 2;
    });

    vis.call(tip);
    vis.enter()
    .append('circle')
    .attr('transform', function(d) { 
        return 'translate(' + d.x + ',' + d.y + ')'; 
    })
    .attr('r', function(d) { 
        return d.r; 
    }) 
    .attr('fill', function(d) {
        return 'url(#' + d.idName + ')';
    })
    .attr('stroke', 'white')
    .attr('stroke-width', '2')
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);
})