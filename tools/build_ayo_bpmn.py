"""Create Ayo's whole-enterprise strategic BPMN, with editable diagram geometry.

This is a conceptual model: isExecutable=false. It does not deploy processes.
"""
from pathlib import Path
import json
import xml.etree.ElementTree as E

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'bpmn'/'personal'/'ayo'
NS={
 'b':'http://www.omg.org/spec/BPMN/20100524/MODEL',
 'bpmndi':'http://www.omg.org/spec/BPMN/20100524/DI',
 'dc':'http://www.omg.org/spec/DD/20100524/DC',
 'di':'http://www.omg.org/spec/DD/20100524/DI',
 'modeler':'http://camunda.org/schema/modeler/1.0',
 'bioc':'http://bpmn.io/schema/bpmn/biocolor/1.0',
 'xsi':'http://www.w3.org/2001/XMLSchema-instance',
}
for prefix,uri in NS.items(): E.register_namespace('bpmn' if prefix=='b' else prefix,uri)
def tag(prefix,name): return '{'+NS[prefix]+'}'+name
def sub(parent,kind,**attrs): return E.SubElement(parent,tag('b',kind),{k:str(v) for k,v in attrs.items()})

defs=E.Element(tag('b','definitions'),id='Ayo_Definitions',targetNamespace='https://brfn.example/ayo/strategic',
               exporter='BRFN personal strategic model',exporterVersion='2026-11-03')
defs.set(tag('modeler','executionPlatform'),'Camunda Cloud')
defs.set(tag('modeler','executionPlatformVersion'),'8.10.0')
collab=sub(defs,'collaboration',id='Ayo_Collaboration',name='BRFN whole-enterprise strategic collaboration')
process=sub(defs,'process',id='Ayo_BRfnProcess',name='BRFN strategic BPMN - Ayo',isExecutable='false')
doc=sub(process,'documentation')
doc.text=('Personal strategic modelling draft based on repository 9aeeddc, 3 November 2026. '
          'Represents three organisational areas and seven major business processes. '
          'Collapsed internals are high-level responsibilities, not final operational automation. '
          'Daily stock checks and weekly settlements are business policies described in annotations; '
          'the detailed operational processes must implement their independent triggers. '
          'All financial interactions are sandbox or simulated.')
lane_set=sub(process,'laneSet',id='Ayo_LaneSet')
lanes={
 'product':sub(lane_set,'lane',id='Ayo_Lane_Product',name='Product and Inventory Management'),
 'operations':sub(lane_set,'lane',id='Ayo_Lane_Operations',name='Marketplace Operations'),
 'quality':sub(lane_set,'lane',id='Ayo_Lane_Quality',name='Quality Assurance and Community Services'),
}
diagram=E.SubElement(defs,tag('bpmndi','BPMNDiagram'),id='Ayo_OverviewDiagram',name='BRFN enterprise overview')
plane=E.SubElement(diagram,tag('bpmndi','BPMNPlane'),id='Ayo_OverviewPlane',bpmnElement=collab.get('id'))
NODES={}; EDGES={}; SUBPROCESSES={}


def shape(key,element,x,y,w,h,*,label=None,label_box=None,horizontal=None,expanded=None,target_plane=plane):
    attrs={'id':key+'_di','bpmnElement':element.get('id')}
    if horizontal is not None: attrs['isHorizontal']=str(horizontal).lower()
    if expanded is not None: attrs['isExpanded']=str(expanded).lower()
    s=E.SubElement(target_plane,tag('bpmndi','BPMNShape'),attrs)
    if key in {'Ayo_SP_Listings','Ayo_SP_Inventory'}:
        s.set(tag('bioc','fill'),'#eaf4ff')
        s.set(tag('bioc','stroke'),'#255f8b')
    E.SubElement(s,tag('dc','Bounds'),x=str(x),y=str(y),width=str(w),height=str(h))
    if label_box:
        lb=E.SubElement(s,tag('bpmndi','BPMNLabel'))
        E.SubElement(lb,tag('dc','Bounds'),**{k:str(v) for k,v in zip(['x','y','width','height'],label_box)})
    NODES[key]=dict(id=key,name=element.get('name') or label or '',type=element.tag.split('}')[-1],bounds=[x,y,w,h])
    return s


