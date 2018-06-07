function directed_graph(data, svg, button_flag){
//    http://bl.ocks.org/ericandrewlewis/dc79d22c74b8046a5512
//    http://vallandingham.me/bubble_charts_with_d3v4.html


    var radius = 20,
        nodePadding = 2.5,
        forceStrength = .03,
        axisPad=50,
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        drawable_width = width, //- axisPad; 
        drawable_height = height,//- axisPad; 
        center = {x:width/2,y:height/2},
        mouseover_ready_flag = true;
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
        high:{x:2*(width/3)+80},
        "Full sun":{x:6*drawable_width/7},
        "Full sun to part sun":{x:5*drawable_width/7},
        "Full sun to part shade":{x:4*drawable_width/7},
        "Part sun to part shade":{x:3*drawable_width/7},
        "Part shade":{x:2*drawable_width/7},
        "Part shade to full shade":{x:drawable_width/7}
    };

    var amountCentersY = {
        high: {y:height/3-50},
        medium:{y:height/2},
        low:{y:2*(height/3)},
        "Dry":{y:4*drawable_height/5},
        "Nearly dry":{y:3*drawable_height/5},
        "Slightly dry":{y:2*drawable_height/5},
        "Never dry":{y:drawable_height/5}
    };
    
    var waterCentersTemp = {
        "Low":{y:5*drawable_height/6},
        "Low to medium":{y:4*drawable_height/6},
        "Medium":{y:3*drawable_height/6},
        "Medium to high":{y:2*drawable_height/6},
        "High":{y:drawable_height/6}
    };

    var moistureRadius = {
        "Low":{radius: 15},
        "Low to medium":{radius: 20},
        "Medium":{radius: 25},
        "Medium to high":{radius: 30},
        "High":{radius: 35}
    }

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


    // Map data from CSV
    var nodes = data.map(function(d){
        return{
            sci_name: d.Scientific_Name,
            nickname: d.Common_Name,
            sun: d.Sunlight,
            water: d.Moisture,
            soil_ind: d.Soil_Indicator,
            plant_spread: d.Plant_Spread,
            plant_height: d.Plant_Height,
            toxic_dogs: d.Toxic_Dogs,
            toxic_cats: d.Toxic_Cats,
            radius: radius//moistureRadius[d.Moisture].radius
        };
    });


//        console.log(nodes);

    //functions called once for each node-- provides the approriate x and y for nodes
    function nodeXPos(d){
        if(button_flag){
            //do something
            
        }
        return amountCentersX[d.sun].x;
    }
    
    function nodeYPos(d){
        //if the button is pressed, redefine nodeY (to different parameter)
        if(button_flag){
            return waterCentersTemp[d.water].y;
        }
 
        return amountCentersY[d.soil_ind].y;
    }
    

//the following code basically creates a 'folder' for both image and circle
    var bubbles = svg.selectAll('.bubble')
        .data(nodes,function(d){return d.id})
        .enter()
        .append("g")
        .attr("class", "force-scale-node")
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on("click", function (d) {console.log(d)});

    var bubblesE = bubbles.append("circle")
        .classed('bubble',true)
        .attr("r", 0)
        .style("fill",function(d){return color(d.soil_ind+d.sun)})
        .style("stroke",function(d){return color(d.soil_ind+d.sun)})
        .style('stroke-width',2)
        .transition()
                .duration(2000)
                .attr('r',function(d){return d.radius});


    var bubble = bubbles.merge(bubblesE);


//adding the axis titles
//    var myData = d3.keys(titlesX);

//    svg.selectAll('.titlesX')
//        .data(myData)
//        .enter().append('text')
//            .attr('class','titlesX')
//            .attr('x',function(d){return titlesX[d];})
//            .attr('y',height - 20)
//            .attr('text-anchor','middle')
//            .style("font-size", "13px")
//            .text(function(d){
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
//        mouseover_ready_flag = false;
        simulation.force('x', d3.forceX().strength(forceStrength).x(nodeXPos));
        simulation.force('y', d3.forceY().strength(forceStrength).y(nodeYPos));

        simulation.alpha(1).restart();
//        
//        setTimeout(function(){
////            simulation.stop();
//            mouseover_ready_flag = true;
//        },2000)
    }
    
    
    
    
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~Button Updaters~~~~~~~~~~~~~~
    d3.select("#option1")
        .on("click", function(){
        button_flag = true;
        console.log(button_flag);
        start();
        });
    d3.select("#option2")
        .on('click',function(){
        button_flag=false; 
        console.log(button_flag)
        start();
    });
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    function mouseover(d)
    {
        //if we ever get around to fixing the image bug, we will set this flag
        //to false
        if(mouseover_ready_flag){
            //        console.log(d);
            var dd = d3.select(this)[0];
            d3.select(this)
                .select("circle")
                .transition()
                .duration(150)
                .attr("r", radius*1.3);

    //        var temp = radius;
    //        radius = radius*5;

            // simulation.stop();

            d3.select(this).select('image')
                .transition()
                .duration(150)
                .attr("width", 50)
                .attr("height", 50)
                .attr("x", function(d) { return +d.x - (radius*1.3); })
                .attr("y", function(d) { return +d.y - (radius*1.3); });

    //        getOverview(data,d.index);
            tooltip(d,parseFloat(d3.event.pageX),parseFloat(d3.event.pageY));
        }

    };

    function mouseout()
    {
        if(mouseover_ready_flag){
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

            d3.select(".tooltip").classed("hidden", true);

        }
        
    };

    //creating xaxis
    var x_axis = g.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(" + -(width-axisPad)/2 + "," + (height-axisPad)/2 + ")")
        .call(d3.axisBottom(x).ticks(0).tickSizeOuter(0))
        .style("opacity",1)
        .select('path')
        .attr('marker-end','url(#arrowhead_right)');

    //creating yaxis
    g.append("g")
        .attr("class", "yaxis")
        .attr("transform", "translate(" + -(width-axisPad)/2 + ","+-(height-axisPad)/2+")")
        .call(d3.axisLeft(y).ticks(0).tickSizeOuter(0))
        .style("opacity",1)
        .select("path")
        .attr('marker-end','url(#arrowhead_top)');
    

    function padExtent(e, p) {
        if (p === undefined) p = 1;
        return ([e[0] - p, e[1] + p]);
    }



}
