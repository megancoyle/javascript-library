jQuery(document).ready(function($){

	/* Tabbed to Accordion */

	// tabbed content
	$(".tab_content").hide();
	$(".tab_container").find(".tab_content:first").show();
	$("ul.tabs li").click(operateTabs);
	$(".tab_drawer_heading").click(operateAccordion);

	/* handle tab mode */
	function operateTabs(e) {
		e.preventDefault();
		/* parent div must have unique id to operate properly */
		var parent = $(this).parents('div').prop('id');
		var parentId = $('#'+parent);
		var activeTab = $(this).attr("rel");

		parentId.find(".tab_content").hide();
		parentId.find("#"+activeTab).fadeIn();
		parentId.find("ul.tabs li").removeClass("active");
		parentId.find("ul.tabs li a").css('opacity', '0.3');
		$(this).addClass("active");
		$(this).find('a').css('opacity', '1');
		parentId.find(".tab_drawer_heading").removeClass("d_active");
		parentId.find(".tab_drawer_heading[rel^='"+activeTab+"']").addClass("d_active");
	}

 	/* handle accordion mode */
	function operateAccordion(e) {
		e.preventDefault();
		var parent = $(this).parents('.accordion-container').prop('id');
		var parentId = $('#'+parent);
		var d_activeTab = $(this).attr("rel");

		parentId.find(".tab_content").hide();
		parentId.find("#"+d_activeTab).fadeIn();
		parentId.find(".tab_drawer_heading").removeClass("d_active");
		$(this).addClass("d_active");
		parentId.find("ul.tabs li").removeClass("active");
		parentId.find("ul.tabs li[rel^='"+d_activeTab+"']").addClass("active");
	}

	/**
	 * SMK Accordion jQuery Plugin v1.3
	 * ----------------------------------------------------
	 * Author: Smartik
	 * License: MIT
	 */

		$.fn.smk_Accordion = function( options ) {

			if (this.length > 1){
				this.each(function() {
					$(this).smk_Accordion(options);
				});
				return this;
			}

			// Defaults
			var settings = $.extend({
				animation:  true,
				showIcon:   true,
				closeAble:  false,
				closeOther: true,
				slideSpeed: 150,
				activeIndex: false
			}, options );

			if( $(this).data('close-able') )    settings.closeAble = $(this).data('close-able');
			if( $(this).data('animation') )     settings.animation = $(this).data('animation');
			if( $(this).data('show-icon') )     settings.showIcon = $(this).data('show-icon');
			if( $(this).data('close-other') )   settings.closeOther = $(this).data('close-other');
			if( $(this).data('slide-speed') )   settings.slideSpeed = $(this).data('slide-speed');
			if( $(this).data('active-index') )  settings.activeIndex = $(this).data('active-index');

			// Cache current instance
			// To avoid scope issues, use 'accordion' instead of 'this'
			// to reference this class from internal events and functions.
			var accordion = this;

			//"Constructor"
			var init = function() {
				accordion.createStructure();
				accordion.clickHead();
			}

			// Add .smk_accordion class
			this.createStructure = function() {

				//Add Class
				accordion.addClass('smk_accordion');
				if( settings.showIcon ){
					accordion.addClass('acc_with_icon');
				}

				//Create sections if they were not created already
				if( accordion.find('.accordion_in').length < 1 ){
					accordion.children().addClass('accordion_in');
				}

				//Add classes to accordion head and content for each section
				accordion.find('.accordion_in').each(function(index, elem){
					var childs = $(elem).children();
					$(childs[0]).addClass('acc_head');
					$(childs[1]).addClass('acc_content');
				});

				//Append icon
				if( settings.showIcon ){
					accordion.find('.acc_head').prepend('<div class="acc_icon_expand"></div>');
				}

				//Hide inactive
				accordion.find('.accordion_in .acc_content').not('.acc_active .acc_content').hide();

				//Active index
				if( settings.activeIndex === parseInt(settings.activeIndex) ){
					if(settings.activeIndex === 0){
						accordion.find('.accordion_in').addClass('acc_active').show();
						accordion.find('.accordion_in .acc_content').addClass('acc_active').show();
					}
					else{
						accordion.find('.accordion_in').eq(settings.activeIndex - 1).addClass('acc_active').show();
						accordion.find('.accordion_in .acc_content').eq(settings.activeIndex - 1).addClass('acc_active').show();
					}
				}

			}

			// Action when the user click accordion head
			this.clickHead = function() {

				accordion.on('click', '.acc_head', function(){

					var s_parent = $(this).parent();

					if( s_parent.hasClass('acc_active') == false ){
						if( settings.closeOther ){
							accordion.find('.acc_content').slideUp(settings.slideSpeed);
							accordion.find('.accordion_in').removeClass('acc_active');
						}
					}

					if( s_parent.hasClass('acc_active') ){
						if( false !== settings.closeAble ){
							s_parent.children('.acc_content').slideUp(settings.slideSpeed);
							s_parent.removeClass('acc_active');
						}
					}
					else{
						$(this).next('.acc_content').slideDown(settings.slideSpeed);
						s_parent.addClass('acc_active');
					}

				});

			}

			//"Constructor" init
			init();
			return this;

		};
		// Calls Accordion on Page Load
		$(".accordion_view").smk_Accordion({
				closeAble: true, //boolean
			});
});
