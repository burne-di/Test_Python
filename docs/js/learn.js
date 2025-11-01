// Learn Page - DataCamp Style Learning Experience

let currentExercise = null;
let currentStep = 1;
let editor = null;
let pyodideInstance = null;
let startTime = null;
let attemptCount = 0;
let hintsRevealed = 0;
let revealedHints = [];

// Initialize page
window.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const exerciseId = urlParams.get('id');

    if (!exerciseId) {
        alert('No se especificó ejercicio');
        window.location.href = 'index.html';
        return;
    }

    await loadExercise(exerciseId);
    initializeEditor();
    startTime = Date.now();
});

// Load exercise data
async function loadExercise(exerciseId) {
    try {
        const response = await fetch('ejercicios/learn_exercises.json');
        const data = await response.json();
        currentExercise = data.exercises.find(ex => ex.id === exerciseId);

        if (!currentExercise) {
            throw new Error('Exercise not found');
        }

        document.getElementById('exercise-title').textContent = currentExercise.title;
        loadTheoryStep();
    } catch (error) {
        console.error('Error loading exercise:', error);
        alert('Error cargando ejercicio');
    }
}

// ========================================
// STEP 1: THEORY
// ========================================

function loadTheoryStep() {
    const theory = currentExercise.theory;

    document.getElementById('theory-title').textContent = theory.concept;
    document.getElementById('theory-description').textContent = theory.description;

    // When to use
    const whenList = document.getElementById('theory-when-to-use');
    whenList.innerHTML = '';
    theory.whenToUse.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        whenList.appendChild(li);
    });

    // Syntax
    document.getElementById('theory-syntax').textContent = theory.syntax;

    // Syntax components
    if (theory.components) {
        const componentsDiv = document.getElementById('syntax-components');
        componentsDiv.innerHTML = '';

        Object.entries(theory.components).forEach(([name, desc]) => {
            const item = document.createElement('div');
            item.className = 'component-item';
            item.innerHTML = `
                <span class="component-name">${name}</span>
                <span class="component-desc">${desc}</span>
            `;
            componentsDiv.appendChild(item);
        });
    }

    // Performance note
    if (theory.performance) {
        document.getElementById('performance-note').style.display = 'flex';
        document.getElementById('performance-text').textContent = theory.performance;
    }
}

// ========================================
// STEP 2: EXAMPLES
// ========================================

function loadExamplesStep() {
    const examplesContent = document.getElementById('examples-content');
    examplesContent.innerHTML = '';

    currentExercise.examples.forEach((example, index) => {
        const card = document.createElement('div');
        card.className = 'example-card';
        card.innerHTML = `
            <div class="example-header">
                ${example.title}
            </div>
            <div class="example-body">
                <div class="example-code">
                    <pre>${escapeHtml(example.code)}</pre>
                </div>
                <div class="example-explanation">
                    <strong>Explicación:</strong>
                    <p>${example.explanation}</p>
                </div>
            </div>
        `;
        examplesContent.appendChild(card);
    });
}

// ========================================
// STEP 3: USE CASES
// ========================================

function loadUseCasesStep() {
    const useCasesContent = document.getElementById('use-cases-content');
    useCasesContent.innerHTML = '';

    currentExercise.useCases.forEach(useCase => {
        const card = document.createElement('div');
        card.className = 'use-case-card';
        card.innerHTML = `
            <div class="use-case-scenario">${useCase.scenario}</div>
            <div class="use-case-code">
                <pre>${escapeHtml(useCase.code)}</pre>
            </div>
        `;
        useCasesContent.appendChild(card);
    });
}

// ========================================
// STEP 4: PRACTICE
// ========================================

function loadPracticeStep() {
    const exercise = currentExercise.exercise;

    // Instruction
    document.getElementById('practice-instruction').textContent = exercise.instruction;

    // Hints setup
    hintsRevealed = 0;
    revealedHints = [];
    document.getElementById('hints-available').textContent = exercise.hints.length;
    document.getElementById('hints-list').innerHTML = '';

    // Test cases preview
    loadTestCasesPreview();

    // Set starter code in editor
    if (editor) {
        editor.setValue(exercise.starterCode);
    }
}

