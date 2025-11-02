// Courses Page - Main Logic

let coursesData = null;
let currentFilter = 'all';
let selectedCourse = null;
let selectedCategory = null;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadCoursesData();
    updateProgressStats();
    displayCategories();
    setupFilters();
});

// Load courses data from JSON
async function loadCoursesData() {
    try {
        const response = await fetch('courses.json');
        const data = await response.json();
        coursesData = data;
        console.log('✓ Courses data loaded:', coursesData);
    } catch (error) {
        console.error('Error loading courses:', error);
        alert('Error cargando los cursos. Por favor recarga la página.');
    }
}

// Update progress stats
function updateProgressStats() {
    const progress = progressTracker.progress;

    // Count completed lessons
    const learnProgress = progress.learnProgress || {};
    const completedLessons = Object.keys(learnProgress).length;

    // Count unique courses started (based on exercise IDs)
    const coursesStarted = countCoursesStarted(learnProgress);

    // Estimate hours (assuming 10 min per lesson average)
    const estimatedMinutes = completedLessons * 10;
    const hours = Math.floor(estimatedMinutes / 60);
    const minutes = estimatedMinutes % 60;
    const hoursDisplay = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

    document.getElementById('total-lessons-completed').textContent = completedLessons;
    document.getElementById('total-courses-started').textContent = coursesStarted;
    document.getElementById('total-hours-learned').textContent = hoursDisplay;
}

// Count how many courses have at least one lesson completed
function countCoursesStarted(learnProgress) {
    if (!coursesData) return 0;

    const completedExerciseIds = Object.keys(learnProgress);
    const coursesWithProgress = new Set();

    coursesData.categories.forEach(category => {
        category.courses.forEach(course => {
            const hasProgress = course.exerciseIds.some(id => completedExerciseIds.includes(id));
            if (hasProgress) {
                coursesWithProgress.add(course.id);
            }
        });
    });

    return coursesWithProgress.size;
}

// Setup filter buttons
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Apply filter
            currentFilter = btn.dataset.filter;
            displayCategories();
        });
    });
}

// Display categories
function displayCategories() {
    if (!coursesData) return;

    const container = document.getElementById('categories-container');
    const learnProgress = progressTracker.progress.learnProgress || {};

    let categoriesToShow = coursesData.categories;

    // Apply filter
    if (currentFilter !== 'all') {
        categoriesToShow = coursesData.categories.map(category => {
            const filteredCourses = category.courses.filter(course => {
                if (currentFilter === 'coming-soon') {
                    return course.comingSoon === true;
                } else if (currentFilter === 'active') {
                    const hasProgress = course.exerciseIds.some(id => learnProgress[id]);
                    const isNotComplete = !isCourseComplete(course, learnProgress);
                    return hasProgress && isNotComplete;
                } else if (currentFilter === 'completed') {
                    return isCourseComplete(course, learnProgress);
                }
                return true;
            });

            return { ...category, courses: filteredCourses };
        }).filter(category => category.courses.length > 0);
    }

    container.innerHTML = categoriesToShow.map(category => {
        const totalCourses = category.courses.length;
        const completedCourses = category.courses.filter(course => isCourseComplete(course, learnProgress)).length;
        const totalLessons = category.courses.reduce((sum, course) => sum + course.lessons, 0);

        return `
            <div class="category-card" style="border-left: 4px solid ${category.color}">
                <div class="category-header">
                    <div class="category-icon" style="background: ${category.color}; color: white;">
                        ${category.icon}
                    </div>
                    <div class="category-info">
                        <h3>${category.name}</h3>
                        <p>${category.description}</p>
                    </div>
                </div>

                <div class="category-stats">
                    <div class="category-stat">
                        <span>📚</span>
                        <span>${totalCourses} cursos</span>
                    </div>
                    <div class="category-stat">
                        <span>📖</span>
                        <span>${totalLessons} lecciones</span>
                    </div>
                    <div class="category-stat">
                        <span>✅</span>
                        <span>${completedCourses}/${totalCourses} completados</span>
                    </div>
                </div>

                <div class="courses-grid">
                    ${category.courses.map(course => renderCourseCard(course, category, learnProgress)).join('')}
                </div>
            </div>
        `;
    }).join('');
}

// Render individual course card
function renderCourseCard(course, category, learnProgress) {
    const progress = calculateCourseProgress(course, learnProgress);
    const isComingSoon = course.comingSoon === true;

    const difficultyClass = `difficulty-${course.difficulty}`;
    const difficultyText = {
        'beginner': 'Principiante',
        'intermediate': 'Intermedio',
        'advanced': 'Avanzado'
    }[course.difficulty] || course.difficulty;

    return `
        <div class="course-card ${isComingSoon ? 'coming-soon' : ''}"
             onclick="${isComingSoon ? '' : `openCourseModal('${category.id}', '${course.id}')`}">

            <div class="course-title">${course.title}</div>
            <div class="course-description">${course.description}</div>

            <div class="course-meta">
                <span>
                    <span class="difficulty-badge ${difficultyClass}">${difficultyText}</span>
                </span>
                <span>📖 ${course.lessons} lecciones</span>
                <span>⏱️ ${course.duration}</span>
            </div>

            ${!isComingSoon ? `
                <div class="course-progress-bar">
                    <div class="course-progress-fill" style="width: ${progress}%"></div>
                </div>
                <div style="text-align: right; font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.5rem;">
                    ${progress}% completado
                </div>
            ` : ''}
        </div>
    `;
}

