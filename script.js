
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskContainer = document.getElementById('task-container');
const emptyState = document.getElementById('empty-state');
const statusMsg = document.getElementById('status-msg');
const filterBtns = document.querySelectorAll('.filter-btn');


let tasks = JSON.parse(localStorage.getItem('app_tasks')) || [];
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  renderTasks();
});


taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = taskInput.value.trim();


  if (!title) {
    showStatus('Please enter a valid task description!', 'error');
    return;
  }


  const newTask = {
    id: Date.now(),
    title: title,
    completed: false
  };

  tasks.push(newTask);
  saveData();
  renderTasks();

  taskInput.value = '';
  showStatus('Task added successfully!', 'success');
});


filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.getAttribute('data-filter');
    renderTasks();
  });
});


function saveData() {
  localStorage.setItem('app_tasks', JSON.stringify(tasks));
}


function renderTasks() {
  taskContainer.innerHTML = '';

 
  const filtered = tasks.filter(task => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  if (filtered.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
  }

  filtered.forEach(task => {
    const card = document.createElement('div');
    card.className = `task-card ${task.completed ? 'is-completed' : ''}`;

    card.innerHTML = `
      <span class="task-title">${escapeHTML(task.title)}</span>
      <div class="task-actions">
        <button class="action-btn btn-complete" onclick="toggleComplete(${task.id})">
          ${task.completed ? 'Undo' : 'Complete'}
        </button>
        <button class="action-btn btn-edit" onclick="editTask(${task.id})">Edit</button>
        <button class="action-btn btn-delete" onclick="deleteTask(${task.id})">Delete</button>
      </div>
    `;

    taskContainer.appendChild(card);
  });
}


window.toggleComplete = function(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  saveData();
  renderTasks();
};


window.editTask = function(id) {
  const taskToEdit = tasks.find(t => t.id === id);
  if (!taskToEdit) return;

  const newTitle = prompt('Update your task title:', taskToEdit.title);
  if (newTitle !== null && newTitle.trim() !== '') {
    taskToEdit.title = newTitle.trim();
    saveData();
    renderTasks();
    showStatus('Task updated successfully!', 'success');
  }
};


window.deleteTask = function(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveData();
  renderTasks();
};


function showStatus(msg, type) {
  statusMsg.textContent = msg;
  statusMsg.className = `status-msg ${type}`;
  statusMsg.style.display = 'block';

  setTimeout(() => {
    statusMsg.style.display = 'none';
  }, 2500);
}


function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}