function loadTestCasesPreview() {
    const preview = document.getElementById('test-cases-preview');
    preview.innerHTML = '';

    currentExercise.exercise.testCases.forEach((testCase, index) => {
        const item = document.createElement('div');
        item.className = 'test-preview-item';
        item.id = `test-preview-${index}`;
        item.innerHTML = `
            <div class="test-status-icon" id="test-icon-${index}">-</div>
            <span>${testCase.description}</span>
        `;
        preview.appendChild(item);
    });
}

// Reveal hint
function revealHint() {
    const hints = currentExercise.exercise.hints;

    if (hintsRevealed >= hints.length) {
        return;
    }

    const hint = hints[hintsRevealed];
    const hintsList = document.getElementById('hints-list');

    const hintItem = document.createElement('div');
    hintItem.className = 'hint-item';
    hintItem.innerHTML = `
        <span class="hint-number">Pista ${hintsRevealed + 1}:</span>
        ${hint}
    `;
    hintsList.appendChild(hintItem);

    hintsRevealed++;
    revealedHints.push(hint);

    // Update available count
    const remaining = hints.length - hintsRevealed;
    document.getElementById('hints-available').textContent = remaining;

    // Disable button if no more hints
    if (hintsRevealed >= hints.length) {
        document.getElementById('btn-reveal-hint').disabled = true;
        document.getElementById('btn-reveal-hint').textContent = '✓ Todas las pistas reveladas';
    }
}

// ========================================
// STEP NAVIGATION
// ========================================

