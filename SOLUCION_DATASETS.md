# ✅ Solución al Problema de Datasets

## 🐛 Problema Original
Cuando se ejecutaba código Python, los datasets no estaban disponibles y aparecía el error:
```
FileNotFoundError: No such file or directory: 'large_transactions.csv'
```

---

## ✅ Soluciones Implementadas

### 1. **Pre-carga Automática de Datasets en Pyodide**

Se modificó `docs/js/solve.js` para cargar automáticamente los datasets en el filesystem virtual de Pyodide:

```javascript
// Nueva función agregada
async function loadDatasetIntoPyodide(filename) {
    if (!pyodideInstance) {
        await initPyodide();
    }

    try {
        const response = await fetch(`datasets/${filename}`);
        if (!response.ok) {
            console.warn(`Dataset ${filename} not found, skipping...`);
            return;
        }

        const content = await response.text();
        // Escribe el archivo en el filesystem virtual de Pyodide
        pyodideInstance.FS.writeFile(filename, content);
        console.log(`Dataset ${filename} loaded into Pyodide filesystem`);
    } catch (error) {
        console.warn(`Could not load dataset ${filename}:`, error);
    }
}
```

**Modificación en `runPython()`:**
```javascript
async function runPython(code) {
    if (!pyodideInstance) {
        await initPyodide();
    }

    try {
        // NUEVA LÍNEA: Carga el dataset antes de ejecutar el código
        if (currentExercise.dataset) {
            await loadDatasetIntoPyodide(currentExercise.dataset);
        }

        // ... resto del código
    }
}
```

---

### 2. **Datasets Creados**

Se crearon los siguientes archivos en `docs/datasets/`:

✅ **sample_data.csv** (10 filas de ejemplo)
```csv
user_id,amount,category,status,product,date
1,150.50,food,completed,Groceries,2024-01-01
2,45.00,transport,completed,Uber,2024-01-01
...
```

✅ **employee_hierarchy.csv** (10 empleados con jerarquía)
```csv
employee_id,name,manager_id,salary,department
1,Alice Chen,NULL,150000,Executive
2,Bob Smith,1,120000,Engineering
...
```

---

### 3. **Datasets Actualizados en Ejercicios**

Se actualizaron los ejercicios para usar datasets existentes:

- `python_004`: `large_transactions.csv` → `sample_data.csv`
- `python_011`: `large_dataset.csv` → `sample_data.csv`
- `sql_003`: dataset ya existente (`employee_hierarchy.csv`)

---

## 🎯 Cómo Usar los Datasets Ahora

### Opción 1: Usar datasets existentes

```python
import pandas as pd

# El archivo se carga automáticamente en Pyodide
df = pd.read_csv('sample_data.csv')
print(df.head())
```

### Opción 2: Generar datos sintéticos (RECOMENDADO para ejercicios Senior)

```python
import pandas as pd
import numpy as np

# Genera dataset de prueba
n = 100_000
df = pd.DataFrame({
    'user_id': np.random.randint(1, 10000, n),
    'amount': np.random.uniform(1, 1000, n),
    'category': np.random.choice(['food', 'transport', 'entertainment'], n),
    'status': np.random.choice(['completed', 'pending', 'failed'], n)
})

print(f"Dataset generado: {len(df):,} filas")
print(df.head())
```

---

## 🧪 Cómo Probar que Funciona

1. **Limpia caché del navegador:**
   ```
   Ctrl + Shift + R (Windows)
   Cmd + Shift + R (Mac)
   ```

2. **Abre un ejercicio Python:**
   - Ve a `docs/index.html`
   - Selecciona cualquier ejercicio Python (ej: Python 001)

3. **Prueba con este código:**
   ```python
   import pandas as pd

   # Prueba 1: Cargar dataset existente
   try:
       df = pd.read_csv('sample_data.csv')
       print("✅ Dataset cargado correctamente!")
       print(f"Filas: {len(df)}")
       print(df.head())
   except Exception as e:
       print(f"❌ Error: {e}")

   # Prueba 2: Generar datos sintéticos
   import numpy as np
   df_synthetic = pd.DataFrame({
       'id': range(10),
       'value': np.random.randn(10)
   })
   print("\n✅ Datos sintéticos generados!")
   print(df_synthetic)
   ```

4. **Click "Ejecutar"**

**Resultado esperado:**
```
✅ Dataset cargado correctamente!
Filas: 10
   user_id  amount category     status  ...
0        1  150.50     food  completed  ...
1        2   45.00     transport  completed  ...
...

✅ Datos sintéticos generados!
   id     value
0   0 -0.234523
1   1  1.234234
...
```

---

## 🔧 Troubleshooting

### Error: "FileNotFoundError: 'xyz.csv'"

**Causa:** El dataset no existe en `docs/datasets/`

**Solución:**
```python
# Opción 1: Usa un dataset que exista
df = pd.read_csv('sample_data.csv')

# Opción 2: Genera datos sintéticos
import numpy as np
df = pd.DataFrame({
    'col1': np.random.randn(1000),
    'col2': np.random.choice(['A', 'B'], 1000)
})
```

### Error: "NameError: name 'pd' is not defined"

**Causa:** No importaste pandas

**Solución:**
```python
import pandas as pd
import numpy as np

# Ahora puedes usar pd y np
df = pd.read_csv('sample_data.csv')
```

### El código no ejecuta / se queda cargando

**Causa:** Pyodide está inicializando (primera vez toma ~10-15 segundos)

**Solución:** Espera a que termine de cargar. Verás "Ejecutando código..." en el modal.

---

## 📚 Beneficios de Esta Solución

✅ **Automático:** Los datasets se cargan sin intervención del usuario
✅ **Flexible:** Soporta archivos existentes o generación sintética
✅ **Educativo:** Los estudiantes aprenden a generar datos de prueba
✅ **Rápido:** No requiere servidor backend
✅ **Portátil:** Todo funciona en el navegador

---

## 🎓 Mejores Prácticas

Para ejercicios **SSR (Junior/Mid):**
```python
# Usa datasets existentes para enfocarte en el algoritmo
df = pd.read_csv('sample_data.csv')
```

Para ejercicios **Senior:**
```python
# Genera datasets grandes para demostrar optimización
n = 1_000_000  # 1M filas
df = pd.DataFrame({
    'user_id': np.random.randint(1, 100000, n),
    'amount': np.random.uniform(1, 10000, n),
    'category': np.random.choice(['A', 'B', 'C', 'D'], n)
})

# Ahora demuestra optimizaciones (categoricals, vectorization, etc.)
```

---

## ✅ Verificación Final

- [x] solve.js modificado con `loadDatasetIntoPyodide()`
- [x] Datasets creados (sample_data.csv, employee_hierarchy.csv)
- [x] Ejercicios actualizados para usar datasets existentes
- [x] README actualizado con instrucciones
- [x] Documentación de troubleshooting creada

**Status:** ✅ PROBLEMA RESUELTO

---

**Última actualización:** 2025-10-31
