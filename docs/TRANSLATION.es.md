# Guía de traducción

[English](TRANSLATION.md) · **Español**

Cómo ContextForge se mantiene bilingüe, y qué hay que tocar cuando agregás o
cambiás un texto visible para el usuario.

## Por qué un solo repositorio y no dos

Una pregunta recurrente es si un proyecto bilingüe debería vivir en dos
repositorios, uno por idioma. No debería. Un repositorio, una rama, los dos
idiomas conviviendo.

Dos repositorios se ven prolijos el primer día y se pudren para la tercera
semana:

- Se desincronizan. Un arreglo entra en uno y nunca en el otro, y no hay nada
  que lo detecte.
- Parten la identidad del proyecto: dos issue trackers, dos conjuntos de stars,
  dos configuraciones de CI, dos historiales de releases.
- Duplican el mantenimiento de todo lo que no tiene nada que ver con el idioma:
  dependencias, workflows, licencia, política de seguridad.
- Obligan a quien quiere contribuir a elegir un bando antes de poder ayudar.

La convención en el mundo open source es un único repositorio con `README.md` en
inglés como puerta de entrada por defecto y `README.<idioma>.md` al lado,
enlazados por una barra de idioma arriba de cada archivo. Eso es lo que hace
este proyecto.

El mismo razonamiento vale dentro de la app: un solo build que sirve los dos
idiomas, no un build por idioma.

## Organización

```text
README.md            inglés, puerta de entrada por defecto
README.es.md         español

CONTRIBUTING.md      + CONTRIBUTING.es.md
SECURITY.md          + SECURITY.es.md
SUPPORT.md           + SUPPORT.es.md
CODE_OF_CONDUCT.md   + CODE_OF_CONDUCT.es.md
docs/*.md            + docs/*.es.md

CHANGELOG.md         solo en inglés — ver abajo
```

Cada documento traducido abre con una barra de idioma, con el idioma actual en
negrita:

```markdown
[English](ARCHIVO.md) · **Español**
```

`CHANGELOG.md` está deliberadamente en un solo idioma. Es un registro técnico
que solo crece y que leen quienes mantienen el proyecto; traducirlo duplica el
trabajo en cada release y sus entradas referencian identificadores de código que
igual no se traducen.

## Dentro de la app

Hay tres lugares con texto visible para el usuario. Los tres se actualizan
juntos.

### 1. Interfaz y textos generados — `src/i18n/locales/`

`es.js` y `en.js` son diccionarios anidados con exactamente la misma estructura
de claves. Agregá la tuya a los dos:

```text
// es.js                                  // en.js
audit: {                                  audit: {
  title: 'Qué conviene aclarar             title: 'What to clarify
          antes de consultar a la IA',            before asking the AI',
}                                         }
```

Leelo siempre a través del traductor, nunca escrito directo:

```jsx
const { t } = useI18n();
<h2>{t('audit.title')}</h2>;
```

Los marcadores usan `{nombre}`:

```js
confidence: '{value}% de confianza';
t('result.confidence', { value: 72 }); // "72% de confianza"
```

Una clave puede contener un array; cada elemento se interpola:

```js
conditions: ['Priorizá lo más importante.', 'Devolvé pasos concretos.'];
```

**`tests/i18n.test.js` falla si los dos diccionarios tienen claves distintas,
tipos distintos para la misma clave, o algún texto vacío.** Ese test es la razón
por la que las traducciones no se desincronizan en silencio.

### 2. Reglas de contexto — `src/data/contextRules.{es,en}.json`

Los dos archivos tienen los mismos `id` de categoría en el mismo orden, con los
textos traducidos y las `keywords` propias de cada idioma. `tests/rules.test.js`
verifica el esquema compartido, los ids compartidos, y que las etiquetas estén
realmente traducidas y no copiadas.

Las keywords son el único campo genuinamente por idioma: se comparan contra lo
que escribe el usuario.

### 3. Señales de detección — dentro de `src/logic/`

Las expresiones regulares y listas de tokens que inspeccionan el **texto del
usuario** (no textos de interfaz) son deliberadamente multilingües dentro de una
sola lista, porque el idioma del prompt es independiente del de la interfaz:

```text
const automationSignalKeywords = [
  'webhook', 'flujo', 'trigger', 'automatiz',   // es
  'workflow', 'automat', 'pipeline',            // en
];
```

Cuidado con los solapamientos de substring al agregar tokens en inglés. Hubo que
sacar `flow` de las keywords de automatización porque `includes('flow')` también
matchea `workflow`, y eso hacía que la categoría genérica de automatización le
ganara a la más específica de n8n.

## Cómo la clasificación se vuelve independiente del idioma

Cada categoría se puntúa una vez por idioma, contra la lista de keywords de ese
idioma, y gana la variante con mejor puntaje. Después la categoría ganadora se
muestra en el idioma de la interfaz.

Puntuar por variante en lugar de mezclar las keywords de todos los idiomas en
una sola bolsa importa: la confianza es el puntaje dividido por el máximo
teórico de la categoría, así que una bolsa mezclada haría crecer el denominador
con cada idioma agregado y bajaría en silencio la confianza de los prompts en
todos los demás idiomas.

## Agregar un tercer idioma

1. Copiá `src/i18n/locales/en.js` a `<código>.js` y traducí los valores.
2. Registralo en `DICTIONARIES`, en `src/i18n/index.js`.
3. Copiá `src/data/contextRules.en.json` a `contextRules.<código>.json`, traducí
   los textos y reemplazá las keywords por el vocabulario de ese idioma.
4. Registralo en `RULES_BY_LOCALE`, en `src/data/rules.js`.
5. Agregá los tokens de ese idioma a las listas de detección de `src/logic/`.
6. Agregá el `README.<código>.md` y la entrada en la barra de idioma de cada
   documento traducido.
7. Corré `npm run verify`. Los tests de paridad te van a decir qué falta:
   `SUPPORTED_LOCALES` se verifica de forma explícita, así que actualizá también
   esa aserción.

El selector del header renderiza automáticamente cada entrada de
`SUPPORTED_LOCALES`; no hay que tocar ningún componente.

## Checklist antes de abrir un pull request

- [ ] Textos nuevos agregados en **ambos** `es.js` y `en.js`
- [ ] Reglas nuevas agregadas en **ambos** `contextRules.es.json` y `.en.json`
- [ ] Los tokens de detección nuevos cubren los dos idiomas, sin solapamientos
      de substring
- [ ] Los cambios de documentación están replicados en la contraparte `.es.md`
- [ ] `npm run verify` pasa
