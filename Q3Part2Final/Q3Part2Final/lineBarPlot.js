var w = 1000,
    h = 500,
    margin = 150;

// SENSIBLE DATA, IMAGINE THAT...


// CREATE A DATE RANGE TO USE ON THE X-AXIS
//var dateFormat = d3.time.format('%Y-%b'),
 //   dateRange = d3.time.months(dateFormat.parse('2014-Jan'),dateFormat.parse('2014-Jul'));
//var dateRange = ["A","B","C","D","E"];

var stateCode=["IN", "AP", "AN", "AS", "BH", "CT", "DL", "GA", "GJ", "HR", 
"HP", "JK", "JH", "KA", "KL", "MP", "MH", "MN", "ML", "MZ",
"NL", "OR", "PB", "RJ", "SK", "TN", "TR", "UP", "UT", "WB", "AN", 
"CH", "DN", "DD", "LD", "PD"];

var dateRange=["India", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana", 
"Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
"Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", 
"Chandigarh", "D & N Haveli", "Daman & Diu", "Lakshadweep", "Puducherry"];

/*Expenditure data*/
var lineData = [{"state":0,"count":244460292},
{"state":1,"count":17633696},
{"state":2,"count":1279360},
{"state":3,"count":4820789},
{"state":4,"count":6671200},
{"state":5,"count":6129707},
{"state":6,"count":24947137},
{"state":7,"count":1668088},
{"state":8,"count":15144645},
{"state":9,"count":3528499},
{"state":10,"count":9028397},
{"state":11,"count":8818101},
{"state":12,"count":5645464},
{"state":13,"count":12739080},
{"state":14,"count":3974745},
{"state":15,"count":9167075},
{"state":16,"count":20943702},
{"state":17,"count":580791},
{"state":18,"count":2049050},
{"state":19,"count":1734192},
{"state":20,"count":1076094},
{"state":21,"count":3748208},
{"state":22,"count":2085503},
{"state":23,"count":5641249},
{"state":24,"count":883834},
{"state":25,"count":12547081},
{"state":26,"count":1989988},
{"state":27,"count":36514538},
{"state":28,"count":5836000},
{"state":29,"count":11204318},
{"state":30,"count":1330408},
{"state":31,"count":1741728},
{"state":32,"count":200571},
{"state":33,"count":168890},
{"state":34,"count":107866},
{"state":35,"count":2880298}];

var newStCodes=[];

function removeVal(name, value, lData){
  var newarr=[];
  
  for(ld in lData){
    console.log(lData[ld].state);
    if(value.indexOf(lData[ld].state) == -1){
      console.log(lData[ld]);
      newarr.push(lData[ld]);
      newStCodes.push(stateCode[lData[ld].state]);
    }
  }

 // console.log(newarr);
  return newarr;
}

function barPlot(data, caseType){
  var barData = data;

  var stateXPosMap = {};

  var missingStateBarData = [];
  for( i in barData){
    stateXPosMap[barData[i].state] = i;
  }

  for(var j=35; j>=0; j--){
    if(!(j in stateXPosMap)){
      missingStateBarData.push(j);
    }
  }

//console.log(missingStateBarData);

  lineData = removeVal('state', missingStateBarData, lineData);

  stateCode = newStCodes;

  //console.log(missingStateBarData);
  console.log("linedata");
  console.log(lineData);

  console.log("barData");
  console.log(barData);
  var svg = d3.select('#plot')
    .attr('width', w + (margin * 2))
    .attr('height', h + (margin * 2))
    .append('g')
      .attr('transform', 'translate(' + margin + ',' + margin + ')');


  // SET UP SCALES FOR BARS
  var xScaleBars = d3.scale.ordinal()
    .domain(d3.range(barData.length))
    .rangeRoundBands([0, w], 0.1);
  var yScaleBars = d3.scale.linear()
    .domain([0, d3.max(barData, function(d) {return d.count;})])
    .range([h, 0])
    .nice(10);


  // X SCALE FOR LINE IS BASED ON X SCALE FOR BARS
  //  adjusting to put points in the center of the bars
  var xScaleLine = function(d) {
    var offset = xScaleBars.rangeBand() / 2;
    return xScaleBars(d) + offset;  
  };
  var yScaleLine = d3.scale.linear()
    .domain([0, d3.max(lineData, function(d) {return d.count;}) + 1])
    .range([h, 0]);

  var maxbarYVal = d3.max(barData, function(d) {return d.count;});
  var minbarYVal = d3.min(barData, function(d) {return d.count;});
  

  var maxlineYVal = d3.max(lineData, function(d) {return d.count;});

  var minlineYVal = d3.min(lineData, function(d) {return d.count;} );

  // SET UP THE AXES
  var xAxis = d3.svg.axis()
    .scale(xScaleBars)
    .orient('bottom')
    .tickFormat(function(d) {
      console.log("d is");
      console.log(d);
      console.log(stateCode[d]);
  	return stateCode[d];
    //  return dateFormat(dateRange[d]);
    });
  var yAxisBars = d3.svg.axis()
    .scale(yScaleBars)
    .orient('left')
    .tickValues(d3.range(minbarYVal,maxbarYVal+1,(maxbarYVal-minbarYVal+1)/15))
    .outerTickSize(50);

  var yAxisLine = d3.svg.axis()
    .scale(yScaleLine)
    .orient('right')
    .tickValues(d3.range(minlineYVal,maxlineYVal,(maxlineYVal-minlineYVal+1)/15 ))
    .outerTickSize(23);

  // MAKE A LINE GENERATOR FOR THE LINE DATA
  var lineGen = d3.svg.line()
    .x(function(d) {return xScaleLine(stateXPosMap[d.state]);})
    .y(function(d) {return yScaleLine(d.count);})
    .interpolate('monotone');

  var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<center><span style='color:red'>" + dateRange[d.state] + "</span></center></br><strong>Value: "+ d.count +"</strong>";
  });

  svg.call(tip);

  // =======================
  // FINALLY, DRAW THE THING
  // =======================
  var bars = svg.selectAll('.bar')
    .data(barData)
    .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', function(d) {return xScaleBars(stateXPosMap[d.state]);})
      .attr('y', function(d) {return yScaleBars(d.count);})
      .attr('width', function(d) {return xScaleBars.rangeBand();})
      .attr('height', function(d) {return h- yScaleBars(d.count);})
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  var points = svg.selectAll('.point')
    .data(lineData)
    .enter().append('circle')
    .attr('class', 'point')
    .attr('cx', function(d) {console.log(d); return xScaleLine(stateXPosMap[d.state]);})
    .attr('cy', function(d) {return yScaleLine(d.count);})
    .attr('r', 4)
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);




  svg.append('path')
    .datum(lineData)
    .attr('class', 'line')
    .attr('d', lineGen);

  svg.append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + h + ')')
    .call(xAxis);

  svg.append('g')
    .attr('class', 'axis y-axis y-axis-bars')
    .call(yAxisBars)
    .append('text')
      .attr('class', 'axis-label')
      .attr('transform', 'translate(-8,-5)')
      .style('text-anchor', 'end')
      .text(caseType);

  svg.append('g')
    .attr('class', 'axis y-axis y-axis-line')
    .attr('transform', 'translate(' + w + ',0)')
    .call(yAxisLine)
    .append('text')
      .attr('class', 'axis-label')
      .attr('transform', 'translate(-4,-5)')
      .style('text-anchor', 'start')
      .text('Expenditure');
  }