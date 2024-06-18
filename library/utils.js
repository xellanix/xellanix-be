function isNullOrEmpty(value) {
	// Check if the value is null or undefined
	if (value == null) {
		return true;
	}

	// Check if the value is an object or a function, and if it has a length property that is equal to 0
	if (
		(typeof value === "object" || typeof value === "function") &&
		"length" in value &&
		value.length === 0
	) {
		return true;
	}

	// Check if the value is an object and has no own properties
	if (typeof value === "object" && Object.keys(value).length === 0) {
		return true;
	}

	// If none of the above conditions are met, return false
	return false;
}

let isNullEntries = function (entries) {
	for (const [name, value] of Object.entries(entries)) {
		if (isNullOrEmpty(value)) {
			return {
				entry: name,
				readableEntry: name.replace("_", " "),
			};
		}
	}
};

let utils = { isNullEntries, isNullOrEmpty };

module.exports = utils;
