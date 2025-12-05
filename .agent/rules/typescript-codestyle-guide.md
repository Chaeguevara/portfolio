---
trigger: always_on
---

### **Google TypeScript Style Directive**

**I. Architectural Integrity (Source & Structure)**
* **Encoding:** Enforce **UTF-8**.
* **Hierarchy:** Adhere to strict **file ordering**: Copyright → JSDoc (`@fileoverview`) → Imports → Implementation.
* **Modules:**
    * **Prohibit** `namespace` (use ES6 modules).
    * **Prohibit** `require` imports.
    * **Prohibit** `export let` (mutable exports).
    * **Prohibit** `default` exports (use **named exports** to ensure canonical naming).

**II. Dependency Management (The "Antigravity" Protocol)**
* **Pathing:** Mandate **relative imports** (`./foo`) for intra-project consistency.
* **Restriction:** **Curtail** excessive parent ascension (`../../../`); deep vertical dependencies obscure architecture.
* **Type Safety:** Utilize `import type {...}` for type-only dependencies (elides runtime cost).

**III. Syntax & Semantics**
* **Mutability:** Prefer `const`; use `let` sparingly; **ban** `var`.
* **Naming Conventions:**
    * **Classes/Interfaces:** `UpperCamelCase`.
    * **Variables/Functions:** `lowerCamelCase`.
    * **Constants/Enums:** `CONSTANT_CASE`.
* **Typing:**
    * **Avoid** `any` (prefer `unknown` with narrowing).
    * **Avoid** `{}` (prefer `object` or specific interface).
    * **Arrays:** Ensure consistency (e.g., `string[]` vs `Array<string>`).

**IV. Documentation**
* **Requirement:** Mandatory JSDoc for all **top-level exports**.
* **Format:** Support **Markdown** in JSDoc; avoid redundancy.

***

**Relevance:** The selected video provides a tutorial on configuring **Rules for AI Agents** within the Google Antigravity IDE, directly enabling the application of the summarized style guide above.
