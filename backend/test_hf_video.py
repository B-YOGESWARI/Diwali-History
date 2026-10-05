import os
from pathlib import Path

from dotenv import load_dotenv
from huggingface_hub import InferenceClient


# ============================================================
# 1. LOAD ENVIRONMENT VARIABLES
# ============================================================

load_dotenv()

hf_token = os.getenv("HF_TOKEN")

if not hf_token:
    raise RuntimeError(
        "HF_TOKEN was not found in your .env file.\n"
        "Please add:\n"
        "HF_TOKEN=YOUR_PRIVATE_HUGGING_FACE_TOKEN"
    )

print("Hugging Face token loaded successfully.")


# ============================================================
# 2. CREATE HUGGING FACE CLIENT
# ============================================================

# Fal AI is used through Hugging Face Inference Providers.
client = InferenceClient(
    provider="fal-ai",
    api_key=hf_token,
)

print("Hugging Face client created successfully.")


# ============================================================
# 3. CREATE THE DIWALI CINEMATIC PROMPT
# ============================================================

prompt = """
A cinematic historical recreation inspired by the traditional
Ramayana association with Diwali.

SCENE:

Ancient Ayodhya during a beautiful golden sunset.

Rama, Sita, and Lakshmana are returning toward the ancient city
after their long journey.

Citizens of Ayodhya gather peacefully along the streets to
welcome them.

Families carefully light rows of traditional clay oil lamps,
known as diyas, along pathways, courtyards, balconies,
doorways, and ancient buildings.

As the travelers approach the city, more and more lamps are
illuminated.

Hundreds of warm golden diya flames gradually illuminate the
ancient city as sunset turns into evening.

CAMERA:

Slow cinematic forward camera movement through an ancient
Indian street.

The camera passes glowing clay lamps and groups of citizens
before revealing the returning travelers in the distance.

VISUAL STYLE:

Photorealistic cinematic historical recreation.

Historically inspired ancient Indian architecture.

Historically inspired traditional Indian clothing.

Natural human movement.

Realistic facial expressions.

Warm golden sunset.

Realistic firelight from hundreds of clay oil lamps.

Atmospheric haze.

Volumetric golden lighting.

Cinematic depth of field.

Detailed ancient city environment.

Epic historical documentary cinematography.

Peaceful, emotional, respectful and celebratory atmosphere.

IMPORTANT:

This scene is a cinematic representation inspired by the
religious and cultural Ramayana tradition associated with
Diwali.

AVOID:

Modern buildings.
Modern roads.
Cars.
Motorcycles.
Electric street lights.
Modern electrical objects.
Modern clothing.
Phones.
Text.
Captions.
Subtitles.
Logos.
Watermarks.
Cartoon appearance.
Distorted faces.
Extra fingers.
Extra arms.
Extra legs.
Unnatural human movement.
"""


# ============================================================
# 4. GENERATE VIDEO
# ============================================================

print()
print("==========================================")
print("Generating Diwali test video...")
print("Model: Wan-AI/Wan2.2-TI2V-5B")
print("Provider: fal-ai")
print("==========================================")
print()

try:

    video = client.text_to_video(
        prompt,
        model="Wan-AI/Wan2.2-TI2V-5B",
    )

except Exception as error:

    print()
    print("==========================================")
    print("VIDEO GENERATION FAILED")
    print("==========================================")
    print()

    print("Error type:")
    print(type(error).__name__)

    print()
    print("Error message:")
    print(error)

    print()
    print("------------------------------------------")
    print("Do not change the code yet.")
    print("Copy this terminal error and send it to me.")
    print("------------------------------------------")

    raise


# ============================================================
# 5. CHECK GENERATED VIDEO
# ============================================================

if not video:
    raise RuntimeError(
        "Hugging Face returned an empty video response."
    )

print()
print("Video generated successfully.")
print("Preparing to save the MP4...")


# ============================================================
# 6. CREATE OUTPUT DIRECTORY
# ============================================================

output_directory = (
    Path("Assets")
    / "videos"
)

output_directory.mkdir(
    parents=True,
    exist_ok=True,
)


# ============================================================
# 7. SET OUTPUT FILE NAME
# ============================================================

output_file = (
    output_directory
    / "rama-ayodhya-hf-test.mp4"
)


# ============================================================
# 8. SAVE VIDEO
# ============================================================

try:

    with open(output_file, "wb") as file:
        file.write(video)

except Exception as error:

    print()
    print("==========================================")
    print("VIDEO SAVE FAILED")
    print("==========================================")
    print()

    print(type(error).__name__)
    print(error)

    raise


# ============================================================
# 9. VERIFY FILE
# ============================================================

if not output_file.exists():
    raise RuntimeError(
        "The MP4 file was not created."
    )

file_size = output_file.stat().st_size

if file_size == 0:
    raise RuntimeError(
        "The generated MP4 file is empty."
    )


# ============================================================
# 10. SUCCESS
# ============================================================

print()
print("==========================================")
print("SUCCESS")
print("==========================================")
print()

print("Diwali cinematic test video generated!")

print()
print("Saved to:")
print(output_file.resolve())

print()
print("File size:")
print(f"{file_size / (1024 * 1024):.2f} MB")

print()
print("==========================================")