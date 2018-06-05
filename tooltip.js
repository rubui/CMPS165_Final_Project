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
        tip.select('.soil')
            .text('Soil Moisture: '+d.soil_ind);
        tip.select('.sun')
            .text('Sun-Comfort: '+d.sun);
        tip.select('.water')
            .text('Watering Amounts: '+d.water);
    
//    tip.style("opacity",'.9');
    
//    console.log(d);
}