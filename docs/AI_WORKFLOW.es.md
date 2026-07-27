# Flujo de desarrollo asistido por IA

[English](AI_WORKFLOW.md) · **Español**

Cómo se construye este proyecto usando una IA como compañera técnica, sin
perder control ni comprensión de lo que se está tocando. Sirve para Codex,
Claude Code, Copilot o cualquier asistente equivalente.

## La idea

Una IA que escribe código es útil en la medida en que vos podés verificar lo que
escribió. Todo lo que sigue existe para que esa verificación sea posible: pasos
chicos, un cambio a la vez, y un checkpoint en Git antes de cada tramo
arriesgado.

La regla de oro es no pedir:

```text
Hacé todo el proyecto completo.
```

sino:

```text
Modificá esta parte concreta, explicá qué tocaste y cómo lo pruebo.
```

## El ciclo

1. **Diagnosticar antes de modificar.** Entender qué falla y por qué, antes de
   pedir un cambio.
2. **Aplicar el cambio mínimo seguro.** Un problema por vez.
3. **Ejecutar.** `npm run verify` corre lint, formato, tests y build.
4. **Validar a mano en el navegador.** Los tests no ven la interfaz.
5. **Documentar la decisión** si cambia algo no obvio.
6. **Hacer checkpoint en Git.**

## Entorno

```bash
node -v          # 20.19 o superior
git --version
npm install
npm run dev
```

Si usás `nvm`, `nvm use` toma la versión de `.nvmrc`.

## Control de daños

Antes de un cambio grande:

```bash
git status
git add .
git commit -m "checkpoint antes de <cambio>"
```

Si sale mal:

```bash
git restore .
```

## Prompts que funcionan en este repo

### Entender el proyecto

```text
Leé este proyecto y explicámelo como si yo fuera principiante. Decime qué hace
cada carpeta y qué archivo debería mirar primero.
```

### Mejorar una función

```text
Revisá src/logic/classifyPrompt.js. Mejorá la clasificación sin agregar
librerías externas. Mantené el código claro para principiantes.
```

### Agregar una categoría

```text
Agregá una categoría nueva para prompts de video, audio, transcripción y edición
multimedia. Tiene que ir en src/data/contextRules.es.json y en
contextRules.en.json con el mismo id, y los tests de paridad tienen que seguir
pasando.
```

### Agregar un texto de interfaz

```text
Agregá el texto <X> a la interfaz. Va en src/i18n/locales/es.js y en en.js con
la misma clave, y se lee con t('<clave>') desde el componente.
```

### Corregir un error

```text
Este es el error que me aparece al ejecutar npm run dev:

[PEGAR ERROR COMPLETO]

Explicame la causa probable y corregilo en el proyecto.
```

### Mejorar el diseño

```text
Mejorá la interfaz visual manteniendo CSS simple. No agregues Tailwind ni
librerías. La app debe seguir siendo clara para principiantes.
```

## Restricciones que conviene declarar

Vale la pena repetirlas en el prompt, porque una IA tiende a sugerir lo
contrario por defecto:

- Sin dependencias nuevas salvo que se justifiquen explícitamente.
- Sin backend.
- Sin framework de CSS.
- Todo texto de interfaz pasa por i18n, nunca escrito directo en el componente.
- Toda regla nueva va en los dos idiomas.

## Errores comunes

### La IA trabaja en la carpeta equivocada

```bash
pwd    # debe mostrar la carpeta contextforge
```

### `npm` no se reconoce

Node.js no está instalado o no quedó en el PATH. Cerrá y abrí la terminal; si
sigue igual, reinstalá Node.js LTS.

### La app no abre

Verificá que `npm run dev` esté corriendo y abrí la URL exacta que muestra la
terminal, incluido el sufijo `/Contextforge/`.

### Los tests de paridad fallan

Agregaste una clave o una regla en un solo idioma. El mensaje del test dice cuál
falta.
