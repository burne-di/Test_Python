# SQL Tables Reference - Modo Learning

Referencia completa de todas las tablas SQL disponibles en el modo Learning.

---

## 📊 Tablas Disponibles

### 1. **calificaciones**
**Uso:** Ejercicios de RANK, DENSE_RANK

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | INTEGER | ID único (PK) |
| estudiante | TEXT | Nombre del estudiante |
| calificacion | INTEGER | Calificación (0-100) |

**Datos de ejemplo:**
```sql
SELECT * FROM calificaciones;
```

| id | estudiante | calificacion |
|----|-----------|--------------|
| 1  | Ana       | 100          |
| 2  | Bob       | 90           |
| 3  | Carlos    | 90           |
| 4  | Diana     | 80           |

**Ejercicios que usan esta tabla:**
- `learn_025`: RANK vs DENSE_RANK

---

### 2. **ventas**
**Uso:** CTEs, GROUPING SETS, ROWS BETWEEN

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | INTEGER | ID único (PK) |
| region | TEXT | Región geográfica |
| categoria | TEXT | Categoría del producto |
| producto | TEXT | Nombre del producto |
| monto | REAL | Monto de la venta |
| dia | INTEGER | Día del mes |
| cantidad | INTEGER | Cantidad vendida |

**Datos de ejemplo:**
```sql
SELECT * FROM ventas LIMIT 5;
```

| id | region | categoria | producto | monto | dia | cantidad |
|----|--------|-----------|----------|-------|-----|----------|
| 1  | Norte  | Electrónica | Laptop | 150.5 | 1 | 10 |
| 2  | Norte  | Electrónica | Mouse | 80.0 | 2 | 25 |
| 3  | Sur    | Ropa | Camisa | 120.0 | 3 | 15 |
| 4  | Sur    | Ropa | Pantalón | 90.0 | 4 | 20 |
| 5  | Este   | Electrónica | Teclado | 200.0 | 5 | 12 |

**Ejercicios que usan esta tabla:**
- `learn_018`: CTE (WITH clause)
- `learn_026`: ROWS BETWEEN
- `learn_027`: GROUPING SETS

---

### 3. **ventas_vendedores**
**Uso:** Window functions con PARTITION BY

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | INTEGER | ID único (PK) |
| vendedor | TEXT | Nombre del vendedor |
| region | TEXT | Región asignada |
| ventas | REAL | Total de ventas |

**Datos de ejemplo:**
```sql
SELECT * FROM ventas_vendedores;
```

| id | vendedor | region | ventas |
|----|----------|--------|--------|
| 1  | Juan     | Norte  | 15000  |
| 2  | María    | Norte  | 18000  |
| 3  | Pedro    | Norte  | 12000  |
| 4  | Ana      | Sur    | 20000  |
| 5  | Luis     | Sur    | 16000  |
| 6  | Carmen   | Sur    | 14000  |
| 7  | Diego    | Este   | 19000  |
| 8  | Sofia    | Este   | 17000  |

**Ejercicios que usan esta tabla:**
- `learn_019`: Window ROW_NUMBER con PARTITION BY

---

### 4. **ventas_mensuales**
**Uso:** LAG, comparaciones temporales

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | INTEGER | ID único (PK) |
| mes | INTEGER | Número del mes (1-12) |
| ventas | REAL | Ventas del mes |

**Datos de ejemplo:**
```sql
SELECT * FROM ventas_mensuales;
```

| id | mes | ventas |
|----|-----|--------|
| 1  | 1   | 10000  |
| 2  | 2   | 12000  |
| 3  | 3   | 11500  |
| 4  | 4   | 13000  |
| 5  | 5   | 14500  |
| 6  | 6   | 13800  |

**Ejercicios que usan esta tabla:**
- `learn_020`: LAG para comparar con mes anterior

---

