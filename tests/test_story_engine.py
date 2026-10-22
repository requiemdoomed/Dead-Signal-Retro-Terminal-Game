import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "python"))
from story_engine import FILES, StoryEngine


class StoryEngineTests(unittest.TestCase):
    def prepare_finale(self):
        game = StoryEngine()
        for filename in ("shift.log", "memo.txt", "private.note", "transmission.dat"):
            self.assertTrue(game.open_file(filename)[0])
        return game

    def test_unknown_file_is_rejected(self):
        self.assertFalse(StoryEngine().open_file("missing.txt")[0])

    def test_clues_must_be_read_in_order(self):
        game = StoryEngine()
        ok, message = game.open_file("transmission.dat")
        self.assertFalse(ok)
        self.assertIn("shift.log", message)
        self.assertTrue(game.open_file("shift.log")[0])
        self.assertTrue(game.open_file("transmission.dat")[0])

    def test_private_note_requires_memo(self):
        game = StoryEngine()
        self.assertFalse(game.open_file("private.note")[0])
        game.open_file("memo.txt")
        self.assertTrue(game.open_file("private.note")[0])

    def test_voice_transcript_requires_transmission(self):
        game = StoryEngine()
        self.assertFalse(game.open_file("voice.transcript")[0])
        game.open_file("shift.log")
        game.open_file("transmission.dat")
        self.assertTrue(game.open_file("voice.transcript")[0])

    def test_wrong_phrase_does_not_solve(self):
        game = self.prepare_finale()
        self.assertFalse(game.decode("NOT IT")[0])
        self.assertFalse(game.solved)

    def test_all_three_endings_are_available(self):
        for phrase, expected in (("STILL HERE", "open door"), ("DISCONNECT", "quiet room"), ("ERASE", "static memory")):
            game = self.prepare_finale()
            ok, _ = game.decode(f"  {phrase.lower()} ")
            self.assertTrue(ok)
            self.assertEqual(game.ending, expected)
            self.assertTrue(game.solved)

    def test_secret_ending_requires_every_witness_file(self):
        game = self.prepare_finale()
        ok, message = game.decode("REMEMBER")
        self.assertFalse(ok)
        self.assertIn("every witness file", message)
        for filename in FILES:
            game.open_file(filename)
        ok, _ = game.decode("REMEMBER")
        self.assertTrue(ok)
        self.assertEqual(game.ending, "the name in the static")

    def test_status_counts_discovered_files(self):
        game = StoryEngine()
        game.open_file("readme.txt")
        self.assertEqual(game.status(), {"indexed_files": 1, "total_files": 9, "solved": False})


if __name__ == "__main__":
    unittest.main()
