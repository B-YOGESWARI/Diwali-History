import os
from dotenv import load_dotenv
from lumaai import LumaAI

load_dotenv()

api_key = os.getenv("LUMAAI_API_KEY")

print("Key loaded:", bool(api_key))

if not api_key:
    raise RuntimeError("LUMAAI_API_KEY not found")

print("Key starts with:", api_key[:9])
print("Key length:", len(api_key))

client = LumaAI(auth_token=api_key)

try:
    result = client.generations.list(limit=1)

    print("\n==============================")
    print("LUMA AUTHENTICATION SUCCESS")
    print("==============================")
    print(result)

except Exception as e:
    print("\n==============================")
    print("LUMA AUTHENTICATION FAILED")
    print("==============================")
    print(type(e).__name__)
    print(e)