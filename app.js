// app.js - Main JavaScript file for Project Management System

// Debug logging
console.log('=== PMS SYSTEM STARTING ===');
console.log('Current page:', window.location.pathname.split('/').pop());

// ==================== LOCAL STORAGE MANAGEMENT ====================
class StorageManager {
    constructor() {
        this.USERS_KEY = 'pms_users';
        this.CURRENT_USER_KEY = 'pms_current_user';
        this.PROJECTS_KEY = 'pms_projects';
        this.TASKS_KEY = 'pms_tasks';

        // Initialize default data if empty
        this.initDefaultData();
    }

    initDefaultData() {
        // Initialize users if empty
        if (!this.getUsers().length) {
            const defaultUsers = [
                {
                    username: 'admin',
                    password: 'password123',
                    fullName: 'Sora L.',
                    email: 'sora@example.com',
                    phone: '(555) 123-4567',
                    role: 'Project Manager',
                    memberSince: 'October 2024'
                }
            ];
            this.saveUsers(defaultUsers);
            console.log('Created default user');
        }

        // Initialize projects if empty
        if (!this.getProjects().length) {
            const defaultProjects = [
                {
                    id: 1,
                    name: 'Website Revitalization',
                    description: 'Complete overhaul of the existing company website, focusing on mobile responsiveness and improved UI/UX.',
                    assignedTo: 'Sora',
                    startDate: '2024-10-01',
                    endDate: '2024-10-10',
                    status: 'active',
                    progress: 70,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    name: 'Mobile App Design',
                    description: 'UI/UX design and prototyping for a native mobile app (iOS/Android).',
                    assignedTo: 'Sora',
                    startDate: '2024-11-05',
                    endDate: '2025-01-05',
                    status: 'completed',
                    progress: 100,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    name: 'Database Migration',
                    description: 'Migrating data from the legacy system to a new cloud-based database.',
                    assignedTo: 'Sora',
                    startDate: '2025-01-15',
                    endDate: '2025-05-15',
                    status: 'on-hold',
                    progress: 20,
                    createdAt: new Date().toISOString()
                }
            ];
            this.saveProjects(defaultProjects);
            console.log('Created default projects');
        }

        // Initialize tasks if empty
        if (!this.getTasks().length) {
            const defaultTasks = [
                {
                    id: 1,
                    title: 'Design Homepage Mockup',
                    projectId: 1,
                    projectName: 'Website Revitalization',
                    assignee: 'Sora',
                    dueDate: new Date().toISOString().split('T')[0],
                    status: 'in-progress',
                    description: 'Create homepage design mockup'
                },
                {
                    id: 2,
                    title: 'Set up database schema',
                    projectId: 3,
                    projectName: 'Database Migration',
                    assignee: 'Alex',
                    dueDate: '2025-03-01',
                    status: 'todo',
                    description: 'Create database schema design'
                },
                {
                    id: 3,
                    title: 'Finalize App Store text',
                    projectId: 2,
                    projectName: 'Mobile App Design',
                    assignee: 'Sora',
                    dueDate: '2025-01-01',
                    status: 'done',
                    description: 'Prepare app store description'
                },
                {
                    id: 4,
                    title: 'Integrate payment gateway',
                    projectId: 1,
                    projectName: 'Website Revitalization',
                    assignee: 'Alex',
                    dueDate: '2025-01-15',
                    status: 'todo',
                    description: 'Integrate Stripe payment gateway'
                }
            ];
            this.saveTasks(defaultTasks);
            console.log('Created default tasks');
        }
    }

    // User management
    getUsers() {
        return JSON.parse(localStorage.getItem(this.USERS_KEY)) || [];
    }

    saveUsers(users) {
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }

    // Current user management
    getCurrentUser() {
        return JSON.parse(localStorage.getItem(this.CURRENT_USER_KEY));
    }

    setCurrentUser(user) {
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    }

    clearCurrentUser() {
        localStorage.removeItem(this.CURRENT_USER_KEY);
    }

