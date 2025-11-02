// Learn Page - DataCamp Style

let currentExercise = null;
let allExercises = [];
let currentIndex = 0;
let editor = null;
let pyodideInstance = null;
let sqlDb = null;
let hintsRevealed = 0;

// Initialize
window.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const exerciseId = urlParams.get('id');

    await loadAllExercises();

    if (exerciseId) {
        currentIndex = allExercises.findIndex(ex => ex.id === exerciseId);
        if (currentIndex === -1) currentIndex = 0;
    }

    loadExercise(currentIndex);
    initializeEditor();
});

// Load all exercises
async function loadAllExercises() {
    try {
        const response = await fetch('ejercicios/learn_exercises.json');
        const data = await response.json();
        allExercises = data.exercises;
    } catch (error) {
        console.error('Error loading exercises:', error);
        alert('Error cargando ejercicios');
    }
}

// Detect if exercise is SQL based on title
function isSQLExercise() {
    if (!currentExercise) return false;
    const title = currentExercise.title.toUpperCase();
    return title.includes('SQL -') || title.startsWith('SQL');
}

// Load exercise
async function loadExercise(index) {
    if (index < 0 || index >= allExercises.length) return;

    currentIndex = index;
    currentExercise = allExercises[index];
    hintsRevealed = 0;

    // Update header
    document.getElementById('exercise-number').textContent = `${index + 1}/${allExercises.length}`;
    document.getElementById('exercise-title').textContent = currentExercise.title;

    // Update progress bar
    const progress = ((index + 1) / allExercises.length) * 100;
    document.getElementById('progress-bar-fill').style.width = `${progress}%`;

    // Update navigation buttons
    updateNavigationButtons();

    // Update editor language based on exercise type
    if (editor) {
        const language = isSQLExercise() ? 'sql' : 'python';
        monaco.editor.setModelLanguage(editor.getModel(), language);
    }

    // Load content
    loadInstruction();
    loadTheory();
    loadExample();
    loadHints();
    loadCode();
    clearConsole();

    // Pre-load dataset if exercise requires one
    if (currentExercise.dataset) {
        displayConsoleOutput(`⏳ Preparando dataset "${currentExercise.dataset}"...\n`, 'info');
        await ensureDatasetLoaded(currentExercise.dataset);
    }
}

// Update navigation button states
function updateNavigationButtons() {
    const btnPrevious = document.getElementById('btn-previous');
    const btnNext = document.getElementById('btn-next');

    // Disable previous button on first exercise
    if (currentIndex === 0) {
        btnPrevious.disabled = true;
        btnPrevious.style.opacity = '0.5';
        btnPrevious.style.cursor = 'not-allowed';
    } else {
        btnPrevious.disabled = false;
        btnPrevious.style.opacity = '1';
        btnPrevious.style.cursor = 'pointer';
    }

    // Update next button text on last exercise
    if (currentIndex === allExercises.length - 1) {
        btnNext.textContent = '🏁 Finalizar';
    } else {
        btnNext.textContent = 'Siguiente →';
    }
}

// Load instruction
function loadInstruction() {
    document.getElementById('instruction-text').textContent = currentExercise.instruction;
}

// Load theory
function loadTheory() {
    document.getElementById('theory-description').textContent = currentExercise.theory;
    document.getElementById('syntax-code').textContent = currentExercise.syntax;
}

// Load example
function loadExample() {
    document.getElementById('example-code').textContent = currentExercise.example.code;
    document.getElementById('example-explanation').textContent = currentExercise.example.explanation;
}

// Load hints
function loadHints() {
    const hints = currentExercise.hints || [];
    document.getElementById('hints-count').textContent = hints.length;
    document.getElementById('hints-container').innerHTML = '';

    const btn = document.getElementById('btn-reveal-hint');
    btn.disabled = hints.length === 0;
    btn.textContent = hints.length === 0 ? 'No hay pistas' : '🔓 Revelar pista';
}

