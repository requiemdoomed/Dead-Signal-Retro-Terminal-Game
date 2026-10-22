# DEAD SIGNAL

**A retro-terminal mystery by Swayam Shakya**  
GitHub: [RippedPaper](https://github.com/requiemdoomed)

> **New to games or coding? Start with “Quick Start” below.** You do not need Python, a code editor, a GitHub account, or an internet connection to play the browser game.

## About the game

DEAD SIGNAL is a fictional, browser-playable mystery set at the Himalayan Signal Archive in Bhaktapur, Nepal, on 17 October 1998. Terminal 07 receives messages even though its physical outside line has been cut. Night operator **Savyata Ghimire** has vanished from the shift record. Systems engineer **Swayam Shakya**, technician **Nisha Tamang**, and supervisor **Aarav Karki** appear in the evidence.

Your job is to investigate the archive, read files, compare timestamps, and decide how to answer the signal. The story intentionally leaves one question open: is the terminal carrying a message through time, or reconstructing people from the records they left behind?

## Complete Beginner Walkthrough

### 1. Start the Game

Open `index.html` in your browser and enter these commands one at a time:

```text
help
```
Displays the available commands.

```text
status
```
Checks the terminal's current status.

```text
ls
```
Lists the available story files.

### 2. Investigate the Files

Open each file using `open <filename>`. Start with these commands:

```text
open readme.txt
open shift.log
open memo.txt
open private.note
open transmission.dat
open operator.dat
open incident.txt
open clock.txt
open voice.transcript
```

Read each file carefully. Look for unusual timestamps, references to Savyata Ghimire, and clues about the disconnected terminal.

### 3. Investigate Further

After reading the files, enter:

```text
scan
```
Investigates the mysterious signal.

```text
history
```
Reviews your command history.

```text
hint
```
Requests a hint if you need help progressing.

Use `status` again if you want to check the terminal.

### 4. Unlock the Four Endings

**Warning: The following commands reveal all the endings.** Enter each command separately to explore its outcome. Use `reset` between attempts if you want to restart the story.

| Command | Ending |
|---|---|
| `decode STILL HERE` | The Open Door |
| `decode DISCONNECT` | The Quiet Room |
| `decode ERASE` | Static Memory |
| `decode REMEMBER` | The Name in the Static — Secret Ending |

For the secret ending, discover and open all nine story files before entering `decode REMEMBER`.

### 5. Useful Commands

| Command | Purpose |
|---|---|
| `help` | Show available commands |
| `ls` | List story files |
| `open <filename>` | Read a file |
| `scan` | Investigate the signal |
| `status` | Check terminal status |
| `decode <phrase>` | Submit a phrase |
| `hint` | Get a hint |
| `history` | Review command history |
| `clear` | Clear the terminal display |
| `reset` | Restart the game |

To unlock **The Name in the Static**, you must recover **all nine files**. Use `ls`, `ls /logs`, and `ls /private`, then open every file you find. The full list is:

- Main directory: `readme.txt`, `memo.txt`, `operator.dat`
- `/logs`: `shift.log`, `incident.txt`, `transmission.dat`, `voice.transcript`
- `/private`: `private.note`, `clock.txt`

Some files are locked until you have read earlier clues. If `REMEMBER` is rejected, read the message from the terminal, find the missing file or clue, and try again. You can choose a different ending by using **Reset Session** or typing `reset`, then playing again. The reset removes the game's saved progress for the current browser profile.

## What Can You Learn from DEAD SIGNAL?

DEAD SIGNAL is more than an interactive mystery. It is an experience built around curiosity, critical thinking, and the unsettling relationship between technology and human memory.

By playing the game, you can explore:

- **Critical Thinking:** Examine conflicting evidence, question assumptions, and develop your own explanation for the mysterious signal.
- **Pattern Recognition:** Look for recurring timestamps, hidden messages, and connections between seemingly unrelated files.
- **Decision-Making:** Discover how different responses to the signal lead to different outcomes.
- **Computer Science:** Experience a fictional terminal interface inspired by command-line systems and interactive software.
- **Storytelling and Interpretation:** Consider whether the terminal is communicating across time or reconstructing a missing person from archived information.
- **Atmospheric Game Design:** Experience how sound, visual design, pacing, and incomplete information can create suspense.

### The Bigger Question

**Can a machine preserve a person's presence, or does it only preserve the information they left behind?**

DEAD SIGNAL leaves that question open to interpretation. There is no need to accept a single explanation immediately. Investigate the evidence, explore the different endings, and decide what you believe happened.

**Read carefully. Question the signal. Decide what to believe.**
