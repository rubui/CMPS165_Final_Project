function select_handler(){
    //put all flags into 1 object
    //because to pass primitives in js by reference isn't allowed ;_;
    var flags = {
		airp:true,
        flowers:true,
        hung:true,
        dogs:true,
        cats:true
    };
    
    d3.select("#dogs")
        .on("click",function(type) {
            opacity_macro(flags,"dogs","toxic_dogs","No");
        });    
    d3.select('#flowers')
        .on("click",function(){
            opacity_macro(flags,"flowers","flowering",("Yes"||"Rarely"));
        });
    d3.select('#hung')
        .on("click",function(){
            opacity_macro(flags,"hung","hanging","Yes");
        });
    d3.select('#cats')
        .on("click",function(){
            opacity_macro(flags,"cats","toxic_cats","No");
        });
	d3.select('#airp')
        .on("click",function(){
            opacity_macro(flags,"airp","air","Yes");
    });
}

function opacity_macro(flag,type,name,cmp){
    
        var t = d3.transition()
            .duration(300)
            .ease(d3.easeLinear);
    
        var referenceType ={
            flowers: "flowering",
            hung: "hanging",
            cats: "toxic_cats",
            dogs: "toxic_dogs",
			airp: "air"
        };
    
        var referenceCmp ={
            flowers:("Yes"||"Rarely"),
            hung:"Yes",
            cats:"No",
            dogs:"No",
			airp:"Yes"
        }
    
        if (flag[type]){
            var x={
                num:0,
                reg:[]
            };
            flag[type]=false;

            //count the number of tripped flags currently
            Object.keys(flag).map(function(key){
                if(!flag[key]){
                    x.num++;
                    x.reg=x.reg.concat([key]);
                }});        

             if(x.num==0)
                {
                   //Select all buble and hide
                  d3.selectAll(".bubble").transition(t)
                  .style("opacity", 0.1)
                  .filter(function(d){
                    return (d[name] == cmp);
                  })
                    //Make this line seen
                  .style("opacity", 1);
                }
             if(x.num==1)
          		{
                //2 buttons pressed, only release if only matches to 1
                d3.selectAll(".bubble").transition(t)
                  .style("opacity", 0.1)
                  .filter(function(d){
                  return (d[name]==cmp&&
                          d[referenceType[x.reg[0]]]==referenceCmp[x.reg[0]]);
                  })
                    //Make this line seen
                  .style("opacity", 1)
                  .attr("id","");
                
                    
                }
            if(x.num==2)
                {
                d3.selectAll(".bubble").transition(t)
                  .style("opacity",0.1)
                  .filter(function(d){
                    return (d[name]==cmp&&
                            d[referenceType[x.reg[0]]]==referenceCmp[x.reg[0]]&&
                            d[referenceType[x.reg[1]]]==referenceCmp[x.reg[1]]);
                  })
                    //Make this line seen
                   .style("opacity", 1)
                    .attr("id","");
                }
			
            if(x.num==3)
                {
                d3.selectAll(".bubble").transition(t)
                  .style("opacity",0.1)
                  .filter(function(d){
                    return (d[name]==cmp&&
                            d[referenceType[x.reg[0]]]==referenceCmp[x.reg[0]]&&
                            d[referenceType[x.reg[1]]]==referenceCmp[x.reg[1]]&&
                            d[referenceType[x.reg[2]]]==referenceCmp[x.reg[2]]);
                  })
                   .style("opacity", 1)
                    .attr("id","");

                }
			
             if(x.num==4)
                {
                d3.selectAll(".bubble").transition(t)
                  .style("opacity",0.1)
                  .filter(function(d){
                    return (d[name]==cmp&&
                            d[referenceType[x.reg[0]]]==referenceCmp[x.reg[0]]&&
                            d[referenceType[x.reg[1]]]==referenceCmp[x.reg[1]]&&
                            d[referenceType[x.reg[2]]]==referenceCmp[x.reg[2]]&&
                            d[referenceType[x.reg[3]]]==referenceCmp[x.reg[3]]);
                  })
                   .style("opacity", 1)
                    .attr("id","");

                }
            if(x.num==5)
                {
                d3.selectAll(".bubble").transition(t)
                  .style("opacity",0.1)
                  .filter(function(d){
                    return (d[name]==cmp&&
                            d[referenceType[x.reg[0]]]==referenceCmp[x.reg[0]]&&
                            d[referenceType[x.reg[1]]]==referenceCmp[x.reg[1]]&&
                            d[referenceType[x.reg[2]]]==referenceCmp[x.reg[2]]&&
                            d[referenceType[x.reg[3]]]==referenceCmp[x.reg[3]]&&
                            d[referenceType[x.reg[4]]]==referenceCmp[x.reg[4]]);
                  })
                   .style("opacity", 1)
                    .attr("id","");

                }
        }
        else{
            var x={
                num:0,
                reg:[]
            };
            flag[type]=true;

            //count the number of tripped flags currently
            Object.keys(flag).map(function(key){
                if(!flag[key]){
                    x.num++;
                    x.reg=x.reg.concat([key]);
                }});
            

//            console.log(x);
            if(x.num==0)
                {
                //only 1 button pressed, release all
                d3.selectAll(".bubble").transition(t)
                    .style("opacity",1)
                    .attr("id","");
                }
            if(x.num==1)
                {
                //2 buttons pressed, only release if only matches to 1
                console.log("num = 2");
                d3.selectAll(".bubble").transition(t)
                  .filter(function(d){
                    return (d[name]!=cmp&&
                            d[referenceType[x.reg[0]]]==referenceCmp[x.reg[0]]);
                  })
                    //Make this line seen
                   .style("opacity", 1)
                    .attr("id","");
                
                    
                }
            if(x.num==2)
                {
                d3.selectAll(".bubble").transition(t)
                  .filter(function(d){
                    return (d[name]!=cmp&&
                            d[referenceType[x.reg[0]]]==referenceCmp[x.reg[0]]&&
                            d[referenceType[x.reg[1]]]==referenceCmp[x.reg[1]]);
                  })
                    //Make this line seen
                   .style("opacity", 1)
                    .attr("id","");
                }
            if(x.num==3)
                {
                d3.selectAll(".bubble").transition(t)
                  .filter(function(d){
                    return (d[name]!=cmp&&
                            d[referenceType[x.reg[0]]]==referenceCmp[x.reg[0]]&&
                            d[referenceType[x.reg[1]]]==referenceCmp[x.reg[1]]&&
                            d[referenceType[x.reg[2]]]==referenceCmp[x.reg[2]]);
                  })
                   .style("opacity", 1)
                    .attr("id","");

                }
            if(x.num==4)
                {
                d3.selectAll(".bubble").transition(t)
                  .filter(function(d){
                    return (d[name]!=cmp&&
                            d[referenceType[x.reg[0]]]==referenceCmp[x.reg[0]]&&
                            d[referenceType[x.reg[1]]]==referenceCmp[x.reg[1]]&&
                            d[referenceType[x.reg[2]]]==referenceCmp[x.reg[2]]&&
                            d[referenceType[x.reg[3]]]==referenceCmp[x.reg[3]]);
                  })
                    .style("opacity", 1)
                    .attr("id","");

                }
            if(x.num==5)
                {
            d3.selectAll(".bubble").transition(t)
              .filter(function(d){
                return (d[name]!=cmp&&
                        d[referenceType[x.reg[0]]]==referenceCmp[x.reg[0]]&&
                        d[referenceType[x.reg[1]]]==referenceCmp[x.reg[1]]&&
                        d[referenceType[x.reg[2]]]==referenceCmp[x.reg[2]]&&
                        d[referenceType[x.reg[3]]]==referenceCmp[x.reg[3]]&&
                        d[referenceType[x.reg[4]]]==referenceCmp[x.reg[4]]);
              })
                   .style("opacity", 1)
                    .attr("id","");

                }
            
        }

    }