#!/usr/bin/env python

import cgitb
import urllib2
import json
cgitb.enable()

print "Content-type: text/html"
print
print '<html>'
print '<head><title>Hello from Python</title></head>'
print '<body>'
print '<h2>Hello from Python</h2>'
print '</body></html>'