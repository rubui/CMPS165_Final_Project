function directed_graph(data, svg, button_flag){
//    http://bl.ocks.org/ericandrewlewis/dc79d22c74b8046a5512
//    http://vallandingham.me/bubble_charts_with_d3v4.html


    var radius = 22,
        nodePadding = 2.5,
        forceStrength = .03,
        axisPad = 90,
        nodeOffset = 40,
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        drawable_width = width - axisPad;
        drawable_height = height- axisPad;
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
        "Full sun":{x:6*drawable_width/7 + nodeOffset},
        "Full sun to part sun":{x:5*drawable_width/7 + nodeOffset},
        "Full sun to part shade":{x:4*drawable_width/7 + nodeOffset},
        "Part sun to part shade":{x:3*drawable_width/7 + nodeOffset},
        "Part shade":{x:2*drawable_width/7 + nodeOffset },
        "Part shade to full shade":{x:drawable_width/7 + nodeOffset}
    };

    var amountCentersY = {
        high: {y:height/3-50},
        medium:{y:height/2},
        low:{y:2*(height/3) + nodeOffset },
        "Dry":{y:4*drawable_height/5 + nodeOffset},
        "Nearly dry":{y:3*drawable_height/5 + nodeOffset},
        "Slightly dry":{y:2*drawable_height/5 +40},
        "Never dry":{y:drawable_height/5 + nodeOffset}
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


    // Map data from CSV + get max values for spread and hegiht
    var mX = 0;
    var mY = 0;
    var nodes = data.map(function(d){
        mHeight = parseMaxNum(d.Indoor_Height);
        mSpread = parseMaxNum(d.Indoor_Spread);
        if (mHeight > mX) mX = mHeight;
        if (mSpread > mY) mY = mSpread;

        return{
            sci_name: d.Scientific_Name,
            nickname: d.Common_Name,
            sun: d.Sunlight,
            water: d.Moisture,
            soil_ind: d.Soil_Indicator,
            plant_spread: d.Indoor_Spread,
            plant_height: d.Indoor_Height,
            toxic_dogs: d.Toxic_Dogs,
            toxic_cats: d.Toxic_Cats,
            radius: radius,
            img: d.img_name,
            max_height: mHeight,
            max_spread: mSpread
        };
    });


    // Create scales for plant height vs. spread graphs
    var spreadScale = d3.scaleLinear()
        .domain([0, mX])
        .range([200, drawable_width]);

    var heightScale = d3.scaleLinear()
        .domain([0, mY])
        .range([150, drawable_height]);


    // Function to parse out max spread and height and return num
    function parseMaxNum(d) {
        var arr = d.split(" ");
        return parseFloat(arr[2]);
    }


    // Functions to be called once for each node
    // Provides the approriate x and y for nodes
    // Calculates a different x and y position based on our button toggle
    function nodeXPos(d){
        if (!button_flag){
            return spreadScale(d.max_spread);
        } else {
            return amountCentersX[d.sun].x;
        }
    }

    function nodeYPos(d){
        if (!button_flag){
            return height - heightScale(d.max_height);
        } else {
            return amountCentersY[d.soil_ind].y;
        }
    }

var TopLeftQuad = "rgb(0, 118, 255)";
var BottomLeftQuad = "rgb(0, 255, 255)";
var TopRightQuad = "rgb(255, 150, 0)";
var BottomRightQuad = "rgb(255, 255, 0)";


//the following code basically creates a 'folder' for both image and circle
    var bubbles = svg.selectAll('.bubble')
        .data(nodes,function(d){return d.id})
        .enter()
        .append("g")
        .attr("class", "force-scale-node")
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on("click", function (d) {
            console.log(d)
            console.log("heightScale value: " + heightScale(d.max_height));
            console.log("normalized value: " + (height - heightScale(d.max_height)))
        });

    var bubblesE = bubbles.append("circle")
        .classed('bubble',true)
        .attr("r", 0)
        .style("fill",function(d){
// I'm just trying to get it to be viewable right now. I tried and failed at using ANDs and ORs, but will try again later.
            if (d.soil_ind == "Never dry" && d.sun == "Part shade to full shade"){
                return d3.color(TopLeftQuad)
            } else if (d.soil_ind == "Never dry" && d.sun == "Part shade"){
                return d3.color(TopLeftQuad)
            } else if (d.soil_ind == "Never dry" && d.sun == "Part sun to part shade"){
                return d3.color(TopLeftQuad)
            } else if (d.soil_ind == "Slightly dry" && d.sun == "Part shade to full shade"){
                return d3.color(TopLeftQuad)
            } else if (d.soil_ind == "Slightly dry" && d.sun == "Part shade" ){
                return d3.color(TopLeftQuad)
            } else if (d.soil_ind == "Slightly dry" && d.sun == "Part sun to part shade"){
                return d3.color(TopLeftQuad)
            } else if (d.soil_ind == "Nearly dry" && d.sun == "Part shade to full shade"){
                return d3.color(BottomLeftQuad)
            } else if (d.soil_ind == "Nearly dry" && d.sun == "Part shade" ){
                return d3.color(BottomLeftQuad)
            } else if (d.soil_ind == "Nearly dry" && d.sun == "Part sun to part shade"){
                return d3.color(BottomLeftQuad)
            } else if (d.soil_ind == "Dry" && d.sun == "Part shade to full shade"){
                return d3.color(BottomLeftQuad)
            } else if (d.soil_ind == "Dry" && d.sun == "Part shade"){
                return d3.color(BottomLeftQuad)
            } else if (d.soil_ind == "Dry" && d.sun == "Part sun to part shade"){
                return d3.color(BottomLeftQuad)
            } else if(d.soil_ind == "Never dry" && d.sun == "Full sun to part shade"){
                return d3.color(TopRightQuad)
            } else if(d.soil_ind == "Never dry" && d.sun == "Full sun to part sun" ){
                return d3.color(TopRightQuad)
            } else if(d.soil_ind == "Never dry" && d.sun == "Full sun"){
                return d3.color(TopRightQuad)
            } else if(d.soil_ind == "Slightly dry" && d.sun == "Full sun to part shade"){
                return d3.color(TopRightQuad)
            } else if(d.soil_ind == "Slightly dry" && d.sun == "Full sun to part sun"){
                return d3.color(TopRightQuad)
            } else if(d.soil_ind == "Slightly dry" && d.sun == "Full sun"){
                return d3.color(TopRightQuad)
            } else if(d.soil_ind == "Nearly dry" && d.sun == "Full sun to part shade"){
                return d3.color(BottomRightQuad)
            } else if(d.soil_ind == "Nearly dry" && d.sun == "Full sun to part sun"){
                return d3.color(BottomRightQuad)
            } else if(d.soil_ind == "Nearly dry" && d.sun == "Full sun"){
                return d3.color(BottomRightQuad)
            } else if(d.soil_ind == "Dry" && d.sun == "Full sun to part shade"){
                return d3.color(BottomRightQuad)
            } else if(d.soil_ind == "Dry" && d.sun == "Full sun to part sun"){
                return d3.color(BottomRightQuad)
            } else if(d.soil_ind == "Dry" && d.sun == "Full sun"){
                return d3.color(BottomRightQuad)
            }

//Try this later
/*             if (d.soil_ind == ("Slightly dry" || "Never dry") && d.sun == ("Part shade to full shade" || "Part shade" || "Part sun to part shade")){
                return d3.color(TopLeftQuad)
            } else if (d.soil_ind == ("Nearly dry" || "Dry") && d.sun == ("Part shade to full shade" || "Part shade" || "Part sun to part shade")){
                return d3.color(BottomLeftQuad)
            } else if(d.soil_ind == ("Never dry" || "Slightly dry") && d.sun == ("Full sun to part shade" || "Full sun to prt sun" || "Full sun")){
                return d3.color(TopRightQuad)
            } else if(d.soil_ind == ("Nearly dry" || "Dry") && d.sun == ("Full sun to part shade" ||"Full sun to part sun" || "Full sun")){
                return d3.color(BottomRightQuad)
            }*/

         })
//        .style("stroke",function(d){return color(d.soil_ind+d.sun)})
//        .style('stroke-width',2)
        .transition()
                .duration(2000)
                .attr('r',function(d){return d.radius});


    var bubble = bubbles.merge(bubblesE);


    //updates the x and y each tick-- 'x' and 'y' are for images
    //while cx and cy are for the bubbles
    function ticked(){
        svg.selectAll(".bubble")
            .attr("x", function(d) { return +d.x - (radius); })
            .attr("y", function(d) { return +d.y - (radius); })
            .attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
            .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height -       radius, d.y)); });
    }

    //we can modify the get specific images later on
    bubbles.append("image")
      .attr("xlink:href", function (d){
            if (d.img){
                return "img/" + d.img;
            } else {
                return "apple.png"
            }
        })
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

        simulation.alpha(1.75).restart();