function nextStep() {
    // Hide current step
    document.getElementById(`step-${getStepName(currentStep)}`).style.display = 'none';

    // Increment step
    currentStep++;

    // Show next step
    const nextStepName = getStepName(currentStep);
    document.getElementById(`step-${nextStepName}`).style.display = 'block';

    // Load content for next step
    if (currentStep === 2) {
        loadExamplesStep();
    } else if (currentStep === 3) {
        loadUseCasesStep();
    } else if (currentStep === 4) {
        loadPracticeStep();
    }

    // Update progress bar
    updateProgress();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep() {
    // Hide current step
    document.getElementById(`step-${getStepName(currentStep)}`).style.display = 'none';

    // Decrement step
    currentStep--;

    // Show previous step
    const prevStepName = getStepName(currentStep);
    document.getElementById(`step-${prevStepName}`).style.display = 'block';

    // Update progress bar
    updateProgress();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getStepName(stepNumber) {
    const steps = ['theory', 'examples', 'use-cases', 'practice'];
    return steps[stepNumber - 1];
}

function updateProgress() {
    const progress = (currentStep / 4) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
    document.getElementById('progress-text').textContent = `Paso ${currentStep} de 4`;
}

// ========================================
// CODE EXECUTION
// ========================================

// Initialize Monaco Editor
function initializeEditor() {
    require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
    require(['vs/editor/editor.main'], function () {
        editor = monaco.editor.create(document.getElementById('code-editor'), {
            value: '',
            language: currentExercise.category === 'sql' ? 'sql' : 'python',
            theme: 'vs-dark',
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false
        });
    });
}

// Run code
async function runCode() {
    attemptCount++;
    showLoadingModal();

    try {
        const code = editor.getValue();
        let result;

        if (currentExercise.category === 'python' || currentExercise.subcategory === 'pandas') {
            result = await runPython(code);
        } else {
            throw new Error('Category not supported yet');
        }

        hideLoadingModal();
        displayOutput(result);
    } catch (error) {
        hideLoadingModal();
        displayError(error);
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
            output: stdout || 'Código ejecutado exitosamente',
            error: stderr
        };
    } catch (error) {
        throw new Error(`Python Error: ${error.message}`);
    }
}

// Initialize Pyodide
async function initPyodide() {
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

    // Load packages
    await pyodideInstance.loadPackage(['numpy', 'pandas']);
}

// Display output
function displayOutput(result) {
    switchOutputTab('output');
    const output = document.getElementById('output-content');
    output.innerHTML = `
        <div style="color: #10b981; margin-bottom: 1rem;">✓ Ejecución exitosa</div>
        <pre style="margin: 0; white-space: pre-wrap;">${escapeHtml(result.output)}</pre>
        ${result.error ? `<pre style="margin-top: 1rem; color: #f59e0b;">Warnings:\n${escapeHtml(result.error)}</pre>` : ''}
    `;
}

// Display error
function displayError(error) {
    switchOutputTab('output');
    const output = document.getElementById('output-content');
    output.innerHTML = `
        <div style="color: #ef4444; margin-bottom: 1rem;">✗ Error de ejecución</div>
        <pre style="margin: 0; color: #f87171;">${escapeHtml(error.message)}</pre>
    `;
}

// Submit and validate code
async function submitCode() {
    attemptCount++;
    showLoadingModal();

    try {
        const code = editor.getValue();
        const testResults = await validateSolution(code);

        hideLoadingModal();
        displayTestResults(testResults);

        // Check if all passed
        const allPassed = testResults.every(t => t.passed);
        if (allPassed) {
            setTimeout(() => showSuccessModal(), 500);
        }
    } catch (error) {
        hideLoadingModal();
        displayError(error);
    }
}

// Validate solution against test cases
async function validateSolution(code) {
    if (!pyodideInstance) {
        await initPyodide();
    }

    const testCases = currentExercise.exercise.testCases;
    const results = [];

    for (const [index, testCase] of testCases.entries()) {
        try {
            // Run user code + test
            const testCode = `
${code}

# Test case
test_input = ${testCase.input}
result = double_positives(test_input)
expected = ${testCase.expected}

# Check if result matches expected
result == expected
`;

            const passed = await pyodideInstance.runPythonAsync(testCode);

            results.push({
                index,
                description: testCase.description,
                passed: passed === true,
                expected: testCase.expected,
                input: testCase.input
            });

            // Update UI
            updateTestPreview(index, passed === true);

        } catch (error) {
            results.push({
                index,
                description: testCase.description,
                passed: false,
                error: error.message
            });

            updateTestPreview(index, false);
        }
    }

    return results;
}

// Update test preview icon
function updateTestPreview(index, passed) {
    const icon = document.getElementById(`test-icon-${index}`);
    if (passed) {
        icon.classList.add('passed');
        icon.textContent = '✓';
    } else {
        icon.classList.add('failed');
        icon.textContent = '✗';
    }
}

// Display test results in output
function displayTestResults(results) {
    switchOutputTab('tests');
    const output = document.getElementById('output-content');

    const passedCount = results.filter(r => r.passed).length;
    const totalCount = results.length;

    let html = `
        <div style="margin-bottom: 1.5rem;">
            <strong style="font-size: 1.1rem;">Resultados: ${passedCount}/${totalCount} tests pasaron</strong>
        </div>
    `;

    results.forEach(result => {
        const status = result.passed ? 'passed' : 'failed';
        const icon = result.passed ? '✓' : '✗';
        const color = result.passed ? '#10b981' : '#ef4444';

        html += `
            <div style="background: #f9fafb; padding: 1rem; border-radius: 6px; margin-bottom: 1rem; border-left: 4px solid ${color};">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                    <span style="color: ${color}; font-weight: bold;">${icon}</span>
                    <strong>${result.description}</strong>
                </div>
                ${result.error ? `<pre style="color: #ef4444; font-size: 0.875rem; margin-top: 0.5rem;">${escapeHtml(result.error)}</pre>` : ''}
            </div>
        `;
    });

    output.innerHTML = html;
}

// ========================================
// MODALS
// ========================================

function showSuccessModal() {
    const modal = document.getElementById('success-modal');
    modal.style.display = 'flex';

    // Calculate time
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    document.getElementById('completion-time').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    // Set attempts
    document.getElementById('attempts-count').textContent = attemptCount;

    // Set hints used
    document.getElementById('hints-used').textContent = hintsRevealed;
}

function closeSuccessModal() {
    document.getElementById('success-modal').style.display = 'none';
}

function goToNextExercise() {
    const nextExercises = currentExercise.nextExercises;
    if (nextExercises && nextExercises.length > 0) {
        window.location.href = `learn.html?id=${nextExercises[0]}`;
    } else {
        alert('¡Completaste todos los ejercicios de este módulo!');
        goBack();
    }
}

function showLoadingModal() {
    document.getElementById('loading-modal').style.display = 'flex';
}

function hideLoadingModal() {
    document.getElementById('loading-modal').style.display = 'none';
}

// ========================================
// UTILITIES
// ========================================

function switchOutputTab(tabName) {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    event?.target?.classList.add('active');
}

function resetCode() {
    if (confirm('¿Estás seguro de que quieres resetear el código?')) {
        editor.setValue(currentExercise.exercise.starterCode);
    }
}

function goBack() {
    if (confirm('¿Estás seguro de que quieres salir? Se perderá tu progreso.')) {
        window.location.href = 'index.html';
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
