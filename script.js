const toggleBtn = document.querySelector('#theme-toggle-btn');
const body = document.body;
const taskList = document.getElementById('dynamic-section');
const addCardBtn = document.getElementById('add-card-btn');
const noTaskText = document.getElementById('no-task-text');

// Theme Toggle
toggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    toggleBtn.textContent = body.classList.contains('dark-theme')
        ? '☀️ Light Mode'
        : '🌙 Dark Mode';
});

function updateNoTaskText() {  // ✅ new function
    if (taskList.children.length === 0) {
        noTaskText.style.display = "block";
    } else {
        noTaskText.style.display = "none";
    }
}

function checkSingleTask_and_handleRemoveBtn() {
    const totalCards = document.getElementsByClassName("card").length;
    const firstCard = document.querySelector(".card");
    const firstCardBtn = firstCard.lastElementChild;
    if (totalCards === 1) {
        // console.log('1 ta card');
        firstCardBtn.classList.add("hidden");
    }
    else if (totalCards > 1) {
        firstCardBtn.classList.remove("hidden");
    }
}

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
        updateNoTaskText();
        checkSingleTask_and_handleRemoveBtn();
    });

    task.appendChild(input);
    task.appendChild(removeBtn);
    // taskList.appendChild(task);
    taskList.insertBefore(task, addCardBtn);

    updateNoTaskText();

    checkSingleTask_and_handleRemoveBtn();
}

// Create initial task
createTask();
updateNoTaskText();
checkSingleTask_and_handleRemoveBtn();

// Add new task button
addCardBtn.addEventListener('click', createTask);