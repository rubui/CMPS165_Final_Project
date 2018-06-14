/*global d3*/
/*jslint plusplus: true */

//colors for each quadrant
var TopLeftQuad = "rgb(93, 166, 255)";
var BottomLeftQuad = "rgb(193, 240, 255)";
var TopRightQuad = "rgb(204, 204, 255)";
var BottomRightQuad = "rgb(255, 241, 137)";

function directed_graph(data, svg, button_flag) {
//    http://bl.ocks.org/ericandrewlewis/dc79d22c74b8046a5512
//    http://vallandingham.me/bubble_charts_with_d3v4.html

    var radius = 22,
        nodePadding = 2.5,
        forceStrength = .03,
        axisPad = 90,
        nodeOffset = -10,
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        drawable_width = width + 50,
        drawable_height = height + 20,
        center = {x: width / 2, y: height / 2},
        g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var image_size = radius*2;
    //storing custom paths that create arrows to be later used in axis
    //was kind of painful to determine these values, but I didn't use math so...
    svg.append('defs').append('marker')
        .attr('id', 'arrowhead_right')
            .attr('viewBox', '-0 -5 10 10')
            .attr('refX', 0)
            .attr('refY', 0)
            .attr('orient', '360')
            .attr('markerWidth', 13)
            .attr('markerHeight', 13)
            .attr('xoverflow', 'visible')
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', '#999')
        .style('stroke', 'none');

    svg.append('defs').append('marker')
        .attr('id', 'arrowhead_top')
            .attr('viewBox', '-0 -5 10 10')
            .attr('refX', 0)
            .attr('refY', 0)
            .attr('orient', '270')
            .attr('markerWidth', 13)
            .attr('markerHeight', 13)
            .attr('xoverflow', 'visible')
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', '#999')
        .style('stroke', 'none');

    svg.append('defs').append('marker')
        .attr('id', 'arrowhead_left')
            .attr('viewBox', '-0 -5 10 10')
            .attr('refX', 0)
            .attr('refY', .5)
            .attr('orient', '180')
            .attr('markerWidth', 13)
            .attr('markerHeight', 13)
            .attr('xoverflow', 'visible')
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', '#999')
        .style('stroke', 'none');

    svg.append('defs').append('marker')
        .attr('id', 'arrowhead_bottom')
            .attr('viewBox', '-0 -5 10 10')
            .attr('refX', 0)
            .attr('refY', .5)
            .attr('orient', '90')
            .attr('markerWidth', 13)
            .attr('markerHeight', 13)
            .attr('xoverflow', 'visible')
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', '#999')
        .style('stroke', 'none');

    var x = d3.scaleLinear()
        .domain(padExtent([1,6.5]))
        .range(padExtent([0, width-axisPad]));
        

    var y = d3.scaleLinear()
        .domain(padExtent([1,8.9]))
        .range(padExtent([height-axisPad, 0]));

    var amountCentersX = {
        "Full sun": {x   :6*drawable_width/7 + nodeOffset},
        "Full sun to part sun": {x :5*drawable_width/7 + nodeOffset},
        "Full sun to part shade":{x:4*drawable_width/7 + nodeOffset},
        "Part sun to part shade":{x:3*drawable_width/7 + nodeOffset},
        "Part shade":{x:2*drawable_width/7 + nodeOffset },
        "Part shade to full shade":{x:drawable_width/7 + nodeOffset}
    };

    var amountCentersY = {
        "Dry":{y:4*drawable_height/5 + nodeOffset},
        "Nearly dry":{y:3*drawable_height/5},
        "Slightly dry":{y:2*drawable_height/5},
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
        .force("collide", d3.forceCollide(function(d) {
            return d.radius+0.5;
        }))
        .on('tick',ticked);
        //we want the simulation to pause until nodes exist
 
		
		simulation.stop();


 // Map data from CSV + get max values for spread and hegiht
 var mX = 0;
    var mY = 0;
    var nodes = data.map(function(d){
        var mHeight = parseMaxNum(d.Indoor_Height);
        var mSpread = parseMaxNum(d.Indoor_Spread);
        if (mSpread > mX) mX = mSpread;
        if (mHeight > mY){
            mY = mHeight;
        } 

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
            hanging: d.Hanging,
            flowering: d.Indoor_Flowering,
            max_height: mHeight,
            max_spread: mSpread,
			humidity: d.Humidity,
			air: d.Air_Purifying,
			ph: d.Ph_Soil,
			bloom_period: d.Bloom_Period, 
            bloom_descrip: d.Bloom_Description,
			
			habit: d.Plant_Habit,
			type: d.Type
			
        };
    });


    // Create scales for plant height vs. spread graphs
    var spreadScale = d3.scaleLinear()
        .domain([0, mX])
        .range([35, width-axisPad]);

    var heightScale = d3.scaleLinear()
        .domain([0, mY])
        .range([height-axisPad+35, 60]);

    // Function to parse out max spread and height and return num
    function parseMaxNum(d) {
        var arr = d.split(" ");
        if(parseFloat(arr[2])==0){
            return parseFloat(arr[2])+0.3;
        }
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
            return heightScale(d.max_height);
        } else {
            return amountCentersY[d.soil_ind].y;
        }
    }



