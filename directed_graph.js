function directed_graph(data, svg){
//    http://bl.ocks.org/ericandrewlewis/dc79d22c74b8046a5512
//    http://vallandingham.me/bubble_charts_with_d3v4.html
    
    
    var radius = 15,
        nodePadding = 2.5,
        forceStrength = .03,
        axisPad=80,
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        center = {x:width/2,y:height/2},
        g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    //storing custom paths that create arrows.. to be later used in axis
    //was kind of painful to determine these values, but I didn't use math so...
    svg.append('defs').append('marker')
        .attr('id','arrowhead_right')
            .attr('viewBox','-0 -5 10 10')
            .attr('refX',0)
            .attr('refY',0)
            .attr('orient','360')
            .attr('markerWidth',13)
            .attr('markerHeight',13)
            .attr('xoverflow','visible')
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', '#999')
        .style('stroke','none');
    
    svg.append('defs').append('marker')
        .attr('id','arrowhead_top')
            .attr('viewBox','-0 -5 10 10')
            .attr('refX',0)
            .attr('refY',0)
            .attr('orient','270')
            .attr('markerWidth',13)
            .attr('markerHeight',13)
            .attr('xoverflow','visible')
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', '#999')
        .style('stroke','none');
    
    svg.append('defs').append('marker')
        .attr('id','arrowhead_left')
            .attr('viewBox','-0 -5 10 10')
            .attr('refX',0)
            .attr('refY',.5)
            .attr('orient','180')
            .attr('markerWidth',13)
            .attr('markerHeight',13)
            .attr('xoverflow','visible')
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', '#999')
        .style('stroke','none');
    
    svg.append('defs').append('marker')
        .attr('id','arrowhead_bottom')
            .attr('viewBox','-0 -5 10 10')
            .attr('refX',0)
            .attr('refY',.5)
            .attr('orient','90')
            .attr('markerWidth',13)
            .attr('markerHeight',13)
            .attr('xoverflow','visible')
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', '#999')
        .style('stroke','none');
    
    var x = d3.scaleLinear()
        .domain(padExtent([]))
        .range(padExtent([0, width-axisPad]));

    var y = d3.scaleLinear()
        .domain(padExtent([]))
        .range(padExtent([height-axisPad, 0]));
    
    var titlesX = {
        low: 160,
        medium: width/2,
        high: width - 160        
    };
    
    var titlesY = {
        high: 160,
        medium: height/2+50,
        low: height-100        
    };
    
    var amountCentersX = {
        low: {x:width/4},
        medium:{x:width/2},
        high:{x:2*(width/3)+80}
    };
    
    var amountCentersY = {
        high: {y:height/3-50},
        medium:{y:height/2},
        low:{y:2*(height/3)}
    };
    
    //collision organic (we can also use .collision force)
    function charge(d){
        return -Math.pow(d.radius+8, 2.0) * forceStrength;
    }
    
    var simulation = d3.forceSimulation()
        .velocityDecay(0.2)
        .force('x', d3.forceX().strength(forceStrength).x(center.x))
        .force('y', d3.forceY().strength(forceStrength).y(center.y))
        .force('charge',d3.forceManyBody().strength(charge))
//        .force("collide", d3.forceCollide(function(d) {
//            return d.radius+5
//        }))
        .on('tick',ticked);
        //we want the simulation to pause until nodes exist
//        .stop();
    simulation.stop();
    
    var nodes = data.map(function(d){
        return{
            country: d.country,
            gdp: d.gdp,
            continent: d.continent,
            sun: d.sun,
            water: d.water,
            radius: radius
        };
    }); 
    
    
//        console.log(nodes);

//functions called once for each node-- provides the approriate x and y for nodes
    function nodeXPos(d){
        return amountCentersX[d.sun].x;
    }
    function nodeYPos(d){
        return amountCentersY[d.water].y;

    }
//    simulation.force('x', d3.forceX().strength(forceStrength).x(nodeXPos));
//    simulation.force('y', d3.forceY().strength(forceStrength).y(nodeYPos));
//    simulation.alpha(1).restart();
//    var node = svg.selectAll('.scale-node')
//        .data(nodes,function(d){return d.id})
    
    
//the following code basically creates a 'folder' for both image and circle
    var bubbles = svg.selectAll('.bubble')
        .data(nodes,function(d){return d.id})
        .enter()
        .append("g")
        .attr("class", "force-scale-node")
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);
//        .on("click", addSelectedFood);
    
