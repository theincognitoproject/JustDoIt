document.addEventListener("DOMContentLoaded", function () {
  const goalInput = document.getElementById("GoalInput");
  const addGoalButton = document.getElementById("addGoal");
  const goalList = document.getElementById("GoalList");

  // Retrieve goals from local storage
  let goals = JSON.parse(localStorage.getItem("goals")) || [];

  // Function to save goals to local storage
  function saveGoals() {
    localStorage.setItem("goals", JSON.stringify(goals));
  }

  // Function to add a goal to the list
  function addGoalToUI(goalText) {
    const goalItem = document.createElement("li");
    goalItem.textContent = goalText;

    // Create a delete button for the goal
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function () {
      // Remove the goal from the array and update local storage
      const index = goals.indexOf(goalText);
      if (index !== -1) {
        goals.splice(index, 1);
        saveGoals();
      }
      // Remove the goal item from the UI
      goalItem.remove();
    });

    // Append the delete button to the goal item
    goalItem.appendChild(deleteButton);

    // Append the goal item to the goal list
    goalList.appendChild(goalItem);
  }

  // Populate the UI with existing goals from local storage
  goals.forEach(function (goal) {
    addGoalToUI(goal);
  });

  addGoalButton.addEventListener("click", function () {
    const goalText = goalInput.value.trim();

    if (goalText !== "") {
      if (!goals.includes(goalText)) {
        // Add the goal to the array and update local storage
        goals.push(goalText);
        saveGoals();

        // Add the goal to the UI
        addGoalToUI(goalText);

        // Clear the input field
        goalInput.value = "";
      } else {
        alert("Goal already exists!");
      }
    } else {
      alert("Please enter a valid goal!");
    }
  });
});


document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("taskInput");
    const taskTimerInput = document.getElementById("taskTimer");
    const addTaskButton = document.getElementById("addTask");
    const taskList = document.getElementById("taskList");

    let savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Render saved tasks
    savedTasks.forEach(task => renderTask(task));

    addTaskButton.addEventListener("click", function () {
        const taskText = taskInput.value.trim();
        const timerDuration = parseInt(taskTimerInput.value);

        if (taskText !== "") {
            const task = { text: taskText, timer: timerDuration * 60, completed: false };

            renderTask(task);
            savedTasks.push(task);
            localStorage.setItem("tasks", JSON.stringify(savedTasks));

            taskInput.value = "";
            taskTimerInput.value = "";
        } else {
            alert("Please enter a valid task.");
        }
    });

    function renderTask(task) {
        const listItem = document.createElement("li");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        const taskText = document.createElement("span");
        taskText.textContent = task.text;
        if (task.completed) {
            taskText.style.textDecoration = "line-through"; // Apply strikeout style
        }

        const countdownTimerSpan = document.createElement("span");

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        checkbox.addEventListener("change", function () {
            task.completed = checkbox.checked;
            taskText.style.textDecoration = task.completed ? "line-through" : "none";

            if (checkbox.checked) {
                clearInterval(task.timerInterval); // Stop the timer interval
                countdownTimerSpan.textContent = ""; // Clear the text
            } else if (task.timer > 0) {
                startTimer(task, countdownTimerSpan);
            }

            localStorage.setItem("tasks", JSON.stringify(savedTasks));
        });

        deleteButton.addEventListener("click", function () {
            const index = savedTasks.indexOf(task);
            if (index !== -1) {
                savedTasks.splice(index, 1);
                localStorage.setItem("tasks", JSON.stringify(savedTasks));
                listItem.remove();
            }
        });

        listItem.appendChild(checkbox);
        listItem.appendChild(taskText);

        if (!task.completed && task.timer > 0) {
            listItem.appendChild(countdownTimerSpan);
            startTimer(task, countdownTimerSpan);
        }

        listItem.appendChild(deleteButton);
        taskList.appendChild(listItem);
    }

    function startTimer(task, countdownTimerSpan) {
        task.timerInterval = setInterval(function () {
            if (task.timer > 0) {
                countdownTimerSpan.textContent = `${Math.floor(task.timer / 60)} min ${task.timer % 60} sec`;
                task.timer--;
            } else {
                clearInterval(task.timerInterval);
                countdownTimerSpan.textContent = "Time's up!";
            }
        }, 1000);
    }


    // ... your existing JavaScript code ...

function updateClockDisplay() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;
    document.getElementById("clock").textContent = timeString;
}

// Update the clock every second
setInterval(updateClockDisplay, 1000);
// Function to update the analog clock with Indian Standard Time (IST)
function updateAnalogClockIST() {
    const now = new Date();
    
    // Set the time to IST (UTC+5:30)
    const ISTHours = now.getUTCHours() + 5;
    const ISTMinutes = now.getUTCMinutes() + 30;
    const ISTSeconds = now.getUTCSeconds();

    const secondDeg = (ISTSeconds / 60) * 360;
    const minuteDeg = ((ISTMinutes + ISTSeconds / 60) / 60) * 360;
    const hourDeg = ((ISTHours % 12 + ISTMinutes / 60) / 12) * 360;

    const secondHand = document.querySelector(".second-hand");
    const minuteHand = document.querySelector(".minute-hand");
    const hourHand = document.querySelector(".hour-hand");

    secondHand.style.transform = `translate(-50%, -100%) rotate(${secondDeg}deg)`;
    minuteHand.style.transform = `translate(-50%, -100%) rotate(${minuteDeg}deg)`;
    hourHand.style.transform = `translate(-50%, -100%) rotate(${hourDeg}deg)`;
}

