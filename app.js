let employees = JSON.parse(localStorage.getItem('employees')) || [];

if (employees.length === 0) {
  employees = [
    { id: 1, firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com', department: 'HR', role: 'Manager' },
    { id: 2, firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com', department: 'IT', role: 'Developer' },
    { id: 3, firstName: 'Charlie', lastName: 'Lee', email: 'charlie@example.com', department: 'Finance', role: 'Analyst' }
  ];
  saveEmployees();
}

function saveEmployees() {
  localStorage.setItem('employees', JSON.stringify(employees));
}

function renderEmployees() {
  const list = document.getElementById('employeeList');
  if (!list) return;

  const search = document.getElementById('searchInput')?.value.toLowerCase() || '';
  const filterFirst = document.getElementById('filterFirst')?.value.toLowerCase() || '';
  const filterDept = document.getElementById('filterDept')?.value.toLowerCase() || '';
  const filterRole = document.getElementById('filterRole')?.value.toLowerCase() || '';
  const sortOption = document.getElementById('sortBy')?.value || '';

  list.innerHTML = '';

  let filtered = employees.filter(emp =>
    (emp.firstName + ' ' + emp.lastName).toLowerCase().includes(search) ||
    emp.email.toLowerCase().includes(search)
  ).filter(emp =>
    emp.firstName.toLowerCase().includes(filterFirst) &&
    emp.department.toLowerCase().includes(filterDept) &&
    emp.role.toLowerCase().includes(filterRole)
  );

  // ✅ Apply sorting
  if (sortOption === 'firstName') {
    filtered.sort((a, b) => a.firstName.localeCompare(b.firstName));
  } else if (sortOption === 'department') {
    filtered.sort((a, b) => a.department.localeCompare(b.department));
  }

  filtered.forEach(emp => {
    const card = document.createElement('div');
    card.className = 'employee-card';
    card.innerHTML = `
      <h4>${emp.firstName} ${emp.lastName}</h4>
      <p><strong>Email:</strong> ${emp.email}</p>
      <p><strong>Department:</strong> ${emp.department}</p>
      <p><strong>Role:</strong> ${emp.role}</p>
      <div class="card-actions">
        <button onclick="editEmployee(${emp.id})">Edit</button>
        <button onclick="deleteEmployee(${emp.id})">Delete</button>
      </div>
    `;
    list.appendChild(card);
  });
}



function showForm() {
  window.location.href = 'form.html';
}

function editEmployee(id) {
  window.location.href = 'form.html?id=' + id;
}

function deleteEmployee(id) {
  employees = employees.filter(e => e.id !== id);
  saveEmployees();
  renderEmployees();
}

function toggleFilter() {
  document.getElementById('filterSidebar').classList.toggle('active');
}

function applyFilters() {
  renderEmployees();
}

function resetFilters() {
  document.getElementById('filterFirst').value = '';
  document.getElementById('filterDept').value = '';
  document.getElementById('filterRole').value = '';
  renderEmployees();
}

function cancelForm() {
  window.location.href = 'index.html';
}

function initForm() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = parseInt(urlParams.get('id'));

  if (!isNaN(id)) {
    const emp = employees.find(e => e.id === id);
    if (emp) {
      document.getElementById('empId').value = emp.id;
      document.getElementById('firstName').value = emp.firstName;
      document.getElementById('lastName').value = emp.lastName;
      document.getElementById('email').value = emp.email;
      document.getElementById('department').value = emp.department;
      document.getElementById('role').value = emp.role;
    }
  }

  document.getElementById('employeeForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const emp = {
      id: document.getElementById('empId').value ? parseInt(document.getElementById('empId').value) : Date.now(),
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      email: document.getElementById('email').value,
      department: document.getElementById('department').value,
      role: document.getElementById('role').value
    };

    if (emp.id && employees.find(e => e.id === emp.id)) {
      employees = employees.map(e => e.id === emp.id ? emp : e);
    } else {
      employees.push(emp);
    }

    saveEmployees();
    window.location.href = 'index.html';
  });
}

window.onload = () => {
  if (document.getElementById('employeeList')) renderEmployees();
  if (document.getElementById('employeeForm')) initForm();
};
