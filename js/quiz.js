var UIController = (function() {
    var DOMstrings = {
        answerA: '.answer-a',
        answerB: '.answer-b',
        answerC: '.answer-c',
        answerD: '.answer-d',
        allAnswers: ['.answer-a', '.answer-b', '.answer-c', '.answer-d'],
        ansWrapper: '.answers-wrapper',
        correctBanner: '.correct-banner',
        mainWrapper: '.main-wrapper',
        playerScore: 'player-score',
        qDisplay: '.question-display',
        qRight: 'questions-right',
        qWrong: 'questions-wrong',
        qRemaining: '.questions-remaining',
        totalQuestions: '.total-questions',
        wrongBanner: '.banner-wrong',        
    };
    
    function clearBanners() {
       document.querySelector(DOMstrings.wrongBanner).className = "banner wrong";
       document.querySelector(DOMstrings.correctBanner).className = "banner correct";  
    }

    function getDOMstrings() {
        return DOMstrings;
    }
    
    function displayWrongAnswer() {
        document.querySelector(DOMstrings.wrongBanner).className = "banner wrong visible";
    }
    
    function displayRightAnswer() {
        // document.querySelector(DOMstrings.correctBanner).className = "correct-banner visible";
        
    }

    function displayNewQuestion(num) {
        // UIController.clearBanners();
        document.querySelector(DOMstrings.qDisplay).textContent = questionController.getQuestion(num).question;
        DOMstrings.allAnswers.forEach(ans => {
            var ansNum = ans.split('-');
            ansNum = ansNum[1];
            document.querySelector(ans).textContent = questionController.getQuestion(num)[ansNum];
        });
    }

    function displayGameEnd() {
        UIController.clearBanners();
        document.querySelector(DOMstrings.qDisplay).textContent = "You have completed all the questions!";
        document.querySelector(DOMstrings.ansWrapper).className = "answers-wrapper invis";
        // document.querySelector(DOMstrings.answerB).className = "answer inactive";
        // document.querySelector(DOMstrings.answerC).className = "answer inactive";
        // document.querySelector(DOMstrings.answerD).className = "answer inactive";
    }   


   function updateScore(score, correctResponses, wrongResponses) {
        document.getElementById(DOMstrings.playerScore).textContent = score;
        document.getElementById(DOMstrings.qRight).textContent = correctResponses;
        document.getElementById(DOMstrings.qWrong).textContent = wrongResponses;
   }
    
   return {
       clearBanners: clearBanners,
       getDOMstrings: getDOMstrings,
       displayWrongAnswer: displayWrongAnswer,    
       displayRightAnswer: displayRightAnswer,
       displayNewQuestion: displayNewQuestion,
       displayGameEnd: displayGameEnd,
       updateScore: updateScore
    };
    
})();

var questionController = (function() {
    
    function Question(question, a, b, c, d, correct, id) {
        this.question = question;
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.correct = correct;
        this.id = id;
    }
    
    var questionOne = new Question(
        "What is the name of the current President of the United States?",
        "Donald Trump",
        "Barack Obama",
        "George Bush",
        "Tweedle Dee",
        "a",
        0,
    );
        
    var questionTwo = new Question(
        "What is the name of my brother's dog?",        
        "Sam",
        "Ollie",
        "Josephine",
        "Elephante",
        "b",
        1,
    );

    var questionThree = new Question(
        "What is JavaScript?",
        "Cool",
        "Hard",
        "Fun",
        "All of these!",
        "d",
        2,
    );
    
    var questionList = [questionOne, questionTwo, questionThree];
        
    function getQuestion(x) {
        return questionList[x];
    }
    
    function getListLength() {
        return questionList.length;
    }
    
    function removeQuestionFromList(num) {
        questionList.splice(num, 1);
        console.log(questionList);
    }
    
    return {
              
        getQuestion: getQuestion,
        getListLength: getListLength,
        removeQuestionFromList: removeQuestionFromList,
        
    };
})();

var globalController = (function (UICtrl) {
    
    var gameState = {
        active: true,
        correctAnswer: '',
        correctResponses: 0,
        currentQ: 0,
        score: 0,
        wrongResponses: 0,
    };  
    
    function setupEventListeners() {
        var DOM = UICtrl.getDOMstrings();
        DOM.allAnswers.forEach(x=>{
            document.querySelector(x).addEventListener('click', event => {
            var targetClass = event.target.className;
            targetClass = targetClass.split('-');
            questionAnswered(targetClass[1]);
            })
        });
        
    }
    
    function createNewQuestion() {
        if(questionController.getListLength() === '0'){
            return;
        }
        var newQ = Math.floor(Math.random() * Math.floor(questionController.getListLength()));
        UIController.displayNewQuestion(newQ);
        
        gameState.correctAnswer = questionController.getQuestion(newQ).correct;
        gameState.currentQ = newQ;
        gameState.active = true;
    }
    
    function questionAnswered(input) {
        while(gameState.active) {
            if (input === gameState.correctAnswer){
                gameState.correctResponses = gameState.correctResponses + 1;
                UIController.displayRightAnswer();
                gameState.score = gameState.score + 50;
                UIController.updateScore(gameState.score, gameState.correctResponses, gameState.wrongResponses);
                questionController.removeQuestionFromList(gameState.currentQ);
                gameState.active = false;                
            } else {
                gameState.wrongResponses = gameState.wrongResponses + 1;
                UIController.displayWrongAnswer();
                gameState.score = gameState.score - 20;
                UIController.updateScore(gameState.score, gameState.correctResponses, gameState.wrongResponses);
                gameState.active = false;
            }
        }
    }
    
    function init() {
        UIController.updateScore(gameState.score, gameState.correctResponses, gameState.wrongResponses);
        setupEventListeners();
        createNewQuestion();
    }

    function gameEnd() {
        UIController.displayGameEnd();
    }
    
    return {
        init: init,
        gameEnd: gameEnd,
        
    };
})(UIController);

globalController.init();