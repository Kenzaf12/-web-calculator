let currentInput = '0';
let previousInput = '';
let operation = null;
let history = [];

const resultDisplay = document.getElementById('result');
const historyDisplay = document.getElementById('history');
const historyList = document.getElementById('historyList');
const themeToggle = document.getElementById('themeToggle');

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
}

// Load history from localStorage
function loadHistory() {
    const savedHistory = localStorage.getItem('calculatorHistory');
    if (savedHistory) {
        history = JSON.parse(savedHistory);
        updateHistoryDisplay();
    }
}

function saveHistory() {
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
}

function appendNumber(num) {
    if (currentInput === '0' && num !== '.') {
        currentInput = num;
    } else if (num === '.' && currentInput.includes('.')) {
        return;
    } else {
        currentInput += num;
    }
    updateDisplay();
}

function appendOperator(op) {
    if (operation !== null) {
        calculateResult();
    }
    previousInput = currentInput;
    operation = op;
    currentInput = '0';
    updateHistoryText();
}

function updateDisplay() {
    resultDisplay.value = currentInput;
}

function updateHistoryText() {
    if (previousInput && operation) {
        const opSymbol = {
            '+': '+',
            '-': '-',
            '*': '×',
            '/': '÷'
        }[operation] || operation;
        historyDisplay.textContent = `${previousInput} ${opSymbol}`;
    } else {
        historyDisplay.textContent = '';
    }
}

function calculateResult() {
    if (operation === null || previousInput === '') return;

    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    let result;

    switch (operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                alert('Division par zéro impossible');
                clearAll();
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }

    const opSymbol = {
        '+': '+',
        '-': '-',
        '*': '×',
        '/': '÷'
    }[operation];

    addToHistory(`${previousInput} ${opSymbol} ${currentInput} = ${result}`);
    
    currentInput = result.toString();
    operation = null;
    previousInput = '';
    updateDisplay();
    historyDisplay.textContent = '';
}

function calculate(func) {
    const current = parseFloat(currentInput);
    let result;

    switch (func) {
        case 'sin':
            result = Math.sin(current * Math.PI / 180);
            addToHistory(`sin(${current}) = ${result}`);
            break;
        case 'cos':
            result = Math.cos(current * Math.PI / 180);
            addToHistory(`cos(${current}) = ${result}`);
            break;
        case 'tan':
            result = Math.tan(current * Math.PI / 180);
            addToHistory(`tan(${current}) = ${result}`);
            break;
        case 'sqrt':
            if (current < 0) {
                alert('Racine carrée de nombre négatif impossible');
                return;
            }
            result = Math.sqrt(current);
            addToHistory(`√${current} = ${result}`);
            break;
        case 'power':
            result = Math.pow(current, 2);
            addToHistory(`${current}² = ${result}`);
            break;
        default:
            return;
    }

    currentInput = result.toString();
    updateDisplay();
}

function clearAll() {
    currentInput = '0';
    previousInput = '';
    operation = null;
    updateDisplay();
    historyDisplay.textContent = '';
}

function clearEntry() {
    currentInput = '0';
    updateDisplay();
}

function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

function addToHistory(entry) {
    history.unshift(entry);
    if (history.length > 10) {
        history.pop();
    }
    updateHistoryDisplay();
    saveHistory();
}

function updateHistoryDisplay() {
    historyList.innerHTML = '';
    history.forEach(entry => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.textContent = entry;
        historyList.appendChild(div);
    });
}

function clearHistory() {
    history = [];
    updateHistoryDisplay();
    saveHistory();
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
    if (e.key === '.') appendNumber('.');
    if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') appendOperator(e.key);
    if (e.key === 'Enter') calculateResult();
    if (e.key === 'Escape') clearAll();
    if (e.key === 'Backspace') deleteLast();
});

// Load history on startup
loadHistory();