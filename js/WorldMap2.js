function draw(data){

      //Legend
    var ordinal = d3.scaleOrdinal()
    .domain(["100,000 ~ 999,999","1,000,000 ~ 9,999,999","10,000,000 ~ 99,999,999","100,000,000 ~ 999,999,999","1,000,000,000 +"])
    .range([ "#FFC300", "#FF5733", "#C70039", "#900C3F", "#581845"]);
    
    var margin = { top:50, left:50, right:50, bottom:50},
      height = 600 - margin.top - margin.bottom,
      width = 960 - margin.left - margin.right;
    
    var projection = d3.geoNaturalEarth1()
      .translate([width/2,height/2])
    var path = d3.geoPath().projection(projection)

    d3.json("https://unpkg.com/world-atlas@1.1.4/world/50m.json", function(json){
        var countries = topojson.feature(json, json.objects.countries).features
        
        var checksvg = d3.select("#worldMap").select("svg");
        if(checksvg.empty() == false){
            d3.select("#worldMap").select("svg").remove();
        }
        var svg = d3.select("#worldMap")
                .append("svg")
                .attr("height",height+margin.top+margin.bottom)
                .attr("width",width+margin.left+margin.right)
                .attr("transform","translate("+margin.left+","+margin.top+")");
        
        var svg = d3.select("#worldMap").select("svg");
        svg.append("g")
            .attr("class", "legendOrdinal")
            .attr("transform", "translate(20,300)");
        
        var legendOrdinal = d3.legendColor()
          .shape("path", d3.symbol().type(d3.symbolCircle).size(150)())
          .shapePadding(10)
          .scale(ordinal);

        svg.select(".legendOrdinal")  
          .call(legendOrdinal);
        //var countries = topojson.feature(json, json.objects.countries).features
        svg.selectAll(".country")
           .data(countries)
           .enter().append("path")
           .attr("class","country")
           .attr("d", path)
           .attr("fill", function(d){
            var i;
            for(i=0;i<data.length;i++){
                if(d.id == data[i].Country_code){
                    if(data[i].Population_Rank == 1){return "#581845"}
                    else if(data[i].Population_Rank == 2){return "#900C3F"}
                    else if(data[i].Population_Rank == 3){return "#C70039"}
                    else if(data[i].Population_Rank == 4){return "#FF5733"}
                    else {return "#FFC300"}
                }
            }return "#e3e3e3"
        })
           .append('title')
           .text(function(d){
            var i;
            for(i=0;i<data.length;i++){
                if(d.id == data[i].Country_code){
                    return "Name: " + data[i].Country_Name + 
					"\nPopulation: " + data[i].Population + 
					"\nBirth Rate (,000): " + data[i].Birthrate + 
					"\nDeath Rate (,000): " + data[i].Deathrate + 
					"\nEmployment Rate (%): " + data[i].Employmentrate + 
					"\nEmployment Count: " + data[i].Employmentcount + 
					"\nUnemployment Rate (%): " + data[i].Unemploymentrate + 
					"\nUnemployment Count: " + data[i].Unemploymentcount +
					"\nYear: " + data[i].Year
					;
                
            }
            
        };
    
});})};
