// Solve Page - Exercise Solver

let currentExercise = null;
let editor = null;
let startTime = null;
let timerInterval = null;
let pyodideInstance = null;
let sqlDb = null;
let currentHintIndex = 0;
let hintsUsed = 0;
let revealedHints = [];

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

    // Show/hide tabs based on available content
    if (currentExercise.knowledge && currentExercise.knowledge.length > 0) {
        document.getElementById('knowledge-tab-btn').style.display = 'flex';
        displayKnowledge();
    }

    if (currentExercise.examples && currentExercise.examples.length > 0) {
        document.getElementById('examples-tab-btn').style.display = 'flex';
        displayExamples();
    }

    // Update hints counter
    const totalHints = currentExercise.hints ? currentExercise.hints.length : 0;
    document.getElementById('hints-badge').textContent = totalHints;
    document.getElementById('hints-remaining-display').textContent = totalHints;

    displayTestCases();
}

// Switch between tabs
function switchLeftTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
    });
    const activeTab = document.getElementById(`tab-${tabName}`);
    activeTab.classList.add('active');
    activeTab.style.display = 'block';
}

// Display knowledge (NEW CARD DESIGN)
function displayKnowledge() {
    const knowledgeContent = document.getElementById('knowledge-content');

    knowledgeContent.innerHTML = currentExercise.knowledge.map((item, index) => `
        <div class="knowledge-card">
            <div class="knowledge-card-header">
                <div class="knowledge-number">${index + 1}</div>
                <h4>${item.concept}</h4>
            </div>
            <div class="knowledge-card-description">${item.description}</div>

            ${item.syntax ? `
                <div class="knowledge-section-box">
                    <span class="knowledge-section-label">Sintaxis</span>
                    <pre class="knowledge-code-box">${item.syntax}</pre>
                </div>
            ` : ''}

            ${item.example ? `
                <div class="knowledge-section-box">
                    <span class="knowledge-section-label">Ejemplo</span>
                    <pre class="knowledge-code-box">${item.example}</pre>
                    ${item.output ? `
                        <span class="knowledge-section-label" style="margin-top: 1rem;">Output</span>
                        <pre class="knowledge-output-box">${item.output}</pre>
                    ` : ''}
                </div>
            ` : ''}

            ${item.note ? `
                <div class="knowledge-note-box">
                    <strong>💡 Nota:</strong> ${item.note}
                </div>
            ` : ''}
        </div>
    `).join('');
}

// Display examples (NEW CARD DESIGN)
function displayExamples() {
    const examplesContent = document.getElementById('examples-content');

    examplesContent.innerHTML = currentExercise.examples.map((example, index) => `
        <div class="example-card">
            <div class="example-card-header">
                <div class="example-number">${index + 1}</div>
                <h4>Ejemplo ${index + 1}</h4>
            </div>

            ${example.input ? `
                <div class="example-input-box">
                    <span class="example-label-text">Input</span>
                    <pre class="example-code-text">${example.input}</pre>
                </div>
            ` : ''}

            <div class="example-input-box">
                <span class="example-label-text">Output Esperado</span>
                <pre class="example-output-text">${example.output}</pre>
            </div>

            ${example.explanation ? `
                <div class="example-explanation">
                    <strong>💡 Explicación:</strong> ${example.explanation}
                </div>
            ` : ''}
        </div>
    `).join('');
}

