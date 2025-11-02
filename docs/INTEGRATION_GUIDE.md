# Guía de Integración Cloud con la Plataforma

Cómo integrar Databricks y Google Colab con tu plataforma existente.

---

## 🎯 Objetivo

Permitir que usuarios ejecuten ejercicios PySpark/Airflow en la nube **sin salir de tu plataforma**.

---

## 📋 Checklist de Setup

### ✅ Paso 1: Generar Notebooks (5 min)

```bash
# En tu terminal
cd "D:\Users\One Drive\OneDrive - Universidad Tecnologica del Peru\TEST APP\Test_Python"

# Instalar dependencia
pip install nbformat

# Generar notebooks
python generate_colab_notebooks.py
```

**Resultado:**
```
docs/colab_notebooks/
├── learn_030.ipynb
├── learn_031.ipynb
├── learn_032.ipynb
...
```

### ✅ Paso 2: Subir a Google Drive (10 min)

1. Abre https://drive.google.com
2. Crea carpeta "PySpark_Exercises"
3. Sube todos los archivos .ipynb
4. Para cada archivo:
   - Click derecho → Share
   - Cambia a "Anyone with the link can view"
   - Copia el link compartido

**URL ejemplo:**
```
https://drive.google.com/file/d/1ABC...XYZ/view?usp=sharing
```

**Convertir a URL de Colab:**
```
https://colab.research.google.com/drive/1ABC...XYZ
```

### ✅ Paso 3: Actualizar courses.json (5 min)

```json
{
  "id": "pyspark-basics",
  "title": "PySpark Basics",
  "description": "Schema, Select, WithColumn...",
  "exerciseIds": ["learn_030", "learn_031", "learn_032"],
  "cloudExecution": {
    "enabled": true,
    "providers": ["databricks", "colab"]
  }
}
```

### ✅ Paso 4: Actualizar learn_exercises.json (5 min)

```json
{
  "id": "learn_030",
  "title": "PySpark - Crear DataFrame con Schema",
  "instruction": "Define un schema explícito...",
  "theory": "...",
  "cloudExecution": {
    "required": true,
    "providers": {
      "colab": {
        "url": "https://colab.research.google.com/drive/1ABC...",
        "openInNewTab": true
      },
      "databricks": {
        "importUrl": "https://github.com/tu-usuario/databricks-notebooks/learn_030.py",
        "instructions": "Import this notebook to your Databricks workspace"
      }
    }
  }
}
```

### ✅ Paso 5: Modificar learn.js (15 min)

Agregar al final de `learn.js`:

