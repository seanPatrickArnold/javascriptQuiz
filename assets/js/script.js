//Function to retrieve or create a score array
var getScoresArray = function() {
    scoresArray = JSON.parse(localStorage.getItem('scoresArray'));
    if (!scoresArray) {
        scoresArray = [];
    };
    return scoresArray;
}

//Function to create a blank canvas on document body
var blankCanvas = function() {
    var canvas = document.getElementById('canvas');
    if (canvas) {
        canvas.remove();
    };

    var canvas = document.createElement('div');
    canvas.id = 'canvas';
    document.body.appendChild(canvas);
    return canvas;
}

//function to create a timer with reset and subtract-time method
var createTimer = function() {
    var timer = {};
    timer.timeRemaining = 0;
    timer.resetTime = function() {
        this.timeRemaining = 75;
    };
    timer.subtractTime = function(timeToSubstract) {
        this.timeRemaining -= timeToSubstract;
    };
    return timer;
}

//Function to create quiz generator object
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
                                },
                                {
                                "q":"How many questions are required for this quiz to be considered complete?",
                                "a":"1",
                                "b":"2",
                                "c":"3",
                                "d": "4",
                                "ans":"e"
                                }
                            ];
    quizGen.displayElements = ['question', 'a', 'b', 'c', 'd'];
    return quizGen
}

//Function to create and display central container div
var createContainerDiv = function(canvas) {
    var containerDiv = document.createElement('div');
    containerDiv.className = 'container-div';
    canvas.appendChild(containerDiv);
    var innerDiv = document.createElement('div');
    innerDiv.className = 'inner-div';
    containerDiv.appendChild(innerDiv);
    return innerDiv;
}

