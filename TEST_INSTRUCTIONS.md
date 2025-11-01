# 📝 Instrucciones para Probar los Ejercicios

## ✅ Cómo Funciona la Carga de Datasets

### Para Python:
Los ejercicios Python ahora cargan automáticamente los datasets en el sistema de archivos virtual de Pyodide. Si un dataset existe, estará disponible en tu código con el mismo nombre.

**Ejemplo:**
```python
import pandas as pd

# Este archivo estará disponible automáticamente si existe en /docs/datasets/
df = pd.read_csv('sample_data.csv')
print(df.head())
```

### Para SQL:
Los datasets se cargan automáticamente en tablas SQL cuando abres un ejercicio SQL.

---

## 🔧 Solución de Problemas

### Si obtienes "File not found":

**Opción 1:** Usa el dataset disponible (`sample_data.csv` o `raw_customer_data.csv`)

**Opción 2:** Genera datos sintéticos en memoria:
```python
import pandas as pd
import numpy as np

# Genera tus propios datos para practicar
df = pd.DataFrame({
    'user_id': np.random.randint(1, 1000, 10000),
    'amount': np.random.uniform(1, 1000, 10000),
    'category': np.random.choice(['food', 'transport', 'entertainment'], 10000),
    'status': np.random.choice(['completed', 'pending'], 10000)
})

# Ahora trabaja con este DataFrame
print(df.head())
```

---

## 📊 Datasets Disponibles

Estos archivos están listos para usar:
- ✅ `sample_data.csv` - Datos de transacciones
- ✅ `raw_customer_data.csv` - Datos de clientes
- ✅ `sales_data.csv` - Datos de ventas (SQL)
- ✅ `transactions.csv` - Transacciones (SQL)
- ✅ `employee_hierarchy.csv` - Jerarquía de empleados (SQL)

---

## 🎯 Recomendación

Para ejercicios Senior complejos (python_004 en adelante), es **mejor generar datos sintéticos** en memoria. Esto te permite:
- Controlar exactamente el tamaño del dataset
- Practicar generación de datos (skill importante)
- No depender de archivos externos
- Ejecutar más rápido

**Ejemplo completo para Python 011:**
```python
import pandas as pd
import numpy as np
import time

# Genera dataset de 100K filas para practicar
n = 100_000
df = pd.DataFrame({
    'user_id': np.random.randint(1, 10000, n),
    'amount': np.random.uniform(1, 1000, n),
    'category': np.random.choice(['A', 'B', 'C', 'D'], n),
    'status': np.random.choice(['active', 'inactive'], n)
})

# Ahora optimiza este DataFrame
print(f"Memory before: {df.memory_usage(deep=True).sum() / 1024**2:.2f} MB")

# Tu código de optimización aquí...
df['category'] = df['category'].astype('category')
df['status'] = df['status'].astype('category')

print(f"Memory after: {df.memory_usage(deep=True).sum() / 1024**2:.2f} MB")
```
