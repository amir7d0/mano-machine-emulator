from assembler import Assembler
from computer import Register, Memory, Computer
import json


l=""
org=[]
#open and read input file
f=open("./core/input.txt","r")

p=[]
counter=0
for i in f:
    if i=='\n':
        i.replace('\n',' ')
    l += i
    counter+=1
    if "ORG" in i:
        p.append(counter)
        org.append(i.split()[1])
        #org=org[1]
        #c=int(org, 16)
    if "END" in i:
        end=counter

li=[]

for i in range(len(org)):
    tmp=int(org[i],16)
    li.append(tmp)
org=li

#create computer and load program
program = l
computer = Computer()
assembler = Assembler(program)
program_start = assembler.load(computer.ram)
computer.run(program_start)

#register changes
dic={}
tmp=[]
l_t=[]
l=computer.logger.messages
data={}
for i in l:
    tmp.append(i)
    if "#" in i:
        l_t.append(tmp)
        tmp=[]

reg_changes=[]

for i in range(len(l_t)):
    dic={}
    dic['text']=l_t[i][0]
    for j in range(1,len(l_t[i])):
        tmp=(l_t[i][j]).split(":")
        dic[tmp[0]]=tmp[1]
    reg_changes.append(dic)

data["registerChanges"]=reg_changes


[]
#address table
data["addressTable"]=assembler.address_table
for i in data["addressTable"]:
    data["addressTable"][i]=hex(data["addressTable"][i])

rn=[]
for i in range(len(p)-1):
    rn.append(p[i+1]-p[i])

end=end-p[-1]-1

ab=[]
dic={}
for i in range(len(org)-1):
    for j in range(org[i],rn[i]+org[i]-1):
        dic[hex(j)]=computer.ram.data[j]

for i in range(org[-1],org[-1]+end):
    dic[hex(i)]=computer.ram.data[i]
ab.append(dic)


#used memory
used_mem=[]
l=[]
p=program.split('\n')
pr=[]
pp=[]
comments=[]

for i in range(len(p)):
    if 'ORG' in p[i]:
        p[i]=""
    if 'END' in p[i]:
        p[i]=""


for i in p:
    if i!="":
        if "//" in i:
            m=i.split("//")
            pp.append(m[0].strip(' '))
            comments.append(m[1].strip(' '))
        else:
            pp.append(i.strip(' '))
            comments.append(" ")


for i,j,k in zip(dic.keys(),pp,comments):
    l.append(i)
    tmp=""
    tmp='{0:016b}'.format(dic[i])
    l.append(tmp[:4]+" "+tmp[4:8]+" "+tmp[8:12]+" "+tmp[12:])
    l.append(dic[i])
    l.append(j)
    l.append(k)
    pr.append(l)
    l=[]

dic={}

for i in range(len(pr)):
    dic[pr[i][0]]=pr[i][1:]
used_mem.append(dic)
data["usedMemory"]=used_mem


#total memory
dic={}
total_mem=[]
for i,j in zip(range(0,4096) , computer.ram.data):
    dic[hex(i)]=j
total_mem.append(dic)

data["totalMemory"]=total_mem


#ouput txt
f=open("./core/out.txt","w+")
f.write(str(data))
#output json
with open('./core/data.json', 'w') as outfile:
    json.dump(data, outfile,indent=4)

