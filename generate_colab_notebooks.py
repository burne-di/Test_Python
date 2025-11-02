"""
Generador de Google Colab Notebooks para ejercicios PySpark
Crea notebooks automáticamente desde learn_exercises.json
"""

import json
import nbformat as nbf
from pathlib import Path

def create_pyspark_colab_notebook(exercise):
    """Crea un notebook de Google Colab para un ejercicio PySpark"""

    nb = nbf.v4.new_notebook()

    # Metadata de Colab
    nb.metadata = {
        "colab": {
            "name": f"{exercise['id']}_{exercise['title'].replace(' ', '_')}.ipynb",
            "provenance": [],
            "toc_visible": True
        },
        "kernelspec": {
            "display_name": "Python 3",
            "name": "python3"
        }
    }

    # === CELDA 1: Título y Banner ===
    nb.cells.append(nbf.v4.new_markdown_cell(f"""
# 🎯 {exercise['title']}

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; color: white;">
    <h2>📚 Data Engineering Practice Hub</h2>
    <p>Ejercicio ID: <code>{exercise['id']}</code></p>
    <p>Dificultad: <strong>{exercise.get('difficulty', 'intermediate')}</strong></p>
</div>

---

## ⚡ PySpark Setup

Este notebook instala PySpark automáticamente. Solo ejecuta las celdas en orden.
    """))

    # === CELDA 2: Instalación PySpark ===
    nb.cells.append(nbf.v4.new_code_cell("""
# Instalar PySpark (solo la primera vez)
!pip install -q pyspark

# Importar librerías
from pyspark.sql import SparkSession
from pyspark.sql.types import *
from pyspark.sql.functions import *
import pandas as pd

# Crear SparkSession
spark = SparkSession.builder \\
    .appName('{exercise_id}') \\
    .master('local[*]') \\
    .config('spark.driver.memory', '2g') \\
    .getOrCreate()

print('✅ PySpark instalado y configurado')
print(f'📊 Spark Version: {{spark.version}}')
print(f'🖥️  Cores disponibles: {{spark.sparkContext.defaultParallelism}}')
    """.format(exercise_id=exercise['id'])))

    # === CELDA 3: Teoría ===
    theory = exercise.get('theory', 'Teoría no disponible')
    nb.cells.append(nbf.v4.new_markdown_cell(f"""
---

## 📖 Teoría

{theory}

### 🔍 Sintaxis Principal

```python
{exercise.get('syntax', 'Ver ejemplo abajo')}
```
    """))

    # === CELDA 4: Ejemplo ===
    example_code = exercise.get('example', {}).get('code', '# Ejemplo no disponible')
    example_explanation = exercise.get('example', {}).get('explanation', '')

    nb.cells.append(nbf.v4.new_markdown_cell(f"""
---

## 💡 Ejemplo de Referencia

{example_explanation}
    """))

    nb.cells.append(nbf.v4.new_code_cell(example_code))

    # === CELDA 5: Instrucciones del Ejercicio ===
    instruction = exercise.get('instruction', 'Completa el código según las indicaciones')

    nb.cells.append(nbf.v4.new_markdown_cell(f"""
---

## 🎯 TU EJERCICIO

### Instrucciones:

{instruction}

### 📝 Completa el código en la celda siguiente:
    """))

    # === CELDA 6: Código del estudiante ===
    starter_code = exercise.get('starterCode', '# Tu código aquí')

    nb.cells.append(nbf.v4.new_code_cell(f"""
# === TU CÓDIGO AQUÍ ===
# Completa el código según las instrucciones

{starter_code}

# Muestra el resultado
# df.show()  # Descomentar cuando tengas el DataFrame
    """))

    # === CELDA 7: Pistas (colapsadas) ===
    hints = exercise.get('hints', [])
    if hints:
        hints_md = "---\n\n## 💡 Pistas (Haz clic para expandir)\n\n"
        for i, hint in enumerate(hints, 1):
            hints_md += f"""
<details>
<summary><strong>Pista {i}</strong></summary>

{hint}

</details>

"""
        nb.cells.append(nbf.v4.new_markdown_cell(hints_md))

    # === CELDA 8: Validación ===
    test = exercise.get('test', 'True  # Test not defined')

    nb.cells.append(nbf.v4.new_markdown_cell("""
---

## ✅ Validación

Ejecuta esta celda para verificar tu solución:
    """))

    nb.cells.append(nbf.v4.new_code_cell(f"""
# === VALIDACIÓN AUTOMÁTICA ===
try:
    # Ejecutar test
    result = {test}

    if result:
        print('\\n' + '='*50)
        print('✅ ¡CORRECTO! Solución válida')
        print('='*50)
        print('\\n🎉 Has completado este ejercicio exitosamente!')
        print('\\n📊 Puedes continuar con el siguiente ejercicio.')
    else:
        print('\\n' + '='*50)
        print('❌ Incorrecto - Revisa tu código')
        print('='*50)
        print('\\n💡 Usa las pistas si necesitas ayuda')
except Exception as e:
    print('\\n' + '='*50)
    print('❌ Error en la validación')
    print('='*50)
    print(f'\\nError: {{str(e)}}')
    print('\\n💡 Revisa que hayas definido todas las variables necesarias')
    """))

    # === CELDA 9: Solución (oculta) ===
    solution = exercise.get('solution', '# Solución no disponible')

    nb.cells.append(nbf.v4.new_markdown_cell("""
---

## 🔓 Solución (Solo si necesitas ayuda)

<details>
<summary><strong>⚠️ Haz clic aquí para ver la solución</strong></summary>

Ejecuta la celda siguiente para ver la solución completa.

</details>
    """))

    nb.cells.append(nbf.v4.new_code_cell(f"""
# Descomentar para ver la solución
# print("Solución:")
# print('''
# {solution}
# ''')
    """))

    # === CELDA 10: Siguiente paso ===
    nb.cells.append(nbf.v4.new_markdown_cell("""
---

## 🎓 ¿Completaste el ejercicio?

### Próximos pasos:

1. ✅ Marca este ejercicio como completado en la plataforma
2. 📚 Revisa la teoría si tienes dudas
3. ➡️ Continúa con el siguiente ejercicio

### 🔗 Enlaces útiles:

- [Volver a la plataforma](https://tu-plataforma.github.io/courses.html)
- [PySpark Documentation](https://spark.apache.org/docs/latest/api/python/)
- [SQL Reference](https://spark.apache.org/docs/latest/sql-ref.html)

---

<div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #2563eb; margin-top: 20px;">
    <strong>💬 ¿Tienes dudas?</strong><br>
    Revisa las pistas, consulta la documentación o vuelve a la teoría.
</div>
    """))

    return nb


