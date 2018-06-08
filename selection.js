function select_handler(svg, flowers, hung, dogs, cats){
    
    d3.select('#flowers')
        .on("click",function(){
            console.log("clicked flowers");

            flowers = !flowers;
        });
    d3.select('#hung')
        .on("click",function(){
            console.log("clicked");

            hung = !hung;
        });
    d3.select('#dogs')
        .on("click",function(){
            console.log("clicked ");

            dogs = !dogs;
        });
    d3.select('#cats')
        .on("click",function(){
            console.log("clicked");

            cats = !cats;            
        });
    
    console.log("nodessss:",nodes)
}