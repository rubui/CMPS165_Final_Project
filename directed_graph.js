function directed_graph(data, svg){
//    http://bl.ocks.org/ericandrewlewis/dc79d22c74b8046a5512
    
    var radius = 4.5;
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    
//    var n = 100,
//    nodes = d3.range(n).map(function(i) { return {index: 1}; }),
//    links = d3.range(n).map(function(i) { return {source: i, target: (i + 3) % n}; });
//
//var simulation = d3.forceSimulation(nodes)
//    .force("charge", d3.forceManyBody().strength(-80))
//    .force("link", d3.forceLink(links).distance(Math.random()*100 + 50).strength(1).iterations(10))
//    .force("x", d3.forceX())
//    .force("y", d3.forceY())
//    .force("collide", d3.forceCollide(4))
//
//var loading = svg.append("text")
//    .attr("dy", "0.35em")
//    .attr("text-anchor", "middle")
//    .attr("font-family", "sans-serif")
//    .attr("font-size", 10)
//    .text("Simulating. One moment please…");
//
//// Use a timeout to allow the rest of the page to load first.
//d3.timeout(function() {
//  loading.remove();
//
//  // See https://github.com/d3/d3-force/blob/master/README.md#simulation_tick
//  for (var i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
//    simulation.tick();
//  }
//
////  g.append("g")
//////      .attr("stroke", function(d){return color(d)})
//////      .attr("stroke-width", 1.5)
////    .selectAll("line")
////    .data(links)
////    .enter().append("line")
////      .attr("x1", function(d) { return d.source.x; })
////      .attr("y1", function(d) { return d.source.y; })
////      .attr("x2", function(d) { return d.target.x; })
////      .attr("y2", function(d) { return d.target.y; });
//
//  g.append("g")
////      .attr("stroke", color(x))
//      .attr("stroke-width", 15)
//    .selectAll("circle")
//    .data(nodes)
//    .enter().append("circle")
//      .attr("cx", function(d) { return d.x; })
//      .attr("cy", function(d) { return d.y; })
//      .attr("r", radius)
//      .attr("id",function(d){return d.index})
//    .style("fill",function(d){return color(d.x)})
//    .style("stroke",function(d){return color(d.y)})
//    .on("mouseover",function(d){
//      
//        d3.select(this)
//            .select("circle")
//            .transition()
//            .duration(150)
//            .attr("r", radius*1.3);
//      
//      
////        console.log(d);
//    })
//    .call(d3.drag()
//              .on("start", dragstarted)
//              .on("drag", dragged)
//              .on("end", dragended));
//    
//    });
//
//    function dragstarted(d) {
//      if (!d3.event.active) simulation.alphaTarget(.03).restart();
//      d.fx = d.x;
//      d.fy = d.y;
//    }
//
//    function dragged(d) {
//      d.fx = d3.event.x;
//      d.fy = d3.event.y;
//    }
//
//    function dragended(d) {
//      if (!d3.event.active) simulation.alphaTarget(.03);
//      d.fx = null;
//      d.fy = null;
//    }

}
