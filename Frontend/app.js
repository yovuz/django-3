const apiUrl = 'http://127.0.0.1:8000/api/';
let currentTitleId = null;  // Track the current title ID for task operations
let currentTaskId = null;   // Track the task ID for updates

// Fetch all titles from the backend and display them
function fetchTitles() {
    fetch(apiUrl + 'titles/')
        .then(response => response.json())
        .then(data => {
            const titleList = document.getElementById('title-list');
            titleList.innerHTML = '';  // Clear the list before rendering

            data.forEach(title => {
                const li = document.createElement('li');
                li.innerHTML = `${title.name}
                    <button onclick="viewTasks(${title.id})">View Tasks</button>
                    <button onclick="deleteTitle(${title.id})">Delete</button>
                    <button onclick="showUpdateTitleForm(${title.id}, '${title.name}')">Update</button>`;
                titleList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error fetching titles:', error);
        });
}

// Fetch and display tasks for a specific title
function viewTasks(titleId) {
    currentTitleId = titleId;  // Store the title ID to handle task creation/deletion
    fetch(apiUrl + `titles/${titleId}/tasks/`)
        .then(response => response.json())
        .then(data => {
            const taskList = document.getElementById('task-list');
            const taskTitle = document.getElementById('task-title');
            const taskContainer = document.getElementById('task-container');
            const taskForm = document.getElementById('task-form');

            taskTitle.innerText = `Tasks for Title #${titleId}`;
            taskList.innerHTML = '';  // Clear the task list before rendering

            data.forEach(task => {
                const li = document.createElement('li');
                li.id = `task-${task.id}`;

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = task.completed;
                checkbox.className = 'task-checkbox';
                checkbox.addEventListener('change', () => toggleTaskCompletion(task.id, checkbox.checked));

                const taskName = document.createElement('span');
                taskName.innerText = `${task.name} - ${task.description}`;
                if (task.completed) {
                    taskName.classList.add('completed');
                }

                li.appendChild(checkbox);
                li.appendChild(taskName);

                const deleteBtn = document.createElement('button');
                deleteBtn.innerText = 'Delete';
                deleteBtn.addEventListener('click', () => deleteTask(task.id));

                const updateBtn = document.createElement('button');
                updateBtn.innerText = 'Update';
                updateBtn.addEventListener('click', () => showUpdateTaskForm(task.id, task.name, task.description));

                li.appendChild(deleteBtn);
                li.appendChild(updateBtn);
                taskList.appendChild(li);
            });

            document.getElementById('todo-container').style.display = 'none';
            taskContainer.style.display = 'block';
            taskForm.style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching tasks:', error);
        });
}

// Go back to the title list
function goBack() {
    document.getElementById('todo-container').style.display = 'block';
    document.getElementById('task-container').style.display = 'none';
}

// Show the form to create a new title
function showTitleForm() {
    document.getElementById('title-form').style.display = 'block';
}

// Handle the form submission for creating a title
function submitTitleForm(event) {
    event.preventDefault();
    const titleName = document.getElementById('title-name').value;

    fetch(apiUrl + 'titles/create/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: titleName }),
    })
    .then(response => response.json())
    .then(data => {
        fetchTitles();  // Refresh the list
        document.getElementById('title-name').value = '';  // Clear input field
        document.getElementById('title-form').style.display = 'none';  // Hide form
    })
    .catch(error => {
        console.error('Error creating title:', error);
    });
}

// Delete a title
function deleteTitle(titleId) {
    if (confirm('Are you sure you want to delete this title?')) {
        fetch(apiUrl + `titles/${titleId}/delete/`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.status === 204) {
                fetchTitles();  // Refresh the list after deletion
            }
        })
        .catch(error => {
            console.error('Error deleting title:', error);
        });
    }
}

// Show the form to create a new task
function showTaskForm() {
    document.getElementById('task-form').style.display = 'block';
}

