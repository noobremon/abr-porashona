document.addEventListener("DOMContentLoaded", function() {

    // --- Element Selectors ---
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const tablePanel = document.querySelector('.table-panel');
    const tableBody = document.getElementById('attendance-table-body');
    const searchInput = document.getElementById('student-search');
    const classLinks = document.querySelectorAll('.sub-link');
    const sortHeaders = document.querySelectorAll('th[data-sort]');
    const viewButtons = document.querySelectorAll('.view-btn');
    const currentClassDisplay = document.getElementById('current-class-display');
    const currentViewDisplay = document.getElementById('current-view-display');
    const trendPeriodDisplay = document.getElementById('trend-period-display');

    // --- Mock Data ---
    const mockAttendanceData = {
        "6": { /* Data for Class 6 */ },
        "7": { /* Data for Class 7 */ },
        "8": { /* Data for Class 8 */ },
        "9": {
            weekly: [
                { roll: 901, name: "Aryan Sharma", entry: "09:02 AM", exit: "04:05 PM", status: "Present" },
                { roll: 902, name: "Priya Singh", entry: "09:12 AM", exit: "04:01 PM", status: "Late" },
                { roll: 903, name: "Rohan Verma", entry: "--", exit: "--", status: "Absent" },
                { roll: 904, name: "Sneha Gupta", entry: "09:00 AM", exit: "04:00 PM", status: "Present" },
            ],
            monthly: [
                { roll: 901, name: "Aryan Sharma", entry: "09:02 AM", exit: "04:05 PM", status: "Present" },
                { roll: 902, name: "Priya Singh", entry: "09:12 AM", exit: "04:01 PM", status: "Late" },
                { roll: 903, name: "Rohan Verma", entry: "--", exit: "--", status: "Absent" },
                { roll: 904, name: "Sneha Gupta", entry: "09:00 AM", exit: "04:00 PM", status: "Present" },
                { roll: 905, name: "Vikas Kumar", entry: "09:03 AM", exit: "04:03 PM", status: "Present" },
                { roll: 901, name: "Aryan Sharma", entry: "09:00 AM", exit: "04:00 PM", status: "Present" },
                { roll: 903, name: "Rohan Verma", entry: "09:01 AM", exit: "04:00 PM", status: "Present" },
            ]
        },
        "10": {
             weekly: [
                 { roll: 1001, name: "Karan Singh", entry: "09:00 AM", exit: "04:00 PM", status: "Present" },
                 { roll: 1002, name: "Diya Patel", entry: "09:08 AM", exit: "03:58 PM", status: "Late" },
            ],
            monthly: [
                { roll: 1001, name: "Karan Singh", entry: "09:00 AM", exit: "04:00 PM", status: "Present" },
                { roll: 1002, name: "Diya Patel", entry: "09:08 AM", exit: "03:58 PM", status: "Late" },
                { roll: 1001, name: "Karan Singh", entry: "09:00 AM", exit: "04:00 PM", status: "Present" },
                { roll: 1002, name: "Diya Patel", entry: "--", exit: "--", status: "Absent" },
            ]
        }
    };

    // --- State Management ---
    let currentClass = "9";
    let currentViewType = "weekly";
    let currentSearchTerm = "";
    let currentSort = { key: 'roll', order: 'asc' };

    // --- Main Render Function ---
    function render() {
        if (!tableBody) return;

        let dataForClassAndPeriod = mockAttendanceData[currentClass]?.[currentViewType] || [];
        let filteredData = dataForClassAndPeriod;
        
        if (currentSearchTerm) {
            filteredData = dataForClassAndPeriod.filter(student =>
                student.name.toLowerCase().includes(currentSearchTerm) ||
                String(student.roll).includes(currentSearchTerm)
            );
        }

        filteredData.sort((a, b) => {
            let valA = a[currentSort.key]; let valB = b[currentSort.key];
            if (typeof valA === 'string' && currentSort.key !== 'roll') {
                valA = valA.toLowerCase(); valB = valB.toLowerCase();
            } else if (currentSort.key === 'roll') {
                valA = parseInt(valA); valB = parseInt(valB);
            }
            if (valA < valB) return currentSort.order === 'asc' ? -1 : 1;
            if (valA > valB) return currentSort.order === 'asc' ? 1 : -1;
            return 0;
        });

        currentClassDisplay.textContent = `Class ${currentClass}`;
        currentViewDisplay.textContent = currentViewType;
        trendPeriodDisplay.textContent = `This ${currentViewType.charAt(0).toUpperCase() + currentViewType.slice(1)}`;

        tablePanel.classList.remove('animate-table-update');
        void tablePanel.offsetWidth;
        tablePanel.classList.add('animate-table-update');
        
        populateTable(filteredData);
        renderCharts(filteredData);
    }

    // --- UI Update Functions ---
    function populateTable(data) {
        tableBody.innerHTML = '';
        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No records found.</td></tr>`;
            return;
        }
        data.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `<td data-label="Roll No.">${student.roll}</td><td data-label="Student Name">${student.name}</td><td data-label="Entry Time">${student.entry}</td><td data-label="Exit Time">${student.exit}</td><td data-label="Status" data-status="${student.status}">${student.status}</td>`;
            tableBody.appendChild(row);
        });
    }

    function renderCharts(data) {
        const pieChart = document.getElementById('attendance-pie-chart');
        const legend = document.getElementById('pie-chart-legend');
        const barChart = document.getElementById('attendance-bar-chart');
        
        const presentCount = data.filter(s => s.status === 'Present').length;
        const lateCount = data.filter(s => s.status === 'Late').length;
        const absentCount = data.filter(s => s.status === 'Absent').length;
        const total = data.length || 1;
        const presentPercentage = Math.round((presentCount / total) * 100);
        const latePercentage = Math.round((lateCount / total) * 100);
        const absentPercentage = 100 - presentPercentage - latePercentage;

        pieChart.style.background = `conic-gradient(var(--green-bright) 0% ${presentPercentage}%, var(--orange-soft) ${presentPercentage}% ${presentPercentage + latePercentage}%, var(--red-soft) ${presentPercentage + latePercentage}% 100%)`;
        legend.innerHTML = `
            <div class="legend-item"><div class="color-box" style="background: var(--green-bright);"></div>Present (${presentPercentage}%)</div>
            <div class="legend-item"><div class="color-box" style="background: var(--orange-soft);"></div>Late (${latePercentage}%)</div>
            <div class="legend-item"><div class="color-box" style="background: var(--red-soft);"></div>Absent (${absentPercentage}%)</div>`;

        barChart.innerHTML = '';
        let trendLabels = (currentViewType === 'weekly') ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] : ['Wk1', 'Wk2', 'Wk3', 'Wk4'];
        let trendData = (currentViewType === 'weekly') ? [90, 75, 100, 100, 80] : [85, 92, 78, 95];
        trendLabels.forEach((label, i) => {
            barChart.innerHTML += `<div class="bar" style="height: ${trendData[i]}%;"><span class="label">${label}</span></div>`;
        });
    }
    
    // --- Event Listeners ---
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => sidebar.classList.toggle('active'));
    }

    classLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            classLinks.forEach(l => l.classList.remove('active-class-link'));
            link.classList.add('active-class-link');
            currentClass = link.getAttribute('data-class');
            searchInput.value = ""; currentSearchTerm = "";
            render();
        });
    });

    searchInput.addEventListener('keyup', () => {
        currentSearchTerm = searchInput.value.toLowerCase();
        render();
    });

    sortHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const sortKey = header.getAttribute('data-sort');
            if (currentSort.key === sortKey) {
                currentSort.order = currentSort.order === 'asc' ? 'desc' : 'asc';
            } else {
                currentSort.key = sortKey;
                currentSort.order = 'asc';
            }
            render();
        });
    });

    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            viewButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentViewType = button.getAttribute('data-view-type');
            render();
        });
    });

    // --- Initial Load ---
    const defaultClassLink = document.querySelector(`.sub-link[data-class="${currentClass}"]`);
    if (defaultClassLink) { defaultClassLink.classList.add('active-class-link'); }
    render();
    document.querySelectorAll('.animate-on-load').forEach((el, index) => {
        setTimeout(() => el.classList.add('visible'), index * 100);
    });
});