document.addEventListener("DOMContentLoaded", function() {

    // --- ENHANCED MOCK DATA ---
    const quizData = {
        summaryStats: { quizzesTaken: 12, averageScore: 88, bestSubject: "Science" },
        xp: { current: 1750, nextLevel: 2000, level: 5 },
        achievements: [
            { id: 1, title: "5 Quizzes Completed", icon: "fa-list-check" },
            { id: 2, title: "1000 XP Scored", icon: "fa-star" },
            { id: 3, title: "Science Whiz", icon: "fa-flask" }
        ],
        scoreHistory: {
            weekly: [ { label: "Mon", score: 80 }, { label: "Tue", score: 95 }, { label: "Wed", score: 85 }, { label: "Thu", score: 90 }, { label: "Fri", score: 92 } ],
            monthly: [ { label: "Week 1", score: 75 }, { label: "Week 2", score: 85 }, { label: "Week 3", score: 82 }, { label: "Week 4", score: 90 } ]
        },
        reviewQuestions: [
            {
                isCorrect: false, subject: "Science", question: "What is the powerhouse of the cell?",
                userAnswer: "Nucleus", correctAnswer: "Mitochondria",
                explanation: "The Mitochondria generates most of the cell's ATP, which is used for energy.",
                motivation: "Almost there! This is a common mix-up in biology."
            },
            {
                isCorrect: false, subject: "Math", question: "What is 12 * 12?",
                userAnswer: "142", correctAnswer: "144",
                explanation: "12 multiplied by 12 is 144. It helps to memorize the square of numbers up to 15!",
                motivation: ""
            },
            {
                isCorrect: true, subject: "English", question: "Which word is a synonym for 'happy'?",
                userAnswer: "Joyful", correctAnswer: "Joyful",
                explanation: "'Joyful' means feeling, expressing, or causing great pleasure and happiness.",
                motivation: "Perfect! You've mastered this concept."
            }
        ]
    };

    // --- State ---
    let reviewedCount = 0;
    const totalQuestionsToReview = quizData.reviewQuestions.length;

    // --- Element Selectors ---
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');

    // --- Main Render Function ---
    function renderPage() {
        renderSummary(quizData.summaryStats);
        renderXP(quizData.xp);
        renderAchievements(quizData.achievements);
        renderProgressChart('weekly');
        renderReviewSection(quizData.reviewQuestions);
        updateMiniXPBar();
    }

    // --- REBUILT: Review Section Renderer for Flip Cards ---
    function renderReviewSection(questions) {
        const container = document.getElementById('review-container');
        if (!container) return;
        container.innerHTML = '';

        const subjectIcons = {
            "Science": "fas fa-atom", "Math": "fas fa-calculator", "English": "fas fa-book"
        };

        questions.forEach((q) => {
            const cardWrapper = document.createElement('div');
            cardWrapper.className = 'flip-card';
            cardWrapper.dataset.reviewed = "false";
            if (q.isCorrect) cardWrapper.classList.add('celebrate');

            let answerBlockHTML = q.isCorrect ? `
                <div class="answer-block correct-answer">
                    <i class="fas fa-check-circle"></i>
                    <span>Your Answer: ${q.userAnswer}</span>
                </div>` : `
                <div class="answer-block user-answer wrong">
                    <i class="fas fa-times-circle"></i>
                    <span>Your Answer: ${q.userAnswer}</span>
                </div>
                <div class="answer-block correct-answer">
                    <i class="fas fa-check-circle"></i>
                    <span>Correct Answer: ${q.correctAnswer}</span>
                </div>`;

            cardWrapper.innerHTML = `
                <div class="flip-card-inner">
                    <div class="flip-card-front">
                        <i class="${subjectIcons[q.subject] || 'fas fa-question-circle'} subject-icon"></i>
                        <p class="question-text">${q.question}</p>
                        <span class="flip-prompt">(Click to Reveal)</span>
                    </div>
                    <div class="flip-card-back">
                        ${answerBlockHTML}
                        <p class="explanation"><strong>Hint:</strong> ${q.explanation}</p>
                        ${q.motivation ? `<p class="motivation-text">${q.motivation}</p>` : ''}
                    </div>
                </div>`;
            container.appendChild(cardWrapper);
        });
        
        // Add event listeners to the new flip cards
        document.querySelectorAll('.flip-card').forEach(card => {
            card.addEventListener('click', () => {
                card.classList.toggle('is-flipped');
                if (card.dataset.reviewed === "false") {
                    reviewedCount++;
                    updateMiniXPBar();
                    card.dataset.reviewed = "true";
                }
            });
        });
    }
    
    function updateMiniXPBar() {
        const xpPercentage = (reviewedCount / totalQuestionsToReview) * 100;
        const bar = document.getElementById('mini-xp-bar-inner');
        if(bar) bar.style.width = `${xpPercentage}%`;
    }
    
    // --- Event Listeners & Other Functions (Unchanged) ---
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => sidebar.classList.toggle('active'));
    }

    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderProgressChart(this.getAttribute('data-period'));
        });
    });

    function renderSummary(stats) {
        document.getElementById('quizzes-taken').textContent = stats.quizzesTaken;
        document.getElementById('avg-score').textContent = `${stats.averageScore}%`;
        document.getElementById('best-subject').textContent = stats.bestSubject;
    }

    function renderXP(xp) {
        document.getElementById('student-level').textContent = `Level: ${xp.level}`;
        const xpPercentage = (xp.current / xp.nextLevel) * 100;
        document.getElementById('xp-bar-inner').style.width = `${xpPercentage}%`;
    }

    function renderAchievements(achievements) {
        const list = document.getElementById('achievements-list');
        list.innerHTML = '';
        achievements.forEach(ach => {
            const icon = document.createElement('i');
            icon.className = `fas ${ach.icon} achievement-badge`;
            icon.title = ach.title;
            list.appendChild(icon);
        });
    }
    
    function renderProgressChart(period) {
        const container = document.getElementById('progress-chart-container');
        container.innerHTML = '';
        const data = quizData.scoreHistory[period];
        if (!data) return;
        data.forEach(item => {
            const barWrapper = document.createElement('div');
            barWrapper.className = 'bar';
            setTimeout(() => { barWrapper.style.height = `${item.score}%`; }, 100);
            barWrapper.innerHTML = `<span class="label">${item.label}</span>`;
            container.appendChild(barWrapper);
        });
    }

    // --- Initial Load ---
    renderPage();
    document.querySelectorAll('.animate-on-load').forEach((el, index) => {
        setTimeout(() => el.classList.add('visible'), index * 100);
    });
});