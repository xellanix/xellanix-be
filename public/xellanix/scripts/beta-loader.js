function fetchProducts() {
	// Send GET request to get json value

	$.ajax({
		type: "GET",
		url: "http://localhost:3000/api/da24dea7-d4ce-4e31-a531-96d6c466ea38",
		success: function (items) {
			/*
			{
				product_id: row.product_id,
				access_type: row.access_type
			}
			 */

			items.forEach((item) => {
				if (item.access_type === "user") {
					$("#products-container").append(`<div class="product-item">
						<h3>${item.product_name}</h3>
						<p>${item.description}</p>

						<div class="vertical-layout flex-no-gap">
                            <div class="button accent flex-self-center">
                                <a href="${item.learn_link}" target="_blank" tabindex="-1">Learn More</a>
                            </div>
                            <div class="horizontal-layout flex-no-vgap flex-align-center" style="column-gap: 8px !important;">
								<button type="button" data-product-ref="${item.product_id}" class="button icon accent flex-self-center product-item-edit" tabindex="-1">
									<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.8"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-edit"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" /></svg>
								</button>
								<button type="button" data-product-ref="${item.product_id}" class="button icon error flex-self-center product-item-delete" tabindex="-1">
									<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.8"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
								</button>
                            </div>
                        </div>
					</div>`);
				} else if (item.access_type === "admin" || item.access_type === "superadmin") {
					$("#products-container")
						.append(`<div id="${item.product_name}" class="product-item special-item">
						<h3>${item.description}</h3>
						<img src="assets/product-new-item-icon.svg" alt="${item.description} Icon">
					</div>`);
				}
			});
		},
		error: function (xhr, status, error) {
			// Handle error
			let errorCode = xhr.status;
			let errorText = xhr.statusText;
			let errorMessage = `<span><strong>Error ${errorCode}</strong>: ${errorText}</span>`;

			$("#new-product-error-wrapper").append(infoBox("error", errorMessage));
			$("#new-product-error-wrapper").show();
		},
	});
}

function fetchMembers() {
	// Send GET request to get json value

	$.ajax({
		type: "GET",
		url: "http://localhost:3000/api/2410fb2e-bd08-4678-be1b-c05ebb13a5c1",
		success: function (items) {
			/*
			{
				member_id: row.member_id,
				access_type: row.access_type,
			}
			 */

			items.forEach((item) => {
				if (item.access_type === "user") {
					$("#members-container").append(`<div class="team-member-item">
						<img src="${item.member_photo}" alt="${item.member_name} Picture">
						<div class="vertical-layout">
							<h3>${item.member_name}</h3>
							<p>${item.member_role}</p>
						</div>
						<div class="horizontal-layout flex-no-vgap flex-align-center" style="column-gap: 8px !important;">
							<button type="button" data-member-ref="${item.member_id}" class="button icon accent flex-self-center member-edit" tabindex="-1">
								<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.8"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-edit"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" /></svg>
							</button>
							<button type="button" data-member-ref="${item.member_id}" class="button icon error flex-self-center member-delete" tabindex="-1">
								<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.8"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
							</button>
                        </div>
					</div>`);
				} else if (item.access_type === "admin" || item.access_type === "superadmin") {
					$("#members-container")
						.append(`<div id="${item.member_name}" class="product-item special-item">
                        <h3>${item.member_role}</h3>
                        <img src="assets/product-new-item-icon.svg" alt="${item.member_role} Icon">
                    </div>`);
				}
			});
		},
		error: function (xhr, status, error) {
			// Handle error
			let errorCode = xhr.status;
			let errorText = xhr.statusText;
			let errorMessage = `<span><strong>Error ${errorCode}</strong>: ${errorText}</span>`;

			$("#new-product-error-wrapper").append(infoBox("error", errorMessage));
			$("#new-product-error-wrapper").show();
		},
	});
}

fetchProducts();
fetchMembers();
