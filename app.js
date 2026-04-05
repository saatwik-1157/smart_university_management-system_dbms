/* VITAP Smart University - Mega-Scale Dashboard Logic */
const mockData = {
    students: Array.from({ length: 1000 }, (_, i) => ({
        id: 200 + i,
        name: `${['James', 'Robert', 'John', 'Michael', 'David', 'William', 'Richard', 'Joseph', 'Thomas', 'Christopher', 'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth'][i % 15]} ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'][i % 10]}`,
        email: `student_${i + 200}@vitapstudent.edu`,
        dept: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Business Administration'][i % 4],
        status: ['Active', 'In Class', 'On Leave'][i % 3],
        gpa: (2.5 + Math.random() * 1.5).toFixed(2),
        progress: Math.floor(Math.random() * 100)
    })),
    faculty: Array.from({ length: 100 }, (_, i) => ({
        id: 61 + i,
        name: `Prof. ${['Robert', 'John', 'William', 'David', 'Richard'][i % 5]} ${['Miller', 'Davis', 'Hernandez', 'Lopez', 'Gonzalez'][i % 5]}`,
        email: `faculty_${i + 61}@vitap.edu`,
        dept: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Business Administration'][i % 4],
        rank: ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer'][i % 4],
        status: ['In Office', 'Teaching', 'Away'][i % 3]
    })),
    placements: [
        { student: 'Alice Green', company: 'Google', role: 'Software Engineer', package: '$145,000', status: 'Placed' },
        { student: 'Bob White', company: 'Amazon', role: 'Data Scientist', package: '$135,000', status: 'Accepted' },
        { student: 'Charlie Brown', company: 'Tesla', role: 'Mech Design Engineer', package: '$95,000', status: 'Placed' },
        { student: 'David Black', company: 'Microsoft', role: 'Software Engineer', package: '$130,000', status: 'In Review' },
        { student: 'Eve Adams', company: 'Meta', role: 'Full Stack Engineer', package: '$140,000', status: 'Intern' }
    ]
};

let currentFilter = '';

function showSection(section) {
    const contentArea = document.getElementById('content-area');
    const title = document.getElementById('page-title');
    const desc = document.getElementById('page-desc');
    const widgets = document.getElementById('overview-widgets');
    
    // Update Sidebar Active State
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    const activeItem = document.querySelector(`[onclick="showSection('${section}')"]`);
    if(activeItem) activeItem.classList.add('active');

    // Toggle Overview Widgets
    widgets.style.display = (section === 'overview') ? 'grid' : 'none';

    let html = '';
    switch(section) {
        case 'academic':
            title.innerText = 'Student Performance Center';
            desc.innerText = 'Search through 1,000+ student records and real-time live statuses.';
            html = renderStudentTable(mockData.students);
            break;
        case 'faculty':
            title.innerText = 'Faculty Directory';
            desc.innerText = 'Administrative view of 100+ academic staff members.';
            html = renderFacultyTable(mockData.faculty);
            break;
        case 'placements':
            title.innerText = 'VITAP Career Hub';
            desc.innerText = 'Tracking recruitment cycles and salary package trends.';
            html = renderPlacementTable(mockData.placements);
            break;
        case 'maintenance':
            title.innerText = 'Infrastructure & Maintenance';
            desc.innerText = 'Real-time repair requests across all building blocks.';
            html = `
                <div class="section-card animate-fade">
                    <div class="section-header"><div class="section-title">Active Urgent Requests</div></div>
                    <div style="padding: 1rem; background: rgba(56, 189, 248, 0.05); border-left: 4px solid var(--acc-primary); border-radius: 4px; margin-bottom: 1rem;">
                        <strong>ab1 newton hall - R101</strong>: AC not cooling. <span class="badge badge-warning">IN PROGRESS</span>
                    </div>
                </div>
            `;
            break;
        default:
            title.innerText = 'University Overview';
            desc.innerText = 'Real-time enterprise analytics across all VITAP campuses.';
            html = `<div class="section-card animate-fade"><p style="color: var(--text-muted)">Welcome back, V.Saatwik Sairaam. All systems are operational across the VITAP campus. Data scale is currently at 1,000+ Students.</p></div>`;
    }
    contentArea.innerHTML = html;
}

