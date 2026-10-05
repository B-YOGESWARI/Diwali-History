import os
import requests
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("LUMAAI_API_KEY")

if not api_key:
    raise RuntimeError("LUMAAI_API_KEY not found")

print("Key loaded:", True)
print("Key prefix:", api_key[:9])
print("Key length:", len(api_key))

url = "https://api.lumalabs.ai/dream-machine/v1/generations"

headers = {
    "accept": "application/json",
    "authorization": f"Bearer {api_key}",
}

print("\nTesting Luma API directly...")

response = requests.get(
    url,
    headers=headers,
    params={"limit": 1},
    timeout=30,
)

print("Status:", response.status_code)
print("Response:")
print(response.text)