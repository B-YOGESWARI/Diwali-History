from typing import Any, Dict, List, Optional

from backend.services.history_service import history_service
from backend.services.video_generation_service import (
    video_generation_service,
)


class SceneAgent:
    """
    Handles individual cinematic scenes for the
    Diwali History experience.

    This agent connects scene definitions from
    history.json with the video files available
    inside Assets/videos/scenes.
    """

    def __init__(self):
        self.history_service = history_service
        self.video_service = video_generation_service

    def get_scene(
        self,
        chapter_id: str,
        scene_id: str
    ) -> Dict[str, Any]:
        """
        Find one scene inside a chapter and attach
        its available video information.
        """

        chapter = self.history_service.get_chapter(
            chapter_id
        )

        if not chapter:
            return {
                "status": "not_found",
                "chapter_id": chapter_id,
                "scene_id": scene_id,
                "message": "Chapter not found."
            }

        scenes = (
            chapter
            .get("cinematic", {})
            .get("scenes", [])
        )

        scene = None

        for current_scene in scenes:
            if current_scene.get("id") == scene_id:
                scene = current_scene
                break

        if not scene:
            return {
                "status": "not_found",
                "chapter_id": chapter_id,
                "scene_id": scene_id,
                "message": "Scene not found."
            }

        video = self.video_service.get_scene_video(
            chapter_id,
            scene_id
        )

        return {
            "status": "success",
            "chapter_id": chapter_id,
            "chapter_title": chapter.get("title"),
            "scene": {
                "id": scene.get("id"),
                "title": scene.get("title"),
                "description": scene.get(
                    "description"
                )
            },
            "video": video.get("video")
        }

    def get_all_scenes(
        self,
        chapter_id: str
    ) -> Dict[str, Any]:
        """
        Return all scenes for a chapter together
        with their available videos.
        """

        chapter = self.history_service.get_chapter(
            chapter_id
        )

        if not chapter:
            return {
                "status": "not_found",
                "chapter_id": chapter_id,
                "scenes": []
            }

        scenes = (
            chapter
            .get("cinematic", {})
            .get("scenes", [])
        )

        result: List[Dict[str, Any]] = []

        for index, scene in enumerate(
            scenes,
            start=1
        ):

            scene_id = scene.get("id")

            video_result = (
                self.video_service.get_scene_video(
                    chapter_id,
                    scene_id
                )
            )

            video = video_result.get(
                "video",
                {
                    "exists": False
                }
            )

            result.append(
                {
                    "sequence": index,
                    "id": scene_id,
                    "title": scene.get("title"),
                    "description": scene.get(
                        "description"
                    ),
                    "video": video
                }
            )

        return {
            "status": "success",
            "chapter_id": chapter_id,
            "chapter_title": chapter.get("title"),
            "scene_count": len(result),
            "scenes": result
        }

    def get_scene_status(
        self,
        chapter_id: str,
        scene_id: str
    ) -> Dict[str, Any]:
        """
        Return a simple status describing whether
        the requested scene has a video.
        """

        scene_result = self.get_scene(
            chapter_id,
            scene_id
        )

        if scene_result.get("status") != "success":
            return scene_result

        video = scene_result.get(
            "video",
            {}
        )

        return {
            "status": "success",
            "chapter_id": chapter_id,
            "scene_id": scene_id,
            "scene_title": (
                scene_result
                .get("scene", {})
                .get("title")
            ),
            "video_available": video.get(
                "exists",
                False
            ),
            "video": video
        }

    def create_scene_plan(
        self,
        chapter_id: str
    ) -> Dict[str, Any]:
        """
        Create a cinematic production plan for
        every scene in a chapter.
        """

        chapter = self.history_service.get_chapter(
            chapter_id
        )

        if not chapter:
            return {
                "status": "not_found",
                "chapter_id": chapter_id
            }

        scenes = (
            chapter
            .get("cinematic", {})
            .get("scenes", [])
        )

        scene_plan = []

        for index, scene in enumerate(
            scenes,
            start=1
        ):

            scene_plan.append(
                {
                    "sequence": index,
                    "scene_id": scene.get("id"),
                    "title": scene.get("title"),
                    "description": scene.get(
                        "description"
                    ),
                    "prompt": (
                        "Create a cinematic historical "
                        "reconstruction of "
                        f"{scene.get('description', '')}. "
                        "Use historically inspired "
                        "Indian environments, traditional "
                        "architecture, clothing and "
                        "lighting. Avoid modern cars, "
                        "modern buildings, electric "
                        "streetlights and contemporary "
                        "objects unless the scene "
                        "specifically requires them."
                    ),
                    "transition": (
                        "smooth cinematic dissolve"
                    )
                }
            )

        return {
            "status": "success",
            "chapter_id": chapter_id,
            "chapter_title": chapter.get("title"),
            "scene_count": len(scene_plan),
            "scenes": scene_plan
        }


# Shared scene agent instance
scene_agent = SceneAgent()