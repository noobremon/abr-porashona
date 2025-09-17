document.addEventListener("DOMContentLoaded", function() {

    // --- MOCK DATA ---
    const insightsData = {
        academicOverview: {
            gpa: 3.8,
            strongest: "Science",
            weakest: "History",
            radarData: {
                labels: ["Math", "Science", "English", "History", "Geography", "Art"],
                values: [85, 92, 88, 82, 75, 90] 
            }
        },
        attendance: { average: 96, streak: 22, missed: 5 },
        quiz: { mostPlayed: "Science", bestStreak: 15, badges: 3, heatmap: [ 0, 1, 2, 1, 3, 1, 0, 1, 2, 2, 1, 3, 2, 1, 0, 1, 3, 1, 2, 3, 1, 0, 1, 2, 0, 1, 2, 1 ] },
        performanceTrends: { academics: [75, 82, 89], quizzes: [80, 85, 91] },
        engagement: { quizzesAttempted: 12, assignmentsCompleted: 25, events: 2 },
        recommendations: [
            { text: "Encourage more practical experiments in Science to build on their strength.", icon: "fa-flask" },
            { text: "Reading a chapter of a history book daily can help improve their scores.", icon: "fa-book-open" },
            { text: "Excellent progress in Math — keep up the great work!", icon: "fa-thumbs-up" },
        ],
        achievements: [
            { date: "Sep 15, 2025", text: "Won 1st prize in the Science Olympiad." },
            { date: "Sep 1, 2025", text: "Achieved a 15-quiz streak in Math." },
            { date: "Aug 20, 2025", text: "Unlocked the 'Top Scorer' badge in English." },
        ]
    };

    // --- Element Selectors ---
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');

    // --- RENDER FUNCTIONS ---
    function renderAcademicOverview() {
        const container = document.getElementById('academic-overview');
        if (!container) return;
        const data = insightsData.academicOverview;
        const radarPoints = data.radarData.values.map((v, i, a) => {
            const angle = (Math.PI * 2 / a.length) * i - (Math.PI / 2);
            const x = 50 + (v / 100) * 50 * Math.cos(angle);
            const y = 50 + (v / 100) * 50 * Math.sin(angle);
            return `${x}% ${y}%`;
        }).join(', ');

        container.innerHTML = `
            <h3>📘 Academic Overview</h3>
            <div class="radar-chart-container">
                <div class="radar-chart-bg"></div>
                <div class="radar-chart-shape" style="clip-path: polygon(${radarPoints});"></div>
            </div>
            <p><strong>GPA:</strong> <span class="stat-highlight">${data.gpa}</span></p>
            <p><strong>Strongest Subject:</strong> ${data.strongest}</p>
            <p><strong>Weakest Subject:</strong> ${data.weakest}</p>`;
    }

    function renderQuizInsights() {
        const container = document.getElementById('quiz-insights');
        if (!container) return;
        const data = insightsData.quiz;
        const heatmapDays = data.heatmap.map(level => 
            `<div class="heatmap-day study-${level === 1 ? 'low' : level === 2 ? 'mid' : level === 3 ? 'high' : ''}"></div>`
        ).join('');
        container.innerHTML = `
            <h3>🎮 Quiz & Learning</h3>
            <p><strong>Most Played:</strong> ${data.mostPlayed}</p>
            <p><strong>Best Streak:</strong> ${data.bestStreak} questions</p>
            <p><strong>Badges Earned:</strong> ${data.badges}</p>
            <h4>Study Heatmap (Last 28 Days)</h4>
            <div class="heatmap-container">${heatmapDays}</div>`;
    }

    function renderPerformanceTrends() {
        const container = document.getElementById('performance-trends');
        if (!container) return;
        const data = insightsData.performanceTrends;
        const labels = ['July', 'Aug', 'Sep'];
        
        const barsHTML = labels.map((label, i) => `
            <div class="bar-group">
                <div class="bar bar-academics" data-height="${data.academics[i]}"></div>
                <div class="bar bar-quiz" data-height="${data.quizzes[i]}"></div>
                <span class="label">${label}</span>
            </div>`).join('');

        container.innerHTML = `
            <h3>📊 Performance Trends</h3>
            <div class="chart-container">${barsHTML}</div>
            <div class="legend" style="display:flex; justify-content:center; gap:15px; margin-top:30px; font-size:0.8rem;">
                <span style="display:flex; align-items:center; gap:5px;"><div style="width:15px; height:15px; background:var(--blue-mid);"></div>Academics</span>
                <span style="display:flex; align-items:center; gap:5px;"><div style="width:15px; height:15px; background:var(--orange-soft);"></div>Quizzes</span>
            </div>`;
        
        // Animate bar heights after they are in the DOM
        setTimeout(() => {
            container.querySelectorAll('.bar').forEach(bar => {
                bar.style.height = bar.dataset.height + '%';
            });
        }, 100); // Small delay to allow CSS transition
    }
    
    // --- Other Render Functions (Abbreviated for clarity, no changes) ---
    function renderAttendanceInsights() { const c = document.getElementById('attendance-insights'); if(c) c.innerHTML = `<h3><i class="fas fa-calendar-check"></i> Attendance</h3><p>Avg: <span class="stat-highlight">96%</span></p>`; }
    function renderEngagementInsights() { const c = document.getElementById('engagement-insights'); if(c) c.innerHTML = `<h3><i class="fas fa-mouse-pointer"></i> Engagement</h3><p>Quizzes: <span class="stat-highlight">12</span></p>`; }
    function renderRecommendations() { const c = document.getElementById('recommendations'); if(c) c.innerHTML = `<h3>💡 Recommendations</h3><p>${insightsData.recommendations[0].text}</p>`; }
    function renderAchievementsTimeline() { const c = document.getElementById('achievements-timeline'); if(c) c.innerHTML = `<h3>🏅 Timeline</h3><div class="timeline-list"><div class="timeline-item"><strong>${insightsData.achievements[0].date}</strong><p>${insightsData.achievements[0].text}</p></div></div>`; }

    // --- EVENT LISTENERS ---
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => sidebar.classList.toggle('active'));
    }

    // --- INITIAL LOAD & ANIMATIONS ---
    function init() {
        // Call all render functions
        renderAcademicOverview();
        renderAttendanceInsights();
        renderEngagementInsights();
        renderPerformanceTrends();
        renderQuizInsights();
        renderRecommendations();
        renderAchievementsTimeline();

        // Trigger animations by adding a class to the parent
        document.querySelectorAll('.animate-on-load').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }

    init();
});