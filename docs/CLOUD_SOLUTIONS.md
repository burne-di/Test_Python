# Soluciones Cloud para PySpark y Airflow

Guía completa de opciones para ejecutar PySpark y Airflow sin necesidad de infraestructura local.

---

## 📊 Comparación Rápida

| Solución | Costo | PySpark | Airflow | Integración Web | Dificultad |
|----------|-------|---------|---------|-----------------|------------|
| **Google Colab** | 🆓 Gratis | ✅ Sí | ⚠️ Limitado | ⭐⭐⭐ Fácil | Fácil |
| **Databricks Community** | 🆓 Gratis | ✅ Sí | ❌ No | ⭐⭐ Media | Media |
| **GCP Free Tier** | 💰 $300 créditos | ✅ Sí | ✅ Sí | ⭐⭐⭐ Fácil | Media |
| **AWS Free Tier** | 💰 12 meses gratis | ✅ Sí | ✅ Sí | ⭐⭐ Media | Media-Alta |
| **Replit / GitHub Codespaces** | 💵 Freemium | ⚠️ Limitado | ⚠️ Limitado | ⭐⭐⭐ Fácil | Fácil |
| **Docker Local** | 🆓 Gratis | ✅ Sí | ✅ Sí | ⭐ Difícil | Media |

**Recomendación:** **Google Colab + Databricks Community** (100% gratis, fácil integración)

---

## 🥇 OPCIÓN 1: Google Colab (RECOMENDADO - 100% GRATIS)

### ✅ Ventajas
- **100% GRATIS** (con GPU/TPU disponibles)
- PySpark pre-instalado
- Notebooks interactivos
- Fácil integración con tu plataforma web
- Sin límite de tiempo (mientras estés activo)
- Almacenamiento en Google Drive

### ⚠️ Limitaciones
- Airflow limitado (solo para demostraciones)
- Sesión se desconecta después de inactividad
- Recursos compartidos

### 🚀 Implementación

#### 1. Crear Notebook para Ejercicios PySpark

Cada ejercicio PySpark puede tener su propio Colab notebook:

**Estructura:**
```
https://colab.research.google.com/drive/.../pyspark_exercise_001.ipynb
```

**Contenido del notebook:**
```python
# Instalar PySpark en Colab
!pip install pyspark

from pyspark.sql import SparkSession

# Crear sesión Spark
spark = SparkSession.builder \
    .appName("Exercise_001") \
    .getOrCreate()

# === EJERCICIO ===
# Estudiante completa aquí
```

#### 2. Integrar con tu Plataforma Web

**Opción A: Enlaces directos** (Más simple)

```html
<!-- En courses.html o learn.html -->
<div class="pyspark-exercise">
    <h3>PySpark - Crear DataFrame con Schema</h3>
    <p>⚠️ Este ejercicio requiere entorno cloud</p>

    <a href="https://colab.research.google.com/drive/1abc..."
       target="_blank"
       class="btn-colab">
        <img src="https://colab.research.google.com/assets/colab-badge.svg">
        Abrir en Google Colab
    </a>
</div>
```

**Opción B: Iframe embebido** (Más integrado)

```html
<iframe
    src="https://colab.research.google.com/drive/1abc...?embedded=true"
    width="100%"
    height="600px"
    frameborder="0">
</iframe>
```

**Opción C: API de Colab** (Más avanzado)

```javascript
// En learn.js, detectar ejercicio PySpark
if (currentExercise.id.startsWith('pyspark_')) {
    // Mostrar botón "Abrir en Colab"
    const colabUrl = currentExercise.colabNotebookUrl;
    window.open(colabUrl, '_blank');
}
```

#### 3. Actualizar `learn_exercises.json`

```json
{
  "id": "learn_030",
  "title": "PySpark - Crear DataFrame con Schema",
  "instruction": "Define un schema explícito con StructType...",
  "theory": "...",
  "colabNotebookUrl": "https://colab.research.google.com/drive/1abc...",
  "requiresCloud": true,
  "cloudProvider": "Google Colab"
}
```

