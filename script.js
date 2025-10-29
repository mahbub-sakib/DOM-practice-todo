const toggleBtn = document.querySelector('#theme-toggle-btn');
const body = document.body;
const taskList = document.getElementById('dynamic-section');
const addCardBtn = document.getElementById('add-card-btn');

// Theme Toggle
toggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    toggleBtn.textContent = body.classList.contains('dark-theme')
        ? '☀️ Light Mode'
        : '🌙 Dark Mode';
});

function createTask() {
    const task = document.createElement('div');
    task.classList.add('card');

    const input = document.createElement('input');
    input.type = "text";
    input.placeholder = "Write your task...";

    const removeBtn = document.createElement('button');
    removeBtn.classList.add('remove-card-btn');
    removeBtn.textContent = "×";

    removeBtn.addEventListener('click', () => {
        task.remove();
    });

    task.appendChild(input);
    task.appendChild(removeBtn);
    taskList.appendChild(task);
}

// Create initial task
createTask();

// Add new task button
addCardBtn.addEventListener('click', createTask);