### 5. **productos**
**Uso:** CASE expressions

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | INTEGER | ID único (PK) |
| producto | TEXT | Nombre del producto |
| precio | REAL | Precio del producto |

**Datos de ejemplo:**
```sql
SELECT * FROM productos;
```

| id | producto | precio |
|----|----------|--------|
| 1  | Laptop Premium | 1200 |
| 2  | Laptop Standard | 800 |
| 3  | Mouse Gamer | 150 |
| 4  | Teclado Mecánico | 650 |
| 5  | Monitor 4K | 450 |
| 6  | Webcam HD | 80 |

**Ejercicios que usan esta tabla:**
- `learn_043`: CASE expressions para categorizar por precio

---

### 6. **inventario**
**Uso:** COALESCE, manejo de NULLs

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | INTEGER | ID único (PK) |
| producto | TEXT | Nombre del producto |
| stock | INTEGER | Cantidad en stock (puede ser NULL) |
| descripcion | TEXT | Descripción (puede ser NULL) |

**Datos de ejemplo:**
```sql
SELECT * FROM inventario;
```

| id | producto | stock | descripcion |
|----|----------|-------|-------------|
| 1  | Laptop   | 10    | Laptop de alta gama |
| 2  | Mouse    | NULL  | Mouse óptico |
| 3  | Teclado  | 5     | NULL |
| 4  | Monitor  | NULL  | NULL |
| 5  | Webcam   | 15    | Webcam Full HD |

**Ejercicios que usan esta tabla:**
- `learn_044`: COALESCE para reemplazar NULLs

---

### 7. **ventas_q1** y **ventas_q2**
**Uso:** UNION, UNION ALL

| Tabla | Columna | Tipo | Descripción |
|-------|---------|------|-------------|
| ventas_q1 | producto | TEXT | Nombre del producto |
| ventas_q1 | cantidad | INTEGER | Cantidad vendida en Q1 |
| ventas_q2 | producto | TEXT | Nombre del producto |
| ventas_q2 | cantidad | INTEGER | Cantidad vendida en Q2 |

**Datos de ejemplo:**
```sql
SELECT * FROM ventas_q1;
```

| producto | cantidad |
|----------|----------|
| Laptop   | 50       |
| Mouse    | 120      |
| Teclado  | 80       |

```sql
SELECT * FROM ventas_q2;
```

| producto | cantidad |
|----------|----------|
| Laptop   | 60       |
| Monitor  | 40       |
| Webcam   | 90       |

**Ejercicios que usan estas tablas:**
- `learn_045`: UNION vs UNION ALL

---

### 8. **examenes**
**Uso:** Ejercicios generales, ejemplos

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | INTEGER | ID único (PK) |
| nombre | TEXT | Nombre del estudiante |
| score | INTEGER | Puntaje del examen |

**Datos de ejemplo:**
```sql
SELECT * FROM examenes;
```

| id | nombre  | score |
|----|---------|-------|
| 1  | John    | 85    |
| 2  | Jane    | 90    |
| 3  | Bob     | 90    |
| 4  | Alice   | 85    |
| 5  | Charlie | 80    |

---

### 9. **empleados**
**Uso:** Ejemplos en teoría

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | INTEGER | ID único (PK) |
| empleado | TEXT | Nombre del empleado |
| salario | REAL | Salario anual |

**Datos de ejemplo:**
```sql
SELECT * FROM empleados;
```

| id | empleado | salario |
|----|----------|---------|
| 1  | Bob      | 100000  |
| 2  | Alice    | 90000   |
| 3  | Charlie  | 85000   |

---

### 10. **usuarios**
**Uso:** Ejemplos en teoría

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | INTEGER | ID único (PK) |
| nombre | TEXT | Nombre del usuario |
| email | TEXT | Email (puede ser NULL) |
| telefono | TEXT | Teléfono (puede ser NULL) |
| edad | INTEGER | Edad |
| activo | INTEGER | 1=activo, 0=inactivo |

