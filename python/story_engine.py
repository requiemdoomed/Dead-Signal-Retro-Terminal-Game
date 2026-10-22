"""Testable Python reference for DEAD SIGNAL's clue progression.

The playable game runs in the browser. This standard-library module mirrors
the clue dependencies and the three possible final responses.
"""

FILES = (
    "readme.txt", "shift.log", "memo.txt", "private.note", "transmission.dat",
    "operator.dat", "incident.txt", "clock.txt", "voice.transcript"
)
PHRASE_ENDINGS = {"STILL HERE": "open door", "DISCONNECT": "quiet room", "ERASE": "static memory", "REMEMBER": "the name in the static"}


class StoryEngine:
    """Track recovered files and resolve one of the story's endings."""

    def __init__(self):
        self.read_files = set()
        self.ending = None

    def open_file(self, filename):
        name = filename.strip().lower().lstrip("/")
        if name.startswith("logs/"):
            name = name[5:]
        if name.startswith("private/"):
            name = name[8:]
        if name not in FILES:
            return False, "No such file."
        if name == "transmission.dat" and "shift.log" not in self.read_files:
            return False, "Read shift.log first."
        if name == "private.note" and "memo.txt" not in self.read_files:
            return False, "Read memo.txt first."
        if name == "voice.transcript" and "transmission.dat" not in self.read_files:
            return False, "Recover transmission.dat first."
        self.read_files.add(name)
        return True, f"Opened {name}."

    def decode(self, phrase):
        if "transmission.dat" not in self.read_files:
            return False, "No complete signal fragment loaded."
        if not ({"private.note", "clock.txt"} & self.read_files):
            return False, "The local reference is missing."
        normalized = " ".join(phrase.strip().upper().split())
        if normalized not in PHRASE_ENDINGS:
            return False, "Acknowledgement rejected."
        if normalized == "REMEMBER" and not set(FILES).issubset(self.read_files):
            return False, "Recover every witness file first."
        self.ending = PHRASE_ENDINGS[normalized]
        return True, f"Ending recorded: {self.ending}."

    @property
    def solved(self):
        return self.ending is not None

    def status(self):
        return {"indexed_files": len(self.read_files), "total_files": len(FILES), "solved": self.solved}