def edge_di(element,points,label_box=None,target_plane=plane):
    e=E.SubElement(target_plane,tag('bpmndi','BPMNEdge'),id=element.get('id')+'_di',bpmnElement=element.get('id'))
    for x,y in points: E.SubElement(e,tag('di','waypoint'),x=str(x),y=str(y))
    if label_box:
        label=E.SubElement(e,tag('bpmndi','BPMNLabel'))
        E.SubElement(label,tag('dc','Bounds'),**{k:str(v) for k,v in zip(['x','y','width','height'],label_box)})
    EDGES[element.get('id')]=dict(type=element.tag.split('}')[-1],name=element.get('name',''),points=points)


def participant(key,name,box,own=False,horizontal=True):
    attrs=dict(id=key,name=name)
    if own: attrs['processRef']=process.get('id')
    e=sub(collab,'participant',**attrs)
    shape(key,e,*box,horizontal=horizontal,expanded=own)
    return e


def message(key,name):
    return sub(defs,'message',id=key,name=name)


def start(key,name,box,lane,message_id=None):
    e=sub(process,'startEvent',id=key,name=name)
    if message_id: sub(e,'messageEventDefinition',id=key+'_message',messageRef=message_id)
    sub(lanes[lane],'flowNodeRef').text=key
    x,y,w,h=box
    shape(key,e,*box,label_box=[x-77,y+h+8,190,43])
    return e


def end(key,name,box,lane,label_box=None):
    e=sub(process,'endEvent',id=key,name=name)
    sub(lanes[lane],'flowNodeRef').text=key
    x,y,w,h=box
    shape(key,e,*box,label_box=label_box or [x-77,y+h+8,190,43])
    return e


def activity(key,name,box,lane,description,steps):
    e=sub(process,'subProcess',id=key,name=name)
    sub(e,'documentation').text=description
    sub(lanes[lane],'flowNodeRef').text=key
    shape(key,e,*box,expanded=False)
    SUBPROCESSES[key]=dict(element=e,name=name,steps=steps)
    return e


def sequence(key,source,target,points,parent=process,target_plane=plane):
    e=sub(parent,'sequenceFlow',id=key,sourceRef=source,targetRef=target)
    edge_di(e,points,target_plane=target_plane)
    return e


def communication(key,name,source,target,points,label_box,message_id=None):
    attrs=dict(id=key,name=name,sourceRef=source,targetRef=target)
    # The message start event references its message definition. Keeping the
    # collaboration arrow label descriptive avoids a second envelope/name
    # label on the same arrow in the strategic view.
    e=sub(collab,'messageFlow',**attrs)
    edge_di(e,points,label_box)


def annotation(key,text,box,target,points):
    e=sub(process,'textAnnotation',id=key)
    sub(e,'text').text=text
    shape(key,e,*box,label=text)
    a=sub(process,'association',id=key+'_association',sourceRef=target,targetRef=key,associationDirection='None')
    edge_di(a,points)


IO={}
def port(activity_id,kind,name):
    a=SUBPROCESSES[activity_id]['element']
    if activity_id not in IO:
        io=sub(a,'ioSpecification',id=activity_id+'_io')
        inputs=sub(io,'inputSet',id=activity_id+'_inputs')
        outputs=sub(io,'outputSet',id=activity_id+'_outputs')
        IO[activity_id]=(io,inputs,outputs)
    io,inputs,outputs=IO[activity_id]
    suffix=str(sum(1 for c in io if c.tag.endswith('}dataInput') or c.tag.endswith('}dataOutput'))+1)
    key=activity_id+'_'+kind+'_'+suffix
    # BPMN IO specification orders declarations before input/output sets.
    node=E.Element(tag('b','dataInput' if kind=='in' else 'dataOutput'),id=key,name=name)
    io.insert(list(io).index(inputs),node)
    sub(inputs if kind=='in' else outputs,'dataInputRefs' if kind=='in' else 'dataOutputRefs').text=key
    return a,key


