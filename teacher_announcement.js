document.addEventListener("DOMContentLoaded", function() {

    // --- MOCK DATA ---
    let announcements = [
        { id: 1, title: "Mid-Term Exam Schedule", category: "Exam", date: "2025-09-20", description: "The schedule for the upcoming mid-term exams has been released. Please check the attached PDF.", isPinned: true, views: 152 },
        { id: 2, title: "Parent-Teacher Meeting", category: "PTM", date: "2025-09-18", description: "Quarterly PTM will be held on Sept 25th to discuss student progress.", isPinned: false, views: 121 },
        { id: 3, title: "Physics Homework Ch. 4", category: "Homework", date: "2025-09-17", description: "Submit all questions from Chapter 4 by this Friday.", isPinned: false, views: 88 },
        { id: 4, title: "Holiday Notice", category: "Holiday", date: "2025-09-15", description: "The school will be closed on Oct 2nd for Gandhi Jayanti.", isPinned: false, views: 210 },
    ];

    // --- State Management ---
    let currentFilter = 'all';
    let editingId = null;

    // --- Element Selectors ---
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const form = document.getElementById('announcement-form');
    const formTitle = document.getElementById('form-title');
    const submitBtn = document.getElementById('form-submit-btn');
    const resetBtn = document.getElementById('form-reset-btn');
    const listContainer = document.getElementById('announcements-list');
    const categoryFilter = document.getElementById('category-filter');
    const fileInput = document.getElementById('attachment');
    const fileNameSpan = document.getElementById('file-name');

    // --- RENDER FUNCTION ---
    function renderAnnouncements() {
        // Filter data
        const filteredData = announcements.filter(item => 
            currentFilter === 'all' || item.category === currentFilter
        );

        // Sort data (pinned items first, then by date)
        filteredData.sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return new Date(b.date) - new Date(a.date);
        });

        // Render HTML
        listContainer.innerHTML = '';
        if (filteredData.length === 0) {
            listContainer.innerHTML = '<p>No announcements found for this category.</p>';
            return;
        }

        filteredData.forEach(item => {
            const card = document.createElement('div');
            card.className = `announcement-card category-${item.category}`;
            if (item.isPinned) card.classList.add('pinned');
            card.dataset.id = item.id;

            const icons = { PTM: '📢', Exam: '🎓', General: '🏫', Homework: '📝', Holiday: '🌴' };

            card.innerHTML = `
                <div class="card-icon"><i class="fas ${item.isPinned ? 'fa-thumbtack' : ''}"></i> ${icons[item.category]}</div>
                <div class="card-info">
                    <h4>${item.title}</h4>
                    <p>Posted on: ${item.date}</p>
                </div>
                <div class="card-stats">
                    <strong>${item.views}</strong> Views
                </div>
                <div class="card-description">
                    <p>${item.description}</p>
                </div>
                <div class="card-actions">
                    <button class="action-btn-card btn-pin" data-id="${item.id}"><i class="fas fa-thumbtack"></i> ${item.isPinned ? 'Unpin' : 'Pin'}</button>
                    <button class="action-btn-card btn-edit" data-id="${item.id}"><i class="fas fa-edit"></i> Edit</button>
                    <button class="action-btn-card btn-delete" data-id="${item.id}"><i class="fas fa-trash"></i> Delete</button>
                </div>
            `;
            listContainer.appendChild(card);
        });
    }

    // --- FORM & CRUD LOGIC ---
    function handleFormSubmit(e) {
        e.preventDefault();
        const title = document.getElementById('announcement-title').value.trim();
        const category = document.getElementById('announcement-category').value;
        const description = document.getElementById('announcement-desc').value.trim();
        
        if (!title || !category || !description) {
            alert('Please fill in all required fields.');
            return;
        }

        if (editingId) {
            // Update existing announcement
            announcements = announcements.map(item => 
                item.id === editingId ? { ...item, title, category, description } : item
            );
        } else {
            // Create new announcement
            const newAnnouncement = {
                id: Date.now(),
                title, category, description,
                date: new Date().toISOString().split('T')[0],
                isPinned: false,
                views: 0
            };
            announcements.unshift(newAnnouncement);
        }
        
        resetForm();
        renderAnnouncements();
    }
    
    function resetForm() {
        form.reset();
        editingId = null;
        formTitle.textContent = 'Create New Announcement';
        submitBtn.textContent = 'Publish Now';
        resetBtn.classList.add('hidden');
        fileNameSpan.textContent = 'No file chosen';
    }

    function handleEdit(id) {
        const item = announcements.find(a => a.id === id);
        if (!item) return;

        editingId = id;
        document.getElementById('announcement-title').value = item.title;
        document.getElementById('announcement-category').value = item.category;
        document.getElementById('announcement-desc').value = item.description;
        
        formTitle.textContent = 'Editing Announcement';
        submitBtn.textContent = 'Update';
        resetBtn.classList.remove('hidden');
        window.scrollTo(0, 0); // Scroll to top to see the form
    }

    function handleDelete(id) {
        if (!confirm('Are you sure you want to delete this announcement?')) return;
        
        const card = document.querySelector(`.announcement-card[data-id="${id}"]`);
        if (card) {
            card.classList.add('deleting');
            setTimeout(() => {
                announcements = announcements.filter(item => item.id !== id);
                renderAnnouncements();
            }, 400); // Wait for CSS animation
        }
    }
    
    function handlePin(id) {
        announcements = announcements.map(item =>
            item.id === id ? { ...item, isPinned: !item.isPinned } : item
        );
        renderAnnouncements();
    }

    // --- EVENT LISTENERS ---
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => sidebar.classList.toggle('active'));
    }

    form.addEventListener('submit', handleFormSubmit);
    resetBtn.addEventListener('click', resetForm);
    categoryFilter.addEventListener('change', (e) => {
        currentFilter = e.target.value;
        renderAnnouncements();
    });

    listContainer.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;
        
        const id = parseInt(target.dataset.id);
        if (target.classList.contains('btn-edit')) handleEdit(id);
        if (target.classList.contains('btn-delete')) handleDelete(id);
        if (target.classList.contains('btn-pin')) handlePin(id);
    });
    
    if (fileInput) {
        fileInput.addEventListener('change', () => {
            fileNameSpan.textContent = fileInput.files.length > 0 ? fileInput.files[0].name : 'No file chosen';
        });
    }

    // --- INITIAL LOAD ---
    renderAnnouncements();
});