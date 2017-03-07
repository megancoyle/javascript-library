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


		/**
		 * stacktable.js
		 * Author & copyright (c) 2012: John Polacek
		 * CardTable by: Justin McNally (2015)
		 * Dual MIT & GPL license
		 *
		 * Page: http://johnpolacek.github.com/stacktable.js
		 * Repo: https://github.com/johnpolacek/stacktable.js/
		 *
		 * jQuery plugin for stacking tables on small screens
		 * Requires jQuery version 1.7 or above
		 *
		 */
		$.fn.cardtable = function(options) {
			var $tables = this,
					defaults = {headIndex:0},
					settings = $.extend({}, defaults, options),
					headIndex;

			// checking the "headIndex" option presence... or defaults it to 0
			if(options && options.headIndex)
				headIndex = options.headIndex;
			else
				headIndex = 0;

			return $tables.each(function() {
				var $table = $(this);
				if ($table.hasClass('stacktable')) {
					return;
				}
				var table_css = $(this).prop('class');
				var $stacktable = $('<div></div>');
				if (typeof settings.myClass !== 'undefined') $stacktable.addClass(settings.myClass);
				var markup = '';
				var $caption, $topRow, headMarkup, bodyMarkup, tr_class;

				$table.addClass('stacktable large-only');

				$caption = $table.find(">caption").clone();
				$topRow = $table.find('>thead>tr,>tbody>tr,>tfoot>tr,>tr').eq(0);

				// avoid duplication when paginating
				$table.siblings().filter('.small-only').remove();

				// using rowIndex and cellIndex in order to reduce ambiguity
				$table.find('>tbody>tr').each(function() {

					// declaring headMarkup and bodyMarkup, to be used for separately head and body of single records
					headMarkup = '';
					bodyMarkup = '';
					tr_class = $(this).prop('class');
					// for the first row, "headIndex" cell is the head of the table
					// for the other rows, put the "headIndex" cell as the head for that row
					// then iterate through the key/values
					$(this).find('>td,>th').each(function(cellIndex) {
						if ($(this).html() !== ''){
							bodyMarkup += '<tr class="' + tr_class +'">';
							if ($topRow.find('>td,>th').eq(cellIndex).html()){
								bodyMarkup += '<td class="st-key">'+$topRow.find('>td,>th').eq(cellIndex).html()+'</td>';
							} else {
								bodyMarkup += '<td class="st-key"></td>';
							}
							bodyMarkup += '<td class="st-val '+$(this).prop('class')  +'">'+$(this).html()+'</td>';
							bodyMarkup += '</tr>';
						}
					});

					markup += '<table class=" '+ table_css +' stacktable small-only"><tbody>' + headMarkup + bodyMarkup + '</tbody></table>';
				});

				$table.find('>tfoot>tr>td').each(function(rowIndex,value) {
					if ($.trim($(value).text()) !== '') {
						markup += '<table class="'+ table_css + ' stacktable small-only"><tbody><tr><td>' + $(value).html() + '</td></tr></tbody></table>';
					}
				});

				$stacktable.prepend($caption);
				$stacktable.append($(markup));
				$table.before($stacktable);
			});
		};

		$.fn.stacktable = function(options) {
			var $tables = this,
					defaults = {headIndex:0,displayHeader:true},
					settings = $.extend({}, defaults, options),
					headIndex;

			// checking the "headIndex" option presence... or defaults it to 0
			if(options && options.headIndex)
				headIndex = options.headIndex;
			else
				headIndex = 0;

			return $tables.each(function() {
				var table_css = $(this).prop('class');
				var $stacktable = $('<table class="'+ table_css +' stacktable small-only"><tbody></tbody></table>');
				if (typeof settings.myClass !== 'undefined') $stacktable.addClass(settings.myClass);
				var markup = '';
				var $table, $caption, $topRow, headMarkup, bodyMarkup, tr_class, displayHeader;

				$table = $(this);
				$table.addClass('stacktable large-only');
				$caption = $table.find(">caption").clone();
				$topRow = $table.find('>thead>tr,>tbody>tr,>tfoot>tr').eq(0);

				displayHeader = $table.data('display-header') === undefined ? settings.displayHeader : $table.data('display-header');

				// using rowIndex and cellIndex in order to reduce ambiguity
				$table.find('>tbody>tr').each(function(rowIndex) {

					// declaring headMarkup and bodyMarkup, to be used for separately head and body of single records
					headMarkup = '';
					bodyMarkup = '';
					tr_class = $(this).prop('class');

					// for the first row, "headIndex" cell is the head of the table
					if (rowIndex === 0) {
						// the main heading goes into the markup variable
						if (displayHeader) {
							markup += '<tr class=" '+tr_class +' "><th class="st-head-row st-head-row-main" colspan="2">'+$(this).find('>th,>td').eq(headIndex).html()+'</th></tr>';
						}
					} else {
						// for the other rows, put the "headIndex" cell as the head for that row
						// then iterate through the key/values
						$(this).find('>td,>th').each(function(cellIndex) {
							if (cellIndex === headIndex) {
								headMarkup = '<tr class="'+ tr_class+'"><th class="st-head-row" colspan="2">'+$(this).html()+'</th></tr>';
							} else {
								if ($(this).html() !== ''){
									bodyMarkup += '<tr class="' + tr_class +'">';
									if ($topRow.find('>td,>th').eq(cellIndex).html()){
										bodyMarkup += '<td class="st-key">'+$topRow.find('>td,>th').eq(cellIndex).html()+'</td>';
									} else {
										bodyMarkup += '<td class="st-key"></td>';
									}
									bodyMarkup += '<td class="st-val '+$(this).prop('class')  +'">'+$(this).html()+'</td>';
									bodyMarkup += '</tr>';
								}
							}
						});

						markup += headMarkup + bodyMarkup;
					}
				});

				$stacktable.prepend($caption);
				$stacktable.append($(markup));
				$table.before($stacktable);
			});
		};

		$.fn.stackcolumns = function(options) {
			var $tables = this,
					defaults = {},
					settings = $.extend({}, defaults, options);

			return $tables.each(function() {
				var $table = $(this);
				var $caption = $table.find(">caption").clone();
				var num_cols = $table.find('>thead>tr,>tbody>tr,>tfoot>tr').eq(0).find('>td,>th').length; //first table <tr> must not contain colspans, or add sum(colspan-1) here.
				if(num_cols<3) //stackcolumns has no effect on tables with less than 3 columns
					return;

				var $stackcolumns = $('<table class="stacktable small-only"></table>');
				if (typeof settings.myClass !== 'undefined') $stackcolumns.addClass(settings.myClass);
				$table.addClass('stacktable large-only');
				var tb = $('<tbody></tbody>');
				var col_i = 1; //col index starts at 0 -> start copy at second column.

				while (col_i < num_cols) {
					$table.find('>thead>tr,>tbody>tr,>tfoot>tr').each(function(index) {
						var tem = $('<tr></tr>'); // todo opt. copy styles of $this; todo check if parent is thead or tfoot to handle accordingly
						if(index === 0) tem.addClass("st-head-row st-head-row-main");
						var first = $(this).find('>td,>th').eq(0).clone().addClass("st-key");
						var target = col_i;
						// if colspan apply, recompute target for second cell.
						if ($(this).find("*[colspan]").length) {
							var i =0;
							$(this).find('>td,>th').each(function() {
									var cs = $(this).attr("colspan");
									if (cs) {
										cs = parseInt(cs, 10);
										target -= cs-1;
										if ((i+cs) > (col_i)) //out of current bounds
											target += i + cs - col_i -1;
										i += cs;
									} else {
										i++;
									}

									if (i > col_i)
										return false; //target is set; break.
							});
						}
						var second = $(this).find('>td,>th').eq(target).clone().addClass("st-val").removeAttr("colspan");
						tem.append(first, second);
						tb.append(tem);
					});
					++col_i;
				}

				$stackcolumns.append($(tb));
				$stackcolumns.prepend($caption);
				$table.before($stackcolumns);
			});
		};

		// Smooth Scrolling
		$('a[href*="#"]:not([href="#"])').click(function() {
	    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
	      var target = $(this.hash);
	      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
	      if (target.length) {
	        $('html, body').animate({
	          scrollTop: target.offset().top
	        }, 1000);
	        return false;
	      }
	    }
	  });


		// Calls Accordion on Page Load
		$(".accordion_view").smk_Accordion({
				closeAble: true, //boolean
			});


		// Stacking Tables
		$('.stackable-table').stacktable({myClass:'mobile-table'});
});
