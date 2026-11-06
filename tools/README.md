# Ayo's model generation code

Run these commands from the repository root with Python 3:

```sh
python tools/build_ayo_sr.py
python tools/build_ayo_bpmn.py
```

- [build_ayo_sr.py](build_ayo_sr.py) defines and generates the core and expanded iStar SR models. It uses [istar_support.py](istar_support.py) to write the editable `.drawio` files and SVG pages, plus JSON model data and Markdown registers in `models/istar/ayo/`.
- [build_ayo_bpmn.py](build_ayo_bpmn.py) generates the editable BPMN XML, diagram layout and JSON geometry map in `bpmn/personal/ayo/`.

Both generators use Python's standard library. Rebuilding replaces generated files, so save any manual diagrams.net or Camunda Modeler edits before running them.

## Diagram pictures

PNG and SVG pictures are committed alongside both models for viewing on GitHub. The SR generator produces the SVG pages; the PNG files are raster exports of those pages. The BPMN overview pictures were exported through bpmn-js. After changing a model, refresh its picture exports too: the generators do not regenerate PNGs or the BPMN overview picture.

## BPMN schema validation

The optional checker requires `lxml`:

```sh
python -m pip install lxml
python tools/check_ayo_bpmn_schema.py
```

It downloads the five official OMG BPMN 2.0 schema files when needed and checks the personal `.bpmn` file. The cache is outside this repository, in `../output/ayo-modelling/schema/`. Schema validation confirms XML structure; business decisions and SR/SD consistency still need group review.