//
//        setTimeout(function(){
////            simulation.stop();
//            mouseover_ready_flag = true;
//        },2000)
    }


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

    // Axis labels

    var y_label_water = "Water";
    var y_label_height = "Max Indoor Height";
    var x_label_sunlight = "Sunlight";
    var x_label_spread = "Max Indoor Spread";

    var x_name = x_label_sunlight;
    var y_name = y_label_water;


    var y_axis_label = g.append("text")
        .attr("class", "y_label")
        .attr("transform", "rotate(-90)")
        .style("font-family", "Roboto Slab")
        .style("font-size", "16pt")
        .attr("x", 0)
        .attr("y", -475)
        .style("font-size", "16px")
        .style("text-anchor", "middle");

    y_axis_label.text(y_name);

    var extra_labels_1 = g.append("text")
        .attr("class", "y_label")
        .attr("transform", "rotate(-90)")
        .style("font-family", "Roboto Slab")
        .style("font-size", "16pt")
        .attr("x", -245)
        .attr("y", -470)
        .style("font-size", "11px")
        .style("text-anchor", "start")
        .text("Needs Less Water")
        .attr("opacity", 0.5);

    var extra_labels_2 = g.append("text")
        .attr("class", "y_label")
        .attr("transform", "rotate(-90)")
        .style("font-family", "Roboto Slab")
        .style("font-size", "16pt")
        .attr("x", 245)
        .attr("y", -470)
        .style("font-size", "11px")
        .style("text-anchor", "end")
        .text("Needs More Water")
        .attr("opacity", 0.5);


    var x_axis_label = g.append("text")
        .attr("class", "x_label")
        .style("font-family", "Roboto Slab")
        .style("font-size", "16pt")
        .attr("x", 10)
        .attr("y", 285)
        .style("font-size", "16px")
        .style("text-anchor", "middle");

    x_axis_label.text(x_name);


    var extra_labels_3 = g.append("text")
        .attr("class", "x_label")
        .style("font-family", "Roboto Slab")
        .style("font-size", "16pt")
        .attr("x", 450)
        .attr("y", 280)
        .style("font-size", "11px")
        .style("text-anchor", "end")
        .text("Prefers Sun")
        .attr("opacity", 0.5);

    var extra_labels_4 = g.append("text")
        .attr("class", "x_label")
        .style("font-family", "Roboto Slab")
        .style("font-size", "16pt")
        .attr("x", -450)
        .attr("y", 280)
        .style("font-size", "11px")
        .style("text-anchor", "start")
        .text("Prefers Shade")
        .attr("opacity", 0.5);

    extra_labels = [extra_labels_1, extra_labels_2, extra_labels_3, extra_labels_4];


    //creating xaxis
    var x_axis = g.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(" + -(width-axisPad)/2 + "," + (height-axisPad)/2 + ")")
        .call(d3.axisBottom(x).ticks(0).tickSizeOuter(0))
        .style("opacity",1)
        .select('path')
        .attr('marker-end','url(#arrowhead_right)')
        .call(d3.axisBottom(x));


    //creating yaxis
    g.append("g")
        .attr("class", "yaxis")
        .attr("transform", "translate(" + -(width-axisPad)/2 + ","+-(height-axisPad)/2+")")
        .call(d3.axisLeft(y).ticks(0).tickSizeOuter(0))
        .style("opacity",1)
        .select("path")
        .attr('marker-end','url(#arrowhead_top)')
        .call(d3.axisLeft(y));


    function padExtent(e, p) {
        if (p === undefined) p = 1;
        return ([e[0] - p, e[1] + p]);
    }


    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //               Button Updaters
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    d3.select("#option1")
        .on("click", function(){
        button_flag = true;

        x_axis_label.text(x_label_sunlight);
        y_axis_label.text(y_label_water);

        for (var i = 0; i < extra_labels.length; i++) {
            extra_labels[i].attr("opacity", 0.5);
        }

        start();
        });
    d3.select("#option2")
        .on('click',function(){
        button_flag = false;

        x_axis_label.text(x_label_spread);
        y_axis_label.text(y_label_height);

        for (var i = 0; i < extra_labels.length; i++) {
            extra_labels[i].attr("opacity", 0);
        }

        start();
    });
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}