def data_link(key,activity_id,data_id,kind,points):
    a,port_id=port(activity_id,kind,NODES[data_id]['name'])
    assoc=sub(a,'dataInputAssociation' if kind=='in' else 'dataOutputAssociation',id=key)
    sub(assoc,'sourceRef').text=data_id if kind=='in' else port_id
    sub(assoc,'targetRef').text=port_id if kind=='in' else data_id
    edge_di(assoc,points)


def internals():
    for key,item in SUBPROCESSES.items():
        a=item['element']
        d=E.SubElement(defs,tag('bpmndi','BPMNDiagram'),id=key+'_diagram',name=item['name'])
        p=E.SubElement(d,tag('bpmndi','BPMNPlane'),id=key+'_plane',bpmnElement=key)
        s=sub(a,'startEvent',id=key+'_start',name='Responsibility begins')
        shape(s.get('id'),s,80,172,36,36,label_box=[35,215,130,40],target_plane=p)
        previous=s.get('id'); px=116
        for i,name in enumerate(item['steps']):
            x=190+i*300
            task=sub(a,'task',id=key+'_step_'+str(i+1),name=name)
            shape(task.get('id'),task,x,140,230,100,target_plane=p)
            sequence(key+'_inner_'+str(i+1),previous,task.get('id'),[(px,190),(x,190)],a,p)
            previous=task.get('id'); px=x+230
        x=190+len(item['steps'])*300
        e=sub(a,'endEvent',id=key+'_end',name='Responsibility outcome recorded')
        shape(e.get('id'),e,x,172,36,36,label_box=[x-50,215,140,40],target_plane=p)
        sequence(key+'_inner_end',previous,e.get('id'),[(px,190),(x,190)],a,p)


participant('Ayo_Pool_BRfn','Bristol Regional Food Network (BRFN)',[430,230,1550,1210],True)
participant('Ayo_Pool_Producer','Registered Producers',[70,230,170,1210],horizontal=False)
participant('Ayo_Pool_Customers','Customers (individuals, restaurants/cafes and community organisations)',[2110,640,240,800],horizontal=False)
participant('Ayo_Pool_Certification','Certification Verification Service',[1100,70,500,70])
participant('Ayo_Pool_Payment','Payment Service Provider (sandbox)',[2030,330,400,70])
for key,box in [('product',[460,230,1520,380]),('operations',[460,610,1520,350]),('quality',[460,960,1520,480])]:
    shape(lanes[key].get('id'),lanes[key],*box,horizontal=True)

for key,name in [('Ayo_Msg_Listing','product-listing-submitted'),('Ayo_Msg_Stock','stock-season-update-submitted'),
                 ('Ayo_Msg_Purchase','customer-purchase-requested'),('Ayo_Msg_Quality','food-quality-concern-reported'),
                 ('Ayo_Msg_Community','community-content-submitted')]: message(key,name)

start('Ayo_Start_Listing','Producer listing request received',[560,342,36,36],'product','Ayo_Msg_Listing')
start('Ayo_Start_Inventory','Producer stock / season update received',[1300,492,36,36],'product','Ayo_Msg_Stock')
start('Ayo_Start_Purchase','Customer purchase request received',[560,772,36,36],'operations','Ayo_Msg_Purchase')
start('Ayo_Start_Quality','Food quality concern received',[560,1072,36,36],'quality','Ayo_Msg_Quality')
start('Ayo_Start_Community','Community content submitted',[560,1292,36,36],'quality','Ayo_Msg_Community')

activity('Ayo_SP_Listings','Manage Product Listings',[740,300,280,120],'product',
         'Producer submission, mandatory validation, applicable simulated certification checking, correction feedback and publication. Unresolved verification can be held for authorised admin review; never treat an outage as proof of certification.',
         ['Receive and validate product information','Resolve corrections and certification checks as applicable','Publish approved listing or provide feedback'])
activity('Ayo_SP_Inventory','Manage Inventory and Seasonal Availability',[1450,450,280,120],'product',
         'Accept producer quantity/season updates and internal listing/order stock changes. The operational process also has a daily season-check trigger. Zero stock and out-of-season products are unavailable; replenishment restores availability only within the season and when listing eligibility remains valid.',
         ['Apply quantity and seasonal changes','Evaluate stock, season and listing eligibility','Set and communicate current availability'])