//Function display question from quiz generator in center div
var displayQuizGen = function(canvas, quizGen, timer) {
    var displayElements = quizGen.displayElements;

    var innerDiv = createContainerDiv(canvas);

    var question = document.createElement('h1');
    question.id = 'question'
    innerDiv.appendChild(question);
    var answers = document.createElement('div');
    answers.id = 'answers';
    innerDiv.appendChild(answers);
    var feedback = document.createElement('p');
    feedback.id = 'feedback';
    innerDiv.append(feedback);

    //Iterate through answers to display as buttons
    for (i=0; i< displayElements.length; i++) {
        if (displayElements[i] === 'question') {
            question.textContent = '';
        }
        else {
            quizGen[displayElements[i]] = document.createElement('button');
            quizGen[displayElements[i]].textContent = '';
            quizGen[displayElements[i]].id = 'answer-button';
            quizGen[displayElements[i]].className = 'btn';
            quizGen[displayElements[i]].setAttribute('correct', 'No answer');
            answers.appendChild(quizGen[displayElements[i]]);
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
                feedback.textContent = userResponseState;
                quizGen.populateQuestion();
            };
            quizGen[displayElements[i]].addEventListener('click', quizGen[displayElements[i]+'CheckAnswer']);
        };
    }
    
    //Create function to populate quiz display from quiz generator
    quizGen.populateQuestion = function () {

        if (quizGen.questionsArray.length > 0) {
            var arr = quizGen.questionsArray
            var q = arr[Math.floor(Math.random()*arr.length)];
            arr.splice(quizGen.questionsArray.indexOf(q), 1);

            for (i=0; i< displayElements.length; i++) {
                if (displayElements[i] === 'question') {
                    question.textContent = q.q;
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
        else {
            timer.timeRemaining = 0;
            scorePage(quizGen, timer);
        }
    }

    quizGen.populateQuestion();
}

//Add timer display to right-side div
var displayTimer = function(canvas, quizGen, timer) {
    var timerDiv = document.createElement('div');
    var timerDisplay = document.createElement('p');
    timerDiv.id = 'timer-div';
    timerDisplay.id = 'timer-display';
    canvas.appendChild(timerDiv);
    timerDiv.appendChild(timerDisplay);
    timerDisplay.textContent = 'Time Left: ' + timer.timeRemaining;

    //Start timer if quiz has started, check if questions and time remain
    if (quizGen.quizStarted) {
        var changeDisplayTime = function() {
            if (timer.timeRemaining > 0) {
                timer.timeRemaining --;
                timerDisplay.textContent = 'Time: ' + timer.timeRemaining;
            }
            else if (quizGen.questionsArray.length === 0) {
                clearInterval(timer.timer);
            }
            else {
                clearInterval(timer.timer);
                scorePage(quizGen, timer);
            }
        };

        timer.timer = setInterval(changeDisplayTime, 1000);
    }
}


//Display introduction and start quiz button
var displayStartPage = function(canvas, timer) {
    var innerDiv = createContainerDiv(canvas);
    innerDiv.setAttribute('justify-content', 'center');

    var title = document.createElement('h1');
    title.textContent = 'Coding Quiz';
    title.className = 'title';
    innerDiv.appendChild(title);
    var paragraph = document.createElement('p');
    paragraph.textContent = 'Answer the following questions before the timer runs out to test your knowledge of Javascript.';
    paragraph.className = 'paragraph';
    innerDiv.appendChild(paragraph);
    var startButton = document.createElement('button');
    startButton.textContent = 'Start Quiz';
    startButton.id = 'start-button';
    startButton.className = 'btn';
    innerDiv.appendChild(startButton);
    startButton.addEventListener('click', startQuiz);
}

//Display link to high scores
var displayViewScoresButton = function(canvas) {
    var highScoresDiv = document.createElement('div');
    highScoresDiv.id = 'high-scores-button-div';

    var viewHighScores = document.createElement('button');
    viewHighScores.id = 'view-high-scores';
    viewHighScores.textContent = 'View high scores'

    canvas.appendChild(highScoresDiv);
    highScoresDiv.appendChild(viewHighScores);

    viewHighScores.addEventListener('click', highScoresPage)
}

//Display some text, result of quiz and initials input with button
var displayScore = function(canvas, quizGen) {
    var innerDiv = createContainerDiv(canvas);

    var allDone = document.createElement('h2');
    allDone.textContent = 'All done.';
    allDone.id = 'all-done';
    innerDiv.appendChild(allDone);


    var score = document.createElement('p');
    score.textContent = 'Your Score:' + quizGen.score;
    score.id = 'result-score';
    innerDiv.appendChild(score);

    var initialsDiv = document.createElement('div');
    initialsDiv.id = 'initials-div';
    innerDiv.appendChild(initialsDiv);
    var initialsText = document.createElement('p');
    initialsText.textContent = 'Enter initials: ';
    initialsText.id = 'initials-text';
    initialsDiv.appendChild(initialsText);
    var initialsInput = document.createElement('input');
    initialsInput.id = 'initials-input';
    initialsDiv.appendChild(initialsInput);
    var initialsButton = document.createElement('button');
    initialsButton.id = 'initials-button';
    initialsButton.className = 'btn';
    initialsButton.textContent = 'Submit';
    initialsDiv.appendChild(initialsButton);

    //Get intitials form input, add to scores array and set in local storage
    var getInitials = function () {
        var initialsInput = document.getElementById('initials-input');
        var initials = initialsInput.value;
        scoresArray.push({'initials': initials, 'score': quizGen.score});
        localStorage.setItem('scoresArray', JSON.stringify(scoresArray));
        highScoresPage();
    }

    initialsButton.addEventListener('click', getInitials);
    
}

//Display sorted high scores with buttons to return to start and clear high scores
var displayHighScores = function(canvas) {
    var scoresArray = getScoresArray();
    var highScoreObject = {};

    var fillerDivLeft = document.createElement('div');
    fillerDivLeft.className = 'filler-div';
    canvas.appendChild(fillerDivLeft);
    
    var innerDiv = createContainerDiv(canvas);

    var title = document.createElement('h1');
    title.textContent = 'High Scores';
    title.className = 'score-title';
    innerDiv.appendChild(title);

    scoresArray.sort(function (a, b) {
        return b.score - a.score;
      });
    localStorage.setItem('scoresArray', JSON.stringify(scoresArray.slice(0,10)));

    //Iterate through top 10 scores and display on central div
    for (i=0; i<10; i++) {
        highScoreObject['div' + i.toString()] = document.createElement('div');
        var paragraphDiv = highScoreObject['div' + i.toString()];
        paragraphDiv.className = 'score-paragraph-div';
        highScoreObject['paragraph' + i.toString()] = document.createElement('p');
        var paragraph = highScoreObject['paragraph' + i.toString()];
        paragraph.className = 'score-paragraph';
        if (scoresArray[i]) {
            var initials = scoresArray[i].initials.toUpperCase();
        }
        else {
            var initials = 'TTT';
        }
        if (scoresArray[i]) {
            var score = scoresArray[i].score;
        }
        else {
            var score = 0;
        }
        paragraph.textContent = (i+1)
                                +'. '
                                + initials
                                + ': '
                                + score;
        innerDiv.appendChild(paragraphDiv);
        paragraphDiv.appendChild(paragraph);
    }

    //Create buttons at bottom of div to route to start and clear scores
    var buttonsDiv = document.createElement('div');
    buttonsDiv.id = 'buttons-div';
    innerDiv.appendChild(buttonsDiv);

    var returnToStart = function() {
        startPage(document.getElementById('canvas'), createTimer)
    }
    var returnButton = document.createElement('button');
    returnButton.className = 'btn routing-btn';
    returnButton.textContent = 'Return to Start';
    buttonsDiv.appendChild(returnButton);
    returnButton.addEventListener('click', returnToStart)

    var clearHighScores = function() {
        localStorage.setItem('scoresArray', JSON.stringify([]));
        highScoresPage()
    }
    var clearButton = document.createElement('button');
    clearButton.className = 'btn routing-btn';
    clearButton.textContent = 'Clear High Scores';
    buttonsDiv.appendChild(clearButton);
    clearButton.addEventListener('click', clearHighScores)

    var fillerDivRight = document.createElement('div');
    fillerDivRight.className = 'filler-div';
    canvas.appendChild(fillerDivRight);
}



//Substantiate start page
var startPage = function(quizGen, timer) {
    var canvas = blankCanvas();
    timer = createTimer();
    timer.timeRemaining = 0;
    displayViewScoresButton(canvas);
    displayStartPage(canvas, timer);
    displayTimer(canvas, quizGen, timer);
}
 
//Substantiate quiz display and set states of objects to progress quiz
var startQuiz = function() {
    var canvas = blankCanvas();
    var timer = createTimer()
    timer.resetTime();
    var quizGen = createQuizGenerator();
    quizGen.quizStarted = true;

    displayViewScoresButton(canvas);
    displayQuizGen(canvas, quizGen, timer);
    displayTimer(canvas, quizGen, timer);
}

//Substantiate score display page
var scorePage = function(quizGen, timer) {
    var canvas = blankCanvas();
    displayViewScoresButton(canvas);
    displayScore(canvas, quizGen);
    displayTimer(canvas, quizGen, timer);
}

//Substantiate high score display page
var highScoresPage = function() {
    var canvas = blankCanvas();
    displayHighScores(canvas);
}

//create function to make required objects and call start page display function
var startApp = function() {
    var timer = createTimer();
    var scoresArray = getScoresArray();
    var quizGen = createQuizGenerator();

    startPage(quizGen, timer);
}

//Start the app
startApp();





