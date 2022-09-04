# Yahoo! Cloud System Benchmark
# Workload A: Update heavy workload
#   Application example: Session store recording recent actions
#                        
#   Read/update ratio: 50/50
#   Default data size: 1 KB records (10 fields, 100 bytes each, plus key)
#   Request distribution: zipfian

recordcount=2500
operationcount=2500
workload=donothing

readallfields=true

readproportion=0.5
updateproportion=0.0
scanproportion=0.0
insertproportion=0.5
fieldcount=5
requestdistribution=uniform

field_len_dist=uniform
fieldlength=150


