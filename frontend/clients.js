// const { default: axios } = require("axios");

async function fetchTasks() {
    const response = await axios.get("http://celosnext.com:8081/todo/tasks");
    response.data.sort(sortByDateAndPriority);
    return response.data;
}

async function createTask(title, detail, priority, dueAt) {
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
        .catch(err => {
            console.error(err);
            throw err;
        });
}

async function deleteTask(taskId) {
    if (confirm("Are you sure to delete this item?")) {
        await axios.delete(`http://celosnext.com:8081/todo/tasks/${taskId}`)
            .catch(err => {
                console.error(err);
                throw err;
            });
    }
}

async function toggleComplete(taskId, completed) {
    let updates = {
        "completed": completed,
    };

    await axios.patch(`http://celosnext.com:8081/todo/tasks/${taskId}`, updates)
        .catch(err => {
            console.error(err);
            throw err;
        });
}