// Handle the form submission for creating a task
function submitTaskForm(event) {
    event.preventDefault();
    const taskName = document.getElementById('task-name').value;
    const taskDescription = document.getElementById('task-description').value;

    fetch(apiUrl + `titles/${currentTitleId}/tasks/create/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: taskName,
            description: taskDescription
        }),
    })
    .then(response => response.json())
    .then(data => {
        viewTasks(currentTitleId);  // Refresh task list for the current title
        document.getElementById('task-name').value = '';  // Clear input field
        document.getElementById('task-description').value = '';  // Clear description field
    })
    .catch(error => {
        console.error('Error creating task:', error);
    });
}

// Update an existing task
function showUpdateTaskForm(taskId, taskName, taskDescription) {
    currentTaskId = taskId;  // Store task ID for updating

    const updateNameInput = document.getElementById('update-task-name');
    const updateDescInput = document.getElementById('update-task-description');

    updateNameInput.value = taskName;
    updateDescInput.value = taskDescription;

    document.getElementById('task-update-form').style.display = 'block';
}

// Handle the update form submission for tasks
function updateTaskSubmit() {
    const taskName = document.getElementById('update-task-name').value;
    const taskDescription = document.getElementById('update-task-description').value;

    fetch(apiUrl + `tasks/${currentTaskId}/update/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: taskName,
            description: taskDescription
        }),
    })
    .then(response => response.json())
    .then(data => {
        viewTasks(currentTitleId);  // Refresh task list after updating
        document.getElementById('task-update-form').style.display = 'none';  // Hide update form
    })
    .catch(error => {
        console.error('Error updating task:', error);
    });
}

// Cancel the update and hide the form
function cancelTaskUpdate() {
    document.getElementById('task-update-form').style.display = 'none';
}

// Toggle task completion status
function toggleTaskCompletion(taskId, isChecked) {
    fetch(apiUrl + `tasks/${taskId}/toggle/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            completed: isChecked
        }),
    })
    .then(response => response.json())
    .then(data => {
        viewTasks(currentTitleId);  // Refresh task list after updating completion status
    })
    .catch(error => {
        console.error('Error toggling task completion:', error);
    });
}

// Delete a task
function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        fetch(apiUrl + `tasks/${taskId}/delete/`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.status === 204) {
                viewTasks(currentTitleId);  // Refresh task list after deletion
            }
        })
        .catch(error => {
            console.error('Error deleting task:', error);
        });
    }
}

// Show the form to update the title
function showUpdateTitleForm(titleId, currentName) {
    // Show the update title form
    const updateTitleForm = document.getElementById('update-title-form');
    const updateTitleInput = document.getElementById('update-title-name');

    updateTitleInput.value = currentName;  // Pre-fill the current title name
    currentTitleId = titleId;  // Set the current title ID to update

    updateTitleForm.style.display = 'block';  // Show the form
}

// Handle the title update form submission
function updateTitleSubmit(event) {
    event.preventDefault();

    const updatedTitleName = document.getElementById('update-title-name').value;

    fetch(apiUrl + `titles/${currentTitleId}/update/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: updatedTitleName }),
    })
    .then(response => response.json())
    .then(data => {
        fetchTitles();  // Refresh the list after updating
        document.getElementById('update-title-form').style.display = 'none';  // Hide the form
    })
    .catch(error => {
        console.error('Error updating title:', error);
    });
}

// Cancel the update for the title
function cancelTitleUpdate() {
    document.getElementById('update-title-form').style.display = 'none';
}

//function toggleTaskCompletion(taskId) {
//    const taskName = document.getElementById('task-name-' + taskId).value;
//    const taskDescription = document.getElementById('task-description-' + taskId).value;
//
//    fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/update/`, {
//        method: 'PUT',
//        headers: {
//            'Content-Type': 'application/json',
//        },
//        body: JSON.stringify({
//            name: taskName,
//            description: taskDescription,
//            completed: true // Example of marking task as completed
//        }),
//    })
//    .then(response => response.json())
//    .then(data => {
//        console.log('Task updated:', data);
//        // Optionally refresh the task list or update the UI to reflect the change
//    })
//    .catch(error => {
//        console.error('Error updating task:', error);
//    });
//}


// Handle the task completion toggle
function toggleTaskCompletion(taskId) {
    // Dynamically access the task name and description inputs based on the taskId
    const taskNameInput = document.getElementById('task-name-' + taskId);
    const taskDescriptionInput = document.getElementById('task-description-' + taskId);

    // Check if the elements exist
    if (taskNameInput && taskDescriptionInput) {
        const taskName = taskNameInput.value;
        const taskDescription = taskDescriptionInput.value;

        // Send the update request to the server or handle the task completion logic here
        console.log(`Task ID: ${taskId}`);
        console.log(`Task Name: ${taskName}`);
        console.log(`Task Description: ${taskDescription}`);

        // Optionally, change the task status to "completed" (e.g., strike-through text)
        taskNameInput.style.textDecoration = 'line-through';  // Mark as completed
    } else {
        console.error(`Task with ID ${taskId} not found in the DOM.`);
    }
}

// Initialize the page by fetching all titles
fetchTitles();
