$(document).ready(function() {
    console.log("ready!");


    L.mapbox.accessToken = 'pk.eyJ1IjoiaW5pdGRvdCIsImEiOiJ3VkkxTldvIn0.7UPZ8q9fgBE70dMV7e0sLw';

    var map = L.mapbox.map('map', 'initdot.ljplbdcp', {
            zoomControl: false
        }).setView([21.836006, 82.824707], 5),
        // color reference from color brewer
        mapBrew = ['rgb(255,255,204)', 'rgb(217,240,163)', 'rgb(173,221,142)', 'rgb(120,198,121)', 'rgb(65,171,93)', 'rgb(35,132,67)', 'rgb(0,90,50)'],
        // population density range used for choropleth and legend
        mapRange = [50, 40, 30, 20, 10, 5, 0];


    // Disable drag and zoom handlers.
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.keyboard.disable();

    // Disable tap handler, if present.
    if (map.tap) map.tap.disable();



    // map legend for population density
    var legend = L.mapbox.legendControl({
            position: "bottomleft"
        }).addLegend(getLegendHTML()).addTo(map),
        // popup for displaying state census details
        popup = new L.Popup({
            autoPan: false,
            className: 'statsPopup'
        }),
        // layer for each state feature from geojson
        statesLayer,
        closeTooltip;

    // fetch the state geojson data
    d3.json("india-states.json", function(statesData) {
        statesLayer = L.geoJson(statesData, {
            style: getStyle,
            onEachFeature: onEachFeature
        }).addTo(map);

    });

    var getBarColor = d3.scale.linear()
        .domain([0, 50, 100])
        .range(["green", "yellow", "red"]);

    function getStyle(feature) {
        return {
            weight: 2,
            opacity: 0.1,
            color: 'black',
            fillOpacity: 0.85,
            fillColor: getDensityColor(indiaCensus.states[feature.properties.code].density)
        };
    }

    // get color depending on population density value
    function getDensityColor(d) {
        var colors = Array.prototype.slice.call(mapBrew).reverse(), // creates a copy of the mapBrew array and reverses it
            range = mapRange;

        return d > range[0] ? colors[0] :
            d > range[1] ? colors[1] :
            d > range[2] ? colors[2] :
            d > range[3] ? colors[3] :
            d > range[4] ? colors[4] :
            d > range[5] ? colors[5] :
            colors[6];
    }

    function onEachFeature(feature, layer) {
        layer.on({
            mousemove: mousemove,
            mouseout: mouseout
            //click: zoomToFeature
        });
    }

    function mousemove(e) {

        console.log(e);


        var layer = e.target;

        var popupData = {
            state: indiaCensus.states[layer.feature.properties.code].name,
            density: indiaCensus.states[layer.feature.properties.code].density,
            area: indiaCensus.states[layer.feature.properties.code].area,
            growth: indiaCensus.states[layer.feature.properties.code].growth,
            population: indiaCensus.states[layer.feature.properties.code].population,
            capital: indiaCensus.states[layer.feature.properties.code].capital.name
        };

        console.log(popupData);

        popup.setLatLng(e.latlng);

        var popContent = L.mapbox.template(d3.select("#popup-template").text(), popupData);
        popup.setContent(popContent);

        if (!popup._map) popup.openOn(map);
        window.clearTimeout(closeTooltip);

        // highlight feature
        layer.setStyle({
            weight: 2,
            opacity: 0.3,
            fillOpacity: 0.9
        });

        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }
        // update the graph with literacy and sex ratio data
        updateGraph(indiaCensus.states[layer.feature.properties.code]);
    }

    function mouseout(e) {
        statesLayer.resetStyle(e.target);
        closeTooltip = window.setTimeout(function() {
            // ref: https://www.mapbox.com/mapbox.js/api/v2.1.6/l-map-class/
            map.closePopup(popup); // close only the state details popup
        }, 100);
    }

    function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
    }

    function getLegendHTML() {
        var grades = Array.prototype.slice.call(mapRange).reverse(), // creates a copy of ranges and reverses it
            labels = [],
            from, to;
        // color reference from color brewer
        var brew = mapBrew;

        for (var i = 0; i < grades.length; i++) {
            from = grades[i];
            to = grades[i + 1];

            labels.push(
                '<i style="background:' + brew[i] + '"></i> ' +
                from + (to ? '&ndash;' + to : '+'));
        }

        return '<span>Disease Gradient</span><br>' + labels.join('<br>');
    }

    // ref: https://www.mapbox.com/mapbox.js/api/v2.1.6/l-icontrol/
    /*var PieGraphControl = L.Control.extend({
    options: {
        position: 'topright'
    },*/



    var BarGraphControl = L.Control.extend({
        options: {
            position: 'bottomright'
        },

        onAdd: function(map) {
            // create the control container with a particular class name
            var container = L.DomUtil.create('div', 'bar-graph');
            // ... initialize other DOM elements, add listeners, etc.
            return container;
        }
    });


    // add the piegraph and bar graph container
    /*map.addControl(new BarGraphControl())
.addControl(new BarGraphControl1());*/

    // START: Bar Graph (Literacy)
    var barWidth = 250,
        barHeight = 180,
        barSize = 50,
        // attach the literacy data for 'Delhi' initially
        diseaseData = [86.21, 50, 75, 5, 77];

    var barName = d3.select(".bar-graph")
        .append("div")
        
        .text("Delhi")
        .style("color", "white")
        .style("font-size", "15px")
        .style("font-weight", "bold")
        .style("margin", "6px 0");

    var barHolder = d3.select(".bar-graph")
        .append("svg")
        .attr("id", "literacy-bar")
        .attr("width", barWidth)
        .attr("height", barHeight)


    var barLegend = d3.select(".bar-graph")
        .append("div")
        .style("color", "white")
        .style("font-weight", "bold")
        .style("font-size", "15px")
        .text("1.Acute Diarrhoea Cases ")
        .append("span")
        .attr("id", "literacy-percent")
        .text(diseaseData[0].toFixed(2) + "%")
        .style("color", getBarColor(diseaseData[0]));


    var barLegend1 = d3.select(".bar-graph")
        .append("div")
        .style("color", "white")
        .style("font-weight", "bold")
        .style("font-size", "15px")
        .text("2.Malaria Cases: ")
        .append("span")
        .attr("id", "literacy-percent")
        .text(diseaseData[1].toFixed(2) + "%")
        .style("color", getBarColor(diseaseData[1]));


    var barLegend2 = d3.select(".bar-graph")
        .append("div")
        .style("color", "white")
        .style("font-weight", "bold")
        .style("font-size", "15px")
        .text("3.Acute Respiaratory Infection Cases: ")
        .append("span")
        .attr("id", "literacy-percent")
        .text(diseaseData[2].toFixed(2) + "%")
        .style("color", getBarColor(diseaseData[2]));

    var barLegend3 = d3.select(".bar-graph")
        .append("div")
        .style("color", "white")
        .style("font-weight", "bold")
        .style("font-size", "15px")
        .text("4.Japanese Encephalitis Cases: ")
        .append("span")
        .attr("id", "literacy-percent")
        .text(diseaseData[3].toFixed(2) + "%")
        .style("color", getBarColor(diseaseData[3]));

    var barLegend4 = d3.select(".bar-graph")
        .append("div")
        .style("color", "white")
        .style("font-weight", "bold")
        .style("font-size", "15px")
        .text("5.Viral Hepatitis Cases: ")
        .append("span")
        .attr("id", "literacy-percent")
        .text(diseaseData[4].toFixed(2) + "%")
        .style("color", getBarColor(diseaseData[4]));




    var litBar = d3.select("#literacy-bar").selectAll(".barone")

    .data(diseaseData)
        .enter().append("rect")
        .attr("class", "barone")
        .attr("height", function(d) {

            var h = barHeight * (d / 100);
            return h;
        })
        .attr("width", function(d) {

            var h = barHeight * (d / 100);
            return 50;
        })
        .attr("x", function(d, i) {
            var h = i * 50,
                nh = h;
            return nh;
        })
        .attr("y", function(d) {
            var h = barHeight * (d / 100),
                nh = barHeight - h;
            return nh;
        })
        .style("fill", function(d) {
            return getBarColor(d);
        });
    // END: Bar Graph (Literacy)

    // START: Updates both Pie Graph and Bar Graph
    function updateGraph(graphData) {



        // Update Bar Graph
        barName.text(graphData.name);

        var barData = graphData["diseases"]


        var array_values = new Array();

        for (var key in barData) {

            array_values.push(barData[key]);
        }



        d3.select("#literacy-bar").selectAll("rect")
            .data(array_values)
            .transition().duration(500)
            .attr("height", function(d) {
                var h = barHeight * (d / 100);
                //  console.log("this:")
                //  console.log(h)
                return h;
            })
            .attr("y", function(d) {
                var h = barHeight * (d / 100),
                    nh = barHeight - h;
                return nh;
            })
            .style("fill", function(d) {
                return getBarColor(d);
            });

        barLegend.text(barData["acute diarrhoea"].toFixed(2) + "%")
            .transition().duration(500)
            .style("color", getBarColor(barData["acute diarrhoea"]));

        barLegend1.text(barData["malaria"].toFixed(2) + "%")
            .transition().duration(500)
            .style("color", getBarColor(barData["malaria"]));
        barLegend2.text(barData["acute respiratory infection"].toFixed(2) + "%")
            .transition().duration(500)
            .style("color", getBarColor(barData["acute respiratory infection"]));
        barLegend3.text(barData["japanese encephalitis"].toFixed(2) + "%")
            .transition().duration(500)
            .style("color", getBarColor(barData["japanese encephalitis"]));
        barLegend4.text(barData["viral hepatitis"].toFixed(2) + "%")
            .transition().duration(500)
            .style("color", getBarColor(barData["viral hepatitis"]));
    } // END: updateChart()



    /*function getLiteracyColor(literacy) {
    // color from colorbrew
    var literacyBrew = ['rgb(215,25,28)', 'rgb(253,174,97)', 'rgb(166,217,106)', 'rgb(26,150,65)'].reverse(),
        literacyRange = [90, 80, 70, 60];

    literacy = +literacy;

    return literacy > literacyRange[0] ? literacyBrew[0] :
        literacy > literacyRange[1] ? literacyBrew[1] :
        literacy > literacyRange[2] ? literacyBrew[2] :
        literacyBrew[3];
}*/

    // draw the layer with capital markers
    /*var capitalLayer;

//drawCapitalMarkers();

// add the capitals toggle checkbox
var capitalFilter = document.getElementById("capitals-filter"),
    capitalFilterDiv = document.getElementById("capitals-filter-div");

capitalFilter.addEventListener("change", function() {
    this.checked ? map.addLayer(capitalLayer) : map.removeLayer(capitalLayer);
});

setCapitalFilterPosition();
*/
    function drawCapitalMarkers() {
        var capitalGeoJson = [];

        for (var state in indiaCensus.states) {
            var capitalData = indiaCensus.states[state].capital;
            // capital marker geojson data
            capitalData.details.forEach(function(capital, index) {
                // location is normally in (latitude, longitude) format
                // but for geojson the format is  (longitude, latitude)
                capitalGeoJson.push({
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        // make an array copy and reverse the co-ordinates to (long,lat) for geojson
                        "coordinates": Array.prototype.slice.call(capital.coordinates).reverse()
                    },
                    "properties": {
                        "title": capital.name,
                        "description": capital.population ? "<strong>Population: </strong>" + capital.population : "(census data not available)",
                        "data": capital,
                        "marker-color": "#ffb90f",
                        "marker-size": "small",
                        "marker-symbol": "star"
                    }
                });
            }); // end of 'forEach'
        } // end of 'for in'

        // add the marker layer
        capitalLayer = L.mapbox.featureLayer(capitalGeoJson).addTo(map);
        // open the popup on hover

        capitalLayer.on('mouseover', function(e) {

            e.layer.openPopup();
            // update the graph if census details is present
            if (e.layer.feature.properties.data.sexratio) {

                // updateGraph( e.layer.feature.properties.data );
            }
        });

        capitalLayer.on('mouseout', function(e) {
            e.layer.closePopup();
        });
    }

    function setCapitalFilterPosition() {
        var gistWidth = 960,
            gistHeight = 707;
        capitalFilterDiv.style.top = 0.5 * gistHeight + "px";
        capitalFilterDiv.style.left = 0.78 * gistWidth + "px";
        // adjust the defalut gist preview height
        d3.select(self.frameElement).style("height", gistHeight + "px");
    }

});