var bubblesE = bubbles.append("circle")
    .classed('bubble',true)
//      .attr("cx", function(d) { return d.x; })
//      .attr("cy", function(d) { return d.y; })
      .attr("r", 0)
    .style("fill",function(d){return color(d.country)})
    .style("stroke",function(d){return color(d.country)})
    .style('stroke-width',2)
    .transition()
            .duration(2000)
            .attr('r',function(d){return d.radius});
    

    var bubble = bubbles.merge(bubblesE);

//    bubble.


//adding the axis titles
    var myData = d3.keys(titlesX);
    
//    svg.selectAll('.titlesX')
//        .data(myData)
//        .enter().append('text')
//            .attr('class','titlesX')
//            .attr('x',function(d){return titlesX[d];})
//            .attr('y',40)
//            .attr('text-anchor','middle')
//            .text(function(d){
////                if(d == 'medium')
////                        {
////                            return "Lots";
////                        }
//                return d;
//            });
//    
//        svg.selectAll('.titlesY')
//        .data(myData)
//        .enter().append('text')
//            .attr('class','titlesY')
//            .attr('x',40)
//            .attr('y',function(d){return titlesY[d];})
//            .attr('text-anchor','beginning')
//            .text(function(d){
////                if(d == 'medium')
////                        {
////                            return "low Lots";
////                        }
//                return d;
//            });
    
    //updates the x and y each tick-- 'x' and 'y' are for images 
    //while cx and cy are for the bubbles
    function ticked(){
        svg.selectAll(".bubble")
            .attr("x", function(d) { return +d.x - (radius); })
            .attr("y", function(d) { return +d.y - (radius); })
            .attr("cx", function(d) { return +d.x; })
            .attr("cy", function(d) { return +d.y; });
    }
    
    //we can modify the get specific images later on
    bubbles.append("image")
      .attr("xlink:href", function (d){ return "apple.png"; })
      .attr("class", "bubble")
      .attr("width", radius*2)
      .attr("height", radius*2);
    
    simulation.nodes(nodes);

    //tells the simulation to start again
    start();
    
     function start(){
        simulation.force('x', d3.forceX().strength(forceStrength).x(nodeXPos));
        simulation.force('y', d3.forceY().strength(forceStrength).y(nodeYPos));
         
        simulation.alpha(1).restart();       
    }
var temp = radius;
    function mouseover(d)
    {
        
        var dd = d3.select(this)[0];
        d3.select(this)
            .select("circle")
            .transition()
            .duration(150)
            .attr("r", radius*1.3);
        
//        var temp = radius;
//        radius = radius*5;
        
        simulation.stop();
            
        d3.select(this).select('image')
            .transition()
            .duration(150)
            .attr("width", 50)
            .attr("height", 50)
            .attr("x", function(d) { return +d.x - (radius*1.3); })
            .attr("y", function(d) { return +d.y - (radius*1.3); });
            
//        getOverview(data,d.index);
    };
    
    function mouseout()
    {
//        radius = temp;

        d3.select(this)
            .select("circle")
            .transition()
            .duration(150)
            .attr("r", radius);

        d3.select(this).select('image')
            .transition()
            .duration(150)
            .attr("width", radius*2)
            .attr("height", radius*2)
            .attr("x", function(d) { return +d.x - (radius); })
            .attr("y", function(d) { return +d.y - (radius); });
        
//        d3.select(".food-overview").classed("hidden", true);
    };

    //creating xaxis
    var x_axis = g.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate("+-(width-axisPad)/2+"," + 0 + ")")
        .call(d3.axisBottom(x).ticks(0).tickSizeOuter(0))
        .style("opacity",1)
        .select('path')
        .attr('marker-end','url(#arrowhead_right)')
        .attr('marker-start','url(#arrowhead_left)');

    //creating yaxis
    g.append("g")
        .attr("class", "yaxis")
        .attr("transform", "translate(" + 0 + ","+-(height-axisPad)/2+")")
        .call(d3.axisLeft(y).ticks(0).tickSizeOuter(0))
        .style("opacity",1)
        .select("path")
        .attr('marker-end','url(#arrowhead_top)')
        .attr('marker-start','url(#arrowhead_bottom)');



    
    function padExtent(e, p) {
        if (p === undefined) p = 1;
        return ([e[0] - p, e[1] + p]);
    }
//
//    
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
