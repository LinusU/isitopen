#!/usr/bin/env python3
#coding: utf-8
#

from urllib import request

import json

def McDonalds():
    
    url = request.urlopen("http://apps.mcdonalds.se/sweden/restSite.nsf/markers?readForm")
    data = url.read().decode('utf-8')
    markers = json.loads(data)['markers']
    
    for m in markers:
        if m['vanityname'].startswith('mcdonalds'):
            
            hours = []
            
            for h in m['openhours']:
                if h == "always,1":
                    hours.append(("00:00", "24:00"))
                else:
                    hours.append(h.split(","))
            
            name = cleanupName(m['vanityname'])
            
            yield {
                'name': name,
                'title': nameToTitle(name),
                'type': 'restaurant',
                'lat': round(float(m['lat']) * 1E6),
                'lon': round(float(m['lng']) * 1E6),
                'hours': hours
            }
            
    

def cleanupName(n):

    if n == "mcdonaldscitygrosskk":
        return "mcdonalds-citygross"
    
    l = n[9:]
    n = ["mcdonalds"]
    
    if l.startswith("a6"):
        n.extend(["a6", l[2:]])
    elif l.startswith("drottninggatan"):
        n.extend(["drottninggatan", l[14:]])
    elif l.startswith("eurostop"):
        n.extend(["eurostop", l[8:]])
    elif l.startswith("gamla"):
        n.extend(["gamla", l[5:]])
    elif l.startswith("gbg"):
        n.extend(["gbg", l[3:]])
    elif l.startswith("vst"):
        n.extend(["vst", l[3:]])
    else:
        n.append(l)
    
    l = n.pop()
    
    if l.endswith("city"):
        n.extend([l[:-4], "city"])
    elif l.endswith("torg"):
        n.extend([l[:-4], "torg"])
    elif l.endswith("mcdrive"):
        n.extend([l[:-7], "mcdrive"])
    elif l.endswith("galleria"):
        n.extend([l[:-8], "galleria"])
    else:
        n.append(l)
    
    return "-".join(list(filter(None, n)))

def nameToTitle(n):
    
    s = n.split("-")
    n = "McDonalds"
    
    s.pop(0)
    
    for p in s:
        n += " " + p.capitalize()
    
    return n

if __name__ == '__main__':
    for name in McDonalds(): print(name)
