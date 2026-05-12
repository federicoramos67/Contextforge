MANUAL_CASES = [
    {
        "id": "n8n_webhook_failure",
        "prompt": (
            "Quiero que una IA me ayude a corregir un workflow de n8n "
            "que falla cuando recibe datos de un webhook."
        ),
        "expected_category": "n8n_automation",
        "expected_confidence": "media-alta",
        "expected_keywords": ["n8n", "workflow n8n", "webhook n8n"],
        "expected_explanation_contains": ["n8n", "workflow", "webhook"],
        "notes": "Debe priorizar la categoria especifica de n8n sobre automatizacion generica.",
    },
    {
        "id": "csv_dashboard_kpis",
        "prompt": "Necesito que una IA analice un CSV de ventas y me proponga KPIs para un dashboard.",
        "expected_category": "advanced_data_analysis",
        "expected_confidence": "media",
        "expected_keywords": ["kpi", "dashboard"],
        "expected_explanation_contains": ["kpi", "dashboard"],
        "notes": "Debe detectar analisis de datos aunque el prompt sea breve.",
    },
    {
        "id": "insufficient_general_prompt",
        "prompt": "Necesito ayuda.",
        "expected_category": "general_context",
        "expected_confidence": "baja",
        "expected_keywords": [],
        "expected_explanation_contains": ["coincidencias generales", "sin keywords especificas"],
        "notes": "Debe caer en contexto general porque no hay suficientes senales especificas.",
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
