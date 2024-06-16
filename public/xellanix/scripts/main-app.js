function getOriginUrl() {
	const url = window.location.origin;

	return url;
}

const basePath = getOriginUrl();

function isAvailable(value = "") {
	if (typeof value === "string" && value.length === 0) return false;
	else if (value === null) return false;
	else return true;
}

function substringTo(str = "", subTo = "") {
	if (!isAvailable(str)) return null;

	const lastIndex = str.indexOf(subTo);
	if (lastIndex !== -1) {
		return str.substring(0, lastIndex);
	} else {
		return str;
	}
}

function toCapitalizeEachWord(str = "", separator = " ", joinDelimiter = " ") {
	return str
		.split(separator)
		.map((word) => {
			return word[0].toUpperCase() + word.substring(1).toLowerCase();
		})
		.join(joinDelimiter);
}

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

function retrieveFormData(form) {
	return new FormData(form);
}

function retrieveFormEntries(form) {
	const entries = Object.fromEntries(retrieveFormData(form).entries());
	return entries;
}

async function convertImageToBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = function (event) {
			resolve(event.target.result); // Extract base64 data
		};
		reader.onerror = function (error) {
			reject(error);
		};
		reader.readAsDataURL(file);
	});
}
