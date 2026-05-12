# Flujo de trabajo con Codex para principiantes

## Objetivo

Usar Codex como compañero técnico, no como magia. La idea es pedir cambios pequeños, revisar, ejecutar y corregir.

## Instalación mínima

### 1. Verificar Node.js

```powershell
node -v
npm -v
```

Si no aparecen versiones, instalar Node.js LTS.

### 2. Verificar Git

```powershell
git --version
```

### 3. Instalar Codex CLI

```powershell
npm install -g @openai/codex
```

### 4. Ejecutar Codex

Dentro de la carpeta del proyecto:

```powershell
codex
```

## Flujo recomendado

```text
1. Abrir carpeta del proyecto en VS Code.
2. Abrir terminal integrada.
3. Ejecutar npm install.
4. Ejecutar npm run dev.
5. Abrir la app en el navegador.
6. Ejecutar codex en otra terminal o usar la extensión.
7. Pedir un cambio pequeño.
8. Revisar los archivos modificados.
9. Probar de nuevo.
10. Guardar avance con Git.
```

## Comandos útiles

```powershell
npm install
npm run dev
npm run build
```

## Primeros prompts para Codex

### Explicar el proyecto

```text
Leé este proyecto y explicámelo como si yo fuera principiante. Decime qué hace cada carpeta y qué archivo debería mirar primero.
```

### Mejorar una función

```text
Revisá src/logic/classifyPrompt.js. Mejorá la clasificación sin agregar librerías externas. Mantené el código claro para principiantes.
```

### Agregar una categoría

```text
Agregá una nueva categoría a src/data/contextRules.json para prompts relacionados con video, audio, transcripción y edición multimedia. Después verificá que la app siga funcionando.
```

### Corregir error

```text
Este es el error que me aparece al ejecutar npm run dev:

[PEGAR ERROR COMPLETO]

Explicame la causa probable y corregilo en el proyecto.
```

### Mejorar diseño

```text
Mejorá la interfaz visual manteniendo CSS simple. No agregues Tailwind ni librerías. La app debe seguir siendo clara para principiantes.
```

## Regla de oro

No pedir:

```text
Hacé todo el proyecto completo.
```

Pedir:

```text
Modificá esta parte concreta, explicá qué tocaste y cómo lo pruebo.
```

## Control de daños

Antes de cambios grandes:

```powershell
git status
git add .
git commit -m "checkpoint antes de cambios grandes"
```

Si algo sale mal:

```powershell
git restore .
```

## Errores comunes

### Codex trabaja en carpeta equivocada

Verificar terminal:

```powershell
pwd
```

Debe mostrar la carpeta `contextforge`.

### npm no se reconoce

Node.js no está instalado o no quedó en PATH. Cerrar y abrir PowerShell. Si sigue igual, reinstalar Node.js LTS.

### La app no abre

Revisar que `npm run dev` esté corriendo y abrir la URL exacta que muestra la terminal.
