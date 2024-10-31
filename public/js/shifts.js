document.addEventListener('DOMContentLoaded', () => {
    const shiftForm = document.getElementById('shift-form');
    const shiftList = document.getElementById('shift-list');

    // Event listener for adding a shift
    shiftForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get the values from the form
        const date = document.getElementById('shift-date').value;
        const start = document.getElementById('shift-start').value;
        const end = document.getElementById('shift-end').value;

        if (date && start && end) {
            // Create a new list item
            let shiftItem = document.createElement('li');
            shiftItem.innerHTML = `
                <div class="shift-info">
                    <span class="shiftDate"><strong>Date:</strong> ${date}</span>
                    <span class="shiftTime"><strong>Start Time:</strong> ${start}</span>
                    <span class="endTime"><strong>End Time:</strong> ${end}</span>
                </div>
                <button class="delete-btn"><i class="fas fa-trash-alt"></i> Delete</button>
                <button class="save-btn"> Save</button>
                <h4 class="success" style="display:none;">Data saved successfully</h4>
                <h4 class="failed" style="display:none;">Sorry, data save unsuccessful</h4>
            `;

            // Append the new shift to the list
            shiftList.prepend(shiftItem);

            // Clear the form fields
            shiftForm.reset();

            // No alert for successful addition
        } else {
            // Show a message instead of alert
            const errorMsg = document.createElement('p');
            errorMsg.textContent = 'Please fill in all fields.';
            errorMsg.style.color = 'red';
            shiftForm.appendChild(errorMsg);

            // Automatically remove the message after 3 seconds
            setTimeout(() => {
                shiftForm.removeChild(errorMsg);
            }, 3000);
        }
    });

    // Event delegation for deleting shifts
    shiftList.addEventListener('click', (e) => {
        if (e.target.closest('.delete-btn')) {
            // Remove the shift item directly without confirmation
            e.target.closest('li').remove();
        }
    });

    // Event delegation for saving shifts
    shiftList.addEventListener('click', (e) => {
        if (e.target.closest('.save-btn')) {
            // Find the shift item
            const shiftItem = e.target.closest('li');

            // Retrieve the shift data from the DOM
            const shiftDate = shiftItem.querySelector('.shiftDate').textContent.replace('Date: ', '').trim();
            const shiftTime = shiftItem.querySelector('.shiftTime').textContent.replace('Start Time: ', '').trim();
            const endTime = shiftItem.querySelector('.endTime').textContent.replace('End Time: ', '').trim();

            // Prepare data to be sent to the server
            const data = { shiftDate, shiftTime, endTime };
            const api = "http://localhost:3003/shiftSendDate";
            
            // Send data to the API
            fetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Sending JSON data
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json()) // Parse the response as JSON
            .then(data => {
                const successMessage = shiftItem.querySelector(".success");
                const failedMessage = shiftItem.querySelector(".failed");
                const saveBtn = shiftItem.querySelector(".save-btn");
                const deleteBtn = shiftItem.querySelector(".delete-btn");

                // Hide the save and delete buttons
                saveBtn.style.display = 'none';
                deleteBtn.style.display = 'none';

                // Display the appropriate message based on the response
                if (data.message === "success") {
                    successMessage.style.display = "block"; // Show success message
                } else {
                    failedMessage.style.display = "block"; // Show failure message
                }
            })
            .catch(error => {
                console.error("Error:", error); // Log any errors that occur during fetch
                const failedMessage = shiftItem.querySelector(".failed");
                failedMessage.style.display = "block"; // Show failure message
            });
        }
    });
});