    // Project management
    getProjects() {
        return JSON.parse(localStorage.getItem(this.PROJECTS_KEY)) || [];
    }

    getProject(id) {
        const projects = this.getProjects();
        return projects.find(project => project.id === id);
    }

    saveProjects(projects) {
        localStorage.setItem(this.PROJECTS_KEY, JSON.stringify(projects));
    }

    addProject(project) {
        const projects = this.getProjects();
        const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
        project.id = newId;
        project.createdAt = new Date().toISOString();
        projects.push(project);
        this.saveProjects(projects);
        return project;
    }

    updateProject(id, updatedData) {
        const projects = this.getProjects();
        const index = projects.findIndex(project => project.id === id);
        if (index !== -1) {
            projects[index] = { ...projects[index], ...updatedData };
            this.saveProjects(projects);
            return true;
        }
        return false;
    }

    deleteProject(id) {
        const projects = this.getProjects();
        const filteredProjects = projects.filter(project => project.id !== id);
        this.saveProjects(filteredProjects);
        return true;
    }

    // Task management
    getTasks() {
        return JSON.parse(localStorage.getItem(this.TASKS_KEY)) || [];
    }

    getTasksByProject(projectId) {
        const tasks = this.getTasks();
        return tasks.filter(task => task.projectId === projectId);
    }

    saveTasks(tasks) {
        localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
    }

    addTask(task) {
        const tasks = this.getTasks();
        const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
        task.id = newId;
        tasks.push(task);
        this.saveTasks(tasks);
        return task;
    }

    updateTask(id, updatedData) {
        const tasks = this.getTasks();
        const index = tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            tasks[index] = { ...tasks[index], ...updatedData };
            this.saveTasks(tasks);
            return true;
        }
        return false;
    }

    deleteTask(id) {
        const tasks = this.getTasks();
        const filteredTasks = tasks.filter(task => task.id !== id);
        this.saveTasks(filteredTasks);
        return true;
    }

    // Helper methods
    formatDateForDisplay(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    }

    formatDateForInput(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    }
}

// Initialize storage manager
const storage = new StorageManager();

// ==================== LOGIN FUNCTIONALITY ====================
function initLogin() {
    console.log('Initializing login...');
    
    // Check if we're on the login page
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage !== 'index.html') {
        console.log('Not on login page, skipping login init');
        return;
    }
    
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        console.log('Login form found, adding event listener...');
        
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            console.log('Login form submitted');

            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();

            console.log('Username entered:', username);
            console.log('Password entered:', password);

            // Get users from storage
            const users = storage.getUsers();
            console.log('Available users:', users);

            // Find matching user
            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                console.log('Login successful! User:', user.username);
                storage.setCurrentUser(user);
                console.log('Current user set in localStorage');
                
                // Check if user was saved
                const savedUser = storage.getCurrentUser();
                console.log('Saved user check:', savedUser);
                
                // Redirect to dashboard
                setTimeout(function() {
                    window.location.href = 'dashboard.html';
                }, 100);
                
            } else {
                console.log('Login failed - invalid credentials');
                alert('Invalid username or password. Try admin/password123');
                document.getElementById('username').focus();
            }
        });
    } else {
        console.error('Login form not found!');
    }
}

