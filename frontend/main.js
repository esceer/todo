// const { default: axios } = require("axios");

let tasks;

setup();

function setup() {
    const openDialogBtn = document.querySelector(".button--open-dialog");
    openDialogBtn.addEventListener("click", openDialog);

    const closeBtn = document.querySelector(".button--close");
    closeBtn.addEventListener("click", closeDialog);

    const form = document.querySelector(".dialog__form");
    form.addEventListener("submit", createTask);
    form.addEventListener("submit", closeDialog);

    refreshTaskList();
}

function refreshTaskList() {
    fetchTasks()
        .then(() => showTasks())
        .catch(error => console.error(error));
}

async function fetchTasks() {
    const response = await axios.get("http://celosnext.com:8081/todo/tasks");
    response.data.sort(sortByDateAndPriority);
    tasks = response.data;
}

function showTasks() {
    const main = document.querySelector(".tasks");
    main.replaceChildren();
    tasks.forEach(task => {
        let dueAt = task.dueAt ? new Date(task.dueAt) : task.dueAt;
        main.appendChild(
            createNewTaskElement(task.id, task.title, task.priority, dueAt)
        );
    });
}

function createNewTaskElement(id, title, priority, dueAt) {
    const taskE = createElement("div", "task");
    taskE.appendChild(createInput("input", "checkbox", "checkbox", "task__checkbox"));
    taskE.appendChild(withTextContent(createElement("span", "task__title"), title));
    taskE.appendChild(withTextContent(createElement("span", "task__due-at", isDueAlready(dueAt) ? "task--due-already" : "task--due-in-future"), formatDate(dueAt)));

    delBtn = createElement("button", "button");
    delBtn.appendChild(createElement("img", "button__img--delete-task"));
    delBtn.taskId = id;
    delBtn.addEventListener("click", deleteTask);
    taskE.appendChild(delBtn);

    if (priority && priority.toLowerCase() === "high") {
        taskE.classList.add("task--priority-high");
    }

    return taskE;
}

function openDialog() {
    const screen = document.querySelector(".container");
    screen.classList.toggle("screen-blurred", true);
    const modal = document.querySelector("dialog");
    modal.showModal();
}

function closeDialog() {
    const screen = document.querySelector(".container");
    screen.classList.toggle("screen-blurred", false);
    const modal = document.querySelector("dialog");
    modal.close();
}

async function createTask(event) {
    event.preventDefault();

    const title = event.target.title.value;
    const detail = event.target.detail.value;
    const priority = event.target.priority.value;
    const dueAt = event.target.dueAt.value;

    let newTask = {
        "title": title,
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

    await axios.post("http://celosnext.com:8081/todo/tasks", newTask)
        .then(() => refreshTaskList())
        .catch(error => console.error(error));

    event.target.reset();
}

async function deleteTask(event) {
    const taskId = event.currentTarget.taskId;
    if (confirm("Are you sure to delete this item?")) {
        tasks = tasks.filter((t) => t.ID !== taskId);
        showTasks();
        axios.delete(`http://celosnext.com:8081/todo/tasks/${taskId}`)
            .then(() => refreshTaskList())
            .catch(error => console.error(error));
    }
}
