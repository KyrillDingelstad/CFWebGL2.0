/*
  =Global variables
*/
var windowWidth=$(window).width();
var windowHeight=$(window).height();
var loadingOverlay = $("#loadingOverlay");
var pointUrl = "data/transformed_points.txt";

$(function() {
  var body = $("body"); 
  
  document.oncontextmenu = function() {return false;};
  body.children().css({userSelect: 'none'});
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
    var absoluteVal = true;
    var invertSign = false;
    
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
               loadAllPoints();
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
        absoluteVal = false;
        invertSign = true;
        var min = Math.max(0.0,-maxDev);
        var max = Math.max(0.0,-minDev);
            
        setHistogramData(min, max);
        
    }
    
    function loadAllPoints(){
        absoluteVal = true;
        invertSign = false;
        var min = 0;
        if (minDev>0) {
            min = minDev;
        }
        var max = Math.max(Math.abs(maxDev), Math.abs(minDev));
         setHistogramData(min, max);
         
    }
    
    function loadOnlyOutside(){
        absoluteVal = false;
        invertSign = false;
        var min = 0;
        var max = maxDev;
        if (minDev>0) {
            min = minDev;
        }

         setHistogramData(min, max);
    }
    
    function loadSignedDist() {
        absoluteVal = false;
        invertSign = false;
        setHistogramData(minDev, maxDev);
    }
    
    function doneLoading(){
        loadingOverlay.hide();
        console.log("hide overlay");
    }
    
    function setHistogramData(minDeviation, maxDeviation) {
        
        
    /*
      =histogram
    */
   
        /*
            histogram info
        */
      
        
        var histoDict = [];
        var bucketSize = 40;
        var invert = 1.0;
        
        if(invertSign) {
            invert = -1;
        }
        
        //creating an array that will be filled with the buckets
        for ( var i = 0; i < bucketSize; i++) {    
            histoDict[i] = 0; 
        }
        //setting the tickinterval for the histogram
        var tickInterval = (maxDeviation - minDeviation)/histoDict.length;
        
        //looping through the file and sorting the data into each histogram tick
        for (var i = 0; i < distances.length; i++) {
            
            var v = invert*distances[i];
            
            if(absoluteVal){
                v = Math.abs(v);
            }
            
            if (v < minDeviation || v > maxDeviation) {
                continue;
            }
            
            for (var j = 0; j < bucketSize; j++) {

                if(v > minDeviation + tickInterval * (j) && v < minDeviation + tickInterval * (j+1) ){
                    histoDict[j] += 1;
                    break;
                } 
            }
        }
            
     
    
        var histogramDiv = $("#histogram");
        var histogramHeight = windowHeight/2.5;
        var histogram;
        
        //filling the histogram with the sorted data
        var histogramArray = [[]];
        
        for (var k = 0; k < histoDict.length; k++) {
            
            histogramArray[0].push([histoDict[k], minDeviation + (tickInterval * k)]);
        }
        
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
            xaxis:{tickInterval: "1", max: 300000},


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
        
        histogram = $.jqplot('histogram', histogramArray, histogramOptions);
        histogram.replot();
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
            dropdown variables
        */
        
        
        //clickable options
        allPointsButton = $("#allPoints");
        onlyInsideButton = $("#onlyInside");
        onlyOutsideButton = $("#onlyOutside");
        signedDistButton = $("#signedDist");
        
        //hover options
        hoverInfoDiv = $("#dropdownInfoDiv");
        hoverInfo1 = $("#dropdownInfo1");
        hoverInfo2 = $("#dropdownInfo2");
        hoverInfo3 = $("#dropdownInfo3");
        hoverInfo4 = $("#dropdownInfo4");
        infoButton = $(".infoButton");
        hoverInfoDiv = $("#dropdownInfoDiv");
        hoverInfoDivP = $("#dropdownInfoDiv p");
        
        /*
            dropdown functions
        */
       
       
        //making the dropdown appear when clicked
        $(".dropdown dt a").click(function(e) {
            e.preventDefault();
            $(".dropdown dd ul").toggle();
            hoverInfoDiv.css('z-index', '2000');
        });
        
        //selecting the right button
        $(".dropdown dd ul li a").click(function(e) {
            e.preventDefault();
            var text = $(this).html();
            $(".dropdown dt a span").html(text);
            
            $(".dropdown dd ul").hide();
                       
        }); 
        
        allPointsButton.click(function(){
           console.log("All points clicked");
           loadAllPoints();
        });
        
        onlyInsideButton.click(function(){
           console.log("Only inside clicked"); 
           loadOnlyInside();
        });
        
        onlyOutsideButton.click(function(){
            loadOnlyOutside();
           console.log("Only outside clicked"); 
        });
        
        signedDistButton.click(function(){
            loadSignedDist();
           console.log("Signed dist. clicked"); 
        });

        
        //if clicked outside the dropbox then hide it
        $(document).bind('click', function(e) {
            var $clicked = $(e.target);
            if (!$clicked.parents().hasClass("dropdown"))
                $(".dropdown dd ul").hide();
        });
        
        
        
        hoverInfoDiv.hide();
        
        hoverInfo1.hover(function(){
            hoverInfoDiv.show();
            hoverInfoDiv.css('top', '45.1%');
            hoverInfoDivP.text("Show all points with deviation from the CAD model within the selected range. The sign of the deviation is ignored.");
        });
        hoverInfo2.hover(function(){
            hoverInfoDiv.show();
            hoverInfoDiv.css('top', '48.8%');
            hoverInfoDivP.text("Show all points that lie outside the CAD model (positive deviation), within the selected range");
        });
        hoverInfo3.hover(function(){
            hoverInfoDiv.show();
            hoverInfoDiv.css('top', '52.5%');
            hoverInfoDivP.text("Show all points that lie inside the CAD model (negative deviation), within the selected range");
        });
        hoverInfo4.hover(function(){
            hoverInfoDiv.show();
            hoverInfoDiv.css('top', '55.2%');
            hoverInfoDivP.text("Show all points with deviation from the CAD model within the selected range.  The sign of the deviation determines if a point is inside or outside the CAD model (negative for inside and positive for outside).");
        });
            
        infoButton.mouseleave(function(){
            hoverInfoDiv.hide();
        });
        
            
        
              
            
  /*
    =canvas
  */
    var fullscreenBool = false;
    /*
      glcanvas variables
    */
   
    var canvasWrap = $("#canvasWrap");
    var canvasWidth = canvasWrap.width();
    var canvasHeight = canvasWrap.height();
    var container = $("#container");
    var axesContainer = $("#axesContainer");
    
    
    /*
      canvas full screen
    */
   
           var left = $("left");
           var mouseInstructions = $(".mouseInstructions");
           var header = $("header");
           var fullscreenBtn = $("#fullscreenButton");
        
    function toggleFullScreen() {
        if (!document.fullscreenElement &&    // alternative standard method
            !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) { 
          
           fullscreenBool = true;
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
          } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
          } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
          } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
          }
        } else {
            
           fullscreenBool = false;
            if (document.exitFullscreen) {
              document.exitFullscreen();
            } else if (document.msExitFullscreen) {
              document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
              document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
              document.webkitExitFullscreen();
            }
        }
    }
    
        fullscreenBtn.click(function(){
           toggleFullScreen();
        });
        
        var headerClicked = false;
        $("header button").click(function(){
            
           if(headerClicked === false) {
           $("#console").animate({left: "15px"});
           headerClicked = true;
            }
            else {
                $("#console").animate({left: "-300px"});
                headerClicked = false;
            }
        }); 
           
        
        
            console.log(fullscreenBool);
            
        
        
        
        
        
        
       
    /*
      glcanvas WebGL
    */
   
    var renderer, axesRenderer, camera, controls, scene, light, clock, cube, bbox, axesScene, axesCamera, axesHelper;
    
    function init() {
     
    scene = new THREE.Scene();
    
    renderer = new THREE.WebGLRenderer({antialias: true });
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setClearColor( 0xffffffff);
    container.append(renderer.domElement);
    
    camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 0.1, 10000);
    camera.position.y = 160;
    camera.position.z = 400;
    scene.add(camera);
    
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.damping = 0.2;
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    controls.noZoom = false;
    controls.noPan = false;

    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    controls.keys = [ 65, 83, 68 ];

    controls.addEventListener( 'change', render );
    
    //renderer.domElement.addEventListener("touchstart", function(e){e.preventDefault();});
    
    light = new THREE.PointLight(0xffff00ff);
    light.position.set(0, 300, 200);
    scene.add(light);
    
      
    //loading the ply file
    var loader = new THREE.PLYLoader();
    loader.addEventListener( 'load', function ( event ) {

            var geometry = event.content;
            var material = new THREE.MeshPhongMaterial( { color: 0x0055ff, specular: 0x111111, shininess: 200 } );
            var mesh = new THREE.Mesh( geometry, material );

            mesh.scale.set( 0.1, 0.1, 0.1 );


            scene.add( mesh );

    } );
    loader.load( 'img/dolphins_le.ply' );
    
    clock = new THREE.Clock;
 
 
    //AxisScene
    
    axesRenderer = new THREE.WebGLRenderer({alpha: true});
    axesRenderer.setSize( axesContainer.width(), axesContainer.height() );
    axesRenderer.setClearColor( 0xffffffff, 0);
    axesContainer.append( axesRenderer.domElement );
    
    axesScene = new THREE.Scene();
        
    axesHelper = new THREE.AxisHelper(100);
    
    axesScene.add( axesHelper );
    
    axesCamera = new THREE.PerspectiveCamera( 50, axesContainer.height() / axesContainer.width(), 1, 1000 );
    axesCamera.up = camera.up;
    axesCamera.position.copy( camera.position );
    axesCamera.position.sub( controls.target );
    axesCamera.position.setLength( 200 );
    axesCamera.lookAt( axesScene.position );
    
    }
    
    function animate() {
          //takes over from renderer for requesting new frame render
          requestAnimationFrame(animate);
          controls.update();
    
	axesCamera.position.copy( camera.position );
	axesCamera.position.sub( controls.target ); // added by @libe
	axesCamera.position.setLength( 300 );

    axesCamera.lookAt( axesScene.position );
    render();
    }
    
    function render() {
        
            renderer.render(scene, camera);
            axesRenderer.render(axesScene, axesCamera);
    }
    
    function setCamera() {
        
    }
    //changing the size of the canvas when the window gets rescaled;
    function onWindowResize() {

            camera.aspect = $("#canvasWrap").width() / $("#canvasWrap").height();
            camera.updateProjectionMatrix();
            renderer.setSize( $("#canvasWrap").width(), $("#canvasWrap").height());
      
    }
    
    //call on windowresize when the screen gets resized;
    window.addEventListener( 'resize', onWindowResize, false );
    $(".main").css("height", "windowHeight");

    
    init();
    render();
    animate();
    
}); //end bracket