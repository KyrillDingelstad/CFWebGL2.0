var menu = false;

$("#menuToggle").click(function() {
	if(menu===false) {
	$("#leftWrap").animate({left: "0"});
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

