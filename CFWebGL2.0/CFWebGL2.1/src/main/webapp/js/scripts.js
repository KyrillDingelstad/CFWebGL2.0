var menu = false;

$("#menuToggle").click(function() {
	if(menu===false) {
	$("#leftWrap").animate({left: "0"}, {complete: function(){alert: "end ani";}});
	$("#rightWrap").animate({width: "85%"});
	menu = true;
	} else {
	$("#leftWrap").animate({left: "-13.5%"});
	$("#rightWrap").animate({width: "98.5%"});
	menu = false;
        
	}
});
$("#instructions").hide();


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
    var renderer, axesRenderer, camera, controls, scene, light, clock, cube, bbox, axesScene, axesCamera, axesHelper;
    
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
            renderer.setSize(canvasWidth, canvasHeight);
    }
    
    function setCamera() {
        
    }
    //changing the size of the canvas when the window gets rescaled;
    function onWindowResize() {
            camera.aspect = window.innerWidth / canvasHeight;
            renderer.setSize(canvasWidth, canvasHeight);
            camera.updateProjectionMatrix();
            console.log("resizing window");
            
      
    }
    
    //call on windowresize when the screen gets resized;
    window.addEventListener( 'resize', onWindowResize, false );

    
    init();
    render();
    animate();