#### 4. Modificar `learn.js` para PySpark

```javascript
// En loadExercise()
if (currentExercise.requiresCloud) {
    displayCloudOption(currentExercise);
}

function displayCloudOption(exercise) {
    const container = document.getElementById('code-editor-container');

    container.innerHTML = `
        <div class="cloud-exercise-notice">
            <h3>☁️ Ejercicio Cloud</h3>
            <p>Este ejercicio se ejecuta en Google Colab (gratis)</p>

            <a href="${exercise.colabNotebookUrl}"
               target="_blank"
               class="btn-open-colab">
                <img src="https://colab.research.google.com/assets/colab-badge.svg">
                Abrir Ejercicio en Google Colab
            </a>

            <div class="cloud-instructions">
                <h4>Instrucciones:</h4>
                <ol>
                    <li>Haz clic en el botón de arriba</li>
                    <li>Se abrirá Google Colab en nueva pestaña</li>
                    <li>Completa el ejercicio siguiendo las instrucciones</li>
                    <li>Ejecuta todas las celdas</li>
                    <li>Verifica los resultados</li>
                </ol>
            </div>
        </div>
    `;
}
```

### 📝 Creación de Notebooks

**Script para generar notebooks automáticamente:**

```python
# generate_colab_notebooks.py
import json
import nbformat as nbf

def create_pyspark_notebook(exercise):
    nb = nbf.v4.new_notebook()

    # Celda 1: Setup
    nb.cells.append(nbf.v4.new_code_cell("""
# Instalar PySpark
!pip install -q pyspark

from pyspark.sql import SparkSession
from pyspark.sql.types import *

# Crear sesión Spark
spark = SparkSession.builder \\
    .appName('{exercise_id}') \\
    .getOrCreate()

print('✓ PySpark listo')
    """.format(exercise_id=exercise['id'])))

    # Celda 2: Teoría
    nb.cells.append(nbf.v4.new_markdown_cell(f"""
## {exercise['title']}

### 📚 Teoría
{exercise['theory']}

### 📖 Sintaxis
```python
{exercise['syntax']}
```

### 💡 Ejemplo
```python
{exercise['example']['code']}
```
    """))

    # Celda 3: Ejercicio
    nb.cells.append(nbf.v4.new_code_cell(f"""
# === TU CÓDIGO AQUÍ ===
# {exercise['instruction']}

{exercise['starterCode']}
    """))

    # Celda 4: Validación
    nb.cells.append(nbf.v4.new_code_cell(f"""
# === VALIDACIÓN ===
try:
    {exercise['test']}
    print('✅ ¡Solución correcta!')
except Exception as e:
    print(f'❌ Error: {{e}}')
    """))

    # Guardar
    filename = f"notebooks/{exercise['id']}.ipynb"
    with open(filename, 'w') as f:
        nbf.write(nb, f)

    print(f"✓ Created {filename}")

# Cargar ejercicios
with open('ejercicios/learn_exercises.json') as f:
    data = json.load(f)

# Generar notebooks para PySpark
for ex in data['exercises']:
    if 'PySpark' in ex['title']:
        create_pyspark_notebook(ex)
```

### 🔄 Workflow del Usuario

1. Usuario abre ejercicio PySpark en tu web
2. Ve botón "Abrir en Google Colab"
3. Click → abre Colab en nueva pestaña
4. Completa ejercicio en Colab
5. Ejecuta y valida resultados
6. (Opcional) Vuelve a tu plataforma y marca como completado

---

## 🥈 OPCIÓN 2: Databricks Community Edition (100% GRATIS)

### ✅ Ventajas
- **100% GRATIS** permanentemente
- Cluster Spark completo (15GB RAM, 6GB storage)
- Entorno profesional de Data Engineering
- Notebooks colaborativos
- Catálogo de datos integrado
- Ideal para proyectos reales

### ⚠️ Limitaciones
- No tiene Airflow nativo
- Cluster se apaga después de 2 horas de inactividad
- 1 cluster a la vez
- Recursos limitados vs versión paga

