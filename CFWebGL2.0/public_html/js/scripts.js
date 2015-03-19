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
    
    function loadOnlyInside(){
        
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
        
        var histoDict = [];
        
        
        for ( var i = 0; i < 41; i++) {    
            histoDict[i] = 0; 
        }
        //setting the tickinterval for the histogram
        var tickInterval = Math.round((maxDeviation - minDeviation)/histoDict.length);
        
        //looping through the file and sorting the data into each histogram tick
        for (var i = 0; i < distances.length; i++) {

            if(distances[i] > minDeviation && distances[i] < minDeviation + tickInterval ){
                histoDict[0] += 1;
            } 
            else if(distances[i] > minDeviation + tickInterval && distances[i] < minDeviation + tickInterval*2){
                histoDict[1] += 1;
            }
            else if(distances[i] > minDeviation + tickInterval && distances[i] < minDeviation + tickInterval*3){
                histoDict[3] += 1;
            }
            else if(distances[i] > minDeviation + tickInterval*3 && distances[i] < minDeviation + tickInterval*4){
                histoDict[4] += 1;
            }
            else if(distances[i] > minDeviation + tickInterval*4 && distances[i] < minDeviation + tickInterval*5){
                histoDict[5] += 1;
            }
            else if(distances[i] > minDeviation + tickInterval*5 && distances[i] < minDeviation + tickInterval*6){
                histoDict[6] += 1;
            }
            else if(distances[i] > minDeviation + tickInterval*6 && distances[i] < minDeviation + tickInterval*7){
                histoDict[7] += 1;
            }
            else if(distances[i] > minDeviation + tickInterval*7 && distances[i] < minDeviation + tickInterval*8){
                histoDict[8] += 1;
            }
            else if(distances[i] > minDeviation + tickInterval*8 && distances[i] < minDeviation + tickInterval*9){
                histoDict[9] += 1;
            }
            else if(distances[i] > minDeviation + tickInterval*9 && distances[i] < minDeviation + tickInterval*10){
                histoDict[10] += 1;
            }
            else if(distances[i] > minDeviation + tickInterval*10 && distances[i] < minDeviation + tickInterval*11){
                histoDict[11] += 1;
            }
            else if(distances[i] > minDeviation + tickInterval*11 && distances[i] < minDeviation + tickInterval*12){
                histoDict[12] += 1;
            }
            else if(distances[i] > minDeviation + tickInterval*12 && distances[i] < minDeviation + tickInterval*13){
                histoDict[13] += 1;
            }
            else if(distances[i] > minDeviation + tickInterval*13 && distances[i] < minDeviation + tickInterval*14){
                histoDict[14] += 1;
            }
            else if(distances[i] > minDeviation + tickInterval*14 && distances[i] < minDeviation + tickInterval*15){
                histoDict[15] += 1;
            }
            else if(distances[i] > minDeviation + tickInterval*15 && distances[i] < minDeviation + tickInterval*16){
                histoDict[16] += 1;
            }
            else if(distances[i] > minDeviation + tickInterval*16 && distances[i] < minDeviation + tickInterval*17){
                histoDict[17] += 1;
            }
            else if(distances[i] > minDeviation + tickInterval*17 && distances[i] < minDeviation + tickInterval*18){
                histoDict[18] += 1;
            }
            else if(distances[i] > minDeviation + tickInterval*18 && distances[i] < minDeviation + tickInterval*19){
                histoDict[19] += 1;
            }
            else if(distances[i] > minDeviation + tickInterval*19 && distances[i] < minDeviation + tickInterval*20){
                histoDict[20] += 1;
            }
            else if(distances[i] > minDeviation + tickInterval*20 && distances[i] < minDeviation + tickInterval*21){
                histoDict[21] += 1;
            }
            else if(distances[i] > minDeviation + tickInterval*21 && distances[i] < minDeviation + tickInterval*22){
                histoDict[22] += 1;
            }
            else if(distances[i] > minDeviation + tickInterval*22 && distances[i] < minDeviation + tickInterval*23){
                histoDict[23] += 1;
            }
            else if(distances[i] > minDeviation + tickInterval*23 && distances[i] < minDeviation + tickInterval*24){
                histoDict[24] += 1;
            }
            else if(distances[i] > minDeviation + tickInterval*24 && distances[i] < minDeviation + tickInterval*25){
                histoDict[25] += 1;
            }
            else if(distances[i] > minDeviation + tickInterval*25 && distances[i] < minDeviation + tickInterval*26){
                histoDict[26] += 1;
            }
            else if(distances[i] > minDeviation + tickInterval*26 && distances[i] < minDeviation + tickInterval*27){
                histoDict[27] += 1;
            }
            else if(distances[i] > minDeviation + tickInterval*27 && distances[i] < minDeviation + tickInterval*28){
                histoDict[28] += 1;
            }
            else if(distances[i] > minDeviation + tickInterval*28 && distances[i] < minDeviation + tickInterval*29){
                histoDict[29] += 1;
            }
            else if(distances[i] > minDeviation + tickInterval*29 && distances[i] < minDeviation + tickInterval*30){
                histoDict[30] += 1;
            }
            else if(distances[i] > minDeviation + tickInterval*30 && distances[i] < minDeviation + tickInterval*31){
                histoDict[31] += 1;
            }
            else if(distances[i] > minDeviation + tickInterval*31 && distances[i] < minDeviation + tickInterval*32){
                histoDict[32] += 1;
            }
            else if(distances[i] > minDeviation + tickInterval*32 && distances[i] < minDeviation + tickInterval*33){
                histoDict[33] += 1;
            }
            else if(distances[i] > minDeviation + tickInterval*33 && distances[i] < minDeviation + tickInterval*34){
                histoDict[34] += 1;
            }
            else if(distances[i] > minDeviation + tickInterval*34 && distances[i] < minDeviation + tickInterval*35){
                histoDict[35] += 1;
            }
            else if(distances[i] > minDeviation + tickInterval*35 && distances[i] < minDeviation + tickInterval*36){
                histoDict[36] += 1;
            }
            else if(distances[i] > minDeviation + tickInterval*36 && distances[i] < minDeviation + tickInterval*37){
                histoDict[37] += 1;
            }
            else if(distances[i] > minDeviation + tickInterval*37 && distances[i] < minDeviation + tickInterval*38){
                histoDict[38] += 1;
            }
            else if(distances[i] > minDeviation + tickInterval*38 && distances[i] < minDeviation + tickInterval*39){
                histoDict[39] += 1;
            }
            else if(distances[i] > minDeviation + tickInterval*39 && distances[i] < minDeviation + tickInterval*40){
                histoDict[40] += 1;
            }
            
            /*
            var rounded = Math.floor(distances[i]);

            if(rounded < minDeviation)
                rounded= minDeviation;

            if(rounded > maxDeviation)
                rounded = maxDeviation;

            histoDict[rounded + 20]++;
            */
        }    
        
        console.log("after filling " + histoDict[16]);
    
        var histogramDiv = $("#histogram");
        var histogramHeight = windowHeight/2.5;
        var histogram;
        console.log(maxDeviation-tickInterval *2);
        //filling the histogram with the sorted data
        var histogramAray = [
            [[histoDict[0],  minDeviation], [histoDict[1],  minDeviation + tickInterval], [histoDict[2], minDeviation + tickInterval*2], 
             [histoDict[3], minDeviation + tickInterval*3], [histoDict[4], minDeviation + tickInterval*4], [histoDict[5], minDeviation + tickInterval*5],
             [histoDict[6], minDeviation + tickInterval*6], [histoDict[7], minDeviation + tickInterval*7], [histoDict[8], minDeviation + tickInterval*8],
             [histoDict[9], minDeviation + tickInterval*9], [histoDict[10], minDeviation + tickInterval*10], [histoDict[11], minDeviation + tickInterval*11],
             [histoDict[12], minDeviation + tickInterval*12], [histoDict[13], minDeviation + tickInterval*13], [histoDict[14], minDeviation + tickInterval*14],
             [histoDict[15], minDeviation + tickInterval*15], [histoDict[16], minDeviation + tickInterval*16], [histoDict[17], minDeviation + tickInterval*17],
             [histoDict[18], minDeviation + tickInterval*18], [histoDict[19], minDeviation + tickInterval*19], [histoDict[20], minDeviation + tickInterval*20],
             [histoDict[21], minDeviation + tickInterval*21], [histoDict[22], minDeviation + tickInterval*22], [histoDict[23], minDeviation + tickInterval*23],
             [histoDict[24], minDeviation + tickInterval*24], [histoDict[25], minDeviation + tickInterval*25], [histoDict[26], minDeviation + tickInterval*26],
             [histoDict[27], minDeviation + tickInterval*27], [histoDict[28], minDeviation + tickInterval*28], [histoDict[29], minDeviation + tickInterval*29],
             [histoDict[30], minDeviation + tickInterval*30], [histoDict[31], minDeviation + tickInterval*31], [histoDict[32], minDeviation + tickInterval*32],
             [histoDict[33], minDeviation + tickInterval*33], [histoDict[34], minDeviation + tickInterval*34], [histoDict[35], minDeviation + tickInterval*35],
             [histoDict[36], minDeviation + tickInterval*36], [histoDict[37], minDeviation + tickInterval*37], [histoDict[38], minDeviation + tickInterval*38], 
             [histoDict[39], minDeviation + tickInterval*39], [histoDict[40], minDeviation + tickInterval*40], [histoDict[41],minDeviation + tickInterval*41]]];

        var histogramOptions = {
          seriesDefaults: {
            //making it a bargraph
            renderer:$.jqplot.BarRenderer,


            //renderingoptions for the bars
            rendererOptions: {
              barDirection: "horizontal",
              barWidth: 4,
              shadow: false,
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
            yaxis:{tickInterval: tickInterval, min: minDeviation, max: maxDeviation},
            xaxis:{tickInterval: "1000", max: 300000},


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

/*
    =dropdown
*/
    
        /*
            dropdown functions
        */
       
       
        //making the dropdown appear when clicked
        $(".dropdown dt a").click(function(e) {
            e.preventDefault();
            $(".dropdown dd ul").toggle();
        });
        
        //selecting the right button
        $(".dropdown dd ul li a").click(function(e) {
            e.preventDefault();
            var text = $(this).html();
            $(".dropdown dt a span").html(text);
            
            $(".dropdown dd ul").hide();
                       
        }); 

        
        //if clicked outside the dropbox then hide it
        $(document).bind('click', function(e) {
            var $clicked = $(e.target);
            if (!$clicked.parents().hasClass("dropdown"))
                $(".dropdown dd ul").hide();
        });
        
        //hoveroptions for info
        hoverInfoDiv = $("#dropdownInfoDiv");
        hoverInfo1 = $("#dropdownInfo1");
        hoverInfo2 = $("#dropdownInfo2");
        hoverInfo3 = $("#dropdownInfo3");
        hoverInfo4 = $("#dropdownInfo4");
        infoButton = $(".infoButton");
        hoverInfoDivP = $("#dropdownInfoDiv p");
        
        hoverInfoDiv.hide();
        
        hoverInfo1.hover(function(){
            hoverInfoDiv.show();
            hoverInfoDivP.text("Shows all the points");
        });
        hoverInfo2.hover(function(){
            hoverInfoDiv.show();
            hoverInfoDivP.text("Shows all the points that fall inside of the CAD model");
        });
        hoverInfo3.hover(function(){
            hoverInfoDiv.show();
            hoverInfoDivP.text("Shows all the points that fall outside of the CAD model");
        });
        hoverInfo4.hover(function(){
            hoverInfoDiv.show();
            hoverInfoDivP.text("??");
        });
            
        infoButton.mouseleave(function(){
            hoverInfoDiv.hide();
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
      canvas full screen
    */

        $("#fullscreenButton").click(function(){
           console.log("make fullscreen");
        });
        
        
       
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