// ==================== AUTH CHECK & USER INFO ====================
function checkAuth() {
    const currentUser = storage.getCurrentUser();
    const protectedPages = ['dashboard.html', 'projects.html', 'tasks.html', 'profile.html', 'form.html', 'details.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    console.log('=== AUTH CHECK ===');
    console.log('Current page:', currentPage);
    console.log('Current user:', currentUser);
    
    // If we're on the login page, don't check auth
    if (currentPage === 'index.html') {
        console.log('On login page, skipping auth check');
        return true;
    }
    
    // Check if user is logged in for protected pages
    if (protectedPages.includes(currentPage) && !currentUser) {
        console.log('No user found for protected page, redirecting to login...');
        alert('Please login first!');
        window.location.href = 'index.html';
        return false;
    }

    if (currentUser) {
        updateUserInterface(currentUser);
    }

    return true;
}

function updateUserInterface(user) {
    // Update user dropdown name
    const userElements = document.querySelectorAll('.nav-link.dropdown-toggle, .dropdown-item');
    userElements.forEach(element => {
        if (element.textContent.includes('Sora') || element.textContent.trim() === 'Sora') {
            element.innerHTML = element.innerHTML.replace('Sora', user.username || 'User');
        }
    });

    // Update profile page
    if (window.location.pathname.includes('profile.html')) {
        document.querySelector('.card-header h3').textContent = user.username || 'User';
        document.querySelectorAll('.list-group-item span.float-end')[0].textContent = user.fullName || 'N/A';
        document.querySelectorAll('.list-group-item span.float-end')[1].textContent = user.username || 'N/A';
        document.querySelectorAll('.list-group-item span.float-end')[2].textContent = user.role || 'N/A';
        document.querySelectorAll('.list-group-item span.float-end')[3].textContent = user.email || 'N/A';
        document.querySelectorAll('.list-group-item span.float-end')[4].textContent = user.phone || 'N/A';
    }
}

// ==================== LOGOUT FUNCTIONALITY ====================
function initLogout() {
    console.log('Initializing logout...');
    const logoutLinks = document.querySelectorAll('a[href="index.html"]');
    logoutLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            if (this.getAttribute('href') === 'index.html') {
                e.preventDefault();
                storage.clearCurrentUser();
                alert('Logged out successfully!');
                window.location.href = 'index.html';
            }
        });
    });
}

// ==================== DASHBOARD FUNCTIONALITY ====================
function initDashboard() {
    if (!window.location.pathname.includes('dashboard.html')) return;
    
    console.log('Initializing dashboard...');
    
    const projects = storage.getProjects();
    const tasks = storage.getTasks();

    console.log('Projects found:', projects.length);
    console.log('Tasks found:', tasks.length);

    // Update project counts
    const totalProjects = projects.length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const onHoldProjects = projects.filter(p => p.status === 'on-hold').length;

    console.log('Project counts:', { totalProjects, completedProjects, activeProjects, onHoldProjects });

    // Update dashboard cards
    const countElements = document.querySelectorAll('.card .h3.mb-0');
    if (countElements.length >= 4) {
        countElements[0].textContent = totalProjects;
        countElements[1].textContent = completedProjects;
        countElements[2].textContent = activeProjects;
        countElements[3].textContent = onHoldProjects;
        console.log('Dashboard cards updated');
    } else {
        console.error('Dashboard count elements not found!');
    }

    // Update recent activity
    const recentActivityList = document.querySelector('.list-group');
    if (recentActivityList) {
        const activityItems = recentActivityList.querySelectorAll('li');

        // Get recent projects
        const recentProjects = [...projects]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3);

        console.log('Recent projects for activity:', recentProjects.length);

        recentProjects.forEach((project, index) => {
            if (activityItems[index] && index < 3) {
                let activityText = '';
                if (project.status === 'completed') {
                    activityText = `<b>${project.name}</b> marked as <em>Completed</em>.`;
                } else if (project.status === 'active') {
                    activityText = `<b>${project.name}</b> status changed to <em>Active</em>.`;
                } else {
                    activityText = `<b>${project.name}</b> updated to ${project.progress}% <em>progress</em>.`;
                }

                activityItems[index].querySelector('span').innerHTML = activityText;
            }
        });
    }

    // Update upcoming deadlines
    const upcomingDeadlines = projects
        .filter(p => p.status !== 'completed')
        .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
        .slice(0, 2);

    console.log('Upcoming deadlines:', upcomingDeadlines.length);

    const deadlineList = document.querySelectorAll('.card-body .list-group')[1];
    if (deadlineList) {
        const deadlineItems = deadlineList.querySelectorAll('li');

        upcomingDeadlines.forEach((project, index) => {
            if (deadlineItems[index]) {
                const badge = deadlineItems[index].querySelector('.badge');
                if (badge) {
                    badge.textContent = storage.formatDateForDisplay(project.endDate);

                    // Color code based on urgency
                    const today = new Date();
                    const endDate = new Date(project.endDate);
                    const diffDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

                    if (diffDays <= 7) {
                        badge.className = 'badge bg-danger';
                    } else if (diffDays <= 30) {
                        badge.className = 'badge bg-warning text-dark';
                    } else {
                        badge.className = 'badge bg-info';
                    }
                }
            }
        });
    }
}

