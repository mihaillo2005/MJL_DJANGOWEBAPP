document.addEventListener('DOMContentLoaded', () => {
    fetchStudentData();
});

async function fetchStudentData() {
    const studentCountEl = document.getElementById('student-count');
    const studentTableBody = document.getElementById('student-table-body');
    const statusMessageEl = document.getElementById('status-message');

    // Display Loading State
    if (statusMessageEl) {
        statusMessageEl.textContent = 'Loading student data...';
        statusMessageEl.className = 'alert alert-info';
    }

    try {
        // Fetch API request to the protected Django endpoint
        const response = await fetch('/api/students/', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        // Handle Unauthenticated (401) or HTTP Errors
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('401 Unauthorized: Please log in to view student data.');
            }
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Update Student Count
        if (studentCountEl) {
            studentCountEl.textContent = data.count !== undefined ? data.count : (data.results ? data.results.length : data.length);
        }

        // Determine student array format (paginated or direct array)
        const students = data.results || (Array.isArray(data) ? data : []);

        // Clear table and status message
        if (studentTableBody) studentTableBody.innerHTML = '';
        if (statusMessageEl) statusMessageEl.textContent = '';

        // Handle Empty Data State
        if (students.length === 0) {
            if (statusMessageEl) {
                statusMessageEl.textContent = 'No student records found.';
                statusMessageEl.className = 'alert alert-warning';
            }
            return;
        }

        // Dynamically Render Student Records into DOM
        students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.id || student.student_id || '-'}</td>
                <td>${student.first_name || ''} ${student.last_name || ''}</td>
                <td>${student.email || '-'}</td>
                <td>${student.course || student.program || '-'}</td>
            `;
            studentTableBody.appendChild(row);
        });

    } catch (error) {
        console.error('Fetch error:', error);
        if (statusMessageEl) {
            statusMessageEl.textContent = error.message;
            statusMessageEl.className = 'alert alert-danger';
        }
    }
}