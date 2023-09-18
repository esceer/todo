// const { default: axios } = require("axios");

async function fetchTasks() {
    const response = await axios.get('http://celosnext.com:8081/todo/tasks');
    return response.data;
}

function showTasks(tasks) {
    tasks.forEach(task => {
        const main = document.querySelector('.content main');
        let dueAt = task.DueAt;
        if (dueAt) {
            dueAt = new Date(task.DueAt).toLocaleDateString('hu-HU');
        }
        const taskE = createNewTaskElement(task.Title, dueAt);
        main.appendChild(taskE);
    });
}

function createNewTaskElement(title, dueAt) {
    const taskE = createElement('div', 'task');
    taskE.appendChild(createElement('span', 'title', title));
    taskE.appendChild(createElement('span', 'due-at', dueAt));

    delBtn = createElement('button');
    delBtn.appendChild(createElement('img', 'del-btn'));
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

function deleteTask() {
    alert('del');
}

fetchTasks().then((r) => showTasks(r));
