document.addEventListener("DOMContentLoaded", function() {

    // --- Mock Data ---
    const studentsByClass = {
        '9': [
            { roll: 901, name: 'Aryan Sharma' }, { roll: 902, name: 'Priya Singh' },
            { roll: 903, name: 'Rohan Verma' }, { roll: 904, name: 'Sneha Gupta' },
        ],
        '10': [
            { roll: 1001, name: 'Karan Singh' }, { roll: 1002, name: 'Diya Patel' },
        ]
    };

    function generateMockDataForClass(classId) {
        const students = studentsByClass[classId] || [];
        if (students.length === 0) return [];
        
        let data = [];
        // Assume 20 working days in the month
        for (let day = 1; day <= 20; day++) {
            students.forEach(student => {
                const isPresent = Math.random() > 0.1; // 90% chance of being present
                data.push({
                    ...student,
                    date: `2025-09-${String(day).padStart(2, '0')}`,
                    entry: isPresent ? '09:02 AM' : '--',
                    exit: isPresent ? '04:05 PM' : '--',
                    status: isPresent ? 'Present' : 'Absent'
                });
            });
        }
        return data;
    }
    
    const attendanceData = {
        '9': generateMockDataForClass('9'),
        '10': generateMockDataForClass('10'),
    };

    // --- State Management ---
    let currentClass = "9";
    let currentView = "weekly";

    // --- DOM ELEMENTS ---
    const viewToggleButtons = document.querySelectorAll('.view-btn');
    const classLinks = document.querySelectorAll('.sub-link');
    const logTableContainer = document.getElementById('log-table-container');
    const summaryTableContainer = document.getElementById('summary-table-container');
    const logTableBody = document.getElementById('attendance-table-body');
    const summaryTableBody = document.getElementById('summary-table-body');
    const currentViewDisplay = document.getElementById('current-view-display');
    const currentClassDisplay = document.getElementById('current-class-display');

    // --- RENDER FUNCTIONS ---

    function renderWeeklyLog() {
        logTableBody.innerHTML = '';
        const data = attendanceData[currentClass] || [];
        // For weekly view, show the last 5 days of data as an example
        const studentsInClass = studentsByClass[currentClass]?.length || 1;
        const weeklyData = data.slice(-(studentsInClass * 5)); // 5 days of data

        if (weeklyData.length === 0) {
            logTableBody.innerHTML = '<tr><td colspan="6">No attendance data available for this week.</td></tr>';
            return;
        }

        weeklyData.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.roll}</td>
                <td>${entry.name}</td>
                <td>${entry.date}</td>
                <td>${entry.entry}</td>
                <td>${entry.exit}</td>
                <td><span class="status ${entry.status.toLowerCase()}">${entry.status}</span></td>
            `;
            logTableBody.appendChild(row);
        });
    }

    function renderMonthlySummary() {
        summaryTableBody.innerHTML = '';
        const data = attendanceData[currentClass] || [];
        const students = studentsByClass[currentClass] || [];
        const totalDays = 20; // Assuming 20 working days in the month for this mock data

        if (students.length === 0) {
            summaryTableBody.innerHTML = '<tr><td colspan="5">No students in this class.</td></tr>';
            return;
        }

        // Calculate summary for each student
        const studentSummary = students.map(student => {
            const studentEntries = data.filter(entry => entry.roll === student.roll);
            const presentDays = studentEntries.filter(entry => entry.status === 'Present').length;
            const absentDays = totalDays - presentDays;
            const percentage = Math.round((presentDays / totalDays) * 100);
            return { ...student, presentDays, absentDays, percentage };
        });

        studentSummary.forEach(summary => {
            const row = document.createElement('tr');
            const barColor = summary.percentage >= 75 ? '#28a745' : summary.percentage >= 50 ? '#ffc107' : '#dc3545';
            
            row.innerHTML = `
                <td>${summary.roll}</td>
                <td>${summary.name}</td>
                <td>${summary.presentDays}</td>
                <td>${summary.absentDays}</td>
                <td>
                    <div class="percentage-bar-container">
                        <div class="percentage-bar" style="width: ${summary.percentage}%; background-color: ${barColor};"></div>
                        <span class="percentage-text">${summary.percentage}%</span>
                    </div>
                </td>
            `;
            summaryTableBody.appendChild(row);
        });
    }

    function updateView() {
        currentClassDisplay.textContent = `Class ${currentClass}`;
        
        if (currentView === 'weekly') {
            logTableContainer.style.display = 'block';
            summaryTableContainer.style.display = 'none';
            currentViewDisplay.textContent = 'Weekly';
            renderWeeklyLog();
        } else { // monthly
            logTableContainer.style.display = 'none';
            summaryTableContainer.style.display = 'block';
            currentViewDisplay.textContent = 'Monthly';
            renderMonthlySummary();
        }
        // A small animation trigger
        const tablePanel = document.querySelector('.table-panel');
        tablePanel.classList.remove('animate-table-update');
        void tablePanel.offsetWidth;
        tablePanel.classList.add('animate-table-update');
    }

    // --- EVENT LISTENERS ---
    viewToggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            viewToggleButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentView = button.dataset.viewType;
            updateView();
        });
    });

    classLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            classLinks.forEach(l => l.classList.remove('active-class-link'));
            link.classList.add('active-class-link');
            currentClass = link.dataset.class;
            updateView();
        });
    });

    // --- Initial Load ---
    const defaultClassLink = document.querySelector(`.sub-link[data-class="${currentClass}"]`);
    if (defaultClassLink) { defaultClassLink.classList.add('active-class-link'); }
    updateView(); // Initial render
});