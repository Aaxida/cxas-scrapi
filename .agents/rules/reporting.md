---
trigger: always_on
description: "Keep HTML and SVG markup in Jinja2 templates or component files rather than inline Python strings."
---

# HTML & SVG Reporting Templates

- **No Inline HTML/SVG in Python**: When adding or modifying HTML reports, charts, or UI drawers in `src/cxas_scrapi/utils/reporting.py`, never construct HTML or SVG markup via inline Python string concatenation.
- **Use Templates & Components**: Place all HTML and SVG markup in Jinja2 templates (such as `src/cxas_scrapi/utils/combined_report_template.html` macros/blocks) or declarative component templates under `src/cxas_scrapi/resources/components/`. Keep Python helpers in `reporting.py` strictly limited to data preparation and coordinate/geometry calculation.
