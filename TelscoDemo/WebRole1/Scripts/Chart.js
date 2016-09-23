﻿/// <reference path="_references.js" />

var globalTimestamp = 0;
var oldTelemetryValue = 0;
var oldLatencyValue = 0;

function chart_seriesHover(e) {
    
    $("activeincidentsovertimelabel").text(e.value);
}

function formatLongNumber(value) {
   
    if (value == 0) {
        return 0;
    }
    else {

        if (value <= 999) {
            return value;
        }
            // thousands
        else if (value >= 1000 && value <= 999999) {
            return (value / 1000).toFixed(1) + 'K';
        }
            // millions
        else if (value >= 1000000 && value <= 999999999) {
            return (value / 1000000).toFixed(1) + 'M';
        }
            // billions
        else if (value >= 1000000000 && value <= 999999999999) {
            return (value / 1000000000).toFixed(1) + 'B';
        }
        else {
            return (value / 1000000000000).toFixed(1) + 'T';
        }
    }
}
$(document).ready(createChart);
$(document).bind("kendo:skinChange", createChart);

var createChart = function (options) {

    $(options.id).kendoChart({
        transitions: false,
        chartArea: {
            background: "#e6e6e6"
        },
        legend: {
            position: "bottom",
            labels: {
                color: "whitesmoke",
                font: "bold italic 12px Arial,Helvetica,sans-serif"
            }
        },
        seriesDefaults: {
            type: options.type,
            area: {
                line: {
                    style: "smooth"
                }
            }
        },
        tooltip: {
            //visible: true,
            //template: "#console.log(data)#",
        },
        dataSource: {
            data: options.data
        },
        series: options.series,
        seriesHover: options.seriesHover,
        //seriesColors: ["#00abec", "#7fba00", "#5607c9"],        
        valueAxis: {
            labels: {
                template: "#= formatLongNumber(value) #",
                //format: (options.valueAxisFormat || "{0:n} ") + (options.valueAxisUnits || ""),
                rotation: "auto",
                color: "#A9A9A9",
                font: "12px \"Segoe UI\",\"Segoe WP\",Tahoma, Lora,\"Helvetica Neue\",Helvetica,Arial,sans-serif"
            },
            line: {
                visible: false
            },
            majorGridLines: {
                visible: true,
                color: "#bbbbbf"
            },
            minorGridLines: {
                visible: false
            },
            step: options.valueAxisStep,
            axisCrossingValue: -10,
            min: options.maxValueAxis,
            max: options.maxValueAxis,
            majorUnit: options.majorUnit
        },
        categoryAxis: {
            //categories: options.categoryaxisdata,
            //labels: {
            //    step: 5
            //},
            visible: options.categoryAxisVisible,
            minorGridLines: {
                visible: false
            },
            majorGridLines: {
                visible: false
            },
            minorTicks: {
                visible: false
            },
            majorTicks: {
                visible: false
            }
        }
    });
}
var chartOptions = {
    telemetryvolume: {
        id: "#telemetryvolumegraph",
        title: "Telemetry Volume",
        docdbProperty: "telemetryvolume",
        valueAxisTitleText: "doc",
        valueAxisStep: 100,
        categoryAxisVisible: true,
        type: "line",
        series: [{
            //name: "Telemetry Volume",
            data: [],
            //categoryaxisdata: [],
            color: "#1ebbee"
        }],
        seriesHover: function (e) {
            $("#telemetryvolumelabel").css("cursor", "pointer");
            if (e.value.length > 1)
            {
                $("#telemetryvolumelabel").text(formatLongNumber(e.value[(e.value.length) - 1]));
            }
            else
                {

            $("#telemetryvolumelabel").text(formatLongNumber(e.value));
            }
        }
    },
    latencies: {
        id: "#latenciesgraph", //latenciesgraph
        title: "Data Freshness",
        docdbProperty: "latencies",
        valueAxisTitleText: "doc",
        valueAxisStep: 100,
        categoryAxisVisible: false,
        type: "line",
        series: [{
            //name: "# of incidents",
            data: [],
            color: "#1ebbee"
        }],
        seriesHover: function (e) {
            $("#latencieslabel").css("cursor", "pointer");
            if (e.value.length > 1) {
                $("#latencieslabel").text(e.value[(e.value.length) - 1]);
            }
            else {

                $("#latencieslabel").text(e.value);
            }
            
        }
    },
    activeincidentsovertime: {
        id: "#activeincidentsovertimegraph",
        title: "active incidents overtime",
        docdbProperty: "activeincidentsovertime",
        valueAxisTitleText: "doc",
        valueAxisStep: 100,
        categoryAxisVisible: false,
        type: "line",
        series: [{
            //name: "active incidents overtime",
            data: [],
            color: "#1ebbee"
        }],
        seriesHover: function (e) {
            $("#activeincidentsovertimelabel").css("cursor", "pointer");
            $("#activeincidentsovertimelabel").text(e.value);
        }
    },
    maxtimetomitigateincidents: {
        id: "#maxtimetomitigateincidentsgraph",
        title: "max time to mitigate incidents",
        docdbProperty: "maxtimetomitigateincidents",
        valueAxisTitleText: "doc",
        valueAxisStep: 100,
        categoryAxisVisible: false,
        type: "line",
        series: [{
            //name: "max time to mitigate incidents",
            data: [],
            color: "#1ebbee"
        }],
        seriesHover: function (e) {
            $("#maxtimetomitigateincidentslabel").css("cursor", "pointer");
            $("#maxtimetomitigateincidentslabel").text(e.value);
        }
    },
    percentageoftimethesystemviolated: {
        id: "#percentageoftimethesystemviolatedgraph",
        title: "% of time the system violated",
        docdbProperty: "percentageoftimethesystemviolated",
        valueAxisTitleText: "doc",
        valueAxisStep: 100,
        categoryAxisVisible: false,
        type: "pie",
        series: [{
            //name: "% of time the system violated",  
            type: "pie",
            startAngle: 270,
            data: [{
                value: 5,
                color: "#1ebbee"
            },
            {
                value: 95,
                color: "#bbbbbb"
            }]
        }],
        seriesHover: function (e) {
            if (e.value == 5) {
                $("#percentageoftimethesystemviolatedlabel").css("cursor", "pointer");
                $("#percentageoftimethesystemviolatedlabelheading").text("System Violation");
                $("#percentageoftimethesystemviolatedlabel").text(e.value);
            }
            else {
                $("#percentageoftimethesystemviolatedlabel").css("cursor", "pointer");
                $("#percentageoftimethesystemviolatedlabelheading").text("System Availability");
                $("#percentageoftimethesystemviolatedlabel").text(e.value);
            }
        }
    }
};

