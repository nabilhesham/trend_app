// respose vars.
var res1;
var res2;
var res1_filtered;
var res2_filtered;

$(document).ready(function () {
  try {
    // get the search keywords and search type
    trend1 = $("#trend1").text();
    trend2 = $("#trend2").text();
    search_type = $("table").attr("search_type");

    // get the data from api
    get_data(trend1, search_type);
    // parce the respose into localstorage
    res1 = JSON.parse(localStorage.getItem("res1"));
    if (trend2) {
      get_data(trend2, search_type, true);
      res2 = JSON.parse(localStorage.getItem("res2"));
      // filter the data to get req, values for charts
      filter_data(res2, true, false);
      filter_data(res1, true, true);
      // display the search type and keywords
      $(".results_for p").text(`Results for : ${trend1} , ${trend2}`);
      $(".results_for span").text(`Search : ${search_type}`);
    } else {
      filter_data(res1, false, false);
      $(".results_for p").text(`Results for : ${trend1}`);
      $(".results_for span").text(`Search : ${search_type}`);
    }
  } catch {
    console.log("error");
  }
});

// get the data from api
function get_data(trend, search_type, trend2_exist = false) {
  let url = `http://127.0.0.1:8000/trend/api/trends/?name=${trend}&type=${search_type}`;
  fetch(url)
    .then((res) => res.json())
    .then((res) => {
      // console.log(res);
      if (trend2_exist) {
        // console.log(res);
        localStorage.setItem("res2", JSON.stringify(res));
      } else {
        // console.log(res);
        localStorage.setItem("res1", JSON.stringify(res));
      }
    })
    .catch((err) => {
      throw err;
    });
}

// filter the data to get req, values for charts

function filter_data(res, trend2_exist = false, trend1_exist = false) {
  let data1 = [];
  let data2 = [];
  for (i in res) {
    let section = {};

    // change the name of the var. to put in the charts
    if (trend2_exist) {
      country = res[i]["region"];
      section["id"] = country;
    } else {
      date = res[i]["date"];
      section["date"] = date;
    }
    section["value"] = res[i]["interest"];

    if (trend2_exist) {
      if (trend1_exist) {
        data1.push(section);
      } else {
        data2.push(section);
      }
    } else {
      data1.push(section);
    }
  }

  if (trend2_exist) {
    localStorage.setItem("res1_filtered", JSON.stringify(data1));
    localStorage.setItem("res2_filtered", JSON.stringify(data2));
  } else {
    localStorage.setItem("res1_filtered", JSON.stringify(data1));
  }
}

