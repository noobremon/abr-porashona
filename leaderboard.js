document.addEventListener("DOMContentLoaded", function() {

    // --- MOCK DATA ---
    const currentUserID = 3; // Let's assume the logged-in user is 'Priya Singh'
    const studentsData = [
        { id: 1, name: "Rohan Verma", avatar: "https://placehold.co/60x60/a29bfe/ffffff?text=RV", scores: { math: 98, science: 95, english: 92 } },
        { id: 2, name: "Sneha Gupta", avatar: "https://placehold.co/60x60/55efc4/ffffff?text=SG", scores: { math: 95, science: 99, english: 94 } },
        { id: 3, name: "Priya Singh", avatar: "https://placehold.co/60x60/ff7675/ffffff?text=PS", scores: { math: 92, science: 88, english: 91 } },
        { id: 4, name: "Aryan Sharma", avatar: "https://placehold.co/60x60/74b9ff/ffffff?text=AS", scores: { math: 89, science: 93, english: 85 } },
        { id: 5, name: "Vikas Kumar", avatar: "https://placehold.co/60x60/ffeaa7/ffffff?text=VK", scores: { math: 85, science: 82, english: 88 } },
        { id: 6, name: "Karan Singh", avatar: "https://placehold.co/60x60/fdcb6e/ffffff?text=KS", scores: { math: 81, science: 79, english: 84 } },
        // Add more students for "Show All" functionality
    ];
    const motivationalQuotes = [
        "The expert in anything was once a beginner.",
        "Strive for progress, not perfection.",
        "Success is the sum of small efforts, repeated day in and day out.",
        "The only way to learn mathematics is to do mathematics.",
        "Believe you can and you’re halfway there."
    ];

    // --- STATE MANAGEMENT ---
    let state = {
        view: 'overall', // 'overall' or 'subject'
        subject: 'math',
        filter: '10', // '10', '50', 'all'
        searchTerm: ''
    };

    // --- ELEMENT SELECTORS ---
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const leaderboardList = document.getElementById('leaderboard-list');
    const tabs = document.querySelectorAll('.tab-btn');
    const subjectFilter = document.getElementById('subject-filter');
    const topNFilter = document.getElementById('top-n-filter');
    const searchInput = document.getElementById('friend-search');
    const quoteDisplay = document.getElementById('quote-display');
    
    // --- MAIN RENDER FUNCTION ---
    function renderLeaderboard() {
        // 1. Process data: Calculate totals and ranks
        const processedData = studentsData.map(student => ({
            ...student,
            totalScore: student.scores.math + student.scores.science + student.scores.english
        })).sort((a, b) => {
            if (state.view === 'overall') {
                return b.totalScore - a.totalScore;
            }
            return b.scores[state.subject] - a.scores[state.subject];
        }).map((student, index) => ({
            ...student,
            rank: index + 1
        }));

        // 2. Filter data
        let filteredData = processedData;
        if (state.searchTerm) {
            filteredData = filteredData.filter(s => s.name.toLowerCase().includes(state.searchTerm));
        }
        if (state.filter !== 'all') {
            filteredData = filteredData.slice(0, parseInt(state.filter));
        }

        // 3. Populate UI
        populateList(filteredData);
        updateHeader(processedData.find(s => s.id === currentUserID), processedData);
        displayRandomQuote();
    }

    // --- UI UPDATE FUNCTIONS ---
    function populateList(data) {
        leaderboardList.innerHTML = '';
        if (data.length === 0) {
            leaderboardList.innerHTML = '<p class="no-results">No students found.</p>';
            return;
        }

        data.forEach(student => {
            const item = document.createElement('div');
            item.className = 'leaderboard-item';
            if (student.id === currentUserID) item.classList.add('current-user');
            if (student.rank <= 3) item.classList.add(`rank-${student.rank}`);
            
            const points = state.view === 'overall' ? student.totalScore : student.scores[state.subject];
            const rankIcons = ["<i class='fas fa-trophy rank-icon'></i>", "<i class='fas fa-medal rank-icon'></i>", "<i class='fas fa-award rank-icon'></i>"];
            const rankDisplay = student.rank <= 3 ? `${student.rank} ${rankIcons[student.rank - 1]}` : student.rank;

            item.innerHTML = `
                <div class="rank">${rankDisplay}</div>
                <div class="avatar"><img src="${student.avatar}" alt="${student.name}"></div>
                <div class="name">${student.name}</div>
                <div class="points">${points} XP</div>
            `;
            leaderboardList.appendChild(item);
        });
    }

    function updateHeader(currentUser, allRankedData) {
        if (!currentUser) return;
        document.getElementById('student-name').textContent = `Welcome, ${currentUser.name}`;
        document.getElementById('student-rank').textContent = `Rank: #${currentUser.rank}`;

        // Progress Bar Logic
        const rankAbove = allRankedData.find(s => s.rank === currentUser.rank - 1);
        const userPoints = state.view === 'overall' ? currentUser.totalScore : currentUser.scores[state.subject];
        const pointsForNextRank = rankAbove ? (state.view === 'overall' ? rankAbove.totalScore : rankAbove.scores[state.subject]) : userPoints;
        const rankBelowPoints = allRankedData.find(s => s.rank === currentUser.rank + 1) ? 
                               (state.view === 'overall' ? allRankedData.find(s => s.rank === currentUser.rank + 1).totalScore : allRankedData.find(s => s.rank === currentUser.rank + 1).scores[state.subject]) 
                               : 0;
        
        const totalPointsNeeded = pointsForNextRank - rankBelowPoints;
        const userProgress = userPoints - rankBelowPoints;
        const progressPercentage = totalPointsNeeded > 0 ? (userProgress / totalPointsNeeded) * 100 : 100;

        document.getElementById('progress-bar-inner').style.width = `${Math.min(progressPercentage, 100)}%`;
        document.getElementById('progress-text').textContent = `${userPoints} / ${pointsForNextRank} XP`;
        
        // Trigger confetti for top ranks
        if (currentUser.rank <= 3) {
            triggerConfetti();
        }
    }

    function displayRandomQuote() {
        const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
        quoteDisplay.textContent = `"${motivationalQuotes[randomIndex]}"`;
    }
    
    function triggerConfetti() {
        const container = document.getElementById('confetti-container');
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.animationDelay = `${Math.random() * 2}s`;
            confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            container.appendChild(confetti);
            setTimeout(() => confetti.remove(), 3000);
        }
    }

    // --- EVENT LISTENERS ---
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => sidebar.classList.toggle('active'));
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            state.view = tab.getAttribute('data-view');
            subjectFilter.classList.toggle('hidden', state.view === 'overall');
            renderLeaderboard();
        });
    });

    subjectFilter.addEventListener('change', (e) => {
        state.subject = e.target.value;
        renderLeaderboard();
    });

    topNFilter.addEventListener('change', (e) => {
        state.filter = e.target.value;
        renderLeaderboard();
    });

    searchInput.addEventListener('keyup', (e) => {
        state.searchTerm = e.target.value.toLowerCase();
        renderLeaderboard();
    });

    // --- INITIAL LOAD ---
    renderLeaderboard();
});