// Update the analog clock with IST every second
setInterval(updateAnalogClockIST, 1000);

// Initialize the analog clock display
updateAnalogClockIST();
// ... your existing JavaScript code ...
const pomodoroTimer = document.getElementById("pomodoro-timer");
const pomodoroMinutes = document.getElementById("pomodoro-minutes");
const pomodoroSeconds = document.getElementById("pomodoro-seconds");
const startPomodoroButton = document.getElementById("start-pomodoro");
const stopPomodoroButton = document.getElementById("stop-pomodoro");
const resetPomodoroButton = document.getElementById("reset-pomodoro");
const customMinutesInput = document.getElementById("custom-minutes");
const applyCustomTimeButton = document.getElementById("apply-custom-time");
const alarmSound = document.getElementById("alarm");

let pomodoroInterval;
let pomodoroTime = 25 * 60; // Initial time in seconds

function updatePomodoroDisplay() {
    const minutes = Math.floor(pomodoroTime / 60);
    const seconds = pomodoroTime % 60;

    pomodoroMinutes.textContent = minutes < 10 ? `0${minutes}` : minutes;
    pomodoroSeconds.textContent = seconds < 10 ? `0${seconds}` : seconds;
}

function startPomodoro() {
    if (!pomodoroInterval) {
        pomodoroInterval = setInterval(() => {
            if (pomodoroTime > 0) {
                pomodoroTime--;
                updatePomodoroDisplay();
            } else {
                clearInterval(pomodoroInterval);
                pomodoroInterval = null;
		alarmSound.play();
                alert("Time's up! Have you complete the task?");
                // Play the alarm sound
                
            }
        }, 1000);
    }
}

function stopPomodoro() {
    if (pomodoroInterval) {
        clearInterval(pomodoroInterval);
        pomodoroInterval = null;
    }
}

function resetPomodoro() {
    stopPomodoro();
    pomodoroTime = customMinutesInput.value * 60; // Use custom time limit
    updatePomodoroDisplay();
}

function applyCustomTime() {
    const customMinutes = parseInt(customMinutesInput.value, 10);
    if (customMinutes >= 1) {
        pomodoroTime = customMinutes * 60;
        updatePomodoroDisplay();
    } else {
        alert("Please enter a valid time limit (at least 1 minute).");
    }
}

startPomodoroButton.addEventListener("click", startPomodoro);
stopPomodoroButton.addEventListener("click", stopPomodoro);
resetPomodoroButton.addEventListener("click", resetPomodoro);
applyCustomTimeButton.addEventListener("click", applyCustomTime);

// Initialize the Pomodoro display
updatePomodoroDisplay();

 




    let nav = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

const calendar = document.getElementById('calendar');
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function openModal(date) {
  clicked = date;

  const eventForDay = events.find(e => e.date === clicked);

  if (eventForDay) {
    document.getElementById('eventText').innerText = eventForDay.title;
    deleteEventModal.style.display = 'block';
  } else {
    newEventModal.style.display = 'block';
  }

  backDrop.style.display = 'block';
}

function load() {
  const dt = new Date();

  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

  document.getElementById('monthDisplay').innerText = 
    `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`;

  calendar.innerHTML = '';

  for(let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement('div');
    daySquare.classList.add('day');

    const dayString = `${month + 1}/${i - paddingDays}/${year}`;

    if (i > paddingDays) {
      daySquare.innerText = i - paddingDays;
      const eventForDay = events.find(e => e.date === dayString);

      if (i - paddingDays === day && nav === 0) {
        daySquare.id = 'currentDay';
      }

      if (eventForDay) {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerText = eventForDay.title;
        daySquare.appendChild(eventDiv);
      }

      daySquare.addEventListener('click', () => openModal(dayString));
    } else {
      daySquare.classList.add('padding');
    }

    calendar.appendChild(daySquare);    
  }
}

function closeModal() {
  eventTitleInput.classList.remove('error');
  newEventModal.style.display = 'none';
  deleteEventModal.style.display = 'none';
  backDrop.style.display = 'none';
  eventTitleInput.value = '';
  clicked = null;
  load();
}

function saveEvent() {
  if (eventTitleInput.value) {
    eventTitleInput.classList.remove('error');

    events.push({
      date: clicked,
      title: eventTitleInput.value,
    });

    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
  } else {
    eventTitleInput.classList.add('error');
  }
}

function deleteEvent() {
  events = events.filter(e => e.date !== clicked);
  localStorage.setItem('events', JSON.stringify(events));
  closeModal();
}

