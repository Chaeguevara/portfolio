---
trigger: always_on
---

# Git & Contribution Process

Keep our history clean and our code high quality.

## Contribution Guidelines
- **Focus**: Small, atomic changes. Avoid massive refactors in feature PRs.
- **Size**: Functions should be small (aim for ≤30 lines).
- **Clean**: Remove dead code and `console.log` before committing.
- **Docs**: Explain "Why", not just "What".

## Commit Messages
Follow the standard conventional style or the "Imperative Mood" rule:
1.  **Subject**: Capitalized, imperative (e.g., "Refactor renderer", not "Refactored..."). Max 50 chars.
2.  **Body**: Explain *what* and *why*. Wrap at 72 chars. Separate from subject with blank line.

### Example
```text
Refactor GPU picking logic for performance

Separate the color picking pass from the main render loop to reduce overhead.
fixes lagging on high-DPI screens.
```