// ==================== PROJECTS PAGE FUNCTIONALITY ====================
function initProjectsPage() {
    if (!window.location.pathname.includes('projects.html')) return;
    
    console.log('Initializing projects page...');
    
    const projects = storage.getProjects();
    const projectsContainer = document.querySelector('.row-cols-1');

    console.log('Projects found:', projects.length);

    if (projectsContainer) {
        projectsContainer.innerHTML = '';

        if (projects.length === 0) {
            projectsContainer.innerHTML = `
                <div class="col-12">
                    <div class="card">
                        <div class="card-body text-center">
                            <p class="text-muted">No projects found.</p>
                            <a href="form.html" class="btn btn-primary">Create Your First Project</a>
                        </div>
                    </div>
                </div>
            `;
        } else {
            projects.forEach(project => {
                const projectCard = createProjectCard(project);
                projectsContainer.appendChild(projectCard);
            });
            console.log('Project cards created:', projects.length);
        }
    } else {
        console.error('Projects container not found!');
    }
}

// ==================== CREATE PROJECT CARD FUNCTION ====================
function createProjectCard(project) {
    const col = document.createElement('div');
    col.className = 'col';
    
    let statusClass = '';
    let statusColor = '';
    
    switch(project.status) {
        case 'active':
            statusClass = 'border-left-info';
            statusColor = 'bg-info text-white';
            break;
        case 'completed':
            statusClass = 'border-left-success';
            statusColor = 'bg-success';
            break;
        case 'on-hold':
            statusClass = 'border-left-warning';
            statusColor = 'bg-warning text-dark';
            break;
        default:
            statusClass = 'border-left-primary';
            statusColor = 'bg-secondary';
    }
    
    col.innerHTML = `
        <div class="card project-card ${statusClass}">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h5 class="card-title text-primary">${project.name}</h5>
                    <span class="badge ${statusColor}">${project.status.charAt(0).toUpperCase() + project.status.slice(1)}</span>
                </div>
                <p class="card-text text-muted small">Start Date: ${storage.formatDateForDisplay(project.startDate)}</p>
                
                <div class="mb-3">
                    <small class="text-muted">${project.progress}% Progress</small>
                    <div class="progress" role="progressbar" aria-label="${project.progress}% progress"
                        aria-valuenow="${project.progress}" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar ${project.status === 'completed' ? 'bg-success' : project.status === 'active' ? 'bg-info' : 'bg-warning'}" 
                             style="width: ${project.progress}%"></div>
                    </div>
                </div>
                <button onclick="viewProjectDetails(${project.id})" class="btn btn-sm btn-outline-primary">View Details</button>
                <button onclick="editProject(${project.id})" class="btn btn-sm btn-outline-warning ms-1">Edit</button>
                <button onclick="deleteProject(${project.id})" class="btn btn-sm btn-outline-danger ms-1">Delete</button>
            </div>
        </div>
    `;
    
    return col;
}

