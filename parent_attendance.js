document.addEventListener('DOMContentLoaded', function() {
    // --- MOCK DATA ---
    // Simulates a student's attendance for a full month (20 working days)
    function generateMockData() {
        let data = [];
        const today = new Date();
        // Go back to the beginning of the month to generate data
        let currentDate = new Date(today.getFullYear(), today.getMonth(), 1);
        let workingDays = 0;

        while (workingDays < 20) {
            // Skip weekends
            if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
                const status = Math.random() > 0.1 ? 'Present' : (Math.random() > 0.5 ? 'Late' : 'Absent');
                let entryTime = '--', exitTime = '--';
                if (status === 'Present') {
                    entryTime = '09:02 AM'; exitTime = '04:05 PM';
                } else if (status === 'Late') {
                    entryTime = '09:15 AM'; exitTime = '04:00 PM';
                }
                data.push({
                    date: currentDate.toISOString().split('T')[0],
                    entryTime,
                    exitTime,
                    status
                });
                workingDays++;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return data.reverse(); // Show most recent first
    }

    const attendanceData = generateMockData();

    // --- DOM ELEMENTS ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const views = document.querySelectorAll('.view');
    const weeklyTableBody = document.getElementById('weekly-table-body');
    const monthlySummaryTableBody = document.getElementById('monthly-summary-table-body');
    const weeklyChartContainer = document.getElementById('weekly-chart-container');
    const monthlyPieChart = document.querySelector('#monthly-chart-container .pie-chart');
    const monthlyPieLegend = document.querySelector('#monthly-chart-container .pie-chart-legend');

    // --- RENDER FUNCTIONS ---

    function renderWeeklyView() {
        // Show last 5 days
        const weeklyData = attendanceData.slice(0, 5);
        weeklyTableBody.innerHTML = '';
        weeklyData.forEach(day => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${day.date}</td>
                <td>${day.entryTime}</td>
                <td>${day.exitTime}</td>
                <td data-status="${day.status}">${day.status}</td>
            `;
            weeklyTableBody.appendChild(row);
        });

        // Render weekly bar chart
        weeklyChartContainer.innerHTML = '';
        weeklyData.reverse().forEach(day => { // reverse to show Mon -> Fri
            const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
            const isPresent = day.status === 'Present' || day.status === 'Late';
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.height = isPresent ? '100%' : '10%';
            bar.innerHTML = `<span class="label">${dayName}</span>`;
            weeklyChartContainer.appendChild(bar);
        });
    }

    function renderMonthlyView() {
        // Render pie chart
        const presentCount = attendanceData.filter(d => d.status === 'Present' || d.status === 'Late').length;
        const absentCount = attendanceData.filter(d => d.status === 'Absent').length;
        const total = presentCount + absentCount;
        const presentPercentage = Math.round((presentCount / total) * 100);
        const absentPercentage = 100 - presentPercentage;

        monthlyPieChart.style.background = `conic-gradient(var(--green-bright) 0% ${presentPercentage}%, var(--red-soft) ${presentPercentage}% 100%)`;
        monthlyPieLegend.innerHTML = `
            <div class="legend-item"><div class="color-box" style="background: var(--green-bright);"></div>Present (${presentPercentage}%)</div>
            <div class="legend-item"><div class="color-box" style="background: var(--red-soft);"></div>Absent (${absentPercentage}%)</div>
        `;

        // Render weekly summary table
        monthlySummaryTableBody.innerHTML = '';
        const weeklySummary = [];
        // Group data into 4 weeks
        for (let i = 0; i < 4; i++) {
            const weekData = attendanceData.slice(i * 5, (i + 1) * 5);
            if (weekData.length === 0) continue;

            const presentDays = weekData.filter(d => d.status === 'Present' || d.status === 'Late').length;
            const absentDays = 5 - presentDays;
            const percentage = Math.round((presentDays / 5) * 100);
            weeklySummary.push({ week: `Week ${i + 1}`, presentDays, absentDays, percentage });
        }

        weeklySummary.forEach(summary => {
            const row = document.createElement('tr');
            const barColor = summary.percentage >= 80 ? '#28a745' : summary.percentage >= 60 ? '#ffc107' : '#dc3545';
            row.innerHTML = `
                <td>${summary.week}</td>
                <td>${summary.presentDays}</td>
                <td>${summary.absentDays}</td>
                <td>
                    <div class="percentage-bar-container">
                        <div class="percentage-bar" style="width: ${summary.percentage}%; background-color: ${barColor};"></div>
                        <span class="percentage-text">${summary.percentage}%</span>
                    </div>
                </td>
            `;
            monthlySummaryTableBody.appendChild(row);
        });
    }

    // --- EVENT LISTENERS & INITIALIZATION ---
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const targetViewId = button.dataset.view;
            views.forEach(view => view.classList.toggle('active-view', view.id === targetViewId));
        });
    });

    renderWeeklyView();
    renderMonthlyView();
});