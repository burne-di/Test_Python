# Guía para Agregar Nuevos Cursos

Esta guía explica cómo agregar nuevos cursos y ejercicios al sistema de aprendizaje de Data Engineering Practice Hub.

## Tabla de Contenidos

1. [Estructura de Datos](#estructura-de-datos)
2. [Agregar una Nueva Categoría](#agregar-una-nueva-categoría)
3. [Agregar un Nuevo Curso](#agregar-un-nuevo-curso)
4. [Crear Ejercicios de Aprendizaje](#crear-ejercicios-de-aprendizaje)
5. [Marcar Cursos como "Próximamente"](#marcar-cursos-como-próximamente)
6. [Validación y Testing](#validación-y-testing)

---

## Estructura de Datos

El sistema de cursos utiliza el archivo `courses.json` ubicado en `docs/courses.json`. La estructura es la siguiente:

```json
{
  "categories": [
    {
      "id": "category-id",
      "name": "Category Name",
      "icon": "🎯",
      "color": "#hexcolor",
      "description": "Descripción de la categoría",
      "courses": [...]
    }
  ]
}
```

### Propiedades de una Categoría

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id` | string | Sí | Identificador único (kebab-case) |
| `name` | string | Sí | Nombre visible de la categoría |
| `icon` | string | Sí | Emoji representativo |
| `color` | string | Sí | Color en formato hexadecimal |
| `description` | string | Sí | Descripción breve de la categoría |
| `courses` | array | Sí | Array de cursos |

### Propiedades de un Curso

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id` | string | Sí | Identificador único (kebab-case) |
| `title` | string | Sí | Título del curso |
| `description` | string | Sí | Descripción breve del contenido |
| `difficulty` | string | Sí | `"beginner"`, `"intermediate"`, o `"advanced"` |
| `lessons` | number | Sí | Número de lecciones (0 para próximamente) |
| `duration` | string | Sí | Duración estimada (ej. "3 horas") |
| `exerciseIds` | array | Sí | Array de IDs de ejercicios asociados |
| `comingSoon` | boolean | No | `true` para cursos próximamente |

---

## Agregar una Nueva Categoría

Para agregar una nueva categoría de cursos:

1. Abre `docs/courses.json`
2. Agrega un nuevo objeto al array `categories`:

```json
{
  "id": "mi-nueva-categoria",
  "name": "Mi Nueva Categoría",
  "icon": "🚀",
  "color": "#ff5722",
  "description": "Descripción de lo que abarca esta categoría",
  "courses": []
}
```

3. **Selección de íconos**: Usa emojis relevantes
   - Python: 🐍
   - Pandas: 🐼
   - SQL: 🗄️
   - Spark: ⚡
   - Cloud: ☁️
   - Tools: 🔧
   - AI: 🤖
   - Data: 📊

4. **Selección de colores**: Usa colores contrastantes y profesionales
   - Azules: `#3776ab`, `#2563eb`, `#4285f4`
   - Verdes: `#10b981`, `#059669`
   - Naranjas: `#e25a1c`, `#f59e0b`
   - Púrpuras: `#7c3aed`, `#9333ea`
   - Rojos: `#cc2927`, `#ef4444`

---

## Agregar un Nuevo Curso

Para agregar un nuevo curso dentro de una categoría existente:

1. Localiza la categoría en `docs/courses.json`
2. Agrega un nuevo objeto al array `courses`:

```json
{
  "id": "mi-nuevo-curso",
  "title": "Mi Nuevo Curso",
  "description": "Descripción detallada de los temas cubiertos",
  "difficulty": "intermediate",
  "lessons": 10,
  "duration": "3 horas",
  "exerciseIds": ["learn_050", "learn_051", "learn_052"]
}
```

### Convenciones de Nomenclatura

- **IDs de cursos**: Usa kebab-case (ej. `python-basics`, `pandas-advanced`)
- **IDs de ejercicios**: Usa el prefijo `learn_` seguido de un número (ej. `learn_001`, `learn_050`)
- Los números de ejercicios deben ser únicos en todo el sistema

---

## Crear Ejercicios de Aprendizaje

Los ejercicios de aprendizaje son archivos JSON almacenados en `data/exercises/`. Sigue estos pasos:

### 1. Estructura del Ejercicio

Crea un archivo JSON con el siguiente formato:

```json
{
  "id": "learn_050",
  "category": "python",
  "title": "List Comprehensions",
  "description": "Aprende a usar list comprehensions para transformar listas de manera eficiente",
  "difficulty": "beginner",
  "type": "python",
  "learningMode": true,
  "theory": "Las list comprehensions son una forma concisa de crear listas...",
  "example": "# Ejemplo:\nnumbers = [1, 2, 3, 4, 5]\nsquares = [x**2 for x in numbers]\nprint(squares)  # [1, 4, 9, 16, 25]",
  "challenge": "Crea una list comprehension que filtre los números pares de una lista y los multiplique por 2",
  "initial_code": "numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\n\n# Tu código aquí:\nresult = ",
  "test_cases": [
    {
      "input": "[1, 2, 3, 4, 5]",
      "expected": "[4, 8]",
      "description": "Números pares multiplicados por 2"
    }
  ],
  "hints": [
    "Usa un filtro `if x % 2 == 0` dentro de la list comprehension",
    "No olvides multiplicar cada número filtrado por 2"
  ],
  "solution": "result = [x * 2 for x in numbers if x % 2 == 0]",
  "tags": ["list-comprehension", "filtering", "python-basics"]
}
```

### 2. Propiedades Específicas del Modo Aprendizaje

| Campo | Descripción |
|-------|-------------|
| `learningMode` | Siempre `true` para ejercicios de aprendizaje |
| `theory` | Explicación conceptual del tema (puede incluir markdown) |
| `example` | Código de ejemplo funcional |
| `challenge` | Descripción clara del ejercicio a resolver |
| `initial_code` | Código base para que el estudiante complete |
| `hints` | Array de pistas progresivas |
| `solution` | Solución correcta del ejercicio |

### 3. Convenciones para Test Cases

Los test cases validan que el código del estudiante funciona correctamente:

```json
"test_cases": [
  {
    "input": "Descripción de la entrada",
    "expected": "Resultado esperado",
    "description": "Qué valida este test"
  }
]
```

### 4. Tipos de Ejercicios Soportados

- `python`: Ejercicios de Python puro
- `pandas`: Ejercicios con DataFrames de Pandas
- `sql`: Consultas SQL
- `pyspark`: Transformaciones con PySpark

---

## Marcar Cursos como "Próximamente"

Para cursos que aún no tienen contenido:

```json
{
  "id": "future-course",
  "title": "Curso Futuro",
  "description": "Descripción del contenido planificado",
  "difficulty": "intermediate",
  "lessons": 0,
  "duration": "Próximamente",
  "exerciseIds": [],
  "comingSoon": true
}
```

### Comportamiento

- Los cursos con `comingSoon: true` se muestran en gris
- No son clickeables
- Muestran un badge de "Próximamente"

---

## Validación y Testing

### 1. Validar el JSON

Asegúrate de que el archivo `courses.json` tenga un JSON válido:

```bash
# En la consola del navegador
fetch('courses.json')
  .then(r => r.json())
  .then(data => console.log('JSON válido:', data))
  .catch(err => console.error('JSON inválido:', err))
```

### 2. Verificar IDs Únicos

Todos los IDs deben ser únicos:

- IDs de categorías
- IDs de cursos
- IDs de ejercicios

### 3. Probar la Navegación

1. Abre `courses.html` en el navegador
2. Verifica que la nueva categoría aparezca
3. Haz clic en el nuevo curso
4. Verifica que los ejercicios se carguen correctamente

### 4. Validar Progreso

El sistema de progreso debe funcionar:

- Los ejercicios completados se marcan
- El progreso se guarda en localStorage
- El porcentaje de completitud se actualiza

---

## Ejemplo Completo

Aquí un ejemplo de agregar un curso completo de "Data Visualization":

### 1. Agregar la categoría en `courses.json`

```json
{
  "id": "data-viz",
  "name": "Data Visualization",
  "icon": "📊",
  "color": "#06b6d4",
  "description": "Visualización de datos con Python",
  "courses": [
    {
      "id": "matplotlib-basics",
      "title": "Matplotlib Basics",
      "description": "Gráficos básicos con matplotlib",
      "difficulty": "beginner",
      "lessons": 8,
      "duration": "2 horas",
      "exerciseIds": ["learn_100", "learn_101"]
    }
  ]
}
```

### 2. Crear ejercicio `learn_100.json` en `data/exercises/`

```json
{
  "id": "learn_100",
  "category": "python",
  "title": "Tu Primera Gráfica",
  "description": "Crea una gráfica de línea simple con matplotlib",
  "difficulty": "beginner",
  "type": "python",
  "learningMode": true,
  "theory": "Matplotlib es la biblioteca de visualización más popular de Python...",
  "example": "import matplotlib.pyplot as plt\nplt.plot([1, 2, 3], [1, 4, 9])\nplt.show()",
  "challenge": "Crea una gráfica que muestre los cuadrados de los números del 1 al 5",
  "initial_code": "import matplotlib.pyplot as plt\n\n# Tu código aquí\n",
  "hints": [
    "Usa plt.plot(x, y) donde y = x²"
  ],
  "solution": "import matplotlib.pyplot as plt\nx = [1, 2, 3, 4, 5]\ny = [i**2 for i in x]\nplt.plot(x, y)\nplt.show()",
  "tags": ["matplotlib", "visualization"]
}
```

### 3. Verificar en el navegador

- Abre `courses.html`
- Verifica que aparezca "Data Visualization"
- Haz clic en "Matplotlib Basics"
- Completa el ejercicio "Tu Primera Gráfica"

---

## Mejores Prácticas

1. **Progresión lógica**: Ordena los ejercicios de más simple a más complejo
2. **Ejemplos claros**: Los ejemplos deben ser autoexplicativos
3. **Pistas útiles**: Las pistas deben guiar sin revelar la solución completa
4. **Test exhaustivos**: Cubre casos edge en los test cases
5. **Descripciones precisas**: Sé claro sobre qué debe hacer el estudiante
6. **Código inicial útil**: Proporciona suficiente código para que no empiecen de cero

---

## Recursos Adicionales

- **Markdown**: Los campos `theory` y `description` soportan markdown
- **Colores**: Usa herramientas como [Coolors](https://coolors.co/) para paletas
- **Emojis**: [Emojipedia](https://emojipedia.org/) para encontrar emojis

---

## Troubleshooting

### El curso no aparece

- Verifica que el JSON sea válido
- Revisa la consola del navegador por errores
- Asegúrate de que el ID sea único

### Los ejercicios no cargan

- Verifica que los archivos existan en `data/exercises/`
- Confirma que los IDs en `exerciseIds` coincidan con los archivos
- Revisa los logs de la consola

### El progreso no se guarda

- Verifica que localStorage esté habilitado
- Revisa `TROUBLESHOOTING_PROGRESS.md` para más detalles

---

## Contacto

Si encuentras problemas o tienes sugerencias, revisa los archivos:
- `TROUBLESHOOTING_CSV.md`
- `TROUBLESHOOTING_PROGRESS.md`

---

**Última actualización**: 2025-11-02
