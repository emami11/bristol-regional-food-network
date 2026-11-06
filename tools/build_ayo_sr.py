"""Rebuild Ayo's SR models from the reviewed November repository scope.

Python standard library only. Replaces generated files inside models/istar/ayo/.
"""
from pathlib import Path
import copy
import json
import xml.etree.ElementTree as ET
import istar_support as r

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / 'models' / 'istar' / 'ayo'
BASELINE = '9aeeddc355d42e18477f753973677f85c8dadbbe'


def nodes(owner, rows):
    for suffix, kind, label in rows:
        r.element(owner, suffix, kind, label, 'ACTOR-ANALYSIS')


def refine(parent, children, operator='AND'):
    for child in children:
        r.link(child, parent, 'refinement', operator)


def qualify(quality, subject):
    r.link(quality, subject, 'qualification')


def core():
    r.actor('P', 'Registered Producer', 'Use Case 1: listing and inventory')
    r.actor('K', 'Customer', 'Use Case 1: information and availability')
    r.actor('A', 'Marketplace Admin', 'Compliance, support and proposed review')
    r.actor('M', 'Marketplace Platform', 'Use Case 1 automated responsibilities')
    r.actor('V', 'Certification Verification Service', 'Simulated certification checking')
    nodes('P', [
        ('G1','goal','Valid product information maintained'),
        ('G2','goal','Inventory and seasonal records current'),
        ('G3','goal','Valid products published'),
        ('T1','task','Submit complete product information'),
        ('T2','task','Review feedback and correct issues'),
        ('T3','task','Update product quantities'),
        ('T4','task','Update seasonal availability'),
        ('R1','resource','Product details and applicable evidence'),
        ('R2','resource','Validation and correction feedback'),
        ('R3','resource','Current quantity and season records'),
        ('R4','resource','Listing standards and guidance'),
        ('Q1','quality','Simple and efficient listing'),
        ('Q2','quality','Minimal administrative effort'),
        ('Q3','quality','Understandable validation feedback'),
    ])
    refine('P-G1',['P-T1','P-T2'])
    refine('P-G2',['P-T3','P-T4'])
    r.needed('P-R1','P-T1')
    r.needed('P-R2','P-T2')
    r.needed('P-R3','P-T3','P-T4')
    r.needed('P-R4','P-T1')
    r.contribution('P-T2','P-Q1','Hurt')
    r.contribution('P-T1','P-Q2','Hurt')
    r.contribution('P-T2','P-Q2','Hurt')
    qualify('P-Q3','P-R2')
    r.view('01-registered-producer','P','Registered Producer: listing and stock',
           ['P-G1','P-G2'],['P-T1','P-T2','P-T3','P-T4'],
           ['P-R1','P-R2','P-R3','P-R4'],['P-Q1','P-Q2','P-Q3'],['P-G3'])

    buyer('K','02-customer','Customer','Suitable available products identified',
          'Compare products with purchasing needs','Purchasing and dietary requirements')

    nodes('A', [
        ('G1','goal','Marketplace listing standards maintained'),
        ('G2','goal','Unresolved verification cases reviewed'),
        ('T1','task','Monitor listing compliance'),
        ('T2','task','Maintain standards and guide producers'),
        ('T3','task','Inspect unresolved verification evidence'),
        ('T4','task','Record justified review decision'),
        ('R1','resource','Published listing records'),
        ('R2','resource','Listing standards and guidance'),
        ('R3','resource','Exception case and supporting evidence'),
        ('R4','resource','Recorded review decision'),
        ('Q1','quality','Effective compliance management'),
        ('Q2','quality','Reduced administrative workload'),
        ('Q3','quality','Customer and producer confidence'),
    ])
    refine('A-G1',['A-T1','A-T2'])
    refine('A-G2',['A-T3','A-T4'])
    for resource,task in [('A-R1','A-T1'),('A-R2','A-T2'),('A-R3','A-T3'),('A-R4','A-T4')]:
        r.needed(resource,task)
    r.contribution('A-T1','A-Q1')
    r.contribution('A-T3','A-Q2','Hurt')
    r.contribution('A-T4','A-Q3')
    r.view('03-admin','A','Marketplace Admin: compliance and support',
           ['A-G1','A-G2'],['A-T1','A-T2','A-T3','A-T4'],
           ['A-R1','A-R2','A-R3','A-R4'],['A-Q1','A-Q2','A-Q3'])

    nodes('M', [
        ('G1','goal','Valid product listings published'),
        ('G2','goal','Unavailable products excluded from new orders'),
        ('G3','goal','Unavailable verification handled'),
        ('G4','goal','Unresolved verification case reviewed'),
        ('G5','goal','Corrected product information obtained'),
        ('T1','task','Validate mandatory product information'),
        ('T2','task','Check applicable organic certification'),
        ('T3','task','Publish valid products and provide feedback'),
        ('T4','task','Obtain result through verification retry'),
        ('T5','task','Resolve case through authorised review'),
        ('T6','task','Apply quantity and season updates'),
        ('T7','task','Evaluate stock and seasonal rules'),
        ('T8','task','Set and expose current availability'),
        ('R1','resource','Submitted product information'),
        ('R2','resource','Quantity and seasonal update records'),
        ('R3','resource','Certification check outcome'),
        ('R4','resource','Certification request and evidence'),
        ('R5','resource','Validation and correction feedback'),
        ('R6','resource','Unresolved verification case record'),
        ('R7','resource','Published product and availability data'),
        ('R8','resource','Stock and seasonal decision rules'),
        ('R9','resource','Authorised review decision'),
        ('Q1','quality','Reliable automated processing'),
        ('Q2','quality','Efficient product management'),
        ('Q3','quality','Minimal processing delays'),
    ])
    refine('M-G1',['M-T1','M-T2','M-T3'])
    refine('M-G2',['M-T6','M-T7','M-T8'])
    # Alternative strategies for the SAME outage; either may be sufficient
    # under the agreed policy. BPMN will define the actual retry/escalation order.
    refine('M-G3',['M-T4','M-T5'],'OR')
    for resource,task in [('M-R1','M-T1'),('M-R3','M-T2'),('M-R4','M-T2'),
                          ('M-R6','M-T4'),('M-R9','M-T5'),('M-R2','M-T6'),
                          ('M-R8','M-T7'),('M-R7','M-T8')]:
        r.needed(resource,task)
    for task,quality,value in [
        ('M-T1','M-Q1','Help'),('M-T2','M-Q1','Help'),('M-T3','M-Q2','Help'),
        ('M-T4','M-Q1','Help'),('M-T4','M-Q3','Hurt'),
        ('M-T5','M-Q1','Help'),('M-T5','M-Q3','Hurt'),
        ('M-T6','M-Q2','Help'),('M-T7','M-Q1','Help'),('M-T8','M-Q3','Help')]:
        r.contribution(task,quality,value)
    r.view('04-platform-listing','M','Platform: product listing and validation',
           ['M-G1'],['M-T1','M-T2','M-T3'],['M-R1','M-R3','M-R4'],
           ['M-Q1','M-Q2'],['M-G5','M-R5'])
    r.view('05-platform-exceptions','M','Platform: certification outage alternatives',
           ['M-G3'],['M-T4','M-T5'],['M-R6','M-R9'],
           ['M-Q1','M-Q3'],['M-G4'])
    r.view('06-platform-inventory','M','Platform: inventory and seasonal availability',
           ['M-G2'],['M-T6','M-T7','M-T8'],['M-R2','M-R8','M-R7'],
           ['M-Q1','M-Q2','M-Q3'])

    nodes('V', [
        ('G1','goal','Accurate verification outcomes supplied'),
        ('T1','task','Receive and check request completeness'),
        ('T2','task','Check organic certification evidence'),
        ('T3','task','Return verified, rejected or error result'),
        ('R1','resource','Certification request and evidence'),
        ('R2','resource','Certification verification outcome'),
        ('R3','resource','Simulated certification reference data'),
        ('Q1','quality','Timely verification responses'),
        ('Q2','quality','Reliable service availability'),
        ('Q3','quality','Accurate verification processing'),
    ])
    refine('V-G1',['V-T1','V-T2','V-T3'])
    r.needed('V-R1','V-T1')
    r.needed('V-R3','V-T2')
    r.needed('V-R2','V-T3')
    r.contribution('V-T3','V-Q1')
    r.contribution('V-T1','V-Q2')
    r.contribution('V-T2','V-Q3')
    r.view('07-certification-service','V','Certification service: evidence and outcomes',
           ['V-G1'],['V-T1','V-T2','V-T3'],['V-R1','V-R3','V-R2'],
           ['V-Q1','V-Q2','V-Q3'])

    for key,start,end,kind,label in [
        ('D01','P-G3','M-G1','goal','Valid products published'),
        ('D02','P-R2','M-R5','resource','Validation and correction feedback'),
        ('D03','M-R1','P-R1','resource','Accurate submitted product information'),
        ('D04','M-R2','P-R3','resource','Stock and seasonal update records'),
        ('D05','M-R3','V-R2','resource','Certification verification outcome'),
        ('D06','V-R1','M-R4','resource','Certification request and evidence'),
        ('D07','M-G4','A-G2','goal','Unresolved verification case reviewed'),
        ('D08','A-R3','M-R6','resource','Exception case and supporting evidence'),
        ('D09','K-R1','M-R7','resource','Published product and availability data'),
        ('D10','A-R1','M-R7','resource','Listing records for compliance review'),
        ('D11','M-G5','P-G1','goal','Corrected product information supplied'),
        ('D12','M-R9','A-R4','resource','Authorised review decision'),
        ('D13','P-R4','A-R2','resource','Listing standards and guidance'),
    ]:
        r.dependency(key,start,end,kind,label,'UC1' if key not in {'D07','D08','D12'} else 'PROPOSED')


