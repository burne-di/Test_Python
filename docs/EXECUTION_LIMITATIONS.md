# Limitaciones de Ejecución en Navegador

Este documento explica qué ejercicios pueden ejecutarse directamente en el navegador y cuáles requieren un entorno local.

## Resumen

El sistema utiliza **Pyodide** (Python compilado a WebAssembly) para ejecutar código Python en el navegador y **SQL.js** para ejecutar SQL. Sin embargo, no todos los módulos y tecnologías están disponibles en este entorno.

---

## ✅ Ejercicios Ejecutables en Navegador

### Python Puro ✅
Todos los ejercicios de Python puro funcionan correctamente en el navegador.

**Cursos disponibles:**
- **Python Basics** (4 ejercicios)
  - List comprehensions
  - Lambda functions
  - Map, filter, reduce

- **Python Advanced** (9 ejercicios)
  - Manejo de archivos (try/except)
  - Expresiones regulares (regex)
  - Datetime
  - Collections (Counter, defaultdict)
  - Logging básico
  - Pytest básico
  - F-strings
  - Dict comprehensions

**IDs de ejercicios:** `learn_001-004`, `learn_011-015`, `learn_028-029`, `learn_046-047`

---

### Pandas ✅
Pandas está disponible en Pyodide, por lo que todos los ejercicios de Pandas funcionan en el navegador.

**Cursos disponibles:**
- **Pandas Basics** (6 ejercicios)
  - Leer CSV
  - Filtrar filas
  - Apply functions
  - GroupBy y agregaciones
  - Merge DataFrames
  - Pivot tables

- **Pandas Advanced** (6 ejercicios)
  - Categorical dtypes
  - Vectorización vs apply
  - Detectar duplicados
  - Manejar valores nulos
  - Query method
  - Explode para listas

- **Pandas Time Series** (4 ejercicios)
  - Resample
  - Rolling windows
  - Shift para comparar períodos
  - merge_asof

- **Pandas Optimization** (3 ejercicios)
  - Detectar outliers con IQR
  - Leer CSV con chunks
  - to_sql para guardar en base de datos

**IDs de ejercicios:** `learn_005-010`, `learn_016-017`, `learn_021-024`, `learn_035-039`, `learn_048-049`

---

### SQL ✅
SQL funciona usando **SQL.js**, una implementación de SQLite compilada a WebAssembly.

**Cursos disponibles:**
- **SQL Basics** (3 ejercicios)
  - CASE expressions
  - COALESCE para manejar NULLs
  - UNION vs UNION ALL

- **SQL Advanced** (6 ejercicios)
  - CTEs (WITH clause)
  - Window functions (ROW_NUMBER)
  - LAG para comparar filas anteriores
  - RANK vs DENSE_RANK
  - ROWS BETWEEN para frames
  - GROUPING SETS para subtotales

**IDs de ejercicios:** `learn_018-020`, `learn_025-027`, `learn_043-045`

**Nota:** SQL.js usa SQLite como motor, por lo que algunas funciones específicas de otros motores (PostgreSQL, MySQL, SQL Server) pueden no estar disponibles.

---

## ❌ Ejercicios NO Ejecutables en Navegador

### PySpark ❌ **REQUIERE ENTORNO LOCAL**

PySpark **NO está disponible en Pyodide** porque requiere el framework completo de Apache Spark, que no puede ejecutarse en un navegador web.

**Cursos marcados como "Requiere entorno local":**
- **PySpark Basics** (5 ejercicios)
  - Crear DataFrame con Schema
  - Select y WithColumn
  - Filter y Where
  - GroupBy y Aggregations
  - Join DataFrames

- **PySpark Advanced** (5 ejercicios)
  - Repartition vs Coalesce
  - Broadcast Join
  - Cache vs Persist
  - UDF (User Defined Functions)

**IDs de ejercicios:** `learn_030-034`, `learn_040-042`, `learn_050`

**Solución:** Estos ejercicios se muestran en el modo Learning con la teoría, ejemplos y explicaciones, pero no pueden ejecutarse. Para practicar PySpark, debes:

1. Instalar Python localmente
2. Instalar PySpark: `pip install pyspark`
3. Ejecutar los ejercicios en tu IDE local (VS Code, PyCharm, Jupyter Notebook)

---

## Modo Challenge vs Modo Learning

