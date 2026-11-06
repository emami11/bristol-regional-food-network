"""Shared iStar drawing support for Ayo's November model revision."""
from pathlib import Path
import json, textwrap
import xml.etree.ElementTree as ET
from xml.sax.saxutils import escape
ACTORS, ELEMENTS, LINKS, DEPS, VIEWS = {}, {}, [], [], []
OUT = Path('.')
EXPORTS = Path('.')

def actor(key, name, scope):
    ACTORS[key] = dict(id=key, name=name, scope=scope, type='generic actor')


def element(actor_id, suffix, kind, label, basis='UC1'):
    key = actor_id + '-' + suffix
    assert key not in ELEMENTS, key
    ELEMENTS[key] = dict(id=key, actor=actor_id, type=kind, label=label, basis=basis)
    return key


def link(start, end, kind, value=None):
    LINKS.append(dict(source=start, target=end, type=kind, value=value))


def refine(parent, *children):
    for child in children:
        link(child, parent, 'refinement', 'AND')


def needed(resource, *tasks):
    for task in tasks:
        link(resource, task, 'neededBy')


def contribution(source, target, value='Help'):
    link(source, target, 'contribution', value)


def dependency(key, start, end, kind, label, scope):
    DEPS.append(dict(id=key, source=start, target=end, type=kind,
                     label=label, scope=scope))


def view(key, owner, title, goals, tasks, resources, qualities, delegated=()):
    VIEWS.append(dict(id=key, actor=owner, title=title, goals=goals,
                      tasks=tasks, resources=resources, qualities=qualities,
                      delegated=list(delegated)))



def validate():
    """Check modelling constraints before producing editable diagrams."""
    assert len(ACTORS) in {5, 8}
    assert len({dep['id'] for dep in DEPS}) == len(DEPS)
    for node in ELEMENTS.values():
        assert node['actor'] in ACTORS
    groups = {}
    for edge in LINKS:
        start, end = ELEMENTS[edge['source']], ELEMENTS[edge['target']]
        assert start['actor'] == end['actor'], edge
        kind = edge['type']
        if kind == 'refinement':
            assert start['type'] in {'goal','task'} and end['type'] in {'goal','task'}
            groups.setdefault(end['id'], set()).add(edge['value'])
        elif kind == 'neededBy':
            assert start['type'] == 'resource' and end['type'] == 'task'
        elif kind == 'contribution':
            assert end['type'] == 'quality'
            assert edge['value'] in {'Help','Hurt','Make','Break'}
        elif kind == 'qualification':
            assert start['type'] == 'quality' and end['type'] != 'quality'
        else:
            raise ValueError(kind)
    assert all(len(kinds) == 1 for kinds in groups.values())
    for dep in DEPS:
        start, end = ELEMENTS[dep['source']], ELEMENTS[dep['target']]
        assert start['actor'] != end['actor'], dep
        assert start['type'] == dep['type'] == end['type'], dep
        # A fully delegated element cannot also be achieved by local refinement.
        assert not any(edge['target'] == start['id'] and
                       edge['type'] in {'refinement','contribution'} for edge in LINKS), dep
    refinement = {}
    for edge in LINKS:
        if edge['type'] == 'refinement':
            refinement.setdefault(edge['source'], []).append(edge['target'])
    def visit(node, path):
        assert node not in path, 'Refinement cycle: '+node
        for parent in refinement.get(node, []):
            visit(parent, path | {node})
    for node in refinement:
        visit(node, set())
    shown = set()
    for item in VIEWS:
        ids = sum((item[group] for group in ['goals','tasks','resources','qualities','delegated']), [])
        assert len(ids) == len(set(ids))
        assert all(ELEMENTS[key]['actor'] == item['actor'] for key in ids)
        shown.update(ids)
    assert shown == set(ELEMENTS), ('Missing view nodes', set(ELEMENTS)-shown)



COLORS = dict(goal='#e5f2e6', task='#e7effa', resource='#fff4db', quality='#f0e7fa')
W, H = 2100, 1510
FONT = 'Arial, sans-serif'
mxfile = ET.Element('mxfile', host='app.diagrams.net', version='24.7.17')


