function onMemberNameChange() {
	const newVal = $("#member_name").val() || "Default Name";
	$("#member-preview-name").text(newVal);
	$("#member-preview-img").attr("alt", `${newVal} Picture`);
}
function onMemberRoleChange() {
	const newVal = $("#member_role").val() || "User";
	$("#member-preview-role").text(newVal);
}
function onMemberImgChange(input) {
	if (input.files && input.files[0]) {
		convertImageToBase64(input.files[0]).then((data) => {
			$("#member-preview-img").attr("src", data || "/xellanix/assets/photo-sample.svg");
		});
	}
}
async function onMemberSubmit(event) {
	event.preventDefault();

	const submitBtn = $(event.target).find("button[type='submit']");
	const inputs = $("#popup :input");

	let final = retrieveFormEntries(event.target);
	submitBtn.text("Adding...");
	inputs.prop("disabled", true);

	const ext = final.member_img.name.split(".").pop();
	final.member_img = await convertImageToBase64(final.member_img);
	final.member_img_ext = ext;

	const accessToken = await retrieveUsableToken();
	const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

	ajaxRequest(headers, {
		type: "POST",
		url: `${basePath}/api/23b9d3e8-ae4d-4420-b136-ea905f7844ed`,
		data: JSON.stringify(final),
		contentType: "application/json",
		success: async function (data) {
			// Do something with the response
			console.log("success: " + data.message);
			$("#new-member-error-wrapper").find("*").off();
			$("#new-member-error-wrapper").empty();
			$("#new-member-error-wrapper").append(
				infoBox("success", `<span><strong>Success </strong>: ${data.message}</span>`)
			);
			$("#new-member-error-wrapper").show();

			submitBtn.text("Member Added");

			await delay(2000);
			location.reload();
		},
		error: function (xhr, status, error) {
			// Handle error
			let errorCode = xhr.status;
			let errorText = JSON.parse(xhr.responseText)?.thrownMessage || xhr.statusText;
			let errorMessage = `<span><strong>Error ${errorCode}</strong>: ${errorText}</span>`;

			$("#new-member-error-wrapper").find("*").off();
			$("#new-member-error-wrapper").empty();
			$("#new-member-error-wrapper").append(infoBox("error", errorMessage));
			$("#new-member-error-wrapper").show();

			submitBtn.text("Add This Member");
			inputs.prop("disabled", false);
		},
	});

	return false;
}

async function onMemberUpdatedSubmit(event) {
	event.preventDefault();

	const submitBtn = $(event.target).find("button[type='submit']");
	const inputs = $("#popup :input");

	let final = retrieveFormEntries(event.target);
	inputs.prop("disabled", true);
	submitBtn.text("Updating...");

	const ext = final.member_img.name.split(".").pop();
	final.member_img = await convertImageToBase64(final.member_img);
	final.member_img_ext = ext;

	const memberRef = submitBtn.data("memberRef");

	const accessToken = await retrieveUsableToken();
	const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

	// Send the "final" data to backend
	ajaxRequest(headers, {
		type: "POST",
		url: `${basePath}/api/2a4bb58c-3fbd-429a-ad26-ced47bae82a7/${memberRef}`,
		data: JSON.stringify(final),
		contentType: "application/json",
		success: async function (data) {
			// Do something with the response
			console.log("success: " + data.message);
			$("#update-member-error-wrapper").find("*").off();
			$("#update-member-error-wrapper").empty();
			$("#update-member-error-wrapper").append(
				infoBox("success", `<span><strong>Success </strong>: ${data.message}</span>`)
			);
			$("#update-member-error-wrapper").show();

			submitBtn.text("Member Updated");

			await delay(2000);
			location.reload();
		},
		error: function (xhr, status, error) {
			// Handle error
			let errorCode = xhr.status;
			let errorText = JSON.parse(xhr.responseText)?.thrownMessage || xhr.statusText;
			let errorMessage = `<span><strong>Error ${errorCode}</strong>: ${errorText}</span>`;

			$("#update-member-error-wrapper").find("*").off();
			$("#update-member-error-wrapper").empty();
			$("#update-member-error-wrapper").append(infoBox("error", errorMessage));
			$("#update-member-error-wrapper").show();

			submitBtn.text("Update This Member");
			inputs.prop("disabled", false);
		},
	});

	return false;
}

