#!/usr/bin/env python3
"""Builds tint.html (the single-file game) from the src/ folders.
Every line that is exactly  @@ path @@  is replaced by that file's contents."""
import os,sys
SRC=os.path.dirname(os.path.abspath(__file__))
def load(rel):
    out=[]
    for line in open(os.path.join(SRC,rel),encoding='utf-8').read().split('\n'):
        s=line.strip()
        if s.startswith('@@ ') and s.endswith(' @@') and line==s: out.append(load(s[3:-3]))
        else: out.append(line)
    return '\n'.join(out)
if __name__=='__main__':
    dst=sys.argv[1] if len(sys.argv)>1 else os.path.join(SRC,'..','tint.html')
    open(dst,'w',encoding='utf-8').write(load('index.html')); print('built',os.path.abspath(dst))
