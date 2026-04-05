/* VITAP Enterprise Unified Master Hub Logic (Graphics Edition) */

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
    })),
    slides: [
        { title: "VITAP SUMS", subtitle: "Mega-Scale Enterprise DBMS", desc: "Empowering 1,000+ Students & 100+ Staff", footer: "V.Saatwik Sairaam (24MIC 7131) | 2026" },
        { title: "Visual Analytics", subtitle: "Real-Time DBMS Graphics", desc: "Interactive Chart.js visualizations for massive data analysis.", footer: "Graphic Engine: V.Saatwik Sairaam" },
        { title: "Mega-Scale Expansion", subtitle: "1,100+ Live Entities", desc: "Successfully scaled the relational database from 10 to 1,000+ student records with zero latency.", footer: "DB Architecture: V.Saatwik Sairaam" },
        { title: "Triple-Portal Ecosystem", subtitle: "Unified Admin, Faculty, & Student Portals", desc: "Each portal tailored with specific analytic views, GPA history, and workload tracking.", footer: "Enterprise V3 Master Build" }
    ]
};

let currentView = 'overview';
let activeRole = 'admin';
let searchQuery = '';
let currentSlide = 0;
let charts = {};

function switchPortal(role) {
    activeRole = role;
    const roleTag = document.getElementById('active-role-tag');
    const roleNav = document.getElementById('master-nav');
    
    if(role === 'admin') {
        roleTag.innerText = 'ADMIN COMMAND CENTER';
        roleTag.style.color = '#1d4ed8';
        roleNav.innerHTML = `
            <li class="nav-item active" onclick="renderView('overview')"><i class="fas fa-chart-line"></i> Dashboard</li>
            <li class="nav-item" onclick="renderView('academic')"><i class="fas fa-graduation-cap"></i> Student Registry</li>
            <li class="nav-item" onclick="renderView('faculty')"><i class="fas fa-user-tie"></i> Staff Directory</li>
            <li class="nav-item" onclick="renderView('maintenance')"><i class="fas fa-tools"></i> Campus Hub</li>
        `;
        renderView('overview');
    } else if(role === 'student') {
        roleTag.innerText = 'STUDENT ACADEMIC PORTAL';
        roleTag.style.color = '#10b981';
        roleNav.innerHTML = `
            <li class="nav-item active" onclick="renderView('student-dashboard')"><i class="fas fa-columns"></i> My Overview</li>
            <li class="nav-item" onclick="renderView('academic')"><i class="fas fa-book-reader"></i> Coursework</li>
        `;
        renderView('student-dashboard');
    } else if(role === 'faculty') {
        roleTag.innerText = 'FACULTY MANAGEMENT SUITE';
        roleTag.style.color = '#f59e0b';
        roleNav.innerHTML = `
            <li class="nav-item active" onclick="renderView('faculty-dashboard')"><i class="fas fa-chalkboard-teacher"></i> Faculty Center</li>
            <li class="nav-item" onclick="renderView('faculty-registry')"><i class="fas fa-users"></i> Department List</li>
        `;
        renderView('faculty-dashboard');
    }
}

function renderView(view) {
    currentView = view;
    const root = document.getElementById('view-container');
    const title = document.getElementById('portal-title');
    const desc = document.getElementById('portal-desc');
    
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => { if(item.innerText.toLowerCase().includes(view.replace('-', ' '))) item.classList.add('active'); });

    let html = '';
    switch(view) {
        case 'overview':
            title.innerText = 'University Command Hub';
            desc.innerText = 'Real-time overview of university metrics.';
            html = `
                <div class="portal-grid">${renderStatCards()}</div>
                <div class="portal-grid" style="margin-top: 2rem;">
                    <div class="p-card"><h4>Enrollment Trend</h4><canvas id="chart-enrollment"></canvas></div>
                    <div class="p-card"><h4>Department GPA Comparison</h4><canvas id="chart-dept"></canvas></div>
                </div>
            `;
            setTimeout(() => initOverviewCharts(), 100);
            break;
        case 'academic':
            title.innerText = 'Administrative Registry';
            desc.innerText = 'Managing 1,000+ Enrolled Students.';
            html = renderTable('students', universityDB.students);
            break;
        case 'student-dashboard':
            title.innerText = 'My Academic Dashboard';
            desc.innerText = 'Alice Green | Semester 4 | CSE';
            html = `
                <div class="portal-grid">
                    <div class="p-card"><h3>GPA</h3><p style="font-size: 2.5rem; color: var(--acc-primary); font-weight: 800;">3.92</p></div>
                    <div class="p-card"><h3>Attendance</h3><p style="font-size: 2.5rem; color: #10b981; font-weight: 800;">94.5%</p></div>
                    <div class="p-card"><h3>Progress</h3><p style="font-size: 2.5rem; color: #f59e0b; font-weight: 800;">72%</p></div>
                </div>
                <div class="p-card" style="margin-top: 2rem;"><h4>My GPA Progress</h4><canvas id="chart-student-gpa"></canvas></div>
            `;
            setTimeout(() => initStudentChart(), 100);
            break;
        case 'faculty-dashboard':
            title.innerText = 'Faculty Academic Center';
            desc.innerText = 'Prof. Robert Williams | CSE';
            html = `
                <div class="portal-grid">
                    <div class="p-card"><h3>Total Students</h3><p style="font-size: 2.5rem; color: var(--acc-primary); font-weight: 800;">142</p></div>
                    <div class="p-card"><h3>Marking Status</h3><p style="font-size: 2.5rem; color: #10b981; font-weight: 800;">82%</p></div>
                </div>
            `;
            break;
        default:
            html = `<div class="p-card">View Under Construction</div>`;
    }
    root.innerHTML = html;
}

