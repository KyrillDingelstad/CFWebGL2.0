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
    var distancesDownloaded = false;
    var pointsDownloaded = false;
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
               distancesDownloaded = true;
               
           }
         });
         
         $.ajax({
           url: "data/transformed_points.txt", // path to file
           type: "GET",
           dataType: 'text', // type of file (text, json, xml, etc)
           success: function(p) { // callback for successful completion
               points = p;
               setPointData();
               pointsDownloaded = true;
               
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
        numberOfPoints = distances.length;
        
        minDev = distances[0];
        maxDev = distances[0];
        for (var i = 0; i < distances.length; i++) {
            if( distances[i] < minDev)
                minDev = distances[i];
            
            if(distances[i] > maxDev)
               maxDev = distances[i];
        }
                    
        minDeviation = minDev;
        maxDeviation = maxDev;
        
        
        console.log(minDev);
        console.log(maxDev);
        //set number of points console text
        consoleNumberOfPoints.text(""+ numberOfPoints);
        
        //set maximum deviation console text
        consoleMaxDeviation.text(""+maxDev);
        //set the l1 norm console text
        consoleLOneNorm.text(""+ computeL1Norm());
        
        //set the l2 norm console text
        consoleLTwoNorm.text(""+ computeL2Norm());
        
    }
    
    
    
    function computeL2Norm() {
        var l2 = 0;
        for(var i = 0; i < distances.length; i++){
            var v = distances[i];
            l2 = l2 + v*v;
        }
        var res = Math.sqrt(l2)/distances.length;
        return res;
    }
    
    function computeL1Norm() {
        var m = 0;
        for(var i = 0; i < distances.length; i++){
            var v = distances[i];
            m = m + Math.abs(v);
        }
        var res = m/distances.length;
        return res;
    }
    

  /*        
    =slider
  */

    /*
      slider variables
    */
    var sliderHeight=windowHeight/2.5;
    var slider = $("#slider");

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
  =histogram
  */

    /*
      histogram variables
    */

    var histogramDiv = $("#histogram");
    var histogramHeight = sliderHeight;
    var histogram;
    var histogramAray = [
        [[10000,10], [400000, 50], [6,3], [3,4]], 
        [[5,1], [30,2], [50,50], [4,4]], 
        [[4,1], [7,2], [1,3], [2,30]]];

    var histogramOptions = {
      seriesDefaults: {
        //making it a bargraph
        renderer:$.jqplot.BarRenderer,

          
        //renderingoptions for the bars
        rendererOptions: {
          barDirection: "horizontal",
          barWidth: 2,
          color: "#00ADEF"

        }
      },

      grid:{
        renderer:$.jqplot.CanvasGridRenderer,

        rendererOptions: {
              gridLineColor: "#9E9E9E",
              drawBorder: false,
              background: "white"
            },
      },

      axes:{
        yaxis:{tickInterval: "1", min: minDeviation, max: maxDeviation},
        xaxis:{tickInterval: "100000", max: numberOfPoints},

        renderer:$.jqplot.AxisTickRenderer,
        rendererOptions: {

        },
      }
    };

    /*
      histogram style attributes
    */  
      histogramDiv.css('height', histogramHeight + 30);


    //Filling the histogram with the data set above (location, data, visualisationOptions);
    histogram = $.jqplot('histogram', histogramAray, histogramOptions);

    
}); //end bracket