// UI and generated-text dictionary, in English.
// Must stay key-for-key in sync with ./es.js: i18n.test.js fails when a key
// exists in one locale and not the other.
export default {
  meta: {
    localeName: 'English',
    htmlLang: 'en',
  },

  app: {
    eyebrow: 'Context strategy tool for AI',
    intro:
      'Write a prompt in plain language and get a clear recommendation on which files, formats and context are worth sharing with an AI to get better answers.',
    fallbackTitle: 'AI mode unavailable.',
    fallbackBody:
      'This result was produced by the local rules mode. Reason: {reason}',
  },

  language: {
    label: 'Language',
    switchTo: 'Switch to {language}',
  },

  input: {
    eyebrow: 'Input',
    title: 'Write the prompt or the user need',
    placeholder:
      'Example: I want an AI to review my landing page and tell me why it does not convert...',
    analyze: 'Analyze context',
    privacyHint:
      'No data leaves your browser: this mode runs entirely on local rules.',
    examplesTitle: 'Quick examples:',
  },

  examples: {
    landing: {
      label: 'Landing page',
      text: 'I want an AI to review my landing page and tell me why it does not convert. I need prioritized recommendations to improve the hero and the CTA.',
    },
    codeError: {
      label: 'Code error',
      text: 'I have a bug in a React app built with Vite. I want an AI to help me fix it and explain which file to touch.',
    },
    pdf: {
      label: 'PDF document',
      text: 'I need an AI to summarize a long PDF report and extract the main ideas in an academic format.',
    },
    automation: {
      label: 'Automation',
      text: 'I want to automate an n8n workflow that takes form data and generates an automatic reply.',
    },
  },

  result: {
    emptyEyebrow: 'Result',
    emptyTitle: 'Waiting for a prompt',
    emptyBody:
      'Describe a need in plain language and ContextForge will recommend the best kind of context to share with an AI.',
    categoryEyebrow: 'Detected category',
    confidence: '{value}% confidence',
    primaryFormats: 'Primary format',
    secondaryFormats: 'Useful extras',
    avoid: 'What to avoid',
    reason: 'Why',
    diagnostic: 'Why this category was detected',
    keywords: 'Detected signals',
  },

  score: {
    eyebrow: 'Context quality',
    barLabel: 'Score {score} out of 100',
    improvements: 'Suggested improvements',
    levels: {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
    },
    checks: {
      goal: 'Clear goal',
      contentType: 'Content type mentioned',
      problem: 'Concrete problem or need',
      expectedOutput: 'Expected result',
      constraints: 'Constraints or context',
    },
    improvementHints: {
      goal: 'Add a sentence starting with “I want to achieve...” or “I need the AI to...”.',
      contentType:
        'State what material you have: screenshot, PDF, code, URL, text, table, logs, etc.',
      problem: 'Explain the concrete problem, doubt or need.',
      expectedOutput:
        'Ask for a concrete deliverable: table, step-by-step guide, diagnosis, summary, fixed code or checklist.',
      constraints:
        'Add constraints: operating system, experience level, budget, available tools or limits.',
    },
  },

  checklist: {
    eyebrow: 'Checklist',
    title: 'Prepare this before asking an AI for help',
  },

  audit: {
    eyebrow: 'Context audit',
    title: 'What to clarify before asking the AI',
    missing: 'Missing context',
    risks: 'Risks of leaving it out',
    questions: 'Useful questions before asking the AI',
  },

  autofill: {
    eyebrow: 'Reference material',
    title: 'Fill context from reference material',
    placeholder:
      'Paste a previous campaign, brief, email, document, client text or base documentation.',
    action: 'Fill context',
    filled: 'Context filled in',
    signals: 'Detected signals',
    stillMissing: 'Context still missing',
    inferred: 'Inferred context',
    updatedPrompt: 'Updated prompt',
    copyUpdatedPrompt: 'Copy updated prompt',
  },

  prompt: {
    eyebrow: 'Next step',
    title: 'Refined prompt, ready to copy',
    copyPrompt: 'Copy prompt',
    copyReport: 'Copy report',
    downloadMarkdown: 'Download Markdown',
  },

  evaluator: {
    eyebrow: 'Closing the loop',
    title: 'Evaluate the AI response',
    placeholder: 'Paste here the answer the external AI gave you.',
    action: 'Evaluate response',
    completionEyebrow: 'Completion level',
    strengths: 'What it got right',
    weakPoints: 'What is missing or weak',
    risks: 'Risks',
    nextPrompt: 'Recommended next prompt',
    copyNextPrompt: 'Copy next prompt',
    levels: {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
    },
  },

  settings: {
    title: 'AI providers',
    securityNote:
      '🔒 Your API key is stored only in this browser (localStorage) and is never sent to our servers. Use keys with a spending limit.',
    activeProviderLabel: 'Active provider:',
    autoOption: 'Auto (by priority)',
    savedPrefix: 'Saved: {value}',
    save: 'Save',
    clearAll: 'Clear all',
    ollamaLabel: 'Ollama (local URL)',
    activeProviderConfirm: '✓ Active provider: {name}',
    noProvider: 'No active provider — using heuristic mode',
    clearedWithEnvProvider:
      'UI keys cleared. Active provider from .env: {name}',
    clearedNoProvider:
      'Keys cleared — no active provider. Using heuristic mode.',
  },

  modes: {
    rules: 'Rules mode',
    ai: 'AI mode',
    rulesTitle: 'Use local rule-based classification',
    aiNeedsKeyTitle: 'Configure an API key to enable AI mode',
    aiActivateTitle: 'Enable AI mode — {name}',
    settingsTitle: 'Configure AI providers',
    settingsAriaLabel: 'Configure API',
  },

  status: {
    exampleLoaded: 'Example loaded. Press "Analyze context".',
    writeSomethingFirst: 'Write a need or prompt first.',
    analyzingWith: 'Analyzing with {name}...',
    aiUnavailable: 'AI mode unavailable ({reason}). Local rules mode was used.',
    analysisReady: 'Analysis generated.',
    copyFailed:
      'Could not copy automatically. Select the text and copy it manually.',
    markdownDownloaded: 'Markdown downloaded.',
    responseEvaluated: 'Response evaluated.',
    contextFilled: 'Context filled in from reference material.',
    refinedPromptCopied: 'Refined prompt copied.',
    reportCopied: 'Full report copied as Markdown.',
    updatedPromptCopied: 'Updated prompt copied.',
    nextPromptCopied: 'Next prompt copied.',
  },

  provider: {
    noProviderConfigured: 'No provider configured',
    timeout: 'The provider did not respond within {seconds}s (timeout)',
    unknownError: 'Unknown error',
    unknownProvider: 'Unknown provider: {id}',
    noJSON: 'Could not extract valid JSON from the AI response',
  },

  advice: {
    diagnosticWithKeywords:
      'This category was detected because the prompt contains signals such as: {keywords}.',
    diagnosticWithoutKeywords:
      'This category was detected from general text matches, with no specific signals.',
  },

  refinedPrompt: {
    originalTask: "User's original task:",
    contextIntro:
      'Before answering, note that I am going to share this recommended context:',
    needHelpWith: 'I need your help with: {expectedOutput}.',
    conditionsTitle: 'Response conditions:',
    conditions: [
      'First state what information is missing, if any.',
      'Prioritize what matters most.',
      'Return concrete, verifiable steps.',
      'Do not invent data that is not in the shared material.',
    ],
  },

  auditLogic: {
    thisQuery: 'this request',
    generalChecklist: [
      'Goal',
      'Context',
      'Available material',
      'What you want to receive',
      'Limits or conditions',
    ],
    generalRisks: [
      'The AI may answer generically if it does not understand the concrete goal.',
      'It may invent details or assume constraints that were never stated.',
      'The answer may take several rounds before it becomes usable.',
    ],
    fallbackMissingItems: [
      'A concrete example or real case',
      'Important constraints or limits',
      'The exact output format',
    ],
    risks: {
      n8n: 'In n8n, without the workflow, the node, the data and the exact error, it is easy to propose changes in the wrong place.',
      programming:
        'In programming, without code, error and command, the AI can mistake symptoms for root cause.',
      error: 'Without the full error, the AI may diagnose the wrong cause.',
      io: 'Without input and output examples, it is easy to propose a solution that does not fit the real data.',
      material:
        'Without {item}, the answer for {category} may stay at overly general recommendations.',
      constraints:
        'Without clear constraints, the AI may suggest unfeasible or unsafe steps.',
      objective:
        'Without a defined expected result, the AI may optimize for a goal other than yours.',
      generic:
        '{item} is missing, so the AI might assume it instead of asking for it.',
    },
    questions: {
      error: 'What is the full error message and when does it appear?',
      code: 'Which file, code block or exact snippet should the AI review?',
      workflow:
        'Can you share the exported workflow without credentials, or describe its main steps?',
      node: 'Which node fails or concentrates the behavior you want to fix?',
      input: 'What is a realistic example of the input the system receives?',
      output: 'What output did you expect and what output are you getting now?',
      constraints:
        'What constraints, tools or conditions must the answer respect?',
      format: 'In what format do you want the final answer?',
      objective: 'What concrete goal do you want to achieve with the AI?',
      generic: 'What information can you add about "{item}"?',
    },
  },

  evaluatorLogic: {
    originalTask: 'the original task',
    emptyWeakPoint: 'The response is empty or too short to evaluate.',
    emptyRisk:
      'There is not enough content to tell whether it answers the original goal.',
    emptyStrength: 'There is no substantive answer to build on yet.',
    notAddressed: 'Does not clearly address: {item}.',
    strengths: {
      concreteSteps: 'Includes concrete steps or actions.',
      mentionsFormat: 'Mentions part of the recommended format or material.',
      considersSecondary: 'Considers useful complementary context.',
      developed: 'The response is developed enough to review details.',
      baseline: 'The response offers an initial base to build on.',
    },
    weakPoints: {
      noConcreteSteps: 'Does not offer concrete or verifiable steps.',
      ignoresMissingContext:
        'Does not pick up the missing context detected before asking the AI.',
      none: 'No critical weaknesses detected with the current rules.',
    },
    risks: {
      hardToExecute:
        'The response may be hard to execute because it never gets to actions.',
      vagueLanguage: 'Uses vague language without enough action: {matches}.',
      offTarget: 'Does not seem to answer the original goal directly.',
      none: 'No strong risks detected with the current rules.',
    },
    nextPrompt: {
      role: 'Act as a specialist in {category}.',
      objectiveIntro: 'My original goal was:',
      fallbackObjective: 'I need a more complete and actionable answer.',
      weakPointsIntro:
        'Improve your previous answer by fixing these weak points:',
      missingContextIntro: 'I also need you to consider this missing context:',
      risksIntro: 'Risks to avoid:',
      closingIntro: 'Return an improved version with:',
      closing: [
        'concrete, verifiable steps;',
        'explicit assumptions;',
        'priorities;',
        'any data you need me to confirm before executing changes.',
      ],
      defaultMissingContext: [
        'Assumptions you used',
        'Data that is missing',
        'Concrete actions to move forward',
      ],
      defaultWeakPoints: [
        'Check whether a concrete step, example or verification criterion is missing.',
      ],
      defaultRisks: ['Avoid generic answers and state your assumptions.'],
    },
  },

  autofillLogic: {
    theTask: 'the task',
    labels: {
      audience: 'Audience',
      tone: 'Tone',
      callToAction: 'CTA',
      format: 'Format',
      constraints: 'Constraints',
      objective: 'Inferred goal',
      constraint: 'Constraint',
      sourceSummary: 'Material summary',
    },
    defaultMissingItems: ['Goal', 'Audience', 'Output format', 'Constraints'],
    values: {
      audience: {
        clientes: 'customers',
        usuarios: 'users',
        empresas: 'companies',
        pymes: 'small businesses',
        estudiantes: 'students',
        docentes: 'teachers',
        leads: 'leads',
        equipoInterno: 'internal team',
      },
      tone: {
        formal: 'formal',
        cercano: 'friendly',
        profesional: 'professional',
        tecnico: 'technical',
        comercial: 'commercial',
        academico: 'academic',
        directo: 'direct',
      },
      cta: {
        comprar: 'buy',
        registrarse: 'sign up',
        responder: 'reply',
        agendar: 'book a meeting',
        descargar: 'download',
        renovar: 'renew',
        contactar: 'get in touch',
        formulario: 'fill in a form',
      },
      format: {
        email: 'email',
        campana: 'campaign',
        landing: 'landing page',
        informe: 'report',
        resumen: 'summary',
        post: 'post',
        anuncio: 'ad',
        propuesta: 'proposal',
        script: 'script',
      },
    },
    updatedPrompt: {
      role: 'Act as a specialist in {category}.',
      objectiveIntro: 'Original goal:',
      fallbackObjective: 'I need help with this task.',
      inferredIntro: 'Context inferred from the reference material:',
      filledIntro: 'Gaps the material helped fill:',
      missingIntro: 'Context that still needs confirming:',
      noInferred: 'Not enough context could be inferred.',
      noFilled: 'No gap has been filled yet.',
      noMissing: 'No critical gaps left according to the rules.',
      closing:
        'Use the inferred context as support, but do not invent data that is not in the material. If something critical is missing, ask for it before giving a final answer.',
    },
  },

  report: {
    fileName: 'contextforge-report.md',
    title: '# Context report — ContextForge',
    originalPrompt: 'Original prompt',
    detectedCategory: 'Detected category',
    estimatedConfidence: 'Estimated confidence: {value}%',
    primaryFormats: 'Recommended primary format',
    secondaryFormats: 'Complementary formats',
    avoid: 'What to avoid',
    checklist: 'Checklist to share with the AI',
    reason: 'Reason',
    contextQuality: 'Context quality',
    score: 'Score: {score}/100',
    level: 'Level: {level}',
    improvements: 'Suggested improvements',
    solidContext: 'The initial context is solid.',
    refinedPrompt: 'Refined prompt',
    auditSection: 'Missing-context audit',
    auditMissing: 'Missing context',
    auditRisks: 'Risks of leaving it out',
    auditQuestions: 'Useful questions before asking the AI',
    autofillSection: 'Context filled from reference material',
    autofillReference: 'Pasted reference material',
    autofillInferred: 'Inferred context',
    autofillFilled: 'Gaps filled',
    autofillStillMissing: 'Gaps still open',
    autofillUpdatedPrompt: 'Updated prompt',
    evaluationSection: 'AI response evaluation',
    evaluationResponse: 'Pasted response',
    evaluationLevel: 'Completion level',
    evaluationStrengths: 'What it got right',
    evaluationWeakPoints: 'What is missing or weak',
    evaluationRisks: 'Risks',
    evaluationNextPrompt: 'Recommended next prompt',
    noData: 'No data.',
    noInferredContext: 'No inferred context.',
  },
};
