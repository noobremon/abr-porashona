document.addEventListener("DOMContentLoaded", function() {

    // --- MOCK DATA ---
    const resultsData = {
        quizResults: [
            { subject: "Science", title: "Cell Structure Quiz", date: "2025-09-15", score: 95, badge: "fas fa-award" },
            { subject: "Math", title: "Algebra Basics", date: "2025-09-12", score: 82, badge: null },
            { subject: "English", title: "Vocabulary Test", date: "2025-09-10", score: 88, badge: "fas fa-medal" },
        ],
        academicResults: {
            term: "Mid-Term",
            overallPercentage: 89,
            subjects: [
                { name: "Science", marks: 92, max: 100, grade: "A+" },
                { name: "Math", marks: 85, max: 100, grade: "A" },
                { name: "English", marks: 88, max: 100, grade: "A" },
                { name: "History", marks: 82, max: 100, grade: "B+" },
            ],
            remarks: "Aryan is showing excellent progress, especially in Science. Consistent effort in History will yield even better results.",
            achievements: [
                { title: "Top Scorer in Science 🏆", color: "#ffd700" },
                { title: "Consistent Performer 🏅", color: "#c0c0c0" },
            ]
        },
        quizTrend: [ { label: "Jul", score: 78 }, { label: "Aug", score: 85 }, { label: "Sep", score: 91 } ]
    };

    // --- Element Selectors ---
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const tabs = document.querySelectorAll('.tab-btn');
    const views = document.querySelectorAll('.view');
    const downloadBtn = document.getElementById('download-report-btn');

    // --- RENDER FUNCTIONS ---
    function renderQuizView() {
        try {
            const quizList = document.getElementById('quiz-list');
            const bestPerf = document.getElementById('best-quiz-performance');
            const improvementArea = document.getElementById('quiz-improvement-area');

            if (!quizList || !bestPerf || !improvementArea) return;

            quizList.innerHTML = '';
            resultsData.quizResults.forEach(quiz => {
                quizList.innerHTML += `
                    <div class="quiz-card">
                        ${quiz.badge ? `<i class="quiz-card-badge ${quiz.badge}" style="color: var(--gold);"></i>` : `<i class="quiz-card-badge fas fa-book-open"></i>`}
                        <div class="quiz-card-details">
                            <h4>${quiz.subject}: ${quiz.title}</h4>
                            <p>Date: ${quiz.date}</p>
                        </div>
                        <div class="quiz-card-score">${quiz.score}%</div>
                    </div>
                `;
            });

            bestPerf.textContent = `Best Performance: Science (95%)`;
            improvementArea.textContent = `Improvement Area: Math (82%)`;
            renderChart('quiz-trend-chart', resultsData.quizTrend);
        } catch (error) {
            console.error("Error rendering quiz view:", error);
        }
    }

    function renderAcademicView() {
        try {
            const academicData = resultsData.academicResults;
            const circle = document.getElementById('overall-progress-circle');
            const value = circle.querySelector('.progress-circle-value');
            const remarks = document.getElementById('teacher-remarks');
            const grid = document.getElementById('subject-results-grid');
            const achievementsList = document.getElementById('achievements-list');

            if (!circle || !value || !remarks || !grid || !achievementsList) return;

            value.textContent = `${academicData.overallPercentage}%`;
            circle.style.background = `conic-gradient(var(--green-bright) ${academicData.overallPercentage * 3.6}deg, #eee 0deg)`;
            remarks.textContent = academicData.remarks;

            grid.innerHTML = '';
            academicData.subjects.forEach(subject => {
                grid.innerHTML += `
                    <div class="subject-result-card">
                        <h4>${subject.name}</h4>
                        <p class="marks">${subject.marks} / ${subject.max}</p>
                        <span class="grade" style="background-color: #e0f7fa; color: #007bff;">Grade: ${subject.grade}</span>
                    </div>
                `;
            });
            
            achievementsList.innerHTML = '';
            academicData.achievements.forEach(ach => {
                achievementsList.innerHTML += `<i class="fas fa-shield-alt achievement-badge" title="${ach.title}" style="color: ${ach.color};"></i>`;
            });
        } catch (error) {
            console.error("Error rendering academic view:", error);
        }
    }

    // --- CHART RENDERER (FIXED) ---
    function renderChart(containerId, data) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = ''; 
        
        if (!data || data.length === 0) {
            container.innerHTML = '<p>No chart data available.</p>';
            return;
        }

        data.forEach(item => {
            const barWrapper = document.createElement('div');
            barWrapper.className = 'chart-bar';
            
            // Set initial height to 0, then transition to the actual height
            barWrapper.style.height = '0%';
            setTimeout(() => {
                barWrapper.style.height = `${item.score}%`;
            }, 50);

            barWrapper.innerHTML = `
                <span class="value">${item.score}%</span>
                <span class="label">${item.label}</span>
            `;
            container.appendChild(barWrapper);
        });
    }

    // --- EVENT LISTENERS (FIXED) ---
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => sidebar.classList.toggle('active'));
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetViewId = tab.getAttribute('data-view');
            
            // 1. Update active tab button
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // 2. Switch active view panel
            views.forEach(view => {
                if (view.id === targetViewId) {
                    view.classList.add('active-view');
                } else {
                    view.classList.remove('active-view');
                }
            });
            
            // 3. Render content for the newly active view
            if (targetViewId === 'quiz-results') {
                renderQuizView();
            } else if (targetViewId === 'academic-results') {
                renderAcademicView();
            }
        });
    });
    
    if(downloadBtn) {
        downloadBtn.addEventListener('click', () => { window.print(); });
    }

    // --- INITIAL LOAD ---
    // Render the default view (Quiz Results) when the page first loads.
    renderQuizView();
});