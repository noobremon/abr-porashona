document.addEventListener("DOMContentLoaded", function() {

    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    const gridCards = document.querySelectorAll('.content-grid .grid-card');


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
                // Prevent default anchor behavior if it's just a placeholder link
                if (this.getAttribute('href') === '#') {
                    e.preventDefault();
                }

                // Remove 'active-link' class from all links in the main nav
                navLinks.forEach(item => item.classList.remove('active-link'));
                
                // Add 'active-link' to the clicked link
                this.classList.add('active-link');
                
                // Optional: Close sidebar on link click on mobile
                if (window.innerWidth <= 992) { // Use 992px, same as CSS media query for sidebar
                    sidebar.classList.remove('active');
                }
            });
        });
    }

    // 3. Staggered entrance animation for grid cards
    gridCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('animate-on-load');
        }, index * 150); // Stagger by 150ms for each card
    });

    // 4. Background Animation Creation (similar to student dashboard)
    function createParentBgAnimation() {
        const container = document.getElementById('parent-bg-animation');
        if (!container) return; // Exit if container not found

        const numberOfBlocks = 20; // Adjust for more/fewer blocks

        for (let i = 0; i < numberOfBlocks; i++) {
            const block = document.createElement('div');
            block.classList.add('parent-dash-block'); // Use specific class for parent dash

            // Randomize size
            const size = Math.random() * (60 - 15) + 15; // Size between 15px and 60px
            block.style.width = `${size}px`;
            block.style.height = `${size}px`;

            // Randomize horizontal position
            block.style.left = `${Math.random() * 100}vw`;

            // Randomize animation duration and delay
            const duration = Math.random() * (40 - 15) + 15; // Duration between 15s and 40s
            block.style.animationDuration = `${duration}s`;
            const delay = Math.random() * 15; // Delay up to 15s
            block.style.animationDelay = `${delay}s`;

            container.appendChild(block);
        }
    }

    createParentBgAnimation();

});