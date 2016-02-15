var variables = [
    'Acute Diarrhoea',
    'Malaria',
    'Acute Respiratory Infection',
    'Japanese Encephalitis',
    'Viral Hepatitis'];

var selectedVariable;
var selectedYear="2011";
var selectedCriteria="Total Cases";
var jsonarr;

$(document).ready(function() {
    var $radiobtn = $('<input type="radio" class = "menu-ui" name="year" id="yr1" checked=true value="2011">2011</input><input type="radio" id="yr2" class = "menu-ui" name="year" value="2010">2010</input>')
        .appendTo($('#radiobtn'));
    $("input[name='year']").change(function(){
        selectedYear = $("input[name='year']:checked").val();
        updatePlot();
    });

    var $select = $('<select></select>')
        .appendTo($('#variables'))
        .on('change', function() {
        selectedVariable = $(this).val();
        updatePlot();
    });

    $('<option></option>')
        .text("Select Disease")
        .attr('value', "Select")
        .appendTo($select);

    for(var i = 0; i < variables.length; i++) {
        $('<option></option>')
            .text(variables[i])
            .attr('value', variables[i])
            .appendTo($select);
    }

    var $selectCri = $('<select></select>')
        .appendTo($('#criteria'))
        .on('change', function() {
        selectedCriteria = $(this).val();
        updatePlot();
    });

    $('<option></option>')
        .text("Total Diseases Cases")
        .attr('value', "Total Cases")
        .appendTo($selectCri);
    $('<option></option>')
        .text("Cured Diseases Cases")
        .attr('value', "Cured Cases")
        .appendTo($selectCri);
    $('<option></option>')
        .text("Death Cases")
        .attr('value', "Deaths")
        .appendTo($selectCri);


    function updatePlot(){

        if(selectedVariable == null){
            alert("Please select a disease..");
            return;
        }

        jsonarr="";
        var request = new XMLHttpRequest();
        request.open("GET", "q3second.json", false);
        request.send(null);
        var my_JSON_object = JSON.parse(request.responseText);
        for(var obj in my_JSON_object){
           var jsonYear = my_JSON_object[obj];
            if(jsonYear.year == selectedYear){
                var dataArr = jsonYear.data;
                for(var cri in dataArr){
                    if(dataArr[cri].criteria == selectedCriteria){
                        var statsArr = dataArr[cri].stats; 
                        for(var stats in statsArr){
                            if(statsArr[stats].disease == selectedVariable){
                                jsonarr = statsArr[stats].values;
                            }
                        }  
                    }
                }

            }
        }
        if(jsonarr != ""){
            jsonarr = JSON.parse(JSON.stringify(jsonarr));
            $("#plot").empty();
            var filter = selectedCriteria + " Count";
            barPlot(jsonarr, filter);
        }
        else{
            alert("Error");
        }
        
        
    }
});