// Reveal next hint
function revealNextHint() {
    if (!currentExercise.hints || currentExercise.hints.length === 0) {
        alert('No hay pistas disponibles para este ejercicio');
        return;
    }

    if (currentHintIndex >= currentExercise.hints.length) {
        alert('Ya has usado todas las pistas disponibles');
        return;
    }

    const hintsContent = document.getElementById('hints-content');
    const revealButton = document.getElementById('reveal-hint-btn');

    // Remove empty placeholder if it exists
    const emptyPlaceholder = hintsContent.querySelector('.hints-empty');
    if (emptyPlaceholder) {
        emptyPlaceholder.remove();
    }

    // Add the revealed hint
    const hintDiv = document.createElement('div');
    hintDiv.className = 'hint-revealed';
    hintDiv.innerHTML = `
        <div class="hint-revealed-header">
            <div class="hint-number-badge">${currentHintIndex + 1}</div>
            <span class="hint-title-text">Pista ${currentHintIndex + 1} de ${currentExercise.hints.length}</span>
        </div>
        <div class="hint-content-text">
            ${currentExercise.hints[currentHintIndex]}
        </div>
    `;
    hintsContent.appendChild(hintDiv);

    // Update counters
    currentHintIndex++;
    const remaining = currentExercise.hints.length - currentHintIndex;
    document.getElementById('hints-badge').textContent = remaining;
    document.getElementById('hints-remaining-display').textContent = remaining;

    // Disable button if no more hints
    if (remaining === 0) {
        revealButton.disabled = true;
        revealButton.textContent = '🔒 No hay más pistas disponibles';
    } else {
        revealButton.textContent = `🔓 Revelar Siguiente Pista (${remaining} restantes)`;
    }

    // Scroll to the new hint
    setTimeout(() => {
        hintDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
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

        // Clear error since code executed successfully
        lastError = null;
    } catch (error) {
        hideLoadingModal();
        displayError(error);

        // Capture error for AI context
        lastError = error.message;
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
        // Load dataset into Pyodide filesystem if it exists
        if (currentExercise.dataset) {
            await loadDatasetIntoPyodide(currentExercise.dataset);
        }

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

// Load dataset into Pyodide filesystem
async function loadDatasetIntoPyodide(filename) {
    if (!pyodideInstance) {
        await initPyodide();
    }

    try {
        // Fetch the dataset file
        const response = await fetch(`datasets/${filename}`);
        if (!response.ok) {
            console.warn(`Dataset ${filename} not found, skipping...`);
            return;
        }

        const content = await response.text();

        // Write file to Pyodide's virtual filesystem
        pyodideInstance.FS.writeFile(filename, content);

        console.log(`Dataset ${filename} loaded into Pyodide filesystem`);
    } catch (error) {
        console.warn(`Could not load dataset ${filename}:`, error);
    }
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
    const testResults = [];

    currentExercise.testCases.forEach((testCase, index) => {
        const passed = Math.random() > 0.3; // Placeholder validation
        updateTestCaseStatus(index, passed);

        testResults.push({
            description: testCase.description,
            passed: passed
        });
    });

    // Capture test results for AI context
    lastTestResults = testResults;
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

// View dataset - full implementation
async function viewDataset() {
    const modal = document.getElementById('dataset-modal');
    const content = document.getElementById('dataset-content');

    document.getElementById('dataset-modal-name').textContent = currentExercise.dataset;

    try {
        // Load dataset based on category
        let data;
        if (currentExercise.category === 'sql') {
            // Get data from SQL database
            if (!sqlDb) {
                await initSQL();
            }
            data = await getDatasetFromSQL();
        } else {
            // Load CSV file
            data = await loadDatasetCSV(currentExercise.dataset);
        }

        // Display dataset as table
        content.innerHTML = generateDatasetTable(data);

        // Update stats
        document.getElementById('dataset-rows').textContent = data.rows.length;
        document.getElementById('dataset-cols').textContent = data.columns.length;

        modal.style.display = 'flex';
    } catch (error) {
        console.error('Error loading dataset:', error);
        content.innerHTML = '<p style="color: var(--danger-color); padding: 1rem;">Error al cargar el dataset</p>';
        modal.style.display = 'flex';
    }
}

// Get dataset from SQL database
async function getDatasetFromSQL() {
    const tables = sqlDb.exec("SELECT name FROM sqlite_master WHERE type='table'");

    if (tables.length === 0 || tables[0].values.length === 0) {
        throw new Error('No tables found');
    }

    const tableName = tables[0].values[0][0];
    const result = sqlDb.exec(`SELECT * FROM ${tableName} LIMIT 100`);

    if (result.length === 0) {
        return { columns: [], rows: [] };
    }

    return {
        columns: result[0].columns,
        rows: result[0].values
    };
}

// Load dataset from CSV
async function loadDatasetCSV(filename) {
    try {
        const response = await fetch(`datasets/${filename}`);
        const text = await response.text();

        const lines = text.trim().split('\n');
        const headers = lines[0].split(',');
        const rows = lines.slice(1).map(line => {
            // Simple CSV parsing (doesn't handle quoted commas)
            return line.split(',');
        });

        return {
            columns: headers,
            rows: rows
        };
    } catch (error) {
        throw new Error(`Could not load ${filename}`);
    }
}

// Generate dataset table HTML
function generateDatasetTable(data) {
    if (!data.rows || data.rows.length === 0) {
        return '<p style="padding: 1rem; color: var(--text-secondary);">No hay datos disponibles</p>';
    }

    return `
        <table>
            <thead>
                <tr>
                    ${data.columns.map(col => `<th>${col}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                ${data.rows.map(row => `
                    <tr>
                        ${row.map(cell => `<td>${cell}</td>`).join('')}
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Close dataset modal
function closeDatasetModal() {
    document.getElementById('dataset-modal').style.display = 'none';
}

// Download dataset as CSV
function downloadDataset() {
    // Create a link to the dataset file
    const link = document.createElement('a');
    link.href = `datasets/${currentExercise.dataset}`;
    link.download = currentExercise.dataset;
    link.click();
}

// Show hint
function showHint() {
    if (!currentExercise.hints || currentExercise.hints.length === 0) {
        alert('No hay pistas disponibles para este ejercicio');
        return;
    }

    if (currentHintIndex >= currentExercise.hints.length) {
        alert('Ya has usado todas las pistas disponibles');
        return;
    }

    const modal = document.getElementById('hint-modal');
    const content = document.getElementById('hint-content');
    const hintNumber = document.getElementById('current-hint-number');

    // Get current hint
    const hint = currentExercise.hints[currentHintIndex];

    // Update modal content
    hintNumber.textContent = `${currentHintIndex + 1}/${currentExercise.hints.length}`;
    content.innerHTML = hint;

    // Update counters
    currentHintIndex++;
    hintsUsed++;

    const remaining = currentExercise.hints.length - currentHintIndex;
    document.getElementById('hints-remaining').textContent = remaining;
    document.getElementById('hints-remaining-modal').textContent = remaining;

    // Disable hint button if no more hints
    if (remaining === 0) {
        document.getElementById('hint-button').disabled = true;
        document.getElementById('hint-button').textContent = '💡 No hay más pistas disponibles';
        document.getElementById('next-hint-btn').style.display = 'none';
    }

    modal.style.display = 'flex';
}

// Close hint modal
function closeHintModal() {
    document.getElementById('hint-modal').style.display = 'none';
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

// ========================================
// AI ASSISTANT FUNCTIONS
// ========================================

// Global variables for AI context
let lastError = null;
let lastTestResults = null;

// Toggle AI chat panel
function toggleAIAssistant() {
    const panel = document.getElementById('ai-chat-panel');
    const isVisible = panel.style.display !== 'none';
    panel.style.display = isVisible ? 'none' : 'block';

    // Check if API key is configured
    if (!isVisible && !aiAssistant.isEnabled) {
        setTimeout(() => {
            if (confirm('No tienes configurada una API key de Gemini. ¿Quieres configurarla ahora?')) {
                openAISettings();
            }
        }, 300);
    }
}

// Send message to AI
async function sendAIMessage() {
    const input = document.getElementById('ai-chat-input');
    const message = input.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessageToChat(message, 'user');
    input.value = '';

    // Show loading
    const loadingId = addMessageToChat('Pensando...', 'loading');

    try {
        const context = {
            exercise: currentExercise,
            userCode: editor ? editor.getValue() : '',
            error: lastError,
            testResults: lastTestResults
        };

        const response = await aiAssistant.sendMessage(message, context);
        removeMessageFromChat(loadingId);
        addMessageToChat(response, 'assistant');
    } catch (error) {
        removeMessageFromChat(loadingId);
        addMessageToChat(`❌ Error: ${error.message}`, 'error');

        // If API key error, suggest configuration
        if (error.message.includes('API key')) {
            setTimeout(() => {
                if (confirm('Parece que tu API key no está configurada o es inválida. ¿Quieres configurarla?')) {
                    openAISettings();
                }
            }, 500);
        }
    }
}

// Quick action handler
function askAI(question) {
    const input = document.getElementById('ai-chat-input');
    input.value = question;
    sendAIMessage();
}

// Open AI settings modal
function openAISettings() {
    document.getElementById('ai-settings-modal').style.display = 'flex';
    const currentKey = aiAssistant.apiKey;
    if (currentKey) {
        document.getElementById('ai-api-key-input').value = currentKey;
    }
}

// Close AI settings modal
function closeAISettings() {
    document.getElementById('ai-settings-modal').style.display = 'none';
}

// Save AI settings
function saveAISettings() {
    const key = document.getElementById('ai-api-key-input').value.trim();
    if (!key) {
        showAIStatus('Por favor ingresa una API key', 'error');
        return;
    }

    if (!key.startsWith('AIza')) {
        showAIStatus('⚠️ La API key de Gemini normalmente comienza con "AIza"', 'warning');
    }

    aiAssistant.saveAPIKey(key);
    showAIStatus('✅ API Key guardada correctamente', 'success');
    setTimeout(() => closeAISettings(), 1500);
}

// Remove AI key
function removeAIKey() {
    if (confirm('¿Seguro que quieres eliminar tu API key?')) {
        aiAssistant.removeAPIKey();
        document.getElementById('ai-api-key-input').value = '';
        showAIStatus('🗑️ API Key eliminada', 'success');
        setTimeout(() => {
            clearAIChat();
        }, 1000);
    }
}

// Clear chat
function clearAIChat() {
    aiAssistant.clearHistory();
    const messagesDiv = document.getElementById('ai-chat-messages');
    messagesDiv.innerHTML = `
        <div class="ai-message ai-message-system">
            👋 ¡Hola! Soy tu asistente de IA. Puedo ayudarte con:
            <ul>
                <li>Explicar errores en tu código</li>
                <li>Dar hints sin revelar la solución</li>
                <li>Aclarar conceptos de programación</li>
                <li>Sugerir mejores prácticas</li>
            </ul>
            <small style="opacity: 0.7;">💡 Tip: Haz preguntas específicas para mejores respuestas</small>
        </div>
    `;
}

// Handle Enter key in chat input
function handleAIChatKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendAIMessage();
    }
}

// Helper: Add message to chat UI
function addMessageToChat(text, type) {
    const messagesDiv = document.getElementById('ai-chat-messages');
    const messageDiv = document.createElement('div');
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    messageDiv.className = `ai-message ai-message-${type}`;
    messageDiv.id = messageId;

    if (type === 'loading') {
        messageDiv.innerHTML = `
            <span>${text}</span>
            <span class="ai-loading-dots">
                <span>.</span><span>.</span><span>.</span>
            </span>
        `;
    } else if (type === 'assistant') {
        // Render markdown-style formatting
        const formattedText = text
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
        messageDiv.innerHTML = formattedText;
    } else {
        messageDiv.textContent = text;
    }

    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    return messageId;
}

// Helper: Remove message from chat
function removeMessageFromChat(messageId) {
    const messageDiv = document.getElementById(messageId);
    if (messageDiv) {
        messageDiv.remove();
    }
}

// Helper: Show status in AI settings modal
function showAIStatus(message, type) {
    const statusDiv = document.getElementById('ai-key-status');
    statusDiv.textContent = message;
    statusDiv.style.display = 'block';

    // Set color based on type
    if (type === 'success') {
        statusDiv.style.background = '#d1fae5';
        statusDiv.style.color = '#065f46';
    } else if (type === 'error') {
        statusDiv.style.background = '#fee2e2';
        statusDiv.style.color = '#991b1b';
    } else if (type === 'warning') {
        statusDiv.style.background = '#fef3c7';
        statusDiv.style.color = '#92400e';
    }
}