def buyer(key,view_id,name,goal,compare_task,requirements):
    nodes(key,[
        ('G1','goal',goal),
        ('T1','task','Browse product and availability information'),
        ('T2','task',compare_task),
        ('T3','task','Review allergens and certification details'),
        ('R1','resource','Published product and availability data'),
        ('R2','resource',requirements),
        ('R3','resource','Published safety and certification details'),
        ('Q1','quality','Trustworthy product listings'),
        ('Q2','quality','Confidence in organic claims'),
        ('Q3','quality','Reliable marketplace experience'),
    ])
    refine(key+'-G1',[key+'-T1',key+'-T2',key+'-T3'])
    r.needed(key+'-R1',key+'-T1')
    r.needed(key+'-R2',key+'-T2')
    r.needed(key+'-R3',key+'-T3')
    r.contribution(key+'-T1',key+'-Q1')
    r.contribution(key+'-T2',key+'-Q3')
    r.contribution(key+'-T3',key+'-Q2')
    r.view(view_id,key,name+': information and purchasing needs',
           [key+'-G1'],[key+'-T1',key+'-T2',key+'-T3'],
           [key+'-R1',key+'-R2',key+'-R3'],[key+'-Q1',key+'-Q2',key+'-Q3'])


def extended():
    # Replace the generic Customer view with the three requested buyer roles.
    del r.ACTORS['K']
    r.ELEMENTS={key:node for key,node in r.ELEMENTS.items() if node['actor']!='K'}
    r.LINKS=[edge for edge in r.LINKS if not edge['source'].startswith('K-')]
    r.DEPS=[dep for dep in r.DEPS if not dep['source'].startswith('K-')]
    r.VIEWS=[view for view in r.VIEWS if view['actor']!='K']
    for key,name,goal,comparison,requirements in [
        ('I','Individual Customer','Suitable household products identified',
         'Compare products with household needs','Household needs and spending plan'),
        ('B','Restaurant / Cafe Buyer','Suitable business ingredients identified',
         'Compare ingredients with menu requirements','Menu and purchasing requirements'),
        ('C','Community Organisation Buyer','Suitable food for the group identified',
         'Compare products with group dietary needs','Group dietary and purchasing requirements'),
    ]:
        r.actor(key,name,'Buyer segment; UC1 information and payment context')
        buyer(key,'08-'+key.lower()+'-buyer',name,goal,comparison,requirements)
        for node in r.ELEMENTS.values():
            if node['actor']==key: node['basis']='STAKEHOLDER-ANALYSIS / CASE'
        r.element(key,'G2','goal','Purchase payment outcome obtained','CONTEXT')
        r.VIEWS[-1]['delegated'].append(key+'-G2')
        r.dependency('D-BUY-'+key,key+'-R1','M-R7','resource',name+' product information','UC1')
        r.dependency('D-SAFE-'+key,key+'-R3','M-R7','resource',name+' safety and certification data','UC1')

    r.actor('S','Payment Service','Wider enterprise: simulated payments and settlements')
    prior=set(r.ELEMENTS)
    nodes('M',[
        ('G6','goal','Customer payment outcome communicated'),
        ('G7','goal','Producer settlement allocations recorded'),
        ('T9','task','Submit sandbox payment request'),
        ('T10','task','Record and communicate payment result'),
        ('T11','task','Calculate 5% commission and producer shares'),
        ('T12','task','Prepare weekly settlement instructions'),
        ('R10','resource','Valid sandbox payment request'),
        ('R11','resource','Gateway payment outcome'),
        ('R12','resource','Paid order lines and producer totals'),
        ('R13','resource','Calculated producer allocation records'),
        ('R14','resource','Producer transfer instructions'),
        ('R15','resource','Settlement transfer outcome'),
        ('R16','resource','Producer settlement statement'),
        ('Q4','quality','Reliable payment feedback'),
        ('Q5','quality','Transparent producer accounting'),
    ])
    refine('M-G6',['M-T9','M-T10'])
    refine('M-G7',['M-T11','M-T12'])
    for resource,task in [('M-R10','M-T9'),('M-R11','M-T10'),('M-R12','M-T11'),('M-R13','M-T12')]:
        r.needed(resource,task)
    r.contribution('M-T10','M-Q4')
    r.contribution('M-T11','M-Q5')
    r.contribution('M-T12','M-Q5')
    r.view('09-platform-payments','M','Platform: wider payment and settlement context',
           ['M-G6','M-G7'],['M-T9','M-T10','M-T11','M-T12'],
           ['M-R10','M-R11','M-R12','M-R13'],['M-Q4','M-Q5'],['M-R14','M-R15','M-R16'])
    nodes('S',[
        ('G1','goal','Payment result returned'),
        ('G2','goal','Instructed transfers accounted for'),
        ('T1','task','Process sandbox payment request'),
        ('T2','task','Return success, decline or error outcome'),
        ('T3','task','Execute instructed test transfers'),
        ('T4','task','Return transfer status and reference'),
        ('R1','resource','Valid sandbox payment request'),
        ('R2','resource','Gateway payment outcome'),
        ('R3','resource','Producer transfer instructions'),
        ('R4','resource','Settlement transfer outcome'),
        ('Q1','quality','Reliable transaction outcomes'),
        ('Q2','quality','Auditable transfers'),
    ])
    refine('S-G1',['S-T1','S-T2'])
    refine('S-G2',['S-T3','S-T4'])
    for resource,task in [('S-R1','S-T1'),('S-R2','S-T2'),('S-R3','S-T3'),('S-R4','S-T4')]:
        r.needed(resource,task)
    r.contribution('S-T2','S-Q1')
    r.contribution('S-T4','S-Q2')
    r.view('10-payment-service','S','Payment Service: sandbox requests and outcomes',
           ['S-G1','S-G2'],['S-T1','S-T2','S-T3','S-T4'],
           ['S-R1','S-R2','S-R3','S-R4'],['S-Q1','S-Q2'])
    r.element('P','R5','resource','Producer settlement statement','CONTEXT')
    for key in set(r.ELEMENTS)-prior:
        r.ELEMENTS[key]['basis']='CONTEXT'
    r.VIEWS[0]['delegated'].append('P-R5')
    for key in ['I','B','C']:
        r.dependency('D-PAY-'+key,key+'-G2','M-G6','goal',r.ACTORS[key]['name']+' payment outcome','CONTEXT')
    for key,start,end,label in [
        ('D-PAY-REQUEST','S-R1','M-R10','Sandbox payment request'),
        ('D-PAY-RESULT','M-R11','S-R2','Gateway payment outcome'),
        ('D-TRANSFER-IN','S-R3','M-R14','Producer transfer instructions'),
        ('D-TRANSFER-OUT','M-R15','S-R4','Settlement transfer outcome'),
        ('D-STATEMENT','P-R5','M-R16','Producer settlement statement'),
    ]:
        r.dependency(key,start,end,'resource',label,'CONTEXT')
    for key in ['K-R3']:
        assert key not in r.ELEMENTS