```javascript
// ========================================
// CLOUD EXECUTION
// ========================================

function loadExercise(index) {
    // ... código existente ...

    // Verificar si requiere ejecución en la nube
    if (currentExercise.cloudExecution?.required) {
        displayCloudExecutionOptions();
    }
}

function displayCloudExecutionOptions() {
    const container = document.getElementById('code-editor-container');
    const providers = currentExercise.cloudExecution.providers;

    let html = `
        <div class="cloud-execution-panel">
            <div class="cloud-header">
                <h2>☁️ Ejecución en la Nube</h2>
                <p>Este ejercicio requiere un entorno Spark. Elige una opción gratuita:</p>
            </div>

            <div class="cloud-providers">
    `;

    // Opción Google Colab
    if (providers.colab) {
        html += `
            <div class="provider-card colab-card">
                <div class="provider-header">
                    <img src="https://colab.research.google.com/img/colab_favicon_256px.png"
                         width="40" alt="Colab">
                    <h3>Google Colab</h3>
                    <span class="badge-free">100% Gratis</span>
                </div>

                <div class="provider-features">
                    <div class="feature">✅ Instalación automática de PySpark</div>
                    <div class="feature">✅ No requiere configuración</div>
                    <div class="feature">✅ GPU/TPU disponibles</div>
                    <div class="feature">⚡ Listo en 30 segundos</div>
                </div>

                <div class="provider-stats">
                    <div class="stat">
                        <strong>Dificultad:</strong> ⭐ Muy Fácil
                    </div>
                    <div class="stat">
                        <strong>Recursos:</strong> 12GB RAM
                    </div>
                </div>

                <a href="${providers.colab.url}"
                   target="_blank"
                   class="btn-provider btn-colab"
                   onclick="trackCloudExecution('colab', '${currentExercise.id}')">
                    <img src="https://colab.research.google.com/assets/colab-badge.svg">
                    Abrir en Google Colab
                </a>

                <div class="provider-note">
                    <strong>💡 Recomendado para principiantes</strong>
                </div>
            </div>
        `;
    }

    // Opción Databricks
    if (providers.databricks) {
        html += `
            <div class="provider-card databricks-card">
                <div class="provider-header">
                    <img src="https://www.databricks.com/wp-content/uploads/2021/06/db-nav-logo.svg"
                         width="40" alt="Databricks">
                    <h3>Databricks Community</h3>
                    <span class="badge-free">100% Gratis</span>
                </div>

                <div class="provider-features">
                    <div class="feature">✅ Cluster Spark real (15GB)</div>
                    <div class="feature">✅ Entorno profesional</div>
                    <div class="feature">✅ Notebooks colaborativos</div>
                    <div class="feature">⚠️ Requiere registro (una vez)</div>
                </div>

                <div class="provider-stats">
                    <div class="stat">
                        <strong>Dificultad:</strong> ⭐⭐ Fácil
                    </div>
                    <div class="stat">
                        <strong>Recursos:</strong> 15GB RAM + Cluster
                    </div>
                </div>

                <div class="databricks-instructions">
                    <details>
                        <summary><strong>📖 Instrucciones (Primera vez)</strong></summary>
                        <ol>
                            <li>Crea cuenta gratis en
                                <a href="https://community.cloud.databricks.com" target="_blank">
                                    Databricks Community
                                </a>
                            </li>
                            <li>Inicia tu cluster (botón "Create Cluster")</li>
                            <li>Importa el notebook usando el botón de abajo</li>
                        </ol>
                    </details>
                </div>

                <button class="btn-provider btn-databricks"
                        onclick="openDatabricksImport('${providers.databricks.importUrl}')">
                    📊 Importar a Databricks
                </button>

                <div class="provider-note">
                    <strong>💼 Recomendado para proyectos reales</strong>
                </div>
            </div>
        `;
    }

    html += `
            </div>

            <!-- Teoría y ejemplos siguen disponibles -->
            <div class="cloud-theory-section">
                <h3>📖 Teoría del Ejercicio</h3>
                <div class="theory-content">
                    ${currentExercise.theory || 'Teoría no disponible'}
                </div>

                <h3>💡 Ejemplo de Referencia</h3>
                <pre><code class="language-python">${currentExercise.example?.code || ''}</code></pre>
                <p>${currentExercise.example?.explanation || ''}</p>

                <h3>🎯 Instrucciones</h3>
                <p>${currentExercise.instruction}</p>
            </div>

            <!-- Progreso manual (hasta integrar API) -->
            <div class="manual-completion">
                <h3>✅ Completar Ejercicio</h3>
                <p>Una vez que completes el ejercicio en la plataforma cloud:</p>
                <button onclick="markCloudExerciseComplete()"
                        class="btn-complete-cloud">
                    ✓ Marcar como Completado
                </button>
            </div>
        </div>
    `;

    container.innerHTML = html;

    // Aplicar syntax highlighting si existe Prism/Highlight.js
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }
}

function openDatabricksImport(githubUrl) {
    // Databricks puede importar directamente desde GitHub
    const databricksImportUrl = `https://community.cloud.databricks.com/#import/${encodeURIComponent(githubUrl)}`;

    // Mostrar instrucciones
    alert(`
📋 Pasos para importar:

1. Se abrirá Databricks en una nueva pestaña
2. Haz login si es necesario
3. El notebook se importará automáticamente
4. Ejecuta las celdas del notebook

¿Listo? Haz click en OK para continuar.
    `);

    window.open(databricksImportUrl, '_blank');

    trackCloudExecution('databricks', currentExercise.id);
}

function trackCloudExecution(provider, exerciseId) {
    console.log(`📊 Cloud execution: ${provider} - ${exerciseId}`);

    // Guardar en analytics (si existe)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'cloud_execution', {
            'provider': provider,
            'exercise_id': exerciseId
        });
    }

    // Guardar en localStorage
    const cloudExecutions = JSON.parse(localStorage.getItem('cloud_executions') || '[]');
    cloudExecutions.push({
        provider,
        exerciseId,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('cloud_executions', JSON.stringify(cloudExecutions));
}

function markCloudExerciseComplete() {
    if (!currentExercise) return;

    const confirmed = confirm(`
¿Completaste el ejercicio "${currentExercise.title}" en la nube?

Marca solo si:
✅ Ejecutaste todo el código
✅ Pasaron las validaciones
✅ Entendiste el concepto

¿Marcar como completado?
    `);

    if (confirmed) {
        // Usar el sistema de progreso existente
        if (typeof progressTracker !== 'undefined') {
            progressTracker.markLearnCompleted(currentExercise.id, {
                completedInCloud: true,
                timestamp: new Date().toISOString()
            });

            displayConsoleOutput('✅ Ejercicio marcado como completado!', 'success');

            // Confetti o animación de éxito (si tienes librería)
            showSuccessModal();
        }
    }
}
```

### ✅ Paso 6: Agregar Estilos CSS (5 min)

Agregar a `styles.css`:

```css
/* Cloud Execution Panel */
.cloud-execution-panel {
    background: var(--card-bg);
    padding: 2rem;
    border-radius: 12px;
}

.cloud-header {
    text-align: center;
    margin-bottom: 2rem;
}

.cloud-header h2 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

.cloud-providers {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
}

.provider-card {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    border: 2px solid #cbd5e1;
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.3s ease;
}

.provider-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.colab-card {
    border-left: 4px solid #f59e0b;
}

.databricks-card {
    border-left: 4px solid #ef4444;
}

.provider-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
}

