
 
  var loadingOverlay = $("#loadingOverlay");
  var body = $("body"); 
  var header = $("#headerMain");
 document.oncontextmenu = function() {return false;};
  body.children().css({userSelect: 'none'});
  header.zIndex("2");
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
           url: "js/autoAlign.txt", // path to file
           type: "GET",
           dataType: 'text', // type of file (text, json, xml, etc)
           success: function(d) { // callback for successful completion
               distances = d;
               setDistanceData();
               
           }
         });
         console.log("downloading");
         $.ajax({
           url:  "js/transformed_points.txt", // path to file
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
        var slider = $("#slider");
        var sliderAverageValue = (maxDeviation + minDeviation) / 2;

        Math.ceil(sliderAverageValue);

        /*
          slider style attributes
        */  


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
    =menu
*/

var menu = true;

$("#menuToggle").click(function() {
	if(menu===false) {
	$("#leftWrap").animate({left: "0"});
	$("#rightWrap").animate({width: "80%"},function(){onWindowResize();});
        
	menu = true;
	} else {
	$("#leftWrap").animate({left: "-18.5%"});
	$("#rightWrap").animate({width: "98.5%"},function(){onWindowResize();});
	menu = false;
        
	}
});



/*
    =dropdown
*/
    
        /*
            dropdown variables
        */
        
        
        //clickable options
        var allPointsButton = $("#allPoints");
        var onlyInsideButton = $("#onlyInside");
        var onlyOutsideButton = $("#onlyOutside");
        var signedDistButton = $("#signedDist");
        
        //hover options
        var hoverInfoDiv = $("#dropdownInfoDiv");
        var hoverInfo1 = $("#dropdownInfo1");
        var hoverInfo2 = $("#dropdownInfo2");
        var hoverInfo3 = $("#dropdownInfo3");
        var hoverInfo4 = $("#dropdownInfo4");
        var infoButton = $(".infoButton");
        var hoverInfoDiv = $("#dropdownInfoDiv");
        var hoverInfoDivP = $("#dropdownInfoDiv p");
        
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
 
    /*
      glcanvas variables
    */
    
    var left = $("#left");
    var right = $("#right");
    var fullscreenBtn = $("#fullscreenButton");
    var canvasContainer = $("#canvasContainer");
    var canvasWidth = $("#canvasWrap").width();
    var canvasHeight = $("#canvasWrap").height();
    var axesContainer = $("#axesContainer");
    var instructions = $("#instructions");
    var renderer, axesRenderer, camera, controls, scene, light, clock, cube, bbox, axesScene, axesCamera, axesHelper, cadModel, pointScan;
    
    function init() {
     
    scene = new THREE.Scene();
    
    renderer = new THREE.WebGLRenderer({antialias: true });
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setClearColor( 0xffffffff);
    canvasContainer.append(renderer.domElement);
    
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
            var material = new THREE.MeshPhongMaterial( { color: 0x111111, transparent: true, opacity: 0.5, specular: 0x111111 , shininess: 200 } );
            cadModel = new THREE.Mesh( geometry, material );
            cadModel.scale.set( 0.1, 0.1, 0.1 );


            scene.add( cadModel );

    } );
   loader.load( 'img/kaplan_rhino_15.ply' );
    
    var loader2 = new THREE.PLYLoader();
    loader2.addEventListener( 'load', function ( event ) {
            
            var pointSize = 1;
            var geometry = event.content;
            var material = new THREE.PointCloudMaterial( { size: pointSize, vertexColors: THREE.VertexColors } );
            pointScan = new THREE.PointCloud( geometry, material );
            pointScan.scale.set( 0.1, 0.1, 0.1 );
            

            scene.add( pointScan );

    } );
    loader2.load( 'img/points_1000_transformed_signed_dists.ply' );
 
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
            renderer.setSize(canvasWidth, canvasHeight);
    }
    
    function setCamera() {
        
    }
    //changing the size of the canvas when the window gets rescaled;
    function onWindowResize() {
        canvasWidth = $("#canvasWrap").width();
     canvasHeight = $("#canvasWrap").height();
            camera.aspect = canvasWidth / canvasHeight;
            renderer.setSize(canvasWidth, canvasHeight);
            camera.updateProjectionMatrix();
            console.log("resizing window");
            
      
    }
    
    //call on windowresize when the screen gets resized;
    window.addEventListener( 'resize', onWindowResize, false );

    
    init();
    render();
    animate();
    
    
/*
    =checkbox
*/


$('#checkBoxCAD:checkbox').on('change', function(){
    
    if($('#checkBoxCAD').prop("checked")===true) {
        console.log("CAD Checked");
        cadModel.visible = true; 
    }   
    else {
        console.log("unchecked");
        cadModel.visible = false; 
    }
});

$('#checkBoxPoint:checkbox').on('change', function(){
    
    if($('#checkBoxPoint').prop("checked")===true) {
        console.log("Point Checked");
        pointScan.visible = true; 
    }   
    else {
        console.log("unchecked");
        pointScan.visible = false; 
    }
});