function renderStudentTable(data) {
    const filtered = data.filter(s => s.name.toLowerCase().includes(currentFilter.toLowerCase()) || s.dept.toLowerCase().includes(currentFilter.toLowerCase())).slice(0, 50);
    return `
        <div class="section-card animate-fade">
            <div class="section-header">
                <div class="section-title">Students Registry (Showing first 50 results)</div>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr><th>Name</th><th>Email</th><th>Department</th><th>GPA</th><th>Status</th><th>Graduation</th></tr>
                    </thead>
                    <tbody>
                        ${filtered.map(s => `
                            <tr>
                                <td class="name-clickable" onclick="openStudentModal(${s.id})"><strong>${s.name}</strong></td>
                                <td>${s.email}</td>
                                <td>${s.dept}</td>
                                <td>${s.gpa}</td>
                                <td><span class="badge badge-${s.status === 'Active' ? 'success' : s.status === 'In Class' ? 'info' : 'warning'}">${s.status}</span></td>
                                <td style="width: 150px;">
                                    <div class="capacity-bar"><div class="capacity-fill" style="width: ${s.progress}%"></div></div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderFacultyTable(data) {
    return `
        <div class="section-card animate-fade">
            <div class="section-header"><div class="section-title">Faculty List</div></div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr><th>Name</th><th>Email</th><th>Department</th><th>Rank</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                        ${data.map(f => `
                            <tr>
                                <td><strong>${f.name}</strong></td>
                                <td>${f.email}</td>
                                <td>${f.dept}</td>
                                <td>${f.rank}</td>
                                <td><span class="badge badge-success">${f.status}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderPlacementTable(data) {
    return `
        <div class="section-card animate-fade">
            <div class="section-header"><div class="section-title">Career Placements</div></div>
            <div class="table-container">
                <table>
                    <thead><tr><th>Student</th><th>Company</th><th>Role</th><th>Package</th><th>Status</th></tr></thead>
                    <tbody>
                        ${data.map(p => `
                            <tr><td>${p.student}</td><td>${p.company}</td><td>${p.role}</td><td>${p.package}</td><td><span class="badge badge-info">${p.status}</span></td></tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function handleGlobalSearch() {
    const input = document.getElementById('global-search');
    currentFilter = input.value;
    // Debounce or immediate refresh for the active view
    const navItems = document.querySelectorAll('.nav-item');
    let activeView = 'overview';
    navItems.forEach(item => { if(item.classList.contains('active')) activeView = item.innerText.toLowerCase(); });

    if(activeView.includes('students')) showSection('academic');
}

/* Modal Implementation */
function openStudentModal(id) {
    const student = mockData.students.find(s => s.id === id);
    const modal = document.getElementById('student-modal');
    const modalBody = document.getElementById('modal-body');

    modalBody.innerHTML = `
        <div class="modal-header">
            <div class="modal-title">${student.name}</div>
            <div style="color: var(--acc-primary); font-weight: 700;">Student ID: #VITAP${student.id}</div>
        </div>
        <div class="modal-details">
            <div><strong>Department:</strong> ${student.dept}</div>
            <div><strong>Email:</strong> ${student.email}</div>
            <div><strong>Current GPA:</strong> <span style="color: var(--acc-success)">${student.gpa}</span></div>
            <div><strong>Live Status:</strong> <span class="badge badge-info">${student.status}</span></div>
            <div><strong>Graduation Progress:</strong></div>
            <div class="capacity-bar" style="height: 10px;"><div class="capacity-fill" style="width: ${student.progress}%"></div></div>
            <div style="font-size: 0.8rem; text-align: right; margin-top: 0.5rem;">${student.progress}% Complete</div>
        </div>
    `;

    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('student-modal').style.display = 'none';
}

// Initial Load
window.onload = () => showSection('overview');
