function openPopup(content = "", loadEvent = "") {
	$("html").addClass("hide-all");
	$("#popup").show();
	$("#popup-content").append(content);

	loadEvent && $(document).trigger(loadEvent, [$(content)]);
}

async function closePopup(useTransition = true) {
	if (useTransition) {
		$("#popup").addClass("out");
		await delay(300);
		$("#popup").removeClass("out");
	}

	$("#popup").hide();
	$("html").removeClass("hide-all");
	$("#popup-content").find("*").off();
	$("#popup-content").empty();
}

closePopup(false);

$("#popup-close-button").on("click", function () {
	closePopup();
});

$("#products-container").on("click", "#create-new-product-item-button", function () {
	openPopup(newProductPopup(), "productPopupLoaded");
});
$("#members-container").on("click", "#create-new-member-item-button", function () {
	openPopup(newMemberPopup(), "memberPopupLoaded");
});
$("#reqAuthBtn").on("click", function () {
	// check if the button text is "Sign in" or "Sign out"
	const text = $("#reqAuthBtn").text();
	if (text === "Sign in") {
		openPopup(onUserSignIn(), "authPopupLoaded");
	} else if (text === "Sign out") {
		signOutUser();
	}
});

/* $("#openReg").on("click", function () {
	openPopup(onUserSignUp(), "regPopupLoaded");
});
 */