//the following code basically creates a 'folder' for both image and circle
    var bubbles = svg.selectAll('.bubble')
        .data(nodes,function(d){return d.id})
        .enter()
        .append("g")
        .attr("class", "force-scale-node")
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on("click", function (d) {
			d3.select("#habit-tip").html("<b>Plant Habit</b> <br>" + d.habit + "<br> <b>Type</b> <br>" + d.type);
			d3.select("#plant-head").html(d.nickname + "<br><text style=\"font-size:11pt; color:darkgrey\">" + d.sci_name + "<br></text>");
			d3.select("#static-tip-data").html("<text>"+ d.sun + "<br>" + d.soil_ind + "<br>" + d.water + "<br>" +d.plant_height + "<br>" + d.plant_spread +"<br>"+d.flowering+ "<br>" + d.bloom_period + "<br>" + d.bloom_descrip +"<br>" + d.humidity + "<br>" + d.air + "<br>" + d.ph+"</text>");
		
			d3.select(".resize_fit_center").attr("src", "img/" + d.img );
		});

    var bubblesE = bubbles.append("circle")
        .classed('bubble',true)
        .attr("r", 0)
        .style("fill",function(d){        
             if ( ( d.soil_ind == "Slightly dry" || d.soil_ind == "Never dry") && (d.sun == "Part shade to full shade" || d.sun == "Part shade" || d.sun == "Part sun to part shade")){
                return d3.color(TopLeftQuad)
            } else if (( d.soil_ind == "Nearly dry" || d.soil_ind =="Dry") && (d.sun ==  "Part shade to full shade" || d.sun == "Part shade" || d.sun == "Part sun to part shade")){
                return d3.color(BottomLeftQuad)
            } else if(( d.soil_ind == "Never dry" || d.soil_ind == "Slightly dry") && (d.sun == "Full sun to part shade" || d.sun == "Full sun to part sun" || d.sun == "Full sun")){
                return d3.color(TopRightQuad)
            } else if(( d.soil_ind == "Nearly dry" || d.soil_ind == "Dry") && ( d.sun == "Full sun to part shade" || d.sun == "Full sun to part sun" || d.sun == "Full sun")){
                return d3.color(BottomRightQuad)
            }
                                 
         })

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
            .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });
		
		svg.selectAll(".my-select")  
		     .transition()
             .duration(4)
			.attr("x", function(d) { return +d.x - (radius*1.4); })
            .attr("y", function(d) { return +d.y - (radius*1.4); })
			.attr("width", 60)
			.attr("height", 60);
    }
   
   //apple.png was taken from the Foods project listed in our sources. Used as place holder image.
   var bubbleImage =
	   bubbles.append("svg:image")
      .attr("xlink:href", function (d){
            if (d.img){
                return "img/" + d.img;
            } else {
                return "img/apple.png"
            }
        })
      .attr("class", "bubble")
      .attr("width", (radius)*2)
      .attr("height", (radius)*2);
	
	bubbleImage.on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on("click", function (d) {
			d3.select("#habit-tip").html("<b>Plant Habit</b> <br>" + d.habit + "<br> <b>Type</b> <br>" + d.type);
			d3.select("#plant-head").html(d.nickname + "<br><text style=\"font-size:11pt; color:darkgrey\">" + d.sci_name + "<br></text>");
			d3.select("#static-tip-data").html("<text>"+ d.sun + "<br>" + d.soil_ind + "<br>" + d.water + "<br>" +d.plant_height + "<br>" + d.plant_spread +"<br>"+d.flowering+ "<br>" + d.bloom_period + "<br>" + d.bloom_descrip +"<br>" + d.humidity + "<br>" + d.air + "<br>" + d.ph+"</text>");
		
			d3.select(".resize_fit_center").attr("src", "img/" + d.img );
		});

    simulation.nodes(nodes);

    //tells the simulation to start again
    start();




    function start(){
        simulation.force('x', d3.forceX().strength(forceStrength).x(nodeXPos));
        simulation.force('y', d3.forceY().strength(forceStrength).y(nodeYPos));

        simulation.alpha(3).restart();
        simulation.alpha(3);
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Mouse over
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    
    function mouseover(d){
    	var dd = d3.select(this)[0];
       	d3.select(this)
          .select("circle")
          .transition()
          .duration(150)
          .attr("r", radius*1.3);

        d3.select(this)
          .transition()
          .duration(150)
		  .attr("x", function(d) { return +d.x - (radius*1.4); })
          .attr("y", function(d) { return +d.y - (radius*1.4); })
          .attr("width", 60)
		  .attr("height", 60);
		d3.select(this).classed("my-select", true);
        
		tooltip(d,parseFloat(d3.event.pageX),parseFloat(d3.event.pageY), width, button_flag);

    }

    function mouseout() {
        d3.select(this)
          .select("circle")
          .transition()
          .duration(150)
          .attr("r", radius);

        d3.select(this)
          .transition()
          .duration(150)
          .attr("width", radius*2)
          .attr("height", radius*2)
          .attr("x", function(d) { return +d.x - (radius); })
          .attr("y", function(d) { return +d.y - (radius); });
		d3.select(this).classed("my-select",false);

        d3.selectAll(".tooltip").classed("hidden", true);

    }
    
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Axis labels
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    var y_label_water = "Water";
    var y_label_height = "Max Indoor Height (ft)";
    var x_label_sunlight = "Sunlight";
    var x_label_spread = "Max Indoor Spread (ft)";

    var x_name = x_label_sunlight;
    var y_name = y_label_water;

    var y_axis_label = g.append("text")
        .attr("class", "y_label")
        .attr("transform", "rotate(-90)")
        .style("font-family", "Roboto Slab")
        .style("font-size", "16pt")
        .attr("x", 0)
        .attr("y", -490)
        .style("font-size", "16px")
        .style("text-anchor", "middle");

    y_axis_label.text(y_name);

    var extra_labels_1 = g.append("text")
        .attr("class", "y_label")
        .attr("transform", "rotate(-90)")
        .style("font-family", "Roboto Slab")
        .style("font-size", "16pt")
        .attr("x", -245)
        .attr("y", -480)
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
        .attr("y", -480)
        .style("font-size", "11px")
        .style("text-anchor", "end")
        .text("Needs More Water")
        .attr("opacity", 0.5);

    var x_axis_label = g.append("text")
        .attr("class", "x_label")
        .style("font-family", "Roboto Slab")
        .style("font-size", "16pt")
        .attr("x", 15)
        .attr("y", 290)
        .style("font-size", "16px")
        .style("text-anchor", "middle");

    x_axis_label.text(x_name);

    var extra_labels_3 = g.append("text")
        .attr("class", "x_label")
        .style("font-family", "Roboto Slab")
        .style("font-size", "16pt")
        .attr("x", 455)
        .attr("y", 280)
        .style("font-size", "11px")
        .style("text-anchor", "end")
        .text("Prefers Sun")
        .attr("opacity", 0.5);

    var extra_labels_4 = g.append("text")
        .attr("class", "x_label")
        .style("font-family", "Roboto Slab")
        .style("font-size", "16pt")
        .attr("x", -455)
        .attr("y", 280)
        .style("font-size", "11px")
        .style("text-anchor", "start")
        .text("Prefers Shade")
        .attr("opacity", 0.5);

    var extra_labels = [extra_labels_1, extra_labels_2, extra_labels_3, extra_labels_4];

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //creating axis
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    
    //xaxis
    var x_axis = g.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(" + -(width-axisPad)/2 + "," + (height-axisPad)/2 + ")")
        .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0))
        .style("opacity", 1)
        .select('path')
        .attr('marker-end', 'url(#arrowhead_right)')
        .call(d3.axisBottom(x));
    

	g.selectAll(".xaxis > .tick > line").style("opacity", "0");
	g.selectAll(".xaxis > .tick > text").style("opacity", "0");
    
    //yaxis
    var y_axis = g.append("g")
        .attr("class", "yaxis")
        .attr("transform", "translate(" + -(width-axisPad)/2 + ","+-(height-axisPad)/2+")")
        .call(d3.axisLeft(y).ticks(4).tickSizeOuter(0))
        .style("opacity",1)
        .select("path")
        .attr('marker-end','url(#arrowhead_top)')
        .call(d3.axisLeft(y));

	g.selectAll(".yaxis > .tick > line").style("opacity", "0");
	g.selectAll(".yaxis > .tick > text").style("opacity", "0");

    

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
        g.selectAll(".xaxis > .tick > line").style("opacity", "0");
        g.selectAll(".xaxis > .tick > text").style("opacity", "0");
        g.selectAll(".yaxis > .tick > line").style("opacity", "0");
        g.selectAll(".yaxis > .tick > text").style("opacity", "0");

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
        g.selectAll(".xaxis > .tick > line").style("opacity", "1");
        g.selectAll(".xaxis > .tick > text").style("opacity", "1");
        g.selectAll(".yaxis > .tick > line").style("opacity", "1");
        g.selectAll(".yaxis > .tick > text").style("opacity", "1");
        g.selectAll(".xaxis > .tick > line").style("stroke", "#999");
        g.selectAll(".xaxis > .tick > text").style("fill", "#999");
        g.selectAll(".yaxis > .tick > line").style("stroke", "#999");
        g.selectAll(".yaxis > .tick > text").style("fill", "#999");


        start();
    
    });
    


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Legend
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var chart = d3.select(".legend")
        .append("svg")
        .style("width", "150px")
        .style("height", "170px")
        .append("g");
    
    var squareSize = 25; 
    var legendTextX = 40; 

    chart.append("rect")
        .attr("x", 5)
        .attr("y", 15)        
        .attr("width", squareSize)
        .attr("height", squareSize)
        .style("fill", TopLeftQuad);
    chart.append("text")
        .attr("class", "legend-text")
        .attr("x", legendTextX)
        .attr("y", 25)
        .text("Needs more water");
    chart.append("text")
        .attr("class", "legend-text")
        .attr("x", legendTextX)
        .attr("y", 40)
        .text("Prefers shade");



    chart.append("rect")
        .attr("x", 5)
        .attr("y", 55)
        .attr("width", squareSize)
        .attr("height", squareSize)
        .style("fill", BottomLeftQuad);
    chart.append("text")
        .attr("class", "legend-text")
        .attr("x", legendTextX)
        .attr("y", 65)
        .text("Needs less water");
    chart.append("text")
        .attr("class", "legend-text")
        .attr("x", legendTextX)
        .attr("y", 80)
        .text("Prefers shade");


    chart.append("rect")
        .attr("x", 5)
        .attr("y", 95)
        .attr("width", squareSize)
        .attr("height", squareSize)
        .style("fill", TopRightQuad);
    chart.append("text")
        .attr("class", "legend-text")
        .attr("x", legendTextX)
        .attr("y", 105)
        .text("Needs more water");
    chart.append("text")
        .attr("class", "legend-text")
        .attr("x", legendTextX)
        .attr("y", 120)
        .text("Prefers sun");


    chart.append("rect")
        .attr("x", 5)
        .attr("y", 135)
        .attr("width", squareSize)
        .attr("height", squareSize)
        .style("fill", BottomRightQuad);
    chart.append("text")
        .attr("class", "legend-text")
        .attr("x", legendTextX)
        .attr("y", 145)
        .text("Needs more water");
    chart.append("text")
        .attr("class", "legend-text")
        .attr("x", legendTextX)
        .attr("y", 160)
        .text("Prefers sun");

    }