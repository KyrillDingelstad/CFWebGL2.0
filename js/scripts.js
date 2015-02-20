/*
  =Global variables
*/
var windowWidth=$(window).width();
var windowHeight=$(window).height();
var maxDeviation = 15;
var minDeviation = -15;
var numberOfPoints = 500;
var pointUrl = "data/transformed_points.txt";
var distanceUrl = "data/autoAlign.txt";

$(function() {

  /*
    =data
  */

    /*
      data points
    */

    //list of points pulled out of the txt into array

            function downloadPoints(){
                   $.ajax({
                      url: "data/autoAlign.txt", // path to file
                      dataType: 'text', // type of file (text, json, xml, etc)
                      success: function(data) { // callback for successful completion
                      }
                    })

            }
              downloadPoints();

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
        xaxis:{tickInterval: "5", max: numberOfPoints},

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