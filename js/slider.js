$(function() {
    $( "#slider" ).removeClass('ui-widget').slider({
    	orientation: "vertical",
    	range: true,
      	values: [ 0, 100 ],
      	min: 0, 
      	max: 200,

      	slide: function( event, ui) {
      		$( ".colorBarInfoMin" ).val( ui.values[ 0 ]);
      		$( ".colorBarInfoMax" ).val( ui.values[ 1 ]);
      		$( ".colorBarInfoMid" ).val( (ui.values[ 0 ] + ui.values[ 1 ])/2);

      	}
    });


});