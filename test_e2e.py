import os
import urllib.request
import json
import numpy as np
import cv2

print("=== Running DeepShield End-to-End Verification Test ===")

# 1. Generate a test image file
test_img_path = "test_deepfake_sample.jpg"
img = np.zeros((480, 640, 3), dtype=np.uint8)
cv2.putText(img, "DeepShield Test Video Frame", (80, 200), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 200), 2)
cv2.rectangle(img, (200, 100), (440, 340), (0, 0, 255), 2)
cv2.imwrite(test_img_path, img)

# 2. Upload file via multipart request using urllib
boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
with open(test_img_path, "rb") as f:
    file_bytes = f.read()

body = []
body.append(f"--{boundary}".encode())
body.append(f'Content-Disposition: form-data; name="file"; filename="{test_img_path}"'.encode())
body.append(b"Content-Type: image/jpeg")
body.append(b"")
body.append(file_bytes)
body.append(f"--{boundary}--".encode())
body.append(b"")

payload = b"\r\n".join(body)

req = urllib.request.Request(
    "http://127.0.0.1:8000/api/analyze",
    data=payload,
    headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
    method="POST"
)

res = urllib.request.urlopen(req)
data = json.loads(res.read().decode())

print("[1/5] Upload & Analysis API Result:")
print("  - ID:", data["id"])
print("  - Evidence ID:", data["evidence_id"])
print("  - Authenticity Score:", data["authenticity_score"])
print("  - Risk Level:", data["risk_level"])
print("  - Likely Technique:", data["likely_technique"])
print("  - SHA-256:", data["sha256"])

# 3. Test PDF Report Generation Endpoint
report_req = urllib.request.Request(f"http://127.0.0.1:8000/api/analysis/{data['id']}/report")
report_res = urllib.request.urlopen(report_req)
pdf_bytes = report_res.read()
print(f"[2/5] PDF Forensic Report Endpoint Response: {len(pdf_bytes)} bytes received (PDF Header: {pdf_bytes[:4]})")

# 4. Test Evidence Vault Endpoint
vault_res = urllib.request.urlopen("http://127.0.0.1:8000/api/evidence")
vault_data = json.loads(vault_res.read().decode())
print(f"[3/5] Evidence Vault Records Count: {len(vault_data)}")

# 5. Test Models Endpoint
models_res = urllib.request.urlopen("http://127.0.0.1:8000/api/models")
models_data = json.loads(models_res.read().decode())
print(f"[4/5] Active Model Architecture: {models_data['active_ensemble']['name']} ({models_data['active_ensemble']['mode']})")

# 6. Test Audit Logs Endpoint
audit_res = urllib.request.urlopen("http://127.0.0.1:8000/api/audit-logs")
audit_data = json.loads(audit_res.read().decode())
print(f"[5/5] System Audit Logs Count: {len(audit_data)}")

# Cleanup
if os.path.exists(test_img_path):
    os.remove(test_img_path)

print("=== ALL END-TO-END VERIFICATION TESTS PASSED SUCCESSFULLY! ===")
