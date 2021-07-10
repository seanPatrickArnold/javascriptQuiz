// Create canvas
var canvas = document.createElement('div');
canvas.id = 'canvas';
document.body.appendChild(canvas);

var startButton = document.createElement('button');
startButton.textContent = 'Start Quiz';
startButton.id = 'start-button';
startButton.className = 'btn';
canvas.appendChild(startButton);


var timer = {};
timer.timeRemaining = 0;
timer.resetTime = function() {
    this.timeRemaining = 5;
};
timer.subtractTime = function(timeToSubstract) {
    this.timeRemaining -= timeToSubstract;
};

var displayViewScoresButton = function(canvas) {
    var highScoresDiv = document.createElement('div');
    highScoresDiv.id = 'high-scores-div';

    var viewHighScores = document.createElement('button');
    viewHighScores.id = 'view-high-scores';
    viewHighScores.textContent = 'View high scores'

    canvas.appendChild(highScoresDiv);
    highScoresDiv.appendChild(viewHighScores);
}

var createQuizGenerator = function () {
    var quizGen = {};
    quizGen.score = 0;
    quizGen.questionsArray = [
                                {
                                "q":"What is the way to declare a variable?",
                                "a": "const",
                                "b": "let",
                                "c": "function",
                                "d": "var",
                                "ans": "d"
                                },
                                {
                                "q":"What is the way to declare a function?",
                                "a": "const",
                                "b": "let",
                                "c": "function",
                                "d": "var",
                                "ans": "c"
                                },
                                {
                                "q":"How would you write a statement to the console?",
                                "a": "print()",
                                "b": "return",
                                "c": "console.log()",
                                "d": "console.print()",
                                "ans": "c"
                                },
                                {
                                "q":"How would you call an element using jquery?",
                                "a": "document.createElement()",
                                "b": "document.getElementById()",
                                "c": "jquery.getElementById",
                                "d": "$()",
                                "ans": "d"
                                }
                            ];
    quizGen.displayElements = ['question', 'a', 'b', 'c', 'd'];
    return quizGen
}

var displayQuizGen = function(canvas, quizGen, timer) {
    var displayElements = quizGen.displayElements;

    quizGen.quizDiv = document.createElement('div');
    quizGen.quizDiv.id = 'quiz-div';
    canvas.appendChild(quizGen.quizDiv);

    quizGen.quiz = document.createElement('div');
    quizGen.quiz.id = 'quiz';
    quizGen.quizDiv.appendChild(quizGen.quiz);
    quizGen.question = document.createElement('h1');
    quizGen.question.id = 'question'
    quizGen.quiz.appendChild(quizGen.question);

    quizGen.answers = document.createElement('div');
    quizGen.answers.id = 'answers';
    quizGen.quiz.appendChild(quizGen.answers);

    quizGen.feedback = document.createElement('p');
    quizGen.feedback.id = 'feedback';
    quizGen.quiz.append(quizGen.feedback);

    for (i=0; i< displayElements.length; i++) {
        if (displayElements[i] === 'question') {
            quizGen.question.textContent = '';
        }
        else {
            quizGen[displayElements[i]] = document.createElement('button');
            quizGen[displayElements[i]].textContent = '';
            quizGen[displayElements[i]].id = 'answer-button';
            quizGen[displayElements[i]].className = 'btn';
            quizGen[displayElements[i]].setAttribute('correct', 'No answer');
            quizGen.answers.appendChild(quizGen[displayElements[i]]);
            quizGen[displayElements[i]+'CheckAnswer'] = function () {
                var userResponseState = 'No Answer'
                if (this.getAttribute('correct') === 'true') {
                    userResponseState = 'Correct';
                    quizGen.score ++;
                }
                else if (this.getAttribute('correct') === 'false'){
                    userResponseState = 'Incorrect';
                    timer.subtractTime(5);
                }
                else {
                    console.log(this.getAttribute('correct')+'Neither correct nor incorrect.');
                }
                this.setAttribute('correct', 'No answer');
                quizGen.feedback.textContent = userResponseState;
                quizGen.populateQuestion();
            };
            quizGen[displayElements[i]].addEventListener('click', quizGen[displayElements[i]+'CheckAnswer']);
        };
    }
    
    quizGen.populateQuestion = function () {

        var arr = quizGen.questionsArray
        var q = arr[Math.floor(Math.random()*arr.length)];

        for (i=0; i< displayElements.length; i++) {
            if (displayElements[i] === 'question') {
                quizGen.question.textContent = q.q;
            }
            else {
                option = displayElements[i];
                quizGen[displayElements[i]].textContent = option + '. ' + q[option];
                if (option === q.ans) {
                    quizGen[displayElements[i]].setAttribute('correct', 'true');
                }
                else {
                    quizGen[displayElements[i]].setAttribute('correct', 'false');
                }
            }
        }
    }

    quizGen.populateQuestion();
}

var displayTimer = function(canvas, quizGen, timer) {
    var timerDiv = document.createElement('div');
    var timerDisplay = document.createElement('p');
    timerDiv.id = 'timer-div';
    timerDisplay.id = 'timer-display';
    canvas.appendChild(timerDiv);
    timerDiv.appendChild(timerDisplay);
    timerDisplay.textContent = 'Time: ' + timer.timeRemaining;

    var changeDisplayTime = function() {
        timer.timeRemaining --;
        timerDisplay.textContent = 'Time: ' + timer.timeRemaining;
        if (timer.timeRemaining === 0) {
            clearInterval(timer.timer)
            console.log(quizGen.score);
            displayScore(canvas, quizGen);
        }
    };

    timer.timer = setInterval(changeDisplayTime, 1000);
}


var startQuiz = function() {

    //Create quiz page
    var canvas = document.getElementById('canvas')
    canvas.remove();

    var canvas = document.createElement('div');
    canvas.id = 'canvas';
    document.body.appendChild(canvas);


    timer.resetTime();
    var quizGen = createQuizGenerator();

    displayViewScoresButton(canvas);
    displayQuizGen(canvas, quizGen, timer);
    displayTimer(canvas, quizGen, timer);
}

startButton.addEventListener('click', startQuiz);

var displayScore = function(canvas, quizGen) {
    quizGen.quiz.remove();

    var scoreContainerDiv = document.createElement('div');
    scoreContainerDiv.id = 'score-container-div';
    quizGen.quizDiv.appendChild(scoreContainerDiv);
    var scoreDiv = document.createElement('div');
    scoreDiv.id = 'score-div';
    scoreContainerDiv.appendChild(scoreDiv);

    var score = document.createElement('p');
    score.textContent = 'Your Score:' + quizGen.score;
    score.id = 'result-score';
    scoreDiv.appendChild(score);
}

