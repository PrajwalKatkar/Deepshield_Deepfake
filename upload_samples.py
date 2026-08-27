import urllib.request
import json
import os

files_to_upload = [
    ('test_samples/suspicious_faceswap_video.mp4', 'video/mp4'),
    ('test_samples/authentic_baseline_video.mp4', 'video/mp4'),
    ('test_samples/suspicious_deepfake_image.jpg', 'image/jpeg'),
    ('test_samples/authentic_portrait_image.jpg', 'image/jpeg')
]

for filepath, content_type in files_to_upload:
    if not os.path.exists(filepath):
        continue
    filename = os.path.basename(filepath)
    boundary = '----WebKitFormBoundarySampleUpload'
    with open(filepath, 'rb') as f:
        file_bytes = f.read()

    body = []
    body.append(f'--{boundary}'.encode())
    body.append(f'Content-Disposition: form-data; name="file"; filename="{filename}"'.encode())
    body.append(f'Content-Type: {content_type}'.encode())
    body.append(b'')
    body.append(file_bytes)
    body.append(f'--{boundary}--'.encode())
    body.append(b'')

    payload = b'\r\n'.join(body)

    req = urllib.request.Request(
        'http://127.0.0.1:8000/api/analyze',
        data=payload,
        headers={'Content-Type': f'multipart/form-data; boundary={boundary}'},
        method='POST'
    )

    res = urllib.request.urlopen(req)
    data = json.loads(res.read().decode())
    print(f'Uploaded {filename}: ID={data["id"]}, Evidence={data["evidence_id"]}, Score={data["authenticity_score"]}, Risk={data["risk_level"]}')
