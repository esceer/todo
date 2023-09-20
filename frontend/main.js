init();

function init() {
    const openDialogBtn = document.querySelector(".button--open-dialog");
    openDialogBtn.addEventListener("click", onDialogOpen);

    const closeBtn = document.querySelector(".button--close");
    closeBtn.addEventListener("click", onDialogClose);

    const form = document.querySelector(".dialog__form");
    form.addEventListener("submit", onSubmit);

    refreshTaskList();
}

function refreshTaskList() {
    refreshFilteredTaskList(tasks => tasks);
}

function refreshFilteredTaskList(filter) {
    fetchTasks()
        .then(ts => showTasks(filter(ts)))
        .catch(err => console.error(err));
}

function showTasks(tasks) {
    const main = document.querySelector(".tasks");
    main.replaceChildren();
    tasks.forEach(task => {
        let dueAt = task.dueAt ? new Date(task.dueAt) : task.dueAt;
        main.appendChild(
            createNewTaskElement(task.id, task.title, task.priority, task.completed, dueAt)
        );
    });
}

function createNewTaskElement(id, title, priority, completed, dueAt) {
    const taskE = createElement("div", "task", completed ? "task--completed-true" : ".task--completed-false");

    const checkbox = createCheckbox("input", "checkbox", "checkbox", completed, "task__checkbox")
    checkbox.taskId = id;
    checkbox.addEventListener("change", onCompletionToggle);
    taskE.appendChild(checkbox);

    taskE.appendChild(withTextContent(createElement("span", "task__title"), title));
    taskE.appendChild(withTextContent(createElement("span", "task__due-at", isDueAlready(dueAt) ? "task--due-already" : "task--due-in-future"), formatDate(dueAt)));

    delBtn = createElement("button", "button");
    delBtn.appendChild(createElement("img", "button__img--delete-task"));
    delBtn.taskId = id;
    delBtn.addEventListener("click", onTaskDelete);
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

function onDialogOpen() {
    openDialog();
}

function onDialogClose() {
    closeDialog();
}

function onSubmit(event) {
    event.preventDefault();

    const title = event.target.title.value;
    const detail = event.target.detail.value;
    const priority = event.target.priority.value;
    const dueAt = event.target.dueAt.value;

    createTask(title, detail, priority, dueAt)
        .then(() => {
            closeDialog();
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
    refreshFilteredTaskList(
        tasks => tasks.filter((t) => t.ID !== taskId)
    );
    deleteTask(taskId)
        .then(() => refreshTaskList());

}