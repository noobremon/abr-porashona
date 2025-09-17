document.addEventListener("DOMContentLoaded", function() {

    // --- MOCK DATA (Edited for Parent's View) ---
    const academicData = {
        student: {
            name: "Aryan Sharma", rank: 12, class: 9, xp: 1750
        },
        overall: {
            percentage: 88,
            goal: 90
        },
        subjects: [
            { name: "Math", grade: 92, progress: 92, trend: "up" },
            { name: "Science", grade: 95, progress: 95, trend: "up" },
            { name: "English", grade: 85, progress: 85, trend: "down" },
            { name: "History", grade: 81, progress: 81, trend: "up" }
        ],
        marksHistory: {
            weekly: [
                { label: "Mon", score: 85 }, { label: "Tue", score: 90 },
                { label: "Wed", score: 88 }, { label: "Thu", score: 92 }, { label: "Fri", score: 95 }
            ],
            monthly: [
                { label: "May", score: 78 }, { label: "Jun", score: 82 },
                { label: "Jul", score: 85 }, { label: "Aug", score: 88 }
            ]
        },
        attendance: {
            total: 120, present: 115, absent: 5
        },
        achievements: [
            { title: "Top in Science 🏆", unlocked: true, iconColor: "#ffd700" },
            { title: "Improved in Math 📈", unlocked: true, iconColor: "#00b894" },
            { title: "Perfect Attendance ⭐", unlocked: false }
        ],
        insights: {
            strongest: "Science",
            weakest: "History",
            // EDITED: Suggestion rephrased for a parent
            suggestion: "Encouraging more focus on historical timelines could help boost their History grade."
        }
    };

    // --- Element Selectors ---
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');

    // --- Main Render Function ---
    function renderPage() {
        renderHeader(academicData.student);
        renderOverallPerformance(academicData.overall);
        renderGoalTracker(academicData.overall);
        renderAttendance(academicData.attendance);
        renderSubjects(academicData.subjects);
        renderMainChart('weekly'); // Default to weekly
        renderInsightsAndAchievements(academicData.insights, academicData.achievements);
    }

    // --- UI Rendering Functions ---
    function renderHeader(student) {
        document.getElementById('student-name').innerHTML = `Progress Report For: <strong>${student.name}</strong>`;
        document.getElementById('student-rank').innerHTML = `Rank: <strong>#${student.rank}</strong>`;
        document.getElementById('student-class').innerHTML = `Class: <strong>${student.class}</strong>`;
        document.getElementById('student-xp').innerHTML = `XP: <strong>${student.xp}</strong>`;
    }

    function renderOverallPerformance(overall) {
        const circle = document.getElementById('overall-progress-circle');
        const value = document.querySelector('.progress-circle-value');
        if (!circle || !value) return;
        
        value.textContent = `${overall.percentage}%`;
        circle.style.background = `conic-gradient(var(--green-bright) ${overall.percentage * 3.6}deg, #eee 0deg)`;
    }
    
    function renderGoalTracker(overall) {
        const progressText = document.getElementById('goal-progress-text');
        const progressBar = document.getElementById('goal-progress-bar-inner');
        if (!progressText || !progressBar) return;
        
        const progress = Math.min((overall.percentage / overall.goal) * 100, 100);
        // EDITED: Changed label text for clarity
        progressText.parentElement.querySelector('span:first-child').textContent = `Yearly Goal Target: ${overall.goal}%`;
        progressText.textContent = `Current: ${overall.percentage}%`;
        progressBar.style.width = `${progress}%`;
    }

    function renderAttendance(attendance) {
        const presentPercent = Math.round((attendance.present / attendance.total) * 100);
        const absentPercent = 100 - presentPercent;
        document.getElementById('total-days').innerHTML = `${attendance.total}<br>Total Days`;
        document.getElementById('present-percent').innerHTML = `${presentPercent}%<br>Present`;
        document.getElementById('absent-percent').innerHTML = `${absentPercent}%<br>Absent`;
    }

    function renderSubjects(subjects) {
        const grid = document.getElementById('subjects-grid');
        grid.innerHTML = '';
        subjects.forEach(sub => {
            const trendIcon = sub.trend === 'up' ? 'fa-arrow-up' : 'fa-arrow-down';
            const card = document.createElement('div');
            card.className = 'subject-card';
            card.innerHTML = `
                <div class="subject-card-header">
                    <h4>${sub.name}</h4>
                    <span class="trend-indicator ${sub.trend}"><i class="fas ${trendIcon}"></i></span>
                </div>
                <div class="subject-grade">${sub.grade}%</div>
                <div class="subject-progress-bar">
                    <div class="subject-progress-bar-inner" style="width: ${sub.progress}%; background-color: var(--blue-mid);"></div>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    function renderMainChart(period) {
        const container = document.getElementById('marks-chart-container');
        container.innerHTML = '';
        const data = academicData.marksHistory[period];
        if (!data) return;

        data.forEach(item => {
            const barWrapper = document.createElement('div');
            barWrapper.className = 'bar';
            setTimeout(() => { barWrapper.style.height = `${item.score}%`; }, 100);
            barWrapper.innerHTML = `<span class="label">${item.label}</span>`;
            container.appendChild(barWrapper);
        });
    }

    function renderInsightsAndAchievements(insights, achievements) {
        const insightsContent = document.getElementById('insights-content');
        insightsContent.innerHTML = `
            <p><strong>Strongest Subject:</strong> ${insights.strongest}</p>
            <p><strong>Area to Improve:</strong> ${insights.weakest}</p>
            <p><strong>Suggestion:</strong> ${insights.suggestion}</p>
        `;

        const achievementsList = document.getElementById('achievements-list');
        achievementsList.innerHTML = '';
        achievements.filter(a => a.unlocked).forEach(ach => {
            const icon = document.createElement('i');
            icon.className = 'fas fa-shield-alt achievement-badge';
            icon.style.color = ach.iconColor || 'var(--orange-soft)';
            icon.title = ach.title;
            achievementsList.appendChild(icon);
        });
    }

    // --- Event Listeners ---
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => sidebar.classList.toggle('active'));
    }

    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderMainChart(this.getAttribute('data-period'));
        });
    });

    // --- Initial Load ---
    renderPage();
    document.querySelectorAll('.animate-on-load').forEach((el, index) => {
        setTimeout(() => el.classList.add('visible'), index * 150);
    });
});