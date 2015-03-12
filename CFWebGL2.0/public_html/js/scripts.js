/*
  =Global variables
*/
var windowWidth=$(window).width();
var windowHeight=$(window).height();

var pointUrl = "data/transformed_points.txt";

$(function() {
    
  /*
    =data
  */

    /*
      data points variables
    */
   
    var points;
    var distances;
    var maxDeviation;
    var minDeviation;
    var maxDev;
    var minDev;
    var numberOfPoints;
    
    
    var consoleNumberOfPoints = $("#consolePoints");
    var consoleMaxDeviation = $("#consoleDeviation");
    var consoleLOneNorm = $("#LOneNorm");
    var consoleLTwoNorm = $("#LTwoNorm");
    
    //list of points pulled out of the txt into array

    function downloadPoints(){
        $.ajax({
           url: "data/autoAlign.txt", // path to file
           type: "GET",
           dataType: 'text', // type of file (text, json, xml, etc)
           success: function(d) { // callback for successful completion
               distances = d;
               setDistanceData();
               
           }
         });
         
         $.ajax({
           url: "data/transformed_points.txt", // path to file
           type: "GET",
           dataType: 'text', // type of file (text, json, xml, etc)
           success: function(p) { // callback for successful completion
               points = p;
               setPointData();
               setHistogramData();
               
           }
         });
    }

    downloadPoints();
    
    function setPointData() {
        
        points = points.trim();
        points = points.split(/\s+/g);
        
    }
    
    function setDistanceData() {
        distances = distances.trim();
        distances = distances.split(/\s+/g);
        
        for(var i = 0; i < 13; i++) {
            distances.shift();
        }
    
        numberOfPoints = distances.length;
        
        //calculating the minimum and maximum distances
        minDev = distances[0];
        maxDev = distances[0];
        for (var i = 0; i < distances.length; i++) {
            distances[i] = distances[i] - 0.0;
            if( distances[i] < minDev)
               minDev = distances[i];
            
            if(distances[i] > maxDev)
               maxDev = distances[i];
        }
                
        //set number of points console text
        consoleNumberOfPoints.text(""+ numberOfPoints);
        //set maximum deviation console text
        consoleMaxDeviation.text(""+maxDev);
        //set the l1 norm console text
        consoleLOneNorm.text(""+ computeL1Norm());
        //set the l2 norm console text
        consoleLTwoNorm.text(""+ computeL2Norm());
        
    }
    
    
    //calculating the l2 norm
    function computeL2Norm() {
        var l2 = 0;
        for(var i = 0; i < distances.length; i++){
            var v = distances[i];
            l2 = l2 + v*v;
        }
        var res = Math.sqrt(l2)/distances.length;
        return res;
    }
    //calculating the l1 norm
    function computeL1Norm() {
        var m = 0;
        for(var i = 0; i < distances.length; i++){
            var v = distances[i];
            m = m + Math.abs(v);
        }
        var res = m/distances.length;
        return res;
    }
    
    function doneLoading(){
        $("#loadingOverlay").hide();
        console.log("hide overlay");
    }
    
    function setHistogramData() {
        
    /*
      =histogram
    */
   
        /*
            histogram info
        */
       
        
        minDeviation = Math.ceil(minDev);
        maxDeviation = Math.ceil(maxDev);
        
        

        
    
    
        console.log(maxDev);
        console.log(minDev);

        var histoDict = [];

        for ( var i = 0; i < 41; i++) {    
            histoDict[i] = 0; 
        }

        for (var i = 0; i < distances.length; i++) {

            var rounded = Math.floor(distances[i]);

            if(rounded < -20)
                rounded= -20;

            if(rounded > 20)
                rounded = 20;

            histoDict[rounded + 20]++;
        }    
        
        var tickInterval = Math.round((maxDeviation - minDeviation)/histoDict.length);
    
        var histogramDiv = $("#histogram");
        var histogramHeight = windowHeight/2.5;
        var histogram;

        //filling the histogram with the sorted data
        var histogramAray = [
            [[histoDict[0], -20.5], [histoDict[1], -19.5], [histoDict[2], -18.5], 
             [histoDict[3], -17.5], [histoDict[4], -16.5], [histoDict[5], -15.5],
             [histoDict[6], -14.5], [histoDict[7], -13.5], [histoDict[8], -12.5],
             [histoDict[9], -11.5], [histoDict[10], -10.5], [histoDict[11], -9.5],
             [histoDict[12], -8.5], [histoDict[13], -7.5], [histoDict[14], -6.5],
             [histoDict[15], -5.5], [histoDict[16], -4.5], [histoDict[17], -3.5],
             [histoDict[18], -2.5], [histoDict[19], -1.5], [histoDict[20], -0.5],
             [histoDict[21], 0.5], [histoDict[22], 1.5], [histoDict[23], 2.5],
             [histoDict[24], 3.5], [histoDict[25], 4.5], [histoDict[26], 5.5],
             [histoDict[27], 6.5], [histoDict[28], 7.5], [histoDict[29], 8.5],
             [histoDict[30], 9.5], [histoDict[31], 10.5], [histoDict[32], 11.5],
             [histoDict[33], 12.5], [histoDict[34], 13.5], [histoDict[35], 14.5],
             [histoDict[36], 15.5], [histoDict[37], 16.5], [histoDict[38], 17.5], 
             [histoDict[39], 18.5], [histoDict[40], 19.5], [histoDict[41],20.5]]];

        var histogramOptions = {
          seriesDefaults: {
            //making it a bargraph
            renderer:$.jqplot.BarRenderer,


            //renderingoptions for the bars
            rendererOptions: {
              barDirection: "horizontal",
              barWidth: 3,
              shadow: false,
              //color: "#00ADEF"
              color: "#5184c4"
            }
          },

          grid:{
            renderer:$.jqplot.CanvasGridRenderer,

            rendererOptions: {
                  gridLineColor: "#9E9E9E",
                  drawBorder: false,
                  background: "white"
                }
          },

          axes:{
            yaxis:{tickInterval: tickInterval, min: minDeviation, max: maxDeviation},
            xaxis:{tickInterval: "1000", max: 200000},


            renderer:$.jqplot.AxisTickRenderer,
            rendererOptions: {

            }
          }
        };

        /*
          histogram style attributes
        */  
        histogramDiv.css('height', histogramHeight + 30);


        //Filling the histogram with the data set above (location, data, visualisationOptions);
        histogram = $.jqplot('histogram', histogramAray, histogramOptions);

        console.log("done");

    /*        
    =slider
    */

        /*
          slider variables
        */
        var sliderHeight=windowHeight/2.5;
        var slider = $("#slider");
        var sliderAverageValue = (maxDeviation + minDeviation) / 2;

        Math.ceil(sliderAverageValue);

        /*
          slider style attributes
        */  
        slider.css('height', sliderHeight);


        slider.removeClass('ui-widget').slider({
            orientation: "vertical",
            range: true,
            values: [ minDeviation, maxDeviation ],
            min: minDeviation, 
            max: maxDeviation,

            slide: function( event, ui) {
                $( ".colorBarInfoMin" ).val( ui.values[ 0 ]);
                $( ".colorBarInfoMax" ).val( ui.values[ 1 ]);
                $( ".colorBarInfoMid" ).val( (ui.values[ 0 ] + ui.values[ 1 ])/2);
            }
        }); 

        $( ".colorBarInfoMin" ).val( minDeviation);
        $( ".colorBarInfoMax" ).val( maxDeviation);
        $( ".colorBarInfoMid" ).val( sliderAverageValue);

        doneLoading();
        } 

        $(".dropdown dt a").click(function(e) {
            e.preventDefault();
            $(".dropdown dd ul").toggle();
        });

        $(".dropdown dd ul li a").click(function(e) {
            e.preventDefault();
            var text = $(this).html();
            $(".dropdown dt a span").html(text);
            $(".dropdown dd ul").hide();
            
            if($(this).text === "allPoints")
                console.log("hoihoi");
            
        }); 

        $(document).bind('click', function(e) {
            var $clicked = $(e.target);
            if (!$clicked.parents().hasClass("dropdown"))
                $(".dropdown dd ul").hide();
        });
        
        
        
        $("#fullscreenButton").click(function(){
           console.log("make fullscreen");
           $('#canvasWrap').requestFullscreen();
           $('#canvasWrap').msRequestFullscreen();
           
        });
        
        
        var elem = document.getElementById("#canvasWrap");
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            }
            
  /*
    =canvas
  */

    /*
      glcanvas variables
    */
    var canvasHeight=windowHeight/1.5;
    var canvas = $("#renderingCanvas");

    
    /*
      glcanvas webgl
    */


    /*
      glcanvas style attributes
    */
    canvas.css('height', canvasHeight);

  /*
  =dropdown
  */

    /*
      dropdown variables
    */
    
    

    
}); //end bracket