activity('Ayo_SP_Purchasing','Facilitate Customer Purchasing',[740,730,270,120],'operations',
         'Support the three buyer segments browsing and selecting products. Check availability and explain producer responsibilities and delivery/collection arrangements before confirming the purchase request.',
         ['Browse products and select basket','Check availability and delivery or collection arrangements','Record purchase request for coordination'])
activity('Ayo_SP_Orders','Coordinate Multi-Vendor Orders',[1110,730,270,120],'operations',
         'Create marketplace order records and producer-specific elements. Allocate responsibilities by producer. Actual producer confirmation follows successful payment; proposed fulfilment respects the case study 48-hour preparation lead time.',
         ['Identify producers for each line item','Create marketplace and producer order records','Provide allocations and fulfilment responsibilities'])
activity('Ayo_SP_Payments','Manage Payments and Producer Settlements',[1480,730,270,120],'operations',
         'Request sandbox payment and handle success, decline or unavailable outcomes. Only successful paid orders generate confirmed producer orders and stock-change records. Calculate the 5% marketplace commission and producer allocations. Weekly settlement is a separate business cadence, not a new transfer for every purchase.',
         ['Request sandbox payment and handle outcome','Record paid allocations and confirmed producer orders','Prepare weekly settlements and statements when due'])
activity('Ayo_SP_Quality','Food Quality and Traceability',[740,1030,280,120],'quality',
         'A producer, customer or internal administrator may report a concern. Trace affected products, producers and customer orders; request producer evidence. Confirmed risks may cause suspension and customer notification. Record notification results and failed-contact follow-up; authorised admin reviews closure or requests further action.',
         ['Record concern and trace affected orders','Investigate and decide risk and necessary actions','Record suspension, notifications, follow-up and authorised closure'])
activity('Ayo_SP_Community','Support Sustainability and Community Engagement',[740,1250,280,120],'quality',
         'Coordinate producer surplus discounts, recipes, storage guidance, farm stories and local food education. Postcode-based food-mile information supports sustainability. Community initiatives can also be initiated internally; this strategic example shows producer content as one entry point.',
         ['Receive surplus or educational content','Coordinate sustainability and community activity','Publish updates and record activity outcomes'])

for key,name,box,lane in [
 ('Ayo_End_Listing','Listing decision recorded',[1120,342,36,36],'product'),
 ('Ayo_End_Inventory','Availability updated',[1840,492,36,36],'product'),
 ('Ayo_End_Quality','Incident action or closure recorded',[1120,1072,36,36],'quality'),
 ('Ayo_End_Community','Community activity recorded',[1120,1292,36,36],'quality')]: end(key,name,box,lane)
end('Ayo_End_Order','Order confirmed',[1915,772,36,36],'operations',[1905,730,70,35])
end('Ayo_End_NotPaid','Payment not confirmed',[1840,880,36,36],'operations',[1890,885,80,45])
payment_gateway=sub(process,'exclusiveGateway',id='Ayo_Gateway_Payment',name='Payment accepted?',default='Ayo_Seq_PaymentNo')
sub(lanes['operations'],'flowNodeRef').text=payment_gateway.get('id')
shape(payment_gateway.get('id'),payment_gateway,1810,765,50,50,label_box=[1750,725,145,35])