// Reveal hint
function revealHint() {
    const hints = currentExercise.hints || [];

    if (hintsRevealed >= hints.length) return;

    const container = document.getElementById('hints-container');
    const hintDiv = document.createElement('div');
    hintDiv.className = 'hint-item';
    hintDiv.innerHTML = `<span class="hint-number">Pista ${hintsRevealed + 1}:</span> ${hints[hintsRevealed]}`;
    container.appendChild(hintDiv);

    hintsRevealed++;

    // Update button
    const remaining = hints.length - hintsRevealed;
    document.getElementById('hints-count').textContent = remaining;

    if (hintsRevealed >= hints.length) {
        document.getElementById('btn-reveal-hint').disabled = true;
        document.getElementById('btn-reveal-hint').textContent = '✓ Todas reveladas';
    }
}

// Load code in editor
function loadCode() {
    if (editor) {
        editor.setValue(currentExercise.starterCode);
    }
}

// Initialize Monaco Editor
function initializeEditor() {
    require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
    require(['vs/editor/editor.main'], function () {
        const language = isSQLExercise() ? 'sql' : 'python';

        editor = monaco.editor.create(document.getElementById('code-editor'), {
            value: '',
            language: language,
            theme: 'vs-dark',
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            wordWrap: 'on'
        });

        // Load code after editor is ready
        if (currentExercise) {
            loadCode();
        }
    });
}

// ========================================
// CODE EXECUTION
// ========================================

// Run code
async function runCode() {
    showLoadingModal();

    try {
        const code = editor.getValue();
        let result;

        if (isSQLExercise()) {
            result = await runSQL(code);
        } else {
            result = await runPython(code);
        }

        hideLoadingModal();

        if (result.success) {
            displayConsoleOutput(result.output, 'success');
            if (result.error) {
                displayConsoleOutput(`\nWarnings:\n${result.error}`, 'error');
            }
        } else {
            displayConsoleOutput(`Error: ${result.error}`, 'error');
        }
    } catch (error) {
        hideLoadingModal();
        displayConsoleOutput(`Error: ${error.message}`, 'error');
    }
}

// Submit solution
async function submitSolution() {
    showLoadingModal();

    try {
        const code = editor.getValue();

        console.log('🚀 Submitting solution for exercise:', currentExercise.id);
        console.log('💡 Hints revealed:', hintsRevealed);

        const isCorrect = await validateSolution(code);

        hideLoadingModal();

        if (isCorrect) {
            console.log('✅ Solution is correct, saving progress...');
            console.log('📦 Exercise ID:', currentExercise.id);
            console.log('🎯 progressTracker exists?', typeof progressTracker !== 'undefined');

            // Mark as completed in progress tracker
            if (typeof progressTracker === 'undefined') {
                console.error('❌ ERROR: progressTracker is not defined!');
                alert('Error: Sistema de progreso no disponible. Recarga la página.');
                return;
            }

            progressTracker.markLearnCompleted(currentExercise.id, {
                hintsUsed: hintsRevealed
            });

            console.log('💾 Progress saved! Checking localStorage...');
            const savedProgress = localStorage.getItem('de_practice_hub_progress');
            if (savedProgress) {
                const parsed = JSON.parse(savedProgress);
                console.log('📊 Current learnProgress:', parsed.learnProgress);
                console.log('✓ Exercise saved?', parsed.learnProgress[currentExercise.id] ? 'YES' : 'NO');
            }

            displayConsoleOutput('✅ ¡Solución correcta! Progreso guardado.', 'success');
            setTimeout(() => showSuccessModal(), 500);
        } else {
            console.log('❌ Solution is incorrect, NOT saving');
            displayConsoleOutput('❌ Solución incorrecta. Revisa tu código e intenta de nuevo.', 'error');
        }
    } catch (error) {
        hideLoadingModal();
        console.error('❌ Submit error:', error);
        displayConsoleOutput(`Error en validación: ${error.message}`, 'error');
    }
}

// ========================================
// SQL EXECUTION
// ========================================

