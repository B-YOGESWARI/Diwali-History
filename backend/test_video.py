import os
import time
import requests

from dotenv import load_dotenv
from luma_agents import Luma


# ============================================================
# 1. LOAD ENVIRONMENT VARIABLES
# ============================================================

load_dotenv()

api_key = os.getenv("LUMA_AGENTS_API_KEY")

if not api_key:
    raise RuntimeError(
        "LUMA_AGENTS_API_KEY was not found. "
        "Please check your .env file."
    )

print("Luma Agents API key loaded successfully.")


# ============================================================
# 2. CREATE LUMA CLIENT
# ============================================================

# Luma() automatically reads:
# LUMA_AGENTS_API_KEY
client = Luma()

print("Luma client created successfully.")


# ============================================================
# 3. DIWALI TEST VIDEO PROMPT
# ============================================================

prompt = """
Create a cinematic historical recreation inspired by the traditional
Ramayana association with Diwali.

SCENE:

Ancient Ayodhya at sunset.

Rama, Sita, and Lakshmana approach the ancient city after completing
their long journey.

Citizens of Ayodhya gather peacefully along the streets to welcome them.

Families carefully light rows of traditional clay oil lamps (diyas)
along pathways, houses, courtyards, balconies, and city walls.

As Rama, Sita, and Lakshmana approach the city, more and more lamps
are illuminated.

The camera slowly moves through the ancient street toward the returning
travelers.

Hundreds of warm golden diya flames gradually illuminate the ancient
city.

The atmosphere becomes increasingly beautiful and luminous as evening
turns into night.

VISUAL STYLE:

Photorealistic cinematic historical recreation.
Historically inspired ancient Indian architecture.
Historically inspired Indian clothing.
Natural human movement.
Realistic facial expressions.
Warm golden sunset lighting.
Realistic firelight from clay diyas.
Atmospheric haze.
Volumetric lighting.
Cinematic depth of field.
Detailed ancient city environment.
Epic historical documentary cinematography.
Slow cinematic camera movement.
High visual realism.

The scene should feel peaceful, emotional, respectful, and celebratory.

IMPORTANT:

This is a cinematic representation of a religious and cultural
tradition associated with the Ramayana and Diwali.

Do not portray it as independently verified historical footage.

AVOID:

Modern buildings.
Electric lights.
Cars.
Modern roads.
Modern clothing.
Modern objects.
Text.
Captions.
Subtitles.
Logos.
Watermarks.
Distorted faces.
Extra limbs.
Unnatural human movement.
Cartoon appearance.
"""


# ============================================================
# 4. SUBMIT VIDEO GENERATION
# ============================================================

print()
print("==========================================")
print("Submitting Diwali Ray 3.2 video...")
print("==========================================")

try:

    generation = client.generations.create(
        model="ray-3.2",
        type="video",
        prompt=prompt,
        aspect_ratio="16:9",
        video={
            "resolution": "720p",
            "duration": "5s",
        },
    )

except Exception as error:

    print()
    print("==========================================")
    print("VIDEO SUBMISSION FAILED")
    print("==========================================")

    print(type(error).__name__)
    print(error)

    raise


# ============================================================
# 5. GET GENERATION ID
# ============================================================

generation_id = generation.id

print()
print("Generation submitted successfully.")
print("Generation ID:", generation_id)

if hasattr(generation, "state"):
    print("Initial state:", generation.state)


# ============================================================
# 6. WAIT FOR VIDEO
# ============================================================

print()
print("Waiting for Luma to generate the video...")
print("This may take a little time.")
print()

# Maximum wait = 10 minutes
deadline = time.time() + 600

while True:

    if time.time() > deadline:

        raise TimeoutError(
            f"Generation {generation_id} did not complete "
            "within 10 minutes."
        )

    try:

        generation = client.generations.get(generation_id)

    except Exception as error:

        print("Error while checking generation status:")
        print(error)

        print("Trying again in 5 seconds...")

        time.sleep(5)

        continue

    state = getattr(generation, "state", None)

    print("Current state:", state)

    if state == "completed":
        break

    if state == "failed":

        failure_reason = getattr(
            generation,
            "failure_reason",
            "Unknown reason",
        )

        raise RuntimeError(
            f"Video generation failed: {failure_reason}"
        )

    time.sleep(5)


# ============================================================
# 7. GET GENERATED VIDEO
# ============================================================

print()
print("==========================================")
print("VIDEO GENERATION COMPLETED")
print("==========================================")

output = getattr(generation, "output", None)

if not output:

    raise RuntimeError(
        "Generation completed but Luma returned no output."
    )


# ============================================================
# 8. EXTRACT VIDEO URL
# ============================================================

video_url = None

first_output = output[0]

if hasattr(first_output, "url"):

    video_url = first_output.url

elif isinstance(first_output, dict):

    video_url = first_output.get("url")


if not video_url:

    print("Generation output:")
    print(output)

    raise RuntimeError(
        "Could not find the generated video URL."
    )


print("Video URL received successfully.")


# ============================================================
# 9. CREATE OUTPUT DIRECTORY
# ============================================================

output_directory = os.path.join(
    "Assets",
    "videos",
)

os.makedirs(
    output_directory,
    exist_ok=True,
)


# ============================================================
# 10. OUTPUT FILE
# ============================================================

output_path = os.path.join(
    output_directory,
    "rama-ayodhya-test.mp4",
)


# ============================================================
# 11. DOWNLOAD VIDEO
# ============================================================

print()
print("Downloading generated MP4...")

response = requests.get(
    video_url,
    timeout=180,
)

response.raise_for_status()


# ============================================================
# 12. SAVE VIDEO
# ============================================================

with open(output_path, "wb") as file:
    file.write(response.content)


# ============================================================
# 13. SUCCESS
# ============================================================

print()
print("==========================================")
print("SUCCESS")
print("==========================================")

print("Diwali test video generated successfully.")

print()
print("Saved video:")
print(output_path)

print()
print("You can now open:")
print(
    os.path.abspath(output_path)
)