class Page:
    def __init__(self, name, width=W, height=H):
        self.name, self.width, self.height = name, width, height
        diagram = ET.SubElement(mxfile, 'diagram', id=name, name=name)
        model = ET.SubElement(diagram, 'mxGraphModel', dx='1500', dy='1000', grid='1',
                              gridSize='10', guides='1', tooltips='1', connect='1', arrows='1',
                              fold='1', page='1', pageScale='1', pageWidth=str(width), pageHeight=str(height))
        self.root = ET.SubElement(model,'root')
        ET.SubElement(self.root,'mxCell',id='0')
        ET.SubElement(self.root,'mxCell',id='1',parent='0')
        self.parts, self.nodes, self.lines = [], {}, []
        self.count = 0

    def text(self, x, y, label, size=20, anchor='start', color='#243246'):
        self.parts.append(f'<text x="{x}" y="{y}" font-size="{size}" text-anchor="{anchor}" fill="{color}">{escape(label)}</text>')

    def cell(self, key, label, style, x, y, w, h, parent='1'):
        cell = ET.SubElement(self.root,'mxCell',id=key,value=label,style=style,vertex='1',parent=parent)
        ET.SubElement(cell,'mxGeometry',x=str(x),y=str(y),width=str(w),height=str(h),attrib={'as':'geometry'})

    def note(self, key, x, y, w, h, label, size=20):
        self.cell(key,label,f'text;html=0;whiteSpace=wrap;align=left;verticalAlign=middle;fontSize={size};fontColor=#243246;',x,y,w,h)
        for i, line in enumerate(textwrap.wrap(label, max(20, int(w/(size*.53))))):
            self.text(x,y+size+3+i*(size+5),line,size)

    def boundary(self, key, x, y, w, h):
        self.cell(key,'','rounded=1;arcSize=9;dashed=1;fillColor=#fafbfd;strokeColor=#8b96a3;strokeWidth=2;',x,y,w,h)
        self.parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="45" fill="#fafbfd" stroke="#8b96a3" stroke-width="2" stroke-dasharray="9 7"/>')

    def node(self, key, kind, label, x, y, w=330, h=88, parent='1', parent_xy=(0,0)):
        style = 'html=0;whiteSpace=wrap;fontSize=20;strokeWidth=1.8;fontColor=#172536;'
        if kind in {'goal','actor'}:
            style += 'ellipse;'
        elif kind == 'task':
            style += 'shape=hexagon;perimeter=hexagonPerimeter2;size=0.08;'
        elif kind == 'quality':
            style += 'shape=cloud;'
        else:
            style += 'rounded=0;'
        fill = COLORS.get(kind,'#e7ecef')
        style += 'fillColor='+fill+';strokeColor=#475569;'
        self.cell(key,label,style,x-parent_xy[0],y-parent_xy[1],w,h,parent)
        self.nodes[key]=(x,y,w,h)
        if kind in {'goal','actor'}:
            self.parts.append(f'<ellipse cx="{x+w/2}" cy="{y+h/2}" rx="{w/2}" ry="{h/2}" fill="{fill}" stroke="#475569" stroke-width="1.8"/>')
        elif kind == 'task':
            points=[(x+20,y),(x+w-20,y),(x+w,y+h/2),(x+w-20,y+h),(x+20,y+h),(x,y+h/2)]
            self.parts.append('<polygon points="'+' '.join(f'{a},{b}' for a,b in points)+f'" fill="{fill}" stroke="#475569" stroke-width="1.8"/>')
        elif kind == 'quality':
            # Cloud outline, with sufficient flat centre area for wrapped labels.
            d=f'M {x+.12*w} {y+.32*h} C {x-.02*w} {y+.18*h} {x+.19*w} {y-.12*h} {x+.34*w} {y+.12*h} C {x+.48*w} {y-.05*h} {x+.72*w} {y-.02*h} {x+.77*w} {y+.2*h} C {x+1.06*w} {y+.12*h} {x+1.06*w} {y+.58*h} {x+.9*w} {y+.65*h} C {x+1.0*w} {y+.98*h} {x+.68*w} {y+1.08*h} {x+.57*w} {y+.85*h} C {x+.35*w} {y+1.08*h} {x+.08*w} {y+.94*h} {x+.13*w} {y+.73*h} C {x-.04*w} {y+.66*h} {x-.01*w} {y+.4*h} {x+.12*w} {y+.32*h} Z'
            self.parts.append(f'<path d="{d}" fill="{fill}" stroke="#475569" stroke-width="1.8"/>')
        else:
            self.parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{fill}" stroke="#475569" stroke-width="1.8"/>')
        lines=[]
        for part in label.split('\n'):
            lines.extend(textwrap.wrap(part,max(16,int(w/11.5)-4)))
        assert len(lines)*24 <= h+2, (key,label,lines,h)
        base=y+h/2-(len(lines)-1)*12+7
        for i,line in enumerate(lines):
            self.text(x+w/2,base+i*24,line,20,'middle','#172536')

    def edge(self, source, target, kind, value=None, points=None):
        self.count += 1
        sx,sy,sw,sh=self.nodes[source]
        tx,ty,tw,th=self.nodes[target]
        if points is None:
            if ty<sy:
                points=[(sx+sw/2,sy),(tx+tw/2,ty+th)]
            else:
                points=[(sx+sw/2,sy+sh),(tx+tw/2,ty)]
        labels={'refinement':value or 'AND','neededBy':'','contribution':value,'dependency':'D','qualification':'qualifies'}
        label=labels[kind]
        arrow={'refinement':'dash','neededBy':'oval','contribution':'open','dependency':'open','qualification':'none'}[kind]
        if kind == 'refinement' and value == 'OR': arrow = 'block'
        style=f'edgeStyle=none;html=0;rounded=0;endArrow={arrow};endFill=0;strokeColor=#475569;strokeWidth=1.5;fontSize=17;labelBackgroundColor=#ffffff;'
        if kind == 'qualification': style += 'dashed=1;'
        cell=ET.SubElement(self.root,'mxCell',id='edge-'+str(self.count),value=label,style=style,edge='1',parent='1',source=source,target=target)
        geometry=ET.SubElement(cell,'mxGeometry',relative='1',attrib={'as':'geometry'})
        if len(points)>2:
            arr=ET.SubElement(geometry,'Array',attrib={'as':'points'})
            for x,y in points[1:-1]:
                ET.SubElement(arr,'mxPoint',x=str(x),y=str(y))
        attrs='fill="none" stroke="#475569" stroke-width="1.5"'
        if kind == 'qualification': attrs += ' stroke-dasharray="5 5"'
        marker={'refinement':'bar','neededBy':'circle','contribution':'arrow','dependency':'arrow','qualification':'none'}[kind]
        if kind == 'refinement' and value == 'OR': marker = 'triangle'
        end_marker='' if marker=='none' else f' marker-end="url(#{marker})"'
        self.lines.append('<polyline points="'+' '.join(f'{x},{y}' for x,y in points)+f'" {attrs}{end_marker}/>')
        # Place the label on the central segment rather than over a node.
        j=(len(points)-1)//2
        ax,ay=points[j]; bx,by=points[j+1]
        lx,ly=(ax+bx)/2,(ay+by)/2
        if abs(ax-bx)<2: lx += 29
        else: ly -= 10
        if label:
            label_width=len(label)*10+12
            self.lines.append(f'<rect x="{lx-label_width/2}" y="{ly-17}" width="{label_width}" height="23" fill="#ffffff"/>')
            self.lines.append(f'<text x="{lx}" y="{ly}" text-anchor="middle" fill="#334155" font-size="17">{escape(label)}</text>')

    def save(self, filename):
        defs='<defs><marker id="arrow" markerWidth="9" markerHeight="9" refX="8" refY="4" orient="auto"><path d="M 0 0 L 8 4 L 0 8" fill="none" stroke="#475569"/></marker><marker id="bar" markerWidth="8" markerHeight="10" refX="7" refY="5" orient="auto"><path d="M 7 0 L 7 10" stroke="#475569" fill="none"/></marker><marker id="circle" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto"><circle cx="5" cy="5" r="3" fill="white" stroke="#475569"/></marker></defs>'
        defs=defs.replace('</defs>','<marker id="triangle" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto"><path d="M 0 0 L 8 4 L 0 8 Z" fill="white" stroke="#475569"/></marker></defs>')
        # Boundaries were drawn first; lines under nodes and labels remain clear.
        boundary_parts=[p for p in self.parts if 'stroke-dasharray' in p]
        body=[p for p in self.parts if 'stroke-dasharray' not in p]
        text=f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.width}" height="{self.height}" viewBox="0 0 {self.width} {self.height}" role="img" aria-label="{escape(self.name)}"><title>{escape(self.name)}</title><rect width="100%" height="100%" fill="white"/>{defs}<g font-family="{FONT}">'+''.join(boundary_parts+self.lines+body)+'</g></svg>'
        (EXPORTS / filename).write_text(text,encoding='utf-8')


