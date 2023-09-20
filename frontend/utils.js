const months = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun",
    "Jul", "Aug", "Sep",
    "Oct", "Nov", "Dec"
];

function sortByDateAndPriority(a, b) {
    const compared = sortByDate(a, b);
    return compared === 0
        ? sortByPriority(a, b)
        : compared;
}

function sortByDate(a, b) {
    if (!a.dueAt && !b.dueAt) {
        return 0;
    } else if (!a.dueAt) {
        return 1;
    } else if (!b.dueAt) {
        return -1;
    } else {
        const d1 = new Date(a.dueAt);
        const d2 = new Date(b.dueAt);
        if (d1 > d2) {
            return 1;
        } else if (d2 > d1) {
            return -1;
        } else {
            return 0;
        }
    }
}

function sortByPriority(a, b) {
    if (a.priority === b.priority) {
        return 0;
    } else if (a.priority && a.priority === "high") {
        return -1;
    } else {
        return 1;
    }
}

function isDueAlready(date) {
    return date && date < Date.now();
}

function formatDate(date) {
    return date
        ? `${months[date.getMonth()]} ${String(date.getDate()).padStart(2, "0")}`
        : "";
}

function createElement(tag, ...classes) {
    const element = document.createElement(tag);
    if (classes) {
        classes.forEach(c => element.classList.add(c));
    }
    return element;
}

function createInput(tag, type, name, ...classes) {
    const element = createElement(tag, ...classes);
    element.setAttribute("type", type);
    element.setAttribute("name", name);
    return element;
}

function withTextContent(element, text) {
    if (text) {
        element.appendChild(document.createTextNode(text));
    }
    return element;
}
