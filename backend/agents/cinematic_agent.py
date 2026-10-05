from typing import Any, Dict, List

from backend.services.history_service import history_service


class CinematicAgent:
    """
    Prepares cinematic presentation data for the
    Diwali History experience.

    This agent does not generate the actual video.
    It prepares the chapter, scenes and available
    video information for the frontend/backend.
    """

    def __init__(self):
        self.history_service = history_service

    def get_chapter_cinematic(
        self,
        chapter_id: str
    ) -> Dict[str, Any]:
        """
        Return complete cinematic information
        for one chapter.
        """

        chapter = self.history_service.get_chapter(chapter_id)

        if not chapter:
            return {
                "status": "not_found",
                "chapter_id": chapter_id,
                "message": "Chapter not found."
            }

        cinematic = chapter.get("cinematic", {})

        return {
            "status": "success",
            "chapter_id": chapter.get("id"),
            "chapter_title": chapter.get("title"),
            "category": chapter.get("category"),
            "tradition": chapter.get("tradition"),
            "location": chapter.get("location"),
            "summary": chapter.get("summary"),
            "historical_note": chapter.get("historical_note"),
            "cinematic": {
                "opening": cinematic.get("opening"),
                "video": cinematic.get("video"),
                "scenes": cinematic.get("scenes", [])
            }
        }

    def create_video_plan(
        self,
        chapter_id: str
    ) -> Dict[str, Any]:
        """
        Create a structured plan describing how
        the chapter can be presented cinematically.
        """

        chapter = self.history_service.get_chapter(chapter_id)

        if not chapter:
            return {
                "status": "not_found",
                "chapter_id": chapter_id,
                "message": "Chapter not found."
            }

        cinematic = chapter.get("cinematic", {})
        scenes = cinematic.get("scenes", [])

        scene_plan: List[Dict[str, Any]] = []

        for index, scene in enumerate(scenes, start=1):

            scene_plan.append(
                {
                    "sequence": index,
                    "scene_id": scene.get("id"),
                    "title": scene.get("title"),
                    "description": scene.get("description"),
                    "visual_style": (
                        "cinematic historical reconstruction"
                    ),
                    "transition": (
                        "smooth cinematic transition"
                    )
                }
            )

        return {
            "status": "success",
            "chapter_id": chapter.get("id"),
            "chapter_title": chapter.get("title"),
            "opening": cinematic.get("opening"),
            "video": cinematic.get("video"),
            "scene_count": len(scene_plan),
            "scenes": scene_plan
        }

    def get_full_cinematic_journey(self) -> Dict[str, Any]:
        """
        Build the complete cinematic journey
        across all chapters.
        """

        chapters = self.history_service.get_all_chapters()

        journey: List[Dict[str, Any]] = []

        for chapter in chapters:

            cinematic = chapter.get("cinematic", {})

            journey.append(
                {
                    "order": chapter.get("order"),
                    "chapter_id": chapter.get("id"),
                    "title": chapter.get("title"),
                    "category": chapter.get("category"),
                    "tradition": chapter.get("tradition"),
                    "location": chapter.get("location"),
                    "opening": cinematic.get("opening"),
                    "video": cinematic.get("video"),
                    "scene_count": len(
                        cinematic.get("scenes", [])
                    )
                }
            )

        return {
            "status": "success",
            "title": "Diwali History — Cinematic Journey",
            "chapter_count": len(journey),
            "chapters": journey
        }


# Shared cinematic agent instance
cinematic_agent = CinematicAgent()