// charts animation and creation
am4core.ready(function () {
  // Themes begin
  am4core.useTheme(am4themes_animated);
  // Themes end

  // bar chart
  var chart_bar = am4core.create("chartdiv_bar", am4charts.XYChart);

  chart_bar.data = JSON.parse(localStorage.getItem("res1_filtered"));

  chart_bar.padding(40, 40, 40, 40);

  var categoryAxis = chart_bar.xAxes.push(new am4charts.CategoryAxis());
  categoryAxis.renderer.grid.template.location = 0;
  categoryAxis.dataFields.category = "date";
  categoryAxis.renderer.minGridDistance = 60;
  categoryAxis.renderer.inversed = true;
  categoryAxis.renderer.grid.template.disabled = true;

  var valueAxis = chart_bar.yAxes.push(new am4charts.ValueAxis());
  valueAxis.min = 0;
  valueAxis.extraMax = 0.1;

  var series = chart_bar.series.push(new am4charts.ColumnSeries());
  series.dataFields.categoryX = "date";
  series.dataFields.valueY = "value";
  series.tooltipText = "{valueY.value}";
  series.columns.template.strokeOpacity = 0;
  series.columns.template.column.cornerRadiusTopRight = 10;
  series.columns.template.column.cornerRadiusTopLeft = 10;
  var labelBullet = series.bullets.push(new am4charts.LabelBullet());
  labelBullet.label.verticalCenter = "bottom";
  labelBullet.label.dy = -10;
  labelBullet.label.text = "{values.valueY.workingValue.formatNumber('#.')}";

  chart_bar.zoomOutButton.disabled = true;

  // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
  series.columns.template.adapter.add("fill", function (fill, target) {
    return chart_bar.colors.getIndex(target.dataItem.index);
  });

  categoryAxis.sortBySeries = series;

  ////////////////////////////////////////////////////////////
  // Create map chart
  var chart_map1 = am4core.create("chartdiv_map1", am4maps.MapChart);

  // Set map definition
  chart_map1.geodata = am4geodata_usaLow;

  // Set projection
  chart_map1.projection = new am4maps.projections.AlbersUsa();

  // Create map polygon series
  var polygonSeries = chart_map1.series.push(new am4maps.MapPolygonSeries());

  //Set min/max fill color for each area
  polygonSeries.heatRules.push({
    property: "fill",
    target: polygonSeries.mapPolygons.template,
    min: chart_map1.colors.getIndex(1).brighten(1),
    max: chart_map1.colors.getIndex(1).brighten(-0.3),
  });

  // Make map load polygon data (state shapes and names) from GeoJSON
  polygonSeries.useGeodata = true;

  // Set heatmap values for each state

  polygonSeries.data = JSON.parse(localStorage.getItem("res1_filtered"));

  // Configure series tooltip
  var polygonTemplate = polygonSeries.mapPolygons.template;
  polygonTemplate.tooltipText = "{id}: {value}";
  polygonSeries.dataFields.category = "id";
  polygonSeries.dataFields.value = "value";
  polygonTemplate.nonScalingStroke = true;
  polygonTemplate.strokeWidth = 0.5;

  // Create hover state and set alternative fill color
  var hs = polygonTemplate.states.create("hover");
  hs.properties.fill = am4core.color("#3c5bdc");

  // OTHER MAP
  // Create map instance
  var chart_map2 = am4core.create("chartdiv_map2", am4maps.MapChart);

  // Set map definition
  chart_map2.geodata = am4geodata_usaLow;

  // Set projection
  chart_map2.projection = new am4maps.projections.AlbersUsa();

  // Create map polygon series
  var polygonSeries1 = chart_map2.series.push(new am4maps.MapPolygonSeries());

  //Set min/max fill color for each area
  polygonSeries1.heatRules.push({
    property: "fill",
    target: polygonSeries1.mapPolygons.template,
    min: chart_map2.colors.getIndex(10).brighten(1),
    max: chart_map2.colors.getIndex(10).brighten(-0.3),
  });

  // Make map load polygon data (state shapes and names) from GeoJSON
  polygonSeries1.useGeodata = true;

  // Set heatmap values for each state

  polygonSeries1.data = JSON.parse(localStorage.getItem("res2_filtered"));

  // Set up heat legend
  // let heatLegend = chart_map2.createChild(am4maps.HeatLegend);
  // heatLegend.series = polygonSeries;
  // heatLegend.align = "right";
  // heatLegend.valign = "bottom";
  // heatLegend.width = am4core.percent(20);
  // heatLegend.marginRight = am4core.percent(4);
  // heatLegend.minValue = 0;
  // heatLegend.maxValue = 40000000;

  // Set up custom heat map legend labels using axis ranges
  // var minRange = heatLegend.valueAxis.axisRanges.create();
  // minRange.value = heatLegend.minValue;
  // minRange.label.text = "Little";
  // var maxRange = heatLegend.valueAxis.axisRanges.create();
  // maxRange.value = heatLegend.maxValue;
  // maxRange.label.text = "A lot!";

  // Blank out internal heat legend value axis labels
  // heatLegend.valueAxis.renderer.labels.template.adapter.add("text", function (
  //   labelText
  // ) {
  //   return "";
  // });

  // Configure series tooltip
  var polygonTemplate = polygonSeries1.mapPolygons.template;
  // polygonTemplate.fill = am4core.color("#000");
  polygonTemplate.tooltipText = "{name}: {value}";
  polygonTemplate.nonScalingStroke = true;
  polygonTemplate.strokeWidth = 0.5;

  // worldPolygon.fill = am4core.color("#eee");
  // worldPolygon.propertyFields.fill = "color";

  // Create hover state and set alternative fill color
  var hs = polygonTemplate.states.create("hover");
  hs.properties.fill = am4core.color("#3c5bdc");
}); // end am4core.ready()
