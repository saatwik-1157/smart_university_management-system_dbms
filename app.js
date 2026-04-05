/* VITAP Enterprise Unified Master Hub Logic (Consolidated V3) */

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
        { title: "Mega-Scale Expansion", subtitle: "1,100+ Live Entities", desc: "Successfully scaled the relational database from 10 to 1,000+ student records with zero latency.", footer: "DB Architecture: V.Saatwik Sairaam" },
        { title: "Triple-Portal Ecosystem", subtitle: "Unified Admin, Faculty, & Student Portals", desc: "Each portal tailored with specific analytic views, GPA history, and workload tracking.", footer: "Enterprise V3 Master Build" },
        { title: "Smart Intelligence", subtitle: "AI Analytics & Mapping", desc: "Mock AI predictors and real-time campus occupancy tracking across major building blocks.", footer: "DBMS Final Presentation" }
    ]
};

let currentView = 'overview';
let activeRole = 'admin';
let searchQuery = '';
let currentSlide = 0;

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
    document.querySelectorAll('.p-card-overview').forEach(c => c.style.display = 'none');

    let html = '';
    switch(view) {
        case 'overview':
            title.innerText = 'University Command Hub';
            desc.innerText = 'Real-time oversight for VITAP infrastructure.';
            html = renderStats();
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
                    <div class="p-card"><h3>GPA</h3><p style="font-size: 2rem; color: var(--acc-primary);">3.92</p></div>
                    <div class="p-card"><h3>Attendance</h3><p style="font-size: 2rem; color: var(--acc-primary);">94.5%</p></div>
                    <div class="p-card"><h3>Progress</h3><p style="font-size: 2rem; color: var(--acc-primary);">72%</p></div>
                </div>
                <button class="btn" style="margin-top: 2rem;" onclick="alert('PDF Transcript Generated!')">Download Final Transcript</button>
            `;
            break;
        case 'faculty-dashboard':
            title.innerText = 'Faculty Academic Center';
            desc.innerText = 'Prof. Robert Williams | CSE';
            html = `
                <div class="portal-grid">
                    <div class="p-card"><h3>Students</h3><p style="font-size: 2rem; color: var(--acc-primary);">142</p></div>
                    <div class="p-card"><h3>Marking</h3><p style="font-size: 2rem; color: var(--acc-primary);">82% Done</p></div>
                    <div class="p-card"><h3>Reseach</h3><p style="font-size: 2rem; color: var(--acc-primary);">42 / 50</p></div>
                </div>
            `;
            break;
        default:
            html = `<div class="p-card">View Under Construction</div>`;
    }
    root.innerHTML = html;
}

function renderStats() {
    return `
        <div class="portal-grid animate-fade">
            <div class="p-card"><i class="fas fa-users"></i><h4>Enrollment</h4><p>1,000</p></div>
            <div class="p-card"><i class="fas fa-chalkboard-teacher"></i><h4>Staff</h4><p>100</p></div>
            <div class="p-card"><i class="fas fa-building"></i><h4>Occupancy</h4><p>84%</p></div>
            <div class="p-card"><i class="fas fa-briefcase"></i><h4>Placed</h4><p>75.2%</p></div>
        </div>
    `;
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

/* Presentation Logic */
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
            <h1 class="slide-title">${slide.title}</h1>
            <h2 class="slide-subtitle">${slide.subtitle}</h2>
            <p class="slide-desc">${slide.desc}</p>
            <div class="slide-footer">${slide.footer}</div>
        </div>
    `;
}

function nextSlide() { if(currentSlide < universityDB.slides.length - 1) showSlide(currentSlide + 1); else togglePresentation(false); }
function prevSlide() { if(currentSlide > 0) showSlide(currentSlide - 1); }

window.onload = () => switchPortal('admin');
