$(document).ready(function () {
	$("#openPopup").click(function () {
		if ($("#openPopup").text() === "Sign In") {
			onSignInSubmit();
		} else {
			signOutUser();
		}
	});
});

function onSignInSubmit(event) {
	event.preventDefault();

	const submitBtn = $(event.target).find("button[type='submit']");
	const inputs = $("#popup :input");

	const final = retrieveFormEntries(event.target);

	inputs.prop("disabled", true);
	submitBtn.text("Signing In...");

	// Send the "final" data to backend
	ajaxRequest(
		{},
		{
			type: "POST",
			url: `${basePath}/auth`,
			data: JSON.stringify(final),
			contentType: "application/json",
			xhrFields: {
				withCredentials: true, // Include cookies in the request
			},
			success: async function (data) {
				// Do something with the response
				localStorage.setItem("refreshToken", data.refreshToken);

				$("#user-signin-error-wrapper").find("*").off();
				$("#user-signin-error-wrapper").empty();
				$("#user-signin-error-wrapper").append(
					infoBox("success", `<span><strong>Success </strong>: ${data.message}</span>`)
				);
				$("#user-signin-error-wrapper").show();

				submitBtn.text("Sign In Successfully");

				await delay(2000);
				location.reload();
			},
			error: function (xhr, status, error) {
				// Handle error
				let errorCode = xhr.status;
				let errorText = xhr.statusText;
				console.log(JSON.stringify(xhr));
				if (xhr.responseJSON && xhr.responseJSON.message) {
					errorText = xhr.responseJSON.message;
				}
				let errorMessage = `<span><strong>Error ${errorCode}</strong>: ${errorText}</span>`;

				$("#user-signin-error-wrapper").find("*").off();
				$("#user-signin-error-wrapper").empty();
				$("#user-signin-error-wrapper").append(infoBox("error", errorMessage));
				$("#user-signin-error-wrapper").show();

				submitBtn.text("Sign In");
				inputs.prop("disabled", false);
			},
		}
	);
	return false;
}

$(document).on("authPopupLoaded", function (event, element) {
	$("#user-signin-error-wrapper").hide();
});

function onUserSignIn() {
	const fields = [
		{
			name: "email",
			type: "email",
			placeholder: "Input your email",
			label: "Email",
			emptyError: "Please enter your email",
			patternError: "Email not found",
		},
		{
			name: "password",
			type: "password",
			placeholder: "Input your password",
			label: "Password",
			emptyError: "Please enter your password",
			patternError: "Wrong password",
		},
	];

	const final = `
    <div class="horizontal-container-layout flex-align-center">
        <div class="vertical-layout flex-align-center" style="flex: 1 1 0">
			<h2 class="text-align-center">Sign in to Xellanix</h2>
            <div id="user-signin-error-wrapper" class="wrapper-only" style="align-self: stretch"></div>
			<form
                id="signin-form"
                class="vertical-layout flex-self-init flex-align-center"
                onsubmit="return onSignInSubmit(event)"
            >
                ${fields.map((field) => inputField(field)).join("")}
                <button
                    type="submit"
                    class="button accent flex-self-center"
                    style="margin-top: var(--section-gap-vertical)"
                >
                    Sign In
                </button>
            </form>
        </div>
    </div>
    `;

	return final;
}
/* 
$(document).on("regPopupLoaded", function (event, element) {
	$("#user-signin-error-wrapper").hide();
});

function onUserSignUp() {
	const fields = [
		{
			name: "username",
			type: "text",
			placeholder: "Input your username",
			label: "Username",
			onInput: "onUsername",
			emptyError: "Please enter your username",
			patternError: "Username is invalid",
		},
		{
			name: "email",
			type: "text",
			placeholder: "Input your email",
			label: "Email",
			onInput: "onEmail",
			emptyError: "Please enter your email",
			patternError: "Email is invalid",
		},
		{
			name: "password",
			type: "text",
			placeholder: "Input your password",
			label: "Password",
			onInput: "onPassword",
			emptyError: "Please enter your password",
			patternError: "Password is invalid",
		},
		{
			name: "confirm_password",
			type: "text",
			placeholder: "Re-input your password",
			label: "Confirm Password",
			onInput: "onConfirmPassword",
			emptyError: "Please re-input your password",
			patternError: "Password and Confirm Password does not match",
		},
	];

	const final = `
    <div class="horizontal-container-layout flex-align-center">
        <div class="vertical-layout flex-align-center" style="flex: 1 1 0">
            <h2 class="text-align-center">Register</h2>
            <form
                id="signup-form"
                class="vertical-layout flex-self-init flex-align-center"
                onsubmit="return onSignUpSubmit(event)"
            >
                ${fields.map((field) => inputField(field)).join("")}
                <button
                    type="submit"
                    class="button accent flex-self-center"
                    style="margin-top: var(--section-gap-vertical)"
                >
                    Register
                </button>
            </form>
        </div>
        `;
	return final;
}
*/

function signOutUser() {
	const refreshToken = localStorage.getItem("refreshToken");
	if (!refreshToken) {
		alert("Already signed out");
		location.reload();
	}

	ajaxRequest(
		{
			Authorization: `Bearer ${refreshToken}`,
		},
		{
			type: "DELETE",
			url: `${basePath}/auth/signout/`,
			success: async function (data) {
				console.log("Signed out successfully: " + data.message);

				localStorage.removeItem("refreshToken");
				sessionStorage.removeItem("accessToken");
				sessionStorage.removeItem("exp");

				location.reload();
			},
			error: function (xhr, status, error) {
				let errorCode = xhr.status;
				let errorText = xhr.statusText;
				let errorMessage = `Error ${errorCode}: ${errorText}`;

				alert(errorMessage);
			},
		}
	);
}