// Run SQL code
async function runSQL(code) {
    if (!sqlDb) {
        await initSQL();
    }

    try {
        const result = sqlDb.exec(code);

        if (result.length === 0) {
            return {
                success: true,
                output: '✓ Query ejecutado exitosamente (sin resultados)',
                error: null
            };
        }

        // Format results as table
        const columns = result[0].columns;
        const values = result[0].values;

        let tableHTML = '<table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">';
        tableHTML += '<thead><tr>';
        columns.forEach(col => {
            tableHTML += `<th style="padding: 0.5rem; border: 1px solid #475569; background: #334155;">${col}</th>`;
        });
        tableHTML += '</tr></thead><tbody>';

        values.forEach(row => {
            tableHTML += '<tr>';
            row.forEach(cell => {
                tableHTML += `<td style="padding: 0.5rem; border: 1px solid #475569;">${cell !== null ? cell : 'NULL'}</td>`;
            });
            tableHTML += '</tr>';
        });
        tableHTML += '</tbody></table>';

        return {
            success: true,
            output: `✓ Query ejecutado exitosamente\n\n${values.length} fila(s) retornadas:\n\n${tableHTML}`,
            error: null,
            resultData: { columns, values }
        };
    } catch (error) {
        return {
            success: false,
            output: '',
            error: error.message
        };
    }
}

