document.addEventListener("DOMContentLoaded", function() {

    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const tabs = document.querySelectorAll('.tab-btn');
    const views = document.querySelectorAll('.view');

    // 1. Sidebar Toggle
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // 2. Tab Switching Logic
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab button
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const targetViewId = tab.getAttribute('data-view');
            
            // Show/Hide views
            views.forEach(view => {
                view.classList.remove('active-view');
                if (view.id === targetViewId) {
                    view.classList.add('active-view');
                }
            });

            // Render content for the active view
            if (targetViewId === 'weekly-view') {
                renderWeeklyView();
            } else if (targetViewId === 'monthly-view') {
                renderMonthlyView();
            }
        });
    });

    // 3. Mock Data
    const weeklyData = [
        { date: "15 Sep, 2025", entry: "09:02 AM", exit: "04:05 PM", status: "Present" },
        { date: "16 Sep, 2025", entry: "09:12 AM", exit: "04:01 PM", status: "Late" },
        { date: "17 Sep, 2025", entry: "09:05 AM", exit: "04:03 PM", status: "Present" },
    ];

    const monthlyData = [
        ...weeklyData, // Include weekly data
        { date: "12 Sep, 2025", entry: "09:00 AM", exit: "04:00 PM", status: "Present" },
        { date: "11 Sep, 2025", entry: "--", exit: "--", status: "Absent" },
        { date: "10 Sep, 2025", entry: "09:03 AM", exit: "04:05 PM", status: "Present" },
        { date: "09 Sep, 2025", entry: "09:01 AM", exit: "04:02 PM", status: "Present" },
        { date: "08 Sep, 2025", entry: "09:05 AM", exit: "04:01 PM", status: "Present" },
    ];

    // 4. Data Rendering Functions
    function populateTable(tableBodyId, data) {
        const tableBody = document.getElementById(tableBodyId);
        if (!tableBody) return;
        tableBody.innerHTML = '';
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.date}</td>
                <td>${item.entry}</td>
                <td>${item.exit}</td>
                <td data-status="${item.status}">${item.status}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    function renderWeeklyChart() {
        const container = document.getElementById('weekly-chart-container');
        if (!container) return;
        container.innerHTML = '';
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
        const mockPresence = [90, 75, 100, 100, 80]; // Mock % presence
        days.forEach((day, index) => {
            const barWrapper = document.createElement('div');
            barWrapper.classList.add('bar');
            barWrapper.style.height = `${mockPresence[index]}%`;
            barWrapper.innerHTML = `<span class="label">${day}</span>`;
            container.appendChild(barWrapper);
        });
    }

    function renderMonthlyChart() {
        const pieChart = document.querySelector('.pie-chart');
        const legend = document.querySelector('.pie-chart-legend');
        if (!pieChart || !legend) return;

        const presentCount = monthlyData.filter(d => d.status === 'Present' || d.status === 'Late').length;
        const totalDays = monthlyData.length;
        const presentPercentage = Math.round((presentCount / totalDays) * 100);
        const absentPercentage = 100 - presentPercentage;

        pieChart.style.background = `conic-gradient(
            var(--green-bright) 0% ${presentPercentage}%, 
            var(--red-soft) ${presentPercentage}% 100%
        )`;
        
        legend.innerHTML = `
            <div class="legend-item">
                <div class="color-box" style="background-color: var(--green-bright);"></div>
                <span>Present (${presentPercentage}%)</span>
            </div>
            <div class="legend-item">
                <div class="color-box" style="background-color: var(--red-soft);"></div>
                <span>Absent (${absentPercentage}%)</span>
            </div>
        `;
    }
    
    function renderWeeklyView() {
        populateTable('weekly-table-body', weeklyData);
        renderWeeklyChart();
    }
    
    function renderMonthlyView() {
        populateTable('monthly-table-body', monthlyData);
        renderMonthlyChart();
    }

    // Initial Load
    renderWeeklyView();

});