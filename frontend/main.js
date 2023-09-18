// const { default: axios } = require("axios");

let tasks;

setup();

function setup() {
    const addBtn = document.querySelector('.new-todo button');
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
    const main = document.querySelector('.content main');
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
    taskE.appendChild(createElement('span', 'title', title));
    taskE.appendChild(createElement('span', 'due-at', dueAt));

    delBtn = createElement('button');
    delBtn.appendChild(createElement('img', 'del-btn'));
    delBtn.taskId = id;
    delBtn.addEventListener('click', deleteTask);
    taskE.appendChild(delBtn);

    return taskE;
}

function createElement(tag, clazz, textContent) {
    const element = document.createElement(tag);
    if (clazz) {
        element.classList.add(clazz);
    }
    if (textContent) {
        element.appendChild(document.createTextNode(textContent));
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
