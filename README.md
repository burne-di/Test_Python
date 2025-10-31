# 🎯 Data Engineering Practice Hub

Plataforma web tipo HackerRank para preparación de pruebas técnicas de **Data Engineering** con ejercicios nivel **SSR a Senior** en SQL, Python y PySpark.

## 🚀 Características

- ✅ **Ejercicios Prácticos** de SQL, Python y PySpark
- ✅ **Editor de Código** integrado (Monaco Editor)
- ✅ **Ejecución en el Navegador** (SQL.js, Pyodide)
- ✅ **Cronómetro** de tiempo límite por ejercicio
- ✅ **Validación Automática** con casos de prueba
- ✅ **Datasets Reales** para práctica
- ✅ **Integración con Google Colab** para PySpark
- ✅ **100% Gratis** - Hosted en GitHub Pages

## 📂 Estructura del Proyecto

```
Test_Python/
├── docs/                           # Carpeta para GitHub Pages
│   ├── index.html                  # Página principal
│   ├── solve.html                  # Página de resolución
│   ├── css/
│   │   ├── styles.css             # Estilos generales
│   │   └── solve.css              # Estilos de solve page
│   ├── js/
│   │   ├── app.js                 # Lógica principal
│   │   └── solve.js               # Lógica de ejecución
│   ├── ejercicios/
│   │   └── exercises.json         # Catálogo de ejercicios
│   ├── datasets/                   # Datasets CSV
│   │   ├── sales_data.csv
│   │   └── transactions.csv
│   └── colab_notebooks/            # Notebooks para PySpark
│       ├── README.md
│       └── PySpark_001_Procesamiento_Logs.ipynb
└── README.md                       # Este archivo
```

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5/CSS3/JavaScript** - UI y lógica principal
- **Monaco Editor** - Editor de código (mismo de VS Code)
- **SQL.js** - SQLite en WebAssembly para ejecutar SQL
- **Pyodide** - Python 3.11 en WebAssembly con Pandas/NumPy

### Backend (PySpark)
- **Google Colab** - Entorno de ejecución para PySpark
- **Apache Spark 3.5** - Procesamiento distribuido

### Hosting
- **GitHub Pages** - Hosting gratuito estático

## 📚 Ejercicios Disponibles

### SQL (3 ejercicios)
1. **Análisis de Ventas con Window Functions** (SSR - 30min)
2. **Detección de Anomalías en Transacciones** (Senior - 45min)
3. **Análisis de Cohorts de Usuarios** (Senior - 40min)

### Python (3 ejercicios)
1. **Pipeline de Limpieza de Datos** (SSR - 30min)
2. **Optimización de Consultas con Caching** (Senior - 45min)
3. **Procesamiento Paralelo de Archivos** (SSR - 35min)

### PySpark (2 ejercicios)
1. **Procesamiento Distribuido de Logs** (SSR - 40min)
2. **ETL Incremental con Change Data Capture** (Senior - 60min)

## 🚀 Cómo Configurar GitHub Pages

### Paso 1: Inicializar Git (si no está inicializado)

```bash
cd "D:\Users\One Drive\OneDrive - Universidad Tecnologica del Peru\TEST APP\Test_Python"
git init
```

### Paso 2: Crear repositorio en GitHub

