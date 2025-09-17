document.addEventListener("DOMContentLoaded", function() {

    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    const contentViews = document.querySelectorAll('.content-view');

    // 1. Sidebar Toggle for smaller screens
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // 2. View Switching Logic & Active Link Highlighting
    if (navLinks && contentViews) {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetViewId = this.getAttribute('data-view');
                
                // Remove 'active-link' from all links
                navLinks.forEach(item => item.classList.remove('active-link'));
                // Add 'active-link' to the clicked link
                this.classList.add('active-link');

                // Show the target view and hide others
                contentViews.forEach(view => {
                    if (view.id === targetViewId) {
                        view.classList.add('active-view');
                    } else {
                        view.classList.remove('active-view');
                    }
                });
                
                // Close sidebar on link click on mobile
                if (window.innerWidth <= 992) {
                    sidebar.classList.remove('active');
                }
            });
        });
    }

    // 3. Background Animation Creation
    function createTeacherBgAnimation() {
        const container = document.getElementById('teacher-bg-animation');
        if (!container) return; // Exit if container not found

        const numberOfBlocks = 20;

        for (let i = 0; i < numberOfBlocks; i++) {
            const block = document.createElement('div');
            block.classList.add('teacher-dash-block');

            const size = Math.random() * (60 - 15) + 15;
            block.style.width = `${size}px`;
            block.style.height = `${size}px`;
            block.style.left = `${Math.random() * 100}vw`;

            const duration = Math.random() * (40 - 15) + 15;
            block.style.animationDuration = `${duration}s`;
            const delay = Math.random() * 15;
            block.style.animationDelay = `${delay}s`;

            container.appendChild(block);
        }
    }

    createTeacherBgAnimation();

});