$(document).ready(function () {
    StartGraphProcess();
});

var chartTitles = ["telemetryvolume", "latencies", "activeincidentsovertime", "maxtimetomitigateincidents", "percentageoftimethesystemviolated"]
var totalStats = { telemetryvolume: 1, latencies: 1, activeincidentsovertime: 1, maxtimetomitigateincidents: 1, percentageoftimethesystemviolated: 1 }
var docdbProperties = ["telemetryvolume", "latencies", "activeincidentsovertime", "maxtimetomitigateincidents", "percentageoftimethesystemviolated"]

function StartGraphProcess() {
    chartTitles.forEach(function (element) {
        createChart(chartOptions[element]);
    });
    $("#spanactiveincidents").text(0);
    $("#spanactiveusers").text(0);
    $("#spantraficrequest").text(0);
    var interval = setInterval(ShowMetrixGraph, 5000);
    //ShowMetrixGraph();
}

function ShowMetrixGraph() {
    var tempDoc;
    $.ajax({
        url: "/Home/GetGraphData",
        type: "POST",
        traditional: true,
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            //alert(data.success);

            //var date = new Date();
            //var hour = date.getHours() - (date.getHours() >= 12 ? 12 : 0);
            //var period = date.getHours() >= 12 ? 'PM' : 'AM';
            //var starttime = hour - 1 + ':' + date.getMinutes() + ' ' + period;
            //var endtime = hour + ':' + date.getMinutes() + ' ' + period;
            //alert(hour - 1 + ':' + date.getMinutes() + ' ' + period);

            //Start - Set graph legned values to null for every 5 seconds
            var volumeLabel = data.items[0].telemetryvolume;
            var latencies = data.items[0].latencies;
            if (volumeLabel.length > 1) {
                $("#telemetryvolumelabel").text(formatLongNumber(volumeLabel[(volumeLabel.length) - 1]));
            }

            else {

                $("#telemetryvolumelabel").text(formatLongNumber(data.items[0].telemetryvolume));
            }
            if (latencies.length > 1) {
                $("#latencieslabel").text(latencies[(latencies.length) - 1]);
            }
            else {

                $("#latencieslabel").text(data.items[0].latencies);
            }
            
            $("#activeincidentsovertimelabel").text(data.items[0].activeincidentsovertime);
            $("#maxtimetomitigateincidentslabel").text(data.items[0].maxtimetomitigateincidents);
            $("#percentageoftimethesystemviolatedlabel").text(data.items[0].percentageoftimethesystemviolated);
            //End

            var spanactiveincidents = (data.items[0].activeincidentsovertime == "" ? 0 : data.items[0].activeincidentsovertime);
            $("#spanactiveincidents").text(spanactiveincidents);
            var spanactiveusers = (data.items[0].activeusers == "" ? 0 : data.items[0].activeusers);
            $("#spanactiveusers").text(spanactiveusers + ' M');
            var spantraficrequest = (data.items[0].traficrequest == "" ? 0 : data.items[0].traficrequest);
            $("#spantraficrequest").text(formatLongNumber(spantraficrequest));

            //var latencies = (data.items[0].latencies == "" ? 0 : data.items[0].latencies);
            //var maxtimetomitigateincidents = (data.items[0].maxtimetomitigateincidents == "" ? 0 : data.items[0].maxtimetomitigateincidents);

            totalStats["telemetryvolume"] = data.items[0].telemetryvolume;
            totalStats["latencies"] = data.items[0].latencies;
            totalStats["activeincidentsovertime"] = data.items[0].activeincidentsovertime;
            totalStats["maxtimetomitigateincidents"] = data.items[0].maxtimetomitigateincidents;
            totalStats["percentageoftimethesystemviolated"] = data.items[0].percentageoftimethesystemviolated;
            //alert(totalStats["percentageoftimethesystemviolated"]);

            //alert(data.items[0].telemetryvolume);//21,34,4,4


            chartTitles.forEach(function (element) {
                if (element != "percentageoftimethesystemviolated") {
                    if (chartOptions[element].series[0].data.length > 15) {
                        var shifted = chartOptions[element].series[0].data.shift();
                    }

                    //start - step for multiple values
                    if (element == "telemetryvolume") {
                        var value = totalStats[chartOptions[element].docdbProperty];

                        var valueStringCount = value.length;
                        var valueString = "";  //4 4 21 15

                        for (var i = 0; i < valueStringCount; i++)
                        {
                            valueString = valueString + value[i].toString();
                        }


                        if (oldTelemetryValue == 0) {
                            for (var k = 0; k < value.length; k++) {
                                chartOptions[element].series[0].data.push(value[k]);
                            }
                            oldTelemetryValue = valueString;
                        }
                        else if(oldTelemetryValue != valueString)
                        {
                            chartOptions[element].series[0].data.push(value[(value.length) - 1]);
                            oldTelemetryValue = valueString;
                        }
                    }
                    else if ((element == "latencies") && (latencies.length > 1) ) {
                        var value = totalStats[chartOptions[element].docdbProperty];

                        var valueStringCount = value.length;
                        var valueString = "";  //4 4 21 15

                        for (var i = 0; i < valueStringCount; i++)
                        {
                            valueString = valueString + value[i].toString();
                        }


                        console.log(valueString);

                        console.log("old - "+oldLatencyValue);


                        if (oldLatencyValue == 0) {
                            for (var k = 0; k < value.length; k++) {
                                chartOptions[element].series[0].data.push(value[k]);
                            }
                            oldLatencyValue = valueString;
                        }
                        else if(oldTelemetryValue != valueString)
                        {
                            chartOptions[element].series[0].data.push(value[(value.length) - 1]);
                            oldTelemetryValue = valueString;
                        }
                    }
                    else 
                        chartOptions[element].series[0].data.push(totalStats[chartOptions[element].docdbProperty]);
                    //end


                    //var value = totalStats[chartOptions[element].docdbProperty];

                    //if (element == "telemetryvolume") {                       
                    //    console.log("value - " + totalStats[chartOptions[element].docdbProperty]);
                    //    console.log("oldvalue - " + oldTelemetryValue);
                    //    if (value == oldTelemetryValue) {                            
                    //        console.log("old value");
                    //    }
                    //    else {
                    //        oldTelemetryValue = value;
                    //        chartOptions[element].series[0].data.push(totalStats[chartOptions[element].docdbProperty]);
                    //    }

                    //}
                    //else {
                    //    chartOptions[element].series[0].data.push(totalStats[chartOptions[element].docdbProperty]);
                    //}


                }
            });


            chartTitles.forEach(function (element) {
                createChart(chartOptions[element]);
            });

        },
        error: function (xhr, status, error) {
            var responseTitle = $(xhr.responseText).filter('title').get(0);

        }
    });
}
$(function () {
    function fadingScroller($el) {
        $el.animate({ 'opacity': 0 }, 1000);
        $el.hide('slow', function () {
            $el.parent().append($el);
            $el.show();
            $el.animate({ 'opacity': 1 }, 1000);
            setTimeout(function ($el) {
                return function () {
                    fadingScroller($($el.selector));
                };
            }($el), 2000);
        });
    }
    fadingScroller($('#container div:first'));
});


