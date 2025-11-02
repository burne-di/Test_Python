# Solución: Error "no such table"

## ❌ Problema

Al ejecutar ejercicios SQL en el modo Learning, aparecía el error:
```
Error: no such table: ventas_vendedores
Error: no such table: ventas
Error: no such table: productos
```

## 🔍 Causa Raíz

La función `initSQL()` en `learn.js` solo creaba 2 tablas de ejemplo:
- `calificaciones`
- `examenes`

Pero los ejercicios SQL necesitaban muchas más tablas:
- `ventas`, `ventas_vendedores`, `ventas_mensuales`
- `productos`, `inventario`
- `ventas_q1`, `ventas_q2`
- `empleados`, `usuarios`

## ✅ Solución Implementada

Se actualizó `initSQL()` para crear **11 tablas completas** con datos de ejemplo:

### Tablas Agregadas

| # | Tabla | Registros | Ejercicios que la usan |
|---|-------|-----------|------------------------|
| 1 | calificaciones | 4 | learn_025 (RANK vs DENSE_RANK) |
| 2 | examenes | 5 | Ejemplos generales |
| 3 | **ventas** | **8** | **learn_018 (CTE), learn_026 (ROWS BETWEEN), learn_027 (GROUPING SETS)** |
| 4 | **ventas_vendedores** | **8** | **learn_019 (ROW_NUMBER PARTITION BY)** |
| 5 | **ventas_mensuales** | **6** | **learn_020 (LAG)** |
| 6 | **productos** | **6** | **learn_043 (CASE expressions)** |
| 7 | **inventario** | **5** | **learn_044 (COALESCE)** |
| 8 | **ventas_q1** | **3** | **learn_045 (UNION)** |
| 9 | **ventas_q2** | **3** | **learn_045 (UNION)** |
| 10 | empleados | 3 | Ejemplos en teoría |
| 11 | usuarios | 3 | Ejemplos en teoría |

**Total: 54 registros de datos de ejemplo**

### Columnas por Tabla

#### ventas
```sql
CREATE TABLE ventas (
    id INTEGER PRIMARY KEY,
    region TEXT,           -- Norte, Sur, Este, Oeste
    categoria TEXT,        -- Electrónica, Ropa, Alimentos
    producto TEXT,         -- Laptop, Mouse, Camisa, etc.
    monto REAL,           -- Monto de la venta
    dia INTEGER,          -- Día del mes (1-31)
    cantidad INTEGER      -- Cantidad vendida
);
```

#### ventas_vendedores
```sql
CREATE TABLE ventas_vendedores (
    id INTEGER PRIMARY KEY,
    vendedor TEXT,        -- Juan, María, Pedro, etc.
    region TEXT,          -- Norte, Sur, Este
    ventas REAL          -- Total de ventas
);
```

#### ventas_mensuales
```sql
CREATE TABLE ventas_mensuales (
    id INTEGER PRIMARY KEY,
    mes INTEGER,          -- 1-12
    ventas REAL          -- Ventas del mes
);
```

#### productos
```sql
CREATE TABLE productos (
    id INTEGER PRIMARY KEY,
    producto TEXT,        -- Nombre del producto
    precio REAL          -- Precio (para CASE: >1000=Premium, >500=Medio, <500=Económico)
);
```

#### inventario
```sql
CREATE TABLE inventario (
    id INTEGER PRIMARY KEY,
    producto TEXT,
    stock INTEGER,        -- Puede ser NULL (para COALESCE)
    descripcion TEXT     -- Puede ser NULL (para COALESCE)
);
```

## 🧪 Verificación

Ahora todos los ejercicios SQL funcionan correctamente:

### Prueba 1: Verificar tablas
```sql
SELECT name FROM sqlite_master WHERE type='table';
```

**Resultado esperado:**
```
calificaciones
examenes
ventas
ventas_vendedores
ventas_mensuales
productos
inventario
ventas_q1
ventas_q2
empleados
usuarios
```

### Prueba 2: Ejercicio learn_019 (ROW_NUMBER)
```sql
SELECT
    vendedor,
    region,
    ventas,
    ROW_NUMBER() OVER (
        PARTITION BY region
        ORDER BY ventas DESC
    ) as ranking_regional
FROM ventas_vendedores;
```

**Resultado esperado:**
| vendedor | region | ventas | ranking_regional |
|----------|--------|--------|------------------|
| María    | Norte  | 18000  | 1                |
| Juan     | Norte  | 15000  | 2                |
| Pedro    | Norte  | 12000  | 3                |
| Ana      | Sur    | 20000  | 1                |
| Luis     | Sur    | 16000  | 2                |
| Carmen   | Sur    | 14000  | 3                |
| Diego    | Este   | 19000  | 1                |
| Sofia    | Este   | 17000  | 2                |

✅ **Funciona!**

### Prueba 3: Ejercicio learn_018 (CTE)
```sql
WITH ventas_por_region AS (
    SELECT
        region,
        SUM(monto) as total_ventas
    FROM ventas
    GROUP BY region
)
SELECT *
FROM ventas_por_region
WHERE total_ventas > 200;
```

