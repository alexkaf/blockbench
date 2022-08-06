#!/bin/python
import os
import sys
from config import *

def partition(nodes, timeout):
  n=len(nodes)
  nodes1 = nodes[:int(n/2)]
  nodes2 = nodes[int(n/2):]
  
  print(nodes1)
  print(nodes2)
  for n1 in nodes1:
    for n2 in nodes2:
      cmd = partition_cmd.format(n1,n2,timeout)
      os.system(cmd)

if __name__=='__main__':
  partition(NODES[:int(sys.argv[1])], TIMEOUT)
