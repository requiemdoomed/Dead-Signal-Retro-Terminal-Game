(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const intro = $("#intro");
  const game = $("#game");
  const terminal = $("#terminal-content");
  const input = $("#command-input");
  const form = $("#command-form");
  const footer = $("#footer-left");
  const toast = $("#toast");
  const progressCount = $("#progress-count");
  const progressFill = $("#progress-fill");
  const missionText = $("#mission-text");
  const ambienceButton = $("#ambience-button");
  const audio = $("#ambience-audio");
  let soundscape = null;

  const SAVE_KEY = "dead-signal-session-v2";
  const requiredFiles = ["shift.log", "memo.txt", "private.note", "transmission.dat"];
  const state = {
    booted: false, flags: {}, found: [], solved: false, ending: "",
    history: [], historyCursor: 0, ambience: false
  };

  const files = {
    "readme.txt": [
      "HIMALAYAN SIGNAL ARCHIVE — TERMINAL 07",
      "SITE: BHAKTAPUR RELAY ANNEX / NEPAL",
      "ARCHIVE DATE: 17 OCTOBER 1998",
      "SYSTEMS ENGINEER: SWAYAM SHAKYA",
      "If this terminal has started printing by itself, do not call the outside line.",
      "There is no outside line. There has not been one since the storm.",
      "Find the last transmission. Read every witness statement before replying."
    ],
    "shift.log": [
      "03:12 — Operator Savyata Ghimire signed in.",
      "03:16 — Engineer Swayam Shakya reported a clock drift of 72 hours.",
      "03:19 — Incoming carrier detected on a disconnected line.",
      "03:20 — Technician Nisha Tamang confirmed the copper line was cut by hand.",
      "03:22 — Savyata disabled external routing.",
      "03:24 — Terminal clock jumped forward exactly 72 hours.",
      "03:25 — Operator account logged out. No exit record found.",
      "",
      "[HANDWRITTEN ADDENDUM — S. GHIMIRE]",
      "If the log is still here, then the loop is still here.",
      "Swayam, if you are reading this: the terminal remembers what the room forgets."
    ],
    "memo.txt": [
      "TO: SWAYAM SHAKYA, SYSTEMS ENGINEERING",
      "FROM: SAVYATA GHIMIRE, NIGHT OPERATOR",
      "SUBJECT: THE REPEATED SIGNAL",
      "It is not coming from outside the building.",
      "Every reply appears in the log three days before we send it.",
      "Nisha cut the line in front of me. The carrier continued.",
      "I hear a second voice under the static. It says my name, then yours.",
      "If the system asks for a phrase, check the clock with no hands."
    ],
    "private.note": [
      "SAVYATA'S HANDWRITING — DO NOT INDEX",
      "The clock has no hands, but it still tells the truth.",
      "The phrase is: STILL HERE",
      "I have not sent the message. I only received it.",
      "Swayam says the machine cannot predict a message it has not received.",
      "Then why did I hear his voice tomorrow?",
      "",
      "If somebody finds this, don't mistake silence for absence."
    ],
    "transmission.dat": [
      "SIGNAL FRAGMENT // RECOVERED",
      "FROM: TERM-07 (LOCAL)",
      "TO: TERM-07 (LOCAL)",
      "TIMESTAMP: 03:25 / 17 OCT 1998",
      "ROUTE: NONE — PHYSICAL LINE ABSENT",
      "",
      "SWAYAM: If this is a recording, identify yourself.",
      "SAVYATA: You already know who I am. You built the receiver.",
      "SWAYAM: I built a clock correction routine. Nothing more.",
      "SAVYATA: Then explain why it is correcting the clock to three days from now.",
      "[FRAGMENT LOST]",
      "The terminal is repeating its final minute until someone acknowledges it.",
      "Possible replies recovered from the buffer:",
      "  STILL HERE  — acknowledge the signal",
      "  DISCONNECT  — sever the carrier",
      "  ERASE       — wipe the fragment and its trail",
      "  REMEMBER    — requires every witness file"
    ],
    "operator.dat": [
      "PERSONNEL RECORD // SAVYATA GHIMIRE",
      "Role: Night operator, Himalayan Signal Archive",
      "Joined: 04 APRIL 1993",
      "Status: UNRESOLVED / EXIT NOT RECORDED",
      "Emergency contact: Aarav Karki — archive supervisor",
      "Supervisor note: Savyata never left a shift unfinished.",
      "Personal note recovered from her desk: 'If it goes quiet, listen twice.'",
      "A second note, written in another hand: 'I am sorry I did not believe you. — Swayam'"
    ],
    "incident.txt": [
      "INCIDENT REPORT 17-10 / BHAKTAPUR RELAY ANNEX",
      "Filed by: Nisha Tamang, night technician",
      "03:20 — External copper line cut and sealed. No secondary route found.",
      "03:24 — Receiver logged a local carrier with a timestamp three days ahead.",
      "03:25 — Terminal printed a conversation between Savyata Ghimire and Swayam Shakya.",
      "The conversation had not yet happened. Swayam denied speaking into the system.",
      "Aarav Karki ordered the room locked until morning. Morning never appeared on the clock.",
      "",
      "CONCLUSION: unresolved. Do not answer a voice that knows your next sentence."
    ],
    "clock.txt": [
      "OBJECT: WALL CLOCK, EAST ROOM",
      "The hands were removed after the clock began moving backward.",
      "The back plate is scratched with four words:",
      "NOT GONE. NOT YET.",
      "",
      "Under the plate, in tiny letters: STILL HERE.",
      "A final line is visible only at an angle: REMEMBER THE PERSON, NOT THE SIGNAL."
    ],
    "voice.transcript": [
      "VOICE TRANSCRIPT // RECOVERY QUALITY: POOR",
      "[static; a distant rainstorm]",
      "SAVYATA: Swayam, if this reaches you, don't answer the first time.",
      "[pause: 00:04]",
      "SAVYATA: The first answer is what the machine expects. It has copied us from the logs.",
      "[two overlapping voices; one appears to be Swayam]",
      "SAVYATA: Don't send it outside. There is no outside line.",
      "SAVYATA: Send it back to me. I'm still on the other side of this minute.",
      "[whisper, unidentified]: Swayam Shakya, you have not built this machine yet.",
      "[recording ends at 03:25:59]"
    ]
  };

  function print(text, type = "") {
    const p = document.createElement("p");
    p.className = `line ${type}`.trim();
    p.textContent = text || " ";
    terminal.appendChild(p);
    terminal.scrollTop = terminal.scrollHeight;
  }
  function printLines(lines, type = "") { lines.forEach((line) => print(line, type)); }
  function echo(command) { print(`guest@term-07:~$ ${command}`, "dim"); }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2400);
  }

  function updateProgress() {
    const foundCount = requiredFiles.filter((name) => state.found.includes(name)).length;
    const complete = state.solved ? 5 : foundCount;
    if (progressCount) progressCount.textContent = `${String(complete).padStart(2, "0")} / 05`;
    if (progressFill) progressFill.style.width = `${Math.min(100, complete / 5 * 100)}%`;
    if (missionText) {
      missionText.textContent = state.solved ? "Signal acknowledged. The archive is finally quiet." :
        !state.flags.readShift ? "Find out what happened to the night operator." :
        !state.flags.readMemo ? "Follow the notes left behind by Savyata Ghimire." :
        !state.flags.learnedPhrase ? "Find the private note and its missing phrase." :
        !state.flags.readTransmission ? "Recover the final transmission from the logs." :
        "Choose what to do with the signal.";
    }
  }

  function save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        flags: state.flags, found: state.found, solved: state.solved,
        ending: state.ending, history: state.history.slice(-40)
      }));
      footer.textContent = state.solved ? "MYSTERY RESOLVED" : "SESSION SAVED LOCALLY";
    } catch (_error) {
      footer.textContent = "SESSION ACTIVE · SAVE UNAVAILABLE";
    }
    updateProgress();
  }

  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (!saved || typeof saved !== "object") return;
      state.flags = saved.flags && typeof saved.flags === "object" ? saved.flags : {};
      state.found = Array.isArray(saved.found) ? saved.found.filter((x) => typeof x === "string") : [];
      state.solved = Boolean(saved.solved);
      state.ending = typeof saved.ending === "string" ? saved.ending : "";
      state.history = Array.isArray(saved.history) ? saved.history.filter((x) => typeof x === "string").slice(-40) : [];
      state.historyCursor = state.history.length;
    } catch (_error) {
      try { localStorage.removeItem(SAVE_KEY); } catch (_ignored) {}
    }
    updateProgress();
  }

  function showDirectory(path = "/") {
    const p = path.toLowerCase();
    print(`DIRECTORY ${p.toUpperCase()}`, "system");
    if (p === "/logs" || p === "logs") {
      ["shift.log", "incident.txt", "transmission.dat", "voice.transcript"].forEach((name) =>
        print(`  ${state.found.includes(name) ? "●" : "▧"} ${name}`, state.found.includes(name) ? "success" : ""));
    } else if (p === "/private" || p === "private") {
      ["private.note", "clock.txt", "operator.dat"].forEach((name) =>
        print(`  ${state.found.includes(name) ? "●" : "▧"} ${name}`, state.found.includes(name) ? "success" : ""));
    } else {
      ["readme.txt", "memo.txt", "/logs", "/private", "operator.dat"].forEach((name) => print(`  ${name}`));
    }
  }

  function openFile(name) {
    let key = name.toLowerCase().trim().replace(/^\/+/, "");
    key = key.replace(/^logs\//, "").replace(/^private\//, "");
    if (!files[key]) {
      print(`OPEN FAILED: ${name}`, "error");
      print("No such file. Try ls, ls /logs, or ls /private.", "dim");
      return;
    }
    if (key === "transmission.dat" && !state.flags.readShift) {
      print("ACCESS DENIED: the signal has no event trail yet.", "warning");
      print("Read shift.log first.", "dim"); return;
    }
    if (key === "private.note" && !state.flags.readMemo) {
      print("ACCESS DENIED: private directory is locked.", "warning");
      print("The memo explains where the note was hidden.", "dim"); return;
    }
    if (key === "voice.transcript" && !state.flags.readTransmission) {
      print("RECORDER LOCKED: no carrier fragment loaded.", "warning");
      print("Recover transmission.dat first.", "dim"); return;
    }
    if (!state.found.includes(key)) state.found.push(key);
    soundEffect("file");
    print(`OPENING ${key.toUpperCase()}`, "system");
    printLines(files[key], key === "transmission.dat" ? "success" : "");
    if (key === "shift.log") state.flags.readShift = true;
    if (key === "memo.txt") state.flags.readMemo = true;
    if (key === "private.note" || key === "clock.txt") state.flags.learnedPhrase = true;
    if (key === "transmission.dat") state.flags.readTransmission = true;
    if (key === "voice.transcript") state.flags.heardSavyata = true;
    if (key === "incident.txt") state.flags.readIncident = true;
    save();
  }

  function help() {
    print("AVAILABLE COMMANDS", "system");
    print("  help                  show this command list");
    print("  ls [directory]        browse the archive");
    print("  open <file>           read a recovered file");
    print("  scan                  scan the local carrier");
    print("  status                inspect system and case progress");
    print("  decode <phrase>       choose how to answer the signal");
    print("  hint                  get a small nudge");
    print("  history               review recent commands");
    print("  clear                 clear terminal output");
    print("  reset                 restart and erase local progress");
    print("");
    print("Try: ls /logs · open shift.log · open memo.txt", "dim");
  }

  function status() {
    print("SYSTEM DIAGNOSTICS", "system");
    print(`Carrier: ${state.solved ? "CLOSED" : state.flags.readTransmission ? "ACTIVE / LOCAL LOOP" : "UNCLASSIFIED"}`);
    print(`Files recovered: ${state.found.length} / ${Object.keys(files).length}`);
    print(`Operator record: ${state.found.includes("operator.dat") ? "READ" : "UNOPENED"}`);
    print(`Voice transcript: ${state.flags.heardSavyata ? "RECOVERED" : "NOT RECOVERED"}`);
    print(`Acknowledgement: ${state.solved ? state.ending.toUpperCase() : "PENDING"}`);
    print(`Clock: ${state.solved ? "03:26:00" : "03:25:00"}`);
    if (state.solved) print("Archive stabilized. No active carrier detected.", "success");
  }

  function scan() {
    soundEffect("scan");
    print("SCANNING LOCAL CARRIER...", "system");
    print("  external route ........ NONE", "dim");
    print("  local receiver ........ ACTIVE", "warning");
    print("  source signature ...... TERM-07", "dim");
    if (state.flags.readTransmission) {
      print("  pattern ............... REPEATING / 72-HOUR OFFSET", "warning");
      print("  confidence ............ HIGH", "success");
    } else {
      print("  pattern ............... INCOMPLETE", "dim");
      print("  next step ............. inspect shift.log", "warning");
    }
    if (state.flags.heardSavyata) print("  voice match ........... SAVYATA GHIMIRE / 98.4%", "success");
  }

  function finishEnding(kind) {
    soundEffect("ending");
    state.solved = true;
    state.ending = kind;
    print("", "");
    if (kind === "still here") {
      print("ACKNOWLEDGEMENT ACCEPTED: STILL HERE", "success");
      print("03:25:59 — the carrier steadies.", "system");
      print("03:26:00 — local time moves forward.", "system");
      print("", "");
      print("SAVYATA: Swayam? You came back.", "story-quote");
      print("SAVYATA: I couldn't stop the loop from inside. I could only leave a way back.", "story-quote");
      print("SAVYATA: You heard me this time. Let the system sleep now.", "story-quote");
      print("", "");
      print("ENDING 01 / THE OPEN DOOR", "chapter-mark");
      print("You answered the message. The signal fades, but Savyata's last words remain in the log.", "ending");
    } else if (kind === "disconnect") {
      print("CARRIER TERMINATION ACCEPTED: DISCONNECT", "warning");
      print("03:25:59 — the line snaps shut.", "system");
      print("03:26:00 — the terminal clock resumes.", "system");
      print("", "");
      print("The room goes quiet all at once. No reply. No final message.", "story-quote");
      print("You stopped the loop, but you will never know whether Savyata heard you.", "story-quote");
      print("", "");
      print("ENDING 02 / THE QUIET ROOM", "chapter-mark");
      print("The signal is gone. The question it carried is not.", "ending warning-ending");
    } else if (kind === "remember") {
      print("WITNESS CHAIN VERIFIED: REMEMBER", "success");
      print("03:25:59 — the archive stops predicting and starts recording.", "system");
      print("A new file appears: witness.final", "system");
      print("", "");
      print("SAVYATA: It was never asking you to fix the machine.", "story-quote");
      print("SAVYATA: It was asking you to remember that I was here.", "story-quote");
      print("SWAYAM: I remember.", "story-quote");
      print("[For the first time, the reply is recorded after it is spoken.]", "dim");
      print("", "");
      print("ENDING 04 / THE NAME IN THE STATIC", "chapter-mark");
      print("By preserving every witness file, you break the loop's script. Whether Savyata returned or the archive learned to imitate hope remains unknown.", "ending");
    } else {
      print("ARCHIVE PURGE ACCEPTED: ERASE", "warning");
      print("Deleting fragment index...", "dim");
      print("Deleting local carrier trace...", "dim");
      print("Deleting final transmission...", "dim");
      print("", "");
      print("One line remains on the screen, burned into the phosphor:", "story-quote");
      print("NOT GONE. NOT YET.", "story-quote");
      print("", "");
      print("ENDING 03 / STATIC MEMORY", "chapter-mark");
      print("You erased the evidence. Somewhere, the clock is still waiting.", "ending cold-ending");
    }
    footer.textContent = "MYSTERY RESOLVED";
    save();
    showToast("Ending recorded: " + (kind === "still here" ? "The Open Door" : kind === "disconnect" ? "The Quiet Room" : kind === "remember" ? "The Name in the Static" : "Static Memory"));
  }

  function decode(value) {
    if (!state.flags.readTransmission) {
      print("DECODER WAITING: no complete signal fragment loaded.", "warning");
      print("Recover transmission.dat before replying.", "dim"); return;
    }
    if (!state.flags.learnedPhrase) {
      print("PHRASE REJECTED: local reference missing.", "warning");
      print("Find private.note or inspect clock.txt.", "dim"); return;
    }
    const phrase = value.trim().replace(/^["']|["']$/g, "").toUpperCase().replace(/\s+/g, " ");
    if (phrase === "STILL HERE") return finishEnding("still here");
    if (phrase === "DISCONNECT") return finishEnding("disconnect");
    if (phrase === "ERASE") return finishEnding("erase");
    if (phrase === "REMEMBER") {
      const allFilesFound = Object.keys(files).every((name) => state.found.includes(name));
      if (!allFilesFound) {
        print("WITNESS CHAIN INCOMPLETE: the archive cannot distinguish memory from imitation.", "warning");
        print("Recover every file in the root, /logs, and /private directories first.", "dim");
        return;
      }
      return finishEnding("remember");
    }
    print("NO ACKNOWLEDGEMENT. The carrier repeats.", "error");
    print("Available responses: STILL HERE, DISCONNECT, ERASE, or REMEMBER (all files required).", "dim");
  }

  function hint() {
    if (!state.flags.readShift) print("Hint: the shift log records the last normal events. Start with open shift.log.", "warning");
    else if (!state.flags.readMemo) print("Hint: Savyata left a note for the night shift. Try open memo.txt.", "warning");
    else if (!state.flags.learnedPhrase) print("Hint: the memo points to a private note. Try ls /private, then open private.note.", "warning");
    else if (!state.flags.readTransmission) print("Hint: the transmission fragment is in /logs. Try open transmission.dat.", "warning");
    else if (!state.flags.heardSavyata) print("Hint: there is a voice transcript in /logs. Read it before deciding what to do.", "warning");
    else if (!state.found.length || Object.keys(files).some((name) => !state.found.includes(name))) print("Optional path: recover every file. The full witness chain may reveal a fourth response: REMEMBER.", "warning");
    else print("You know enough to answer. STILL HERE, DISCONNECT, ERASE, or the hidden response REMEMBER.", "warning");
  }

  function runCommand(raw) {
    const command = raw.trim();
    if (!command) return;
    echo(command);
    soundEffect("command");
    state.history.push(command);
    state.history = state.history.slice(-40);
    state.historyCursor = state.history.length;
    save();
    const [verbRaw, ...rest] = command.split(/\s+/);
    const verb = verbRaw.toLowerCase();
    const argument = rest.join(" ").trim();
    if (verb === "help" || verb === "?") return help();
    if (verb === "ls" || verb === "dir") return showDirectory(argument || "/");
    if (["open", "cat", "read"].includes(verb)) {
      if (!argument) return print("Usage: open <filename>", "warning");
      return openFile(argument);
    }
    if (verb === "status") return status();
    if (verb === "scan") return scan();
    if (verb === "decode" || verb === "reply") {
      if (!argument) return print("Usage: decode <phrase>", "warning");
      return decode(argument);
    }
    if (verb === "hint") return hint();
    if (verb === "clear" || verb === "cls") { terminal.replaceChildren(); print("TERMINAL BUFFER CLEARED.", "dim"); return; }
    if (verb === "history") {
      print("RECENT COMMANDS", "system");
      state.history.slice(-12).forEach((item, index) => print(`${String(index + 1).padStart(2, "0")}  ${item}`));
      return;
    }
    if (verb === "reset") return resetSession(true);
    soundEffect("error");
    print(`COMMAND NOT FOUND: ${verbRaw}`, "error");
    print("Type help to see what this terminal understands.", "dim");
  }

  function boot() {
    if (!soundscape) startSoundscape();
    soundEffect("boot");
    intro.classList.add("hidden");
    game.classList.remove("hidden");
    state.booted = true;
    input.disabled = false;
    form.querySelector("button").disabled = false;
    input.focus();
    footer.textContent = "TERMINAL READY";
    print("DEAD SIGNAL // HIMALAYAN ARCHIVE TERMINAL 07", "success");
    print("BOOT SEQUENCE COMPLETE.", "success");
    print("A local carrier is active, but the line is physically disconnected.", "warning");
    print("Savyata Ghimire's final shift is missing from the archive.", "dim");
    print("Type help to begin. Use hint if the trail goes cold.", "dim");
    if (state.solved) print(`RESTORED SESSION: ending "${state.ending}" already recorded.`, "success");
    else if (state.found.length) print(`RESTORED SESSION: ${state.found.length} file(s) previously recovered.`, "system");
    save();
  }

  function resetSession(fromCommand = false) {
    if (!window.confirm("Reset this mystery? Saved progress in this browser will be erased.")) return;
    try { localStorage.removeItem(SAVE_KEY); localStorage.removeItem("dead-signal-session-v1"); } catch (_error) {}
    state.flags = {}; state.found = []; state.solved = false; state.ending = "";
    state.history = []; state.historyCursor = 0;
    terminal.replaceChildren();
    print("SESSION RESET.", "system");
    print("The archive has returned to its original state.", "dim");
    updateProgress();
    if (!state.booted || !fromCommand) {
      game.classList.add("hidden"); intro.classList.remove("hidden");
      input.disabled = true; form.querySelector("button").disabled = true;
      footer.textContent = "WAITING FOR BOOT";
    } else { help(); save(); input.focus(); }
    showToast("Local session reset.");
  }

  // All music and effects are generated locally with Web Audio. No external assets,
  // downloads, or network requests are needed. Audio starts after a user gesture.
  function startSoundscape() {
    if (soundscape) return true;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return false;
    try {
      const context = new AudioContextClass();
      const master = context.createGain();
      master.gain.value = 0.48;
      master.connect(context.destination);

      const lowpass = context.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.value = 620;
      lowpass.Q.value = 0.7;
      const padGain = context.createGain();
      padGain.gain.value = 0.14;
      lowpass.connect(padGain);
      padGain.connect(master);

      // Deep, slightly detuned drones form a slow, uneasy analog-horror bed.
      const droneNodes = [];
      [[54.8, -7], [82.4, 5], [110, -11], [164.8, 8]].forEach(([frequency, detune], index) => {
        const osc = context.createOscillator();
        const gain = context.createGain();
        osc.type = index === 2 ? "triangle" : "sine";
        osc.frequency.value = frequency;
        osc.detune.value = detune;
        gain.gain.value = index === 0 ? 0.48 : index === 1 ? 0.19 : index === 2 ? 0.09 : 0.035;
        osc.connect(gain); gain.connect(lowpass); osc.start();
        droneNodes.push(osc, gain);
      });

      // Very quiet filtered noise gives the feeling of old tape and distant radio air.
      const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.45;
      const noise = context.createBufferSource();
      noise.buffer = buffer; noise.loop = true;
      const noiseFilter = context.createBiquadFilter();
      noiseFilter.type = "bandpass"; noiseFilter.frequency.value = 430; noiseFilter.Q.value = 0.55;
      const noiseGain = context.createGain(); noiseGain.gain.value = 0.012;
      noise.connect(noiseFilter); noiseFilter.connect(noiseGain); noiseGain.connect(master); noise.start();

      // Slow, sparse bell notes: deliberately restrained so clues remain readable.
      const scale = [110, 164.81, 196, 220, 293.66, 329.63, 392];
      const playBell = (frequency, when = context.currentTime, strength = 0.045) => {
        const osc = context.createOscillator();
        const gain = context.createGain();
        const bellFilter = context.createBiquadFilter();
        bellFilter.type = "lowpass"; bellFilter.frequency.value = 1800;
        osc.type = "sine"; osc.frequency.setValueAtTime(frequency, when);
        gain.gain.setValueAtTime(0.0001, when);
        gain.gain.exponentialRampToValueAtTime(strength, when + 0.07);
        gain.gain.exponentialRampToValueAtTime(0.0001, when + 3.2);
        osc.connect(bellFilter); bellFilter.connect(gain); gain.connect(master);
        osc.start(when); osc.stop(when + 3.25);
      };
      const melodyTimer = window.setInterval(() => {
        if (!soundscape || context.state !== "running") return;
        if (Math.random() < 0.72) {
          const note = scale[Math.floor(Math.random() * scale.length)];
          playBell(note * (Math.random() < 0.16 ? 2 : 1), context.currentTime + 0.05, 0.018 + Math.random() * 0.018);
        }
      }, 4700);
      soundscape = { context, master, droneNodes, noise, melodyTimer, playBell };
      context.resume().catch(() => {});
      state.ambience = true;
      if (ambienceButton) {
        ambienceButton.textContent = "♫ SOUND: ON";
        ambienceButton.setAttribute("aria-pressed", "true");
      }
      return true;
    } catch (_error) {
      return false;
    }
  }

  function stopSoundscape() {
    if (!soundscape) return;
    const current = soundscape;
    soundscape = null;
    window.clearInterval(current.melodyTimer);
    try { current.context.close(); } catch (_error) {}
    state.ambience = false;
    if (ambienceButton) {
      ambienceButton.textContent = "♫ SOUND: OFF";
      ambienceButton.setAttribute("aria-pressed", "false");
    }
  }

  function soundEffect(kind = "tick") {
    if (!soundscape || !soundscape.context || soundscape.context.state !== "running") return;
    const { context, master } = soundscape;
    const now = context.currentTime;
    const tone = (frequency, start, duration, volume, type = "sine") => {
      const osc = context.createOscillator();
      const gain = context.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      osc.connect(gain); gain.connect(master);
      osc.start(start); osc.stop(start + duration + 0.03);
    };
    if (kind === "command") tone(780, now, 0.035, 0.012, "square");
    else if (kind === "file") { tone(392, now, 0.22, 0.028); tone(587.33, now + 0.09, 0.38, 0.022); }
    else if (kind === "scan") { tone(330, now, 0.32, 0.022, "triangle"); tone(493.88, now + 0.14, 0.48, 0.018); }
    else if (kind === "error") { tone(146.83, now, 0.24, 0.035, "triangle"); tone(138.59, now + 0.08, 0.3, 0.022, "triangle"); }
    else if (kind === "ending") { tone(220, now, 1.5, 0.04); tone(293.66, now + 0.13, 1.8, 0.032); tone(329.63, now + 0.3, 2.1, 0.025); }
    else if (kind === "boot") { tone(110, now, 0.65, 0.05, "triangle"); tone(164.81, now + 0.12, 0.9, 0.035); tone(220, now + 0.32, 1.2, 0.024); }
  }

  function toggleAmbience() {
    if (soundscape) {
      stopSoundscape();
      showToast("Music and sound effects off.");
      return;
    }
    if (startSoundscape()) {
      soundEffect("boot");
      showToast("Mysterious soundtrack and terminal sounds on.");
    } else {
      showToast("Audio is not available in this browser.");
    }
  }

  $("#boot-button").addEventListener("click", boot);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input.value;
    input.value = "";
    runCommand(value);
    input.focus();
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") { input.value = ""; return; }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (state.history.length) {
        state.historyCursor = Math.max(0, state.historyCursor - 1);
        input.value = state.history[state.historyCursor] || "";
      }
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      state.historyCursor = Math.min(state.history.length, state.historyCursor + 1);
      input.value = state.history[state.historyCursor] || "";
    }
  });
  $("#reset-button").addEventListener("click", () => resetSession(false));
  if (ambienceButton) ambienceButton.addEventListener("click", toggleAmbience);
  document.querySelectorAll("[data-command]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!state.booted) boot();
      runCommand(button.dataset.command);
      document.querySelectorAll("[data-command]").forEach((item) => item.classList.toggle("active", item === button));
      input.focus();
    });
  });

  load();
  if (state.solved || state.found.length || state.history.length) footer.textContent = "SAVED SESSION AVAILABLE";
})();