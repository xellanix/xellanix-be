let isNullEntries = function (entries) {
	for (const [name, value] of Object.entries(entries)) {
		if (value || value.length === 0) {
			return {
				entry: name,
				readableEntry: name.replace("_", " "),
			};
		}
	}
};

let utils = { isNullEntries };

module.exports = utils;
