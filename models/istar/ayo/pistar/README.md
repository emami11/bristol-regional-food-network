# Ayo's SR in piStar

**Start with [BRFN-Ayo-SR-Core.txt](BRFN-Ayo-SR-Core.txt).** This simplified five-actor model contains 27 internal elements and six dependencies for product listing and inventory management.

1. Download the `.txt` file using GitHub's **Download raw file** button.
2. Open [piStar](https://www.cin.ufpe.br/~jhcp/pistar/tool/).
3. Select **File → Load Model**, choose the file and click **Load model**.

Use **File → Save Model** to save edits and **File → Save Image** to export a picture. The `.txt` file contains native piStar JSON model data.

![Simplified SR](BRFN-Ayo-SR-Core.png)

[Full-size PNG](BRFN-Ayo-SR-Core.png) · [SVG preview](BRFN-Ayo-SR-Core.svg)

## Supporting models

- [Detailed five-actor SR](BRFN-Ayo-SR-Detailed.txt): the previous 72-element, 14-dependency version, including verification exceptions. [Original piStar picture](BRFN-Ayo-SR-Detailed.png).
- [Expanded eight-actor SR](BRFN-Ayo-SR-Expanded.txt): buyer segments, payment and settlement context.
- [Producer-only learning view](BRFN-Ayo-SR-Producer-Focus.txt): an earlier focused view, without cross-actor dependencies.
- [Earlier draw.io sources and detailed notes](../DETAILED-NOTES.md).

## Checks

The simplified file passes the official piStar 2.1.0 relationship constraint functions, checked offline, along with endpoint and AND-refinement checks. Its PNG/SVG preview is generated from the same model data; it is not a new export from piStar. Live import could not be rechecked because the browser connection was unavailable.

The archived detailed file was previously imported and saved in the official piStar tool, preserving all actors, elements, dependencies and links. The expanded and producer-focus files have structural checks.

The diagram groups validation checks and stock updates at an explanatory level. Detailed retries, review policy and payment context remain in the supporting models. Group review and consistency with the separate SD model are still required.
