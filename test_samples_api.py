import urllib.request
import json

# 1. Test GET /api/samples
req = urllib.request.urlopen('http://127.0.0.1:8000/api/samples')
samples = json.loads(req.read().decode())
print(f'[1/2] GET /api/samples returned {len(samples)} available backend test samples:')
for s in samples:
    print(f'  - {s["name"]} ({s["filename"]})')

# 2. Test POST /api/samples/analyze-sample/suspicious_faceswap
req_post = urllib.request.Request('http://127.0.0.1:8000/api/samples/analyze-sample/suspicious_faceswap', method='POST')
res_post = urllib.request.urlopen(req_post)
data_post = json.loads(res_post.read().decode())
print(f'[2/2] POST /api/samples/analyze-sample/suspicious_faceswap result:')
print(f'  - ID: {data_post["id"]}, Evidence: {data_post["evidence_id"]}, Score: {data_post["authenticity_score"]}, Risk: {data_post["risk_level"]}')