// ==================== PROJECT FORM FUNCTIONALITY ====================
function initProjectForm() {
    if (!window.location.pathname.includes('form.html')) return;
    
    console.log('Initializing project form...');
    
    const form = document.querySelector('form');
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    if (projectId) {
        // Edit mode
        const project = storage.getProject(parseInt(projectId));
        if (project) {
            document.querySelector('.card-header h3').innerHTML = '<i class="bi bi-pencil-square me-2"></i> Edit Project';
            document.getElementById('projectName').value = project.name;
            document.getElementById('assignedPerson').value = project.assignedTo;
            document.getElementById('description').value = project.description;
            document.getElementById('startDate').value = storage.formatDateForInput(project.startDate);
            document.getElementById('endDate').value = storage.formatDateForInput(project.endDate);
            document.getElementById('status').value = project.status;
            document.getElementById('progress').value = project.progress;
        }
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const projectData = {
            name: document.getElementById('projectName').value,
            assignedTo: document.getElementById('assignedPerson').value,
            description: document.getElementById('description').value,
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,
            status: document.getElementById('status').value,
            progress: parseInt(document.getElementById('progress').value)
        };

        if (projectId) {
            // Update existing project
            storage.updateProject(parseInt(projectId), projectData);
            alert('Project updated successfully!');
            // Redirect back to details page
            window.location.href = `details.html?id=${projectId}`;
        } else {
            // Add new project
            storage.addProject(projectData);
            alert('Project created successfully!');
            window.location.href = 'projects.html';
        }
    });
}

// ==================== PROJECT DETAILS PAGE ====================
function initDetailsPage() {
    if (!window.location.pathname.includes('details.html')) return;
    
    console.log('Initializing details page...');
    
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = parseInt(urlParams.get('id'));

    if (!projectId || isNaN(projectId)) {
        showProjectNotFound();
        return;
    }

    loadProjectDetails(projectId);
    setupEventListeners(projectId);
}

function loadProjectDetails(projectId) {
    const project = storage.getProject(projectId);

    if (!project) {
        showProjectNotFound();
        return;
    }

    // Show project details and hide loading
    document.getElementById('project-loading').style.display = 'none';
    document.getElementById('project-details').style.display = 'block';

    // Update project title
    document.getElementById('project-title').textContent = `Project: ${project.name}`;
    document.title = `Project Details - ${project.name}`;

    // Update key information
    document.getElementById('project-description').textContent = project.description;
    document.getElementById('project-assigned').textContent = project.assignedTo;
    document.getElementById('project-start-date').textContent = storage.formatDateForDisplay(project.startDate);
    document.getElementById('project-end-date').textContent = storage.formatDateForDisplay(project.endDate);

    // Update status badge
    const statusBadge = document.getElementById('project-status-badge');
    let badgeClass = 'bg-secondary';
    let statusText = project.status;

    switch (project.status) {
        case 'active':
            badgeClass = 'bg-info';
            statusText = 'Active';
            break;
        case 'completed':
            badgeClass = 'bg-success';
            statusText = 'Completed';
            break;
        case 'on-hold':
            badgeClass = 'bg-warning text-dark';
            statusText = 'On Hold';
            break;
    }

    statusBadge.className = `badge ${badgeClass} fs-6`;
    statusBadge.textContent = statusText;

    // Update progress
    const progressText = document.getElementById('project-progress-text');
    const progressBar = document.getElementById('project-progress-bar');
    const progressNote = document.getElementById('project-progress-note');

    progressText.textContent = `${project.progress}%`;

    // Set color based on status
    let progressBarClass = '';
    if (project.status === 'completed') {
        progressBarClass = 'bg-success';
        progressText.className = 'display-4 text-success mb-2';
    } else if (project.status === 'active') {
        progressBarClass = 'bg-info';
        progressText.className = 'display-4 text-info mb-2';
    } else {
        progressBarClass = 'bg-warning';
        progressText.className = 'display-4 text-warning mb-2';
    }

    progressBar.className = `progress-bar ${progressBarClass}`;
    progressBar.style.width = `${project.progress}%`;
    progressBar.setAttribute('aria-valuenow', project.progress);

    // Update progress note
    if (project.progress === 100) {
        progressNote.textContent = 'Project completed successfully!';
    } else if (project.progress >= 70) {
        progressNote.textContent = 'Final stages in progress';
    } else if (project.progress >= 40) {
        progressNote.textContent = 'Project is in development phase';
    } else {
        progressNote.textContent = 'Project is in initial stages';
    }

    // Load activity log
    loadActivityLog(project);

    // Load project tasks
    loadProjectTasks(projectId);

    // Set project ID for task modal
    document.getElementById('project-id').value = projectId;
}

