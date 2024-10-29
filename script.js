let questions = [];
let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 30; // 30-second timer
let answered = false;
const winningAmount = 100; // Optional prize amount

// Fetch exactly 10 questions from the API
async function fetchQuestions() {
  try {
    const response = await fetch('http://localhost:3001/api/questions/batch/play');
    if (!response.ok) throw new Error("Failed to fetch questions");
    return await response.json();
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
}

// Initialize quiz by fetching questions and loading the first question
async function initializeQuiz() {
  questions = await fetchQuestions();
  if (questions.length > 0) {
    loadQuestion();
  } else {
    console.error("No questions available.");
  }
}

// Load and display the current question
function loadQuestion() {
  if (currentQuestion >= questions.length) {
    showFinalScore(); // End quiz after 10 questions
    return;
  }

  resetTimer();
  answered = false;

  const current = questions[currentQuestion];
  document.getElementById('question').textContent = `Question ${currentQuestion + 1}: ${current.question}`;
  
  current.options.forEach((option, index) => {
    document.getElementById(`option${index + 1}`).textContent = option;
  });

  document.querySelectorAll('.option-btn').forEach((btn, index) => {
    btn.onclick = () => selectAnswer(index);
  });

  updateScore();
  startTimer();
}

// Handle answer selection and score update
async function selectAnswer(selected) {
  stopTimer();
  answered = true;

  if (selected === questions[currentQuestion].correct) {
    score++;
    localStorage.setItem('currentScore', score);
  } else {
    score = 0;
    localStorage.setItem('currentScore', score);
    window.location.href = 'wrong.html'; // Redirect on wrong answer
    return;
  }

  currentQuestion++;
  
  if (currentQuestion === 5) {
    showIntermediateScore(); // Show score at midpoint milestone
  } else {
    loadQuestion();
  }
}

// Display final score after 10 questions
function showFinalScore() {
  // document.getElementById('quiz-container').innerHTML = `<h1>Final Score: ${score}</h1>`;
  window.location.href = 'congrats.html';
}

// Update displayed score
function updateScore() {
  document.getElementById('score').textContent = `Score: ${score}`;
}

// Start countdown timer for each question
function startTimer() {
  timeLeft = 30;
  document.getElementById('timer').textContent = `${timeLeft}s`;

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').textContent = `${timeLeft}s`;

    document.getElementById('timer').style.color = timeLeft <= 10 ? 'red' : 'white';

    if (timeLeft <= 0) {
      stopTimer();
      if (!answered) {
        endQuiz("Time's up!");
      }
    }
  }, 1000);
}

// Stop the timer
function stopTimer() {
  clearInterval(timer);
}

// Reset timer display
function resetTimer() {
  stopTimer();
  timeLeft = 30;
  document.getElementById('timer').textContent = "";
}

// Redirect to end screen on timeout
function endQuiz(message) {
  stopTimer();
  window.location.href = 'wrong.html';
}

// Show intermediate milestone score with popup
function showIntermediateScore() {
  openPopup();
}

// Popup controls
const popup = document.getElementById('popup');
const continueBtn = document.getElementById('continue-btn');
const quitBtn = document.getElementById('quit-btn');

function openPopup() {
  popup.style.display = 'flex';
}

continueBtn.addEventListener('click', function() {
  popup.style.display = 'none';
  loadQuestion();
});

quitBtn.addEventListener('click', function() {
  localStorage.setItem('currentScore', score);
  window.location.href = 'milestone.html';
});

// Initialize quiz on page load
initializeQuiz();

// Prevent back navigation
function preventBack() {
  window.history.forward();
}
setTimeout(preventBack, 0);
window.onunload = function() { null };
