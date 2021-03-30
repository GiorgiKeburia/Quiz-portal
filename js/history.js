const question = document.getElementById("question");
const answers = Array.from(document.getElementsByClassName("answer"));
const questionMark = document.getElementById("questionMark");
const totalScore = document.getElementById("totalScore");


let score = 0;
let questionCount = 0;
let currentQuestion = {};
let chooseAnswer = true;
let allQuestions = [];

let questions = [];

// Consts
const CORRECT_MARK = 1;
const MAX_QUESTION = 10;



fetch(
    `https://opentdb.com/api.php?amount=10&category=23&difficulty=easy&type=multiple`
)
    .then((res) => {
        return res.json();
    })
    .then((loadedQuestions) => {
        questions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });

            return formattedQuestion;
        });
        gameStart();

    })
    .catch((err) => {
        console.error(err);
    });


gameStart = () => {
    questionCount = 0;
    score = 0;
    allQuestions = [...questions];
    downNewQuestion();
}

downNewQuestion = () => {
    if (allQuestions === 0 || questionCount >= MAX_QUESTION) {
        localStorage.setItem('mostRecentScore', score);
        // go to the end page
        return window.location.assign('/end.html');
    }
    questionCount++;
    questionMark.textContent = `${questionCount}/${MAX_QUESTION}`;
    const questionIndex = Math.floor(Math.random() * allQuestions.length);
    currentQuestion = allQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    answers.forEach(element => {
        const number = element.dataset['number'];
        element.innerText = currentQuestion['choice' + number];
    });

    allQuestions.splice(questionIndex, 1);
    chooseAnswer = true;
};

answers.forEach((element) => {
    element.addEventListener('click', (e) => {
        if (!chooseAnswer) return;

        chooseAnswer = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        const classAply = currentQuestion.answer == selectedAnswer ? 'correct' : 'incorrect';
        if (classAply === 'correct') {
            totalfun(CORRECT_MARK);
        };
        selectedChoice.parentElement.classList.add(classAply);
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classAply);
            downNewQuestion();
        }, 1000);

    });

});

totalfun = num => {
    score += num;
    totalScore.textContent = score;
}