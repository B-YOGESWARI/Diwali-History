
import json
import re
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
            with open(self.data_file, "r", encoding="utf-8") as file:
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

    @staticmethod
    def _normalize_text(text: str) -> str:
        """Normalize text for case-insensitive word matching."""

        return " ".join(re.findall(r"[a-z0-9]+", text.lower()))

    def search_chapters(
        self,
        keyword: str
    ) -> List[Dict[str, Any]]:
        """
        Search chapter titles, summaries, historical notes,
        traditions, locations, IDs and scene descriptions.
        """

        query = self._normalize_text(keyword)

        if not query:
            return []

        stop_words = {
            "what", "is", "the", "a", "an", "of", "do", "does",
            "why", "how", "when", "where", "who", "are", "was",
            "were", "we", "they", "it", "to", "for", "and",
            "in", "on", "about", "tell", "me", "explain",
            "can", "you", "please"
        }

        query_words = query.split()
        meaningful_words = [
            word for word in query_words if word not in stop_words
        ]

        if not meaningful_words:
            meaningful_words = query_words

        # Expand common terms into related search terms.
        synonyms = {
            "diwali": {"deepavali", "deepawali"},
            "deepavali": {"diwali", "deepawali"},
            "deepawali": {"diwali", "deepavali"},
            "lights": {"light", "lamps", "lamp", "diya", "diyas"},
            "light": {"lights", "lamps", "lamp", "diya", "diyas"},
            "lamp": {"lamps", "light", "lights", "diya", "diyas"},
            "lamps": {"lamp", "light", "lights", "diya", "diyas"},
            "diya": {"diyas", "lamp", "lamps"},
            "diyas": {"diya", "lamp", "lamps"},
            "celebrate": {"celebration", "celebrations", "festival"},
            "celebrating": {"celebration", "celebrations", "festival"},
            "celebration": {"celebrate", "celebrations", "festival"},
            "celebrations": {"celebrate", "celebration", "festival"},
            "festival": {"celebration", "celebrations"},
            "story": {"stories", "tale", "tales"},
            "stories": {"story", "tale", "tales"},
            "prosperity": {"wealth", "lakshmi"},
            "wealth": {"prosperity", "lakshmi"},
            "puja": {"worship", "prayers"},
            "worship": {"puja", "prayers"},
            "returned": {"return", "journey"},
            "return": {"returned", "journey"},
            "ayodhya": {"rama", "ram"},
            "narakasura": {"krishna"},
            "krishna": {"narakasura"},
            "pollution": {"environment", "fireworks", "noise"},
            "environment": {"pollution", "fireworks", "noise"},
            "sikh": {"bandi", "chhor", "chhorh"},
            "jain": {"mahavira", "nirvana"}
        }

        expanded_words = set(meaningful_words)

        for word in meaningful_words:
            expanded_words.update(synonyms.get(word, set()))

        # A broad question about Diwali should return the overview chapters.
        broad_diwali_query = (
            "diwali" in expanded_words
            or "deepavali" in expanded_words
            or "deepawali" in expanded_words
        )

        results = []

        for chapter in self.get_all_chapters():
            cinematic = chapter.get("cinematic") or {}

            scene_text = " ".join(
                " ".join([
                    str(scene.get("title", "")),
                    str(scene.get("description", "")),
                    str(scene.get("historical_note", ""))
                ])
                for scene in cinematic.get("scenes", [])
            )

            searchable_text = self._normalize_text(" ".join([
                str(chapter.get("id", "")),
                str(chapter.get("title", "")),
                str(chapter.get("category", "")),
                str(chapter.get("tradition", "")),
                str(chapter.get("location", "")),
                str(chapter.get("summary", "")),
                str(chapter.get("historical_note", "")),
                str(cinematic.get("opening", "")),
                scene_text
            ]))

            text_words = set(searchable_text.split())
            title_words = set(
                self._normalize_text(
                    str(chapter.get("title", ""))
                ).split()
            )

            score = 0

            # Exact phrase matches receive a strong boost.
            if query in searchable_text:
                score += 10

            # Match query terms and their related words.
            matched_words = expanded_words.intersection(text_words)
            score += len(matched_words) * 2

            # Prefer chapters whose titles match the query.
            score += (
                len(expanded_words.intersection(title_words)) * 4
            )

            # Allow general Diwali questions to return useful chapters.
            if broad_diwali_query and score > 0:
                score += 2

            if score > 0:
                results.append((score, chapter))

        results.sort(
            key=lambda item: (
                -item[0],
                item[1].get("order", 9999)
            )
        )

        return [chapter for _, chapter in results]


# Shared service instance
history_service = HistoryService()