function renderStatCards() {
    return `
        <div class="p-card"><i class="fas fa-users"></i><h4>Enrollment</h4><p style="font-size: 1.5rem; font-weight: 800;">1,000</p></div>
        <div class="p-card"><i class="fas fa-chalkboard-teacher"></i><h4>Staff</h4><p style="font-size: 1.5rem; font-weight: 800;">100</p></div>
        <div class="p-card"><i class="fas fa-building"></i><h4>Occupancy</h4><p style="font-size: 1.5rem; font-weight: 800;">84%</p></div>
        <div class="p-card"><i class="fas fa-briefcase"></i><h4>Placed</h4><p style="font-size: 1.5rem; font-weight: 800; color: var(--acc-primary);">75.2%</p></div>
    `;
}

function initOverviewCharts() {
    const ctx1 = document.getElementById('chart-enrollment').getContext('2d');
    const ctx2 = document.getElementById('chart-dept').getContext('2d');

    charts.enrollment = new Chart(ctx1, {
        type: 'line',
        data: { labels: ['2021', '2022', '2023', '2024', '2025', '2026'], datasets: [{ label: 'Students', data: [150, 320, 580, 840, 950, 1000], borderColor: '#1d4ed8', tension: 0.4 }] }
    });

    charts.dept = new Chart(ctx2, {
        type: 'bar',
        data: { labels: ['CS', 'Electrical', 'Mechanical', 'Business'], datasets: [{ label: 'Avg GPA', data: [3.6, 3.2, 3.4, 3.5], backgroundColor: ['#1d4ed8', '#3b82f6', '#60a5fa', '#93c5fd'] }] }
    });
}

function initStudentChart() {
    const ctx = document.getElementById('chart-student-gpa').getContext('2d');
    charts.studentGpa = new Chart(ctx, {
        type: 'line',
        data: { labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'], datasets: [{ label: 'GPA', data: [3.4, 3.6, 3.8, 3.92], borderColor: '#10b981', fill: true, backgroundColor: 'rgba(16, 185, 129, 0.1)' }] }
    });
}

function renderTable(type, data) {
    const filtered = data.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 50);
    return `
        <div class="table-container animate-fade" style="margin-top: 2rem;">
            <table>
                <thead>
                    <tr><th>Name</th><th>Email</th><th>${type === 'students' ? 'GPA' : 'Rank'}</th><th>Status</th><th>Audit</th></tr>
                </thead>
                <tbody>
                    ${filtered.map(item => `
                        <tr>
                            <td><strong>${item.name}</strong></td>
                            <td>${item.email}</td>
                            <td>${type === 'students' ? item.gpa : item.rank}</td>
                            <td><span style="color: var(--acc-primary)">${item.status}</span></td>
                            <td><button class="btn" style="padding: 4px 12px; font-size: 10px;" onclick="openAudit(${item.id})">AUDIT</button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function handleSearch() {
    searchQuery = document.getElementById('global-search').value;
    if(currentView === 'academic') renderView('academic');
}

function openAudit(id) {
    const s = universityDB.students.find(x => x.id === id);
    document.getElementById('audit-content').innerHTML = `
        <h2>${s.name} (#VITAP${s.id})</h2>
        <p style="margin: 1rem 0;">Dept: ${s.dept} | GPA: ${s.gpa}</p>
        <div class="capacity-bar"><div class="capacity-fill" style="width: ${s.progress}%"></div></div>
    `;
    document.getElementById('audit-modal').style.display = 'flex';
}

function closeAudit() { document.getElementById('audit-modal').style.display = 'none'; }

function togglePresentation(on) {
    const layer = document.getElementById('presentation-layer');
    layer.style.display = on ? 'flex' : 'none';
    if(on) showSlide(0);
}

function showSlide(index) {
    currentSlide = index;
    const slide = universityDB.slides[index];
    const container = document.getElementById('presentation-slides');
    container.innerHTML = `
        <div class="slide-content animate-fade">
            <h1 class="slide-title" style="font-size: 4rem;">${slide.title}</h1>
            <h2 class="slide-subtitle">${slide.subtitle}</h2>
            <p class="slide-desc">${slide.desc}</p>
            <div class="slide-footer">${slide.footer}</div>
        </div>
    `;
}

function nextSlide() { if(currentSlide < universityDB.slides.length - 1) showSlide(currentSlide + 1); else togglePresentation(false); }
function prevSlide() { if(currentSlide > 0) showSlide(currentSlide - 1); }

window.onload = () => switchPortal('admin');
