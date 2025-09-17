document.addEventListener("DOMContentLoaded", function() {
    // DOM Elements
    const authButton = document.getElementById('authButton');
    const userDropdown = document.getElementById('userDropdown');
    const userGreeting = document.getElementById('userGreeting');
    const logoutLink = document.getElementById('logoutLink');
    
    // Initialize auth modal state if it exists
    const authModal = document.getElementById('authModal');
    
    // Update UI based on authentication state
    function updateAuthUI() {
        const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
        const isLoggedIn = user && user.loggedIn;
        
        if (isLoggedIn) {
            // User is logged in
            authButton.style.display = 'none';
            userDropdown.style.display = 'block';
            userGreeting.textContent = `Welcome, ${user.name.split(' ')[0]}`;
            
            // Redirect to dashboard if on login/signup page
            if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            }
        } else {
            // User is not logged in
            authButton.style.display = 'inline-block';
            userDropdown.style.display = 'none';
            
            // If on dashboard without being logged in, redirect to home
            if (window.location.pathname.includes('dashboard.html')) {
                window.location.href = 'index.html';
            }
        }
    }
    
    // Logout function
    function logout() {
        const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
        if (user) {
            user.loggedIn = false;
            localStorage.setItem('currentUser', JSON.stringify(user));
            updateAuthUI();
            showNotification('Logged out successfully', false);
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
    }
    
    // Event listeners
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
    
    // Check auth state on page load
    updateAuthUI();
    // Initialize auth modal state
    const initializeAuthModal = () => {
        const authModal = document.getElementById('authModal');
        if (authModal) {
            // Show login view by default
            showLoginView();
            
            // Close modal when clicking outside content
            authModal.addEventListener('click', (e) => {
                if (e.target === authModal) {
                    hideAuthModal();
                }
            });
        }
    };
    
    // Call initialization
    initializeAuthModal();

    // --- Hero Section Typing Animation ---
    const titleEl = document.getElementById('hero-title');
    if (titleEl) {
        const textToType = "Welcome, Future Champion!";
        let index = 0;
        function typeWriter() {
            if (index < textToType.length) {
                titleEl.innerHTML += textToType.charAt(index);
                index++;
                setTimeout(typeWriter, 100);
            }
        }
        typeWriter();
    }

    // --- Mobile Navigation (Hamburger Menu) ---
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });
        document.querySelectorAll(".nav-link, #authButton").forEach(n => n.addEventListener("click", () => {
            if (hamburger.classList.contains('active')) {
                hamburger.classList.remove("active");
                navMenu.classList.remove("active");
            }
        }));
    }

    // --- Sign In/Up Modal functionality
    const closeButtons = document.querySelectorAll('.close-button, .close');
    
    // Show auth modal
    const showAuthModal = () => {
        if (authModal) {
            authModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            // Show login view when modal opens
            showLoginView();
        }
    };

    // Hide auth modal
    const hideAuthModal = () => {
        if (authModal) {
            authModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };

    // Event listener for auth button
    if (authButton) {
        authButton.addEventListener('click', function(e) {
            e.preventDefault();
            showAuthModal();
            // Ensure login view is shown by default
            showLoginView();
        });
    }
    
    // Function to show login view
    function showLoginView() {
        console.log('Showing login view');
        // Activate login tab
        document.querySelectorAll('.auth-tab').forEach(tab => {
            const isLoginTab = tab.dataset.view === 'login';
            if (isLoginTab) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        // Show login view and hide others
        document.querySelectorAll('.auth-view').forEach(view => {
            if (view.id === 'loginView') {
                view.classList.add('active-view');
            } else {
                view.classList.remove('active-view');
            }
        });
    }

    // Event listeners for close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            hideAuthModal();
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === authModal) {
            hideAuthModal();
        }
    });

    // Switch between login and signup views
    document.querySelectorAll('.auth-tab, .switch-to-login, .switch-to-signup').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetView = this.dataset.view || 
                             (this.classList.contains('switch-to-login') ? 'login' : 'signup');
            
            console.log('Switching to view:', targetView);
            
            // Update active tab
            document.querySelectorAll('.auth-tab').forEach(tab => {
                if (tab.dataset.view === targetView) {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            });
            
            // Show the target view and hide others
            document.querySelectorAll('.auth-view').forEach(view => {
                const isTarget = (targetView === 'login' && view.id === 'loginView') ||
                               (targetView === 'signup' && view.id === 'signupView');
                
                if (isTarget) {
                    view.classList.add('active-view');
                } else {
                    view.classList.remove('active-view');
                }
            });
            
            // If switching to signup, ensure the first tab is active
            if (targetView === 'signup') {
                const firstTab = document.querySelector('.tab-link[data-tab="student"]');
                if (firstTab) firstTab.click();
            }
        });
    });

    // Tab switching for signup forms
    const tabLinks = document.querySelectorAll('.tab-link');
    const forms = document.querySelectorAll('#signupView .auth-form');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = link.getAttribute('data-tab');
            
            console.log('Switching to tab:', tab);
            
            // Update active tab
            tabLinks.forEach(tabLink => tabLink.classList.remove('active'));
            link.classList.add('active');
            
            // Show corresponding form
            forms.forEach(form => {
                const shouldBeActive = form.id === `${tab}SignupForm`;
                form.classList.toggle('active-form', shouldBeActive);
                console.log('Form', form.id, 'is now', shouldBeActive ? 'active' : 'inactive');
            });
        });
    });

    // --- Authentication Helpers ---
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    function validatePhone(phone) {
        const re = /^[0-9\-\+\(\)\s]{10,20}$/;
        return re.test(phone);
    }

    // Simple async hashing function (for demo purposes - use a proper library in production)
    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    
    // Input sanitization to prevent XSS
    function sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    // Common function to handle user registration
    async function registerUser(userData) {
        try {
            // Get existing users
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            // Check if email already exists
            if (users.some(user => user.email === userData.email)) {
                throw new Error('An account with this email already exists');
            }
            
            // Hash the password
            userData.password = await hashPassword(userData.password);
            userData.id = Date.now().toString();
            userData.loggedIn = true;
            
            // Sanitize all string inputs
            Object.keys(userData).forEach(key => {
                if (typeof userData[key] === 'string') {
                    userData[key] = sanitizeInput(userData[key]);
                }
            });
            
            // Save user
            users.push(userData);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Set current user session
            const currentUser = { ...userData };
            delete currentUser.password; // Don't store password in session
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            return { success: true, user: currentUser };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: error.message };
        }
    }

    function checkAuth() {
        const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
        if (user && user.loggedIn) {
            // Redirect to the appropriate dashboard
            switch(user.role) {
                case 'student':
                    window.location.href = 'dashboard.html';
                    break;
                case 'parent':
                    window.location.href = 'parent.html';
                    break;
                case 'teacher':
                    window.location.href = 'teacher.html';
                    break;
            }
        }
    }

    function showNotification(message, isError = false) {
        // Remove any existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${isError ? 'error' : 'success'}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '5px';
        notification.style.color = 'white';
        notification.style.fontWeight = 'bold';
        notification.style.zIndex = '9999';
        notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        
        if (isError) {
            notification.style.backgroundColor = '#f44336';
        } else {
            notification.style.backgroundColor = '#4CAF50';
        }
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    // Update authentication UI when user logs in
    function onLoginSuccess(user) {
        // Update user object with login status
        user.loggedIn = true;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Update UI
        updateAuthUI();
        showNotification('Login successful!', false);
        
        // Redirect based on user role after a short delay
        setTimeout(() => {
            switch(user.role) {
                case 'student':
                    window.location.href = 'dashboard.html';
                    break;
                case 'teacher':
                    window.location.href = 'teacher.html';
                    break;
                case 'parent':
                    window.location.href = 'parent.html';
                    break;
                default:
                    window.location.href = 'dashboard.html';
            }
        }, 1500);
    }
    
    // Check authentication state on page load
    checkAuth();
    updateAuthUI();

    // Toggle password visibility
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('toggle-password')) {
            const icon = e.target;
            const targetId = icon.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            if (passwordInput) {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            }
        }
    });

    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            
            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Find user by email
            const user = users.find(u => u.email === email);
            
            if (!user) {
                showNotification('No account found with this email. Please sign up first.', true);
                return;
            }
            
            // Verify password by hashing input and comparing to stored hash
            const hashedPassword = await hashPassword(password);
            if (hashedPassword !== user.password) {
                showNotification('Incorrect password. Please try again.', true);
                return;
            }
            
            // Call login success handler with user data
            onLoginSuccess({
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name,
                loggedIn: true,
                lastLogin: new Date().toISOString()
            });
        });

    // Student Signup Form Handler
    const studentForm = document.getElementById('studentSignupForm');
    if(studentForm) {
        studentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('studentName').value.trim();
            const email = document.getElementById('studentEmail').value.trim();
            const phone = document.getElementById('studentPhone').value.trim();
            const password = document.getElementById('studentPassword').value;
            const confirmPassword = document.getElementById('studentConfirmPassword').value;
            
            // Basic validation
            if (!name || !email || !phone || !password || !confirmPassword) {
                showNotification('Please fill in all fields', true);
                return;
            }
            
            if (password !== confirmPassword) {
                showNotification('Passwords do not match', true);
                return;
            }
            
            if (password.length < 6) {
                showNotification('Password must be at least 6 characters long', true);
                return;
            }
            
            try {
                const userData = {
                    name,
                    email,
                    password,
                    phone,
                    role: 'student'
                };
                
                const result = await registerUser(userData);
                
                if (result.success) {
                    showNotification('Student account created successfully!');
                    hideAuthModal();
                    
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1500);
                } else {
                    showNotification(result.error || 'Registration failed. Please try again.', true);
                    if (result.error && result.error.includes('already exists')) {
                        setTimeout(() => {
                            const loginLink = studentForm.querySelector('.switch-to-login');
                            if (loginLink) loginLink.click();
                        }, 2000);
                    }
                }
            } catch (error) {
                console.error('Registration error:', error);
                showNotification('An error occurred during registration. Please try again.', true);
            }
        });
    }

    // Parent Signup Form Handler
    const parentForm = document.getElementById('parentSignupForm');
    if(parentForm) {
        parentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('parentName').value.trim();
            const email = document.getElementById('parentEmail').value.trim();
            const phone = document.getElementById('parentPhone').value.trim();
            const studentName = document.getElementById('studentName').value.trim();
            const studentId = document.getElementById('studentId').value.trim();
            const password = document.getElementById('parentPassword').value;
            const confirmPassword = document.getElementById('parentConfirmPassword').value;
            
            // Basic validation
            if (!name || !email || !phone || !studentName || !studentId || !password || !confirmPassword) {
                showNotification('Please fill in all fields', true);
                return;
            }
            
            if (password !== confirmPassword) {
                showNotification('Passwords do not match', true);
                return;
            }
            
            if (password.length < 6) {
                showNotification('Password must be at least 6 characters long', true);
                return;
            }
            
            try {
                const userData = {
                    name,
                    email,
                    password,
                    phone,
                    studentName,
                    studentId,
                    role: 'parent'
                };
                
                const result = await registerUser(userData);
                
                if (result.success) {
                    showNotification('Parent account created successfully!');
                    hideAuthModal();
                    
                    setTimeout(() => {
                        window.location.href = 'parent.html';
                    }, 1500);
                } else {
                    showNotification(result.error || 'Registration failed. Please try again.', true);
                    if (result.error && result.error.includes('already exists')) {
                        setTimeout(() => {
                            const loginLink = parentForm.querySelector('.switch-to-login');
                            if (loginLink) loginLink.click();
                        }, 2000);
                    }
                }
            } catch (error) {
                console.error('Registration error:', error);
                showNotification('An error occurred during registration. Please try again.', true);
            }
        });
    }

    // Teacher Signup Form Handler
    const teacherForm = document.getElementById('teacherSignupForm');
    if(teacherForm) {
        teacherForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = teacherForm.querySelector('#teacherName').value.trim();
            const email = teacherForm.querySelector('#teacherEmail').value.trim();
            const phone = teacherForm.querySelector('#teacherPhone').value.trim();
            const institution = teacherForm.querySelector('#teacherInstitution').value.trim();
            const password = teacherForm.querySelector('#teacherPassword').value;
            const confirmPassword = teacherForm.querySelector('#teacherConfirmPassword').value;
            const subject = teacherForm.querySelector('#teacherSubject').value.trim();
            const qualification = teacherForm.querySelector('#teacherQualification').value.trim();
            
            // Basic validation
            if (!name || !email || !phone || !password || !confirmPassword || !subject || !qualification || !institution) {
                showNotification('Please fill in all fields', true);
                return;
            }
            
            if (!validateEmail(email)) {
                showNotification('Please enter a valid email address', true);
                return;
            }
            
            if (!validatePhone(phone)) {
                showNotification('Please enter a valid phone number', true);
                return;
            }
            
            if (password !== confirmPassword) {
                showNotification('Passwords do not match', true);
                return;
            }
            
            if (password.length < 8) {
                showNotification('Password must be at least 8 characters long', true);
                return;
            }
            
            try {
                const userData = {
                    name,
                    email,
                    password,
                    phone,
                    subject,
                    institution,
                    qualification,
                    role: 'teacher'
                };
                
                const result = await registerUser(userData);
                
                if (result.success) {
                    showNotification('Teacher account created successfully!');
                    hideAuthModal();
                    
                    // Redirect after a short delay
                    setTimeout(() => {
                        window.location.href = 'teacher.html';
                    }, 1500);
                } else {
                    showNotification(result.error || 'Registration failed. Please try again.', true);
                }
            } catch (error) {
                console.error('Registration error:', error);
                showNotification('An error occurred during registration. Please try again.', true);
            }
        });
    }

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            // Ensure it's a link to an ID on the page, not just "#"
            if (targetId && targetId.length > 1) {
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // --- Animate Elements on Scroll ---
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        elementsToAnimate.forEach(el => observer.observe(el));
    } else {
        elementsToAnimate.forEach(el => el.classList.add('visible'));
    }

    // --- Background Animation Creation ---
    function createBgAnimation() {
        const container = document.getElementById('bg-animation-container');
        if (!container) return;
        const numberOfBlocks = 25;
        for (let i = 0; i < numberOfBlocks; i++) {
            const block = document.createElement('div');
            block.classList.add('mc-block');
            const size = Math.random() * (50 - 15) + 15;
            block.style.width = `${size}px`;
            block.style.height = `${size}px`;
            block.style.left = `${Math.random() * 100}vw`;
            const duration = Math.random() * (30 - 10) + 10;
            block.style.animationDuration = `${duration}s`;
            const delay = Math.random() * 10;
            block.style.animationDelay = `${delay}s`;
            container.appendChild(block);
        }
    }
    };
    
    createBgAnimation();
});