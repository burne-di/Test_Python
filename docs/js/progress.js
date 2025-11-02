// Progress Tracking System with localStorage
// Tracks completed exercises, learning progress, and statistics

class ProgressTracker {
    constructor() {
        this.STORAGE_KEY = 'de_practice_hub_progress';
        this.progress = this.loadProgress();
    }

    // Load progress from localStorage
    loadProgress() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error loading progress:', error);
        }

        // Default structure
        return {
            completedExercises: {}, // { exerciseId: { completedAt, timeSpent, hintsUsed } }
            learnProgress: {},       // { exerciseId: { completedAt, hintsUsed } }
            stats: {
                totalCompleted: 0,
                totalTimeSpent: 0,
                lastActivity: null
            }
        };
    }

    // Save progress to localStorage
    saveProgress() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.progress));
            console.log('✓ Progress saved successfully');
        } catch (error) {
            console.error('✗ Error saving progress:', error);
        }
    }

    // Mark exercise as completed
    markExerciseCompleted(exerciseId, data = {}) {
        const completionData = {
            completedAt: new Date().toISOString(),
            timeSpent: data.timeSpent || 0,
            hintsUsed: data.hintsUsed || 0,
            testsPassed: data.testsPassed || 0
        };

        this.progress.completedExercises[exerciseId] = completionData;
        this.progress.stats.totalCompleted = Object.keys(this.progress.completedExercises).length;
        this.progress.stats.totalTimeSpent += completionData.timeSpent;
        this.progress.stats.lastActivity = new Date().toISOString();

        this.saveProgress();
        console.log(`✓ Exercise ${exerciseId} marked as completed`);
    }

    // Mark learning exercise as completed
    markLearnCompleted(exerciseId, data = {}) {
        const completionData = {
            completedAt: new Date().toISOString(),
            hintsUsed: data.hintsUsed || 0
        };

        this.progress.learnProgress[exerciseId] = completionData;
        this.progress.stats.lastActivity = new Date().toISOString();

        this.saveProgress();
        console.log(`✓ Learn exercise ${exerciseId} marked as completed`);
    }

    // Check if exercise is completed
    isExerciseCompleted(exerciseId) {
        return !!this.progress.completedExercises[exerciseId];
    }

    // Check if learn exercise is completed
    isLearnCompleted(exerciseId) {
        return !!this.progress.learnProgress[exerciseId];
    }

    // Get completion data for an exercise
    getExerciseCompletion(exerciseId) {
        return this.progress.completedExercises[exerciseId] || null;
    }

    // Get completion percentage for a category
    getCategoryProgress(allExercises, category) {
        const categoryExercises = allExercises.filter(ex => ex.category === category);
        const completed = categoryExercises.filter(ex => this.isExerciseCompleted(ex.id));

        return {
            total: categoryExercises.length,
            completed: completed.length,
            percentage: categoryExercises.length > 0
                ? Math.round((completed.length / categoryExercises.length) * 100)
                : 0
        };
    }

    // Get overall progress
    getOverallProgress(allExercises) {
        const total = allExercises.length;
        const completed = allExercises.filter(ex => this.isExerciseCompleted(ex.id)).length;

        return {
            total,
            completed,
            percentage: total > 0 ? Math.round((completed / total) * 100) : 0
        };
    }

    // Get learn progress
    getLearnProgress(allLearnExercises) {
        const total = allLearnExercises.length;
        const completed = allLearnExercises.filter(ex => this.isLearnCompleted(ex.id)).length;

        return {
            total,
            completed,
            percentage: total > 0 ? Math.round((completed / total) * 100) : 0
        };
    }

    // Get statistics
    getStats() {
        return {
            ...this.progress.stats,
            averageTimePerExercise: this.progress.stats.totalCompleted > 0
                ? Math.round(this.progress.stats.totalTimeSpent / this.progress.stats.totalCompleted)
                : 0
        };
    }

    // Reset progress (with confirmation)
    resetProgress() {
        if (confirm('¿Estás seguro de que quieres resetear todo tu progreso? Esta acción no se puede deshacer.')) {
            this.progress = {
                completedExercises: {},
                learnProgress: {},
                stats: {
                    totalCompleted: 0,
                    totalTimeSpent: 0,
                    lastActivity: null
                }
            };
            this.saveProgress();
            console.log('✓ Progress reset successfully');
            return true;
        }
        return false;
    }

    // Export progress as JSON
    exportProgress() {
        const dataStr = JSON.stringify(this.progress, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `de-hub-progress-${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        URL.revokeObjectURL(url);
        console.log('✓ Progress exported successfully');
    }

    // Import progress from JSON
    importProgress(jsonData) {
        try {
            const imported = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

            if (imported.completedExercises && imported.stats) {
                this.progress = imported;
                this.saveProgress();
                console.log('✓ Progress imported successfully');
                return true;
            } else {
                throw new Error('Invalid progress format');
            }
        } catch (error) {
            console.error('✗ Error importing progress:', error);
            alert('Error al importar el progreso. Verifica que el archivo sea válido.');
            return false;
        }
    }
}

// Initialize global progress tracker
const progressTracker = new ProgressTracker();
