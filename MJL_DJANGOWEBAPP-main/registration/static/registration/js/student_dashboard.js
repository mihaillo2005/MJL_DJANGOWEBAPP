document.addEventListener('DOMContentLoaded', function () {
    let allStudents = [];

    const searchInput = document.getElementById('search-input');
    const programFilter = document.getElementById('program-filter');
    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    const refreshDataBtn = document.getElementById('refresh-data-btn');
    const tableBody = document.getElementById('student-table-body');
    const filteredCountSpan = document.getElementById('filtered-count');
    const noRecordsMsg = document.getElementById('no-records-msg');
    const statusMessage = document.getElementById('status-message');
    const studentCountHeader = document.getElementById('student-count');

    // Fetch initial student data from API
    function fetchStudents() {
        if (statusMessage) statusMessage.textContent = 'Loading student records...';

        fetch('/api/students/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                allStudents = data;
                if (studentCountHeader) studentCountHeader.textContent = allStudents.length;
                if (statusMessage) statusMessage.textContent = '';
                applyFilters();
            })
            .catch(error => {
                console.error('Fetch error:', error);
                if (statusMessage) statusMessage.textContent = 'Error loading student data.';
            });
    }

    // Filter and render logic
    function applyFilters() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const selectedProgram = programFilter ? programFilter.value : '';

        const filteredList = allStudents.filter(student => {
            const fullName = (student.name || `${student.first_name || ''} ${student.last_name || ''}`).toLowerCase();
            const email = (student.email || '').toLowerCase();
            const program = student.program || student.course || '';

            const matchesSearch = fullName.includes(query) || email.includes(query);
            const matchesProgram = selectedProgram === '' || program === selectedProgram;

            return matchesSearch && matchesProgram;
        });

        renderTable(filteredList);
    }

    // Render students into table and toggle empty state message
    function renderTable(students) {
        tableBody.innerHTML = '';

        if (filteredCountSpan) {
            filteredCountSpan.textContent = students.length;
        }

        if (students.length === 0) {
            if (noRecordsMsg) noRecordsMsg.style.display = 'block';
        } else {
            if (noRecordsMsg) noRecordsMsg.style.display = 'none';

            students.forEach(student => {
                const row = document.createElement('tr');
                const name = student.name || `${student.first_name || ''} ${student.last_name || ''}`;
                const program = student.program || student.course || 'N/A';

                row.innerHTML = `
                    <td>${student.id}</td>
                    <td>${name}</td>
                    <td>${student.email}</td>
                    <td>${program}</td>
                `;
                tableBody.appendChild(row);
            });
        }
    }

    // Event Listeners
    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (programFilter) programFilter.addEventListener('change', applyFilters);

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function () {
            if (searchInput) searchInput.value = '';
            if (programFilter) programFilter.value = '';
            applyFilters();
        });
    }

    if (refreshDataBtn) {
        refreshDataBtn.addEventListener('click', function () {
            fetchStudents();
        });
    }

    // Initial load
    fetchStudents();
});