.provider-header img {
    width: 40px;
    height: 40px;
    object-fit: contain;
}

.provider-header h3 {
    flex: 1;
    margin: 0;
}

.badge-free {
    background: #10b981;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
}

.provider-features {
    margin: 1rem 0;
}

.feature {
    padding: 0.5rem 0;
    font-size: 0.9rem;
    border-bottom: 1px solid #e2e8f0;
}

.provider-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin: 1rem 0;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 8px;
}

.stat {
    font-size: 0.85rem;
}

.btn-provider {
    display: block;
    width: 100%;
    padding: 1rem;
    text-align: center;
    border-radius: 8px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    margin-top: 1rem;
}

.btn-colab {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: white;
}

.btn-databricks {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    border: none;
    cursor: pointer;
}

.btn-provider:hover {
    transform: scale(1.02);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.provider-note {
    margin-top: 1rem;
    padding: 0.75rem;
    background: rgba(59, 130, 246, 0.1);
    border-left: 3px solid #3b82f6;
    border-radius: 4px;
    font-size: 0.85rem;
}

.databricks-instructions {
    margin: 1rem 0;
    font-size: 0.85rem;
}

.databricks-instructions summary {
    cursor: pointer;
    padding: 0.5rem;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
}

.databricks-instructions ol {
    margin: 1rem 0 0 1.5rem;
}

.cloud-theory-section {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    margin-top: 2rem;
}

.cloud-theory-section h3 {
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    color: var(--text-primary);
}

.theory-content {
    background: #f8fafc;
    padding: 1rem;
    border-left: 4px solid var(--primary-color);
    border-radius: 4px;
    margin-bottom: 1rem;
}

.manual-completion {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    margin-top: 2rem;
}

.btn-complete-cloud {
    background: white;
    color: #10b981;
    border: none;
    padding: 1rem 2rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    margin-top: 1rem;
    transition: all 0.3s ease;
}

.btn-complete-cloud:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}
```

---

## 🧪 Testing

### Test 1: Verificar Generación de Notebooks

```bash
python generate_colab_notebooks.py
```

**Esperado:** 10+ archivos .ipynb creados

### Test 2: Abrir Notebook en Colab

1. Sube un notebook a Drive
2. Abre en Colab
3. Ejecuta todas las celdas
4. Verifica que PySpark se instale correctamente

### Test 3: Integración Web

1. Abre `learn.html?id=learn_030`
2. Deberías ver el panel de cloud execution
3. Click en "Abrir en Google Colab"
4. Verifica que abre el notebook correcto

---

## 📊 Analytics (Opcional)

Puedes trackear qué tan usado es cada método:

```javascript
// Ver estadísticas
const cloudExecutions = JSON.parse(localStorage.getItem('cloud_executions') || '[]');

// Agrupar por provider
const byProvider = cloudExecutions.reduce((acc, exec) => {
    acc[exec.provider] = (acc[exec.provider] || 0) + 1;
    return acc;
}, {});

console.log('Cloud execution stats:', byProvider);
// { colab: 45, databricks: 12 }
```

---

## 🔄 Workflow del Usuario

```
1. Usuario entra a ejercicio PySpark
   ↓
2. Ve panel con 2 opciones (Colab + Databricks)
   ↓
3. Elige una (ej. Colab por ser más fácil)
   ↓
4. Se abre Colab en nueva pestaña
   ↓
5. Ejecuta el notebook paso a paso
   ↓
6. Completa el ejercicio
   ↓
7. Vuelve a tu plataforma
   ↓
8. Marca como completado
   ↓
9. Progreso guardado ✅
```

---

## 💰 Costos

| Componente | Costo |
|-----------|-------|
| Google Colab | $0/mes |
| Databricks Community | $0/mes |
| GitHub Pages (hosting) | $0/mes |
| **TOTAL** | **$0/mes** 🎉 |

---

## 🚀 Siguientes Pasos

1. Ejecuta `generate_colab_notebooks.py`
2. Sube notebooks a Google Drive
3. Actualiza `learn_exercises.json` con URLs
4. Modifica `learn.js` con el código de arriba
5. Prueba con un ejercicio
6. ¡Listo!

---

**Tiempo total de setup: ~1 hora**
**Costo: $0**
**Resultado: PySpark + Airflow funcionales en la nube** ✅
