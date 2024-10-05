const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const feedbackScreen = document.getElementById('feedback');
const startButton = document.getElementById('start-button');
const playAgainButton = document.getElementById('play-again-button');
const gameBoard = document.querySelector('.game-board');

const shapes = ['ympyra', 'kolmio', 'nelio', 'suorakulmio', 'sydan'];
const shapeNames = {
    'ympyra': 'YMPYRÄ',
    'kolmio': 'KOLMIO',
    'nelio': 'NELIÖ',
    'suorakulmio': 'SUORAKULMIO',
    'sydan': 'SYDÄN'
};
let currentShape;
let score = 0;
let totalQuestions = 0;
let counters = {};
let previousShape;

shapes.forEach(shape => {
    counters[shape] = 0;
});

function playSound(sound) {
    return new Promise(resolve => {
        const audio = new Audio(sound);
        audio.onended = resolve;
        audio.play();
    });
}

function showRandomShape() {
    let newShape;
    do {
        newShape = shapes[Math.floor(Math.random() * shapes.length)];
    } while (newShape === previousShape);

    currentShape = newShape;
    previousShape = currentShape;
    totalQuestions++;
}

async function playShapeSound() {
    const shapeIndex = shapes.indexOf(currentShape) + 1;
    await playSound(`aani${shapeIndex}.mp3`);
}

async function startGame() {
    document.getElementById('main-title').style.display = 'none';
    document.getElementById('game-title').style.display = 'block';
    startScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    showRandomShape(); // Valitse ensimmäinen muoto
    await playSound('valitse.mp3');
    await playShapeSound(); // Toista muodon ääni 'valitse.mp3':n jälkeen
}

function checkAnswer(selectedShape) {
    const selectedButton = document.querySelector(`.shape-button[data-shape="${selectedShape}"]`);
    if (selectedShape === currentShape) {
        score++;
        counters[currentShape]++;
        document.querySelector(`.counter[data-shape="${currentShape}"]`).textContent = counters[currentShape];
        playSound('oikein.mp3');
    } else {
        playSound('vaarin.mp3');
        selectedButton.classList.add('incorrect');
        setTimeout(() => {
            selectedButton.classList.remove('incorrect');
        }, 300);
    }

    if (totalQuestions < 10) {
        setTimeout(async () => {
            showRandomShape();
            await playShapeSound();
        }, 1000);
    } else {
        setTimeout(showFeedback, 1000);
    }
}

function showFeedback() {
    gameScreen.style.display = 'none';
    feedbackScreen.style.display = 'block';
    document.getElementById('score').textContent = `OIKEIN: ${score}/${totalQuestions}`;
    const starsContainer = document.getElementById('stars');
    starsContainer.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const star = document.createElement('img');
        star.src = 'tahti.avif';
        star.alt = 'Tähti';
        starsContainer.appendChild(star);
    }
}

function resetGame() {
    document.getElementById('main-title').style.display = 'block';
    document.getElementById('game-title').style.display = 'none';
    score = 0;
    totalQuestions = 0;
    shapes.forEach(shape => {
        counters[shape] = 0;
        document.querySelector(`.counter[data-shape="${shape}"]`).textContent = '0';
    });
    feedbackScreen.style.display = 'none';
    startScreen.style.display = 'block';
    gameScreen.style.display = 'none';
    currentShape = null;
    previousShape = null;
}

startButton.addEventListener('click', startGame);
playAgainButton.addEventListener('click', resetGame);

gameBoard.addEventListener('click', (e) => {
    if (e.target.classList.contains('shape-button')) {
        checkAnswer(e.target.dataset.shape);
    }
});