### Modo Learning (Aprendizaje)
- Usa el archivo: `ejercicios/learn_exercises.json`
- IDs: `learn_001` a `learn_050`
- Incluye: teoría, sintaxis, ejemplos, hints, solución
- **Todos los ejercicios Python y Pandas son ejecutables** ✅
- **Ejercicios SQL son ejecutables** ✅
- **Ejercicios PySpark solo tienen contenido teórico** ⚠️

### Modo Challenge (Desafíos SSR/SR)
- Usa el archivo: `ejercicios/exercises.json`
- IDs: `sql_001-003`, `python_001-013`, `pyspark_001-002`
- Incluye: límite de tiempo, test cases automáticos, datasets
- **Ejercicios Python son ejecutables** ✅
- **Ejercicios SQL son ejecutables** ✅
- **Ejercicios PySpark NO son ejecutables** ❌

---

## Módulos Python Disponibles en Pyodide

Pyodide incluye los siguientes paquetes populares:

### Data Science
- ✅ pandas
- ✅ numpy
- ✅ scipy
- ✅ scikit-learn
- ✅ matplotlib
- ✅ seaborn

### Utilidades
- ✅ regex (re)
- ✅ datetime
- ✅ collections
- ✅ itertools
- ✅ functools
- ✅ json
- ✅ csv

### NO Disponibles
- ❌ pyspark
- ❌ tensorflow
- ❌ pytorch
- ❌ airflow
- ❌ kafka
- ❌ Módulos que requieren C/C++ sin compilar a WASM

---

## Cómo Identificar si un Ejercicio es Ejecutable

### En la interfaz de cursos:

1. **Badge "Próximamente"** + **⚠️ Requiere entorno local** = NO ejecutable
2. **Sin badge** = Ejecutable en navegador
3. **Categoría "PySpark"** = Probablemente requiere entorno local

### En el JSON:

```json
{
  "comingSoon": true,
  "requiresLocalEnv": true
}
```

Si un curso tiene estas propiedades, los ejercicios pueden verse pero no ejecutarse.

---

## Soluciones para Ejercicios No Ejecutables

### Opción 1: Entorno Local (Recomendado para PySpark)

1. Instala Python 3.8+
2. Instala PySpark:
   ```bash
   pip install pyspark
   ```
3. Ejecuta los ejercicios en Jupyter Notebook o tu IDE favorito

### Opción 2: Google Colab (Alternativa gratuita)

1. Abre [Google Colab](https://colab.research.google.com/)
2. PySpark está pre-instalado
3. Copia el código del ejercicio y ejecútalo

### Opción 3: Databricks Community Edition (Para proyectos reales)

1. Regístrate en [Databricks Community](https://community.cloud.databricks.com/)
2. Acceso gratuito a cluster de Spark
3. Ideal para proyectos de Big Data

---

## Errores Comunes

### Error: "ModuleNotFoundError: No module named 'pyspark'"

**Causa:** Intentaste ejecutar un ejercicio de PySpark en el navegador.

**Solución:**
- Ejecuta el ejercicio en un entorno local con PySpark instalado
- O usa Google Colab / Databricks

### Error: "IndentationError: unexpected indent" en SQL

**Causa:** El código SQL tiene problemas de formato al ejecutarse con el motor de Python.

**Solución:**
- Verifica que el código SQL esté correctamente formateado
- Asegúrate de que estás en un ejercicio de tipo "sql" (no "python")
- Revisa que el starterCode no tenga espacios extra al inicio

### Error: SQL funciona pero pandas.read_sql() falla

**Causa:** `pandas.read_sql()` requiere una conexión a base de datos real, no SQL.js.

**Solución:**
- Usa `pd.read_csv()` en su lugar para cargar datos
- O ejecuta localmente con SQLite/PostgreSQL/MySQL

---

## Roadmap Futuro

### En desarrollo:
- [ ] Soporte para ejecutar PySpark en modo "simulado" con Pandas
- [ ] Integración con Databricks Community API
- [ ] Ejercicios interactivos de Airflow (simulados)
- [ ] Soporte para PostgreSQL.js (alternativa a SQLite)

### Contribuciones:
Si tienes ideas para mejorar la compatibilidad de ejecución, por favor abre un issue en el repositorio.

---

## Referencias

- [Pyodide Documentation](https://pyodide.org/)
- [SQL.js GitHub](https://github.com/sql-js/sql.js/)
- [PySpark Documentation](https://spark.apache.org/docs/latest/api/python/)
- [Databricks Community](https://community.cloud.databricks.com/)

---

**Última actualización:** 2025-11-02