**Datos de ejemplo:**
```sql
SELECT * FROM usuarios;
```

| id | nombre | email | telefono | edad | activo |
|----|--------|-------|----------|------|--------|
| 1  | Juan   | juan@example.com | 123456789 | 30 | 1 |
| 2  | María  | NULL | 987654321 | 25 | 1 |
| 3  | Pedro  | pedro@example.com | NULL | 28 | 0 |

---

## 🔍 Queries Útiles

### Ver todas las tablas
```sql
SELECT name FROM sqlite_master WHERE type='table';
```

### Ver estructura de una tabla
```sql
PRAGMA table_info(ventas);
```

### Contar registros de todas las tablas
```sql
SELECT
    'calificaciones' as tabla, COUNT(*) as registros FROM calificaciones
UNION ALL SELECT 'ventas', COUNT(*) FROM ventas
UNION ALL SELECT 'ventas_vendedores', COUNT(*) FROM ventas_vendedores
UNION ALL SELECT 'ventas_mensuales', COUNT(*) FROM ventas_mensuales
UNION ALL SELECT 'productos', COUNT(*) FROM productos
UNION ALL SELECT 'inventario', COUNT(*) FROM inventario
UNION ALL SELECT 'ventas_q1', COUNT(*) FROM ventas_q1
UNION ALL SELECT 'ventas_q2', COUNT(*) FROM ventas_q2
UNION ALL SELECT 'examenes', COUNT(*) FROM examenes
UNION ALL SELECT 'empleados', COUNT(*) FROM empleados
UNION ALL SELECT 'usuarios', COUNT(*) FROM usuarios;
```

---

## 📚 Mapeo: Ejercicio → Tabla

| Ejercicio | Título | Tabla Principal |
|-----------|--------|-----------------|
| learn_018 | CTE (WITH clause) | ventas |
| learn_019 | Window ROW_NUMBER | ventas_vendedores |
| learn_020 | LAG | ventas_mensuales |
| learn_025 | RANK vs DENSE_RANK | calificaciones |
| learn_026 | ROWS BETWEEN | ventas |
| learn_027 | GROUPING SETS | ventas |
| learn_043 | CASE Expressions | productos |
| learn_044 | COALESCE | inventario |
| learn_045 | UNION vs UNION ALL | ventas_q1, ventas_q2 |

---

## 🛠️ Agregar Nuevas Tablas

Si necesitas agregar más tablas para futuros ejercicios:

1. Edita `learn.js`
2. Localiza la función `initSQL()`
3. Agrega tu tabla antes de `displayConsoleOutput('✓ SQL.js listo')`

**Ejemplo:**
```javascript
// === TABLA: mi_nueva_tabla ===
sqlDb.run(`
    CREATE TABLE IF NOT EXISTS mi_nueva_tabla (
        id INTEGER PRIMARY KEY,
        columna1 TEXT,
        columna2 INTEGER
    );
`);

sqlDb.run(`
    INSERT INTO mi_nueva_tabla (id, columna1, columna2) VALUES
    (1, 'valor1', 100),
    (2, 'valor2', 200);
`);
```

---

## ⚠️ Limitaciones de SQLite

Recuerda que usamos SQLite (vía SQL.js), que tiene algunas diferencias con PostgreSQL/MySQL:

**No soportado:**
- ❌ `TOP` (usar `LIMIT` en su lugar)
- ❌ `ISNULL()` (usar `COALESCE()`)
- ❌ `STRING_AGG()` (usar `GROUP_CONCAT()`)
- ❌ Arrays, JSON avanzado

**Soportado:**
- ✅ Window functions completas
- ✅ CTEs (WITH)
- ✅ CASE, COALESCE
- ✅ Todos los tipos de JOIN
- ✅ Subqueries
- ✅ UNION, INTERSECT, EXCEPT

---

**Última actualización:** 2025-11-02
