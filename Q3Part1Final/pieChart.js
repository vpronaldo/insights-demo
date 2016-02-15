var expense_tenth = [
      {
        "label": "Vector-borne",
        "value": 1186.11,
        "color": "#f30000"
      },
      {
        "label": "Leprosy",
        "value": 224.54,
        "color": "#00b109"
      },
      {
        "label": "AIDS",
        "value": 2055.55,
        "color": "#0fe7fb"
      },
      {
        "label": "Pulse Polio",
        "value": 3999.56,
        "color": "#67f200"
      },
      {
        "label": "Diseases Surveillance",
        "value": 77.26,
        "color": "#ff7e00"
      },
      {
        "label": "Cancer",
        "value": 252.63,
        "color": "#640000"
      },
      {
        "label": "Blindness",
        "value": 458.15,
        "color": "#d00ed8"
      },
      {
        "label": "Iodine Deficiency",
        "value": 42.71,
        "color": "#01664d"
      },
      {
        "label": "Tuberculosis",
        "value": 756.88,
        "color": "#04231b"
      }
    ];

var expense_ninth = [
      {
        "label": "Vector-borne",
        "value": 1000,
        "color": "#f30000"
      },
      {
        "label": "Leprosy",
        "value": 301,
        "color": "#00b109"
      },
      {
        "label": "AIDS",
        "value": 760,
        "color": "#0fe7fb"
      },
      {
        "label": "De-addiction",
        "value": 20,
        "color": "#67f200"
      },
      {
        "label": "Diseases Surveillance",
        "value": 25,
        "color": "#ff7e00"
      },
      {
        "label": "Cancer",
        "value": 190,
        "color": "#640000"
      },
      {
        "label": "Blindness",
        "value": 448,
        "color": "#d00ed8"
      },
      {
        "label": "Iodine Deficiency",
        "value": 18,
        "color": "#01664d"
      },
      {
        "label": "Tuberculosis",
        "value": 31.5,
        "color": "#04231b"
      },
      {
        "label": "BCG",
        "value": 5,
        "color": "#f2fd00"
      },
      {
        "label": "Mental Health",
        "value": 28,
        "color": "#4c19e5"
      }

    ];

function updatePieChart(plan){
  var data;

   $("#pieChart").empty();

  var subTitle = "Budget allocated to control various diseases-";
  if(plan == "Tenth Plan"){
    data = expense_tenth;
    subTitle+="10th Plan";

  }
  else{
    data = expense_ninth;
    subTitle+="9th Plan";
  }



var pie = new d3pie("pieChart", {
  "header": {
    "title": {
      "text": "Expenditure",
      "color": "#df2020",
      "fontSize": 34,
      "font": "courier"
    },
    "subtitle": {
      "text": subTitle,
      "color": "#221d1d",
      "fontSize": 10,
      "font": "courier"
    },
    "location": "pie-center",
    "titleSubtitlePadding": 13
  },
  "footer": {
    "color": "#999999",
    "fontSize": 10,
    "font": "open sans",
    "location": "bottom-left"
  },
  "size": {
    "canvasWidth": 590,
    "canvasHeight": 570,
    "pieInnerRadius": "81%",
    "pieOuterRadius": "79%"
  },
  "data": {
    "sortOrder": "label-desc",
    "content": data
  },
  "labels": {
    "outer": {
      "format": "label-percentage2",
      "pieDistance": 20
    },
    "inner": {
      "format": "none"
    },
    "mainLabel": {
      "fontSize": 11
    },
    "percentage": {
      "color": "#cc1230",
      "fontSize": 11,
      "decimalPlaces": 0
    },
    "value": {
      "color": "#8214fb",
      "fontSize": 11
    },
    "lines": {
      "enabled": true,
      "color": "#777777"
    },
    "truncation": {
      "enabled": true
    }
  },
  "tooltips": {
    "enabled": true,
    "type": "placeholder",
    "string": "{label}: {value}, {percentage}%"
  },
  "effects": {
    "pullOutSegmentOnClick": {
      "effect": "linear",
      "speed": 400,
      "size": 8
    }
  },
  "misc": {
    "colors": {
      "background": "#ffffff",
      "segmentStroke": "#000000"
    },
    "pieCenterOffset": {
      "x": 25
    }
  }
});
}