1. Ve a [GitHub.com](https://github.com)
2. Click en **"New Repository"**
3. Nombre: `data-engineering-practice`
4. Descripción: "Plataforma de práctica para Data Engineering"
5. **Público** (para usar GitHub Pages gratis)
6. NO inicialices con README (ya lo tienes)

### Paso 3: Conectar y subir

```bash
# Agregar archivos
git add .
git commit -m "Initial commit: Data Engineering Practice Hub"

# Conectar con GitHub (reemplaza USERNAME con tu usuario)
git remote add origin https://github.com/USERNAME/data-engineering-practice.git

# Subir al repositorio
git branch -M main
git push -u origin main
```

### Paso 4: Activar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Click en **Settings** > **Pages**
3. En **Source**, selecciona: `main` branch y carpeta `/docs`
4. Click **Save**
5. Espera 1-2 minutos

### Paso 5: Acceder a tu sitio

Tu sitio estará disponible en:
```
https://USERNAME.github.io/data-engineering-practice/
```

## 💻 Uso Local (Desarrollo)

Para probar localmente antes de subir:

```bash
# Navegar a la carpeta docs
cd docs

# Iniciar servidor local (Python)
python -m http.server 8000

# O con Node.js
npx http-server -p 8000
```

Abre: `http://localhost:8000`

## 🎓 Cómo Usar la Plataforma

### Para ejercicios SQL y Python:

1. Selecciona un ejercicio desde la página principal
2. Lee las instrucciones cuidadosamente
3. Escribe tu código en el editor
4. Click **"Ejecutar"** para validar
5. Revisa los resultados y casos de prueba

### Para ejercicios PySpark:

1. Selecciona un ejercicio PySpark
2. Lee las instrucciones
3. Click **"Abrir en Google Colab"**
4. Resuelve el ejercicio en Colab
5. Valida con las celdas de prueba automáticas

## 📝 Agregar Nuevos Ejercicios

Edita `docs/ejercicios/exercises.json`:

```json
{
  "id": "sql_004",
  "title": "Título del Ejercicio",
  "category": "sql",
  "difficulty": "ssr",
  "description": "Descripción corta",
  "timeLimit": 30,
  "dataset": "mi_dataset.csv",
  "instructions": "Instrucciones detalladas...",
  "starterCode": "-- Código inicial",
  "testCases": [
    {
      "description": "Debe retornar X",
      "expectedColumns": ["col1", "col2"]
    }
  ]
}
```

## 🔧 Personalización

### Cambiar colores

Edita `docs/css/styles.css`:

```css
:root {
    --primary-color: #2563eb;  /* Tu color primario */
    --secondary-color: #1e40af;
    /* ... */
}
```

### Agregar datasets

1. Crea CSV en `docs/datasets/`
2. Actualiza `loadSampleData()` en `docs/js/solve.js`

## 🐛 Troubleshooting

### Error: "Exercise not found"
- Verifica que el ID del ejercicio existe en `exercises.json`

### SQL no ejecuta
- Abre DevTools (F12) y revisa errores en consola
- Verifica que sql.js está cargando correctamente

### Python no ejecuta
- Pyodide tarda 10-20s en cargar la primera vez
- Verifica conexión a internet (descarga ~50MB)

### PySpark link roto
- Actualiza `colabNotebook` en `exercises.json` con tu link de Colab

## 📊 Roadmap Futuro

- [ ] Sistema de autenticación (Firebase)
- [ ] Guardar progreso del usuario
- [ ] Leaderboard / Rankings
- [ ] Más ejercicios (10+ por categoría)
- [ ] Backend propio para PySpark
- [ ] Soporte para R y Scala
- [ ] Sistema de hints progresivos
- [ ] Modo competencia con otros usuarios

## 🤝 Contribuir

¿Quieres agregar ejercicios? ¡Contribuciones bienvenidas!

1. Fork el repositorio
2. Crea una rama: `git checkout -b feature/nuevo-ejercicio`
3. Commit: `git commit -m "Agregar ejercicio SQL 005"`
4. Push: `git push origin feature/nuevo-ejercicio`
5. Abre un Pull Request

## 📄 Licencia

MIT License - Uso libre para preparación técnica y educación.

## 👨‍💻 Autor

Desarrollado para preparación de pruebas técnicas de Data Engineering.

---

## 🎯 Próximos Pasos

1. ✅ Sube el proyecto a GitHub
2. ✅ Activa GitHub Pages
3. ✅ Prueba los ejercicios SQL y Python
4. ✅ Crea tus notebooks de Colab para PySpark
5. 📈 Practica y mejora tus habilidades

**¡Buena suerte en tu preparación para Data Engineering!** 🚀
