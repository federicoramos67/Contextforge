# Contribuir a ContextForge

[English](CONTRIBUTING.md) · **Español**

Gracias por el interés. Las contribuciones son bienvenidas en español o en
inglés: issues, pull requests y comentarios en español están perfectamente bien.

## Filosofía de desarrollo

ContextForge se construye con cambios chicos, verificables y documentados. Antes
de modificar nada:

1. Diagnosticar primero.
2. Preferir el cambio mínimo seguro.
3. Validar a mano en el navegador, no solo con tests.
4. Documentar las decisiones que no son obvias.
5. Mantener la app local-first.
6. Evitar complejidad innecesaria.

## Puesta en marcha

Node.js 20.19 o superior (ver [`.nvmrc`](.nvmrc)).

```bash
npm install
npm run dev
```

## Antes de abrir un pull request

```bash
npm run verify
```

Eso corre lint, el chequeo de formato, los tests y el build: exactamente lo que
corre CI. Un pull request que falle `verify` va a fallar en CI.

## Reglas propias de este proyecto

### Todo texto visible va en los dos idiomas

Los textos de interfaz y los generados viven en `src/i18n/locales/es.js` y
`en.js`, bajo claves idénticas. Se leen con `t('alguna.clave')`; nunca escribas
un texto directo en un componente.

`tests/i18n.test.js` falla si los diccionarios se desincronizan.

### Toda regla de contexto va en los dos idiomas

Las categorías nuevas van en `src/data/contextRules.es.json` **y** en
`contextRules.en.json`, con el mismo `id` y en la misma posición.
`tests/rules.test.js` lo verifica.

### Las señales de detección son multilingües

Las expresiones regulares y listas de tokens que inspeccionan el **texto del
usuario** viven en `src/logic/` y mezclan a propósito los dos idiomas en una
sola lista, porque el idioma del prompt es independiente del de la interfaz.
Cuidado con los solapamientos de substring al agregar tokens en inglés.

En [docs/TRANSLATION.es.md](docs/TRANSLATION.es.md) está todo esto en detalle.

## Guía para pull requests

- Mantené los pull requests acotados; no mezcles funcionalidades sin relación.
- Explicá por qué existe el cambio, no solo qué hace.
- Incluí validación manual cuando el cambio se ve.
- Preferí código legible antes que código ingenioso.
- Seguí el estilo de alrededor: los comentarios del código de este repositorio
  están en español, y los archivos dirigidos a quien contribuye, en inglés.

## Dónde hace más falta ayuda

- Heurísticas de clasificación y reducción de falsos positivos.
- Categorías de contexto nuevas.
- Accesibilidad.
- Tests automatizados.
- Mejoras de interfaz y de experiencia de uso.
- Documentación, en cualquiera de los dos idiomas.

## Qué evitar

- Reescrituras grandes sin discutirlas antes.
- Dependencias nuevas sin una justificación clara.
- Convertir la app en una arquitectura pesada de backend.
- Commitear secretos o credenciales de cualquier tipo.

## QA manual con Python

`tools/classifier_manual_cases.py` lista casos de validación manual y sus
resultados esperados. No se conecta a la app ni duplica la lógica del
clasificador.

```bash
python tools/classifier_manual_cases.py
```

## Reportar problemas de seguridad

No abras un issue público. Ver [SECURITY.es.md](SECURITY.es.md).
