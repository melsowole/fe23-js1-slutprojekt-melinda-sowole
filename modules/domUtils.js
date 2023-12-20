export const DOM = {
	create,
	createAndAppend,
};

function create(tagName, classNames, textContent) {
	const element = document.createElement(tagName);

	if (classNames) {
		if (typeof classNames == "string") {
			const className = classNames;
			classNames = [className];
		}

		for (const className of classNames) {
			element.classList.add(className);
		}
	}

	if (textContent) {
		element.textContent = textContent;
	}

	return element;
}

function createAndAppend(parentContainer, tagName, classNames, textContent) {
	const element = create(tagName, classNames, textContent);

	parentContainer.append(element);

	return element;
}
