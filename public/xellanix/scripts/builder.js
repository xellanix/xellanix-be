function htmlBuilder(
	tagJson = {
		tag: "div",
		id: "",
		classes: [],
		content: "",
		children: [],
		attrs: {},
		addIf: true,
	}
) {
	const { tag, id, classes, content, children, attrs, addIf } = tagJson;
	if (typeof addIf === "boolean" && !addIf) return "";

	const idStr = id ? ` id="${id}"` : "";
	const clsStr = classes?.length > 0 ? ` class="${classes.join(" ")}"` : "";
	const contentStr = content ? content : "";
	const attrsStr = attrs
		? " " +
		  Object.entries(attrs)
				?.map(([key, value]) => `${key}="${value}"`)
				.join(" ")
		: "";
	const childrenStr = children?.map((child) => htmlBuilder(child)).join("") || "";

	const result = `<${tag}${idStr}${clsStr}${attrsStr}>${contentStr}${childrenStr}</${tag}>`;
	return result;
}
