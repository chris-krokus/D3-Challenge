var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv").then(function(healthData) {
    healthData.forEach(function(data) {
        data.income = +data.income;
        data.smokes = +data.smokes;
        // data.abbr = +data.abbr;
        console.log(healthData)
    });

    var xLinearScale = d3.scaleLinear()
        .domain([35000, d3.max(healthData, d => d.income)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([8, d3.max(healthData, d => d.smokes)])
        .range([height, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.income))
        .attr("cy", d => yLinearScale(d.smokes))
        .attr("r", "18")
        .attr("fill", "green")
        .attr("opacity", ".25")

    var circleLabels = chartGroup.selectAll(null)
        .data(healthData)
        .enter()
        .append("text");

    circleLabels
        .attr("x", function(d) {
            return xLinearScale(d.income);
        })
        .attr("y", function(d) {
            return yLinearScale(d.smokes);
        })
        .text(function(d) {
            return d.abbr;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "8px")
        .attr("text-anchor", "middle")
        .attr("fill", "black");

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`<br>State: ${d.abbr}<br>Income: ${d.income}<br>Smoke %: ${d.smokes}`);
        });
    chartGroup.call(toolTip);

    circlesGroup.on("click", function(data) {
        toolTip.show(data, this);
    })

    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 20)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Percentage of People Who Smoke");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Annual Income (U.S. Dollars per Person)");
}).catch(function(error) {
    console.log(error);
});