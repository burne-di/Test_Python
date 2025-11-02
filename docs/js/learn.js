// Learn Page - DataCamp Style

let currentExercise = null;
let allExercises = [];
let currentIndex = 0;
let editor = null;
let pyodideInstance = null;
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

// Load exercise
function loadExercise(index) {
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

    // Load content
    loadInstruction();
    loadTheory();
    loadExample();
    loadHints();
    loadCode();
    clearConsole();
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
        editor = monaco.editor.create(document.getElementById('code-editor'), {
            value: '',
            language: 'python',
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
        const result = await runPython(code);

        hideLoadingModal();
        displayConsoleOutput(result.output, 'success');

        if (result.error) {
            displayConsoleOutput(`\nWarnings:\n${result.error}`, 'error');
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
        const isCorrect = await validateSolution(code);

        hideLoadingModal();

        if (isCorrect) {
            // Mark as completed in progress tracker
            progressTracker.markLearnCompleted(currentExercise.id, {
                hintsUsed: hintsRevealed
            });

            displayConsoleOutput('✅ ¡Solución correcta! Progreso guardado.', 'success');
            setTimeout(() => showSuccessModal(), 500);
        } else {
            displayConsoleOutput('❌ Solución incorrecta. Revisa tu código e intenta de nuevo.', 'error');
        }
    } catch (error) {
        hideLoadingModal();
        displayConsoleOutput(`Error en validación: ${error.message}`, 'error');
    }
}

// Run Python code
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

// Validate solution
async function validateSolution(code) {
    if (!pyodideInstance) {
        await initPyodide();
    }

    try {
        // Run user code + solution check
        const solution = currentExercise.solution;
        const test = currentExercise.test;

        // Execute user code
        await pyodideInstance.runPythonAsync(code);

        // Execute test
        const result = await pyodideInstance.runPythonAsync(test);

        return result === true;
    } catch (error) {
        console.error('Validation error:', error);
        return false;
    }
}

// Display console output
function displayConsoleOutput(text, type = 'success') {
    const console = document.getElementById('console-output');

    // Clear placeholder
    const placeholder = console.querySelector('.console-placeholder');
    if (placeholder) {
        placeholder.remove();
    }

    const output = document.createElement('pre');
    output.className = `console-${type}`;
    output.textContent = text;
    console.appendChild(output);

    // Auto-scroll to bottom
    console.scrollTop = console.scrollHeight;
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
