// Solve Page - Exercise Solver

let currentExercise = null;
let editor = null;
let startTime = null;
let timerInterval = null;
let pyodideInstance = null;
let sqlDb = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const exerciseId = urlParams.get('id');

    if (!exerciseId) {
        alert('No se especificó un ejercicio');
        window.location.href = 'index.html';
        return;
    }

    await loadExercise(exerciseId);
    await initializeEditor();
    startTimer();
});

// Load exercise data
async function loadExercise(exerciseId) {
    try {
        const response = await fetch('ejercicios/exercises.json');
        const data = await response.json();
        currentExercise = data.exercises.find(ex => ex.id === exerciseId);

        if (!currentExercise) {
            alert('Ejercicio no encontrado');
            window.location.href = 'index.html';
            return;
        }

        displayExercise();
    } catch (error) {
        console.error('Error loading exercise:', error);
        alert('Error al cargar el ejercicio');
    }
}

// Display exercise information
function displayExercise() {
    document.getElementById('exercise-title').textContent = currentExercise.title;

    const categorySpan = document.getElementById('exercise-category');
    categorySpan.textContent = currentExercise.category.toUpperCase();
    categorySpan.className = `exercise-category category-${currentExercise.category}`;

    const difficultySpan = document.getElementById('exercise-difficulty');
    difficultySpan.textContent = currentExercise.difficulty === 'ssr' ? 'SSR' : 'Senior';
    difficultySpan.className = `difficulty-badge difficulty-${currentExercise.difficulty}`;

    document.getElementById('time-limit').textContent = formatTime(currentExercise.timeLimit * 60);
    document.getElementById('problem-description').textContent = currentExercise.description;
    document.getElementById('problem-instructions').textContent = currentExercise.instructions;
    document.getElementById('dataset-name').textContent = currentExercise.dataset;

    displayTestCases();
}

// Display test cases
function displayTestCases() {
    const container = document.getElementById('test-cases-list');
    container.innerHTML = currentExercise.testCases.map((testCase, index) => `
        <div class="test-case-item" id="test-case-${index}">
            <div class="test-case-header">
                <strong>Test ${index + 1}</strong>
                <span class="test-status" id="test-status-${index}">Pendiente</span>
            </div>
            <p>${testCase.description}</p>
        </div>
    `).join('');
}

// Initialize Monaco Editor
async function initializeEditor() {
    return new Promise((resolve) => {
        require.config({
            paths: {
                'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs'
            }
        });

        require(['vs/editor/editor.main'], function() {
            const languageMap = {
                'sql': 'sql',
                'python': 'python',
                'pyspark': 'python'
            };

            editor = monaco.editor.create(document.getElementById('code-editor'), {
                value: currentExercise.starterCode,
                language: languageMap[currentExercise.category],
                theme: 'vs-dark',
                fontSize: 14,
                minimap: { enabled: true },
                automaticLayout: true,
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                roundedSelection: false,
                readOnly: false,
                cursorStyle: 'line'
            });

            resolve();
        });
    });
}

// Timer functions
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const timeLimit = currentExercise.timeLimit * 60;

    document.getElementById('timer').textContent = formatTime(elapsed);

    // Check if time limit exceeded
    if (elapsed >= timeLimit) {
        clearInterval(timerInterval);
        showTimeoutModal();
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function showTimeoutModal() {
    alert('¡Tiempo agotado! El cronómetro ha llegado al límite.');
}

// Code execution
async function runCode() {
    const code = editor.getValue();
    showLoadingModal();

    try {
        let results;

        if (currentExercise.category === 'sql') {
            results = await runSQL(code);
        } else if (currentExercise.category === 'python') {
            results = await runPython(code);
        } else if (currentExercise.category === 'pyspark') {
            showPySparkInstructions();
            hideLoadingModal();
            return;
        }

        hideLoadingModal();
        displayResults(results);
        validateResults(results);
    } catch (error) {
        hideLoadingModal();
        displayError(error);
    }
}

// SQL Execution using sql.js
async function runSQL(code) {
    if (!sqlDb) {
        await initSQL();
    }

    try {
        const result = sqlDb.exec(code);
        return {
            success: true,
            output: result,
            columns: result[0]?.columns || [],
            values: result[0]?.values || []
        };
    } catch (error) {
        throw new Error(`SQL Error: ${error.message}`);
    }
}

// Initialize SQL.js
async function initSQL() {
    const SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
    });

    sqlDb = new SQL.Database();

    // Load sample data based on exercise dataset
    await loadSampleData();
}

