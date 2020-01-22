function createSlider(error, data) {
  var formatDateIntoYear = d3.timeFormat("%Y");
  var formatDate = d3.timeFormat("%b %Y");

  var startDate = new Date(data[0][0].Date),
      endDate = new Date(data[data.length-1][0].Date);

  var margin = {top:50, right:50, bottom:0, left:50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var svg = d3.select("#vis")
              .append("svg")
              .attr("id", "sliderSvg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom);

  ////////// slider //////////

  var moving = false;
  var currentValue = 0;
  var targetValue = width;

  var playButton = d3.select("#start");

  var x = d3.scaleTime()
            .domain([startDate, endDate])
            .range([0, targetValue])
            .clamp(true);

  var slider = svg.append("g")
                  .attr("class", "slider")
                  .attr("transform", "translate(" + margin.left + "," + height/5 + ")");

  slider.append("line")
        .attr("class", "track")
        .attr("x1", x.range()[0])
        .attr("x2", x.range()[1])
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-inset")
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-overlay")
        .call(d3.drag()
            .on("start.interrupt", function() { slider.interrupt(); })
            .on("start drag", function() {
              currentValue = d3.event.x;
              update(error, height, x, x.invert(currentValue), formatDate, data);
            })
        );

  slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0," + 18 + ")")
        .selectAll("text")
        .data(x.ticks(10))
        .enter()
        .append("text")
        .attr("x", x)
        .attr("y", 10)
        .attr("text-anchor", "middle")
        .text(function(d) { return formatDateIntoYear(d); });

  var handle = slider.insert("circle", ".track-overlay")
                    .attr("class", "handle")
                    .attr("r", 9);

  var label = slider.append("text")
                    .attr("class", "label")
                    .attr("text-anchor", "middle")
                    .text(formatDate(startDate))
                    .attr("transform", "translate(0," + (-25) + ")")

  plotSlider(error, height, margin, data, playButton, x, moving, svg)
}

function plotSlider(error, height, margin, data, playButton, x, moving, svg) {
////////// plot //////////

var dataset;

var plot = svg.append("g")
    .attr("class", "plot")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  dataset = data;
  // console.log(dataset)
  drawPlot(error, height, dataset, x, plot);

  playButton.on("click", function() {
      console.log("hoi")
    var button = d3.select(this);
    if (button.text() == "Pause Attacks") {
      moving = false;
      clearInterval(timer);
      // timer = 0;
      button.text("Start Attacks");
    } else {
      moving = true;
      // step = step()
      timer = setInterval(step(error, height, x, currentValue, targetValue, moving, dataset), 100);
      button.text("Pause Attacks");
    }
    console.log("Slider moving: " + moving);
  })
}

function step(error, height, x, currentValue, targetValue, moving, dataset) {
  // height = 500,

  update(error, height, x.invert(currentValue), formatDate, dataset);
  currentValue = currentValue + (targetValue/151);
  if (currentValue > targetValue) {
    moving = false;
    currentValue = 0;
    clearInterval(timer);
    // timer = 0;
    playButton.text("Start Attacks");
    console.log("Slider moving: " + moving);
  }
}

function drawPlot(error, height, data, x, plot) {
  var parseDate = d3.timeParse("%m/%d/%y");
  var locations = plot.selectAll(".location")
    .data(data);

  // if filtered dataset has more circles than already existing, transition new ones in
  locations.enter()
    .append("circle")
    .attr("class", "location")
    .attr("cx", function(d) { return x(parseDate(d[0].Month + "/" + d[0].Day + "/" + d[0].Year[2] + d[0].Year[3]));})
    .attr("cy", height/2)
    .style("fill", function(d) { return d3.hsl((parseDate(d[0].Month + "/" + d[0].Day + "/" + d[0].Year[2] + d[0].Year[3]))/1000000000, 0.8, 0.8)})
    .style("stroke", function(d) { return d3.hsl((parseDate(d[0].Month + "/" + d[0].Day + "/" + d[0].Year[2] + d[0].Year[3]))/1000000000, 0.7, 0.7)})
    .style("opacity", 0.5)
    .attr("r", 8)
      .transition()
      .duration(400)
      .attr("r", 25)
        .transition()
        .attr("r", 8);

  // if filtered dataset has less circles than already existing, remove excess
  locations.exit()
    .remove();
}

function update(error, height, x, h, formatDate, dataset) {
  // update position and text of label according to slider scale
// var formatDate = d3.timeFormat("%b %Y");
var parseDate = d3.timeParse("%m/%d/%y");
startDate = new Date(dataset[0][0].Date)
slider = d3.select(".slider")
var handle = slider.insert("circle", ".track-overlay")
                  .attr("class", "handle")
                  .attr("r", 9);

var label = slider.append("text")
                  .attr("class", "label")
                  .attr("text-anchor", "middle")
                  .text(formatDate(startDate))
                  .attr("transform", "translate(0," + (-25) + ")")

  handle.attr("cx", x(h));
  label.attr("x", x(h))
       .text(formatDate(h));

  // filter data set and redraw plot
  var newData = dataset.filter(function(d) {
    return parseDate(d[0].Month + "/" + d[0].Day + "/" + d[0].Year[2] + d[0].Year[3]) < h;
  })

  var margin = {top:50, right:50, bottom:0, left:50};

  var plot = d3.select("sliderSvg").append("g")
      .attr("class", "plot")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  drawPlot(error, height, newData, x, plot);
}
