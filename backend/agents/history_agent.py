from typing import Any, Dict, List

from backend.services.history_service import history_service


class HistoryAgent:
    """
    Agent responsible for preparing structured
    historical and cultural information for the
    Diwali cinematic experience.
    """

    def __init__(self):
        self.service = history_service

    def get_overview(self) -> Dict[str, Any]:
        """Return a complete overview of the Diwali history project."""

        chapters = self.service.get_all_chapters()

        return {
            "title": "Diwali History",
            "description": (
                "A cinematic journey through the diverse "
                "stories, traditions and contemporary "
                "celebrations associated with Diwali."
            ),
            "chapter_count": len(chapters),
            "chapters": [
                {
                    "id": chapter.get("id"),
                    "order": chapter.get("order"),
                    "title": chapter.get("title"),
                    "category": chapter.get("category"),
                    "tradition": chapter.get("tradition"),
                    "location": chapter.get("location"),
                    "summary": chapter.get("summary")
                }
                for chapter in chapters
            ]
        }

    def get_chapter(
        self,
        chapter_id: str
    ) -> Dict[str, Any]:

        chapter = self.service.get_chapter(chapter_id)

        if not chapter:
            return {
                "status": "not_found",
                "chapter_id": chapter_id,
                "message": "Chapter not found."
            }

        return {
            "status": "success",
            "chapter": chapter
        }

    def get_scenes(
        self,
        chapter_id: str
    ) -> Dict[str, Any]:

        chapter = self.service.get_chapter(chapter_id)

        if not chapter:
            return {
                "status": "not_found",
                "chapter_id": chapter_id,
                "scenes": []
            }

        scenes = self.service.get_chapter_scenes(chapter_id)

        return {
            "status": "success",
            "chapter_id": chapter_id,
            "chapter_title": chapter.get("title"),
            "scene_count": len(scenes),
            "scenes": scenes
        }

    def search(
        self,
        keyword: str
    ) -> Dict[str, Any]:

        results = self.service.search_chapters(keyword)

        return {
            "status": "success",
            "keyword": keyword,
            "count": len(results),
            "results": results
        }


# Shared agent instance
history_agent = HistoryAgent()