// Load sample data for SQL exercises
async function loadSampleData() {
    // Sample data for sales_data
    if (currentExercise.dataset === 'sales_data.csv') {
        sqlDb.run(`
            CREATE TABLE sales (
                product_id INTEGER,
                product_name TEXT,
                total_sales REAL,
                sale_date TEXT
            );
            INSERT INTO sales VALUES
            (1, 'Laptop', 150000.00, '2024-01-15'),
            (2, 'Mouse', 25000.00, '2024-01-16'),
            (3, 'Keyboard', 35000.00, '2024-01-17'),
            (4, 'Monitor', 120000.00, '2024-01-18'),
            (5, 'Headphones', 45000.00, '2024-01-19');
        `);
    } else if (currentExercise.dataset === 'transactions.csv') {
        sqlDb.run(`
            CREATE TABLE transactions (
                transaction_id INTEGER,
                transaction_type TEXT,
                amount REAL,
                transaction_time TEXT
            );
            INSERT INTO transactions VALUES
            (1, 'purchase', 100.00, '2024-01-15 14:30:00'),
            (2, 'purchase', 250.00, '2024-01-15 15:45:00'),
            (3, 'refund', 50.00, '2024-01-15 16:20:00'),
            (4, 'purchase', 5000.00, '2024-01-15 22:10:00'),
            (5, 'purchase', 150.00, '2024-01-16 09:30:00');
        `);
    } else if (currentExercise.dataset === 'user_activity.csv') {
        sqlDb.run(`
            CREATE TABLE users (
                user_id INTEGER,
                registration_date TEXT,
                email TEXT
            );
            CREATE TABLE activities (
                user_id INTEGER,
                activity_date TEXT,
                activity_type TEXT
            );
            INSERT INTO users VALUES
            (1, '2024-01-01', 'user1@example.com'),
            (2, '2024-01-15', 'user2@example.com'),
            (3, '2024-02-01', 'user3@example.com');
            INSERT INTO activities VALUES
            (1, '2024-01-05', 'login'),
            (1, '2024-02-05', 'purchase'),
            (2, '2024-01-20', 'login'),
            (3, '2024-02-10', 'login');
        `);
    }
}