### 🚀 Implementación

#### 1. Registrarse
```
https://community.cloud.databricks.com/login.html
```

#### 2. Crear Workspace con Ejercicios

**Estructura de carpetas:**
```
Workspace/
├── Curso_PySpark/
│   ├── 01_Basics/
│   │   ├── Exercise_030_Schema.py
│   │   ├── Exercise_031_Select.py
│   ├── 02_Advanced/
│   │   ├── Exercise_040_Repartition.py
│   │   ├── Exercise_041_Broadcast.py
```

#### 3. Crear Notebooks Interactivos

**Ejemplo: Exercise_030_Schema**

```python
# Databricks notebook source
# MAGIC %md
# MAGIC # PySpark - Crear DataFrame con Schema
# MAGIC
# MAGIC ## 📚 Teoría
# MAGIC Definir schemas explícitos mejora performance y validación de datos.
# MAGIC
# MAGIC ## 🎯 Objetivo
# MAGIC Define un schema con StructType y crea un DataFrame.

# COMMAND ----------

from pyspark.sql.types import StructType, StructField, StringType, IntegerType

# === TU CÓDIGO AQUÍ ===
# Define el schema para: nombre (string), edad (int), ciudad (string)

schema = ___

# Datos de ejemplo
data = [
    ("Ana", 25, "Lima"),
    ("Bob", 30, "Cusco"),
    ("Carlos", 28, "Arequipa")
]

# Crea el DataFrame
df = ___

# Muestra el resultado
df.show()
df.printSchema()

# COMMAND ----------

# MAGIC %md
# MAGIC ## ✅ Solución

# COMMAND ----------

# Descomentar para ver solución
# schema = StructType([
#     StructField("nombre", StringType(), True),
#     StructField("edad", IntegerType(), True),
#     StructField("ciudad", StringType(), True)
# ])
#
# df = spark.createDataFrame(data, schema)

# COMMAND ----------

# MAGIC %md
# MAGIC ## 💡 Pista 1
# MAGIC Usa StructType([StructField(...), ...])

# COMMAND ----------

# MAGIC %md
# MAGIC ## 💡 Pista 2
# MAGIC spark.createDataFrame(data, schema)
```

#### 4. Compartir Notebooks

**Opción A: URL pública**
```
https://databricks-prod-cloudfront.cloud.databricks.com/public/.../exercise_030.html
```

**Opción B: Import desde GitHub**
```python
# Usuarios pueden importar tus notebooks directamente
# File → Import → URL
https://github.com/tu-repo/databricks-exercises/exercise_030.py
```

#### 5. Integrar con tu Plataforma

```javascript
// En learn.js
if (currentExercise.id.startsWith('learn_03') ||
    currentExercise.id.startsWith('learn_04')) {

    displayDatabricksOption(currentExercise);
}

function displayDatabricksOption(exercise) {
    const container = document.getElementById('code-editor-container');

    container.innerHTML = `
        <div class="databricks-exercise">
            <h3>☁️ Databricks Community Edition</h3>
            <p>Este ejercicio usa un cluster Spark real (gratis)</p>

            <div class="steps">
                <h4>Primero (solo una vez):</h4>
                <ol>
                    <li>Crea cuenta gratuita en
                        <a href="https://community.cloud.databricks.com" target="_blank">
                            Databricks Community
                        </a>
                    </li>
                    <li>Inicia tu cluster (botón "Start Cluster")</li>
                </ol>

                <h4>Luego, para cada ejercicio:</h4>
                <ol>
                    <li>Importa el notebook desde GitHub</li>
                    <li>Completa el código</li>
                    <li>Ejecuta las celdas</li>
                </ol>
            </div>

            <a href="${exercise.databricksNotebookUrl}"
               class="btn-databricks"
               target="_blank">
                📊 Abrir Notebook en Databricks
            </a>

            <a href="https://github.com/${exercise.githubNotebookPath}"
               class="btn-github"
               target="_blank">
                <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" width="20">
                Ver en GitHub
            </a>
        </div>
    `;
}
```

