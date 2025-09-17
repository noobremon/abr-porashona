document.addEventListener("DOMContentLoaded", function() {

    // --- MOCK DATA ---
    const mockData = {
        announcements: [
            { id: 1, title: "Parent-Teacher Meeting", date: "2025-09-25", category: "PTM", shortDesc: "Quarterly review of student progress.", fullDesc: "All parents are requested to attend the quarterly parent-teacher meeting to discuss their child's academic progress and address any concerns. The meeting will be held in the main auditorium.", isRead: false },
            { id: 2, title: "Mid-Term Exam Schedule", date: "2025-09-20", category: "Exam", shortDesc: "The schedule for the upcoming mid-term exams has been released.", fullDesc: "Please find the detailed exam schedule available for download. Ensure your child is well-prepared. Good luck to all students!", isRead: false },
            { id: 3, title: "Annual Sports Day", date: "2025-09-15", category: "General", shortDesc: "Join us for a day of fun and games at our Annual Sports Day!", fullDesc: "We invite all families to cheer for our students at the Annual Sports Day. The event will start at 9:00 AM at the school sports ground.", isRead: true },
            { id: 4, title: "Holiday: Gandhi Jayanti", date: "2025-09-12", category: "General", shortDesc: "The school will remain closed on October 2nd.", fullDesc: "This is to inform you that the school will be closed on October 2nd, 2025, on account of Gandhi Jayanti.", isRead: true },
        ],
        ptms: [
            { title: "Quarterly PTM", date: "25 Sep, 2025", time: "10:00 AM - 01:00 PM" }
        ],
        childUpdates: [
            { type: "Achievement", text: "Won 1st prize in the Science Olympiad.", from: "Mrs. Davis (Science Teacher)" },
            { type: "Remark", text: "Submitted an excellent essay on historical events.", from: "Mr. Smith (History Teacher)" },
        ]
    };

    // --- State ---
    let currentFilter = 'all';

    // --- Element Selectors ---
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const feedContainer = document.getElementById('announcements-feed');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const notificationBadge = document.getElementById('notification-badge');

    // --- Main Render Function ---
    function renderAll() {
        renderAnnouncements();
        renderPtmPanel(mockData.ptms);
        renderChildUpdates(mockData.childUpdates);
        updateNotificationBadge();
    }
    
    // --- UI Rendering Functions ---
    function renderAnnouncements() {
        const filteredData = mockData.announcements.filter(item => 
            currentFilter === 'all' || item.category === currentFilter
        );
        
        feedContainer.innerHTML = ''; // Clear existing feed
        if (filteredData.length === 0) {
            feedContainer.innerHTML = '<p>No announcements in this category.</p>';
            return;
        }

        filteredData.forEach(item => {
            const card = document.createElement('div');
            card.className = `announcement-card ${item.category}`;
            if (!item.isRead) {
                card.classList.add('unread');
            }

            const icons = { PTM: '📢', Exam: '📝', General: '🏫' };

            card.innerHTML = `
                <div class="card-header">
                    <span class="card-icon">${icons[item.category] || '🎓'}</span>
                    <div class="card-title-section">
                        <h4 class="card-title">${item.title}</h4>
                        <span class="card-date">${item.date}</span>
                    </div>
                    <i class="fas fa-chevron-down expand-icon"></i>
                </div>
                <div class="card-body">
                    <p>${item.fullDesc}</p>
                    <div class="card-actions">
                        ${item.category === 'Exam' ? '<button class="action-btn download"><i class="fas fa-download"></i> Download</button>' : ''}
                    </div>
                </div>
            `;
            feedContainer.appendChild(card);
        });

        // Add event listeners for expand/collapse
        document.querySelectorAll('.card-header').forEach(header => {
            header.addEventListener('click', () => {
                header.parentElement.classList.toggle('active');
            });
        });
    }

    function renderPtmPanel(ptms) {
        const container = document.getElementById('ptm-content');
        container.innerHTML = '';
        ptms.forEach(ptm => {
            container.innerHTML += `
                <div class="ptm-item">
                    <strong>${ptm.title}</strong>
                    <span>Date: ${ptm.date}</span><br>
                    <span>Time: ${ptm.time}</span>
                    <button class="rsvp-btn">RSVP Now</button>
                </div>
            `;
        });
    }

    function renderChildUpdates(updates) {
        const container = document.getElementById('child-updates-content');
        container.innerHTML = '';
        updates.forEach(update => {
            container.innerHTML += `
                <div class="update-item">
                    <strong>${update.type}:</strong>
                    <span>"${update.text}"</span><br>
                    <small>- ${update.from}</small>
                </div>
            `;
        });
    }

    function updateNotificationBadge() {
        const unreadCount = mockData.announcements.filter(item => !item.isRead).length;
        notificationBadge.textContent = unreadCount;
        notificationBadge.style.display = unreadCount > 0 ? 'grid' : 'none';
    }

    // --- Event Listeners ---
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => sidebar.classList.toggle('active'));
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.getAttribute('data-filter');
            renderAnnouncements();
        });
    });

    // --- Initial Load ---
    renderAll();
    document.querySelectorAll('.animate-on-load').forEach((el, index) => {
        setTimeout(() => el.style.opacity = '1', index * 200);
    });
});