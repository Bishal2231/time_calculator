
// // --------------home body-----------------



// --------------navbar-----------------

document.querySelector('.navbar-toggler').addEventListener('click', function() {
    document.querySelector('.navbar-nav').classList.toggle('active');
});

// Close dropdown when clicking outside of it
document.addEventListener('click', function(event) {
    const navMenu = document.querySelector('.navbar-nav');
    const navToggle = document.querySelector('.navbar-toggler');

    if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
        navMenu.classList.remove('active');
    }
});

// --------------home body-----------------

let isClockedIn = false;
let startTime;
let totalHours = 0;
let totalEarnings = 0;
let startclock;  // Declare startclock at a global level
let endclock;    // Declare endclock at a global level

document.getElementById('clock-in-btn').addEventListener('click', function() {
    if (!isClockedIn) {
        startTime = new Date();
        isClockedIn = true;
        document.getElementById('clock-in-btn').disabled = true;
        let timeLog=document.getElementById('time-logs');    
        timeLog.style.display="block";   
        timeLog.innerText=" "

        document.getElementById('clock-out-btn').disabled = false;
        startclock = startTime.toLocaleTimeString();  // Now it sets the global startclock variable
        addLog('Clocked in at ' + startclock);
    }
});

document.getElementById('clock-out-btn').addEventListener('click', function() {
    if (isClockedIn) {
        let endTime = new Date();
        let hoursWorked = (endTime - startTime) / 3600000; // Convert ms to hours
        totalHours += hoursWorked;
        endclock = endTime.toLocaleTimeString();  // Now it sets the global endclock variable
        addLog('Clocked out at ' + endclock + ' (Worked ' + hoursWorked.toFixed(2) + ' hours)');

        let hourlyRate = parseFloat(document.getElementById('hourly-rate').value);
        let earnings = hoursWorked * hourlyRate;
        totalEarnings += earnings;

        updateSummary();
        resetClock();
    }
});

document.getElementById('add-manual-time').addEventListener('click', function() {
    let manualHours = parseFloat(document.getElementById('manual-hours').value);
    if (!isNaN(manualHours) && manualHours > 0) {
        totalHours += manualHours;
        let hourlyRate = parseFloat(document.getElementById('hourly-rate').value);
        totalEarnings += manualHours * hourlyRate;
        addLog('Manually added ' + manualHours.toFixed(2) + ' hours');
        updateSummary();
    }
});

function resetClock() {
    isClockedIn = false;
    document.getElementById('clock-in-btn').disabled = false;
    document.getElementById('clock-out-btn').disabled = true;
}

function updateSummary() {
    document.getElementById('total-hours').innerText = totalHours.toFixed(2);
    document.getElementById('total-earnings').innerText = totalEarnings.toFixed(2);
}

function addLog(message) {
    let logEntry = document.createElement('p');
    logEntry.innerText = message;
    document.getElementById('time-logs').appendChild(logEntry);
}

// Function to send the data
function sendData() {
    console.log("startclock:", startclock); // This will now log the correct value
    console.log("endclock:", endclock); 
    console.log("total earning",totalEarnings) 
    



    const data={startclock:startclock?startclock:null,
        endclock:endclock?endclock:null
        ,totalEarnings,totalHours}


const apiURL="http://localhost:3007/sendData"
    fetch(apiURL,{
        method:'POST',
        headers: {
            'Content-Type': 'application/json' // Sending JSON data
        },
        body: JSON.stringify(data) 

    })

    .then(response => response.json()) // Parse the response as JSON
    .then(data => {

        let dashtotalhour =document.getElementById('total-hours');
        let dashtotalearning=document.getElementById('total-earnings');                       
        dashtotalhour.textContent='0';
        dashtotalearning.textContent='0';
      
        let timeLog=document.getElementById('time-logs');  
        
        // timeLog.style.display="none";  


       if( data.message==="success"){
            console.log("success")
            showSuccessBar();
            setTimeout(() => {
                timeLog.innerText="Data saved  sucessfull " // Reset width
            }, 5000);
              

        } 
    else{
            console.log("failure")
            unSuccessBar();
            setTimeout(() => {
                timeLog.innerText="Data  saved unsucessfull " // Reset width
            }, 5000);
             
        }
     
    })
    .catch((error) => {
        console.error('Error:', error); 
    });
}
function unSuccessBar(){
    const successBar = document.getElementById('unSuccessBar');
    const progressBar = document.getElementById('progressBar');

    successBar.style.display = 'block'; // Show the success bar
    progressBar.style.width = '0'; // Reset width for animation

    // Trigger reflow to restart animation
    void progressBar.offsetWidth; // This forces a reflow

    // Start the animation
    progressBar.style.width = '100%';

    // Hide the success bar after 5 seconds
    setTimeout(() => {
        successBar.style.display = 'none';
        progressBar.style.width = '0'; // Reset width
    }, 5000);
}

function showSuccessBar() {
    const successBar = document.getElementById('successBar');
    const progressBar = document.getElementById('progressBar');

    successBar.style.display = 'block'; // Show the success bar
    progressBar.style.width = '0'; // Reset width for animation

    // Trigger reflow to restart animation
    void progressBar.offsetWidth; // This forces a reflow

    // Start the animation
    progressBar.style.width = '100%';

    // Hide the success bar after 5 seconds
    setTimeout(() => {
        successBar.style.display = 'none';
        progressBar.style.width = '0'; // Reset width
    }, 5000);
}

function clearData(){
        let dashtotalhour =document.getElementById('total-hours');
        let dashtotalearning=document.getElementById('total-earnings');                       
        dashtotalhour.textContent='0';
        dashtotalearning.textContent='0';
      
        let timeLog=document.getElementById('time-logs');  
          timeLog.innerText=" "
        timeLog.style.display="none";                   

}
