// Data Engineering Practice Hub - Main Application

let allExercises = [];

// Load exercises on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadExercises();
    setupFilters();
    updateStats();
});

// Load exercises from JSON
async function loadExercises() {
    try {
        const response = await fetch('ejercicios/exercises.json');
        const data = await response.json();
        allExercises = data.exercises;
        displayExercises(allExercises);
    } catch (error) {
        console.error('Error loading exercises:', error);
        showError('No se pudieron cargar los ejercicios. Por favor recarga la página.');
    }
}

// Display exercises in grid
function displayExercises(exercises) {
    const container = document.getElementById('exercises-container');

    if (exercises.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No se encontraron ejercicios con estos filtros.</p>';
        return;
    }

    container.innerHTML = exercises.map(exercise => `
        <div class="exercise-card" onclick="openExercise('${exercise.id}')">
            <div class="exercise-card-header">
                <span class="exercise-category category-${exercise.category}">
                    ${exercise.category.toUpperCase()}
                </span>
                <span class="difficulty-badge difficulty-${exercise.difficulty}">
                    ${exercise.difficulty === 'ssr' ? 'SSR' : 'Senior'}
                </span>
            </div>
            <h3>${exercise.title}</h3>
            <p>${exercise.description}</p>
            <div class="exercise-meta">
                <span>⏱️ ${exercise.timeLimit} min</span>
                <span>📊 ${exercise.testCases.length} tests</span>
            </div>
        </div>
    `).join('');
}

// Setup filter listeners
function setupFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const difficultyFilter = document.getElementById('difficulty-filter');

    categoryFilter.addEventListener('change', applyFilters);
    difficultyFilter.addEventListener('change', applyFilters);
}

// Apply filters
function applyFilters() {
    const category = document.getElementById('category-filter').value;
    const difficulty = document.getElementById('difficulty-filter').value;

    let filtered = allExercises;

    if (category !== 'all') {
        filtered = filtered.filter(ex => ex.category === category);
    }

    if (difficulty !== 'all') {
        filtered = filtered.filter(ex => ex.difficulty === difficulty);
    }

    displayExercises(filtered);
}

// Update statistics
function updateStats() {
    const sqlCount = allExercises.filter(ex => ex.category === 'sql').length;
    const pythonCount = allExercises.filter(ex => ex.category === 'python').length;
    const pysparkCount = allExercises.filter(ex => ex.category === 'pyspark').length;

    document.getElementById('sql-count').textContent = sqlCount;
    document.getElementById('python-count').textContent = pythonCount;
    document.getElementById('pyspark-count').textContent = pysparkCount;
}

// Open exercise in solve page
function openExercise(exerciseId) {
    window.location.href = `solve.html?id=${exerciseId}`;
}

// Show error message
function showError(message) {
    const container = document.getElementById('exercises-container');
    container.innerHTML = `
        <div style="background: #fee2e2; color: #991b1b; padding: 1rem; border-radius: 8px; text-align: center;">
            <strong>Error:</strong> ${message}
        </div>
    `;
}
