# 📚 Plan de Expansión de Contenido - Data Engineering Hub

**Basado en:** GAP_ANALYSIS.md y ROADMAP_ADDONS.md

---

## 🎯 Objetivo
Expandir de **10 ejercicios básicos** a **100+ ejercicios** cubriendo todos los conceptos de Data Engineering necesarios para pruebas técnicas SSR-Senior.

---

## 📊 Estado Actual vs Objetivo

| Categoría | Actual | Objetivo | Gap |
|-----------|--------|----------|-----|
| Python Core | 4 | 25 | 21 |
| Pandas Básico | 6 | 10 | 4 |
| Pandas Advanced | 0 | 20 | 20 |
| SQL Básico | 0 | 10 | 10 |
| SQL Advanced | 0 | 15 | 15 |
| PySpark Básico | 0 | 12 | 12 |
| PySpark Advanced | 0 | 8 | 8 |
| Data Quality | 0 | 10 | 10 |
| **TOTAL** | **10** | **110** | **100** |

---

## 📝 Contenido a Agregar por Categoría

### 🐍 PYTHON CORE (21 ejercicios nuevos)

#### Files & I/O (5 ejercicios)
- [x] `learn_011`: Leer CSV con encoding UTF-8 y ISO-8859-1
- [ ] `learn_012`: Parsear JSON con errores (try/except)
- [ ] `learn_013`: Leer archivos grandes con chunks (yield)
- [ ] `learn_014`: Escribir Parquet con pyarrow
- [ ] `learn_015`: Leer/escribir archivos comprimidos (.gz, .zip)

#### Regex (4 ejercicios)
- [ ] `learn_016`: Extraer emails de texto con re.findall()
- [ ] `learn_017`: Parsear logs de Apache/Nginx
- [ ] `learn_018`: Extraer URLs e IPs de texto
- [ ] `learn_019`: Validar formatos (teléfonos, códigos postales)

#### Datetime (4 ejercicios)
- [ ] `learn_020`: Parsear fechas mixtas con pd.to_datetime()
- [ ] `learn_021`: Trabajar con zonas horarias (pytz)
- [ ] `learn_022`: Calcular business days (numpy.busday_count)
- [ ] `learn_023`: Rolling windows con offsets temporales

#### Collections (3 ejercicios)
- [ ] `learn_024`: Counter para contar frecuencias
- [ ] `learn_025`: defaultdict para agrupaciones
- [ ] `learn_026`: deque para procesamiento FIFO

#### Error Handling & Logging (3 ejercicios)
- [ ] `learn_027`: try/except con múltiples excepciones
- [ ] `learn_028`: Custom exceptions para validación
- [ ] `learn_029`: Configurar logging con handlers

#### Testing (2 ejercicios)
- [ ] `learn_030`: Escribir unit test con pytest
- [ ] `learn_031`: Usar fixtures y parametrize

---

### 🐼 PANDAS ADVANCED (20 ejercicios nuevos)

#### Joins Avanzados (4 ejercicios)
- [ ] `learn_032`: merge_asof para time series
- [ ] `learn_033`: merge con suffixes personalizados
- [ ] `learn_034`: concat con multi-index
- [ ] `learn_035`: join vs merge diferencias

#### Performance (5 ejercicios)
- [ ] `learn_036`: Usar categorical dtype para memoria
- [ ] `learn_037`: Vectorización vs apply benchmarks
- [ ] `learn_038`: eval() y query() para expresiones
- [ ] `learn_039`: Leer CSV con usecols y dtype
- [ ] `learn_040`: Chunked reading + agregación incremental

#### Time Series (4 ejercicios)
- [ ] `learn_041`: resample() para downsample/upsample
- [ ] `learn_042`: rolling() con windows personalizadas
- [ ] `learn_043`: expanding() para cumulativos
- [ ] `learn_044`: shift() y diff() para cambios

#### Data Quality (4 ejercicios)
- [ ] `learn_045`: Detectar y eliminar duplicados
- [ ] `learn_046`: Manejar nulos con fillna/dropna/interpolate
- [ ] `learn_047`: Detectar outliers con IQR
- [ ] `learn_048`: Winsorization para outliers

#### IO Database (3 ejercicios)
- [ ] `learn_049`: to_sql() con SQLAlchemy
- [ ] `learn_050`: read_sql() con queries parametrizadas
- [ ] `learn_051`: Upserts con on_conflict (PostgreSQL)

---

### 🗄️ SQL ADVANCED (15 ejercicios nuevos)

#### CTEs & Subqueries (4 ejercicios)
- [ ] `learn_052`: WITH clause (CTE) básico
- [ ] `learn_053`: Recursive CTE para jerarquías
- [ ] `learn_054`: Subquery correlacionado
- [ ] `learn_055`: Anti-join con NOT EXISTS

#### Window Functions (5 ejercicios)
- [ ] `learn_056`: ROW_NUMBER, RANK, DENSE_RANK
- [ ] `learn_057`: LAG y LEAD para comparar filas
- [ ] `learn_058`: ROWS BETWEEN para frames
- [ ] `learn_059`: RANGE BETWEEN para ventanas temporales
- [ ] `learn_060`: FIRST_VALUE, LAST_VALUE, NTH_VALUE

#### Agregaciones (3 ejercicios)
- [ ] `learn_061`: GROUPING SETS para subtotales
- [ ] `learn_062`: CUBE para todas las combinaciones
- [ ] `learn_063`: ROLLUP para totales jerárquicos

#### Set Operations (2 ejercicios)
- [ ] `learn_064`: UNION vs UNION ALL
- [ ] `learn_065`: INTERSECT y EXCEPT

#### NULL Handling (1 ejercicio)
- [ ] `learn_066`: COALESCE, NULLIF, 3-valued logic