def dependencies():
    # Twelve per page keeps the projection readable at ordinary print sizes.
    for index in range(0,len(r.DEPS),12):
        group=r.DEPS[index:index+12]
        number=index//12+1
        height=340+len(group)*126
        page=r.Page('Dependencies '+str(number),2100,height)
        r.title(page,'Cross-actor dependencies '+str(number),'Exact SR endpoint IDs; read with actor views')
        page.note('direction',50,125,2000,65,'Depender (relies on something) -> typed dependum -> dependee (provides it). Each row is a distinct dependency. IDs refer to the actor-internal elements in the SR views.',18)
        page.note('headers',50,205,2000,35,'DEPENDENCY',18)
        page.note('from-head',315,205,500,35,'DEPENDER / INTERNAL ELEMENT',18)
        page.note('dm-head',870,205,430,35,'DEPENDUM',18)
        page.note('to-head',1450,205,500,35,'DEPENDEE / INTERNAL ELEMENT',18)
        for row,dep in enumerate(group):
            y=260+row*126
            start,end=r.ELEMENTS[dep['source']],r.ELEMENTS[dep['target']]
            page.note(dep['id']+'-id',50,y,240,100,dep['id']+' | '+dep['scope'],17)
            page.note(dep['id']+'-left-name',315,y+15,280,85,r.ACTORS[start['actor']]['name'],18)
            page.node(dep['id']+'-from','actor',start['actor']+'\n'+start['id'],615,y,106,106)
            page.node(dep['id'],dep['type'],dep['label'],870,y+5,430,96)
            page.node(dep['id']+'-to','actor',end['actor']+'\n'+end['id'],1450,y,106,106)
            page.note(dep['id']+'-right-name',1575,y+15,425,85,r.ACTORS[end['actor']]['name'],18)
            page.edge(dep['id']+'-from',dep['id'],'dependency',points=[(721,y+53),(870,y+53)])
            page.edge(dep['id'],dep['id']+'-to','dependency',points=[(1300,y+53),(1450,y+53)])
        page.note('footer',50,height-55,2000,45,'UC1 = core use case; PROPOSED = review policy assumption; CONTEXT = wider enterprise. Dependencies show responsibility, not message timing.',18)
        page.save('dependencies-'+str(number)+'.svg')


