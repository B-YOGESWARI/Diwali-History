import json
from pathlib import Path
from typing import Any, Dict, List, Optional


class HistoryService:
    """
    Service responsible for loading and accessing
    the Diwali historical chapter data.
    """

    def __init__(self):
        self.base_dir = Path(__file__).resolve().parent.parent
        self.data_file = self.base_dir / "data" / "history.json"

        self._history_data: Dict[str, Any] = {}
        self._load_history()

    def _load_history(self) -> None:
        """Load history data from history.json."""

        if not self.data_file.exists():
            raise FileNotFoundError(
                f"History data file not found: {self.data_file}"
            )

        try:
            with open(
                self.data_file,
                "r",
                encoding="utf-8"
            ) as file:
                self._history_data = json.load(file)

        except json.JSONDecodeError as error:
            raise ValueError(
                f"Invalid JSON in history file: {error}"
            ) from error

    def reload(self) -> None:
        """Reload the history data from disk."""

        self._load_history()

    def get_all_chapters(self) -> List[Dict[str, Any]]:
        """Return all chapters sorted by order."""

        chapters = self._history_data.get("chapters", [])

        return sorted(
            chapters,
            key=lambda chapter: chapter.get("order", 9999)
        )

    def get_chapter(
        self,
        chapter_id: str
    ) -> Optional[Dict[str, Any]]:
        """Return a chapter by its ID."""

        for chapter in self.get_all_chapters():
            if chapter.get("id") == chapter_id:
                return chapter

        return None

    def get_chapter_scenes(
        self,
        chapter_id: str
    ) -> List[Dict[str, Any]]:
        """Return cinematic scenes for a chapter."""

        chapter = self.get_chapter(chapter_id)

        if not chapter:
            return []

        cinematic = chapter.get("cinematic", {})

        if not cinematic:
            return []

        return cinematic.get("scenes", [])

    def get_cinematic_data(
        self,
        chapter_id: str
    ) -> Optional[Dict[str, Any]]:
        """Return cinematic information for a chapter."""

        chapter = self.get_chapter(chapter_id)

        if not chapter:
            return None

        cinematic = chapter.get("cinematic")

        if not cinematic:
            return None

        return {
            "chapter_id": chapter.get("id"),
            "chapter_title": chapter.get("title"),
            "tradition": chapter.get("tradition"),
            "location": chapter.get("location"),
            "opening": cinematic.get("opening"),
            "video": cinematic.get("video"),
            "scenes": cinematic.get("scenes", [])
        }

    def get_chapter_count(self) -> int:
        """Return the total number of chapters."""

        return len(self.get_all_chapters())

    def search_chapters(
        self,
        keyword: str
    ) -> List[Dict[str, Any]]:
        """Search chapters by title, category, tradition or summary."""

        keyword = keyword.lower().strip()

        if not keyword:
            return []

        results = []

        for chapter in self.get_all_chapters():

            searchable_text = " ".join(
                [
                    str(chapter.get("title", "")),
                    str(chapter.get("category", "")),
                    str(chapter.get("tradition", "")),
                    str(chapter.get("location", "")),
                    str(chapter.get("summary", "")),
                    str(chapter.get("historical_note", ""))
                ]
            ).lower()

            if keyword in searchable_text:
                results.append(chapter)

        return results


# Shared service instance
history_service = HistoryService()