// Python execution using Pyodide
async function runPython(code) {
    if (!pyodideInstance) {
        await initPyodide();
    }

    try {
        // Capture output
        await pyodideInstance.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
        `);

        // Run user code
        await pyodideInstance.runPythonAsync(code);

        // Get output
        const stdout = await pyodideInstance.runPythonAsync('sys.stdout.getvalue()');
        const stderr = await pyodideInstance.runPythonAsync('sys.stderr.getvalue()');

        return {
            success: true,
            output: stdout || 'Código ejecutado exitosamente',
            error: stderr
        };
    } catch (error) {
        throw new Error(`Python Error: ${error.message}`);
    }
}

// Initialize Pyodide
async function initPyodide() {
    pyodideInstance = await loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
    });

    // Load necessary packages
    await pyodideInstance.loadPackage(['numpy', 'pandas']);
}

// Show PySpark instructions
function showPySparkInstructions() {
    const modal = document.getElementById('results-modal');
    document.getElementById('results-title').textContent = 'Ejercicio PySpark';
    document.getElementById('results-content').innerHTML = `
        <div style="text-align: left; padding: 1rem;">
            <p style="margin-bottom: 1rem;">
                <strong>Los ejercicios de PySpark se resuelven en Google Colab</strong>
            </p>
            <p style="margin-bottom: 1rem;">
                Este ejercicio requiere un entorno con Apache Spark. Hemos preparado un notebook de Google Colab con:
            </p>
            <ul style="margin-left: 2rem; margin-bottom: 1rem;">
                <li>PySpark pre-configurado</li>
                <li>Dataset cargado y listo para usar</li>
                <li>Casos de prueba automáticos</li>
                <li>Validación de resultados</li>
            </ul>
            <p style="margin-bottom: 1.5rem;">
                Copia tu código al editor de abajo y luego ábrelo en Colab para ejecutar:
            </p>
            <div style="background: #f1f5f9; padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                <code style="display: block; white-space: pre-wrap;">${editor.getValue()}</code>
            </div>
            <a href="${currentExercise.colabNotebook}" target="_blank"
               class="btn-primary" style="display: inline-block; text-decoration: none; margin-top: 1rem;">
                🚀 Abrir en Google Colab
            </a>
        </div>
    `;
    modal.style.display = 'flex';
}

// Display results
function displayResults(results) {
    switchTab('output');
    const output = document.getElementById('output-content');

    if (results.success) {
        if (currentExercise.category === 'sql' && results.values) {
            output.innerHTML = `
                <div style="color: #10b981; margin-bottom: 1rem;">✓ Query ejecutado exitosamente</div>
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                ${results.columns.map(col => `<th style="padding: 0.5rem; border: 1px solid #475569; background: #334155;">${col}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${results.values.map(row => `
                                <tr>
                                    ${row.map(cell => `<td style="padding: 0.5rem; border: 1px solid #475569;">${cell}</td>`).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <div style="margin-top: 1rem; color: #64748b;">
                    ${results.values.length} filas retornadas
                </div>
            `;
        } else {
            output.innerHTML = `
                <div style="color: #10b981; margin-bottom: 1rem;">✓ Código ejecutado exitosamente</div>
                <pre style="margin: 0;">${results.output || 'Sin salida'}</pre>
            `;
        }
    }
}

// Display error
function displayError(error) {
    switchTab('console');
    const output = document.getElementById('output-content');
    output.innerHTML = `
        <div style="color: #ef4444; margin-bottom: 1rem;">✗ Error de ejecución</div>
        <pre style="margin: 0; color: #f87171;">${error.message}</pre>
    `;
}

// Validate results against test cases
function validateResults(results) {
    // Simplified validation - in production would be more sophisticated
    currentExercise.testCases.forEach((testCase, index) => {
        const passed = Math.random() > 0.3; // Placeholder validation
        updateTestCaseStatus(index, passed);
    });
}

// Update test case status
function updateTestCaseStatus(index, passed) {
    const testCase = document.getElementById(`test-case-${index}`);
    const status = document.getElementById(`test-status-${index}`);

    if (passed) {
        testCase.classList.add('passed');
        status.textContent = '✓ Pasó';
        status.classList.add('passed');
    } else {
        testCase.classList.add('failed');
        status.textContent = '✗ Falló';
        status.classList.add('failed');
    }
}

// Tab switching
function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    event?.target?.classList.add('active');
}

// Reset code to starter
function resetCode() {
    if (confirm('¿Estás seguro de que quieres resetear el código?')) {
        editor.setValue(currentExercise.starterCode);
    }
}

// View dataset
function viewDataset() {
    alert(`Dataset: ${currentExercise.dataset}\n\nEn la versión completa, aquí podrás ver una preview del dataset.`);
}

// Modal functions
function showLoadingModal() {
    document.getElementById('loading-modal').style.display = 'flex';
}

function hideLoadingModal() {
    document.getElementById('loading-modal').style.display = 'none';
}

function closeResultsModal() {
    document.getElementById('results-modal').style.display = 'none';
}

// Navigation
function goBack() {
    if (confirm('¿Estás seguro de que quieres salir? Se perderá tu progreso.')) {
        window.location.href = 'index.html';
    }
}

// Load SQL.js library
function initSqlJs(config) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js';
        script.onload = () => {
            resolve(window.initSqlJs(config));
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Load Pyodide library
function loadPyodide(config) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        script.onload = () => {
            resolve(window.loadPyodide(config));
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
}
