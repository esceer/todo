// const { default: axios } = require("axios");

async function fetchTasks() {
    const response = await axios.get(API_URL);
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

    await axios.post(API_URL, newTask)
        .catch(err => {
            console.error(err);
            throw err;
        });
}

async function deleteTask(taskId) {
    if (confirm("Are you sure to delete this item?")) {
        await axios.delete(`${API_URL}/${taskId}`)
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

    await axios.patch(`${API_URL}/${taskId}`, updates)
        .catch(err => {
            console.error(err);
            throw err;
        });
}