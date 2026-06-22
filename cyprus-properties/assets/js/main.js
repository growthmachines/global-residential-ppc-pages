(function ($) {
	"use strict";
	// Weave Animation Js
	const target = document.getElementById("tj-weave-anim");
	function splitTextToSpans(targetElement) {
		if (targetElement) {
			const text = targetElement.textContent;
			targetElement.innerHTML = "";
			
			for (let character of text) {
				const span = document.createElement("span");
				if (character === " ") {
					span.innerHTML = "&nbsp;";
				} else {
					span.textContent = character;
				}
				targetElement.appendChild(span);
			}
		}
	}
	splitTextToSpans(target);
	// Preloader js
	$(window).on("load", function () {
		const tjPreloader = $(".tj-preloader");
		if (tjPreloader?.length) {
			setTimeout(function () {
				tjPreloader.removeClass("is-loading").addClass("is-loaded");
				setTimeout(function () {
					tjPreloader.fadeOut(400);
					wowController();
					gsapController();
				}, 700);
			}, 2000);
		} else {
			wowController();
			gsapController();
		}
	});
	
	/* ------------- Gsap registration Js -------------*/
	gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);
	if ($("#smooth-wrapper").length && $("#smooth-content").length) {
		gsap.config({
			nullTargetWarn: false,
		});
		
		let smoother = ScrollSmoother.create({
			smooth: 1.5,
			effects: true,
			smoothTouch: 0.1,
			ignoreMobileResize: true,
		});
	}
	
	////////////////////////////////////////////////////
	// Data js
	$("[data-bg-image]").each(function () {
		var $this = $(this),
		$image = $this.data("bg-image");
		$this.css("background-image", "url(" + $image + ")");
	});
	
	////////////////////////////////////////////////////
	// Sticky Nav Js
	var lastScrollTop = "";
	function stickyMenu($targetMenu, $toggleClass) {
		var st = $(window).scrollTop();
		if ($(window).scrollTop() > 500) {
			if (st > lastScrollTop) {
				$targetMenu.removeClass($toggleClass);
			} else {
				$targetMenu.addClass($toggleClass);
			}
		} else {
			$targetMenu.removeClass($toggleClass);
		}
		
		lastScrollTop = st;
	}
	
	$(window).on("scroll", function () {
		if ($(".header-area").length) {
			stickyMenu($(".header-sticky"), "sticky");
		}
	});

	
	// Offcanvas js
	$(".menu_offcanvas").on("click", function () {
		$(".tj-offcanvas-area").toggleClass("opened");
		$(".body-overlay").addClass("opened");
		$("body").toggleClass("overflow-hidden");
	});
	$(".hamburger_close_btn").on("click", function () {
		$(".tj-offcanvas-area").removeClass("opened");
		$(".hamburger-area").removeClass("opened");
		$(".body-overlay").removeClass("opened");
		$("body").toggleClass("overflow-hidden");
	});
	$(".body-overlay").on("click", function () {
		$(".tj-offcanvas-area").removeClass("opened");
		$(".hamburger-area").removeClass("opened");
		$(".body-overlay").removeClass("opened");
		$("body").toggleClass("overflow-hidden");
	});

	////////////////////////////////////////////////////
	// Client-slider Js
	if ($(".client-slider").length > 0) {
		var client = new Swiper(".client-slider", {
			slidesPerView: "auto",
			spaceBetween: 0,
			freemode: true,
			centeredSlides: true,
			loop: true,
			speed: 5000,
			allowTouchMove: false,
			autoplay: {
				delay: 1,
				disableOnInteraction: true,
			},
		});
	}
	
	////////////////////////////////////////////////////
	// Marquee slider Js
	if ($(".marquee-slider").length > 0) {
		var marquee = new Swiper(".marquee-slider", {
			slidesPerView: "auto",
			spaceBetween: 0,
			freemode: true,
			centeredSlides: true,
			loop: true,
			speed: 7000,
			allowTouchMove: false,
			autoplay: {
				delay: 1,
				disableOnInteraction: true,
			},
		});
	}

	let verticalTestimonialSlider8;
	//  testimonial Slider  Js
	function verticalTestimonialSlider() {
		const screenWidth = window.innerWidth;
		const direction = screenWidth >= 992 ? "vertical" : "horizontal";
		if (verticalTestimonialSlider8) {
			verticalTestimonialSlider8?.destroy(true, true);
		}
		if ($(".h6-testimonial-slider").length > 0) {
			verticalTestimonialSlider8 = new Swiper(".h6-testimonial-slider", {
				direction: direction,
				slidesPerView: 1,
				spaceBetween: 20,
				loop: true,
				speed: 1000,
				autoplay: {
					delay: 5000,
				},
				
				breakpoints: {
					576: {
						slidesPerView: 1.2,
					},
					992: {
						slidesPerView: "auto",
						spaceBetween: 30,
					},
				},
			});
		}
	}
	verticalTestimonialSlider();
	// Reinitialize on resize
	window.addEventListener("resize", () => {
		verticalTestimonialSlider();
	});
	
	// Testimonial Slider 3 Js
	if ($(".client-thumb").length > 0 && $(".testimonial-slider-3").length > 0) {
		let thumbSlider3 = new Swiper(".client-thumb", {
			slidesPerView: 3,
			spaceBetween: 12,
			loop: true,
			speed: 1500,
			centeredSlides: true,
			freeMode: true,
			watchSlidesProgress: true,
			slideToClickedSlide: true,
		});
		
		let testimonialSlider3 = new Swiper(".testimonial-slider-3", {
			slidesPerView: "auto",
			spaceBetween: 28,
			loop: true,
			speed: 1500,
			autoplay: {
				delay: 3000,
			},
			navigation: {
				nextEl: ".slider-next",
				prevEl: ".slider-prev",
			},
			pagination: {
				el: ".swiper-pagination-area",
				clickable: true,
			},
		});
		
		// Connect the sliders
		testimonialSlider3.controller.control = thumbSlider3;
		thumbSlider3.controller.control = testimonialSlider3;
	}
	
	////////////////////////////////////////////////////
	// Hero slider Js
	if ($(".hero-thumb").length > 0) {
		var swiper = new Swiper(".hero-thumb", {
			loop: false,
			spaceBetween: 15,
			slidesPerView: 3,
			freeMode: true,
			watchSlidesProgress: true,
		});
	}
	if ($(".hero-slider").length > 0) {
		var hero = new Swiper(".hero-slider", {
			slidesPerView: 1,
			spaceBetween: 0,
			effect: "fade",
			loop: true,
			speed: 1400,
			autoplay: {
				delay: 5000,
			},
			navigation: {
				nextEl: ".slider-next",
				prevEl: ".slider-prev",
			},
			thumbs: {
				swiper: swiper,
			},
		});
	}
	if ($(".h6-hero-card-slider").length > 0) {
		var heroCard = new Swiper(".h6-hero-card-slider", {
			slidesPerView: 1,
			spaceBetween: 15,
			
			loop: true,
			speed: 1400,
			autoplay: {
				delay: 5000,
			},
			pagination: {
				el: ".swiper-pagination-area",
				clickable: true,
			},
		});
	}
	
	////////////////////////////////////////////////////
	// Accordion Js
	if ($(".accordion-item").length > 0) {
		$(".accordion-item .faq-title").on("click", function () {
			if ($(this).parent().hasClass("active")) {
				$(this).parent().removeClass("active");
			} else {
				$(this).parent().siblings().removeClass("active");
				$(this).parent().addClass("active");
			}
		});
	}
	
	////////////////////////////////////////////////////
	// Odometer js
	if (jQuery(".odometer").length > 0) {
		var om = jQuery(".odometer");
		om.each(function () {
			jQuery(this).appear(function () {
				var numCount = jQuery(this).attr("data-count");
				jQuery(this).html(numCount);
			});
		});
	}
	
	////////////////////////////////////////////////////
	// wow js
	function wowController() {
		if ($(".wow").length > 0) {
			new WOW().init();
		}
	}
	
	////////////////////////////////////////////////////
	// VenoBox Js
	if ($(".gallery").length > 0) {
		new VenoBox({
			selector: ".gallery",
			numeration: true,
			// infinigall: true,
			spinner: "pulse",
		});
	}
	
	if ($(".ig-gallery").length > 0) {
		new VenoBox({
			selector: ".ig-gallery",
			numeration: true,
			infinigall: true,
			spinner: "pulse",
		});
	}
		
	////////////////////////////////////////////////////
	// Project Hover active change
	if ($(".team-wrapper").length) {
		$(".team-item").on("mouseover", function () {
			// Remove active class from all siblings
			$(this).siblings(".team-item").removeClass("active");
			
			// Add active class to hovered item
			$(this).addClass("active");
			
			// Update image dynamically
			const newSrc = $(this).data("src");
			const $image = $("#team-img img");
			
			// Animate zoom out, change image, then zoom back in
			$image
			.fadeOut(300)
			.css("transform", "scale(1.1)")
			.promise()
			.done(function () {
				$image.attr("src", newSrc).fadeIn(300).css("transform", "scale(1)");
			});
		});
	}
	
	////////////////////////////////////////////////////
	// progress bar
	const progressBarController = () => {
		const progressContainers = document.querySelectorAll(".tj-progress");
		
		if (progressContainers?.length) {
			progressContainers.forEach(progressContainer => {
				const targetedProgressBar =
				progressContainer.querySelector(".tj-progress-bar");
				const completedPercent =
				parseInt(targetedProgressBar.getAttribute("data-percent", 10)) || 0;
				
				// Trigger animation when the element comes into view
				const observer = new IntersectionObserver(
					entries => {
						entries.forEach(entry => {
							if (entry.isIntersecting) {
								// Animate the progress bar
								targetedProgressBar.style.transition = "width 2s ease-out";
								targetedProgressBar.style.width = `${completedPercent}%`;
								
								// Animate the percentage text
								const percentageText = progressContainer.querySelector(
									".tj-progress-percent"
								);
								if (percentageText) {
									let currentPercent = 0;
									
									const interval = setInterval(() => {
										currentPercent++;
										percentageText.textContent = `${currentPercent}%`;
										
										if (currentPercent >= completedPercent) {
											clearInterval(interval); // Stop the animation
										}
									}, 15); // Adjust the interval for animation speed
								}
							}
						});
					},
					{
						root: null, // Observing the viewport
						threshold: [0.3, 0.9], // Progress triggers based on visibility
					}
				);
				observer.observe(progressContainer);
			});
		}
	};
	
	// Call the function
	progressBarController();
	
	////////////////////////////////////////////////////
	/* ------------- Circle Proggess Bar Js -------------*/
	
	if (typeof $.fn.knob != "undefined") {
		$(".knob").each(function () {
			var $this = $(this),
			knobVal = $this.attr("data-rel");
			
			$this.knob({
				draw: function () {
					$(this.i).val(this.cv + "%");
				},
			});
			
			$this.appear(
				function () {
					$({
						value: 0,
					}).animate(
						{
							value: knobVal,
						},
						{
							duration: 2000,
							easing: "swing",
							step: function () {
								$this.val(Math.ceil(this.value)).trigger("change");
							},
						}
					);
				},
				{
					accX: 0,
					accY: -150,
				}
			);
		});
	}
	
	/* ------------- Gsap Animation Js -------------*/
	function gsapController() {
		// common variable and funtion
		let mediaMatch = gsap.matchMedia();
		function rtlValue(value) {
			const isRTL = document.documentElement.dir === "rtl";
			return isRTL ? -value : value;
		}
		
		/* ------------- Positon Sticky Js -------------*/
		
		/* Service js */
		const serviceStack = gsap.utils.toArray(".service-stack");
		if (serviceStack.length > 0) {
			mediaMatch.add("(min-width: 992px)", () => {
				serviceStack.forEach(item => {
					gsap.to(item, {
						opacity: 0,
						scale: 0.9,
						y: 50,
						scrollTrigger: {
							trigger: item,
							scrub: true,
							start: "top top",
							pin: true,
							pinSpacing: false,
							markers: false,
						},
					});
				});
			});
		}
		
		const h6ProjectStack = gsap.utils.toArray(".project-stack");
		if (h6ProjectStack.length > 0) {
			mediaMatch.add("(min-width: 992px)", () => {
				h6ProjectStack.forEach(item => {
					gsap.to(item, {
						// opacity: 0,
						// scale: 0.9,
						// y: 50,
						scrollTrigger: {
							trigger: item,
							scrub: true,
							start: "top top",
							pin: true,
							pinSpacing: false,
							markers: false,
						},
					});
				});
			});
		}
		
		// Scroll Slider Animation
		if ($(".tj-scroll-slider-item").length > 0) {
			mediaMatch.add("(min-width: 768px)", () => {
				const slider = document.querySelector(".tj-scroll-slider");
				if (slider?.children?.length) {
					let panels = gsap.utils.toArray(".tj-scroll-slider-item");
					gsap.to(panels, {
						xPercent: rtlValue(-100) * (panels.length - 1),
						force3D: true,
						ease: "none",
						scrollTrigger: {
							trigger: slider,
							start: "top+=50 top",
							pin: true,
							scrub: 1,
							markers: false,
							end: () => "+=" + slider.offsetWidth,
						},
					});
				}
			});
		}
		
		// Sticky Pannel Animation
		if ($(".tj-sticky-panel").length > 0) {
			mediaMatch.add("(min-width: 1200px)", () => {
				let tl = gsap.timeline();
				let panels = document.querySelectorAll(".tj-sticky-panel"); // likely the selector being obfuscated
				panels.forEach((panel, i) => {
					tl.to(panel, {
						scrollTrigger: {
							trigger: panel,
							pin: panel,
							scrub: 1,
							start: "top-=50 top",
							end: "bottom top",
							endTrigger: ".tj-sticky-panel-container",
							pinSpacing: false,
							markers: false,
						},
					});
				});
			});
		}
		
		function initStickyPanel3Animation() {
			const container = document.querySelector(".tj-sticky-panel-3-container");
			const panels = document.querySelectorAll(".tj-sticky-panel-3");
			if (!container || panels.length === 0) return;
			mediaMatch.add("(min-width: 992px)", () => {
				const startOffset =
				parseInt(getComputedStyle(container).paddingTop) || 0;
				const lastIdx = panels.length - 1;
				const lastPanel = panels[lastIdx];
				const paddingBottom =
				parseInt(getComputedStyle(container).paddingBottom) || 0;
				panels.forEach((panel, i) => {
					gsap.to(panel, {
						scrollTrigger: {
							trigger: panel,
							start: `top-=${startOffset} top`,
							endTrigger: container,
							end: () =>
								`bottom top+=${
								lastPanel.offsetHeight + startOffset + paddingBottom
							}`,
							pin: true,
							pinSpacing: false,
							scrub: true,
							markers: false,
							invalidateOnRefresh: true,
						},
						ease: "circ",
						opacity: i === 0 || i === lastIdx ? 1 : 0.1,
					});
				});
			});
		}
		initStickyPanel3Animation();
		
		// Scroll Progress animation
		function initStickyAndProgress() {
			mediaMatch.add("(min-width: 0)", () => {
				// Sticky panels
				if ($(".tj-sticky-panel-2").length > 0) {
					let tl = gsap.timeline();
					let panels = document.querySelectorAll(".tj-sticky-panel-2");
					
					panels.forEach(panel => {
						tl.to(panel, {
							force3D: true,
							scrollTrigger: {
								trigger: panel,
								pin: panel,
								scrub: 1,
								start: "top top",
								end: "bottom+=120 bottom",
								endTrigger: ".tj-sticky-panel-container-2",
								pinSpacing: false,
								markers: false,
							},
						});
					});
				}
				
				// Scroll Progress animation
				if ($(".tj-progress-item").length > 0) {
					const tjProgressWrapper = document.querySelector(
						".tj-progress-wrapper"
					);
					
					if (tjProgressWrapper?.children?.length) {
						let panels = gsap.utils.toArray(".tj-progress-item");
						let totalPanels = panels.length;
						let scrollProgressItems = gsap.utils.toArray(
							".tj-scroll-progress-item"
						);
						gsap.to(panels, {
							ease: "none",
							scrollTrigger: {
								trigger: tjProgressWrapper,
								start: "top top",
								end: "bottom bottom",
								scrub: 1,
								pin: false,
								onUpdate: self => {
									let progress = self.progress;
									let activeIndex = Math.round(progress * (totalPanels - 1));
									panels.forEach((panel, index) => {
										panel.classList.toggle("active", index === activeIndex);
									});
									scrollProgressItems.forEach((item, index) => {
										item.classList.toggle("active", index === activeIndex);
									});
								},
							},
						});
					}
				}
			});
		}
		
		// Init on load
		initStickyAndProgress();
		
		// Sidebar sticky
		function sidebarStickyController() {
			const containers = document.querySelectorAll(
				".slidebar-stickiy-container"
			);
			if (containers.length) {
				containers.forEach(container => {
					const panels = container.querySelectorAll(".slidebar-stickiy");
					if (panels.length) {
						mediaMatch.add("(min-width: 992px)", () => {
							const startOffset = 30;
							//parseInt(getComputedStyle(container).paddingTop) || 0;
							const lastIdx = panels.length - 1;
							const lastPanel = panels[lastIdx];
							const paddingBottom =
							parseInt(getComputedStyle(container).paddingBottom) || 0;
							panels.forEach((panel, i) => {
								gsap.to(panel, {
									scrollTrigger: {
										trigger: panel,
										start: `top-=${startOffset} top`,
										endTrigger: container,
										end: () =>
											`bottom top+=${
											lastPanel.offsetHeight + startOffset + paddingBottom
										}`,
										pin: true,
										pinSpacing: false,
										scrub: true,
										markers: false,
										invalidateOnRefresh: true,
									},
									ease: "circ",
								});
							});
						});
					}
				});
			}
		}
		sidebarStickyController();
		
		if ($(".zoom-on-scroll").length > 0) {
			mediaMatch.add("(min-width: 0)", () => {
				let zoomElements = document.querySelectorAll(".zoom-on-scroll");
				// Set initial scale
				gsap.set(zoomElements, {
					scale: 0.74,
					transformOrigin: "top center",
				});
				// Animate to scale 1 on scroll
				gsap.to(zoomElements, {
					scale: 1,
					ease: "none",
					scrollTrigger: {
						trigger: ".zoom-on-scroll-wrapper",
						start: "top top",
						end: "top+=30% top",
						scrub: true,
					},
				});
			});
		}
		
		// Arrange on Scroll Animation
		function initArrangeAnim() {
			const panelsContainers = document.querySelectorAll(
				".tj-arrange-container"
			);
			if (panelsContainers?.length) {
				mediaMatch.add("(min-width: 992px)", () => {
					panelsContainers.forEach((panelsContainer, idx) => {
						const panels = panelsContainer.querySelectorAll(".tj-arrange-item");
						
						const startOffset = 50;
						panels.forEach((panel, i) => {
							gsap.from(panel, {
								xPercent: i % 2 === 0 ? rtlValue(-20) : rtlValue(20),
								ease: "none",
								scrollTrigger: {
									trigger: panel,
									start: `top bottom`,
									end: `bottom bottom`,
									pin: false,
									pinSpacing: false,
									scrub: true,
									markers: false,
									invalidateOnRefresh: true,
								},
							});
						});
					});
				});
			}
		}
		initArrangeAnim();
		
		// Arrange on Scroll Animation 2
		function initArrangeAnim2() {
			const panelsContainers = document.querySelectorAll(
				".tj-arrange-container-2"
			);
			if (panelsContainers?.length) {
				mediaMatch.add("(min-width: 992px)", () => {
					panelsContainers.forEach((panelsContainer, idx) => {
						const panels =
						panelsContainer.querySelectorAll(".tj-arrange-item-2");
						const startOffset = 50;
						panels.forEach((panel, i) => {
							gsap.from(panel, {
								xPercent: i % 2 === 0 ? rtlValue(-30) : rtlValue(30),
								ease: "none",
								scrollTrigger: {
									trigger: panel,
									start: `top bottom`,
									end: `${
										i === 0 || i === 2 ? "bottom+=200" : "bottom+=300"
									} bottom`,
									pin: false,
									pinSpacing: false,
									scrub: true,
									markers: false,
									invalidateOnRefresh: true,
								},
							});
						});
					});
				});
			}
		}
		initArrangeAnim2();
		
		// Fade In on Scroll Animation
		function initFadeInRightOnScroll() {
			const panels = document.querySelectorAll(".tj-fadein-right-on-scroll");
			if (panels.length === 0) return;
			
			const startOffset = 50;
			panels.forEach((panel, i) => {
				gsap.set(panel, {
					xPercent: rtlValue(40),
					ease: "none",
				});
				gsap.to(panel, {
					xPercent: 0,
					scrollTrigger: {
						trigger: panel,
						start: `top bottom-=300`,
						end: `bottom bottom-=300`,
						pin: false,
						pinSpacing: false,
						scrub: true,
						markers: false,
						invalidateOnRefresh: true,
					},
				});
			});
		}
		initFadeInRightOnScroll();
		
		/* Text Effect Animation */
		if ($(".text-anim").length) {
			let staggerAmount = 0.02,
			translateXValue = rtlValue(20),
			delayValue = 0.1,
			easeType = "power2.out",
			animatedTextElements = document.querySelectorAll(".text-anim");
			
			animatedTextElements.forEach(element => {
				let animationSplitText = new SplitText(element, {
					type: "chars, words",
				});
				gsap.from(animationSplitText.chars, {
					duration: 1,
					delay: delayValue,
					x: translateXValue,
					autoAlpha: 0,
					stagger: staggerAmount,
					ease: easeType,
					scrollTrigger: { trigger: element, start: "top 85%" },
				});
			});
		}
		
		/* Title Animation */
		if ($(".title-anim").length) {
			let staggerAmount = 0.01,
			delayValue = 0.1,
			easeType = "power1.inout",
			animatedTitleElements = document.querySelectorAll(".title-anim");
			
			animatedTitleElements.forEach(element => {
				let animatedTitleElements = new SplitText(element, {
					types: "lines, words",
				});
				gsap.from(animatedTitleElements.chars, {
					y: "100%",
					duration: 0.5,
					delay: delayValue,
					autoAlpha: 0,
					stagger: staggerAmount,
					ease: easeType,
					scrollTrigger: { trigger: element, start: "top 85%" },
				});
			});
		}
		
		// Marquee slider Js
		if ($(".h5-maquee-slider").length > 0) {
			var swiper = new Swiper(".h5-maquee-slider", {
				slidesPerView: "auto",
				spaceBetween: 30,
				loop: true,
				speed: 5000,
				breakpoints: {
					768: {
						spaceBetween: 35,
					},
					
					1024: {
						spaceBetween: 50,
					},
				},
				allowTouchMove: false,
				autoplay: {
					delay: 1,
					disableOnInteraction: true,
				},
			});
		}
		
		// right swipe
		document.querySelectorAll(".rightSwipeWrap").forEach((wrap, i) => {
			gsap.set(wrap.querySelectorAll(".right-swipe"), {
				transformPerspective: 1200,
				x: "10rem",
				rotateY: -20,
				opacity: 0,
				transformOrigin: "right center",
			});
			gsap.to(wrap.querySelectorAll(".right-swipe"), {
				transformPerspective: 1200,
				x: 0,
				rotateY: 0,
				opacity: 1,
				delay: 0.3,
				ease: "power3.out",
				scrollTrigger: {
					trigger: wrap,
					start: "top 80%",
					id: "rightSwipeWrap-" + i,
					toggleActions: "play none none none",
					// markers: true,
				},
			});
		});
		
		// left swipe
		document.querySelectorAll(".leftSwipeWrap").forEach((wrap, i) => {
			gsap.set(wrap.querySelectorAll(".left-swipe"), {
				transformPerspective: 1200,
				x: "-10rem",
				rotateY: 20,
				opacity: 0,
				transformOrigin: "left center",
			});
			gsap.to(wrap.querySelectorAll(".left-swipe"), {
				transformPerspective: 1200,
				x: 0,
				rotateY: 0,
				opacity: 1,
				delay: 0.4,
				ease: "power3.out",
				scrollTrigger: {
					trigger: wrap,
					start: "top 80%",
					id: "leftSwipeWrap-" + i,
					toggleActions: "play none none none",
					// markers: true,
				},
			});
		});
		
		// Text Highlight
		if ($(".title-highlight").length) {
			const highlightText = new SplitText(".title-highlight", {
				type: "lines",
				linesClass: "line",
			});
			
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: ".title-highlight",
					scrub: 1,
					start: "top 80%",
					end: "bottom center",
				},
			});
			tl.to(".line", {
				"--highlight-offset": "100%",
				stagger: 0.4,
			});
		}
		
		// Images parallax
		gsap.utils.toArray(".img-parallax").forEach(container => {
			const img = container.querySelector("img");
			
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: container,
					scrub: 1,
					pin: false,
				},
			});
			
			tl.fromTo(
				img,
				{
					yPercent: 0,
					ease: "none",
				},
				{
					yPercent: -30,
					ease: "none",
				}
			);
		});
	}
	
	// portfolio tabs
	$(".h6-project .h6-project-item").on("mouseover", function () {
		$(this).addClass("active").siblings().removeClass("active");
	});
	
	// Active on  hover
	if ($(".tj-hover-active-item").length) {
		const allHoverItems = document.querySelectorAll(".tj-hover-active-item");
		allHoverItems.forEach((hoverItem, idx) => {
			hoverItem.addEventListener("mouseenter", function () {
				allHoverItems.forEach((hoverItem2, idx) => {
					hoverItem2?.classList?.remove("active");
				});
				this?.classList?.add("active");
			});
		});
	}
	
	// Hover bg animation
	function hoverWidget_animation() {
		let active_bg = $(".tj-active-bg-wrapper .active-bg");
		let element = $(".tj-active-bg-wrapper .current");
		$(".tj-active-bg-wrapper .tj-active-bg-item").on("mouseenter", function () {
			let e = $(this);
			activeHover(active_bg, e);
		});
		$(".tj-active-bg-wrapper").on("mouseleave", function () {
			element = $(".tj-active-bg-wrapper .current");
			activeHover(active_bg, element);
			element.closest(".tj-active-bg-item").siblings().removeClass("mleave");
		});
		activeHover(active_bg, element);
		function activeHover(active_bg, e) {
			if (!e.length) {
				return false;
			}
			let topOff = e.offset().top;
			let height = e.outerHeight();
			let menuTop = $(".tj-active-bg-wrapper").offset().top;
			e.closest(".tj-active-bg-item").removeClass("mleave");
			e.closest(".tj-active-bg-item").siblings().addClass("mleave");
			active_bg.css({ top: topOff - menuTop + "px", height: height + "px" });
		}
		
		$(".tj-active-bg-wrapper .tj-active-bg-item").on("click", function () {
			$(".tj-active-bg-wrapper .tj-active-bg-item").removeClass("current");
			$(this).addClass("current");
		});
	}
	hoverWidget_animation();
	
	// image slider
	const tjSliderImages = document.querySelectorAll(".tj-image-slider img");
	
	if (tjSliderImages?.length) {
		let index = 0;
		function showNextImage() {
			tjSliderImages.forEach(img => img.classList.remove("active"));
			tjSliderImages[index].classList.add("active");
			index = (index + 1) % tjSliderImages.length;
		}
		
		// Initial display
		showNextImage();
		setInterval(showNextImage, 500);
	}
	
	// Portfolio Filter Js
	function filter_animation() {
		const filterButtons = $(".portfolio-filter .button-group button");
		var element = $(".portfolio-filter .button-group .active");
		if (filterButtons?.length) {
			filterButtons.on("click", function () {
				var e = $(this);
				activeFilterBtn(e);
			});
			activeFilterBtn(element);
		}
	}
	filter_animation();
	
	function activeFilterBtn(e) {
		if (!e.length) {
			return false;
		}
		var leftOff = e.offset().left;
		var width = e.outerWidth();
		var menuLeft = $(".portfolio-filter .button-group").offset().left;
		e.siblings().removeClass("active");
		e.closest("button").siblings().addClass(".portfolio-filter .button-group");
	}
	// Portfolio Filter Js
	if ($(".portfolio-filter-box")?.length) {
		$(".portfolio-filter-box").imagesLoaded(function () {
			var $grid = $(".portfolio-filter-box").isotope({
				// options
				masonry: {
					columnWidth: ".portfolio-filter-box .portfolio-sizer",
					gutter: ".portfolio-filter-box .gutter-sizer",
				},
				itemSelector: ".portfolio-filter-box .portfolio-filter-item",
				percentPosition: true,
			});
			
			// filter items on button click
			$(".filter-button-group").on("click", "button", function () {
				$(".filter-button-group button").removeClass("active");
				$(this).addClass("active");
				
				var filterValue = $(this).attr("data-filter");
				$grid.isotope({ filter: filterValue });
			});
		});
	}
	
	document.getElementById('currentYear').textContent = new Date().getFullYear();
})(jQuery);

