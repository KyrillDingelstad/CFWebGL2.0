$(function() {
    $( "#slider" ).removeClass('ui-widget').slider({
    	orientation: "vertical",
    	range: true,
      	values: [ 0, 100 ],
      	min: 0, 
      	max: 200,
    });


});