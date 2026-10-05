from pathlib import Path
from typing import Any, Dict, Optional


class VideoGenerationService:
    """
    Handles video discovery and video metadata for the
    Diwali History cinematic experience.

    The service is designed so that existing generated
    videos can be used immediately, while additional
    AI-generated scenes can be added later.
    """

    def __init__(self):
        self.project_root = Path(__file__).resolve().parents[2]

        self.video_root = (
            self.project_root
            / "Assets"
            / "videos"
        )

        self.scene_video_root = (
            self.video_root
            / "scenes"
        )

        self.real_video_root = (
            self.video_root
            / "real"
        )

    def _safe_video_path(
        self,
        filename: str
    ) -> Optional[Path]:
        """
        Resolve a video filename safely inside the
        scenes directory.
        """

        if not filename:
            return None

        requested_path = (
            self.scene_video_root / filename
        ).resolve()

        scenes_root = (
            self.scene_video_root.resolve()
        )

        try:
            requested_path.relative_to(
                scenes_root
            )
        except ValueError:
            return None

        return requested_path

    def video_exists(
        self,
        filename: str
    ) -> bool:
        """Check whether a scene video exists."""

        video_path = self._safe_video_path(
            filename
        )

        if not video_path:
            return False

        return video_path.is_file()

    def get_video_info(
        self,
        filename: str
    ) -> Dict[str, Any]:
        """Return information about a scene video."""

        video_path = self._safe_video_path(
            filename
        )

        if not video_path:
            return {
                "exists": False,
                "filename": filename,
                "message": "Invalid video path."
            }

        exists = video_path.is_file()

        if not exists:
            return {
                "exists": False,
                "filename": filename,
                "path": str(video_path),
                "message": "Video file not found."
            }

        file_size = video_path.stat().st_size

        return {
            "exists": True,
            "filename": video_path.name,
            "path": str(video_path),
            "size_bytes": file_size,
            "url": (
                f"/videos/scenes/"
                f"{video_path.name}"
            )
        }

    def get_scene_video(
        self,
        chapter_id: str,
        scene_id: str
    ) -> Dict[str, Any]:
        """
        Find the video associated with a scene.

        The method first checks the expected scene
        filename:

            scene_id.mp4

        It also checks a few common video formats.
        """

        extensions = [
            ".mp4",
            ".webm",
            ".mov"
        ]

        for extension in extensions:

            filename = (
                f"{scene_id}{extension}"
            )

            info = self.get_video_info(
                filename
            )

            if info.get("exists"):
                return {
                    "status": "success",
                    "chapter_id": chapter_id,
                    "scene_id": scene_id,
                    "video": info
                }

        return {
            "status": "not_found",
            "chapter_id": chapter_id,
            "scene_id": scene_id,
            "video": {
                "exists": False,
                "filename": f"{scene_id}.mp4"
            }
        }

    def get_cinematic_video(
        self,
        video_path: str
    ) -> Dict[str, Any]:
        """
        Resolve a cinematic video path stored in
        history.json.

        Example:

        /videos/scenes/diwali-rama-story-40sec.mp4
        """

        if not video_path:
            return {
                "status": "not_found",
                "video": None
            }

        filename = Path(video_path).name

        info = self.get_video_info(
            filename
        )

        if not info.get("exists"):
            return {
                "status": "not_found",
                "video": info
            }

        return {
            "status": "success",
            "video": info
        }

    def list_scene_videos(self) -> list:
        """
        Return all video files currently available
        inside Assets/videos/scenes.
        """

        if not self.scene_video_root.exists():
            return []

        videos = []

        supported_extensions = {
            ".mp4",
            ".webm",
            ".mov"
        }

        for file in sorted(
            self.scene_video_root.iterdir()
        ):

            if (
                file.is_file()
                and file.suffix.lower()
                in supported_extensions
            ):
                videos.append(
                    {
                        "filename": file.name,
                        "url": (
                            f"/videos/scenes/"
                            f"{file.name}"
                        ),
                        "size_bytes": file.stat().st_size
                    }
                )

        return videos

    def list_real_videos(self) -> list:
        """
        Return videos stored inside the real footage
        directory.
        """

        if not self.real_video_root.exists():
            return []

        videos = []

        supported_extensions = {
            ".mp4",
            ".webm",
            ".mov"
        }

        for file in sorted(
            self.real_video_root.iterdir()
        ):

            if (
                file.is_file()
                and file.suffix.lower()
                in supported_extensions
            ):
                videos.append(
                    {
                        "filename": file.name,
                        "url": (
                            f"/videos/real/"
                            f"{file.name}"
                        ),
                        "size_bytes": file.stat().st_size
                    }
                )

        return videos

    def get_available_videos(
        self
    ) -> Dict[str, Any]:
        """Return all currently available videos."""

        scene_videos = (
            self.list_scene_videos()
        )

        real_videos = (
            self.list_real_videos()
        )

        return {
            "status": "success",
            "scene_videos": scene_videos,
            "real_videos": real_videos,
            "scene_video_count": len(
                scene_videos
            ),
            "real_video_count": len(
                real_videos
            )
        }


# Shared service instance
video_generation_service = (
    VideoGenerationService()
)