for key,s,t,points in [
 ('Ayo_Seq_L1','Ayo_Start_Listing','Ayo_SP_Listings',[(596,360),(740,360)]),
 ('Ayo_Seq_L2','Ayo_SP_Listings','Ayo_End_Listing',[(1020,360),(1120,360)]),
 ('Ayo_Seq_I1','Ayo_Start_Inventory','Ayo_SP_Inventory',[(1336,510),(1450,510)]),
 ('Ayo_Seq_I2','Ayo_SP_Inventory','Ayo_End_Inventory',[(1730,510),(1840,510)]),
 ('Ayo_Seq_O1','Ayo_Start_Purchase','Ayo_SP_Purchasing',[(596,790),(740,790)]),
 ('Ayo_Seq_O2','Ayo_SP_Purchasing','Ayo_SP_Orders',[(1010,790),(1110,790)]),
 ('Ayo_Seq_O3','Ayo_SP_Orders','Ayo_SP_Payments',[(1380,790),(1480,790)]),
 ('Ayo_Seq_O4','Ayo_SP_Payments','Ayo_Gateway_Payment',[(1750,790),(1810,790)]),
 ('Ayo_Seq_Q1','Ayo_Start_Quality','Ayo_SP_Quality',[(596,1090),(740,1090)]),
 ('Ayo_Seq_Q2','Ayo_SP_Quality','Ayo_End_Quality',[(1020,1090),(1120,1090)]),
 ('Ayo_Seq_C1','Ayo_Start_Community','Ayo_SP_Community',[(596,1310),(740,1310)]),
 ('Ayo_Seq_C2','Ayo_SP_Community','Ayo_End_Community',[(1020,1310),(1120,1310)])]:
    sequence(key,s,t,points)
yes=sequence('Ayo_Seq_PaymentYes','Ayo_Gateway_Payment','Ayo_End_Order',[(1860,790),(1915,790)])
yes.set('name','Yes')
condition=sub(yes,'conditionExpression')
condition.set(tag('xsi','type'),'bpmn:tFormalExpression')
condition.text='= paymentConfirmed'
sequence('Ayo_Seq_PaymentNo','Ayo_Gateway_Payment','Ayo_End_NotPaid',[(1835,815),(1835,860),(1858,860),(1858,880)]).set('name','No / unresolved')
# Explicit label positions keep the branch names clear of nearby messages.
for edge_id,box in [('Ayo_Seq_PaymentYes',[1870,765,35,20]),('Ayo_Seq_PaymentNo',[1800,840,95,25])]:
    di_edge=next(e for e in plane if e.get('bpmnElement')==edge_id)
    label=E.SubElement(di_edge,tag('bpmndi','BPMNLabel'))
    E.SubElement(label,tag('dc','Bounds'),**{k:str(v) for k,v in zip(['x','y','width','height'],box)})

flows=[
 ('ListingIn','Product listing submission','Ayo_Pool_Producer','Ayo_Start_Listing',[(240,360),(560,360)],[255,308,160,42],'Ayo_Msg_Listing'),
 ('ListingOut','Listing decision / correction feedback','Ayo_SP_Listings','Ayo_Pool_Producer',[(740,325),(670,325),(670,275),(240,275)],[255,238,160,42],None),
 ('CertRequest','Organic certification request','Ayo_SP_Listings','Ayo_Pool_Certification',[(900,300),(900,180),(1250,180),(1250,140)],[935,148,260,30],None),
 ('CertResult','Certification result / error','Ayo_Pool_Certification','Ayo_SP_Listings',[(1350,140),(1350,220),(970,220),(970,300)],[1040,185,250,30],None),
 ('StockUpdate','Quantity and seasonal updates','Ayo_Pool_Producer','Ayo_Start_Inventory',[(240,510),(1300,510)],[255,450,160,50],'Ayo_Msg_Stock'),
 ('PurchaseIn','Customer purchase request','Ayo_Pool_Customers','Ayo_Start_Purchase',[(2110,680),(2010,680),(2010,620),(578,620),(578,772)],[2020,680,85,60],'Ayo_Msg_Purchase'),
 ('PurchaseOut','Order/payment outcome and arrangements','Ayo_SP_Payments','Ayo_Pool_Customers',[(1750,835),(2070,835),(2070,815),(2110,815)],[2005,860,100,55],None),
 ('PaymentRequest','Sandbox payment / transfer request','Ayo_SP_Payments','Ayo_Pool_Payment',[(1750,760),(1990,760),(1990,380),(2030,380)],[2035,430,180,42],None),
 ('PaymentResult','Payment / transfer outcome','Ayo_Pool_Payment','Ayo_SP_Payments',[(2030,350),(2000,350),(2000,950),(1400,950),(1400,810),(1480,810)],[2035,525,170,42],None),
 ('ProducerOrders','Confirmed orders / weekly settlement statement','Ayo_SP_Payments','Ayo_Pool_Producer',[(1480,825),(1420,825),(1420,930),(240,930)],[890,896,340,30],None),
 ('ProducerConcern','Producer quality concern','Ayo_Pool_Producer','Ayo_Start_Quality',[(240,1090),(560,1090)],[255,1035,160,50],'Ayo_Msg_Quality'),
 ('CustomerConcern','Customer quality concern','Ayo_Pool_Customers','Ayo_Start_Quality',[(2110,1000),(2040,1000),(2040,975),(578,975),(578,1072)],[2020,1005,85,60],'Ayo_Msg_Quality'),
 ('EvidenceRequest','Investigation evidence request','Ayo_SP_Quality','Ayo_Pool_Producer',[(740,1120),(240,1120)],[255,1125,160,45],None),
 ('EvidenceReply','Producer evidence / response','Ayo_Pool_Producer','Ayo_SP_Quality',[(240,1200),(700,1200),(700,1135),(740,1135)],[255,1205,160,45],None),
 ('SafetyNotice','Confirmed risk notification / guidance','Ayo_SP_Quality','Ayo_Pool_Customers',[(880,1150),(880,1170),(2020,1170),(2020,1120),(2110,1120)],[1735,1180,245,35],None),
 ('CommunityIn','Surplus offer / recipe / farm content','Ayo_Pool_Producer','Ayo_Start_Community',[(240,1310),(560,1310)],[255,1255,160,45],'Ayo_Msg_Community'),
 ('CommunityOut','Surplus offers / seasonal and community updates','Ayo_SP_Community','Ayo_Pool_Customers',[(880,1370),(880,1398),(2060,1398),(2060,1310),(2110,1310)],[1710,1352,240,35],None),
]
for key,name,s,t,points,box,msg in flows: communication('Ayo_MF_'+key,name,s,t,points,box,msg)