---

### ⚡ PYSPARK (20 ejercicios nuevos)

#### Schema & Reading (4 ejercicios)
- [ ] `learn_067`: Definir schema explícito con StructType
- [ ] `learn_068`: badRecordsPath y mode PERMISSIVE
- [ ] `learn_069`: Leer Parquet con schema evolution
- [ ] `learn_070`: Inferir schema con samplingRatio

#### Transformations (4 ejercicios)
- [ ] `learn_071`: select, withColumn, withColumnRenamed
- [ ] `learn_072`: filter y where con condiciones
- [ ] `learn_073`: groupBy con agg múltiple
- [ ] `learn_074`: join con broadcast hint

#### Performance (5 ejercicios)
- [ ] `learn_075`: repartition vs coalesce
- [ ] `learn_076`: persist() vs cache() vs checkpoint()
- [ ] `learn_077`: Broadcast join para tablas pequeñas
- [ ] `learn_078`: Salting para skew
- [ ] `learn_079`: Leer explain() plan

#### Window Functions (4 ejercicios)
- [ ] `learn_080`: Window con partitionBy y orderBy
- [ ] `learn_081`: rowsBetween vs rangeBetween
- [ ] `learn_082`: lag/lead en Spark
- [ ] `learn_083`: Cumulative sum con unboundedPreceding

#### UDFs (3 ejercicios)
- [ ] `learn_084`: UDF básico con decorador
- [ ] `learn_085`: pandas_udf para vectorización
- [ ] `learn_086`: Cuándo NO usar UDFs

---

### ✅ DATA QUALITY (10 ejercicios nuevos)

#### Pytest (3 ejercicios)
- [ ] `learn_087`: Test básico con assert
- [ ] `learn_088`: Fixtures para setup/teardown
- [ ] `learn_089`: Parametrize para múltiples casos

#### Pandera (4 ejercicios)
- [ ] `learn_090`: Schema validation básico
- [ ] `learn_091`: Custom checks con lambda
- [ ] `learn_092`: Validar en pipeline con @pa.check_types
- [ ] `learn_093`: Data profiling con report

#### Great Expectations (3 ejercicios)
- [ ] `learn_094`: Expectation suite básico
- [ ] `learn_095`: Validar distribuciones
- [ ] `learn_096`: CI/CD validation

---

## 🗂️ Datasets a Crear

### Alta Prioridad
- [ ] `timesales.csv` - Serie temporal densa (100k filas, precios por minuto)
- [ ] `logs_web.txt` - Logs Apache/Nginx mezclados (10k líneas)
- [ ] `dirty_customers.csv` - Datos con nulos, duplicados, encoding mixto
- [ ] `skewed_sales.csv` - Datos con skew para Spark (1M filas)

### Media Prioridad
- [ ] `nested_json.json` - JSON anidado para flatten
- [ ] `parquet_multi.parquet` - Múltiples archivos particionados
- [ ] `db_export.sql` - Dump SQL para pruebas

---

## 📅 Cronograma de Implementación

### Semana 1: Python Core (25 ejercicios)
- Días 1-2: Files & I/O (5)
- Días 3-4: Regex (4)
- Día 5: Datetime (4)
- Día 6: Collections (3)
- Día 7: Error/Logging/Testing (5)
- Crear datasets: logs_web.txt, dirty_customers.csv

### Semana 2: Pandas Advanced (20 ejercicios)
- Días 1-2: Joins Avanzados (4)
- Días 3-4: Performance (5)
- Día 5: Time Series (4)
- Día 6: Data Quality (4)
- Día 7: IO Database (3)
- Crear datasets: timesales.csv

### Semana 3: SQL Advanced (15 ejercicios)
- Días 1-2: CTEs & Subqueries (4)
- Días 3-4: Window Functions (5)
- Día 5: Agregaciones (3)
- Día 6: Set Operations (2)
- Día 7: NULL Handling (1)

### Semana 4: PySpark (20 ejercicios)
- Días 1-2: Schema & Reading (4)
- Días 3-4: Transformations (4)
- Día 5: Performance (5)
- Día 6: Window Functions (4)
- Día 7: UDFs (3)
- Crear datasets: skewed_sales.csv, parquet_multi.parquet

### Semana 5: Data Quality (10 ejercicios)
- Días 1-2: Pytest (3)
- Días 3-4: Pandera (4)
- Días 5-7: Great Expectations (3)

---

## 🎯 Métricas de Éxito

- ✅ **100 ejercicios Learn** tipo DataCamp
- ✅ **10 datasets** realistas
- ✅ **Cobertura completa** de gaps identificados
- ✅ **Teoría concisa** en cada ejercicio
- ✅ **Validación automática** funcionando
- ✅ **Progresión clara** de básico a avanzado

---

## 📝 Notas de Implementación

### Formato de cada ejercicio:
```json
{
  "id": "learn_XXX",
  "title": "Concepto - Acción",
  "instruction": "Tarea clara con ___ para completar",
  "theory": "Explicación concisa del concepto",
  "syntax": "código_ejemplo",
  "example": {
    "code": "...",
    "explanation": "..."
  },
  "starterCode": "# Código con ___",
  "solution": "código completo",
  "test": "expresión Python que retorna True/False",
  "hints": ["hint1", "hint2", "hint3"],
  "successMessage": "Mensaje motivador"
}
```

### Progresión de dificultad:
- **learn_001-030**: Básico (completar 1 línea)
- **learn_031-060**: Intermedio (completar 2-3 líneas)
- **learn_061-090**: Avanzado (completar función completa)
- **learn_091-110**: Expert (debugging y optimización)

---

**Status:** 📋 PLAN CREADO
**Próximo paso:** Implementar Semana 1 (Python Core)