// Initialize SQL.js
async function initSQL() {
    displayConsoleOutput('Inicializando SQL.js...', 'info');

    try {
        const SQL = await initSqlJs({
            locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
        });

        sqlDb = new SQL.Database();

        // === TABLA: calificaciones (para RANK, DENSE_RANK) ===
        sqlDb.run(`
            CREATE TABLE IF NOT EXISTS calificaciones (
                id INTEGER PRIMARY KEY,
                estudiante TEXT,
                calificacion INTEGER
            );
        `);

        sqlDb.run(`
            INSERT INTO calificaciones (id, estudiante, calificacion) VALUES
            (1, 'Ana', 100),
            (2, 'Bob', 90),
            (3, 'Carlos', 90),
            (4, 'Diana', 80);
        `);

        // === TABLA: examenes (general) ===
        sqlDb.run(`
            CREATE TABLE IF NOT EXISTS examenes (
                id INTEGER PRIMARY KEY,
                nombre TEXT,
                score INTEGER
            );
        `);

        sqlDb.run(`
            INSERT INTO examenes (id, nombre, score) VALUES
            (1, 'John', 85),
            (2, 'Jane', 90),
            (3, 'Bob', 90),
            (4, 'Alice', 85),
            (5, 'Charlie', 80);
        `);

        // === TABLA: ventas (para CTEs, GROUPING SETS, ROWS BETWEEN) ===
        sqlDb.run(`
            CREATE TABLE IF NOT EXISTS ventas (
                id INTEGER PRIMARY KEY,
                region TEXT,
                categoria TEXT,
                producto TEXT,
                monto REAL,
                dia INTEGER,
                cantidad INTEGER
            );
        `);

        sqlDb.run(`
            INSERT INTO ventas (id, region, categoria, producto, monto, dia, cantidad) VALUES
            (1, 'Norte', 'Electrónica', 'Laptop', 150.5, 1, 10),
            (2, 'Norte', 'Electrónica', 'Mouse', 80.0, 2, 25),
            (3, 'Sur', 'Ropa', 'Camisa', 120.0, 3, 15),
            (4, 'Sur', 'Ropa', 'Pantalón', 90.0, 4, 20),
            (5, 'Este', 'Electrónica', 'Teclado', 200.0, 5, 12),
            (6, 'Oeste', 'Alimentos', 'Café', 60.0, 6, 30),
            (7, 'Norte', 'Ropa', 'Zapatos', 110.0, 7, 18),
            (8, 'Sur', 'Electrónica', 'Monitor', 180.0, 8, 8);
        `);

        // === TABLA: ventas_vendedores (para ROW_NUMBER, PARTITION BY) ===
        sqlDb.run(`
            CREATE TABLE IF NOT EXISTS ventas_vendedores (
                id INTEGER PRIMARY KEY,
                vendedor TEXT,
                region TEXT,
                ventas REAL
            );
        `);

        sqlDb.run(`
            INSERT INTO ventas_vendedores (id, vendedor, region, ventas) VALUES
            (1, 'Juan', 'Norte', 15000),
            (2, 'María', 'Norte', 18000),
            (3, 'Pedro', 'Norte', 12000),
            (4, 'Ana', 'Sur', 20000),
            (5, 'Luis', 'Sur', 16000),
            (6, 'Carmen', 'Sur', 14000),
            (7, 'Diego', 'Este', 19000),
            (8, 'Sofia', 'Este', 17000);
        `);

        // === TABLA: ventas_mensuales (para LAG, comparaciones temporales) ===
        sqlDb.run(`
            CREATE TABLE IF NOT EXISTS ventas_mensuales (
                id INTEGER PRIMARY KEY,
                mes INTEGER,
                ventas REAL
            );
        `);

        sqlDb.run(`
            INSERT INTO ventas_mensuales (id, mes, ventas) VALUES
            (1, 1, 10000),
            (2, 2, 12000),
            (3, 3, 11500),
            (4, 4, 13000),
            (5, 5, 14500),
            (6, 6, 13800);
        `);

        // === TABLA: productos (para CASE expressions) ===
        sqlDb.run(`
            CREATE TABLE IF NOT EXISTS productos (
                id INTEGER PRIMARY KEY,
                producto TEXT,
                precio REAL
            );
        `);

        sqlDb.run(`
            INSERT INTO productos (id, producto, precio) VALUES
            (1, 'Laptop Premium', 1200),
            (2, 'Laptop Standard', 800),
            (3, 'Mouse Gamer', 150),
            (4, 'Teclado Mecánico', 650),
            (5, 'Monitor 4K', 450),
            (6, 'Webcam HD', 80);
        `);

        // === TABLA: inventario (para COALESCE, manejo de NULLs) ===
        sqlDb.run(`
            CREATE TABLE IF NOT EXISTS inventario (
                id INTEGER PRIMARY KEY,
                producto TEXT,
                stock INTEGER,
                descripcion TEXT
            );
        `);

        sqlDb.run(`
            INSERT INTO inventario (id, producto, stock, descripcion) VALUES
            (1, 'Laptop', 10, 'Laptop de alta gama'),
            (2, 'Mouse', NULL, 'Mouse óptico'),
            (3, 'Teclado', 5, NULL),
            (4, 'Monitor', NULL, NULL),
            (5, 'Webcam', 15, 'Webcam Full HD');
        `);

        // === TABLAS: ventas_q1, ventas_q2 (para UNION) ===
        sqlDb.run(`
            CREATE TABLE IF NOT EXISTS ventas_q1 (
                producto TEXT,
                cantidad INTEGER
            );
        `);

        sqlDb.run(`
            INSERT INTO ventas_q1 (producto, cantidad) VALUES
            ('Laptop', 50),
            ('Mouse', 120),
            ('Teclado', 80);
        `);

        sqlDb.run(`
            CREATE TABLE IF NOT EXISTS ventas_q2 (
                producto TEXT,
                cantidad INTEGER
            );
        `);

        sqlDb.run(`
            INSERT INTO ventas_q2 (producto, cantidad) VALUES
            ('Laptop', 60),
            ('Monitor', 40),
            ('Webcam', 90);
        `);

        // === TABLAS ADICIONALES (para casos edge) ===
        sqlDb.run(`
            CREATE TABLE IF NOT EXISTS empleados (
                id INTEGER PRIMARY KEY,
                empleado TEXT,
                salario REAL
            );
        `);

        sqlDb.run(`
            INSERT INTO empleados (id, empleado, salario) VALUES
            (1, 'Bob', 100000),
            (2, 'Alice', 90000),
            (3, 'Charlie', 85000);
        `);

        sqlDb.run(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY,
                nombre TEXT,
                email TEXT,
                telefono TEXT,
                edad INTEGER,
                activo INTEGER
            );
        `);

        sqlDb.run(`
            INSERT INTO usuarios (id, nombre, email, telefono, edad, activo) VALUES
            (1, 'Juan', 'juan@example.com', '123456789', 30, 1),
            (2, 'María', NULL, '987654321', 25, 1),
            (3, 'Pedro', 'pedro@example.com', NULL, 28, 0);
        `);

        displayConsoleOutput('✓ SQL.js listo con todas las tablas cargadas\n', 'success');
        displayConsoleOutput('📊 Tablas disponibles: calificaciones, ventas, ventas_vendedores, ventas_mensuales, productos, inventario, y más\n', 'info');
    } catch (error) {
        displayConsoleOutput(`Error inicializando SQL: ${error.message}`, 'error');
        throw error;
    }
}

// Load sql.js library
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

// ========================================
// PYTHON EXECUTION
// ========================================

// Run Python code
async function runPython(code) {
    if (!pyodideInstance) {
        await initPyodide();
    }

    try {
        // Ensure dataset is loaded if exercise requires one (double-check)
        if (currentExercise.dataset) {
            const loaded = await ensureDatasetLoaded(currentExercise.dataset);
            if (!loaded) {
                throw new Error(`No se pudo cargar el dataset requerido: ${currentExercise.dataset}`);
            }
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
            output: stdout || 'Código ejecutado exitosamente (sin output)',
            error: stderr
        };
    } catch (error) {
        throw new Error(error.message);
    }
}

// Initialize Pyodide
async function initPyodide() {
    displayConsoleOutput('Inicializando Python... (esto puede tomar unos segundos la primera vez)', 'info');

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';

    await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });

    pyodideInstance = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
    });

    // Load packages if needed
    await pyodideInstance.loadPackage(['numpy', 'pandas']);

    displayConsoleOutput('✓ Python listo\n', 'success');
}

// Ensure dataset is loaded before running code
async function ensureDatasetLoaded(filename) {
    if (!pyodideInstance) {
        await initPyodide();
    }

    try {
        // Check if file is already loaded
        const exists = await pyodideInstance.runPythonAsync(`
import os
os.path.exists('${filename}')
        `);

        if (exists === true) {
            console.log(`✓ Dataset ${filename} already loaded`);
            displayConsoleOutput(`✓ Dataset "${filename}" ya está disponible\n`, 'success');
            return true;
        }
    } catch (e) {
        console.log(`Dataset ${filename} not loaded yet, loading now...`);
    }

    // Try to fetch and load the dataset
    try {
        const datasetPath = `datasets/${filename}`;
        console.log(`📂 Current location: ${window.location.href}`);
        console.log(`📂 Fetching dataset from: ${datasetPath}`);
        console.log(`📂 Full URL will be: ${new URL(datasetPath, window.location.href).href}`);

        const response = await fetch(datasetPath);

        console.log(`📡 Response status: ${response.status} ${response.statusText}`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: No se encontró el archivo en ${datasetPath}`);
        }

        const content = await response.text();
        console.log(`✓ Fetched ${content.length} bytes`);
        console.log(`✓ First 100 chars: ${content.substring(0, 100)}`);

        // Write file to Pyodide's virtual filesystem
        pyodideInstance.FS.writeFile(filename, content);

        // Verify it was written
        const verifyExists = await pyodideInstance.runPythonAsync(`
import os
os.path.exists('${filename}')
        `);

        if (verifyExists === true) {
            console.log(`✓ Dataset ${filename} loaded successfully`);
            displayConsoleOutput(`✓ Dataset "${filename}" cargado y listo para usar\n`, 'success');
            return true;
        } else {
            throw new Error('El archivo se escribió pero no se puede verificar');
        }
    } catch (error) {
        console.error(`✗ Error loading dataset ${filename}:`, error);
        displayConsoleOutput(`✗ ERROR: No se pudo cargar "${filename}"\n${error.message}\n\n⚠️ Asegúrate de que el archivo existe en la carpeta datasets/\n`, 'error');
        return false;
    }
}

