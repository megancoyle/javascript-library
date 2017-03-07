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

});
