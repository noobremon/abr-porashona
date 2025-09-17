document.addEventListener("DOMContentLoaded", function() {

    // --- MOCK DATA ---
    let uploadedResults = [
        { id: 1, class: "10", section: "A", exam: "Mid-Term", date: "2025-09-15", students: 32 },
        { id: 2, class: "9", section: "B", exam: "Unit Test", date: "2025-09-10", students: 28 },
    ];

    // --- Element Selectors ---
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const form = document.getElementById('result-upload-form');
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const fileArea = document.getElementById('file-upload-area');
    const manualArea = document.getElementById('manual-entry-area');
    const addRowBtn = document.getElementById('add-row-btn');
    const manualTableBody = document.getElementById('manual-table-body');
    const resultsListContainer = document.getElementById('uploaded-results-list');
    const searchInput = document.getElementById('search-uploads');

    let activeUploadMethod = 'file';

    // --- RENDER FUNCTIONS ---
    function renderResultsList() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredData = uploadedResults.filter(item => 
            `class ${item.class}`.toLowerCase().includes(searchTerm) ||
            item.exam.toLowerCase().includes(searchTerm)
        );

        resultsListContainer.innerHTML = '';
        if (filteredData.length === 0) {
            resultsListContainer.innerHTML = '<p>No uploaded results found.</p>';
            return;
        }

        filteredData.forEach(item => {
            const resultElement = document.createElement('div');
            resultElement.className = 'result-item';
            resultElement.innerHTML = `
                <div class="result-item-icon">📊</div>
                <div class="result-item-info">
                    <h4>${item.exam} - Class ${item.class}${item.section}</h4>
                    <p class="result-item-meta">Uploaded on ${item.date} | ${item.students} Students Evaluated</p>
                </div>
                <div class="result-item-actions">
                    <button title="View"><i class="fas fa-eye"></i></button>
                    <button title="Edit"><i class="fas fa-edit"></i></button>
                    <button title="Delete" class="delete-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                    <button title="Share"><i class="fas fa-share-alt"></i></button>
                </div>
            `;
            resultsListContainer.appendChild(resultElement);
        });
    }

    // --- EVENT LISTENERS ---
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => sidebar.classList.toggle('active'));
    }

    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            toggleButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeUploadMethod = btn.dataset.method;
            
            if (activeUploadMethod === 'file') {
                fileArea.classList.add('active');
                manualArea.classList.remove('active');
            } else {
                fileArea.classList.remove('active');
                manualArea.classList.add('active');
                if(manualTableBody.children.length === 0) addManualRow(); // Add one row by default
            }
        });
    });

    function addManualRow() {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="text" placeholder="Roll No."></td>
            <td><input type="text" placeholder="Name"></td>
            <td><input type="text" placeholder="Marks"></td>
            <td><input type="text" placeholder="Grade"></td>
            <td><button type="button" class="delete-row-btn">&times;</button></td>
        `;
        manualTableBody.appendChild(row);
        row.querySelector('.delete-row-btn').addEventListener('click', () => row.remove());
    }

    addRowBtn.addEventListener('click', addManualRow);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const classVal = document.getElementById('class-select').value;
        const sectionVal = document.getElementById('section-select').value;
        const examType = document.getElementById('exam-type-select').value;
        const examDate = document.getElementById('exam-date').value;

        if (!classVal || !sectionVal || !examType || !examDate) {
            showToast('Please fill all the details.', 'error');
            return;
        }

        const newResult = {
            id: Date.now(),
            class: classVal,
            section: sectionVal,
            exam: examType,
            date: examDate,
            students: activeUploadMethod === 'file' ? 'File' : manualTableBody.children.length
        };
        
        uploadedResults.unshift(newResult);
        renderResultsList();
        form.reset();
        showToast('Result uploaded successfully!');
    });

    searchInput.addEventListener('input', renderResultsList);
    
    resultsListContainer.addEventListener('click', (e) => {
        if (e.target.closest('.delete-btn')) {
            const id = parseInt(e.target.closest('.delete-btn').dataset.id);
            if(confirm('Are you sure you want to delete this result entry?')) {
                uploadedResults = uploadedResults.filter(item => item.id !== id);
                renderResultsList();
                showToast('Entry deleted.', 'error');
            }
        }
    });

    // --- UTILITY FUNCTIONS ---
    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast-notification');
        toast.textContent = message;
        toast.className = `toast show ${type}`;
        setTimeout(() => {
            toast.className = 'toast';
        }, 3000);
    }
    
    // --- INITIAL LOAD ---
    renderResultsList();
});