let score = 0;
let currentCorrect = "";
let timer;
let timeLeft = 20;
let selectedCategory = "";

function startQuiz() {
    selectedCategory = document.getElementById("category").value;
    document.getElementById("quiz-container").style.display = "block";
    document.getElementById("score-container").style.display = "none";
    score = 0;
    document.getElementById("score").textContent = score;
    loadQuestion();
}

async function loadQuestion() {
    clearInterval(timer);
    timeLeft = 20;
    document.getElementById("time").textContent = timeLeft;

    // Mulai timer
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("time").textContent = timeLeft;
        if(timeLeft <= 0){
            clearInterval(timer);
            alert("Waktu habis! Jawaban benar: " + currentCorrect);
            loadQuestion();
        }
    }, 1000);

    const url = selectedCategory ? 
        `https://opentdb.com/api.php?amount=1&category=${selectedCategory}&type=multiple` : 
        'https://opentdb.com/api.php?amount=1&type=multiple';

    const res = await fetch(url);
    const data = await res.json();
    const q = data.results[0];

    const question = decodeHTML(q.question);
    const correct = decodeHTML(q.correct_answer);
    const incorrect = q.incorrect_answers.map(ans => decodeHTML(ans));

    currentCorrect = correct;

    const answers = [...incorrect, correct];
    answers.sort(() => Math.random() - 0.5);

    document.getElementById("question").textContent = question;
    const answersDiv = document.getElementById("answers");
    answersDiv.innerHTML = "";

    answers.forEach(ans => {
        const btn = document.createElement("button");
        btn.textContent = ans;
        btn.onclick = () => checkAnswer(ans);
        answersDiv.appendChild(btn);
    });
}

function checkAnswer(ans) {
    clearInterval(timer);
    if(ans === currentCorrect){
        score++;
        alert("Benar!");
    } else {
        alert("Salah! Jawaban benar: " + currentCorrect);
    }
    document.getElementById("score").textContent = score;
    loadQuestion();
}

function resetQuiz() {
    clearInterval(timer);
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("score-container").style.display = "block";
}

// Fungsi decode karakter HTML
function decodeHTML(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}
