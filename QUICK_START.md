# 🚀 Guía Rápida de Inicio

## Opción 1: Probar Localmente (Recomendado primero)

### Windows (PowerShell o CMD):

```bash
# Navegar a la carpeta docs
cd "D:\Users\One Drive\OneDrive - Universidad Tecnologica del Peru\TEST APP\Test_Python\docs"

# Iniciar servidor local con Python
python -m http.server 8000
```

Luego abre tu navegador en: `http://localhost:8000`

### Verificar que funciona:

1. ✅ Debes ver la página principal con 8 ejercicios
2. ✅ Click en un ejercicio SQL - debe abrir el editor
3. ✅ Escribe `SELECT * FROM sales;` y ejecuta
4. ✅ Debe mostrar datos en la salida

---

## Opción 2: Publicar en GitHub Pages

### Paso 1: Crear repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre: `data-engineering-practice`
3. Público
4. NO inicialices con README
5. Click "Create repository"

### Paso 2: Subir el código

```bash
# En la carpeta Test_Python
cd "D:\Users\One Drive\OneDrive - Universidad Tecnologica del Peru\TEST APP\Test_Python"

# Inicializar git
git init

# Agregar archivos
git add .

# Primer commit
git commit -m "Initial commit: Data Engineering Practice Hub"

# Conectar con GitHub (REEMPLAZA 'TU_USUARIO' con tu usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/data-engineering-practice.git

# Subir
git branch -M main
git push -u origin main
```

### Paso 3: Activar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Settings > Pages
3. Source: `main` branch
4. Folder: `/docs`
5. Save

Espera 2-3 minutos y tu sitio estará en:
```
https://TU_USUARIO.github.io/data-engineering-practice/
```

---

## 🔧 Solución de Problemas

### Error: "python no es reconocido"

Usa Python 3:
```bash
python3 -m http.server 8000
```

O instala Python desde: https://www.python.org/downloads/

### Error: Puerto 8000 ocupado

Usa otro puerto:
```bash
python -m http.server 8080
```

### Los ejercicios no cargan

1. Abre DevTools (F12)
2. Ve a Console
3. Busca errores en rojo
4. Verifica que `exercises.json` existe

### SQL no ejecuta

- Espera 5-10 segundos (sql.js está cargando)
- Verifica conexión a internet

### Python no ejecuta

- Primera ejecución tarda ~20 segundos
- Pyodide descarga ~50MB
- Requiere buena conexión a internet

---

## 📝 Próximos Pasos

1. ✅ Prueba todos los ejercicios SQL
2. ✅ Prueba ejercicios Python
3. ✅ Crea tu primer notebook de Colab para PySpark
4. ✅ Personaliza los ejercicios según tu necesidad
5. 📈 Practica regularmente

---

## 🆘 Ayuda

Si tienes problemas:
1. Revisa el README.md completo
2. Abre DevTools (F12) y busca errores
3. Verifica que todos los archivos existen en `docs/`

¡Listo para practicar! 🎯
