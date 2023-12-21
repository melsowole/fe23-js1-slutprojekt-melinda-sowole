export const dom = {
	create,
	createAndAppend,
};

function create(tagName, classNames, textContent) {
	const element = createElement(tagName);

	if (classNames) {
		addClasses(element, classNames);
	}

	if (textContent) {
		addContent(element, textContent);
	}

	return element;
}

function createElement(tagName) {
	return document.createElement(tagName);
}

function addClasses(element, classNames) {
	if (typeof classNames == "string") {
		const className = classNames;
		classNames = [className];
	}

	for (const className of classNames) {
		element.classList.add(className);
	}
}

function addContent(element, textContent) {
	if (textContent instanceof Array) {
		const wrapper = createElement("div");
		element.append(wrapper);

		for (const text of textContent) {
			const p = createElement("p");
			p.textContent = text;
			wrapper.append(p);

			console.log(text);
		}
	} else {
		element.innerText = textContent;
	}
}

function createAndAppend(parentContainer, tagName, classNames, textContent) {
	const element = create(tagName, classNames, textContent);

	parentContainer.append(element);

	return element;
}
