let tasks;

init();

function init() {
    document
        .querySelector(".button--open-create-dialog")
        .addEventListener("click", onCreateDialogOpen);

    const createDialog = document.querySelector(".create-dialog__button-close");
    createDialog.addEventListener("click", onCreateDialogClose);
    window.addEventListener("keyup", function (e) {
        if (e.key == "Escape") {
            onCreateDialogClose();
        }
    });

    const detailsDialog = document.querySelector(".details-dialog__button-close");
    detailsDialog.addEventListener("click", onDetailsDialogClose);
    detailsDialog.addEventListener("keyup", function (e) {
        if (e.key == "Escape") {
            onDetailsDialogClose();
        }
    });

    document
        .querySelector(".create-dialog__form")
        .addEventListener("submit", onSubmit);

    document
        .querySelector(".sidebar__nav-item--active")
        .addEventListener("click", onFilterActiveTasks);

    document
        .querySelector(".sidebar__nav-item--completed")
        .addEventListener("click", onFilterCompletedTasks);

    refreshTaskList();
}

function refreshTaskList() {
    fetchTasks()
        .then(fetched => {
            tasks = fetched;
            updateCounters();
            onFilterActiveTasks();
        })
        .catch(err => console.error(err));
}

function updateCounters() {
    const activeCounter = document.querySelector(".counter--active");
    activeCounter.textContent = tasks.filter(t => !t.completed).length;

    const completedCounter = document.querySelector(".counter--completed");
    completedCounter.textContent = tasks.filter(t => t.completed).length;
}

function showTasks(tasks) {
    const main = document.querySelector(".tasks");
    main.replaceChildren();
    if (tasks.length > 0) {
        tasks.forEach(task => {
            let dueAt = task.dueAt ? new Date(task.dueAt) : task.dueAt;
            main.appendChild(
                createNewTaskElement(task.id, task.title, task.priority, task.completed, dueAt)
            );
        });
    } else {
        main.appendChild(withTextContent(createElement("div", "tasks--placeholder"), "There are no tasks"));
    }
}

function createNewTaskElement(id, title, priority, completed, dueAt) {
    const taskE = createElement("div", "task", completed ? "task--completed-true" : ".task--completed-false");

    const checkbox = createCheckbox("input", "checkbox", "checkbox", completed, "task__checkbox")
    checkbox.taskId = id;
    checkbox.addEventListener("change", onCompletionToggle);
    taskE.appendChild(checkbox);

    taskE.appendChild(withTextContent(createElement("span", "task__title"), title));
    taskE.appendChild(withTextContent(createElement("span", "task__due-at", isDueAlready(dueAt) && !completed ? "task--due-already" : "task--due-in-future"), formatDate(dueAt)));

    const detailsBtn = createElement("button", "button");
    detailsBtn.appendChild(createElement("img", "button__img", "button__img--task-details"));
    detailsBtn.taskId = id;
    detailsBtn.addEventListener("click", onDetailsDialogOpen);
    taskE.appendChild(detailsBtn);

    const delBtn = createElement("button", "button", "button");
    delBtn.appendChild(createElement("img", "button__img", "button__img--delete-task"));
    delBtn.taskId = id;
    delBtn.addEventListener("click", onTaskDelete);
    taskE.appendChild(delBtn);

    if (priority && priority.toLowerCase() === "high") {
        taskE.classList.add("task--priority-high");
    }

    return taskE;
}

function openDialog(selector) {
    const screen = document.querySelector(".container");
    screen.classList.toggle("screen-blurred", true);
    const modal = document.querySelector(selector);
    modal.showModal();
}

function closeDialog(selector) {
    const screen = document.querySelector(".container");
    screen.classList.toggle("screen-blurred", false);
    const modal = document.querySelector(selector);
    modal.close();
}

function onCreateDialogOpen() {
    openDialog(".create-dialog");
}

function onCreateDialogClose() {
    closeDialog(".create-dialog");
}

function onDetailsDialogOpen(event) {
    const task = findTaskById(event.currentTarget.taskId);
    document.querySelector(".details-dialog__title").textContent = task.title;
    document.querySelector(".details-dialog__priority").textContent = task.priority
        .charAt(0).toUpperCase() + task.priority.slice(1);
    document.querySelector(".details-dialog__due-date").textContent = task.dueAt
        ? new Date(task.dueAt).toLocaleString("hu-HU")
        : task.dueAt;
    document.querySelector(".details-dialog__details").textContent = task.details;

    const dialog = document.querySelector(".details-dialog");
    switch (task.priority) {
        case "high":
            dialog.classList.toggle("dialog--priority-high", true);
            dialog.classList.toggle("dialog--priority-medium", false);
            break;
        case "medium":
            dialog.classList.toggle("dialog--priority-high", false);
            dialog.classList.toggle("dialog--priority-medium", true);
            break;
        default:
            dialog.classList.toggle("dialog--priority-high", false);
            dialog.classList.toggle("dialog--priority-medium", false);
            break;
    }

    openDialog(".details-dialog");
}

function onDetailsDialogClose() {
    closeDialog(".details-dialog");
    document.querySelector(".details-dialog").classList.toggle("dialog--priority-high", false);
    document.querySelector(".details-dialog").classList.toggle("dialog--priority-medium", false);
    document.querySelector(".details-dialog__title").textContent = "n/a";
    document.querySelector(".details-dialog__priority").textContent = "";
    document.querySelector(".details-dialog__due-date").textContent = "";
    document.querySelector(".details-dialog__details").textContent = "";
}

function onSubmit(event) {
    event.preventDefault();

    const title = event.target.title.value;
    const details = event.target.details.value;
    const priority = event.target.priority.value;
    const dueAt = event.target.dueAt.value;

    createTask(title, details, priority, dueAt)
        .then(() => {
            closeDialog(".create-dialog");
            refreshTaskList();
        });

    event.target.reset();
}

function onCompletionToggle(event) {
    const taskId = event.currentTarget.taskId;
    const completed = event.target.checked;

    toggleComplete(taskId, completed)
        .then(() => refreshTaskList());
}

function onTaskDelete(event) {
    const taskId = event.currentTarget.taskId;
    deleteTask(taskId)
        .then(() => refreshTaskList());
}

function onFilterActiveTasks() {
    const navItems = document.querySelectorAll(".sidebar__nav-item__label");
    navItems.forEach(item => {
        item.classList.toggle("sidebar__nav-item--selected", false);
    });

    const activeNavItem = document.querySelector(".sidebar__nav-item--active .sidebar__nav-item__label");
    activeNavItem.classList.toggle("sidebar__nav-item--selected", true);

    showTasks(tasks.filter(t => !t.completed));
}

function onFilterCompletedTasks() {
    const navItems = document.querySelectorAll(".sidebar__nav-item__label");
    navItems.forEach(item => {
        item.classList.toggle("sidebar__nav-item--selected", false);
    });

    const activeNavItem = document.querySelector(".sidebar__nav-item--completed .sidebar__nav-item__label");
    activeNavItem.classList.toggle("sidebar__nav-item--selected", true);

    showTasks(tasks.filter(t => t.completed));
}

function findTaskById(id) {
    return tasks.find(t => t.id === id);
}