$(document).ready(function() {
	$('.form-trigger').click(function() {
		var headingText = $(this).data('heading') || "Book an Appointment Now";
		$('#popupForm .form-column .title').text(headingText);
		
		// Show popup
		$('#popupForm').css('display', 'block');
		$('body').addClass('no-scroll');
	});
	
	// Close popup on 'X' click
	$('.close').click(function() {
		$('#popupForm').css('display', 'none');
		$('body').removeClass('no-scroll');
	});
	
	// Close popup when clicking outside the form
	$(window).click(function(event) {
		if ($(event.target).is('#popupForm')) {
			$('#popupForm').css('display', 'none');
			$('body').removeClass('no-scroll');
		}
	});
});

$(document).ready(function() {
	// Hide the contact container initially
	$('.contact-container').css('opacity', 0);
	
	$(window).scroll(function() {
		if ($(this).scrollTop() > 350) {
			$('.contact-container').css('opacity', 1);
		} else {
			$('.contact-container').css('opacity', 0);
		}
	});
});

// Initialize three separate phone inputs
const initIntlTelInput = (inputId, errorId) => {
	const phoneInput = document.querySelector(`#${inputId}`);
	const errorMsg = document.querySelector(`#${errorId}`);
	
	const iti = window.intlTelInput(phoneInput, {
		utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
		preferredCountries: ['ae'],
		initialCountry: "ae",
		separateDialCode: true
	});
	
	// Return the ITI instance for validation if needed
	return iti;
};

// Initialize all three phone inputs
const iti1 = initIntlTelInput('phone1', 'phone-error1');
const iti2 = initIntlTelInput('phone2', 'phone-error2');
// Form validation for all forms
document.querySelectorAll('.contact__form').forEach(form => {
	form.addEventListener('submit', function(e) {
		e.preventDefault();
		
		const phoneInput = this.querySelector('input[type="tel"]');
		const errorMsg = this.querySelector('.phone-error');
		const iti = window.intlTelInputGlobals.getInstance(phoneInput);
		
		errorMsg.style.display = 'none';
		
		if (phoneInput.value.trim() && iti.isValidNumber()) {
			// Create or find hidden input for full number
			let fullNumberInput = this.querySelector('input[name="full_phone_number"]');
			if (!fullNumberInput) {
				fullNumberInput = document.createElement('input');
				fullNumberInput.type = 'hidden';
				fullNumberInput.name = 'full_phone_number';
				this.appendChild(fullNumberInput);
			}
			
			// Set the full number with country code
			fullNumberInput.value = iti.getNumber();
			
			// Submit the form
			this.submit();
		} else {
			errorMsg.style.display = 'block';
		}
	});
});