// Load dataset into Pyodide filesystem (legacy function, kept for compatibility)
async function loadDatasetIntoPyodide(filename) {
    return await ensureDatasetLoaded(filename);
}

// Validate solution
async function validateSolution(code) {
    if (isSQLExercise()) {
        return await validateSQLSolution(code);
    } else {
        return await validatePythonSolution(code);
    }
}

// Validate Python solution
async function validatePythonSolution(code) {
    if (!pyodideInstance) {
        await initPyodide();
    }

    try {
        // Run user code + solution check
        const test = currentExercise.test;

        console.log('🧪 Validating Python solution...');
        console.log('📝 User code:', code);
        console.log('✅ Test condition:', test);

        // Execute user code
        await pyodideInstance.runPythonAsync(code);

        // Execute test - wrap in try/catch to get better error info
        let result;
        try {
            result = await pyodideInstance.runPythonAsync(test);
            console.log('📊 Test result:', result, 'Type:', typeof result);
        } catch (testError) {
            console.error('❌ Test execution failed:', testError);
            return false;
        }

        // Python True/False are converted to JavaScript true/false by Pyodide
        const isValid = result === true || result === 'True' || result === 1;

        console.log('🎯 Validation result:', isValid);

        if (isValid) {
            console.log('✅ Solution is CORRECT - will save progress');
        } else {
            console.log('❌ Solution is INCORRECT - will NOT save');
        }

        return isValid;
    } catch (error) {
        console.error('❌ Validation error:', error);
        displayConsoleOutput(`Error en validación: ${error.message}\n`, 'error');
        return false;
    }
}

