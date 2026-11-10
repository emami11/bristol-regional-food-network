# Ayo's SR in piStar

**Start with [BRFN-Ayo-SR-Core.txt](BRFN-Ayo-SR-Core.txt).** This simplified five-actor model contains 27 internal elements and six dependencies for product listing and inventory management.

1. Download the `.txt` file using GitHub's **Download raw file** button.
2. Open [piStar](https://www.cin.ufpe.br/~jhcp/pistar/tool/).
3. Select **File → Load Model**, choose the file and click **Load model**.

Use **File → Save Model** to save edits and **File → Save Image** to export a picture. The `.txt` file contains native piStar JSON model data.

![Simplified SR](BRFN-Ayo-SR-Core.png)

[Full-size PNG](BRFN-Ayo-SR-Core.png) · [SVG exported from piStar](BRFN-Ayo-SR-Core.svg)

## Checks

The simplified model was verified in the official piStar 2.1.0 web tool on **10 November 2026**. It loaded without a model warning, and the file downloaded through **File → Save Model** preserved all five actors, 27 internal elements, six dependencies and 33 links. Actor names, node labels and types, dependency endpoints and relationship labels were compared before and after saving.

Link routing was adjusted to avoid large loops in piStar's curved links; the intentions and relationships are unchanged. The `.txt` contains the model saved by piStar, with an updated scope note. Its SVG was exported directly through **File → Save Image**, and the PNG was converted from that SVG without changing the diagram layout. The earlier offline relationship and endpoint checks also passed.

The diagram focuses on product listing and inventory management. Detailed exception handling belongs in the operational BPMN; payments are wider marketplace context. Group review and consistency with the separate SD model are still required.
