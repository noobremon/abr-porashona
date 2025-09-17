document.addEventListener("DOMContentLoaded", function() {

    // --- ADVANCED MOCK DATABASE (FULLY POPULATED) ---
    const subjectsDB = {
        "10": { "CBSE": [
            { id: "phy10", name: "Physics", icon: "fas fa-atom", color: "#e17055", xp: 60,
              chapters: [
                  { title: "Chapter 1: Light", topics: [
                      { id:"phy10_1_1", type: 'video', title: 'Intro to Reflection', duration: '12:45' },
                      { id:"phy10_1_2", type: 'notes', title: 'Reflection Notes PDF' },
                      { id:"phy10_1_3", type: 'quiz', title: 'Reflection Quiz', xp: 50, questions: Array.from({ length: 20 }, (_, i) => ({
                          q: `Physics Q${i + 1}: What is the law of reflection?`, options: [`i > r`, `i = r`, `i < r`], answer: 1, explanation: `The angle of incidence (i) is always equal to the angle of reflection (r).`
                      }))}
                  ]},
                  { title: "Chapter 2: The Human Eye", topics: [] }
              ],
              badges: [{ id: 'phy_badge_1', title: "Physics Pioneer", icon: "fas fa-lightbulb" }]
            },
            { id: "chem10", name: "Chemistry", icon: "fas fa-flask", color: "#0984e3", xp: 30, 
              chapters: [{ title: "Chapter 1: Chemical Reactions", topics: [
                  { id:"chem10_1_1", type: 'video', title: 'Types of Reactions', duration: '15:20' },
                  { id:"chem10_1_2", type: 'quiz', title: 'Reactions Quiz', xp: 40, questions: [
                      { q: "What is H2O?", options: ["Salt", "Water", "Acid"], answer: 1, explanation: "H2O is the chemical formula for water." },
                      { q: "What does NaCl stand for?", options: ["Sodium Chloride", "Nitrogen", "Carbon"], answer: 0, explanation: "It's common table salt." },
                      { q: "Balancing equations conserves what?", options: ["Energy", "Mass", "Momentum"], answer: 1, explanation: "The law of conservation of mass." }
                  ]}
              ]}], 
              badges: [] 
            },
            { id: "math10", name: "Math", icon: "fas fa-calculator", color: "#6c5ce7", xp: 85, 
              chapters: [{ title: "Chapter 1: Trigonometry", topics: [
                  { id:"math10_1_1", type: 'notes', title: 'Trigonometry Formulas' },
                  { id:"math10_1_2", type: 'quiz', title: 'Trigonometry Quiz', xp: 70, questions: [
                      { q: "sin(90 degrees) = ?", options: ["0", "1", "-1"], answer: 1, explanation: "The sine of 90 degrees is 1." },
                      { q: "cos(0 degrees) = ?", options: ["0", "1", "-1"], answer: 1, explanation: "The cosine of 0 degrees is 1." },
                      { q: "tan(45 degrees) = ?", options: ["0", "1", "-1"], answer: 1, explanation: "The tangent of 45 degrees is 1." }
                  ]}
              ]}], 
              badges: [] 
            }
        ]},
        "9": { "CBSE": [
            { id: "math9", name: "Math", icon: "fas fa-calculator", color: "#6c5ce7", xp: 75, 
              chapters: [{ title: "Chapter 1: Number Systems", topics: [
                  { id:"math9_1_1", type: 'quiz', title: 'Number Systems Quiz', xp: 50, questions: [
                      { q: "Is Pi a rational number?", options: ["Yes", "No"], answer: 1, explanation: "Pi is an irrational number." },
                      { q: "What is the square root of 81?", options: ["7", "8", "9"], answer: 2, explanation: "9 * 9 = 81." }
                  ]}
              ]}], 
              badges: [] 
            },
            { id: "sci9", name: "Science", icon: "fas fa-flask", color: "#00b894", xp: 90, 
              chapters: [{ title: "Chapter 1: The Cell", topics: [
                  { id:"sci9_1_1", type: 'video', title: 'Discovering the Cell', duration: '10:00' },
                  { id:"sci9_1_2", type: 'quiz', title: 'Cell Organelles Quiz', xp: 45, questions: [
                      { q: "Which organelle is the control center?", options: ["Mitochondria", "Nucleus", "Ribosome"], answer: 1, explanation: "The nucleus contains the cell's genetic material." }
                  ]}
              ]}], 
              badges: [] 
            },
            { id: "ss9", name: "Social Science", icon: "fas fa-globe-asia", color: "#fdcb6e", xp: 40, 
              chapters: [{ title: "Chapter 1: French Revolution", topics: [
                  { id:"ss9_1_1", type: 'quiz', title: 'Revolution Quiz', xp: 30, questions: [
                      { q: "When did the French Revolution start?", options: ["1789", "1889", "1689"], answer: 0, explanation: "The French Revolution started in 1789 with the storming of the Bastille." }
                  ]}
              ]}], 
              badges: [] 
            },
        ]}
    };
    
    // --- PLAYER DATA & STATE ---
    let playerData = JSON.parse(localStorage.getItem('playerData')) || { name: "Ananya", rank: 12, xp: 2500, streak: 5, completed: ['phy10_1_1'] };
    let state = { class: "10", board: "CBSE", selectedSubjectId: null, activeTab: 'lessons' };
    let quizState = { currentQuiz: null, currentIndex: 0, userAnswers: [], score: 0 };

    // --- ELEMENT SELECTORS ---
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const headerDetails = document.getElementById('header-details');
    const classFilter = document.getElementById('class-filter');
    const boardFilter = document.getElementById('board-filter');
    const selectionView = document.getElementById('subject-selection-view');
    const dashboardView = document.getElementById('subject-dashboard-view');
    const subjectsGrid = document.getElementById('subjects-grid');
    const backBtn = document.getElementById('back-to-subjects-btn');
    const dashboardTabs = document.querySelector('.dashboard-tabs');
    const dashboardContent = document.getElementById('dashboard-main-content');
    const subjectTitleHeader = document.getElementById('subject-title-header');
    const modal = document.getElementById('game-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    // --- MAIN RENDER FUNCTION ---
    function render() {
        headerDetails.innerHTML = `<div class="student-info">${playerData.name} | Cl ${state.class} | Rank #${playerData.rank}</div>
                                   <p class="tagline">🔥 ${playerData.streak}-Day Learning Streak!</p>`;
        if (state.selectedSubjectId) {
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
        const subjects = subjectsDB[state.class]?.[state.board] || [];
        subjectsGrid.innerHTML = '';
        subjects.forEach(subject => {
            const card = document.createElement('div');
            card.className = 'subject-card';
            card.style.borderColor = subject.color;
            card.innerHTML = `
                <div class="subject-card-header">
                    <i class="${subject.icon}" style="color:${subject.color};"></i>
                    <h3>${subject.name}</h3>
                </div>
                <div class="subject-progress">
                    <p>${subject.xp}% XP Complete</p>
                    <div class="xp-bar"><div class="xp-bar-inner" style="width:${subject.xp}%;"></div></div>
                </div>
                <button class="btn-start">Start Learning</button>`;
            card.addEventListener('click', () => { state.selectedSubjectId = subject.id; render(); });
            subjectsGrid.appendChild(card);
        });
    }

    function renderSubjectDashboard() {
        const subject = (subjectsDB[state.class]?.[state.board] || []).find(s => s.id === state.selectedSubjectId);
        if (!subject) return;
        subjectTitleHeader.innerHTML = `<i class="${subject.icon}" style="color:${subject.color};"></i> ${subject.name}`;
        renderTabContent(subject, 'lessons');
    }

    function renderTabContent(subject, tabName) {
        state.activeTab = tabName;
        dashboardTabs.querySelectorAll('.tab-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabName));
        let contentHTML = '';
        switch(tabName) {
            case 'lessons':
                contentHTML = subject.chapters.map(chapter => `
                    <div class="panel chapter-accordion">
                        <div class="chapter-header"><h4>${chapter.title}</h4><i class="fas fa-chevron-down"></i></div>
                        <div class="chapter-topics">${chapter.topics.map(topic => `
                            <div class="topic-item ${playerData.completed.includes(topic.id) ? 'completed' : ''}" data-topic-id="${topic.id}">
                                <span class="topic-title">${topic.title}</span>
                                <div class="resource-icons">
                                    ${topic.type === 'video' ? `<i class="fas fa-play-circle" title="Watch Video"></i>` : ''}
                                    ${topic.type === 'notes' ? `<i class="fas fa-file-pdf" title="Read Notes"></i>` : ''}
                                    ${topic.type === 'quiz' ? `<i class="fas fa-vial start-quiz-btn" title="Start Quiz"></i>` : ''}
                                    <i class="fas fa-check-circle" title="Completed"></i>
                                </div></div>`).join('')}
                        </div></div>`).join('') || '<div class="panel"><p>No lessons available for this subject yet.</p></div>';
                break;
            case 'quizzes':
                const allQuizzes = subject.chapters.flatMap(c => c.topics.filter(t => t.type === 'quiz'));
                contentHTML = `<div class="content-grid">${allQuizzes.map(q => `<div class="content-card"><h4>🎮 ${q.title}</h4><p>+${q.xp} XP</p><button class="btn-start start-quiz-btn" data-quiz-id="${q.id}">Attempt Quiz</button></div>`).join('') || '<div class="panel"><p>No quizzes available for this subject yet.</p></div>'}</div>`;
                break;
            default: contentHTML = `<div class="panel"><p>Content for ${tabName} is coming soon!</p></div>`;
        }
        document.getElementById('dashboard-tab-content').innerHTML = contentHTML;
    }
    
    // --- ADVANCED QUIZ LOGIC ---
    // (Full logic included here for completeness)
    function startQuiz(quiz) {
        quizState = { currentQuiz: quiz, currentIndex: 0, userAnswers: new Array(quiz.questions.length).fill(null), score: 0 };
        modal.style.display = "block";
        renderQuizQuestion();
    }
    function renderQuizQuestion() {
        const modalBody = document.getElementById('modal-body');
        const question = quizState.currentQuiz.questions[quizState.currentIndex];
        const progress = ((quizState.currentIndex + 1) / quizState.currentQuiz.questions.length) * 100;
        const optionsHTML = question.options.map((opt, i) => `<div class="quiz-option" data-index="${i}">${opt}</div>`).join('');
        modalBody.innerHTML = `
            <div class="quiz-container">
                <div class="quiz-header">
                    <div class="quiz-progress-text">Q ${quizState.currentIndex + 1}/${quizState.currentQuiz.questions.length}</div>
                    <div class="quiz-progress-bar-container"><div class="quiz-progress-bar"><div class="quiz-progress-bar-inner" style="width:${progress}%"></div></div></div>
                </div>
                <h3 class="quiz-question">${question.q}</h3>
                <div class="quiz-options">${optionsHTML}</div>
                <div id="quiz-feedback" class="quiz-feedback" style="display:none;"></div>
                <div class="quiz-navigation">
                    <button id="quiz-prev-btn" class="quiz-nav-btn" ${quizState.currentIndex === 0 ? 'disabled' : ''}>Previous</button>
                    <button id="quiz-next-btn" class="quiz-nav-btn">${quizState.currentIndex === quizState.currentQuiz.questions.length - 1 ? 'Submit' : 'Next'}</button>
                </div>
            </div>`;
        if(quizState.userAnswers[quizState.currentIndex] !== null) {
            document.querySelector(`.quiz-option[data-index='${quizState.userAnswers[quizState.currentIndex]}']`).classList.add('selected');
        }
    }
    function checkAnswer(selectedIndex) {
        quizState.userAnswers[quizState.currentIndex] = selectedIndex;
        const question = quizState.currentQuiz.questions[quizState.currentIndex];
        const options = document.querySelectorAll('.quiz-option');
        const feedbackDiv = document.getElementById('quiz-feedback');
        options.forEach(opt => opt.classList.add('disabled'));
        if (selectedIndex === question.answer) {
            options[selectedIndex].classList.add('correct');
            feedbackDiv.innerHTML = `Correct! ${question.explanation}`;
            feedbackDiv.style.color = 'var(--green-dark)';
        } else {
            options[selectedIndex].classList.add('wrong');
            options[question.answer].classList.add('correct');
            feedbackDiv.innerHTML = `Not quite. ${question.explanation}`;
            feedbackDiv.style.color = 'var(--red-soft)';
        }
        feedbackDiv.style.display = 'block';
    }
    function submitQuiz() {
        let score = 0;
        quizState.currentQuiz.questions.forEach((q, i) => { if(q.answer === quizState.userAnswers[i]) score++; });
        const xpGained = Math.round((score / quizState.currentQuiz.questions.length) * quizState.currentQuiz.xp);
        playerData.xp += xpGained;
        playerData.completed.push(quizState.currentQuiz.id);
        localStorage.setItem('playerData', JSON.stringify(playerData));
        document.getElementById('modal-body').innerHTML = `<h2>Quiz Complete!</h2><p>You scored ${score} out of ${quizState.currentQuiz.questions.length}!</p><h3>You earned ${xpGained} XP! 🚀</h3>`;
        render(); // Re-render main page to update stats
    }
    function navigateQuiz(direction) { quizState.currentIndex += direction; renderQuizQuestion(); }

    // --- EVENT LISTENERS ---
    if (menuToggle && sidebar) { menuToggle.addEventListener('click', () => sidebar.classList.toggle('active')); }
    classFilter.addEventListener('change', (e) => { state.class = e.target.value; render(); });
    backBtn.addEventListener('click', () => { state.selectedSubjectId = null; render(); });

    dashboardTabs.addEventListener('click', (e) => {
        if (e.target.classList.contains('tab-btn')) {
            const subject = (subjectsDB[state.class]?.[state.board] || []).find(s => s.id === state.selectedSubjectId);
            renderTabContent(subject, e.target.dataset.tab);
        }
    });

    document.getElementById('dashboard-main-content').addEventListener('click', (e) => {
        const header = e.target.closest('.chapter-header');
        if(header) header.parentElement.classList.toggle('open');
        const quizBtn = e.target.closest('.start-quiz-btn');
        if(quizBtn) {
            const subject = (subjectsDB[state.class]?.[state.board] || []).find(s => s.id === state.selectedSubjectId);
            const topicItem = quizBtn.closest('.topic-item');
            const quizId = topicItem ? topicItem.dataset.topicId : quizBtn.dataset.quizId;
            const quiz = subject.chapters.flatMap(c => c.topics).find(t => t.id === quizId);
            if(quiz) startQuiz(quiz);
        }
    });
    
    document.getElementById('modal-body').addEventListener('click', (e) => {
        if (e.target.matches('.quiz-option:not(.disabled)')) { handleAnswer(parseInt(e.target.dataset.index)); }
        if (e.target.matches('#quiz-prev-btn')) { navigateQuiz(-1); }
        if (e.target.matches('#quiz-next-btn')) {
            if (quizState.userAnswers[quizState.currentIndex] === null) { alert("Please select an answer!"); return; }
            if(quizState.currentIndex === quizState.currentQuiz.questions.length - 1) { submitQuiz(); } 
            else { navigateQuiz(1); }
        }
    });
    
    modalCloseBtn.onclick = () => { modal.style.display = "none"; }
    window.onclick = (event) => { if (event.target == modal) { modal.style.display = "none"; } }

    // --- INITIAL LOAD ---
    render();
});