# 📚 Conocimiento Teórico Implementado

## 🎯 Objetivo

Crear una sección educativa que enseñe los **conceptos fundamentales** necesarios para resolver cada ejercicio. El enfoque es **aprender haciendo** - primero entiendes la teoría, luego la aplicas.

---

## ✨ Qué se Agregó

### 1. **Sección "Conocimiento Teórico Requerido"**

Cada ejercicio ahora incluye una sección expandible/colapsable que explica:

- **Concepto:** Nombre de la técnica/función
- **Descripción:** Qué hace y por qué es importante
- **Sintaxis:** Cómo se usa formalmente
- **Ejemplo:** Código ejecutable con datos de ejemplo
- **Output:** Resultado esperado del ejemplo
- **Nota:** Tips adicionales y mejores prácticas

### 2. **Diseño Visual Atractivo**

- Fondo azul claro (#eff6ff)
- Borde azul a la izquierda
- Botón toggle para mostrar/ocultar
- Código con syntax highlighting
- Outputs en verde para claridad
- Notas en amarillo para destacar

### 3. **Contenido Progresivo**

Los conceptos están ordenados de **más simple a más complejo**, construyendo conocimiento gradualmente.

---

## 📚 Conceptos Implementados - Python 001

### 1. **Pandas drop_duplicates()**
- Eliminar duplicados en DataFrames
- Ejemplo con subset de columnas
- Opciones keep='first', 'last', False

### 2. **Expresiones Regulares (Regex)**
- Buscar y reemplazar patrones
- re.sub() para limpiar texto
- Normalizar teléfonos y emails
- Patrones comunes: \D, \d, .

### 3. **DataFrame.apply()**
- Aplicar funciones custom
- Transformaciones por fila/columna
- Diferencia con operaciones vectorizadas

### 4. **fillna() y transform()**
- Imputación de valores faltantes
- Rellenar por grupo (segmento)
- Diferencia entre transform y aggregate

### 5. **Diccionarios para Retornar Valores**
- Retornar múltiples valores de funciones
- Más legible que tuplas
- Útil para reportes

---

## 🎨 Estructura de Cada Concepto

```json
{
  "concept": "Nombre del Concepto",
  "description": "Explicación clara y concisa",
  "syntax": "sintaxis_formal(parametros)",
  "example": "import pandas as pd\n\n# Código de ejemplo ejecutable",
  "output": "Resultado que produce el ejemplo",
  "note": "Tips adicionales y mejores prácticas"
}
```

---

## 💡 Filosofía Pedagógica

### Problema → Concepto → Aplicación

1. **Problema:** "Necesito eliminar duplicados"
2. **Concepto:** Aprende `drop_duplicates()`
3. **Aplicación:** Úsalo en el ejercicio

### Ver → Entender → Hacer

1. **Ver:** Ejemplo de código con datos reales
2. **Entender:** Explicación de qué hace cada línea
3. **Hacer:** Aplicar en tu solución del ejercicio

### Input → Proceso → Output

Cada ejemplo muestra claramente:
- 📥 Input: Datos de entrada
- ⚙️ Proceso: Código que transforma
- 📤 Output: Resultado final

---

## 🚀 Cómo Usar

### Para el Usuario:

1. **Abre un ejercicio** (ej: Python 001)
2. **Busca la sección** "📚 Conocimiento Teórico Requerido"
3. **Click en "Mostrar Conceptos"**
4. **Lee cada concepto** de arriba hacia abajo
5. **Ejecuta los ejemplos mentalmente** (o en tu IDE)
6. **Aplica lo aprendido** en el ejercicio

### Flujo Recomendado:

```
1. Lee descripción del problema
   ↓
2. Revisa conocimiento teórico (si no sabes por dónde empezar)
   ↓
3. Ve los ejemplos de input/output
   ↓
4. Intenta resolver
   ↓
5. Si te atascas, pide hints
   ↓
6. Completa el ejercicio
```

---

## 📊 Beneficios

### Antes (sin conocimiento teórico):
- ❌ No sabías qué función usar
- ❌ Tenías que buscar en Google/Stack Overflow
- ❌ Perdías tiempo entendiendo sintaxis
- ❌ No aprendías conceptos fundamentales

### Ahora (con conocimiento teórico):
- ✅ Sabes exactamente qué usar y cómo
- ✅ Todo está en un solo lugar
- ✅ Ejemplos ejecutables inmediatos
- ✅ Aprendes conceptos transferibles

---

## 🎯 Próximos Pasos

### Agregar Conocimiento a Más Ejercicios:

#### SQL 001 - Window Functions
- ROW_NUMBER() y RANK()
- SUM() OVER con window frames
- LAG() y LEAD()
- PARTITION BY
- Window frames (ROWS, RANGE)

#### SQL 002 - Detección de Anomalías
- AVG() y STDDEV()
- Percentiles con NTILE()
- CASE WHEN para clasificación
- Date functions (strftime)
- CTEs (Common Table Expressions)

#### Python 002 - Caching
- Decoradores (@decorator)
- OrderedDict vs dict
- Hashing con hashlib
- Serialización con pickle
- Threading y Lock

#### PySpark - Procesamiento Logs
- SparkSession
- DataFrame operations
- Window functions en Spark
- Partitioning
- Caching estratégico

---

## 📝 Cómo Agregar Conocimiento a Un Ejercicio

Edita `docs/ejercicios/exercises.json`:

```json
{
  "id": "tu_ejercicio",
  "knowledge": [
    {
      "concept": "Nombre del Concepto",
      "description": "Qué hace y por qué es importante",
      "syntax": "sintaxis_formal(params)",
      "example": "# Código ejecutable\nimport pandas as pd\ndf = ...",
      "output": "Resultado del ejemplo",
      "note": "Tips y mejores prácticas"
    },
    {
      "concept": "Siguiente Concepto",
      ...
    }
  ]
}
```

---

## 🎓 Conceptos a Cubrir por Categoría

### SQL Fundamentals:
- [ ] JOINs (INNER, LEFT, RIGHT, FULL)
- [ ] Subqueries vs CTEs
- [ ] Window Functions completas
- [ ] Aggregate Functions
- [ ] Date/Time functions
- [ ] String functions
- [ ] CASE WHEN logic

### Python Fundamentals:
- [x] Pandas basics (drop_duplicates, fillna)
- [x] apply() y transform()
- [x] Regular expressions
- [x] Dictionaries
- [ ] List comprehensions
- [ ] Lambda functions
- [ ] Error handling (try/except)
- [ ] Context managers
- [ ] Generators

### PySpark Fundamentals:
- [ ] RDD vs DataFrame
- [ ] Transformations vs Actions
- [ ] Lazy evaluation
- [ ] Partitioning strategies
- [ ] Caching y Persistence
- [ ] Window functions
- [ ] UDFs (User Defined Functions)
- [ ] Broadcast variables

### Data Engineering Concepts:
- [ ] ETL vs ELT
- [ ] Data Quality checks
- [ ] Schema evolution
- [ ] Incremental processing
- [ ] Idempotency
- [ ] Data lineage
- [ ] SCD (Slowly Changing Dimensions)

---

## 📈 Métricas de Éxito

Un buen contenido de conocimiento teórico debe:

1. ✅ Ser **autocontenido** (no requiere buscar en otra parte)
2. ✅ Tener **ejemplos ejecutables** (puedes copiar/pegar y funciona)
3. ✅ Mostrar **input y output claros**
4. ✅ Incluir **casos edge** importantes
5. ✅ Estar **ordenado progresivamente** (simple → complejo)
6. ✅ Ser **conciso pero completo** (no demasiado texto)

---

## 🔄 Feedback Loop

Después de usar el conocimiento teórico:

1. Usuario lee conceptos
2. Intenta resolver ejercicio
3. Si no puede, revisa conceptos específicos
4. Pide hints si necesita más ayuda
5. Completa ejercicio con conocimiento aprendido
6. **Conocimiento queda grabado por aplicación práctica** ✨

---

## 💬 Notas de Diseño

### Por Qué Expandible/Colapsable:

- No abruma al usuario que ya conoce los conceptos
- Permite enfocarse en el problema primero
- Se puede consultar cuando sea necesario
- No ocupa espacio si no se necesita

### Por Qué Input/Output Claros:

- Aprendizaje visual
- Fácil de entender rápidamente
- Puedes ejecutar mentalmente
- Verificas tu comprensión

### Por Qué Notas y Tips:

- Mejores prácticas
- Errores comunes a evitar
- Información contextual
- Tips de performance

---

## ✅ Checklist de Implementación

Estado actual:

- [x] Sección HTML agregada
- [x] Estilos CSS completos
- [x] Función displayKnowledge() implementada
- [x] Función toggleKnowledge() implementada
- [x] Python 001 con 5 conceptos completos
- [ ] SQL 001 con conceptos (pendiente)
- [ ] SQL 002 con conceptos (pendiente)
- [ ] Python 002 con conceptos (pendiente)
- [ ] PySpark 001 con conceptos (pendiente)

---

## 🎉 Resultado Final

El usuario ahora puede:

1. **Ver el problema** (descripción e instrucciones)
2. **Aprender los conceptos** (conocimiento teórico)
3. **Ver ejemplos** (input/output esperado)
4. **Ver los datos** (dataset completo)
5. **Pedir ayuda** (hints progresivos)
6. **Resolver y aprender** aplicando conocimiento

**Todo en un solo lugar. Todo pedagógico. Todo práctico.** 🚀

---

¿Listo para agregar conocimiento teórico a los demás ejercicios? 📚