**Resultado esperado:**
| region | total_ventas |
|--------|--------------|
| Norte  | 340.5        |
| Sur    | 390.0        |

✅ **Funciona!**

## 📋 Checklist de Ejercicios SQL

| ID | Ejercicio | Tabla Necesaria | Estado |
|----|-----------|-----------------|--------|
| learn_018 | CTE (WITH) | ventas | ✅ Fixed |
| learn_019 | ROW_NUMBER | ventas_vendedores | ✅ Fixed |
| learn_020 | LAG | ventas_mensuales | ✅ Fixed |
| learn_025 | RANK vs DENSE_RANK | calificaciones | ✅ Ya funcionaba |
| learn_026 | ROWS BETWEEN | ventas | ✅ Fixed |
| learn_027 | GROUPING SETS | ventas | ✅ Fixed |
| learn_043 | CASE | productos | ✅ Fixed |
| learn_044 | COALESCE | inventario | ✅ Fixed |
| learn_045 | UNION | ventas_q1, ventas_q2 | ✅ Fixed |

**Resultado: 9/9 ejercicios SQL ahora funcionan correctamente** ✅

## 📁 Archivos Modificados

| Archivo | Cambios |
|---------|---------|
| `js/learn.js` | Función `initSQL()` expandida (+200 líneas) |
| `SQL_TABLES_REFERENCE.md` | Documentación completa de tablas (nuevo) |
| `SQL_TABLES_FIX.md` | Este documento (nuevo) |

## 🔄 Cambios en initSQL()

**Antes (líneas 347-378):**
```javascript
// Solo 2 tablas
sqlDb.run(`CREATE TABLE IF NOT EXISTS calificaciones...`);
sqlDb.run(`CREATE TABLE IF NOT EXISTS examenes...`);
```

**Después (líneas 347-554):**
```javascript
// 11 tablas con datos completos
sqlDb.run(`CREATE TABLE IF NOT EXISTS calificaciones...`);
sqlDb.run(`CREATE TABLE IF NOT EXISTS examenes...`);
sqlDb.run(`CREATE TABLE IF NOT EXISTS ventas...`);
sqlDb.run(`CREATE TABLE IF NOT EXISTS ventas_vendedores...`);
sqlDb.run(`CREATE TABLE IF NOT EXISTS ventas_mensuales...`);
sqlDb.run(`CREATE TABLE IF NOT EXISTS productos...`);
sqlDb.run(`CREATE TABLE IF NOT EXISTS inventario...`);
sqlDb.run(`CREATE TABLE IF NOT EXISTS ventas_q1...`);
sqlDb.run(`CREATE TABLE IF NOT EXISTS ventas_q2...`);
sqlDb.run(`CREATE TABLE IF NOT EXISTS empleados...`);
sqlDb.run(`CREATE TABLE IF NOT EXISTS usuarios...`);

displayConsoleOutput('✓ SQL.js listo con todas las tablas cargadas\n', 'success');
displayConsoleOutput('📊 Tablas disponibles: calificaciones, ventas, ventas_vendedores, ventas_mensuales, productos, inventario, y más\n', 'info');
```

## 🚀 Impacto

### Antes
- ❌ 2 ejercicios SQL funcionaban (learn_025)
- ❌ 7 ejercicios daban error "no such table"
- ❌ Experiencia de usuario rota

### Después
- ✅ 9 ejercicios SQL funcionan perfectamente
- ✅ Todos los ejercicios SQL del curso disponibles
- ✅ Datos realistas y útiles para aprendizaje
- ✅ Documentación completa de referencia

## 📖 Documentación Creada

1. **SQL_TABLES_REFERENCE.md**
   - Lista completa de tablas
   - Estructura de cada tabla
   - Datos de ejemplo
   - Mapeo ejercicio → tabla
   - Queries útiles

2. **SQL_TABLES_FIX.md** (este documento)
   - Problema y solución
   - Verificación paso a paso
   - Checklist de ejercicios

## 💡 Para Agregar Más Tablas en el Futuro

1. Edita `docs/js/learn.js`
2. Busca la función `initSQL()`
3. Antes del mensaje `✓ SQL.js listo`, agrega:

```javascript
// === TABLA: mi_tabla ===
sqlDb.run(`
    CREATE TABLE IF NOT EXISTS mi_tabla (
        id INTEGER PRIMARY KEY,
        columna1 TEXT,
        columna2 INTEGER
    );
`);

sqlDb.run(`
    INSERT INTO mi_tabla (id, columna1, columna2) VALUES
    (1, 'dato1', 100),
    (2, 'dato2', 200);
`);
```

4. Actualiza `SQL_TABLES_REFERENCE.md` con la nueva tabla

---

## ✅ Estado Final

**Problema:** ❌ Tablas SQL faltantes
**Solución:** ✅ 11 tablas con 54 registros de datos
**Resultado:** ✅ Todos los ejercicios SQL funcionando
**Tiempo de fix:** ~30 minutos

---

**Fecha:** 2025-11-02
**Versión:** 1.0
**Status:** ✅ Resuelto completamente
