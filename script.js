
console.log("JavaScript connected successfully");


// ==========================================
// 1. Store student records and editing state
// ==========================================

let students = [];

let editingId = null;


// ==========================================
// 2. Access HTML elements
// ==========================================

const studentForm = document.getElementById("studentForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const mobileInput = document.getElementById("mobile");
const courseInput = document.getElementById("course");
const studentList = document.getElementById("studentList");
const searchInput = document.getElementById("searchInput");
const errorMessage = document.getElementById("errorMessage");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");


// ==========================================
// 3. Error message functions
// ==========================================

function showError(message) {

    errorMessage.textContent = message;

}


function clearError() {

    errorMessage.textContent = "";

}


// ==========================================
// 4. Form validation
// ==========================================

function validateForm(name, email, mobile, course) {

    // Mandatory field validation

    if (!name || !email || !mobile || !course) {

        showError("All fields are required!");

        return false;

    }


    // Email format validation

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        showError("Please enter a valid email address!");

        emailInput.focus();

        return false;

    }


    // Mobile number validation

    const mobilePattern = /^[0-9]{10}$/;

    if (!mobilePattern.test(mobile)) {

        showError("Mobile number must contain exactly 10 digits!");

        mobileInput.focus();

        return false;

    }


    // Duplicate email validation
    // Exclude the student currently being edited

    const emailExists = students.some(function(student) {

        return student.email.toLowerCase() === email.toLowerCase()
            && student.id !== editingId;

    });


    if (emailExists) {

        showError("This email is already registered!");

        emailInput.focus();

        return false;

    }


    // All validations passed

    return true;

}


// ==========================================
// 5. Add or Update Student
// ==========================================

studentForm.addEventListener("submit", function(event) {

    // Prevent page reload

    event.preventDefault();


    // Clear previous errors

    clearError();


    // Retrieve form values

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const mobile = mobileInput.value.trim();
    const course = courseInput.value;


    // Validate form data

    if (!validateForm(name, email, mobile, course)) {

        return;

    }


    // ADD MODE

    if (editingId === null) {

        const student = {

            id: Date.now(),
            name,
            email,
            mobile,
            course

        };


        // Add new student to array

        students.push(student);

    }


    // EDIT MODE

    else {

        // Find index of existing student

        const index = students.findIndex(function(student) {

            return student.id === editingId;

        });


        // Check whether student exists

        if (index === -1) {

            showError("Student not found!");

            return;

        }


        // Update existing student

        students[index] = {

            id: editingId,
            name,
            email,
            mobile,
            course

        };

    }


    // Refresh student records

    searchStudents();


    // Reset form and editing state

    resetForm();


    // Debugging

    console.log(students);

});


// ==========================================
// 6. Display Students
// ==========================================

function displayStudents(studentArray = students) {

    // Clear existing table rows

    studentList.innerHTML = "";


    // Handle empty student records

    if (studentArray.length === 0) {

        const row = document.createElement("tr");

        const cell = document.createElement("td");

        cell.colSpan = 6;

        cell.textContent = "No students found";

        cell.className = "no-records";

        row.appendChild(cell);

        studentList.appendChild(row);

        return;

    }


    // Iterate over student records

    studentArray.forEach(function(student, index) {

        // Create table row

        const row = document.createElement("tr");


        // Student values

        const values = [

            index + 1,
            student.name,
            student.email,
            student.mobile,
            student.course

        ];


        // Create table cells

        values.forEach(function(value) {

            const cell = document.createElement("td");

            cell.textContent = value;

            row.appendChild(cell);

        });


        // Create actions cell

        const actions = document.createElement("td");


        // Create Edit button

        const editButton = document.createElement("button");

        editButton.textContent = "Edit";

        editButton.className = "edit-btn";

        editButton.type = "button";


        // Edit button click event

        editButton.addEventListener("click", function() {

            editStudent(student.id);

        });


        // Create Delete button

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";

        deleteButton.className = "delete-btn";

        deleteButton.type = "button";


        // Delete button click event

        deleteButton.addEventListener("click", function() {

            deleteStudent(student.id);

        });


        // Add buttons to actions cell

        actions.appendChild(editButton);

        actions.appendChild(deleteButton);


        // Add actions cell to row

        row.appendChild(actions);


        // Add row to table

        studentList.appendChild(row);

    });

}


// ==========================================
// 7. Edit Student
// ==========================================

function editStudent(id) {

    // Find the selected student

    const student = students.find(function(student) {

        return student.id === id;

    });


    // Check whether student exists

    if (!student) {

        return;

    }


    // Populate existing student details

    nameInput.value = student.name;

    emailInput.value = student.email;

    mobileInput.value = student.mobile;

    courseInput.value = student.course;


    // Set editing state

    editingId = id;


    // Change submit button text

    submitBtn.textContent = "Update Student";


    // Show Cancel Edit button

    cancelBtn.hidden = false;


    // Clear previous validation errors

    clearError();


    // Scroll to registration form

    studentForm.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });


    // Focus student name field

    nameInput.focus({ preventScroll: true });

}


// ==========================================
// 8. Delete Student
// ==========================================

function deleteStudent(id) {

    // Find selected student

    const student = students.find(function(student) {

        return student.id === id;

    });


    // Check whether student exists

    if (!student) {

        return;

    }


    // Ask user for confirmation

    const confirmed = confirm(
        `Are you sure you want to delete ${student.name}?`
    );


    // Stop if user clicks Cancel

    if (!confirmed) {

        return;

    }


    // Remove student from array

    students = students.filter(function(student) {

        return student.id !== id;

    });


    // Reset form if deleted student is being edited

    if (editingId === id) {

        resetForm();

    }


    // Refresh student records

    searchStudents();


    // Debugging

    console.log("Student deleted successfully");

    console.log(students);

}


// ==========================================
// 9. Reset Form
// ==========================================

function resetForm() {

    // Clear registration form

    studentForm.reset();


    // Restore Add Mode

    editingId = null;


    // Restore submit button text

    submitBtn.textContent = "Add Student";


    // Hide Cancel Edit button

    cancelBtn.hidden = true;


    // Clear validation errors

    clearError();

}


// ==========================================
// 10. Search Students
// ==========================================

function searchStudents() {

    // Retrieve and normalize search text

    const searchText = searchInput.value.trim().toLowerCase();


    // Filter matching student records

    const filteredStudents = students.filter(function(student) {

        return student.name.toLowerCase().includes(searchText);

    });


    // Display filtered records

    displayStudents(filteredStudents);

}


// ==========================================
// 11. Search event listener
// ==========================================

searchInput.addEventListener("input", searchStudents);


// ==========================================
// 12. Cancel Edit event listener
// ==========================================

cancelBtn.addEventListener("click", resetForm);


// ==========================================
// 13. Display initial records
// ==========================================

searchStudents();
