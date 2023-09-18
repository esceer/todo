// const { default: axios } = require("axios");

let tasks;

setup();

function setup() {
    const addBtn = document.querySelector('.button--task-create');
    addBtn.addEventListener('click', createTask);
    refreshTaskList();
}

function refreshTaskList() {
    fetchTasks()
        .then(() => showTasks())
        .catch(error => console.error(error));
}

async function fetchTasks() {
    const response = await axios.get('http://celosnext.com:8081/todo/tasks');
    tasks = response.data;
}

function showTasks() {
    const main = document.querySelector('.tasks');
    main.replaceChildren()
    tasks.forEach(task => {
        let dueAt = task.DueAt;
        if (dueAt) {
            dueAt = new Date(task.DueAt).toLocaleDateString('hu-HU');
        }
        const taskE = createNewTaskElement(task.ID, task.Title, dueAt);
        main.appendChild(taskE);
    });
}

function createNewTaskElement(id, title, dueAt) {
    const taskE = createElement('div', 'task');
    taskE.appendChild(withTextContent(createElement('span', 'task__title'), title));
    taskE.appendChild(withTextContent(createElement('span', 'task__due-at'), dueAt));

    delBtn = createElement('button', 'button');
    delBtn.appendChild(createElement('img', 'button__img--task-delete'));
    delBtn.taskId = id;
    delBtn.addEventListener('click', deleteTask);
    taskE.appendChild(delBtn);

    return taskE;
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

async function createTask() {
    let newTask = {
        "title": "random task"
    };
    await axios.post('http://celosnext.com:8081/todo/tasks', newTask)
        .then(() => refreshTaskList())
        .catch(error => console.error(error));
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
