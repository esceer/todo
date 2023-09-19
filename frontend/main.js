// const { default: axios } = require("axios");

let tasks;

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

setup();

function setup() {
    const openDialogBtn = document.querySelector('.button--open-dialog');
    openDialogBtn.addEventListener('click', openDialog);

    const closeBtn = document.querySelector('.button--close');
    closeBtn.addEventListener('click', closeDialog);

    const form = document.querySelector('.dialog__form');
    form.addEventListener('submit', createTask);
    form.addEventListener('submit', closeDialog);

    refreshTaskList();
}

function refreshTaskList() {
    fetchTasks()
        .then(() => showTasks())
        .catch(error => console.error(error));
}

async function fetchTasks() {
    const response = await axios.get('http://celosnext.com:8081/todo/tasks');
    response.data.sort(sortByDateAndPriority);
    tasks = response.data;
}

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
    } else if (a.priority && a.priority === 'high') {
        return -1;
    } else {
        return 1;
    }
}

function showTasks() {
    const main = document.querySelector('.tasks');
    main.replaceChildren()
    tasks.forEach(task => {
        let dueAt = task.dueAt ? new Date(task.dueAt) : task.dueAt;
        main.appendChild(
            createNewTaskElement(task.id, task.title, task.priority, dueAt)
        );
    });
}

function createNewTaskElement(id, title, priority, dueAt) {
    const taskE = createElement('div', 'task');
    taskE.appendChild(withTextContent(createElement('span', 'task__title'), title));
    taskE.appendChild(withTextContent(createElement('span', 'task__due-at', isDueAlready(dueAt) ? 'task--due-already' : 'task--due-in-future'), formatDate(dueAt)));

    delBtn = createElement('button', 'button');
    delBtn.appendChild(createElement('img', 'button__img--delete-task'));
    delBtn.taskId = id;
    delBtn.addEventListener('click', deleteTask);
    taskE.appendChild(delBtn);

    if (priority && priority.toLowerCase() === 'high') {
        taskE.classList.add('task--priority-high');
    }

    return taskE;
}

function isDueAlready(date) {
    return date && date < Date.now();
}

function formatDate(date) {
    return date
        ? `${months[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')}`
        : '';
}

function createElement(tag, ...classes) {
    const element = document.createElement(tag);
    if (classes) {
        classes.forEach(c => element.classList.add(c));
    }
    return element;
}

function withTextContent(element, text) {
    if (text) {
        element.appendChild(document.createTextNode(text));
    }
    return element;
}

function openDialog() {
    const screen = document.querySelector('.container');
    screen.classList.toggle('screen-blurred', true);
    const modal = document.querySelector('dialog');
    modal.showModal();
}

function closeDialog() {
    const screen = document.querySelector('.container');
    screen.classList.toggle('screen-blurred', false);
    const modal = document.querySelector('dialog');
    modal.close();
}

async function createTask(event) {
    event.preventDefault();

    const title = event.target.title.value;
    const detail = event.target.detail.value;
    const priority = event.target.priority.value;
    const dueAt = event.target.dueAt.value;

    let newTask = {
        'title': title,
    };
    if (detail) {
        newTask.detail = detail;
    }
    if (priority) {
        newTask.priority = priority;
    }
    if (dueAt) {
        newTask.dueAt = dueAt;
    }

    await axios.post('http://celosnext.com:8081/todo/tasks', newTask)
        .then(() => refreshTaskList())
        .catch(error => console.error(error));

    event.target.reset();
}

async function deleteTask(event) {
    const taskId = event.currentTarget.taskId;
    if (confirm('Are you sure to delete this item?')) {
        tasks = tasks.filter((t) => t.ID !== taskId);
        showTasks();
        axios.delete(`http://celosnext.com:8081/todo/tasks/${taskId}`)
            .then(() => refreshTaskList())
            .catch(error => console.error(error));
    }
}