def save(variant):
    # Customer safety information is separate from the catalogue resource.
    if variant=='core':
        r.dependency('D14','K-R3','M-R7','resource','Published safety and certification data','UC1')
    r.validate()
    r.OUT=BASE/variant
    r.EXPORTS=r.OUT/'exports'
    r.EXPORTS.mkdir(parents=True,exist_ok=True)
    r.mxfile=ET.Element('mxfile',host='app.diagrams.net',version='24.7.17')
    for item in r.VIEWS:
        r.draw_actor(item)
    dependencies()
    ET.indent(r.mxfile)
    ET.ElementTree(r.mxfile).write(r.OUT/'BRFN-Ayo-SR.drawio',encoding='utf-8',xml_declaration=True)
    model=dict(notation='iStar 2.0',variant=variant,sourceCommit=BASELINE,
               actors=r.ACTORS,elements=r.ELEMENTS,links=r.LINKS,dependencies=r.DEPS,views=r.VIEWS)
    (r.OUT/'sr-model.json').write_text(json.dumps(model,indent=2)+'\n',encoding='utf-8')
    lines=['# SR element and relationship register','',
           'Source: repository main `'+BASELINE+'`, reviewed 3 November 2026.','',
           '## Elements','', '| ID | Actor | Type | Label |','|---|---|---|---|']
    for node in r.ELEMENTS.values():
        lines.append(f"| {node['id']} | {r.ACTORS[node['actor']]['name']} | {node['type']} | {node['label']} |")
    lines+=['','## Internal relationships','','| Source | Relationship | Target |','|---|---|---|']
    for edge in r.LINKS:
        lines.append(f"| {edge['source']} | {edge['value'] or edge['type']} | {edge['target']} |")
    lines+=['','## Dependencies','','| ID | Depender element | Dependum | Dependee element | Scope |','|---|---|---|---|---|']
    for dep in r.DEPS:
        lines.append(f"| {dep['id']} | {dep['source']} | {dep['type']}: {dep['label']} | {dep['target']} | {dep['scope']} |")
    (r.OUT/'SR-REGISTER.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')
    print(variant,':',len(r.ACTORS),'actors,',len(r.ELEMENTS),'elements,',len(r.LINKS),'links,',len(r.DEPS),'dependencies')


def main():
    core()
    save('core')
    # Saving the core adds its last dependency. Remove it with the generic buyer.
    extended()
    save('expanded')


if __name__=='__main__':
    main()
