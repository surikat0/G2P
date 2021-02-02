(function ($) {
 "use strict";

/*--------------------------
preloader
---------------------------- */	
	
	$(window).on('load',function(){
		var pre_loader = $('#preloader')
	pre_loader.fadeOut('slow',function(){$(this).remove();});
	});	
    
	
/*---------------------
 TOP Menu Stick
--------------------- */
$(window).on('scroll', function() {
    var scroll = $(window).scrollUp();
    if (scroll < 300) {
        $('#sticker').removeClass('stick');
    }else{
        $('#sticker').addClass('stick');
	}
});   
    
    
/*----------------------------
 jQuery MeanMenu
------------------------------ */
	
$(document).ready(function () {
    $('header nav').meanmenu();
    $('.meanmenu-reveal').click(function(){
      $('.logo').css('left', '40%');
    })
});
$(document).ready(function () {
    $('.meanmenu-reveal meanclose').click(function(){
      $(".logo").css("left", "10%");
    })
});
    
/*---------------------
 wow .js
--------------------- */
    function wowAnimation(){
        new WOW({
            offset: 100,          
            mobile: true
        }).init()
    }
    wowAnimation()	
    
/*--------------------------
 scrollUp
---------------------------- */
	
	$.scrollUp({
		scrollText: '<i class="ti-arrow-up"></i>',
		easingType: 'linear',
		scrollSpeed: 900,
		animation: 'fade'
	});
    
	
/*--------------------------
 collapse
---------------------------- */
	
	var panel_test = $('.panel-heading a');
	panel_test.on('click', function(){
		panel_test.removeClass('active');
		$(this).addClass('active');
	});

/*--------------------------
 MagnificPopup
---------------------------- */	
	
    $('.video-play').magnificPopup({
        type: 'iframe'
    });

    

})(jQuery); 