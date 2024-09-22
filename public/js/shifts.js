document.addEventListener('DOMContentLoaded', () => {
    const shiftForm = document.getElementById('shift-form');
    const shiftList = document.getElementById('shift-list');

    shiftForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get the values from the form
        const date = document.getElementById('shift-date').value;
        const start = document.getElementById('shift-start').value;
        const end = document.getElementById('shift-end').value;

        if (date && start && end) {
            // Create a new list item
            const shiftItem = document.createElement('li');
            shiftItem.innerHTML = `
                <div class="shift-info">
                    <span><strong>Date:</strong> ${date}</span>
                    <span><strong>Start Time:</strong> ${start}</span>
                    <span><strong>End Time:</strong> ${end}</span>
                </div>
                <button class="delete-btn"><i class="fas fa-trash-alt"></i> Delete</button>
            `;

            // Append the new shift to the list
            shiftList.appendChild(shiftItem);

            // Clear the form fields
            shiftForm.reset();

            // Notify the user
            alert('Shift added successfully!');
        } else {
            alert('Please fill in all fields.');
        }
    });

    // Event delegation for deleting shifts
    shiftList.addEventListener('click', (e) => {
        if (e.target.closest('.delete-btn')) {
            // Confirm deletion
            if (confirm('Are you sure you want to delete this shift?')) {
                // Remove the shift item
                e.target.closest('li').remove();
            }
        }
    });
});