def generate_all_pyspark_notebooks():
    """Genera notebooks para todos los ejercicios PySpark"""

    # Cargar ejercicios
    with open('docs/ejercicios/learn_exercises.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Crear carpeta de salida
    output_dir = Path('docs/colab_notebooks')
    output_dir.mkdir(exist_ok=True)

    # Filtrar solo ejercicios PySpark
    pyspark_exercises = [
        ex for ex in data['exercises']
        if 'PySpark' in ex.get('title', '') or 'Spark' in ex.get('title', '')
    ]

    print(f"📚 Encontrados {len(pyspark_exercises)} ejercicios PySpark")

    # Generar notebooks
    for exercise in pyspark_exercises:
        nb = create_pyspark_colab_notebook(exercise)

        # Guardar
        filename = output_dir / f"{exercise['id']}.ipynb"
        with open(filename, 'w', encoding='utf-8') as f:
            nbf.write(nb, f)

        print(f"✓ Creado: {filename}")

    print(f"\n✅ {len(pyspark_exercises)} notebooks creados en {output_dir}")
    print(f"\n📤 Próximo paso: Sube estos notebooks a Google Drive")
    print(f"   y compártelos como 'Anyone with the link can view'")


if __name__ == '__main__':
    # Instalar nbformat si no está instalado
    try:
        import nbformat
    except ImportError:
        print("📦 Instalando nbformat...")
        import subprocess
        subprocess.check_call(['pip', 'install', 'nbformat'])
        import nbformat as nbf

    generate_all_pyspark_notebooks()
