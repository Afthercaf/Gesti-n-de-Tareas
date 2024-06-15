document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form-element');
    const taskList = document.getElementById('task-list');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let isDarkMode = JSON.parse(localStorage.getItem('isDarkMode')) || false;

    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }

    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        isDarkMode = !isDarkMode;
        localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    });

    window.renderTasks = () => {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            let taskClass = '';

            if (task.resolved) {
                taskClass = 'completed';
            } else if (new Date(task.endDate) < new Date()) {
                taskClass = 'expired';
            } else {
                taskClass = 'pending';
            }

            taskItem.className = `list-group-item ${taskClass}`;
            taskItem.innerHTML = `
                <span>${task.name} (Inicio: ${task.startDate}, Fin: ${task.endDate}, Responsable: ${task.responsible})</span>
                <div class="button-container">
                    ${!task.resolved && new Date(task.endDate) >= new Date() ? `<button class="btn btn-success btn-sm" onclick="resolveTask(${index})">Resolver</button>` : ''}
                    ${task.resolved ? `<button class="btn btn-warning btn-sm" onclick="confirmunresolveTask(${index})">Desmarcar</button>` : ''}
                    <button class="btn btn-danger btn-sm" onclick="confirmDeleteTask(${index})">Eliminar</button>
                </div>
            `;
            taskList.appendChild(taskItem);
        });
    };

    window.addTask = (task) => {
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    };

    window.resolveTask = (index) => {
        if (new Date(tasks[index].endDate) < new Date()) {
            alert('No se puede marcar como resuelta una tarea cuya fecha de fin ya ha pasado.');
            return;
        }
        tasks[index].resolved = true;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    };

    window.confirmunresolveTask = (index) => {
        if (confirm(' ¿Estás seguro de que deseas desmarcar esta tarea como resuelta?')) {
            unresolveTask(index);
        }
    };

    window.unresolveTask = (index) => {
        tasks[index].resolved = false;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    };

    window.confirmDeleteTask = (index) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
            deleteTask(index);
        }
    };

    window.deleteTask = (index) => {
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    };

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskName = document.getElementById('task-name').value;
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        const taskResponsible = document.getElementById('task-responsible').value;

        if (new Date(endDate) < new Date(startDate)) {
            alert('La fecha de fin no puede ser menor a la fecha de inicio.');
            return;
        }

        const task = {
            name: taskName,
            startDate: startDate,
            endDate: endDate,
            responsible: taskResponsible,
            resolved: false
        };

        addTask(task);
        taskForm.reset();
    });

    renderTasks();
});