$(document).ready(function() {
        var request = new XMLHttpRequest();
        request.open("GET", "expense.json", false);
        request.send(null);
        var jsonarr = JSON.parse(request.responseText);
        nv.addGraph(function() {
            var chart = nv.models.multiBarHorizontalChart()
                .x(function(d) {
                    return d.label
                })
                .y(function(d) {
                    return d.value
                })
                .margin({
                    top: 100,
                    right: 20,
                    bottom: 50,
                    left: 120
                })
                .showValues(true) //Show bar value next to each bar.
              /*  .tooltips(true) //Show tooltips on hover.*/
               /* .transitionDuration(350)*/
                .showControls(true); //Allow user to switch between "Grouped" and "Stacked" mode.

            chart.yAxis
                .tickFormat(d3.format(',.2f'));

            d3.select('.bar-graph1 svg')
                .datum(jsonarr)
                .call(chart);

            nv.utils.windowResize(chart.update);

            return chart;
        });
    });