function showProjectNotFound() {
    document.getElementById('project-loading').style.display = 'none';
    document.getElementById('project-not-found').style.display = 'block';
}

function loadActivityLog(project) {
    const activityList = document.getElementById('activity-list');
    activityList.innerHTML = '';

    // Add creation activity
    const creationActivity = document.createElement('li');
    creationActivity.className = 'list-group-item d-flex justify-content-between align-items-start';
    creationActivity.innerHTML = `
        <div class="ms-2 me-auto">
            <div class="fw-bold">Project Created</div>
            ${project.name} was created and assigned to ${project.assignedTo}.
        </div>
        <span class="badge bg-secondary">${storage.formatDateForDisplay(project.createdAt)}</span>
    `;
    activityList.appendChild(creationActivity);

    // Add progress update activity
    if (project.progress > 0) {
        const progressActivity = document.createElement('li');
        progressActivity.className = 'list-group-item d-flex justify-content-between align-items-start';
        progressActivity.innerHTML = `
            <div class="ms-2 me-auto">
                <div class="fw-bold">Progress Updated</div>
                ${project.assignedTo} updated the project progress to ${project.progress}%.
            </div>
            <span class="badge bg-secondary">Recently</span>
        `;
        activityList.appendChild(progressActivity);
    }

    // Add status change activity
    if (project.status !== 'pending') {
        const statusActivity = document.createElement('li');
        statusActivity.className = 'list-group-item d-flex justify-content-between align-items-start';
        statusActivity.innerHTML = `
            <div class="ms-2 me-auto">
                <div class="fw-bold">Status Changed</div>
                Project status changed to ${project.status}.
            </div>
            <span class="badge bg-secondary">Recently</span>
        `;
        activityList.appendChild(statusActivity);
    }

    if (activityList.children.length === 0) {
        activityList.innerHTML = `
            <li class="list-group-item text-center text-muted">
                No activity recorded yet.
            </li>
        `;
    }
}

function loadProjectTasks(projectId) {
    const tasks = storage.getTasksByProject(projectId);
    const tableBody = document.getElementById('tasks-table-body');
    const project = storage.getProject(projectId);

    if (!tableBody) {
        console.error('Tasks table body not found in details page');
        return;
    }

    tableBody.innerHTML = '';

    if (tasks.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted">
                    No tasks found for this project.
                </td>
            </tr>
        `;
        return;
    }

    tasks.forEach(task => {
        const row = document.createElement('tr');

        // Status badge
        let statusBadge = '';
        let statusText = '';
        switch (task.status) {
            case 'todo':
                statusBadge = 'bg-secondary';
                statusText = 'To Do';
                break;
            case 'in-progress':
                statusBadge = 'bg-warning text-dark';
                statusText = 'In Progress';
                break;
            case 'done':
                statusBadge = 'bg-success';
                statusText = 'Done';
                break;
        }

        // Due date badge
        let dueDateBadge = '';
        const today = new Date();
        const dueDate = new Date(task.dueDate);
        const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            dueDateBadge = 'bg-danger';
        } else if (diffDays === 0) {
            dueDateBadge = 'bg-danger';
        } else if (diffDays <= 3) {
            dueDateBadge = 'bg-warning text-dark';
        } else {
            dueDateBadge = 'bg-info';
        }

        row.innerHTML = `
            <td>
                <strong>${task.title}</strong>
                ${task.description ? `<br><small class="text-muted">${task.description}</small>` : ''}
            </td>
            <td>${task.assignee}</td>
            <td><span class="badge ${dueDateBadge}">${storage.formatDateForDisplay(task.dueDate)}</span></td>
            <td><span class="badge ${statusBadge}">${statusText}</span></td>
            <td>
                <button onclick="editTaskModal(${task.id})" class="btn btn-sm btn-outline-warning" title="Edit">
                    <i class="bi bi-pencil"></i>
                </button>
                <button onclick="deleteTaskFromDetails(${task.id}, ${projectId})" class="btn btn-sm btn-outline-danger ms-1" title="Delete">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

function setupEventListeners(projectId) {
    // Edit project button
    const editBtn = document.getElementById('edit-project-btn');
    if (editBtn) {
        editBtn.addEventListener('click', function () {
            window.location.href = `form.html?id=${projectId}`;
        });
    }

    // Add task button
    const addTaskBtn = document.getElementById('add-task-btn');
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', function () {
            showTaskModal('add', projectId);
        });
    }

    // Save task button
    const saveTaskBtn = document.getElementById('save-task-btn');
    if (saveTaskBtn) {
        saveTaskBtn.addEventListener('click', saveTask);
    }
}

