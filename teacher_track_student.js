document.addEventListener("DOMContentLoaded", function() {

    // --- MOCK DATABASE ---
    const studentsDB = {
        "9-A": [
            { id: 101, name: "Aryan Sharma", roll: "101", class: "9", section: "A", board: "CBSE", avatar: "https://placehold.co/100x100/74b9ff/ffffff?text=AS", parentContact: "123-456-7890",
              academics: [ { subject: "Physics", grade: "A+" }, { subject: "Math", grade: "A" } ],
              attendance: { overall: "95%", streak: "22 days" },
              quizzes: { trend: "Improving", badges: 5 },
              notes: "Excellent progress in the last unit test."
            },
            { id: 102, name: "Priya Singh", roll: "102", class: "9", section: "A", board: "CBSE", avatar: "https://placehold.co/100x100/ff7675/ffffff?text=PS", parentContact: "234-567-8901",
              academics: [ { subject: "Physics", grade: "B+" }, { subject: "Math", grade: "A" } ],
              attendance: { overall: "92%", streak: "15 days" },
              quizzes: { trend: "Stable", badges: 3 },
              notes: ""
            }
        ],
        // Add more classes/sections as needed
    };

    // --- ELEMENT SELECTORS ---
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const searchResultsContainer = document.getElementById('student-search-results');
    const selectionView = document.getElementById('student-selection-view');
    const profileView = document.getElementById('student-profile-view');
    const backBtn = document.getElementById('back-to-search-btn');
    const nameRollSearch = document.getElementById('name-roll-search');

    // --- STATE ---
    let selectedStudent = null;

    // --- RENDER FUNCTIONS ---
    function renderStudentList(filter = '') {
        const students = studentsDB["9-A"] || []; // Default to one class for demo
        searchResultsContainer.innerHTML = '';
        
        const filteredStudents = students.filter(s => 
            s.name.toLowerCase().includes(filter) || s.roll.includes(filter)
        );

        if (filteredStudents.length === 0) {
            searchResultsContainer.innerHTML = '<p>No students found.</p>';
            return;
        }

        filteredStudents.forEach(student => {
            const card = document.createElement('div');
            card.className = 'student-list-card';
            card.dataset.studentId = student.id;
            card.innerHTML = `
                <img src="${student.avatar}" alt="${student.name}">
                <div>
                    <h4>${student.name}</h4>
                    <p>Roll: ${student.roll} | Class: ${student.class}-${student.section}</p>
                </div>`;
            searchResultsContainer.appendChild(card);
        });
    }

    function renderProfile(student) {
        if (!student) return;

        // Populate Profile Card
        const profileCard = document.getElementById('profile-card');
        profileCard.innerHTML = `
            <img src="${student.avatar}" alt="${student.name}">
            <h2>${student.name}</h2>
            <p>Roll: ${student.roll} | Class: ${student.class}-${student.section} | Board: ${student.board}</p>
            <button id="view-contact" class="btn-action remark">View Parent Contact</button>
            <div id="contact-info" class="contact-info">
                <p><strong>Parent Contact:</strong> ${student.parentContact}</p>
            </div>`;
        
        // Populate Quick Actions
        const quickActions = document.getElementById('quick-actions');
        quickActions.innerHTML = `
            <h3>Quick Actions</h3>
            <div class="action-btn-group">
                <button class="action-btn message"><i class="fas fa-envelope"></i> Message Parent</button>
                <button class="action-btn remark"><i class="fas fa-edit"></i> Add Remark</button>
                <button class="action-btn ptm"><i class="fas fa-calendar-alt"></i> Schedule PTM</button>
            </div>`;
        
        // Initial tab render
        renderTabContent(student, 'academics');
        
        // Add event listener for parent contact toggle
        document.getElementById('view-contact').addEventListener('click', function() {
            document.getElementById('contact-info').classList.toggle('visible');
            this.textContent = this.textContent.includes('View') ? 'Hide Parent Contact' : 'View Parent Contact';
        });
    }
    
    function renderTabContent(student, tabName) {
        const contentContainer = document.getElementById('insights-content');
        let html = '';

        switch (tabName) {
            case 'academics':
                const subjectsHTML = student.academics.map(s => `<li><strong>${s.subject}:</strong> Grade ${s.grade}</li>`).join('');
                html = `<div class="insight-section"><h4>🎓 Academic Performance</h4><ul>${subjectsHTML}</ul></div>`;
                break;
            case 'attendance':
                html = `<div class="insight-section"><h4>⏰ Attendance Overview</h4><p><strong>Overall:</strong> ${student.attendance.overall}</p><p><strong>Best Streak:</strong> ${student.attendance.streak}</p></div>`;
                break;
            case 'quizzes':
                html = `<div class="insight-section"><h4>🏆 Quiz Performance</h4><p><strong>Performance Trend:</strong> ${student.quizzes.trend}</p><p><strong>Badges Earned:</strong> ${student.quizzes.badges}</p></div>`;
                break;
            case 'notes':
                html = `<div class="insight-section"><h4>💬 Parent-Teacher Notes</h4><textarea class="notes-area">${student.notes}</textarea><button class="action-btn remark" style="margin-top:10px;">Save Note</button></div>`;
                break;
        }
        contentContainer.innerHTML = html;
    }

    // --- EVENT LISTENERS ---
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => sidebar.classList.toggle('active'));
    }

    nameRollSearch.addEventListener('keyup', (e) => {
        renderStudentList(e.target.value.toLowerCase());
    });

    searchResultsContainer.addEventListener('click', (e) => {
        const card = e.target.closest('.student-list-card');
        if (card) {
            const studentId = parseInt(card.dataset.studentId);
            selectedStudent = (studentsDB["9-A"] || []).find(s => s.id === studentId);
            
            selectionView.classList.remove('active-view');
            profileView.classList.add('active-view');
            renderProfile(selectedStudent);
        }
    });

    backBtn.addEventListener('click', () => {
        profileView.classList.remove('active-view');
        selectionView.classList.add('active-view');
        selectedStudent = null;
    });

    document.querySelector('.insights-tabs').addEventListener('click', (e) => {
        if (e.target.classList.contains('tab-btn')) {
            document.querySelectorAll('.insights-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            renderTabContent(selectedStudent, e.target.dataset.tab);
        }
    });

    // --- INITIAL LOAD ---
    renderStudentList();
});