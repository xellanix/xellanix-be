function stickHeader() {
	const observer = new IntersectionObserver((entries) => {
		$("header").toggleClass("on-stick", !entries[0].isIntersecting);
	});

	observer.observe($("#header-stick-watcher")[0]);
}
stickHeader();

$("nav").ready(function (e) {
	$("nav").empty();

	// Maximum item can be shown currently only 5
	$("main > section[data-insert-to-navbar-menu]").each(function () {
		const id = substringTo($(this).attr("id"), "-section");
		const itemName = toCapitalizeEachWord(id, "-");

		$("nav").append(
			`<div class="nav-item-wrapper ${id}-section-class"><div class="nav-item-indicator"></div><a href="#${id}-section">${itemName}</a></div>`
		);
	});

	$(".nav-item-wrapper > a").click(function () {
		//$("#hamburger-button-lottie").trigger("click");
		console.log("clicked");
		if ($("#navigation-small-hamburger").css("display") !== "none") {
			$("#hamburger-button-lottie #animation").click();
			console.log("visible");
		} else console.log("hidden");
	});
});

function changeSelectedNavItem() {
	function getLastVisibleSection(scrollDirection = 0) {
		let lastVisibleSection = null;
		let lastVisibleSectionTop = 0;

		$("main > section[data-affect-to-navbar-menu]").each(function () {
			const section = this;

			function getByDirection(topr, bottomr) {
				const sectionHeight = bottomr - topr;
				const minVisibleHeight =
					$(section).data("affect-to-navbar-menu") ===
					"products-section"
						? 0.5
						: 0.3;
				const visibleThreshold = sectionHeight * minVisibleHeight;

				//(topr >= 0 && bottomr - visibleThreshold <= window.innerHeight)
				const isVisible =
					topr + visibleThreshold <= window.innerHeight &&
					bottomr >= visibleThreshold;

				if (
					isVisible &&
					(topr >= lastVisibleSectionTop ||
						lastVisibleSection === null)
				) {
					lastVisibleSectionTop = topr;
					lastVisibleSection = section;
				}
			}

			const rect = section.getBoundingClientRect();
			getByDirection(rect.top, rect.bottom);
			if (scrollDirection === 0) getByDirection(rect.top, rect.bottom);
			if (scrollDirection === 1) getByDirection(rect.bottom, rect.top);
		});

		return lastVisibleSection;
	}

	function setStyleToNavBarItem(scrollDirection = 0) {
		const lastVisibleSection = getLastVisibleSection(scrollDirection);

		if (lastVisibleSection) {
			const id = $(lastVisibleSection).data("affect-to-navbar-menu");
			$(`.nav-item-wrapper`).removeClass("active");
			$(`.nav-item-wrapper.${id}-class`).addClass("active");
		}
	}

	let lastScrollTop = 0;

	$(window).ready(setStyleToNavBarItem);
	$(window).scroll(function (e) {
		const st = $(this).scrollTop();
		if (st > lastScrollTop) {
			// downscroll code
			setStyleToNavBarItem(0);
		} else {
			// upscroll code
			setStyleToNavBarItem(1);
		}
		lastScrollTop = st;
	});
}
changeSelectedNavItem();

$("#hamburger-button-lottie").on("click", function () {
	$("header").toggleClass("hambar-opened");
	$("html").toggleClass("no-scroll");
});
