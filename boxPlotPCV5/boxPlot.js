ofunction boxplotChart(width, height, margin) {
  //  var margin = { top: 70, right: 30, bottom: 50, left: 70 };
  //  var width = 800, height = 500;

  // append the svg object to the body of the page
  var svg = d3.select("#my_dataviz").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv("data.csv").then(function (data) {
    // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
    var sumstat = d3.nest()
      .key(function (d) { return d.product_category; })
      .rollup(function (d) {
        q1 = d3.quantile(d.map(function (g) { return g.revenue; }).sort(d3.ascending), .25)
        median = d3.quantile(d.map(function (g) { return g.revenue; }).sort(d3.ascending), .5)
        q3 = d3.quantile(d.map(function (g) { return g.revenue; }).sort(d3.ascending), .75)
        interQuantileRange = q3 - q1
        min = q1 - interQuantileRange
        max = q3 + interQuantileRange
        return ({ q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max })
      }).entries(data)

    // Show the X and Y scale
    var x = d3.scaleBand().rangeRound([0, width])
      .domain(data.map(function (d) { return d.product_category; }))
      .paddingInner(1)
      .paddingOuter(.5)

    var y = d3.scaleLinear().domain([0, d3.max(data, d => { return +d.revenue; })]).range([height, 0])

    svg.append("g").
      attr("transform", "translate(0," + height + ")").
      call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-60)");

    svg.append("g").call(d3.axisLeft(y).tickFormat(d3.format(".2s")));

    var numberFormat = d3.format(',s');
    // create a tooltip
    var tooltip = d3.select("#my_dataviz")
      .append("div")
      .style("opacity", 1)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "0.1px")
      .style("border-radius", "1px")
      .style("padding", "0.5px");

    // Three function that change the tooltip when user hover/ leave a cell
    var mouseover = function (d) {
      tooltip.html("<b>" + d.key + "</b> <br> Max: " + numberFormat(d.value.max)
        + "<br> Q3: " + numberFormat(d.value.q3)
        + "<br> Median: " + numberFormat(d.value.median)
        + "<br> Q1: " + numberFormat(d.value.q1)
        + "<br> Min: " + numberFormat(d.value.min))
        .style("left", "2px")
        .style("top", "0px")
        .style("opacity", 1)
      console.log(d.key, ":", d.value.max, d.value.q3, d.value.median, d.value.q1, d.value.min)
    }

    var mouseleave = function (d) { tooltip.transition().duration(150).style("opacity", 0); }


    // Show the main vertical line
    svg.selectAll("vertLines")
      .data(sumstat).enter().append("line")
      .attr("x1", function (d) { return (x(d.key)) })
      .attr("x2", function (d) { return (x(d.key)) })
      .attr("y1", function (d) { return (y(d.value.min)) })
      .attr("y2", function (d) { return (y(d.value.max)) })
      .attr("stroke", "black")
      .style("width", 40)

    // rectangle for the main box
    var boxWidth = 80
    svg.selectAll("boxes")
      .data(sumstat).enter().append("rect")
      .attr("x", function (d) { return (x(d.key) - boxWidth / 2) })
      .attr("y", function (d) { return (y(d.value.q3)) })
      .attr("height", function (d) { return (y(d.value.q1) - y(d.value.q3)) })
      .attr("width", boxWidth)
      .attr("stroke", "black")
      .style("fill", "#31a354")
      .on("mouseover", mouseover)
      .on("mouseout", mouseleave);

    // Show the median
    svg.selectAll("medianLines")
      .data(sumstat).enter().append("line")
      .attr("x1", function (d) { return (x(d.key) - boxWidth / 2) })
      .attr("x2", function (d) { return (x(d.key) + boxWidth / 2) })
      .attr("y1", function (d) { return (y(d.value.median)) })
      .attr("y2", function (d) { return (y(d.value.median)) })
      .attr("stroke", "black")
      .style("width", 80)

    // Add individual points with jitter
    var jitterWidth = 50
    svg.selectAll("indPoints")
      .data(data).enter().append("circle")
      .attr("cx", function (d) { return (x(d.product_category) - jitterWidth / 2 + Math.random() * jitterWidth) })
      .attr("cy", function (d) { return (y(d.revenue)) })
      .attr("r", 4)
      .style("fill", "white")
      .attr("stroke", "black")
  })
}
boxplotChart(1000, 500, { top: 70, right: 30, bottom: 170, left: 70 });