# Data hand-offs explain relationships without forcing unrelated lifecycles
# into a single sequence-flow chain.
store=sub(defs,'dataStore',id='Ayo_Store_Catalogue',name='Catalogue and current availability',isUnlimited='true')
ref=sub(process,'dataStoreReference',id='Ayo_Data_Catalogue',name='Catalogue and availability',dataStoreRef=store.get('id'))
shape(ref.get('id'),ref,1100,630,70,55,label_box=[940,637,150,45])
for key,name,x,y,lb in [
 ('Ayo_Data_PaidStock','Paid-order stock changes',1830,650,[1895,650,75,65]),
 ('Ayo_Data_Suspension','Confirmed product suspension decision',1580,1040,[1480,1110,230,35])]:
    obj=sub(process,'dataObject',id=key+'_object')
    ref=sub(process,'dataObjectReference',id=key,name=name,dataObjectRef=obj.get('id'))
    shape(key,ref,x,y,50,65,label_box=lb)
data_link('Ayo_DataOut_Listing','Ayo_SP_Listings','Ayo_Data_Catalogue','out',[(880,420),(880,600),(1135,600),(1135,630)])
data_link('Ayo_DataOut_Inventory','Ayo_SP_Inventory','Ayo_Data_Catalogue','out',[(1590,570),(1590,600),(1135,600),(1135,630)])
data_link('Ayo_DataIn_Catalogue','Ayo_SP_Purchasing','Ayo_Data_Catalogue','in',[(1135,685),(1135,710),(875,710),(875,730)])
data_link('Ayo_DataOut_PaidStock','Ayo_SP_Payments','Ayo_Data_PaidStock','out',[(1710,730),(1710,720),(1855,720),(1855,715)])
data_link('Ayo_DataIn_PaidStock','Ayo_SP_Inventory','Ayo_Data_PaidStock','in',[(1830,675),(1780,675),(1780,550),(1730,550)])
data_link('Ayo_DataOut_Suspension','Ayo_SP_Quality','Ayo_Data_Suspension','out',[(880,1030),(880,1010),(1605,1010),(1605,1040)])
data_link('Ayo_DataIn_Suspension','Ayo_SP_Inventory','Ayo_Data_Suspension','in',[(1630,1072),(1760,1072),(1760,550),(1730,550)])

annotation('Ayo_Note_AdminListings','Internal role: Marketplace Admin. Review unresolved verification only under an agreed policy.',[520,435,370,60],
           'Ayo_SP_Listings',[(880,420),(880,435)])
