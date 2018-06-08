function tooltip(d, xPosition, yPosition)
{
//    var xPosition = parseFloat(d3.event.clientX);
//    var yPosition = parseFloat(d3.event.clientY-50);
    d3.select(".tooltip").classed("hidden", false);

    var tip = d3.select('.tooltip')
           .style("left", (d.x+50) + "px")
           .style("top", (d.y) + "px");
	var fSun = tip.select('#sun');
	
	var divTitle = "<div><div style=\"float:left; margin-right:5px; font-weight:bold;\" class=\"tooltip-title;\">";
	
    tip.transition()
          .duration(100)
          .style("opacity", .9);
        tip.select(".nickname")            
            .text(d.nickname);
        tip.select('.sci_name')
			.style("color","darkgrey")
            .html("<br>" + d.sci_name);
		if(d.sun == "Full sun"){
			fSun = tip.style("width", 200 + "px").select('#sun');

		}else{
			fSun = tip.style("width", "auto").select('#sun');
		}
	      
        fSun.html( divTitle +" Sun Comfort: </div> <div style=\"float:right;\">" + d.sun + "</div></div>");
        tip.select('#soil')
            .html("<br>" + divTitle +"Soil Level: </div>" +  "<div style=\"float:right;\">" + d.soil_ind + "</div></div><br>");
        tip.select('#water')
            .html(divTitle + " Water Amount: </div>" +  "<div style=\"float:right;\"> " + d.water + "</div></div>");
    
//    tip.style("opacity",'.9');
    
//    console.log(d);
}