---

## 🥉 OPCIÓN 3: Google Cloud Platform (GCP) - $300 Créditos Gratis

### ✅ Ventajas
- **$300 USD en créditos** para 90 días
- Dataproc (Spark managed)
- Cloud Composer (Airflow managed)
- Producción-ready
- Escalable

### 💰 Costos después del free tier
- **Dataproc**: ~$0.01/hour (cluster pequeño)
- **Cloud Composer**: ~$150/mes (environment pequeño)
- **Compute Engine**: ~$5/mes (VM f1-micro)

### 🚀 Implementación (Solución Económica)

#### Arquitectura Recomendada

```
Tu Plataforma Web (GitHub Pages - Gratis)
    ↓
API Backend (Cloud Functions - Casi gratis)
    ↓
Dataproc On-Demand (Solo cuando se ejecutan ejercicios)
```

**Costo estimado:** < $10/mes con uso moderado

#### 1. Cloud Functions como Backend

```javascript
// functions/execute-pyspark/index.js
const { Dataproc } = require('@google-cloud/dataproc');

exports.executePySpark = async (req, res) => {
    const { exerciseId, code } = req.body;

    // Crear cluster temporal
    const dataproc = new Dataproc.v1.ClusterControllerClient();

    const cluster = await dataproc.createCluster({
        projectId: 'tu-proyecto',
        region: 'us-central1',
        cluster: {
            clusterName: `exercise-${exerciseId}-${Date.now()}`,
            config: {
                masterConfig: {
                    numInstances: 1,
                    machineTypeUri: 'n1-standard-1'
                },
                workerConfig: {
                    numInstances: 2,
                    machineTypeUri: 'n1-standard-1'
                }
            }
        }
    });

    // Ejecutar código
    const job = await dataproc.submitJob({
        projectId: 'tu-proyecto',
        region: 'us-central1',
        job: {
            placement: { clusterName: cluster.clusterName },
            pysparkJob: {
                mainPythonFileUri: `gs://tu-bucket/exercises/${exerciseId}.py`,
                args: [code]
            }
        }
    });

    // Esperar resultados
    const result = await job.promise();

    // Eliminar cluster (importante para no gastar)
    await dataproc.deleteCluster({
        projectId: 'tu-proyecto',
        region: 'us-central1',
        clusterName: cluster.clusterName
    });

    res.json({ success: true, output: result.output });
};
```

#### 2. Integrar con tu Web

```javascript
// En learn.js
async function executePySparkInCloud(code) {
    showLoadingModal('Ejecutando en Google Cloud...');

    try {
        const response = await fetch('https://us-central1-tu-proyecto.cloudfunctions.net/executePySpark', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                exerciseId: currentExercise.id,
                code: code
            })
        });

        const result = await response.json();
        hideLoadingModal();

        displayConsoleOutput(result.output, 'success');
    } catch (error) {
        hideLoadingModal();
        displayConsoleOutput(`Error: ${error.message}`, 'error');
    }
}
```

#### 3. Costos Optimizados

**Configuración económica:**
```yaml
# cluster-config.yaml
masterConfig:
  numInstances: 1
  machineTypeUri: e2-micro  # Más barato
  diskConfig:
    bootDiskSizeGb: 30

workerConfig:
  numInstances: 0  # Sin workers para ejercicios básicos

softwareConfig:
  imageVersion: 2.0-debian10  # Latest stable

# Auto-delete después de inactividad
lifecycleConfig:
  idleDeleteTtl: 600s  # 10 minutos
