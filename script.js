const toggleBtn = document.querySelector('#theme-toggle-btn');
const body = document.body;
const taskList = document.getElementById('dynamic-section');
const addCardBtn = document.getElementById('add-card-btn');
const noTaskText = document.getElementById('no-task-text');

let editModal, editTextarea, saveEditBtn, cancelEditBtn, closeModalBtn;
let currentEditingInput = null;
let draggedCard = null;
let activeDraggableTask = null;

function createTaskTimer(timerEl, createdAt) {
    // const createdAt = Date.now(); // closure variable

    function getAge() {
        const seconds = Math.floor((Date.now() - createdAt) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ${seconds % 60}s ago`;
        const hours = Math.floor(minutes / 60);
        return `${hours}h ${minutes % 60}m ago`;
    }

    timerEl.textContent = `⏱ ${getAge()}`; // show immediately, don't wait 1s

    const intervalId = setInterval(() => {
        timerEl.textContent = `⏱ ${getAge()}`;
    }, 1000);

    // return a stop function so we can clean up when card is removed
    return function stopTimer() {
        clearInterval(intervalId);
    };
}

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    body.classList.add("dark-theme");
    toggleBtn.textContent = "☀️ Light Mode";
}

// ############################ Theme Toggle ############################
toggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark-theme');

    const isDark = body.classList.contains('dark-theme');
    toggleBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';

    localStorage.setItem("theme", isDark ? "dark" : "light");
});

// #################### save all tasks in localStorage ##################
function saveTasks() {
    const tasks = [];
    // console.log(this);
    // document.querySelectorAll(".card input").forEach(input => {
    //     const value = input.value.trim();
    //     if (value !== "") {
    //         tasks.push(value);
    //     }
    // });
    document.querySelectorAll(".card").forEach(card => {
        const input = card.querySelector("input");
        const timerEl = card.querySelector(".task-timer");
        const value = input.value.trim();
        if (value !== "") {
            tasks.push({
                text: value,
                createdAt: parseInt(timerEl.dataset.createdAt)
            });
        }
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ################### load all tasks from localStorage #################
function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

    taskList.innerHTML = ""; // clear existing

    if (savedTasks.length === 0) {
        // Always show at least one empty task
        createTask(false);
        updateNoTaskText();
        checkSingleTask_and_handleRemoveBtn();
        return;
    }

    // savedTasks.forEach((taskText, index) => {
    //     createTask(false, taskText);
    // });

    savedTasks.forEach(taskData => {
        const text = typeof taskData === "string" ? taskData : taskData.text;
        const createdAt = typeof taskData === "object" ? taskData.createdAt : Date.now();
        createTask(false, text, createdAt);
    });

    updateNoTaskText();
    checkSingleTask_and_handleRemoveBtn();
}

// ################### execute function after a delay #################
function debounce(fn, delay = 300) {
    let timer;

    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}
const debouncedSaveTasks = debounce(saveTasks, 300);

function updateNoTaskText() {
    if (taskList.children.length === 0) {
        noTaskText.style.display = "block";
    } else {
        noTaskText.style.display = "none";
    }
}

function checkSingleTask_and_handleRemoveBtn() {
    const totalCards = document.getElementsByClassName("card").length;
    const firstCard = document.querySelector(".card");
    // const firstCardBtn = firstCard.lastElementChild;
    const firstCardBtn = firstCard.querySelector('.remove-card-btn');
    if (totalCards === 1) {
        // console.log('1 ta card');
        firstCardBtn.classList.add("hidden");
    }
    else if (totalCards > 1) {
        firstCardBtn.classList.remove("hidden");
    }
}

function getDragAfterElement(container, y) {
    console.clear();

    const draggableElements = [
        ...container.querySelectorAll(".card:not(.dragging)")
    ];

    console.log("Mouse Y:", y);
    console.log("Candidates:", draggableElements.length);

    return draggableElements.reduce((closest, child, index) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        console.log(`Card ${index}`, {
            top: box.top,
            center: box.top + box.height / 2,
            offset
        });
        console.log('offset of closest card: ', closest.offset);
        // console.log('closest card: ', closest);
        if (offset < 0 && offset > closest.offset) {
            console.log("👉 New closest:", child);
            return { offset, element: child };
        } else {
            // debugger;
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// ##################### Create a single task ###################
function createTask(focus = true, value = "", createdAt = Date.now()) {
    const task = document.createElement('div');
    task.classList.add('card');

    // --- prepare input field ---
    const input = document.createElement('input');
    input.type = "text";
    input.placeholder = "Write your task...";
    input.value = value;

    // --- Lock input if it already has value ---
    if (value.trim() !== "") {
        input.readOnly = true;
    }

    // --- need to add debounced time when taking input ---
    // input.addEventListener("input", saveTasks);
    input.addEventListener("input", debouncedSaveTasks);

    // --- disable editing if clicked outside of input field ---
    input.addEventListener("blur", () => {
        if (input.value.trim() !== "") {
            input.readOnly = true;
            saveTasks();
        }
    });

    // --- prepare drag handle button ---
    const dragHandle = document.createElement("span");
    dragHandle.textContent = "☰";
    dragHandle.classList.add("drag-handle");

    dragHandle.addEventListener("mousedown", () => {
        task.draggable = true;
    });

    document.addEventListener("mouseup", () => {
        task.draggable = false;
    });

    // --- prepare remove button ---
    const removeBtn = document.createElement('button');
    removeBtn.classList.add('remove-card-btn');
    removeBtn.textContent = "×";

    removeBtn.addEventListener('click', () => {
        stopTimer();  // destroy timer closure
        task.remove();
        saveTasks();
        if (taskList.children.length === 0) {
            createTask();
        }
        updateNoTaskText();
        checkSingleTask_and_handleRemoveBtn();
    });

    // --- Press Enter → create new task ---
    input.addEventListener('keydown', (e) => {
        // console.log(e.target.value);
        if (e.key === 'Enter') {
            e.preventDefault();
            if (input.value.trim() !== "") {
                createTask();
            }
            saveTasks();
        }
    });

    // --- prepare edit button ---
    const editBtn = document.createElement('button');
    editBtn.textContent = "✏️";
    editBtn.classList.add("edit-btn");

    editBtn.addEventListener("click", () => {
        currentEditingInput = input;
        editTextarea.value = input.value;
        editModal.classList.remove("hidden");
        editTextarea.focus();
    });

    // --- task age timer (closure) ---
    const timerEl = document.createElement('span');
    timerEl.classList.add('task-timer');
    // timerEl.textContent = '⏱ 0s ago';
    timerEl.dataset.createdAt = createdAt;  // store for saveTasks() to read
    const stopTimer = createTaskTimer(timerEl, createdAt);

    task.appendChild(dragHandle);
    task.appendChild(input);

    task.appendChild(editBtn);
    task.appendChild(removeBtn);
    task.appendChild(timerEl);


    task.draggable = false;

    taskList.appendChild(task);



    updateNoTaskText();
    checkSingleTask_and_handleRemoveBtn();

    // --- Auto-focus new input ---
    if (focus) {
        input.focus();
    }
}


loadTasks();
// --- Create initial task ---
// if (taskList.children.length === 0) {
//     createTask();
// }
// updateNoTaskText();
// checkSingleTask_and_handleRemoveBtn();

// --- Add new task button ---
addCardBtn.addEventListener('click', createTask);





// ##################### Save edited task ###################
function saveEdit() {
    if (!currentEditingInput) return;

    const updatedValue = editTextarea.value.trim();
    if (updatedValue !== "") {
        currentEditingInput.value = updatedValue;
        currentEditingInput.readOnly = true;
        saveTasks();
    }
    closeModal();
}

function closeModal() {
    editModal.classList.add("hidden");
    currentEditingInput = null;
}

// ##################### modal loading function ###################
// # this function need to be asynchronous as html directly can't #
// # invoke external html file                                    # 
async function loadModal() {
    const res = await fetch("modal.html");
    const html = await res.text();
    document.body.insertAdjacentHTML("beforeend", html);

    editModal = document.getElementById("edit-modal");
    editTextarea = document.getElementById("edit-textarea");
    saveEditBtn = document.getElementById("save-edit");
    cancelEditBtn = document.getElementById("cancel-edit");
    closeModalBtn = document.getElementById("close-modal");

    saveEditBtn.addEventListener("click", saveEdit);
    cancelEditBtn.addEventListener("click", closeModal);
    closeModalBtn.addEventListener("click", closeModal);
}

loadModal();


taskList.addEventListener("dragstart", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;

    console.log('dragging started');
    draggedCard = card;
    card.classList.add("dragging");
});

taskList.addEventListener("dragend", () => {
    if (!draggedCard) {
        return;
    }
    console.log('dragging end');
    draggedCard.classList.remove("dragging");
    draggedCard = null;

    document
        .querySelectorAll(".card")
        .forEach(c => c.classList.remove("drag-hover"));

    saveTasks();
});

taskList.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (!draggedCard) return;

    const cards = [...taskList.querySelectorAll(".card")];

    let hoveredCard = null;

    cards.forEach(card => {
        card.classList.remove("drag-hover");

        const rect = card.getBoundingClientRect();

        const insideX = e.clientX >= rect.left && e.clientX <= rect.right;
        const insideY = e.clientY >= rect.top && e.clientY <= rect.bottom;

        if (insideX && insideY) {
            hoveredCard = card;
        }
    });

    if (!hoveredCard) return;

    // if (hoveredCard && hoveredCard !== draggedCard) {
    //     hoveredCard.classList.add("drag-hover");
    // }

    hoveredCard.classList.add("drag-hover");

    const rect = hoveredCard.getBoundingClientRect();
    const isBelow = e.clientY > rect.top + rect.height / 2;

    if (isBelow) {
        taskList.insertBefore(draggedCard, hoveredCard.nextSibling);
    } else {
        taskList.insertBefore(draggedCard, hoveredCard);
    }


    // const afterElement = getDragAfterElement(taskList, e.clientY);
    // // console.log(e.clientX, e.clientY);

    // if (!draggedCard) return;

    // if (afterElement == null) {
    //     taskList.appendChild(draggedCard);
    // } else {
    //     taskList.insertBefore(draggedCard, afterElement);
    // }
});

// document.addEventListener("mouseup", () => {
//     if (activeDraggableTask) {
//         activeDraggableTask.draggable = false;
//         activeDraggableTask = null;
//     }
// });

// dragHandle.addEventListener("mousedown", () => {
//     task.draggable = true;
//     activeDraggableTask = task;
// });