// Validate SQL solution
async function validateSQLSolution(code) {
    if (!sqlDb) {
        await initSQL();
    }

    try {
        console.log('🧪 Validating SQL solution...');
        console.log('📝 User code:', code);

        // Execute the SQL query
        const result = sqlDb.exec(code);

        // For SQL exercises, we validate by checking if the query executed successfully
        // and optionally compare with expected solution
        if (result.length === 0) {
            console.log('⚠️ Query executed but returned no results');
            return true; // Still consider it valid if it runs without errors
        }

        // Basic validation: if query runs without error, it's considered correct
        // You can enhance this by comparing with expected results if available
        console.log('✅ SQL query executed successfully');
        console.log('📊 Result:', result[0]);

        return true;
    } catch (error) {
        console.error('❌ SQL validation error:', error);
        displayConsoleOutput(`Error en SQL: ${error.message}\n`, 'error');
        return false;
    }
}

// Display console output
function displayConsoleOutput(text, type = 'success') {
    const consoleElement = document.getElementById('console-output');

    // Clear placeholder
    const placeholder = consoleElement.querySelector('.console-placeholder');
    if (placeholder) {
        placeholder.remove();
    }

    const output = document.createElement('div');
    output.className = `console-${type}`;

    // Check if text contains HTML (for SQL table results)
    if (text.includes('<table')) {
        // Split text into parts (before table, table, after table)
        const parts = text.split(/(<table[\s\S]*?<\/table>)/);
        parts.forEach(part => {
            if (part.startsWith('<table')) {
                output.innerHTML += part;
            } else if (part.trim()) {
                const pre = document.createElement('pre');
                pre.textContent = part;
                output.appendChild(pre);
            }
        });
    } else {
        // Plain text output
        const pre = document.createElement('pre');
        pre.textContent = text;
        output.appendChild(pre);
    }

    consoleElement.appendChild(output);

    // Auto-scroll to bottom
    consoleElement.scrollTop = consoleElement.scrollHeight;
}

// Clear console
function clearConsole() {
    const console = document.getElementById('console-output');
    console.innerHTML = '<div class="console-placeholder">Ejecuta tu código para ver la salida aquí...</div>';
}

// Reset code
function resetCode() {
    if (confirm('¿Seguro que quieres resetear el código?')) {
        loadCode();
        clearConsole();
    }
}

// ========================================
// NAVIGATION
// ========================================

// Previous exercise
function previousExercise() {
    if (currentIndex > 0) {
        loadExercise(currentIndex - 1);
        closeSuccessModal();
    }
}

// Next exercise
function nextExercise() {
    if (currentIndex < allExercises.length - 1) {
        loadExercise(currentIndex + 1);
        closeSuccessModal();
    } else {
        // Completed all exercises
        showCompletionMessage();
    }
}

// Go to home
function goToHome() {
    if (confirm('¿Quieres volver al inicio? Tu progreso se guardará automáticamente.')) {
        window.location.href = 'index.html';
    }
}

// Show completion message
function showCompletionMessage() {
    const completed = allExercises.filter(ex => progressTracker.isLearnCompleted(ex.id)).length;
    const total = allExercises.length;

    alert(`🎉 ¡Felicitaciones! Has completado ${completed}/${total} ejercicios.\n\nTu progreso se ha guardado automáticamente.`);

    // Optionally redirect to home
    if (confirm('¿Quieres volver al inicio?')) {
        window.location.href = 'index.html';
    }
}