annotation('Ayo_Note_InventoryTriggers','Also triggered internally by listing/order stock changes and daily season checks. Zero stock or out of season means unavailable.',[1430,260,420,75],
           'Ayo_SP_Inventory',[(1590,450),(1590,350),(1640,350),(1640,335)])
annotation('Ayo_Note_Settlements','5% commission and producer shares; weekly settlement cadence. Confirm producer orders only after successful payment.',[1470,865,310,60],
           'Ayo_SP_Payments',[(1615,850),(1615,865)])
annotation('Ayo_Note_AdminQuality','Internal role: Marketplace Admin. May report concerns and authorises action/closure; failed customer contacts require follow-up.',[1180,1188,400,60],
           'Ayo_SP_Quality',[(950,1150),(950,1215),(1180,1215)])
annotation('Ayo_Note_Community','Surplus discounts, recipes, storage guidance, farm stories, food education and postcode-based food-mile information.',[1300,1260,600,70],
           'Ayo_SP_Community',[(1020,1270),(1300,1270)])
internals()


def validate():
    elements={e.get('id'):e for e in defs.iter() if e.get('id')}
    assert len(elements)==sum(1 for e in defs.iter() if e.get('id'))
    parents={c:p for p in defs.iter() for c in p}
    for e in defs.iter():
        if e.tag in {tag('b','sequenceFlow'),tag('b','messageFlow'),tag('b','association')}:
            assert e.get('sourceRef') in elements and e.get('targetRef') in elements,e.attrib
        if e.tag==tag('b','sequenceFlow'):
            assert parents[elements[e.get('sourceRef')]] is parents[elements[e.get('targetRef')]],e.attrib
        if e.tag in {tag('b','dataInputAssociation'),tag('b','dataOutputAssociation')}:
            assert e.find(tag('b','sourceRef')).text in elements
            assert e.find(tag('b','targetRef')).text in elements
    for item in plane:
        assert item.get('bpmnElement') in elements
    assert len(SUBPROCESSES)==7 and len(lanes)==3
    assert process.get('isExecutable')=='false'
    # Every visible flow node is allocated to exactly one responsibility lane.
    refs=[e.text for e in lane_set.iter(tag('b','flowNodeRef'))]
    expected={e.get('id') for e in process if e.tag in {tag('b','startEvent'),tag('b','endEvent'),tag('b','subProcess'),tag('b','exclusiveGateway')}}
    assert len(refs)==len(set(refs)) and set(refs)==expected
    print('Validated 5 pools, 3 lanes, 7 subprocesses,',len(flows),'message flows and 7 data hand-offs.')


def main():
    validate()
    OUT.mkdir(parents=True,exist_ok=True)
    # Preserve BPMN XSD ordering even though the authoring functions create
    # collaboration geometry and IO associations incrementally.
    for item in SUBPROCESSES.values():
        activity_element=item['element']
        io=activity_element.find(tag('b','ioSpecification'))
        if io is not None:
            io_order={tag('b','dataInput'):0,tag('b','dataOutput'):1,tag('b','inputSet'):2,tag('b','outputSet'):3}
            io[:]=sorted(list(io),key=lambda child:io_order[child.tag])
        activity_order={tag('b','documentation'):0,tag('b','ioSpecification'):1,
                        tag('b','dataInputAssociation'):2,tag('b','dataOutputAssociation'):3}
        activity_element[:]=sorted(list(activity_element),key=lambda child:activity_order.get(child.tag,4))
    defs[:]=sorted(list(defs),key=lambda child:1 if child.tag==tag('bpmndi','BPMNDiagram') else 0)
    E.indent(defs)
    E.ElementTree(defs).write(OUT/'BRFN-Ayo-Strategic-BPMN.bpmn',encoding='utf-8',xml_declaration=True)
    (OUT/'diagram-map.json').write_text(json.dumps(dict(nodes=NODES,edges=EDGES,
        sourceCommit='9aeeddc355d42e18477f753973677f85c8dadbbe',isExecutable=False),indent=2)+'\n',encoding='utf-8')


if __name__=='__main__': main()
