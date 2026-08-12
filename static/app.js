const API = '/tasks';
let currentFilter = 'all';

const form = document.getElementById('task-form');
const list = document.getElementById('task-list');
const emptyMsg = document.getElementById('empty-msg');
const counter = document.getElementById('counter');
const btnAll = document.getElementById('btn-all');
const btnPending = document.getElementById('btn-pending');
const btnCompleted = document.getElementById('btn-completed');
const pendingCount = document.getElementById('pending-count');
const totalCount = document.getElementById('total-count');
const completedCount = document.getElementById('completed-count');
const progressFill = document.getElementById('progress-fill');
const progressLabel = document.getElementById('progress-label');
const progressDetail = document.getElementById('progress-detail');
const progressPercent = document.getElementById('progress-percent');
const themeToggle = document.getElementById('theme-toggle');
const themeMenu = document.getElementById('theme-menu');
const themeOptions = document.querySelectorAll('.theme-option');
const modeToggle = document.getElementById('mode-toggle');
document.getElementById('today').textContent = new Intl.DateTimeFormat('es-ES', {
    day: 'numeric', month: 'short'
}).format(new Date());

function applyTheme(theme) {
    document.body.dataset.theme = theme;
    themeOptions.forEach(option => option.classList.toggle('active', option.dataset.theme === theme));
    localStorage.setItem('todo-theme', theme);
}

applyTheme(localStorage.getItem('todo-theme') || 'forest');
function applyMode(mode) {
    const isDark = mode === 'dark';
    document.body.dataset.mode = isDark ? 'dark' : 'light';
    modeToggle.setAttribute('aria-pressed', isDark);
    modeToggle.querySelector('.mode-state').textContent = isDark ? 'ON' : 'OFF';
    localStorage.setItem('todo-mode', isDark ? 'dark' : 'light');
}

applyMode(localStorage.getItem('todo-mode') || 'light');
modeToggle.addEventListener('click', () => {
    applyMode(document.body.dataset.mode === 'dark' ? 'light' : 'dark');
});
themeToggle.addEventListener('click', () => {
    const isOpen = themeMenu.classList.toggle('open');
    themeToggle.setAttribute('aria-expanded', isOpen);
});
themeOptions.forEach(option => option.addEventListener('click', () => {
    applyTheme(option.dataset.theme);
    themeMenu.classList.remove('open');
    themeToggle.setAttribute('aria-expanded', 'false');
}));
document.addEventListener('click', event => {
    if (!event.target.closest('.theme-picker')) {
        themeMenu.classList.remove('open');
        themeToggle.setAttribute('aria-expanded', 'false');
    }
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('task-title').value.trim();
    const desc = document.getElementById('task-desc').value.trim();
    if (!title) return;

    await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description: desc })
    });

    form.reset();
    loadTasks();
});

btnAll.addEventListener('click', () => setFilter('all'));
btnPending.addEventListener('click', () => setFilter('pending'));
btnCompleted.addEventListener('click', () => setFilter('completed'));

function setFilter(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
    if (filter === 'all') btnAll.classList.add('active');
    if (filter === 'pending') btnPending.classList.add('active');
    if (filter === 'completed') btnCompleted.classList.add('active');
    loadTasks();
}

async function loadTasks() {
    const resp = await fetch(API);
    const allTasks = await resp.json();
    const tasks = currentFilter === 'pending'
        ? allTasks.filter(t => !t.completed)
        : currentFilter === 'completed'
            ? allTasks.filter(t => t.completed)
            : allTasks;

    list.innerHTML = '';
    const pending = allTasks.filter(t => !t.completed).length;
    const completed = allTasks.length - pending;
    pendingCount.textContent = pending;
    totalCount.textContent = allTasks.length;
    completedCount.textContent = completed;
    const completionRate = allTasks.length ? Math.round((completed / allTasks.length) * 100) : 0;
    progressFill.style.width = `${completionRate}%`;
    progressPercent.textContent = `${completionRate}%`;
    progressLabel.textContent = !allTasks.length
        ? 'Tu lista empieza aquí'
        : completionRate === 100 ? '¡Día completado!' : `${completionRate}% del camino recorrido`;
    progressDetail.textContent = !allTasks.length
        ? 'Añade tu primera tarea para comenzar.'
        : `${completed} de ${allTasks.length} tarea${allTasks.length !== 1 ? 's' : ''} completada${completed !== 1 ? 's' : ''}.`;
    counter.textContent = `${tasks.length} tarea${tasks.length !== 1 ? 's' : ''} · ${pending} pendiente${pending !== 1 ? 's' : ''}`;

    if (tasks.length === 0) {
        emptyMsg.style.display = 'block';
        return;
    }
    emptyMsg.style.display = 'none';

    for (const t of tasks) {
        const li = document.createElement('li');
        li.className = 'task-item' + (t.completed ? ' completed' : '');

        const check = document.createElement('input');
        check.type = 'checkbox';
        check.className = 'task-check';
        check.checked = t.completed;
        check.addEventListener('change', () => toggleComplete(t));

        const info = document.createElement('div');
        info.className = 'task-info';

        const status = document.createElement('span');
        status.className = 'task-status';
        status.textContent = t.completed ? 'Completada' : 'Pendiente';

        const title = document.createElement('div');
        title.className = 'task-title';
        title.textContent = t.title;

        const desc = document.createElement('div');
        desc.className = 'task-desc';
        desc.textContent = t.description || '';

        info.appendChild(title);
        if (t.description) info.appendChild(desc);
        info.appendChild(status);

        const actions = document.createElement('div');
        actions.className = 'task-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'btn-edit';
        editBtn.textContent = '✏️';
        editBtn.title = 'Editar';
        editBtn.addEventListener('click', () => editTask(t, li));

        const delBtn = document.createElement('button');
        delBtn.className = 'btn-delete';
        delBtn.textContent = '🗑️';
        delBtn.title = 'Eliminar';
        delBtn.addEventListener('click', () => deleteTask(t));

        actions.appendChild(editBtn);
        actions.appendChild(delBtn);

        li.appendChild(check);
        li.appendChild(info);
        li.appendChild(actions);
        list.appendChild(li);
    }
}

async function toggleComplete(t) {
    await fetch(`${API}/${t.id}/complete`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !t.completed })
    });
    loadTasks();
}

async function deleteTask(t) {
    if (!confirm(`¿Eliminar la tarea "${t.title}"?`)) return;
    await fetch(`${API}/${t.id}`, { method: 'DELETE' });
    loadTasks();
}

function editTask(t, li) {
    li.classList.add('editing');

    const info = li.querySelector('.task-info');
    const newTitle = prompt('Nuevo título:', t.title);
    if (newTitle === null) {
        li.classList.remove('editing');
        return;
    }
    const newDesc = prompt('Nueva descripción:', t.description || '');

    fetch(`${API}/${t.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: newTitle.trim() || t.title,
            description: newDesc === null ? t.description : newDesc.trim()
        })
    }).then(() => {
        li.classList.remove('editing');
        loadTasks();
    });
}

loadTasks();
