# Ayo's SR in piStar

Use **piStar** for the project's SR modelling. The files in this folder contain native piStar JSON data with a `.txt` extension, matching piStar's Save Model / Load Model file format.

| File | Use |
|---|---|
| [BRFN-Ayo-SR-Core.txt](BRFN-Ayo-SR-Core.txt) | Main five-actor SR for Use Case 1. |
| [BRFN-Ayo-SR-Expanded.txt](BRFN-Ayo-SR-Expanded.txt) | Optional wider buyer/payment context, with eight actors. |
| [BRFN-Ayo-SR-Producer-Focus.txt](BRFN-Ayo-SR-Producer-Focus.txt) | Producer-only learning view; it omits cross-actor dependencies and does not replace the full model. |

## Open the model

1. Download the `.txt` model file from GitHub using **Download raw file**. Keep its `.txt` extension.
2. Open [piStar](https://www.cin.ufpe.br/~jhcp/pistar/tool/).
3. Select **File → Load Model**.
4. Choose the downloaded `.txt` file and click **Load model**.
5. Scroll around the canvas and use your browser's zoom controls to inspect the full SR.

Use **File → Save Model** to download your edited model. Use **File → Save Image** to export its picture. An image alone is not an editable piStar model.

## Picture

![Five-actor SR exported from piStar](BRFN-Ayo-SR-Core.png)

Open the [full-size PNG](BRFN-Ayo-SR-Core.png) or [SVG](BRFN-Ayo-SR-Core.svg) and zoom in for the labels. The full model contains a large number of internal and cross-actor relationships; the producer-only file helps with learning the notation.

## Conversion and checks

Converted on 9 November 2026 from the existing SR model data, which records repository baseline `9aeeddc`. The business scope and element IDs are preserved. Generic iStar 2.0 actors, goals, tasks, resources, qualities, AND/OR refinements, needed-by, qualifications, contribution labels and typed dependencies use piStar's native types.

The core file was loaded into the official piStar 2.1.0 web tool without a model warning, then saved again using its Save Model command. The saved file preserved five actors, 72 internal elements, 14 dependencies and all 96 links, including the two links for each dependency. Its SVG picture was exported from piStar and rasterised to PNG. The expanded and producer-focus files use the same native format and have structural checks; they have not been separately round-tripped through the web tool.

The [earlier diagrams.net drawings](../README.md) remain reference views. Use the native piStar files for the required tool, and refresh exports after editing. Dependency alignment with the group's separately owned SD and group review remain outstanding.

Format reference: [piStar official source](https://github.com/jhcp/piStar/blob/master/tool/app/istarcore/fileManager.js).
