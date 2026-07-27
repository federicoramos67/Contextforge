// Diccionario de la interfaz y de los textos generados, en español.
// Debe mantenerse en paridad de claves con ./en.js: el test i18n.test.js
// falla si una clave existe en un idioma y no en el otro.
export default {
  meta: {
    localeName: 'Español',
    htmlLang: 'es',
  },

  app: {
    eyebrow: 'Herramienta de estrategia de contexto para IA',
    intro:
      'Escribí un prompt en lenguaje natural y recibí una recomendación clara sobre qué archivos, formatos y contexto conviene compartir con una IA para obtener mejores respuestas.',
    fallbackTitle: 'Modo IA no disponible.',
    fallbackBody:
      'Este resultado se generó con el modo reglas local. Motivo: {reason}',
  },

  language: {
    label: 'Idioma',
    switchTo: 'Cambiar a {language}',
  },

  input: {
    eyebrow: 'Entrada',
    title: 'Escribí el prompt o necesidad del usuario',
    placeholder:
      'Ejemplo: Quiero que una IA revise mi landing page y me diga por qué no convierte...',
    analyze: 'Analizar contexto',
    privacyHint:
      'No se envían datos a ningún servidor: esta versión funciona con reglas locales.',
    examplesTitle: 'Ejemplos rápidos:',
  },

  examples: {
    landing: {
      label: 'Landing page',
      text: 'Quiero que una IA revise mi landing page y me diga por qué no convierte. Necesito recomendaciones priorizadas para mejorar el hero y el CTA.',
    },
    codeError: {
      label: 'Error de código',
      text: 'Tengo un error en una app React con Vite. Quiero que una IA me ayude a corregir el bug y me explique qué archivo tocar.',
    },
    pdf: {
      label: 'Documento PDF',
      text: 'Necesito que una IA resuma un informe PDF largo y me saque las ideas principales en formato académico.',
    },
    automation: {
      label: 'Automatización',
      text: 'Quiero automatizar un flujo en n8n para tomar datos de un formulario y generar una respuesta automática.',
    },
  },

  result: {
    emptyEyebrow: 'Resultado',
    emptyTitle: 'Esperando un prompt',
    emptyBody:
      'Escribí una necesidad en lenguaje natural y ContextForge te recomendará el mejor tipo de contexto para compartir con una IA.',
    categoryEyebrow: 'Categoría detectada',
    confidence: '{value}% de confianza',
    primaryFormats: 'Formato principal',
    secondaryFormats: 'Complementos útiles',
    avoid: 'Qué evitar',
    reason: 'Por qué',
    diagnostic: 'Por qué se detectó esta categoría',
    keywords: 'Señales detectadas',
  },

  score: {
    eyebrow: 'Calidad del contexto',
    barLabel: 'Puntaje {score} de 100',
    improvements: 'Mejoras sugeridas',
    levels: {
      low: 'Bajo',
      medium: 'Medio',
      high: 'Alto',
    },
    checks: {
      goal: 'Objetivo claro',
      contentType: 'Tipo de contenido mencionado',
      problem: 'Problema o necesidad concreta',
      expectedOutput: 'Resultado esperado',
      constraints: 'Restricciones o contexto',
    },
    improvementHints: {
      goal: 'Agregá una frase que empiece con “Quiero lograr...” o “Necesito que la IA...”.',
      contentType:
        'Indicá qué material tenés disponible: captura, PDF, código, URL, texto, tabla, logs, etc.',
      problem: 'Explicá cuál es el problema, duda o necesidad concreta.',
      expectedOutput:
        'Pedí un resultado concreto: tabla, guía paso a paso, diagnóstico, resumen, código corregido o checklist.',
      constraints:
        'Agregá restricciones: sistema operativo, nivel de experiencia, presupuesto, herramientas disponibles o límites.',
    },
  },

  checklist: {
    eyebrow: 'Checklist',
    title: 'Antes de pedirle ayuda a una IA, prepará esto',
  },

  audit: {
    eyebrow: 'Auditoría de contexto',
    title: 'Qué conviene aclarar antes de consultar a la IA',
    missing: 'Contexto faltante',
    risks: 'Riesgos si no se agrega',
    questions: 'Preguntas útiles antes de consultar a la IA',
  },

  autofill: {
    eyebrow: 'Material de referencia',
    title: 'Rellenar contexto con material de referencia',
    placeholder:
      'Pegá una campaña anterior, brief, email, documento, texto de cliente o documentación base.',
    action: 'Rellenar contexto',
    filled: 'Contexto rellenado',
    signals: 'Señales detectadas',
    stillMissing: 'Contexto todavía faltante',
    inferred: 'Contexto inferido',
    updatedPrompt: 'Prompt actualizado',
    copyUpdatedPrompt: 'Copiar prompt actualizado',
  },

  prompt: {
    eyebrow: 'Próximo paso',
    title: 'Prompt refinado para copiar',
    copyPrompt: 'Copiar prompt',
    copyReport: 'Copiar diagnóstico',
    downloadMarkdown: 'Descargar Markdown',
  },

  evaluator: {
    eyebrow: 'Cierre del ciclo',
    title: 'Evaluar respuesta de IA',
    placeholder: 'Pegá acá la respuesta que te dio la IA externa.',
    action: 'Evaluar respuesta',
    completionEyebrow: 'Nivel de completitud',
    strengths: 'Qué respondió bien',
    weakPoints: 'Qué falta o está débil',
    risks: 'Riesgos',
    nextPrompt: 'Siguiente prompt recomendado',
    copyNextPrompt: 'Copiar siguiente prompt',
    levels: {
      low: 'Baja',
      medium: 'Media',
      high: 'Alta',
    },
  },

  settings: {
    title: 'Proveedores de IA',
    securityNote:
      '🔒 Tu API key se guarda solo en este navegador (localStorage) y nunca se envía a nuestros servidores. Usá keys con límite de gasto.',
    activeProviderLabel: 'Proveedor activo:',
    autoOption: 'Auto (prioridad)',
    savedPrefix: 'Guardada: {value}',
    save: 'Guardar',
    clearAll: 'Borrar todo',
    ollamaLabel: 'Ollama (URL local)',
    activeProviderConfirm: '✓ Proveedor activo: {name}',
    noProvider: 'Sin proveedor activo — usando modo heurístico',
    clearedWithEnvProvider:
      'Keys de UI borradas. Proveedor activo por .env: {name}',
    clearedNoProvider:
      'Keys borradas — sin proveedor activo. Usando modo heurístico.',
  },

  modes: {
    rules: 'Modo reglas',
    ai: 'Modo IA',
    rulesTitle: 'Usar clasificación local por reglas',
    aiNeedsKeyTitle: 'Configurá una API key para activar el Modo IA',
    aiActivateTitle: 'Activar Modo IA — {name}',
    settingsTitle: 'Configurar proveedores de IA',
    settingsAriaLabel: 'Configurar API',
  },

  status: {
    exampleLoaded: 'Ejemplo cargado. Presioná "Analizar contexto".',
    writeSomethingFirst: 'Primero escribí una necesidad o prompt.',
    analyzingWith: 'Analizando con {name}...',
    aiUnavailable:
      'Modo IA no disponible ({reason}). Se usó el modo reglas local.',
    analysisReady: 'Análisis generado.',
    copyFailed:
      'No pude copiar automáticamente. Seleccioná el texto y copialo manualmente.',
    markdownDownloaded: 'Markdown descargado.',
    responseEvaluated: 'Respuesta evaluada.',
    contextFilled: 'Contexto rellenado desde material de referencia.',
    refinedPromptCopied: 'Prompt refinado copiado.',
    reportCopied: 'Diagnóstico completo copiado en Markdown.',
    updatedPromptCopied: 'Prompt actualizado copiado.',
    nextPromptCopied: 'Siguiente prompt copiado.',
  },

  provider: {
    noProviderConfigured: 'Sin proveedor configurado',
    timeout: 'El proveedor no respondió en {seconds}s (timeout)',
    unknownError: 'Error desconocido',
    unknownProvider: 'Proveedor desconocido: {id}',
    noJSON: 'No se pudo extraer JSON válido de la respuesta de la IA',
  },

  advice: {
    diagnosticWithKeywords:
      'Se detectó esta categoría porque el prompt contiene señales como: {keywords}.',
    diagnosticWithoutKeywords:
      'Se detectó esta categoría por coincidencias generales del texto, sin señales específicas.',
  },

  refinedPrompt: {
    originalTask: 'Tarea original del usuario:',
    contextIntro:
      'Antes de responder, considerá que voy a compartir este contexto recomendado:',
    needHelpWith: 'Necesito que me ayudes con: {expectedOutput}.',
    conditionsTitle: 'Condiciones de respuesta:',
    conditions: [
      'Explicá primero qué información falta, si falta algo.',
      'Priorizá lo más importante.',
      'Devolvé pasos concretos y verificables.',
      'No inventes datos que no estén en el material compartido.',
    ],
  },

  auditLogic: {
    thisQuery: 'esta consulta',
    generalChecklist: [
      'Objetivo',
      'Contexto',
      'Material disponible',
      'Qué querés recibir',
      'Límites o condiciones',
    ],
    generalRisks: [
      'La IA puede responder de forma genérica si no entiende el objetivo concreto.',
      'Puede inventar detalles o asumir restricciones que no fueron indicadas.',
      'La respuesta puede requerir varias idas y vueltas para llegar a algo usable.',
    ],
    fallbackMissingItems: [
      'Ejemplo concreto o caso real',
      'Restricciones o límites importantes',
      'Formato exacto de salida',
    ],
    risks: {
      n8n: 'En n8n, sin workflow, nodo, datos y error exacto, es fácil proponer cambios en el lugar equivocado.',
      programming:
        'En programación, sin código, error y comando, la IA puede confundir síntomas con causa raíz.',
      error:
        'Sin el error completo, la IA puede diagnosticar una causa equivocada.',
      io: 'Sin ejemplos de entrada y salida, es fácil proponer una solución que no encaje con los datos reales.',
      material:
        'Sin {item}, la respuesta para {category} puede quedarse en recomendaciones demasiado generales.',
      constraints:
        'Sin restricciones claras, la IA puede sugerir pasos inviables o inseguros.',
      objective:
        'Sin definir el resultado esperado, la IA puede optimizar para una meta distinta a la tuya.',
      generic:
        'Falta {item}, así que la IA podría asumirlo en lugar de pedirlo.',
    },
    questions: {
      error: '¿Cuál es el mensaje de error completo y en qué momento aparece?',
      code: '¿Qué archivo, bloque de código o fragmento exacto debería revisar la IA?',
      workflow:
        '¿Podés compartir el workflow exportado sin credenciales o describir sus pasos principales?',
      node: '¿Qué nodo falla o concentra el comportamiento que querés corregir?',
      input: '¿Cuál es un ejemplo realista de entrada que recibe el sistema?',
      output:
        '¿Qué salida esperabas recibir y qué salida estás obteniendo ahora?',
      constraints:
        '¿Qué restricciones, herramientas o condiciones debe respetar la respuesta?',
      format: '¿En qué formato querés recibir la respuesta final?',
      objective: '¿Cuál es el objetivo concreto que querés lograr con la IA?',
      generic: '¿Qué información podés agregar sobre "{item}"?',
    },
  },

  evaluatorLogic: {
    originalTask: 'la tarea original',
    emptyWeakPoint:
      'La respuesta está vacía o es demasiado corta para evaluarla.',
    emptyRisk:
      'No hay suficiente contenido para saber si responde al objetivo original.',
    emptyStrength: 'Todavía no hay una respuesta sustantiva para rescatar.',
    notAddressed: 'No aborda con claridad: {item}.',
    strengths: {
      concreteSteps: 'Incluye pasos o acciones concretas.',
      mentionsFormat: 'Menciona parte del formato o material recomendado.',
      considersSecondary: 'Considera contexto complementario útil.',
      developed:
        'La respuesta tiene desarrollo suficiente para revisar detalles.',
      baseline: 'La respuesta ofrece una base inicial para continuar.',
    },
    weakPoints: {
      noConcreteSteps: 'No ofrece pasos concretos o verificables.',
      ignoresMissingContext:
        'No recupera el contexto faltante detectado antes de consultar a la IA.',
      none: 'No se detectan debilidades críticas con las reglas actuales.',
    },
    risks: {
      hardToExecute:
        'La respuesta puede ser difícil de ejecutar porque no baja a acciones.',
      vagueLanguage: 'Usa lenguaje vago sin suficiente acción: {matches}.',
      offTarget: 'No parece responder de forma directa al objetivo original.',
      none: 'No se detectan riesgos fuertes con las reglas actuales.',
    },
    nextPrompt: {
      role: 'Actuá como especialista en {category}.',
      objectiveIntro: 'Mi objetivo original era:',
      fallbackObjective: 'Necesito una respuesta más completa y accionable.',
      weakPointsIntro:
        'Mejorá tu respuesta anterior corrigiendo estos puntos débiles:',
      missingContextIntro:
        'También necesito que consideres este contexto faltante:',
      risksIntro: 'Riesgos a evitar:',
      closingIntro: 'Devolveme una versión mejorada con:',
      closing: [
        'pasos concretos y verificables;',
        'supuestos explícitos;',
        'prioridades;',
        'cualquier dato que necesites que te confirme antes de ejecutar cambios.',
      ],
      defaultMissingContext: [
        'Supuestos que usaste',
        'Datos que faltan',
        'Acciones concretas para avanzar',
      ],
      defaultWeakPoints: [
        'Revisá si falta algún paso concreto, ejemplo o criterio de verificación.',
      ],
      defaultRisks: ['Evitá respuestas genéricas y aclará supuestos.'],
    },
  },

  autofillLogic: {
    theTask: 'la tarea',
    labels: {
      audience: 'Audiencia',
      tone: 'Tono',
      callToAction: 'CTA',
      format: 'Formato',
      constraints: 'Restricciones',
      objective: 'Objetivo inferido',
      constraint: 'Restricción',
      sourceSummary: 'Resumen del material',
    },
    defaultMissingItems: [
      'Objetivo',
      'Audiencia',
      'Formato de salida',
      'Restricciones',
    ],
    values: {
      audience: {
        clientes: 'clientes',
        usuarios: 'usuarios',
        empresas: 'empresas',
        pymes: 'pymes',
        estudiantes: 'estudiantes',
        docentes: 'docentes',
        leads: 'leads',
        equipoInterno: 'equipo interno',
      },
      tone: {
        formal: 'formal',
        cercano: 'cercano',
        profesional: 'profesional',
        tecnico: 'técnico',
        comercial: 'comercial',
        academico: 'académico',
        directo: 'directo',
      },
      cta: {
        comprar: 'comprar',
        registrarse: 'registrarse',
        responder: 'responder',
        agendar: 'agendar',
        descargar: 'descargar',
        renovar: 'renovar',
        contactar: 'contactar',
        formulario: 'completar formulario',
      },
      format: {
        email: 'email',
        campana: 'campaña',
        landing: 'landing',
        informe: 'informe',
        resumen: 'resumen',
        post: 'post',
        anuncio: 'anuncio',
        propuesta: 'propuesta',
        script: 'script',
      },
    },
    updatedPrompt: {
      role: 'Actuá como especialista en {category}.',
      objectiveIntro: 'Objetivo original:',
      fallbackObjective: 'Necesito ayuda con esta tarea.',
      inferredIntro: 'Contexto inferido desde el material de referencia:',
      filledIntro: 'Huecos que el material ayudó a rellenar:',
      missingIntro: 'Contexto que todavía falta confirmar:',
      noInferred: 'No hay contexto inferido suficiente.',
      noFilled: 'Todavía no se rellenó ningún hueco.',
      noMissing: 'No quedan faltantes críticos detectados por reglas.',
      closing:
        'Usá el contexto inferido como apoyo, pero no inventes datos que no estén en el material. Si falta algo crítico, pedilo antes de dar una respuesta final.',
    },
  },

  report: {
    fileName: 'contextforge-diagnostico.md',
    title: '# Diagnóstico de contexto — ContextForge',
    originalPrompt: 'Prompt original',
    detectedCategory: 'Categoría detectada',
    estimatedConfidence: 'Confianza estimada: {value}%',
    primaryFormats: 'Formato principal recomendado',
    secondaryFormats: 'Formatos complementarios',
    avoid: 'Qué evitar',
    checklist: 'Checklist para compartir con la IA',
    reason: 'Razón',
    contextQuality: 'Calidad del contexto',
    score: 'Puntaje: {score}/100',
    level: 'Nivel: {level}',
    improvements: 'Mejoras sugeridas',
    solidContext: 'El contexto inicial es sólido.',
    refinedPrompt: 'Prompt refinado',
    auditSection: 'Auditoría de contexto faltante',
    auditMissing: 'Contexto faltante',
    auditRisks: 'Riesgos si no se agrega',
    auditQuestions: 'Preguntas útiles antes de consultar a la IA',
    autofillSection: 'Contexto rellenado desde material de referencia',
    autofillReference: 'Material de referencia pegado',
    autofillInferred: 'Contexto inferido',
    autofillFilled: 'Huecos rellenados',
    autofillStillMissing: 'Huecos todavía faltantes',
    autofillUpdatedPrompt: 'Prompt actualizado',
    evaluationSection: 'Evaluación de respuesta de IA',
    evaluationResponse: 'Respuesta pegada',
    evaluationLevel: 'Nivel de completitud',
    evaluationStrengths: 'Qué respondió bien',
    evaluationWeakPoints: 'Qué falta o está débil',
    evaluationRisks: 'Riesgos',
    evaluationNextPrompt: 'Siguiente prompt recomendado',
    noData: 'Sin datos.',
    noInferredContext: 'Sin contexto inferido.',
  },
};
