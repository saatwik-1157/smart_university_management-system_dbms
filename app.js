/* VITAP Enterprise V3 - Unified Logic Engine */
const universityDB = {
    students: Array.from({ length: 1000 }, (_, i) => ({
        id: 201 + i,
        name: `${['James', 'Robert', 'John', 'Michael', 'David', 'William', 'Richard', 'Joseph', 'Thomas', 'Christopher', 'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth'][i % 15]} ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'][i % 10]}`,
        email: `student_${i + 201}@vitapstudent.edu`,
        dept: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Business Administration'][i % 4],
        gpa: (2.5 + Math.random() * 1.5).toFixed(2),
        attendance: (75 + Math.random() * 25).toFixed(1),
        progress: Math.floor(Math.random() * 100),
        status: i % 10 === 0 ? 'On Probation' : i % 5 === 0 ? 'Dean\'s List' : 'Active'
    })),
    faculty: Array.from({ length: 100 }, (_, i) => ({
        id: 61 + i,
        name: `Prof. ${['Robert', 'William', 'David', 'Richard', 'Joseph'][i % 5]} ${['Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez'][i % 5]}`,
        email: `faculty_${i + 61}@vitap.edu`,
        dept: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Business Administration'][i % 4],
        rank: ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer'][i % 4],
        status: i % 3 === 0 ? 'In Lecture' : 'Office Hours'
    }))
};

let currentView = 'overview';
let searchQuery = '';

function showSection(section) {
    const area = document.getElementById('content-area');
    const pageTitle = document.getElementById('page-title');
    const pageDesc = document.getElementById('page-desc');
    const stats = document.getElementById('overview-stats');

    // Update Sidebar Active state
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    const activeItem = document.querySelector(`[onclick="showSection('${section}')"]`);
    if(activeItem) activeItem.classList.add('active');

    // Toggle Summary Stats
    stats.style.display = (section === 'overview') ? 'grid' : 'none';

    let html = '';
    switch(section) {
        case 'academic':
            pageTitle.innerText = 'Student Registry';
            pageDesc.innerText = 'Administrative view of 1,000+ enrolled students.';
            html = renderTable('students', universityDB.students);
            break;
        case 'faculty':
            pageTitle.innerText = 'Faculty Directory';
            pageDesc.innerText = 'Global list of 100+ academic staff members.';
            html = renderTable('faculty', universityDB.faculty);
            break;
        case 'placements':
            pageTitle.innerText = 'Career Center';
            pageDesc.innerText = 'Tracking corporate hiring cycles and packages.';
            html = `<div class="p-card"><h4 style="margin-bottom: 1rem;">Recruitment 2026</h4><p style="color: var(--text-muted)">VITAP has achieved a 75.2% placement rate for the current cycle. Top recruiters: Google, Amazon, Tesla.</p></div>`;
            break;
        case 'maintenance':
            pageTitle.innerText = 'Campus Infrastructure';
            pageDesc.innerText = 'Managing building occupancy and repairs.';
            html = `
                <div class="portal-grid">
                    <div class="p-card"><h5>ab1 newton hall</h5><p>82% Occupancy</p></div>
                    <div class="p-card"><h5>physics lab ab1</h5><p>45% Occupancy</p></div>
                    <div class="p-card"><h5>Tesla Block</h5><p>95% Occupancy</p></div>
                </div>
            `;
            break;
        default:
            pageTitle.innerText = 'Executive Command Center';
            pageDesc.innerText = 'Real-time management for VITAP\'s 1,100+ members.';
            html = `<div class="p-card"><h4>Welcome Back, Administrator.</h4><p style="color: var(--text-muted); margin-top: 1rem;">System health is 100%. All portals (Student, Faculty, Admin) are currently synchronized with the database.</p></div>`;
    }
    area.innerHTML = html;
}

function renderTable(type, data) {
    const filtered = data.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 50);
    return `
        <div class="table-container animate-fade">
            <div style="padding: 1rem; border-bottom: 1px solid var(--border-light); font-weight: 700;">
                Showing top 50 records for ${type.charAt(0).toUpperCase() + type.slice(1)}
            </div>
            <table>
                <thead>
                    ${type === 'students' ? '<tr><th>Name</th><th>Email</th><th>GPA</th><th>Status</th><th>Action</th></tr>' : '<tr><th>Name</th><th>Email</th><th>Rank</th><th>Status</th><th>Workload</th></tr>'}
                </thead>
                <tbody>
                    ${filtered.map(item => `
                        <tr>
                            <td><strong>${item.name}</strong></td>
                            <td>${item.email}</td>
                            <td>${type === 'students' ? item.gpa : item.rank}</td>
                            <td><span style="color: ${item.status === 'On Probation' ? 'var(--acc-danger)' : 'var(--acc-primary)'}">${item.status}</span></td>
                            <td>${type === 'students' ? `<button class="btn" style="padding: 4px 12px; font-size: 10px;" onclick="openAudit(${item.id})">AUDIT</button>` : '4 Courses'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function handleSearch() {
    searchQuery = document.getElementById('global-search').value;
    const activeSection = document.querySelector('.nav-item.active').innerText.toLowerCase();
    if(activeSection.includes('student')) showSection('academic');
    else if(activeSection.includes('faculty')) showSection('faculty');
}

function openAudit(id) {
    const student = universityDB.students.find(s => s.id === id);
    const modal = document.getElementById('student-modal');
    const body = document.getElementById('modal-body');

    body.innerHTML = `
        <h2 style="color: var(--acc-primary); margin-bottom: 1rem;">Administrative Audit</h2>
        <h3 style="margin-bottom: 2rem;">${student.name} (#VITAP${student.id})</h3>
        <div style="text-align: left; background: #f8fafc; padding: 1.5rem; border-radius: 1rem;">
            <p><strong>Department:</strong> ${student.dept}</p>
            <p><strong>Email:</strong> ${student.email}</p>
            <p><strong>GPA:</strong> ${student.gpa}</p>
            <p><strong>Attendance:</strong> ${student.attendance}%</p>
            <p style="margin-top: 1rem;"><strong>Academic Standing:</strong> ${student.status}</p>
        </div>
        <button class="btn" style="width: 100%; margin-top: 2rem; background: var(--bg-navy);" onclick="alert('PDF Transcript Generated successfully!')">Generate Official Transcript (PDF)</button>
    `;
    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('student-modal').style.display = 'none';
}

// Initial Bootstrap based on page
window.onload = () => {
    const page = window.location.pathname.split('/').pop().toLowerCase();
    
    if(page === 'student.html') {
        console.log('Student Portal Active');
        // Student specific dynamic logic if needed
    } else if(page === 'faculty.html') {
        console.log('Faculty Portal Active');
        // Faculty specific dynamic logic
    } else {
        // Default Admin Hub logic
        showSection('overview');
    }
};
