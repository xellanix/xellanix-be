/**
 *
 * @param {string} status information, warning, success, error
 * @param {string} content
 * @returns
 */
function infoBox(status = "information", content = "") {
	const statusId =
		status === "error" ? 3 : status === "success" ? 2 : status === "warning" ? 1 : 0;

	const final = `
        <div
			class="info-box ${status}"
			style="
				background-color:
					${
						statusId === 1
							? "var(--warning-background-color)"
							: statusId === 2
							? "var(--success-background-color)"
							: statusId === 3
							? "var(--error-background-color)"
							: "var(--information-background-color)"
					};">
			<div
				class="info-box-icon"
				style="
					background-color:
						${
							statusId === 1
								? "var(--warning-color)"
								: statusId === 2
								? "var(--success-color)"
								: statusId === 3
								? "var(--error-color)"
								: "var(--information-color)"
						};">
				${
					statusId === 1
						? `<svg  xmlns="http://www.w3.org/2000/svg"  width="14"  height="14"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2.5"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-exclamation-mark"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 19v.01" /><path d="M12 15v-10" /></svg>`
						: statusId === 2
						? `<svg  xmlns="http://www.w3.org/2000/svg"  width="14"  height="14"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2.5"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-check"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l5 5l10 -10" /></svg>`
						: statusId === 3
						? `<svg  xmlns="http://www.w3.org/2000/svg"  width="14"  height="14"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2.5"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>`
						: `<svg  xmlns="http://www.w3.org/2000/svg"  width="14"  height="14"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2.5"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-question-mark"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 8a3.5 3 0 0 1 3.5 -3h1a3.5 3 0 0 1 3.5 3a3 3 0 0 1 -2 3a3 4 0 0 0 -2 4" /><path d="M12 19l0 .01" /></svg>`
				}
			</div>
			${content}
		</div>
    `;

	return final;
}
