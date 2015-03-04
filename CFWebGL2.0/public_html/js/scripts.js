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
        console.log(distances);
        distances = distances.trim();
        distances = distances.split(/\s+/g);
        numberOfPoints = distances.length;
        
        //calculating the minimum and maximum distances
        minDev = distances[0];
        maxDev = distances[0];
        for (var i = 0; i < distances.length; i++) {
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
   
    minDeviation = Math.floor(minDev);
    maxDeviation = Math.floor(maxDev);
    
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
        
        histoDict[rounded +20]++;
    }
       
    var histogramDiv = $("#histogram");
    var histogramHeight = windowHeight/2.5;
    var histogram;
    
    //filling the histogram with the sorted data
    var histogramAray = [
        [[histoDict[0], -19.5], [histoDict[1], -18.5], [histoDict[2], -17.5], 
         [histoDict[3], -17], [histoDict[4], -16], [histoDict[5], -14.5],
         [histoDict[6], -14], [histoDict[7], -13], [histoDict[8], -11.5],
         [histoDict[9], -11], [histoDict[10], -10], [histoDict[11], -8.5],
         [histoDict[12], -8], [histoDict[13], -7], [histoDict[14], -5.5],
         [histoDict[15], -5], [histoDict[16], -4], [histoDict[17], -2.5],
         [histoDict[18], -2], [histoDict[19], -1], [histoDict[20], 0],
         [histoDict[21], 1], [histoDict[22], 2], [histoDict[23], 3],
         [histoDict[24], 4], [histoDict[25], 5], [histoDict[26], 6],
         [histoDict[27], 7], [histoDict[28], 8], [histoDict[29], 9],
         [histoDict[30], 10], [histoDict[31], 11], [histoDict[32], 12],
         [histoDict[33], 13], [histoDict[34], 14], [histoDict[35], 15],
         [histoDict[36], 16], [histoDict[37], 17], [histoDict[38], 18], 
         [histoDict[39], 19], [histoDict[40], 20], [histoDict[41],21]]];

    var histogramOptions = {
      seriesDefaults: {
        //making it a bargraph
        renderer:$.jqplot.BarRenderer,

          
        //renderingoptions for the bars
        rendererOptions: {
          barDirection: "horizontal",
          barWidth: 2,
          color: "#00ADEF"
          //color: "#5184c4"
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
        yaxis:{tickInterval: "1", min: -minDeviation, max: minDeviation},
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
        
      console.log("done")
    
    /*        
    =slider
    */

    /*
      slider variables
    */
    var sliderHeight=windowHeight/2.5;
    var slider = $("#slider");
    var sliderAverageValue = (maxDeviation + minDeviation) / 2;

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

    $(".dropdown dt a").click(function() {
        $(".dropdown dd ul").toggle();
    });
    
    $(".dropdown dd ul li a").click(function() {
        var text = $(this).html();
        $(".dropdown dt a span").html(text);
        $(".dropdown dd ul").hide();
    }); 
    
    $(document).bind('click', function(e) {
        var $clicked = $(e.target);
        if (! $clicked.parents().hasClass("dropdown"))
            $(".dropdown dd ul").hide();
    });
    
    var text = $(this).html();
    $(".dropdown dt a span").html(text);
    
    function getSelectedValue(id) {
        return $("#" + id).find("dt a span.value").html();
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