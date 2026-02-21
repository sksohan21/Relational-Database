const API_URL = 'http://localhost:3000/api/employees';

// 1. Load Employees on Page Load
document.addEventListener('DOMContentLoaded', loadEmployees);

// 2. Handle Form Submit
document.getElementById('employeeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const employeeData = {
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value,
        email: document.getElementById('email').value,
        department: document.getElementById('department').value,
        salary: document.getElementById('salary').value,
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employeeData)
        });

        const result = await response.json();
        
        if (response.ok) {
            alert('✅ Employee added successfully!');
            document.getElementById('employeeForm').reset();
            loadEmployees();
        } else {
            alert('❌ Error: ' + result.error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// 3. Fetch and Display Employees
async function loadEmployees() {
    try {
        const response = await fetch(API_URL);
        const employees = await response.json();
        
        const tbody = document.getElementById('employeeList');
        tbody.innerHTML = '';

        employees.forEach(emp => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${emp.id}</td>
                <td>${emp.first_name} ${emp.last_name}</td>
                <td>${emp.email}</td>
                <td>${emp.department}</td>
                <td>$${parseFloat(emp.salary).toLocaleString()}</td>
                <td><button class="delete-btn" onclick="deleteEmployee(${emp.id})">🗑️ Delete</button></td>
            `;
            tbody.appendChild(row);
        });

        document.getElementById('totalCount').textContent = employees.length;
    } catch (error) {
        console.error('Error loading employees:', error);
    }
}

// 4. Delete Employee
async function deleteEmployee(id) {
    if (confirm('Are you sure you want to delete this employee?')) {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            loadEmployees();
            alert('✅ Employee deleted successfully!');
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    }
}