$(document).on("memberPopupLoaded", function (event, element) {
	$("#new-member-error-wrapper").hide();
});
$(document).on("updateMemberPopupLoaded", function (event, element) {
	$("#update-member-error-wrapper").hide();
});
$(document).on("deleteMemberPopupLoaded", function (event, element) {
	$("#delete-member-error-wrapper").hide();

	$("#confirm-delete-member").on("click", async function (e) {
		const btn = $(e.currentTarget);
		const memberRef = btn.data("memberRef");

		btn.prop("disabled", true);
		btn.text("Deleting...");

		const accessToken = await retrieveUsableToken();
		const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

		ajaxRequest(headers, {
			type: "GET",
			url: `${basePath}/api/bd7d187c-0fe5-4887-870c-81aa2b6a4152/${memberRef}`,
			success: function (data) {
				// Do something with the response
				console.log("success: " + data.message);
				$("#delete-member-error-wrapper").find("*").off();
				$("#delete-member-error-wrapper").empty();
				$("#delete-member-error-wrapper").append(
					infoBox("success", `<span><strong>Success </strong>: ${data.message}</span>`)
				);
				$("#delete-member-error-wrapper").show();

				btn.text("Deleted");

				location.reload();
			},
			error: function (xhr, status, error) {
				// Handle error
				let errorCode = xhr.status;
				let errorText = JSON.parse(xhr.responseText)?.thrownMessage || xhr.statusText;
				let errorMessage = `<span><strong>Error ${errorCode}</strong>: ${errorText}</span>`;

				$("#delete-member-error-wrapper").find("*").off();
				$("#delete-member-error-wrapper").empty();
				$("#delete-member-error-wrapper").append(infoBox("error", errorMessage));
				$("#delete-member-error-wrapper").show();

				btn.text("Delete");
				btn.prop("disabled", false);
			},
		});
	});

	$("#cancel-delete-member").on("click", function () {
		closePopup();
	});
});

$("#members-container").on("click", ".member-edit", async function (event) {
	const memberRef = $(event.currentTarget).data("memberRef");

	const accessToken = await retrieveUsableToken();
	const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

	ajaxRequest(headers, {
		type: "GET",
		url: `${basePath}/api/9cb41cdb-70fb-4957-984d-d649c39130a1/${memberRef}`,
		success: async function (data) {
			// Do something with the response
			memberRef &&
				openPopup(
					updateMemberPopup(
						memberRef,
						data.member_name,
						data.member_role,
						data.member_photo
					),
					"updateMemberPopupLoaded"
				);
		},
		error: function (xhr, status, error) {
			// Handle error
			let errorCode = xhr.status;
			let errorText = JSON.parse(xhr.responseText)?.thrownMessage || xhr.statusText;
			let errorMessage = `Error ${errorCode}: ${errorText}`;

			alert(errorMessage);
		},
	});
});

$("#members-container").on("click", ".member-delete", function (event) {
	const memberRef = $(event.currentTarget).data("memberRef");
	memberRef && openPopup(deleteMemberPopup(memberRef), "deleteMemberPopupLoaded");
});

function newMemberPopup() {
	const fields = [
		{
			name: "member_name",
			type: "text",
			placeholder: "The member name",
			label: "Name",
			maxlength: 50,
			onInput: "onMemberNameChange",
			emptyError: "Enter the member name",
			patternError: "Member name is invalid",
		},
		{
			name: "member_role",
			type: "text",
			placeholder: "The member role",
			label: "Role",
			maxlength: 50,
			onInput: "onMemberRoleChange",
			emptyError: "Enter the member role",
			patternError: "Member role is invalid",
		},
		{
			name: "member_img",
			type: "file_picker",
			placeholder: "",
			label: "Member Picture",
			onInput: "onMemberImgChange",
			emptyError: "Enter the image link",
			patternError: "Image link is invalid",
		},
	];

	const final = `
    <div class="horizontal-container-layout flex-align-center">
        <div class="vertical-layout flex-align-center" style="flex: 1 1 0">
            <h2 class="text-align-center">Add a New Member</h2>
            <div id="new-member-error-wrapper" class="wrapper-only" style="align-self: stretch"></div>
            <form
                id="new-member-form"
                class="vertical-layout flex-self-init flex-align-center"
                style="margin-top: var(--section-gap-vertical)"
                onsubmit="return onMemberSubmit(event)"
            >
                ${fields.map((field) => inputField(field)).join("")}
                <button
                    type="submit"
                    class="button accent flex-self-center"
                    style="margin-top: var(--section-gap-vertical)"
                >
                    Add This Member
                </button>
            </form>
        </div>
        <div class="vertical-layout flex-align-center" style="position: sticky; top: 0; align-self: flex-start; flex: 0 1 0;">
            <h4 class="text-align-center">Preview</h4>
            <div class="team-member-item text-align-center">
                <img id="member-preview-img" src="/xellanix/assets/photo-sample.svg" alt="Default Name Picture">
                <div class="vertical-layout">
                    <h3 id="member-preview-name">Default Name</h3>
                    <p id="member-preview-role">User</p>
                </div>
            </div>
        </div>
    </div>
    `;

	return final;
}

