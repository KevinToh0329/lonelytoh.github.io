//function making
function makegraph(data){
	var checksvg = d3.select("#bargraph").select("svg");
	var checkoption = d3.select('#drop').select('select');
	
	if(checkoption.empty() == false){
		d3.select('#drop').select('select').remove()
	}
	if(checksvg.empty() == false){
		d3.select("#bargraph").select("svg").remove();
	}

	var margin = {top: 20, right: 160, bottom: 35, left: 50};

	var width = 1450 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	var svg = d3.select("#bargraph")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// Get every column value
	var elements = Object.keys(data[0])
		.filter(function(d){
			return ((d != "Year") & (d != "Country_Name")& (d != "Country_code")
			& (d != "Country_Code")& (d != "Region") & (d != "Sub_Region")
			& (d != "Population_Rank")& (d != "Employmentcount")& (d != "Unemploymentcount"));
		});


	var selection = elements[0];
	//sort by population only
	data.sort(function(a,b){
		return d3.descending(a.Population,b.Population);
	});
	
	//console.log(data);
	
	var y = d3.scaleLinear()
		.domain([0, d3.max(data, function(d){
			return +d[selection];
		})])
		.range([height, 0]);
	
	var x = d3.scaleBand()
		.domain(data.map(function(d){ return d.Country_Name;}))
		.rangeRound([ 0, width])

	var xAxis = d3.axisBottom()
		.scale(x)

	var yAxis = d3.axisLeft()
		.scale(y)

		
	svg.append("g")
    	.attr("class", "x axis")
    	.attr("transform", "translate(0," + height + ")")
    	.call(xAxis)
    	.selectAll("text")
    	.style("font-size", "8px")
		.style("text-anchor", "end")
		.attr("transform", "rotate(-45)" );
		  
	svg.append("g")
		.attr("class", "y axis")
		.call(d3.axisLeft(y).ticks(6).tickFormat(function(d) { if(d>1000000){return parseInt(d / 1000000) + "m"; }else{return parseInt(d)}}))
		.selectAll("text")
		.style("text-anchor", "end");
	
	svg.selectAll("rectangle")
		.data(data)
		.enter()
		.append("rect")
		.attr("class","rectangle")
		.attr("width", width/data.length)
		.attr("height", function(d){
			return height - y(+d[selection]);
		})
		.attr("x", function(d, i){
			return (width / data.length) * i ;
		})
		.attr("y", function(d){
			return y(+d[selection]);
		})
		.append("title")
		.text(function(d){
			return d.Country_Name + " : " + d[selection];
		});
	
	var selector = d3.select("#drop")
		.append('select')
		.attr("id","dropdowncategory")
    	.on("change", function(d){
			selection = document.getElementById("dropdowncategory");
        	y.domain([0, d3.max(data, function(d){
				return +d[selection.value];})]);

        	yAxis.scale(y);

        	d3.selectAll(".rectangle")
           		.transition()
	            .attr("height", function(d){
					return height - y(+d[selection.value]);
				})
				.attr("x", function(d, i){
					return (width / data.length) * i ;
				})
				.attr("y", function(d){
					return y(+d[selection.value]);
				})
           		.ease(d3.easeLinear)
           		.select("title")
           		.text(function(d){
           			return d.Country_Name + " : " + d[selection.value];
           		});
      
           	d3.selectAll("g.y.axis")
           		.transition()
				.call(d3.axisLeft(y).ticks(6).tickFormat(function(d) { if(d>1000000){return parseInt(d / 1000000) + "m"; }else{return parseInt(d)}}))
				.selectAll("text")
				.style("text-anchor", "end");
				
		 });
	

	selector.selectAll("option")
		.data(elements)
		.enter().append("option")
		.attr("value", function(d){
		return d;
		})
		.text(function(d){
		return d;
		})
}

