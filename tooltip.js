function tooltip(d, xPosition, yPosition, svgWidth, flag)
{;
	if(flag){
	    d3.select("#sun-soil-water").classed("hidden", false);
		d3.select("#spread-height").classed("hidden", true);
	}else{
		d3.select("#sun-soil-water").classed("hidden", true);
		d3.select("#spread-height").classed("hidden", false);
	}
	var tip = d3.selectAll(".tooltip")
			  .style("left", (d.x+50) + "px")
			  .style("top", (d.y-25) + "px");
 
    var sswtip = d3.select('#sun-soil-water');

    var shtip = d3.select('#spread-height');

    var fSun = sswtip.select('#sun');
    var shTipFix = shtip.select('#height');

    var divTitle = "<div><div style=\"float:left; margin-right:5px; font-weight:bold;\" class=\"tooltip-title;\">";

    tip.transition()
          .duration(100)
          .style("opacity", .9);
        tip.select(".nickname")            
            .text(d.nickname);
        tip.select('.sci_name')
			.style("color","darkgrey")
            .html("<br>" + d.sci_name);
	    
		if((d.sun == "Full sun") ||(d.sun == "Full sun to part sun")){
			fSun = sswtip.style("width", 250 + "px");
		}else{
			fSun = sswtip.style("width", "auto");
		}
	
		if(xPosition > svgWidth + 125){
			shTipFix = shtip.style("width", 220 + "px");
		}else{
			shTipFix = shtip.style("width", "auto");
		}
	      
        fSun.select("#sun").html( divTitle +" Sun Comfort: </div> <div style=\"float:right;\">" + d.sun + "</div></div>");
        tip.select('#soil')
            .html("<br>" + divTitle +"Soil Level: </div>" +  "<div style=\"float:right;\">" + d.soil_ind + "</div></div><br>");
        tip.select('#water')
            .html(divTitle + " Water Amount: </div>" +  "<div style=\"float:right;\"> " + d.water + "</div></div>");
	
	    shTipFix.select("#height").html( divTitle +" Height: </div> <div style=\"float:right;\">" + d.plant_height + "</div></div>");
        tip.select('#spread')
            .html("<br>" + divTitle +"Spread: </div>" +  "<div style=\"float:right;\">" + d.plant_spread + "</div></div><br>");

}