// Calculate course progress percentage
function calculateCourseProgress(course, learnProgress) {
    if (!course.exerciseIds || course.exerciseIds.length === 0) return 0;

    const completed = course.exerciseIds.filter(id => learnProgress[id]).length;
    return Math.round((completed / course.exerciseIds.length) * 100);
}

// Check if course is complete
function isCourseComplete(course, learnProgress) {
    if (!course.exerciseIds || course.exerciseIds.length === 0) return false;
    return course.exerciseIds.every(id => learnProgress[id]);
}

// Open course modal
function openCourseModal(categoryId, courseId) {
    selectedCategory = coursesData.categories.find(c => c.id === categoryId);
    selectedCourse = selectedCategory.courses.find(c => c.id === courseId);

    if (!selectedCourse) return;

    const learnProgress = progressTracker.progress.learnProgress || {};
    const progress = calculateCourseProgress(selectedCourse, learnProgress);

    // Update modal content
    document.getElementById('modal-course-icon').textContent = selectedCategory.icon;
    document.getElementById('modal-course-icon').style.background = selectedCategory.color;
    document.getElementById('modal-course-title').textContent = selectedCourse.title;
    document.getElementById('modal-course-description').textContent = selectedCourse.description;
    document.getElementById('modal-lessons-count').textContent = selectedCourse.lessons;
    document.getElementById('modal-duration').textContent = selectedCourse.duration;
    document.getElementById('modal-difficulty').textContent = selectedCourse.difficulty;
    document.getElementById('modal-progress').textContent = `${progress}%`;
    document.getElementById('modal-progress-bar').style.width = `${progress}%`;

    // Load lessons list
    loadLessonsList(selectedCourse, learnProgress);

    // Update continue button
    const continueBtn = document.getElementById('continue-course-btn');
    if (progress === 100) {
        continueBtn.textContent = '✓ Curso Completado';
        continueBtn.disabled = true;
        continueBtn.style.opacity = '0.6';
    } else {
        continueBtn.textContent = progress === 0 ? 'Comenzar Curso' : 'Continuar Curso';
        continueBtn.disabled = false;
        continueBtn.style.opacity = '1';
    }

    // Show modal
    document.getElementById('course-modal').style.display = 'flex';
}

// Load lessons list in modal
async function loadLessonsList(course, learnProgress) {
    const container = document.getElementById('modal-lessons-list');

    if (!course.exerciseIds || course.exerciseIds.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No hay lecciones disponibles aún.</p>';
        return;
    }

    // Load exercises data to get titles
    try {
        const response = await fetch('ejercicios/learn_exercises.json');
        const data = await response.json();
        const exercises = data.exercises;

        const lessonsHTML = course.exerciseIds.map((id, index) => {
            const exercise = exercises.find(ex => ex.id === id);
            const isCompleted = learnProgress[id];

            if (!exercise) {
                return `
                    <div class="lesson-item">
                        <div class="lesson-icon">${index + 1}</div>
                        <div class="lesson-info">
                            <div class="lesson-title">Lección ${index + 1}</div>
                            <div class="lesson-description">${id}</div>
                        </div>
                    </div>
                `;
            }

            return `
                <div class="lesson-item ${isCompleted ? 'completed' : ''}"
                     onclick="openLesson('${id}')">
                    <div class="lesson-icon">
                        ${isCompleted ? '✓' : (index + 1)}
                    </div>
                    <div class="lesson-info">
                        <div class="lesson-title">${exercise.title}</div>
                        <div class="lesson-description">${exercise.instruction.substring(0, 80)}...</div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = lessonsHTML;

    } catch (error) {
        console.error('Error loading lessons:', error);
        container.innerHTML = '<p style="color: red;">Error cargando lecciones</p>';
    }
}

// Continue course (go to first incomplete lesson)
function continueCourse() {
    if (!selectedCourse) return;

    const learnProgress = progressTracker.progress.learnProgress || {};

    // Find first incomplete lesson
    const firstIncomplete = selectedCourse.exerciseIds.find(id => !learnProgress[id]);

    if (firstIncomplete) {
        openLesson(firstIncomplete);
    } else {
        // Course is complete, go to first lesson
        openLesson(selectedCourse.exerciseIds[0]);
    }
}

// Open a specific lesson
function openLesson(exerciseId) {
    window.location.href = `learn.html?id=${exerciseId}`;
}

// Close course modal
function closeCourseModal() {
    document.getElementById('course-modal').style.display = 'none';
    selectedCourse = null;
    selectedCategory = null;
}
