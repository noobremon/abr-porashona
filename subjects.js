document.addEventListener("DOMContentLoaded", function() {

    // --- MOCK DATABASE ---
    const subjectsDB = {
        "9": {
            "CBSE": [
                { id: "math9", name: "Math", icon: "fas fa-calculator", color: "#6c5ce7",
                  lessons: [{ title: "Algebra Basics" }, { title: "Geometry Intro" }],
                  quizzes: [{ title: "Algebra Quiz", xp: 50 }],
                  assignments: [{ title: "Chapter 2 Problems" }],
                  progressData: [{ label: "Jul", score: 75 }, { label: "Aug", score: 82 }],
                  badges: [{ title: "Algebra Adept", icon: "fas fa-medal" }]
                },
                { id: "sci9", name: "Science", icon: "fas fa-flask", color: "#00b894", 
                  lessons: [{ title: "Cell Structure" }, { title: "Laws of Motion" }],
                  quizzes: [{ title: "Biology Quiz", xp: 50 }],
                  assignments: [{ title: "Lab Report 1" }],
                  progressData: [{ label: "Jul", score: 80 }, { label: "Aug", score: 88 }],
                  badges: [{ title: "Biology Buff", icon: "fas fa-award" }]
                }
            ]
        },
        "10": {
            "CBSE": [
                 { id: "phy10", name: "Physics", icon: "fas fa-atom", color: "#e17055", lessons: [], quizzes: [], assignments: [], progressData: [], badges: [] }
            ]
        }
    };
    const studentInfo = { name: "Aryan Sharma", class: "9", board: "CBSE" };

    // --- STATE MANAGEMENT ---
    let currentState = {
        class: "9",
        board: "CBSE",
        selectedSubject: null // e.g., "math9"
    };

    // --- ELEMENT SELECTORS ---
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const studentInfoDiv = document.getElementById('student-info');
    const classFilter = document.getElementById('class-filter');
    const boardFilter = document.getElementById('board-filter');
    const selectionView = document.getElementById('subject-selection-view');
    const dashboardView = document.getElementById('subject-dashboard-view');
    const subjectsGrid = document.getElementById('subjects-grid');
    const backBtn = document.getElementById('back-to-subjects-btn');
    const dashboardTabs = document.querySelector('.dashboard-tabs');
    const dashboardContent = document.getElementById('dashboard-content');
    const subjectTitleHeader = document.getElementById('subject-title-header');
    
    // --- MAIN RENDER FUNCTION ---
    function render() {
        // Render header
        studentInfoDiv.innerHTML = `${studentInfo.name} | Class: ${currentState.class} | ${currentState.board}`;

        if (currentState.selectedSubject) {
            selectionView.classList.remove('active-view');
            dashboardView.classList.add('active-view');
            renderSubjectDashboard();
        } else {
            dashboardView.classList.remove('active-view');
            selectionView.classList.add('active-view');
            renderSubjectSelection();
        }
    }

    // --- VIEW RENDERERS ---
    function renderSubjectSelection() {
        const subjects = subjectsDB[currentState.class]?.[currentState.board] || [];
        subjectsGrid.innerHTML = '';
        subjects.forEach(subject => {
            const card = document.createElement('div');
            card.className = 'subject-card';
            card.dataset.subjectId = subject.id;
            card.innerHTML = `
                <div class="subject-card-inner">
                    <div class="subject-card-front" style="border-color:${subject.color};">
                        <i class="${subject.icon}" style="color:${subject.color};"></i>
                        <h3>${subject.name}</h3>
                    </div>
                    <div class="subject-card-back" style="background-color:${subject.color};">
                        <h4>${subject.lessons.length} Lessons | ${subject.quizzes.length} Quizzes</h4>
                        <p>Ready to start learning?</p>
                        <button class="btn-start" style="color:${subject.color};">Start Learning</button>
                    </div>
                </div>`;
            subjectsGrid.appendChild(card);
        });
    }

    function renderSubjectDashboard() {
        const subject = (subjectsDB[currentState.class]?.[currentState.board] || []).find(s => s.id === currentState.selectedSubject);
        if (!subject) return;

        subjectTitleHeader.innerHTML = `<i class="${subject.icon}" style="color:${subject.color};"></i> ${subject.name}`;
        
        // Default to the 'lessons' tab
        renderTabContent(subject, 'lessons');
        document.querySelectorAll('.dashboard-tabs .tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === 'lessons');
        });
    }

    function renderTabContent(subject, tabName) {
        let contentHTML = '';
        switch(tabName) {
            case 'lessons':
                contentHTML = `<div class="content-grid">${subject.lessons.map(l => `<div class="content-card"><h4>📖 ${l.title}</h4></div>`).join('') || '<p>No lessons available yet.</p>'}</div>`;
                break;
            case 'quizzes':
                contentHTML = `<div class="content-grid">${subject.quizzes.map(q => `<div class="content-card"><h4>🎮 ${q.title}</h4><p>+${q.xp} XP</p><button class="btn-start">Start Quiz</button></div>`).join('') || '<p>No quizzes available yet.</p>'}</div>`;
                break;
            case 'assignments':
                contentHTML = `<div class="content-grid">${subject.assignments.map(a => `<div class="content-card"><h4>📝 ${a.title}</h4></div>`).join('') || '<p>No assignments available yet.</p>'}</div>`;
                break;
            case 'progress':
                contentHTML = `<div class="content-card"><h4>📊 Progress Tracker</h4><p>Chart for ${subject.name} coming soon!</p></div>`;
                break;
            case 'badges':
                 contentHTML = `<div class="content-grid">${subject.badges.map(b => `<div class="content-card"><h4><i class="${b.icon}"></i> ${b.title}</h4></div>`).join('') || '<p>No badges earned yet.</p>'}</div>`;
                break;
        }
        dashboardContent.innerHTML = contentHTML;
    }

    // --- EVENT LISTENERS ---
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => sidebar.classList.toggle('active'));
    }

    classFilter.addEventListener('change', (e) => {
        currentState.class = e.target.value;
        render();
    });
    
    boardFilter.addEventListener('change', (e) => {
        currentState.board = e.target.value;
        render();
    });

    subjectsGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.subject-card');
        if (card) {
            currentState.selectedSubject = card.dataset.subjectId;
            render();
        }
    });

    backBtn.addEventListener('click', () => {
        currentState.selectedSubject = null;
        render();
    });

    dashboardTabs.addEventListener('click', (e) => {
        if (e.target.classList.contains('tab-btn')) {
            const tabName = e.target.dataset.tab;
            document.querySelectorAll('.dashboard-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            const subject = (subjectsDB[currentState.class]?.[currentState.board] || []).find(s => s.id === currentState.selectedSubject);
            renderTabContent(subject, tabName);
        }
    });

    // --- INITIAL LOAD ---
    render();
});