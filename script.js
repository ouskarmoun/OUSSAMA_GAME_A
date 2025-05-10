let allCountries = [];
let quizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let playerName = "";

// Chargement des données pays
fetch("countries.json")
  .then(res => res.json())
  .then(data => {
    allCountries = data;
  });

// Lancer le quiz
document.getElementById("start-btn").addEventListener("click", () => {
  const nameInput = document.getElementById("player-name").value.trim();
  if (!nameInput) {
    alert("Veuillez entrer votre prénom !");
    return;
  }
  playerName = nameInput;
  startQuiz();
});

document.getElementById("next-btn").addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < quizQuestions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
});

document.getElementById("restart-btn").addEventListener("click", () => {
  resetQuiz();
  startQuiz();
});

function startQuiz() {
  document.getElementById("welcome-screen").style.display = "none";
  document.getElementById("quiz-screen").style.display = "block";
  generateQuestions();
  showQuestion();
}

function resetQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  quizQuestions = [];
  document.getElementById("result-screen").style.display = "none";
  document.getElementById("quiz-screen").style.display = "block";
}

function generateQuestions() {
  const shuffled = allCountries.sort(() => 0.5 - Math.random());
  quizQuestions = [];

  // A: Pays → Drapeau
  for (let i = 0; i < 5; i++) {
    const correct = shuffled[i];
    const options = getRandomOptions(correct.flag, 'flag');
    quizQuestions.push({
      type: 'A',
      question: `Quel est le drapeau de ${correct.name} ?`,
      correctAnswer: correct.flag,
      options: options,
      displayAs: 'flag'
    });
  }

  // B: Drapeau → Pays
  for (let i = 5; i < 10; i++) {
    const correct = shuffled[i];
    const options = getRandomOptions(correct.name, 'name');
    quizQuestions.push({
      type: 'B',
      question: `À quel pays appartient ce drapeau ?`,
      correctAnswer: correct.name,
      image: correct.flag,
      options: options,
      displayAs: 'text'
    });
  }

  // C: Pays → Capitale
  for (let i = 10; i < 15; i++) {
    const correct = shuffled[i];
    const options = getRandomOptions(correct.capital, 'capital');
    quizQuestions.push({
      type: 'C',
      question: `Quelle est la capitale de ${correct.name} ?`,
      correctAnswer: correct.capital,
      options: options,
      displayAs: 'text'
    });
  }

  // D: Pays → Langue
  for (let i = 15; i < 20; i++) {
    const correct = shuffled[i];
    const lang = correct.languages[0];
    const options = getRandomOptions(lang, 'language');
    quizQuestions.push({
      type: 'D',
      question: `Quelle langue est parlée en ${correct.name} ?`,
      correctAnswer: lang,
      options: options,
      displayAs: 'text'
    });
  }
}

function getRandomOptions(correct, type) {
  const options = [correct];
  while (options.length < 3) {
    const random = allCountries[Math.floor(Math.random() * allCountries.length)];
    let value = "";

    if (type === "flag") value = random.flag;
    if (type === "name") value = random.name;
    if (type === "capital") value = random.capital;
    if (type === "language") value = random.languages[0];

    if (value && !options.includes(value)) {
      options.push(value);
    }
  }
  return shuffleArray(options);
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function showQuestion() {
  const question = quizQuestions[currentQuestionIndex];
  document.getElementById("question-counter").textContent = `Question ${currentQuestionIndex + 1}/20`;
  document.getElementById("question-text").textContent = question.question;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  if (question.image) {
    const img = document.createElement("img");
    img.src = question.image;
    img.style.height = "80px";
    optionsDiv.appendChild(img);
  }

  question.options.forEach(option => {
    const btn = document.createElement("button");

    if (question.displayAs === "flag") {
      const img = document.createElement("img");
      img.src = option;
      img.style.height = "50px";
      btn.appendChild(img);
    } else {
      btn.textContent = option;
    }

    btn.addEventListener("click", () => checkAnswer(option, question.correctAnswer));
    optionsDiv.appendChild(btn);
  });
}

function checkAnswer(selected, correct) {
  const buttons = document.querySelectorAll("#options button");
  buttons.forEach(btn => {
    btn.disabled = true;
    if ((btn.textContent === correct) || (btn.querySelector("img")?.src === correct)) {
      btn.style.backgroundColor = "#2ecc71";
    } else if ((btn.textContent === selected) || (btn.querySelector("img")?.src === selected)) {
      btn.style.backgroundColor = "#e74c3c";
    }
  });

  if (selected === correct) {
    score++;
  }
  document.getElementById("next-btn").style.display = "block";
}

function endQuiz() {
  document.getElementById("quiz-screen").style.display = "none";
  document.getElementById("result-screen").style.display = "block";
  document.getElementById("player-result-name").textContent = playerName;
  document.getElementById("score").textContent = score;
}