// ========================================
// DEBUG FUNCTIONS
// ========================================

// Test progress save manually
function testProgressSave() {
    console.log('\n🧪 ===== TESTING PROGRESS SAVE =====');

    // Check if progressTracker exists
    if (typeof progressTracker === 'undefined') {
        console.error('❌ progressTracker is NOT defined!');
        alert('ERROR: progressTracker no está definido. El script progress.js no se cargó correctamente.');
        return;
    }

    console.log('✅ progressTracker is defined');

    // Check current exercise
    if (!currentExercise) {
        console.error('❌ No exercise loaded');
        alert('ERROR: No hay ejercicio cargado');
        return;
    }

    console.log('✅ Current exercise:', currentExercise.id, '-', currentExercise.title);

    // Try to save progress manually
    try {
        console.log('💾 Attempting to save progress...');

        progressTracker.markLearnCompleted(currentExercise.id, {
            hintsUsed: hintsRevealed
        });

        console.log('✅ markLearnCompleted executed');

        // Check if it was actually saved
        const savedProgress = localStorage.getItem('de_practice_hub_progress');

        if (!savedProgress) {
            console.error('❌ localStorage is EMPTY!');
            alert('ERROR: localStorage está vacío. Verifica permisos del navegador.');
            return;
        }

        const parsed = JSON.parse(savedProgress);
        console.log('📦 Full progress object:', parsed);
        console.log('📚 learnProgress:', parsed.learnProgress);

        const isSaved = parsed.learnProgress[currentExercise.id];

        if (isSaved) {
            console.log('✅ ¡SUCCESS! Exercise is saved:', isSaved);
            alert(`✅ ¡Éxito!\n\nEjercicio guardado correctamente:\n\nID: ${currentExercise.id}\nGuardado: ${isSaved.completedAt}\nHints usados: ${isSaved.hintsUsed}`);
        } else {
            console.error('❌ Exercise NOT found in learnProgress');
            alert('❌ ERROR: El ejercicio NO se guardó en learnProgress');
        }

    } catch (error) {
        console.error('❌ Error during test:', error);
        alert(`❌ ERROR: ${error.message}`);
    }

    console.log('===== TEST COMPLETED =====\n');
}

// Check saved progress
function checkSavedProgress() {
    console.log('\n📊 ===== CHECKING SAVED PROGRESS =====');

    try {
        const savedProgress = localStorage.getItem('de_practice_hub_progress');

        if (!savedProgress) {
            console.log('⚠️ No progress saved yet');
            alert('⚠️ No hay progreso guardado aún.\n\nCompleta un ejercicio primero.');
            return;
        }

        const parsed = JSON.parse(savedProgress);

        console.log('📦 Full progress:', parsed);

        const learnCount = Object.keys(parsed.learnProgress || {}).length;
        const exerciseCount = Object.keys(parsed.completedExercises || {}).length;

        let message = `📊 PROGRESO GUARDADO:\n\n`;
        message += `✅ Ejercicios Learn completados: ${learnCount}\n`;
        message += `✅ Ejercicios Practice completados: ${exerciseCount}\n`;
        message += `\n📚 Learn Progress:\n`;

        for (const [id, data] of Object.entries(parsed.learnProgress || {})) {
            message += `  • ${id}: ${new Date(data.completedAt).toLocaleString()}\n`;
        }

        console.log(message);
        alert(message);

    } catch (error) {
        console.error('❌ Error reading progress:', error);
        alert(`❌ ERROR: ${error.message}`);
    }

    console.log('===== CHECK COMPLETED =====\n');
}

// ========================================
// MODALS
// ========================================

function showSuccessModal() {
    const modal = document.getElementById('success-modal');
    modal.style.display = 'flex';

    document.getElementById('success-message').textContent = currentExercise.successMessage || 'Has completado este ejercicio.';
}

function closeSuccessModal() {
    document.getElementById('success-modal').style.display = 'none';
}

function showLoadingModal() {
    document.getElementById('loading-modal').style.display = 'flex';
}

function hideLoadingModal() {
    document.getElementById('loading-modal').style.display = 'none';
}
