"""Casos de validación manual del clasificador de ContextForge.

Este script no se conecta a la app ni duplica la lógica del clasificador: solo
lista casos y sus resultados esperados para apoyar validaciones manuales en el
navegador.

Los valores esperados corresponden a la interfaz en español. La categoría (`id`)
no depende del idioma, pero las keywords detectadas sí: con la interfaz en
inglés, el mismo prompt devuelve la lista de keywords en inglés.

Uso:
    python tools/classifier_manual_cases.py
"""

MANUAL_CASES = [
    {
        "id": "n8n_webhook_failure",
        "prompt": (
            "Quiero que una IA me ayude a corregir un workflow de n8n "
            "que falla cuando recibe datos de un webhook."
        ),
        "expected_category": "n8n_automation",
        "expected_confidence": "~40%",
        "expected_keywords": ["n8n", "workflow n8n", "webhook n8n"],
        "expected_explanation_contains": ["señales como", "n8n"],
        "notes": (
            "Debe priorizar la categoría específica de n8n sobre automatización "
            "genérica. Con la interfaz en inglés las keywords salen como "
            "'n8n workflow' y 'n8n webhook'."
        ),
    },
    {
        "id": "csv_dashboard_kpis",
        "prompt": (
            "Necesito que una IA analice un CSV de ventas y me proponga "
            "KPIs para un dashboard."
        ),
        "expected_category": "advanced_data_analysis",
        "expected_confidence": "~30%",
        "expected_keywords": ["kpis", "dashboard"],
        "expected_explanation_contains": ["señales como", "dashboard"],
        "notes": (
            "Debe detectar análisis de datos aunque el prompt sea breve, y no "
            "quedarse en la categoría tabular básica."
        ),
    },
    {
        "id": "insufficient_general_prompt",
        "prompt": "Necesito ayuda.",
        "expected_category": "general_context",
        "expected_confidence": "20%",
        "expected_keywords": [],
        "expected_explanation_contains": [
            "coincidencias generales",
            "sin señales específicas",
        ],
        "notes": (
            "Debe caer en contexto general porque no hay suficientes señales "
            "específicas."
        ),
    },
]


def format_list(items):
    if not items:
        return "(ninguna)"
    return ", ".join(items)


def print_manual_cases(cases):
    print("ContextForge - casos manuales del clasificador")
    print("=" * 52)
    print(f"Total de casos: {len(cases)}")
    print("Interfaz esperada: español")

    for index, case in enumerate(cases, start=1):
        print()
        print(f"[{index}] {case['id']}")
        print("-" * 52)
        print("Prompt:")
        print(case["prompt"])
        print()
        print("Esperado:")
        print(f"Categoria: {case['expected_category']}")
        print(f"Confianza: {case['expected_confidence']}")
        print(f"Keywords: {format_list(case['expected_keywords'])}")
        print(
            "Explicacion debe contener: "
            f"{format_list(case['expected_explanation_contains'])}"
        )
        print(f"Notas: {case['notes']}")


if __name__ == "__main__":
    print_manual_cases(MANUAL_CASES)