function initButtons() {
  document.getElementById('nextButton').addEventListener('click', () => {
    nav++;
    load();
  });

  document.getElementById('backButton').addEventListener('click', () => {
    nav--;
    load();
  });

  document.getElementById('saveButton').addEventListener('click', saveEvent);
  document.getElementById('cancelButton').addEventListener('click', closeModal);
  document.getElementById('deleteButton').addEventListener('click', deleteEvent);
  document.getElementById('closeButton').addEventListener('click', closeModal);
}

initButtons();
load();
});
let workTittle = document.getElementById('work');
let breakTittle = document.getElementById('break');

let workTime = 50;
let breakTime = 10;

let seconds = "00"

// display
window.onload = () => {
    document.getElementById('minutes').innerHTML = workTime;
    document.getElementById('seconds').innerHTML = seconds;

    workTittle.classList.add('active');
}

// start timer
function start() {
    // change button
    document.getElementById('start').style.display = "none";
    document.getElementById('reset').style.display = "block";

    // change the time
    seconds = 59;

    let workMinutes = workTime - 1;
    let breakMinutes = breakTime - 1;

    breakCount = 0;

let audioAlert = document.getElementById('audioAlert');
    // countdown
    let timerFunction = () => {
        //change the display
        document.getElementById('minutes').innerHTML = workMinutes;
        document.getElementById('seconds').innerHTML = seconds;

        // start
        seconds = seconds - 1;

        if(seconds === 0) {
            workMinutes = workMinutes - 1;
            if(workMinutes === -1 ){
                if(breakCount % 2 === 0) {
                    // start break
                    workMinutes = breakMinutes;
                    breakCount++

                    // change the painel
                    workTittle.classList.remove('active');
                    breakTittle.classList.add('active');
		    audioAlert.play();
                }else {
                    // continue work
                    workMinutes = workTime;
                    breakCount++

                    // change the painel
                    breakTittle.classList.remove('active');
                    workTittle.classList.add('active');
		    audioAlert.play();
                }
            }
            seconds = 59;
        }
    }

    // start countdown
    setInterval(timerFunction, 1000); // 1000 = 1s
}
//Extended Feature scripts
document.addEventListener('DOMContentLoaded', function() {
  var modal = document.getElementById('disclaimerModal');
  var gotItButton = document.getElementById('gotItButton');

  // Function to close the modal
  function closeModal() {
    modal.style.display = 'none';
  }

  // Event listener for the 'Got it' button click
  gotItButton.addEventListener('click', closeModal);

  // Show the modal on page load
  modal.style.display = 'block';
});

document.addEventListener('DOMContentLoaded', function() {
  function updateUptime() {
    var currentTime = new Date().getTime();
    var pageLoadTime = window.performance.timing.navigationStart;
    var uptimeSeconds = Math.floor((currentTime - pageLoadTime) / 1000);

    var hours = Math.floor(uptimeSeconds / 3600);
    var minutes = Math.floor((uptimeSeconds % 3600) / 60);
    var seconds = uptimeSeconds % 60;

    var uptimeElement = document.getElementById('uptime');
    uptimeElement.textContent = hours + ' hours ' + minutes + ' min ' + seconds + ' sec';
  }

  updateUptime(); // Initial call to display uptime

  // Update the uptime every second
  setInterval(updateUptime, 1000);
});

document.addEventListener('DOMContentLoaded', function() {
  var modal = document.getElementById('disclaimerModal');
  var gotItButton = document.getElementById('gotItButton');

  // Function to close the modal
  function closeModal() {
    modal.style.display = 'none';
  }

  // Event listener for the 'Got it' button click
  gotItButton.addEventListener('click', closeModal);

  // Show the modal on page load
  modal.style.display = 'block';
});

//Themes
document.addEventListener('DOMContentLoaded', function() {
  var toggleStyleButton = document.getElementById('toggleStyleButton');
  var styleIcon = document.getElementById('styleIcon');
  var mainStylesheet = document.getElementById('mainStylesheet');
  var body = document.body;
  var currentTheme = localStorage.getItem('theme') || 'light'; // Retrieve the last saved theme or default to 'light'

  // Apply the last saved theme on page load
  if (currentTheme === 'dark') {
    mainStylesheet.href = 'ogstyle.css';
    styleIcon.classList.remove('fa-sun');
    styleIcon.classList.add('fa-moon');
  }

  toggleStyleButton.addEventListener('click', function() {
    body.style.opacity = '0';

    if (currentTheme === 'light') {
      setTimeout(function() {
        mainStylesheet.href = 'ogstyle.css';
        styleIcon.classList.remove('fa-sun');
        styleIcon.classList.add('fa-moon');
        body.style.opacity = '1';
        currentTheme = 'dark';
        localStorage.setItem('theme', 'dark'); // Save the theme in local storage
      }, 500);
    } else {
      setTimeout(function() {
        mainStylesheet.href = 'style.css';
        styleIcon.classList.remove('fa-moon');
        styleIcon.classList.add('fa-sun');
        body.style.opacity = '1';
        currentTheme = 'light';
        localStorage.setItem('theme', 'light'); // Save the theme in local storage
      }, 500);
    }
  });
});
