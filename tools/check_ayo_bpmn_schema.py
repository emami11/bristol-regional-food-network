"""Validate the personal model against the OMG BPMN 2.0 schemas.

Downloads the five official schema files into the task's output folder if absent.
"""
from pathlib import Path
from urllib.request import urlopen
from lxml import etree

root=Path(__file__).resolve().parents[1]
cache=root.parent/'output'/'ayo-modelling'/'schema'
cache.mkdir(parents=True,exist_ok=True)
for name in ['BPMN20.xsd','Semantic.xsd','BPMNDI.xsd','DI.xsd','DC.xsd']:
    path=cache/name
    if not path.exists():
        with urlopen('https://www.omg.org/spec/BPMN/20100501/'+name,timeout=20) as response:
            path.write_bytes(response.read())
schema=etree.XMLSchema(etree.parse(str(cache/'BPMN20.xsd')))
model=root/'bpmn'/'personal'/'ayo'/'BRFN-Ayo-Strategic-BPMN.bpmn'
schema.assertValid(etree.parse(str(model)))
print('Personal BPMN passes the official OMG BPMN 2.0 XML schemas.')
