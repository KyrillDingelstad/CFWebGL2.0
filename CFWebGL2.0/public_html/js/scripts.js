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
    var histo
    
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
                    
        minDeviation = minDev;
        maxDeviation = maxDev;
        
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
        
        var histogramArray = new Array();
       
        var plusTwenty_Higher = 0;
        var plusTwenty_Ninteen = 0;
        var plusNineteen_Eighteen = 0;
        var plusEighteen_Seventeen = 0;
        var plusSeventeen_Sixteen = 0;
        var plusSixteen_Fifteen = 0;
        var plusFifteen_Fourteen = 0;
        var plusFourteen_Thirteen = 0;
        var plusThirteen_Twelve = 0;
        var plusTwelve_Eleven = 0;
        var plusEleven_Ten = 0;
        var plusTen_Nine = 0;
        var plusNine_Eight = 0;
        var plusEight_Seven = 0;
        var plusSeven_Six = 0;
        var plusSix_Five = 0;
        var plusFive_Four = 0;
        var plusFour_Three = 0;
        var plusThree_Two = 0;
        var plusTwo_One = 0;
        var plusOne_Zero = 0;
        var zero_One = 0;
        var minOne_Two = 0;
        var minTwo_Three = 0;
        var minThree_Four = 0;
        var minFour_Five = 0;
        var minFive_Six = 0;
        var minSix_Seven = 0;
        var minSeven_Eight = 0;
        var minEight_Nine = 0;
        var minNine_Ten = 0;
        var minTen_Eleven = 0;
        var minEleven_Twelve = 0;
        var minTwelve_Thirteen = 0;
        var minThirteen_Fourteen = 0;
        var minFourteen_Fifteen = 0;
        var minFifteen_Sixteen = 0;
        var minSixteen_Seventeen = 0;
        var minSeventeen_Eighteen = 0;
        var minEighteen_Nineteen = 0;
        var minNineteen_Twenty = 0;
        var minTwenty_Lower = 0;
        
        for (var i = 0; i < distances.length; i++) {
            
            if(distances[i] > 20)
                plusTwenty_Higher += 1;
            else if( distances[i] < 20 && distances[i] > 19)
                    plusTwenty_Ninteen += 1;
            
            else if( distances[i] < 19 && distances[i] > 18)
                    plusNineteen_Eighteen += 1;
            
            else if( distances[i] < 18 && distances[i] > 17)
                    plusEighteen_Seventeen += 1;
            
            else if( distances[i] < 17 && distances[i] > 16)
                    plusSeventeen_Sixteen += 1;
            
            else if( distances[i] < 16 && distances[i] > 15)
                    plusSixteen_Fifteen += 1;
            
            else if( distances[i] < 15 && distances[i] > 14)
                    plusFifteen_Fourteen += 1;
            
            else if( distances[i] < 14 && distances[i] > 13)
                    plusFourteen_Thirteen += 1;
            
            else if( distances[i] < 13 && distances[i] > 12)
                    plusThirteen_Twelve += 1;
            
            else if( distances[i] < 12 && distances[i] > 11)
                    plusTwelve_Eleven += 1;
            
            else if( distances[i] < 11 && distances[i] > 10)
                    plusEleven_Ten += 1;
            
            else if( distances[i] < 10 && distances[i] > 9)
                    plusTen_Nine += 1;
            
            else if( distances[i] < 9 && distances[i] > 8)
                    plusNine_Eight += 1;
            
            else if( distances[i] < 8 && distances[i] > 7)
                    plusEight_Seven += 1;
            
            else if( distances[i] < 7 && distances[i] > 6)
                    plusSeven_Six+= 1;
            
            else if( distances[i] < 6 && distances[i] > 5)
                    plusSix_Five += 1;
            
            else if( distances[i] < 5 && distances[i] > 4)
                    plusFive_Four += 1;
            
            else if( distances[i] < 4 && distances[i] > 3)
                    plusFour_Three += 1;
            
            else if( distances[i] < 3 && distances[i] > 2)
                     plusThree_Two += 1;
            
            else if( distances[i] < 2 && distances[i] > 1)
                    plusTwo_One += 1;
            
            else if( distances[i] < 1 && distances[i] > 0)
                    plusOne_Zero += 1;
            
            else if( distances[i] < 0 && distances[i] > -1)
                    zero_One += 1;
            
            else if( distances[i] < -1 && distances[i] > -2)
                    minOne_Two += 1;
            
            else if( distances[i] < -2 && distances[i] > -3)
                    minTwo_Three += 1;
            
            else if( distances[i] < -3 && distances[i] > -4)
                    minThree_Four += 1;
                
            else if( distances[i] < -4 && distances[i] > -5)
                    minFour_Five += 1;
            
            else if( distances[i] < -5 && distances[i] > -6)
                    minFive_Six += 1;
            
            else if( distances[i] < -6 && distances[i] > -7)
                    minSix_Seven += 1;
                
            else if( distances[i] < -7 && distances[i] > -8)
                    minSeven_Eight += 1;
                
            else if( distances[i] < -8 && distances[i] > -9)
                    minEight_Nine += 1;
                
            else if( distances[i] < -9 && distances[i] > -10)
                    minNine_Ten += 1;
            
            else if( distances[i] < -10 && distances[i] > -11)
                    minTen_Eleven += 1;
            
            else if( distances[i] < -11 && distances[i] > 12)
                    minEleven_Twelve += 1;
            
            else if( distances[i] < -12 && distances[i] > -13)
                    minTwelve_Thirteen += 1;
                
            else if( distances[i] < -13 && distances[i] > -14)
                    minThirteen_Fourteen += 1;
            
            else if( distances[i] < -14 && distances[i] > -15)
                    minFourteen_Fifteen += 1;
            
            else if( distances[i] < -15 && distances[i] > -16)
                    minFifteen_Sixteen += 1;
                
            else if( distances[i] < -16 && distances[i] > -17)
                    minSixteen_Seventeen += 1;
                
            else if( distances[i] < -17 && distances[i] > -18)
                    minSeventeen_Eighteen += 1;
                
            else if( distances[i] < -18 && distances[i] > -19)
                    minEighteen_Nineteen += 1;
            
            else if( distances[i] < -19 && distances[i] > -20)
                    minNineteen_Twenty += 1;
                
            else if( distances[i] < -20)
                    minTwenty_Lower += 1;
        }
        
    var histogramDiv = $("#histogram");
    var histogramHeight = windowHeight/2.5;
    var histogram;
    var histogramAray = [
        [[plusTwenty_Higher, 20.5], [plusTwenty_Ninteen, 19.5], [plusNineteen_Eighteen, 18.5], [plusEighteen_Seventeen, 17.5], [plusSeventeen_Sixteen, 16.5], [plusSixteen_Fifteen, 15.5], [plusFifteen_Fourteen, 14.5], [plusFourteen_Thirteen, 13.5], [plusThirteen_Twelve, 12.5], [plusTwelve_Eleven, 11.5],[plusEleven_Ten, 10.5], [plusTen_Nine, 9.5], [plusNine_Eight, 8.5], [plusEight_Seven, 7.5], [plusSeven_Six, 6.5], [plusSix_Five, 5.5], [plusFive_Four, 4.5], [plusFour_Three, 3.5], [plusThree_Two, 2.5], [plusTwo_One, 1.5], [plusOne_Zero, 0.5], [zero_One, -0.5], [minOne_Two, -1.5], [minTwo_Three, -2.5], [minThree_Four, -3.5], [minFour_Five, -4.5], [minFive_Six, -5.5], [minSix_Seven, -6.5], [minSeven_Eight, -7.5], [minEight_Nine, -8.5], [minNine_Ten, -9.5], [minTen_Eleven, -10.5], [minEleven_Twelve, -11.5],[minTwelve_Thirteen, -12.5], [minThirteen_Fourteen, -13.5], [minFourteen_Fifteen, -14.5], [minFifteen_Sixteen, -15.5], [minSixteen_Seventeen, -16.5], [minSeventeen_Eighteen, -17.5], [minEighteen_Nineteen, -18.5], [minNineteen_Twenty, -19.5], [minTwenty_Lower,-20.5]]];

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
        yaxis:{tickInterval: "2", min: -20, max: 20},
        xaxis:{tickInterval: "1000", max: 200000},
        

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
        
      console.log("done")
    
    /*        
    =slider
    */

    /*
      slider variables
    */
    var sliderHeight=windowHeight/2.5;
    var slider = $("#slider");
    var sliderMinValue = -20;
    var sliderMaxValue = 20;
    var sliderAverageValue = (sliderMaxValue + sliderMinValue) / 2;

    /*
      slider style attributes
    */  
    slider.css('height', sliderHeight);
    

    slider.removeClass('ui-widget').slider({
    	orientation: "vertical",
    	range: true,
      	values: [ sliderMinValue, sliderMaxValue ],
      	min: -20, 
      	max: 20,

      	slide: function( event, ui) {
      		$( ".colorBarInfoMin" ).val( ui.values[ 0 ]);
      		$( ".colorBarInfoMax" ).val( ui.values[ 1 ]);
      		$( ".colorBarInfoMid" ).val( (ui.values[ 0 ] + ui.values[ 1 ])/2);

      	}
    }); 
    
    $( ".colorBarInfoMin" ).val( sliderMinValue);
    $( ".colorBarInfoMax" ).val( sliderMaxValue);
    $( ".colorBarInfoMid" ).val( sliderAverageValue);
    
    doneLoading();
    }   
   /*
    var histoDict;
    
    for (var i = 0; i < distances.length; i++) {
    
        var rounded = Math.floor(distances[i]);

        if(rounded < -20)
            rounded= -20;

        if(rounded > 20)
            rounded = 20;

        if(!histoDict[rounded])
            histoDict[rounded] = 0;
        }
       
        histoDict[rounded]++;
        console.log(histoDict);
    }
     */
  

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

    

    
}); //end bracket