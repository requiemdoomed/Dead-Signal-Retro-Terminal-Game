# DEAD SIGNAL

**A retro-terminal mystery by Swayam Shakya**  
GitHub: [RippedPaper](https://github.com/requiemdoomed)

> **New to games or coding? Start with “Quick Start” below.** You do not need Python, a code editor, a GitHub account, or an internet connection to play the browser game.

## About the game

DEAD SIGNAL is a fictional, browser-playable mystery set at the Himalayan Signal Archive in Bhaktapur, Nepal, on 17 October 1998. Terminal 07 receives messages even though its physical outside line has been cut. Night operator **Savyata Ghimire** has vanished from the shift record. Systems engineer **Swayam Shakya**, technician **Nisha Tamang**, and supervisor **Aarav Karki** appear in the evidence.

Your job is to investigate the archive, read files, compare timestamps, and decide how to answer the signal. The story intentionally leaves one question open: is the terminal carrying a message through time, or reconstructing people from the records they left behind?

## Quick start: play in a few minutes

### 1. Download and extract the project OR click on the public website link from this reporsitory

Download the project ZIP from the place where it was shared with you. Extract it before opening the game:

- **Windows:** right-click the ZIP and select **Extract All**.
- **Mac:** double-click the ZIP.
- **iPhone/iPad:** open the **Files** app, find the ZIP in Downloads, and tap it to extract it. A computer is more convenient for editing and testing the full project.

Open the extracted `DEAD_SIGNAL` folder. You should see `index.html`, `styles.css`, `game.js`, `README.md`, and the `python` and `tests` folders.

### 2. Launch the browser game

Double-click **`index.html`**. It should open in a modern browser such as Chrome, Firefox, Safari, or Edge. On the opening screen, press **BOOT TERMINAL**.

The playable game uses HTML, CSS, and JavaScript. It does **not** require Python, a build step, an account, a web server, or an internet connection. Keep `index.html`, `styles.css`, and `game.js` together in the same folder; moving only `index.html` can break the game styling or logic.

If the page does not work as expected:

1. Make sure you extracted the ZIP instead of trying to play inside the ZIP preview.
2. Confirm `index.html`, `styles.css`, and `game.js` are together in the same `DEAD_SIGNAL` folder.
3. Try opening `index.html` in another up-to-date browser.
4. If you opened the project through a code editor, use the editor's **Open Folder** option to open the whole `DEAD_SIGNAL` folder, not just one file.

### 3. Enter commands

After pressing **BOOT TERMINAL**, click the command input near the bottom of the terminal, type a command, and press **Enter**. Commands are short text instructions. For example, type `help` to see what the fictional terminal understands.

Try this beginner route in order:

```text
help
ls
open readme.txt
open shift.log
open memo.txt
ls /private
open private.note
ls /logs
open transmission.dat
hint
```

Read the output after every command. Important details may be hidden in timestamps, names, repeated phrases, and contradictions between files. If a file says access is denied, follow the instruction it gives you and investigate the earlier clue first.

## Commands reference

| Command | What it does |
|---|---|
| `help` | Lists available commands and examples. |
| `ls` | Lists the main archive directory. |
| `ls /logs` | Lists log files and signal recordings. |
| `ls /private` | Lists private notes and records. |
| `open <filename>` | Opens a file and prints its contents. Replace `<filename>` with a real filename; do not type the angle brackets. |
| `scan` | Checks the local carrier and shows what the terminal has learned about the signal. |
| `status` | Shows the terminal state and the number of recovered files. |
| `hint` | Gives a clue about the next step. |
| `history` | Shows recent commands. |
| `clear` | Clears the visible terminal output. It does not delete recovered clues. |
| `reset` | Restarts the investigation and erases this game's saved progress in the current browser profile. |
| `decode <phrase>` | Submits a response to the signal. Replace `<phrase>` with one of the response phrases below. |

You can also use `open logs/shift.log` or `open private/private.note`; the simpler `open shift.log` and `open private.note` forms work too.

### Keyboard and interface tips

- **Enter:** submit the command you typed.
- **Up / Down arrows:** move through your recent command history while using the command input.
- **Esc:** clear the command input (it does not erase your save).
- **Music and sound toggle:** the mysterious background soundtrack starts when you press **BOOT TERMINAL**. It is generated locally in your browser from layered low drones, faint radio-like noise, and occasional distant bell notes. The same toggle turns the music and sound effects on or off.
- **Sound effects:** subtle terminal ticks accompany commands, brighter tones mark recovered files, a scanning tone accompanies `scan`, and a short layered motif plays when an ending is reached. Effects are intentionally quiet so they do not compete with reading.
- **No audio downloads:** the soundtrack is synthesized with the Web Audio API inside `game.js`; no external music files, network requests, or additional packages are required. Sound may be unavailable in older browsers. If the music does not start, press the **SOUND: OFF** toggle after booting and check your device volume.
- **Case progress:** tracks the main investigation milestones. It is not a score, and you do not need to reach 100% to complete a primary ending.
- **Reset Session:** restarts the case and clears saved progress. Use it when you want to replay a different ending.

## Solving the mystery

The main story trail is designed to be discovered in sequence:

1. **`readme.txt`** introduces Terminal 07 and warns that the outside line is gone.
2. **`shift.log`** records Savyata's final shift and the strange 72-hour clock jump.
3. **`memo.txt`** explains that replies appear in the log before anyone sends them.
4. **`private.note`** reveals the phrase **STILL HERE**. The memo must be read before this private note unlocks.
5. **`transmission.dat`** contains the recovered conversation and lists possible responses. Read `shift.log` first to unlock it.
6. The other records add context and raise doubts about whether the voice is really Savyata or a copy made from archived evidence.

Use `hint` at any time if you get stuck. You can also use `scan` and `status` to check what the terminal knows. The game is about reading and interpreting evidence; there is no reflex-based combat or timer you need to beat.

## Endings

Once you have recovered the transmission and learned the phrase from `private.note` or `clock.txt`, choose one of these responses:

```text
decode STILL HERE
decode DISCONNECT
decode ERASE
```

- **The Open Door** (`STILL HERE`): acknowledge the signal and let the final exchange play out.
- **The Quiet Room** (`DISCONNECT`): end the carrier without replying.
- **Static Memory** (`ERASE`): erase the evidence and see what remains.

There is also a hidden fourth ending:

```text
decode REMEMBER
```

To unlock **The Name in the Static**, you must recover **all nine files**. Use `ls`, `ls /logs`, and `ls /private`, then open every file you find. The full list is:

- Main directory: `readme.txt`, `memo.txt`, `operator.dat`
- `/logs`: `shift.log`, `incident.txt`, `transmission.dat`, `voice.transcript`
- `/private`: `private.note`, `clock.txt`

Some files are locked until you have read earlier clues. If `REMEMBER` is rejected, read the message from the terminal, find the missing file or clue, and try again. You can choose a different ending by using **Reset Session** or typing `reset`, then playing again. The reset removes the game's saved progress for the current browser profile.

