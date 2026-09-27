"""Deterministic catalog-based purity check module.
Used to evaluate waste segregation purity deterministically by declared category and subtype.
"""

PURITY_SCORES = {
    "wet": {
        "kitchen vegetable & fruit scraps": 95,
        "cooked food waste & leftovers": 90,
        "tea leaves & coffee grounds": 92,
        "garden trimmings & fallen leaves": 88,
        "vegetable scraps": 95,
        "fruit peels": 94,
        "compost mix": 91,
        "kitchen scraps": 92,
        "default": 85,
    },
    "dry": {
        "cardboard shipping cartons & paper": 94,
        "pet water & soda bottles": 96,
        "aluminium & steel beverage cans": 95,
        "clean glass containers & jars": 93,
        "cardboard & paper": 94,
        "plastic bottles": 95,
        "beverage cans": 95,
        "paper & metal cans": 92,
        "default": 85,
    },
    "harmful": {
        "used lithium & alkaline batteries": 90,
        "discarded electronics & circuit boards": 88,
        "fluorescent tubes & cfl bulbs": 87,
        "expired domestic pharmaceutical medicines": 85,
        "used batteries": 90,
        "e-waste circuits": 88,
        "cfl / fluorescent": 87,
        "medical & e-waste": 86,
        "default": 80,
    },
}

CONTAMINATION_KEYWORDS = ("mixed", "contaminated", "contamination", "soiled", "unsegregated")


def calculate_purity_score(waste_type: str, subtype: str) -> tuple[int, bool, str]:
    """Calculate deterministic purity score for a given category and subtype.

    Returns:
        (score, accepted, rationale)
    """
    category_key = (waste_type or "wet").strip().lower()
    subtype_text = (subtype or "").strip().lower()

    category_scores = PURITY_SCORES.get(category_key, PURITY_SCORES.get("wet", {}))

    # Check for direct match in catalog
    score = None
    if subtype_text in category_scores:
        score = category_scores[subtype_text]
    else:
        # Check for partial match
        for key, val in category_scores.items():
            if key != "default" and (key in subtype_text or subtype_text in key):
                score = val
                break

    if score is None:
        score = category_scores.get("default", 85)

    # Check for contamination keywords
    has_contamination = any(word in subtype_text for word in CONTAMINATION_KEYWORDS)
    if has_contamination:
        score = max(30, score - 35)
        accepted = False
        rationale = f"Contamination detected in subtype ('{subtype}'). Purity score: {score}% (below 70% threshold)."
    else:
        accepted = score >= 70
        rationale = (
            f"Verified catalog-based purity score: {score}%. "
            f"Meets municipal segregation standards for {category_key} waste."
            if accepted
            else f"Purity score {score}% is below required municipal segregation standard (70%)."
        )

    return score, accepted, rationale


if __name__ == "__main__":
    for cat, sub in [
        ("wet", "Kitchen Vegetable & Fruit Scraps"),
        ("dry", "PET Water & Soda Bottles"),
        ("harmful", "Used Batteries"),
        ("dry", "Mixed and contaminated plastic"),
    ]:
        s, a, r = calculate_purity_score(cat, sub)
        print(f"[{cat}] {sub} -> score: {s}, accepted: {a}, rationale: {r}")
