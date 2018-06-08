function tooltip(d, xPosition, yPosition)
{
//    var xPosition = parseFloat(d3.event.clientX);
//    var yPosition = parseFloat(d3.event.clientY-50);
    d3.select(".tooltip").classed("hidden", false);

    var tip = d3.select('.tooltip')
           .style("left", (d.x+50) + "px")
           .style("top", (d.y) + "px");
    
    tip.transition()
          .duration(100)
          .style("opacity", .9);
        tip.select(".nickname")            
            .text(d.nickname);
        tip.select('.sci_name')
            .text(d.sci_name);
        tip.select('#soil')
            .html("<div style=\"float: left;margin-right:10px\">" + "Soil Moisture: " + "</div>" +  "<div style=\"float:right\">" + d.soil_ind + "</div>");
        tip.select('#sun')
            .html("<div style=\"float: left;margin-right:10px\">" + "Sun Comfort: " + "</div>" +  "<div style=\"float:right\">" + d.sun + "</div>");
        tip.select('#water')
            .html("<div style=\"float: left;margin-right:10px\">" + "Watering Amount: " + "</div>" +  "<div style=\"float:right\"> " + d.water + "</div>");
    
//    tip.style("opacity",'.9');
    
//    console.log(d);
}