function updateMemberPopup(memberRef, memberName, memberRole, memberPhoto) {
	const fields = [
		{
			name: "member_name",
			value: memberName,
			type: "text",
			placeholder: "The member name",
			label: "Name",
			maxlength: 50,
			onInput: "onMemberNameChange",
			emptyError: "Enter the member name",
			patternError: "Member name is invalid",
		},
		{
			name: "member_role",
			value: memberRole,
			type: "text",
			placeholder: "The member role",
			label: "Role",
			maxlength: 50,
			onInput: "onMemberRoleChange",
			emptyError: "Enter the member role",
			patternError: "Member role is invalid",
		},
		{
			name: "member_img",
			type: "file_picker",
			placeholder: "",
			label: "Member Picture",
			onInput: "onMemberImgChange",
			emptyError: "Enter the image link",
			patternError: "Image link is invalid",
			isOptional: true,
		},
	];

	const final = `
    <div class="horizontal-container-layout flex-align-center">
        <div class="vertical-layout flex-align-center" style="flex: 1 1 0">
            <h2 class="text-align-center">Edit Member: #${memberRef}</h2>
            <div id="update-member-error-wrapper" class="wrapper-only" style="align-self: stretch"></div>
            <form
                id="update-member-form"
                class="vertical-layout flex-self-init flex-align-center"
                style="margin-top: var(--section-gap-vertical)"
                onsubmit="return onMemberUpdatedSubmit(event)"
            >
                ${fields.map((field) => inputField(field)).join("")}
                <button
                    type="submit"
                    class="button accent flex-self-center"
                    style="margin-top: var(--section-gap-vertical)"
					data-member-ref="${memberRef}"
                >
                    Update This Member
                </button>
            </form>
        </div>
        <div class="vertical-layout flex-align-center" style="position: sticky; top: 0; align-self: flex-start; flex: 0 1 0;">
            <h4 class="text-align-center">Preview</h4>
            <div class="team-member-item text-align-center">
                <img id="member-preview-img" src="${memberPhoto}" alt="${memberName} Picture">
                <div class="vertical-layout">
                    <h3 id="member-preview-name">${memberName}</h3>
                    <p id="member-preview-role">${memberRole}</p>
                </div>
            </div>
        </div>
    </div>
    `;

	return final;
}

function deleteMemberPopup(memberRef) {
	const final = `
    <div class="horizontal-container-layout flex-align-center">
        <div class="vertical-layout flex-align-center" style="flex: 1 1 0">
            <h2 class="text-align-center">Delete Member: #${memberRef}</h2>
            <div id="delete-member-error-wrapper" class="wrapper-only" style="align-self: stretch"></div>
            
			<h4 style="margin-top: var(--section-gap-vertical); font-weight: 500;" class="text-align-center">Are you sure want to delete this member?</h4>
			<div class="horizontal-layout flex-align-center" style="margin-top: var(--section-gap-vertical); column-gap: 8px !important;">
				<button type="button" id="confirm-delete-member" class="button error flex-self-stretch" style="flex: 1 1 0" data-member-ref="${memberRef}">Delete</button>
				<button type="button" id="cancel-delete-member" class="button flex-self-stretch" style="flex: 1 1 0">Cancel</button>
			</div>
        </div>
    </div>
    `;

	return final;
}