```

**Costo estimado:**
- Cluster e2-micro: $0.006/hora
- 10 ejercicios/día × 5 min cada uno = 50 min/día
- 50 min/día × 30 días = 1500 min/mes = 25 horas/mes
- **Costo total: ~$0.15/mes** 🎉

---

## 🏅 OPCIÓN 4: Replit (Freemium - Fácil pero Limitado)

### ✅ Ventajas
- Fácil de usar
- IDE en el navegador
- Colaboración en tiempo real
- Deployment simple

### ⚠️ Limitaciones
- Plan gratis muy limitado (500MB RAM)
- PySpark difícil de ejecutar
- Airflow no soportado

### 🚀 Implementación

Solo para ejercicios Python ligeros, no recomendado para PySpark/Airflow.

---

## 🐋 OPCIÓN 5: Docker Local (Último Recurso)

### Cuando usar:
- Sin internet confiable
- Máxima privacidad
- Desarrollo/testing local

### Setup Completo

```yaml
# docker-compose.yml
version: '3'
services:
  # PySpark Jupyter
  pyspark:
    image: jupyter/pyspark-notebook:latest
    ports:
      - "8888:8888"
    volumes:
      - ./notebooks:/home/jovyan/work
    environment:
      - JUPYTER_ENABLE_LAB=yes

  # Airflow
  airflow:
    image: apache/airflow:2.7.1
    ports:
      - "8080:8080"
    volumes:
      - ./dags:/opt/airflow/dags
      - ./logs:/opt/airflow/logs
    environment:
      - AIRFLOW__CORE__EXECUTOR=LocalExecutor
```

**Ejecutar:**
```bash
docker-compose up -d
```

---

## 🎯 RECOMENDACIÓN FINAL

### Para tu caso (Plataforma de Aprendizaje):

**Combinación ÓPTIMA (100% Gratis):**

1. **Para PySpark:**
   - **Databricks Community** (ejercicios avanzados)
   - **Google Colab** (ejercicios básicos)

2. **Para Airflow:**
   - **Google Colab** con Airflow standalone (demostraciones)
   - **Astronomer.io Free Tier** (30 días gratis, luego $10/mes)

3. **Para SQL:**
   - Ya resuelto ✅ (SQL.js en navegador)

4. **Para Python:**
   - Ya resuelto ✅ (Pyodide en navegador)

### Implementación Sugerida

```json
// En learn_exercises.json
{
  "exercises": [
    {
      "id": "learn_030",
      "title": "PySpark - Schema",
      "cloudProvider": "databricks",
      "notebookUrl": "https://databricks.com/.../exercise_030",
      "alternativeUrl": "https://colab.research.google.com/.../exercise_030"
    },
    {
      "id": "learn_051",
      "title": "Airflow - DAG Basics",
      "cloudProvider": "colab",
      "colabUrl": "https://colab.research.google.com/.../airflow_dag"
    }
  ]
}
```

---

## 📋 Plan de Acción

### Fase 1: Immediate (Esta semana)
1. ✅ Crear cuenta Databricks Community
2. ✅ Crear notebooks para ejercicios PySpark
3. ✅ Integrar botones "Abrir en Databricks" en tu web

### Fase 2: Short-term (Próximas 2 semanas)
1. Crear notebooks Colab como alternativa
2. Agregar ejemplos de Airflow en Colab
3. Documentar workflow para usuarios

### Fase 3: Long-term (Opcional)
1. Si creces: migrar a GCP con Cloud Functions
2. Monetizar plataforma para cubrir costos
3. Ofrecer certificados por curso completo

---

## 💡 Extras: Monetización Futura

Si quieres eventualmente monetizar:

**Modelo Freemium:**
- **Gratis:** Python, SQL, notebooks estáticos
- **Pro ($5/mes):**
  - Ejecución PySpark en cloud dedicado
  - Airflow projects ilimitados
  - Certificados verificables
  - Soporte prioritario

**Costo de operación Pro:**
- GCP Cloud Functions: $0.40/month
- Dataproc on-demand: ~$2/month
- Total: < $3/month por usuario Pro
- **Margen: $2/usuario**

---

## 🔗 Enlaces Útiles

- **Databricks Community:** https://community.cloud.databricks.com
- **Google Colab:** https://colab.research.google.com
- **GCP Free Tier:** https://cloud.google.com/free
- **Astronomer Free Trial:** https://www.astronomer.io/try-astro

---

**Última actualización:** 2025-11-02
