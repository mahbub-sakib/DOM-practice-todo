'use strict';

const toggleBtn = document.querySelector('#theme-toggle-btn');
const body = document.body;
const taskList = document.getElementById('dynamic-section');
const addCardBtn = document.getElementById('add-card-btn');
const noTaskText = document.getElementById('no-task-text');

let first_cross_displayed = false;

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
    });

    task.appendChild(input);

    const total_cards = document.getElementsByClassName("card").length;


    if (total_cards !== 0) {
        task.appendChild(removeBtn);
    }

    taskList.appendChild(task);

    if (total_cards > 0 && first_cross_displayed == false) {
        // console.log("dhukse");
        const first_card = document.querySelector(".card");

        const xBtn = document.createElement('button');
        xBtn.classList.add('remove-card-btn');
        xBtn.textContent = "×";

        xBtn.addEventListener('click', () => {
            task.remove();
            updateNoTaskText();
        });

        first_card.appendChild(xBtn);

        first_cross_displayed = true;
    }

    updateNoTaskText();
}

// Create initial task
createTask();

updateNoTaskText();



// Add new task button
addCardBtn.addEventListener('click', createTask);

document.addEventListener('keydown', function (e) {
    console.log(e.key);
})