function showTaskModal(mode, projectId, taskId = null) {
    const modal = new bootstrap.Modal(document.getElementById('taskModal'));
    const project = storage.getProject(projectId);

    document.getElementById('project-id').value = projectId;
    document.getElementById('task-id').value = taskId || '';

    if (mode === 'add') {
        document.getElementById('taskModalLabel').textContent = 'Add New Task';
        document.getElementById('task-title').value = '';
        document.getElementById('task-description').value = '';
        document.getElementById('task-assignee').value = project.assignedTo;
        document.getElementById('task-due-date').value = '';
        document.getElementById('task-status').value = 'todo';
    } else if (mode === 'edit' && taskId) {
        const task = storage.getTasks().find(t => t.id === taskId);
        if (task) {
            document.getElementById('taskModalLabel').textContent = 'Edit Task';
            document.getElementById('task-title').value = task.title;
            document.getElementById('task-description').value = task.description || '';
            document.getElementById('task-assignee').value = task.assignee;
            document.getElementById('task-due-date').value = storage.formatDateForInput(task.dueDate);
            document.getElementById('task-status').value = task.status;
        }
    }

    modal.show();
}

function saveTask() {
    const projectId = parseInt(document.getElementById('project-id').value);
    const taskId = document.getElementById('task-id').value;
    const project = storage.getProject(projectId);

    const taskData = {
        title: document.getElementById('task-title').value,
        description: document.getElementById('task-description').value,
        assignee: document.getElementById('task-assignee').value,
        dueDate: document.getElementById('task-due-date').value,
        status: document.getElementById('task-status').value,
        projectId: projectId,
        projectName: project.name
    };

    if (taskId) {
        // Update existing task
        storage.updateTask(parseInt(taskId), taskData);
    } else {
        // Add new task
        storage.addTask(taskData);
    }

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
    modal.hide();

    // Refresh task list
    loadProjectTasks(projectId);
}

function editTaskModal(taskId) {
    const projectId = parseInt(document.getElementById('project-id').value);
    showTaskModal('edit', projectId, taskId);
}

function deleteTaskFromDetails(taskId, projectId) {
    if (confirm('Are you sure you want to delete this task?')) {
        storage.deleteTask(taskId);
        loadProjectTasks(projectId);
    }
}

