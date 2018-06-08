function select_handler(svg, flowers, hung, dogs, cats){
    
    d3.select('#flowers')
        .on("click",function(){
            console.log("clicked flowers");

            flowers = !flowers;
        
            if(flowers==false){
                
                
            }
        });
    d3.select('#hung')
        .on("click",function(){
            console.log("clicked");

            hung = !hung;
            
            if(hung==false){
                
               
            }
        });
    d3.select('#dogs')
        .on("click",function(){
            console.log("clicked ");

            dogs = !dogs;
            console.log(dogs);

            
            if(dogs==false){
                nodes.map(function(d){
//                    console.log(d.toxic_dogs);
                });
               
            }
        });
    d3.select('#cats')
        .on("click",function(){
            console.log("clicked");

            cats = !cats;
            
            if(cats==false){
                
               
            }
        });
    
    console.log("nodessss:",nodes)
}