function createMap(error, json, data){
	//Width and height of map
	var width = 525;
	var height = 500;

	// D3 Projection
	var projection = d3.geoAlbers()
					   .scale([700])
						 .rotate([0])
						 .translate([150,400])          // scale things down so see entire US

	// Define path generator
	var path = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
			  	 .projection(projection);  // tell path generator to use albersUsa projection

	//Create SVG element and append map to the SVG
	var svg = d3.select("#europeMap")
				.append("svg")
				.attr("width", width)
				.attr("height", height);

dataVis(error, json, data, projection, path, svg)

}

function dataVis(error, json, data, projection, path, svg){

var attackData = []
	// Loop through each state data value in the .csv file
	for (var i = 0; i < data.length; i++) {

		// Grab State Name
		attackData[i] = [{"Instance": i,
											"Date": data[i].imonth + "/" + data[i].iday + "/" + data[i].iyear,
											"Day": data[i].iday,
											"Month": data[i].imonth,
											"Year": data[i].iyear,
										 "Country": data[i].country_txt,
										 "City": data[i].city,
									   "Latitude": data[i].latitude,
									 	 "Longitude": data[i].longitude}]
}

// createSlider(error, attackData)
// Bind the data to the SVG and create one path per GeoJSON feature
svg.selectAll("path")
	.data(json.features)
	.enter()
	.append("path")
	.attr("d", path)
	.style("stroke", "#fff")
	.style("stroke-width", "0.1")
  .style("fill", "darkgreen")

svg.style("fill", "blue")

d3.select("#startSpatial").on("click", function(d){
	 svg.selectAll("circle")
			.data(attackData)
			.enter()
			.append("circle")
			.attr("class", "locationMap")
			.attr("cx", function(d){
				return projection([d[0].Longitude, d[0].Latitude])[0]})
			.attr("cy", function(d){
				return projection([d[0].Longitude, d[0].Latitude])[1]})
			.attr("r", 3)
			.attr("stroke", "black")
			.attr("fill", "red")
			.style("opacity", 0)

			startAttacks(error, svg);
})}

function startAttacks(error, svg){
	// d3.select("#europeMap")
	d3.selectAll("circle.locationMap")
		.style("opacity",0)
	// .attr("r", 8)
	// 	.transition()
	// 	.duration(400)
	// 	.attr("r", 25)
	// 		.transition()
	// 		.attr("r", 8);
	// function(d,i){
	// 	return i * 400})


		 .transition()
		 .style("opacity",1)
		 .duration(400)
		 .delay(function (d,i){
			 return i*97.52;})
		 .attr("r", 8)
		 .transition()
		 .attr("r", 3)
		 .style("opacity", 0.3);

		 // .transition()
		 // .delay(function (d,i) {
		 //   return i * 2000
		 // })
		 // .ease(d3.easeLinear)
		 // .delay(function (d,i) {
			//  return i * 3000
		 // })
		 // .duration(2000)
		 // .ease(d3.easeLinear)
		 // .style("opacity",0.3)
};
