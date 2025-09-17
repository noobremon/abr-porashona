document.addEventListener("DOMContentLoaded", function() {

    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    const animatedPanels = document.querySelectorAll('.animate-on-load');

    // 1. Sidebar Toggle for smaller screens
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // 2. Highlight active menu item
    if (navLinks) {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                if (this.getAttribute('href') === '#') { e.preventDefault(); }
                navLinks.forEach(item => item.classList.remove('active-link'));
                this.classList.add('active-link');
                if (window.innerWidth <= 992) { sidebar.classList.remove('active'); }
            });
        });
    }

    // 3. Staggered entrance animation for panels
    animatedPanels.forEach((panel, index) => {
        setTimeout(() => {
            panel.classList.add('animate-on-load');
        }, index * 200); // Stagger by 200ms
    });

    // 4. RFID Attendance Table Functionality
    const mockData = [
        { name: "Aryan Sharma", roll: "101", inTime: "09:02 AM", outTime: "04:05 PM" },
        { name: "Priya Singh", roll: "102", inTime: "09:05 AM", outTime: "04:01 PM" },
        { name: "Rohan Verma", roll: "103", inTime: "08:59 AM", outTime: "04:03 PM" },
        { name: "Sneha Gupta", roll: "104", inTime: "09:01 AM", outTime: "03:59 PM" },
        { name: "Vikas Kumar", roll: "105", inTime: "09:03 AM", outTime: "04:00 PM" },
        { name: "Anjali Mehta", roll: "106", inTime: "08:58 AM", outTime: "04:06 PM" },
        { name: "Karan Desai", roll: "107", inTime: "09:04 AM", outTime: "04:02 PM" }
    ];

    const tableBody = document.getElementById('attendance-table-body');
    const searchInput = document.getElementById('attendance-search');

    // Function to populate the table with data
    function populateTable(data) {
        if (!tableBody) return;
        tableBody.innerHTML = ''; // Clear existing rows

        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">No students found.</td></tr>`;
            return;
        }

        data.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.roll}</td>
                <td>${student.inTime}</td>
                <td>${student.outTime}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Function to filter the table based on search input
    function filterTable() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredData = mockData.filter(student => 
            student.name.toLowerCase().includes(searchTerm) || 
            student.roll.toLowerCase().includes(searchTerm)
        );
        populateTable(filteredData);
    }

    // Initial population of the table
    populateTable(mockData);

    // Event listener for the search bar
    if (searchInput) {
        searchInput.addEventListener('keyup', filterTable);
    }

});