def title(page, heading, scope):
    page.note('heading',50,25,2000,45,heading,32)
    page.note('subtitle',50,79,2000,35,'3 November 2026 | '+scope,19)


def draw_actor(item):
    page=Page(item['title'])
    title(page,item['title'],ACTORS[item['actor']]['scope'])
    bx,by,bw,bh=230,155,1810,1080
    page.boundary('boundary',bx,by,bw,bh)
    page.node('actor','actor',ACTORS[item['actor']]['name'],45,180,160,160)
    parent='boundary'
    positions={}
    def put(key,x,y,w=335,h=100):
        el=ELEMENTS[key]
        page.node(key,el['type'],key+'\n'+el['label'],x,y,w,h,parent,(bx,by))
        positions[key]=(x,y,w,h)
    goal_count=len(item['goals'])
    for index,key in enumerate(item['goals']):
        x=bx+((index+.5)*bw/goal_count)-210
        put(key,x,220,420,100)
    task_count=len(item['tasks'])
    for index,key in enumerate(item['tasks']):
        x=bx+((index+.5)*bw/task_count)-170
        put(key,x,440,340,118)
    # Place each resource under its first consuming task where possible.
    resource_positions={}
    for index,key in enumerate(item['resources']):
        consumers=[edge['target'] for edge in LINKS if edge['source']==key and edge['type']=='neededBy' and edge['target'] in item['tasks']]
        preferred=item['tasks'].index(consumers[0]) if consumers else index
        preferred=min(preferred,task_count-1)
        slot=preferred
        while slot in resource_positions:
            slot=(slot+1)%max(task_count,len(item['resources']))
        resource_positions[slot]=key
    for slot,key in resource_positions.items():
        x=bx+((slot+.5)*bw/max(task_count,len(item['resources'])))-170
        put(key,x,665,340,118)
    for index,key in enumerate(item['qualities']):
        x=bx+((index+.5)*bw/len(item['qualities']))-200
        put(key,x,965,400,100)
    # Local links only: no chronological arrows or cross-actor contribution links.
    needed_count=0
    contribution_count=0
    for edge in LINKS:
        if edge['source'] not in positions or edge['target'] not in positions:
            continue
        sx,sy,sw,sh=positions[edge['source']]
        tx,ty,tw,th=positions[edge['target']]
        if edge['type']=='refinement':
            points=[(sx+sw/2,sy),(sx+sw/2,365),(tx+tw/2,365),(tx+tw/2,ty+th)]
        elif edge['type']=='neededBy':
            route_y=580+needed_count*14
            needed_count+=1
            points=[(sx+sw/2,sy),(sx+sw/2,route_y),(tx+tw/2,route_y),(tx+tw/2,ty+th)]
        elif edge['type']=='qualification':
            points=[(sx+sw/2,sy),(sx+sw/2,820),(tx+tw,820),(tx+tw,ty+th/2)]
        else:
            # An individual side channel for each task avoids crossing resource boxes.
            channel=sx+sw+25
            route_y=840+contribution_count*28
            contribution_count+=1
            points=[(sx+sw,sy+sh/2),(channel,sy+sh/2),(channel,route_y),(tx+tw/2,route_y),(tx+tw/2,ty)]
        page.edge(edge['source'],edge['target'],edge['type'],edge['value'],points)
    page.note('delegate-label',bx+30,1080,bw-60,35,'Delegated goals / interface resources: endpoint IDs are resolved in the dependency views.',18)
    extra_count=len(item['delegated'])
    for index,key in enumerate(item['delegated']):
        width=min(400,(bw-80)/max(extra_count,1)-20)
        x=bx+40+index*((bw-80)/max(extra_count,1))
        put(key,x,1130,width,90)
    page.note('legend',50,1270,2000,65,'Oval = goal | Hexagon = task | Rectangle = resource | Cloud = quality (softgoal). Child -> parent AND = all; OR = an alternative. Resource -> task = needed-by. Help / Hurt = quality contribution; qualifies = desired resource quality.',18)
    page.note('note',50,1360,2000,70,'Read with README.md and the dependency views. Dependencies point from the actor relying on something to its provider. Repeated endpoint IDs refer to the same element. Conditional tasks describe responsibilities, not a mandatory sequence of process steps.',18)
    page.save(item['id']+'.svg')