// ==================== TASKS PAGE FUNCTIONALITY ====================
function initTasksPage() {
    if (!window.location.pathname.includes('tasks.html')) return;
    
    console.log('Initializing tasks page...');
    
    const tasks = storage.getTasks();
    const filterSelect = document.getElementById('statusFilter');
    const tableBody = document.getElementById('tasks-table-body');

    console.log('Tasks found:', tasks.length);
    console.log('Filter select found:', !!filterSelect);
    console.log('Table body found:', !!tableBody);

    // Check if elements exist
    if (!tableBody) {
        console.error('Tasks table body not found!');
        return;
    }

    // Populate table
    renderTasks(tasks, tableBody);

    // Filter functionality
    if (filterSelect) {
        console.log('Adding filter event listener...');
        filterSelect.addEventListener('change', function () {
            console.log('Filter changed to:', this.value);
            const status = this.value.toLowerCase();
            let filteredTasks = tasks;

            if (status !== 'all') {
                filteredTasks = tasks.filter(task => {
                    if (status === 'todo') return task.status === 'todo';
                    if (status === 'in-progress') return task.status === 'in-progress';
                    if (status === 'done') return task.status === 'done';
                    return true;
                });
            }

            console.log('Filtered tasks:', filteredTasks.length);
            renderTasks(filteredTasks, tableBody);
        });
    } else {
        console.error('Filter select not found!');
    }
}

function renderTasks(tasks, tableBody) {
    tableBody.innerHTML = '';

    if (tasks.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted py-4">
                    No tasks found.
                </td>
            </tr>
        `;
        return;
    }

    tasks.forEach(task => {
        const row = document.createElement('tr');

        // Status badge
        let statusBadge = '';
        let statusText = '';
        switch (task.status) {
            case 'todo':
                statusBadge = 'bg-secondary';
                statusText = 'To Do';
                break;
            case 'in-progress':
                statusBadge = 'bg-warning text-dark';
                statusText = 'In Progress';
                break;
            case 'done':
                statusBadge = 'bg-success';
                statusText = 'Done';
                break;
        }

        // Due date badge
        let dueDateBadge = '';
        const today = new Date();
        const dueDate = new Date(task.dueDate);
        const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            dueDateBadge = 'bg-danger';
        } else if (diffDays === 0) {
            dueDateBadge = 'bg-danger';
        } else if (diffDays <= 3) {
            dueDateBadge = 'bg-warning text-dark';
        } else {
            dueDateBadge = 'bg-info';
        }

        row.innerHTML = `
            <td>${task.title}</td>
            <td>${task.projectName}</td>
            <td>${task.assignee}</td>
            <td><span class="badge ${dueDateBadge}">${storage.formatDateForDisplay(task.dueDate)}</span></td>
            <td><span class="badge ${statusBadge}">${statusText}</span></td>
            <td>
                <button onclick="viewTaskDetails(${task.id})" class="btn btn-sm btn-outline-secondary" title="View Details">
                    <i class="bi bi-eye"></i>
                </button>
                <button onclick="editTask(${task.id})" class="btn btn-sm btn-outline-warning ms-1" title="Edit">
                    <i class="bi bi-pencil"></i>
                </button>
                <button onclick="deleteTask(${task.id})" class="btn btn-sm btn-outline-danger ms-1" title="Delete">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// ==================== UTILITY FUNCTIONS ====================
function viewProjectDetails(projectId) {
    window.location.href = `details.html?id=${projectId}`;
}

function editProject(id) {
    window.location.href = `form.html?id=${id}`;
}

function deleteProject(id) {
    if (confirm('Are you sure you want to delete this project?')) {
        storage.deleteProject(id);
        alert('Project deleted successfully!');
        window.location.reload();
    }
}

function viewTaskDetails(id) {
    alert(`Viewing task details for ID: ${id}`);
    // You can implement a task details modal here
}

function editTask(id) {
    alert(`Editing task ID: ${id}`);
    // You can implement task editing here
}

function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        storage.deleteTask(id);
        alert('Task deleted successfully!');
        window.location.reload();
    }
}

// ==================== INITIALIZATION ====================
function initializeApp() {
    console.log('Initializing application...');
    
    // Check authentication for protected pages
    if (checkAuth()) {
        // Initialize all modules based on current page
        initLogin();
        initLogout();
        initDashboard();
        initProjectsPage();
        initProjectForm();
        initDetailsPage();
        initTasksPage();
    }
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM already loaded
    initializeApp();
}