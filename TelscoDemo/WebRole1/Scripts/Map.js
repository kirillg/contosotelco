$(document).ready(createMap);

function createMap() {
    var template = kendo.template($("#info-template").html());
    var emptyTemplate = kendo.template($("#empty-info-template").html());
    var activeShape;

    var mapdata = [
  {
      "City": "Xiamen",
      "Country": "China",
      "Country_ISO3": "CHN",
      "Pop1950": 210,
      "Pop1955": 240,
      "Pop1960": 280,
      "Pop1965": 320,
      "Pop1970": 360,
      "Pop1975": 420,
      "Pop1980": 480,
      "Pop1985": 560,
      "Pop1990": 640,
      "Pop1995": 1120,
      "Pop2000": 1980,
      "Pop2005": 2370,
      "Pop2010": 2520,
      "Pop2015": 2740,
      "Pop2020": 3060,
      "Pop2025": 3330,
      "Pop2050": 3545,
      "Location": [
        24.46,
        118.07
      ]
  },
  {
      "City": "Xi'an, Shaanxi",
      "Country": "China",
      "Country_ISO3": "CHN",
      "Pop1950": 710,
      "Pop1955": 840,
      "Pop1960": 1010,
      "Pop1965": 1200,
      "Pop1970": 1440,
      "Pop1975": 1720,
      "Pop1980": 2050,
      "Pop1985": 2430,
      "Pop1990": 2870,
      "Pop1995": 3270,
      "Pop2000": 3720,
      "Pop2005": 3930,
      "Pop2010": 4010,
      "Pop2015": 4180,
      "Pop2020": 4560,
      "Pop2025": 4930,
      "Pop2050": 5233,
      "Location": [
        34.26,
        108.9
      ]
  }
    ]

    $("#map").kendoMap({
        center: [45, 45],
        minZoom: 3,
        zoom: 4,
        wraparound: false,       
        layers: [{
            type: "tile",
            urlTemplate: "http://#= subdomain #.tile.openstreetmap.org/#= zoom #/#= x #/#= y #.png",
            subdomains: ["a", "b", "c"],
            attribution: "&copy; <a href='http://osm.org/copyright'>OpenStreetMap contributors</a>"
        }, {
            type: "bubble",
            attribution: "Population data from Nordpil and UN Population Division.",
            style: {
                fill: {
                    color: "#00f",
                    opacity: 0.4
                },
                stroke: {
                    width: 0
                }
            },
            dataSource: {
                transport: {
                    read: {
                        url: "../content/dataviz/map/urban-areas.json",
                        dataType: "json"
                    }
                }
            },
            locationField: "Location",
            valueField: "Pop2010"
        }],
        shapeMouseEnter: onShapeMouseEnter,
        reset: onReset
    });

    function onShapeMouseEnter(e) {
        if (activeShape) {
            activeShape.options.set("stroke", null);
        }

        activeShape = e.shape;
        activeShape.options.set("stroke", { width: 1.5, color: "#00f" });

        $("#info").html(template(e.shape.dataItem));
    }

    function onReset() {
        $("#info").html(emptyTemplate({}));
        activeShape = null;
    }

    $("#select-symbol").kendoMobileButtonGroup({
        select: function (e) {
            var layer = $("#map").data("kendoMap").layers[1];
            layer.options.symbol = e.index === 0 ? "circle" : "square";
            layer.reset();
        },
        index: 0
    });
}