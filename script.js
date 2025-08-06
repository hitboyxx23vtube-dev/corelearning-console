const input = document.getElementById("commandInput");
const output = document.getElementById("output");

const commands = {
  cls: () => output.innerText = "",

  help: () => {
    print(`Available commands:
  - cls: Clear the screen
  - help: Show this help menu
  - calc [expression]: Calculate math (supports + - * / times x)
  - timer [seconds]: Start a countdown timer
  - goto [page]: Navigate to a page (e.g., 'goto math')
  - ai [prompt]: Ask the AI a question
  - save [key] [value]: Save progress
  - load [key]: Load progress
  - clearstorage: Clear all saved data
  - websites: Show useful links
  - newcmd [name] [response]: Create custom commands`);
  },

  calc: (...args) => {
    const expression = args.join(" ")
      .replace(/times/gi, '*')
      .replace(/x/gi, '*');

    try {
      const result = eval(expression);
      print(`= ${result}`);
    } catch {
      print("Invalid expression.");
    }
  },

  timer: (seconds) => {
    let time = parseInt(seconds);
    if (isNaN(time)) return print("Enter time in seconds.");
    print(`Timer started for ${time} seconds.`);
    const interval = setInterval(() => {
      if (time <= 0) {
        clearInterval(interval);
        print("⏰ Time's up!");
      } else {
        print(`⏳ ${time--}s`);
      }
    }, 1000);
  },

  goto: (page) => {
    if (!page) return print("Usage: goto [page]");
    print(`Loading internal page: ${page}...`);
    // Simulate page navigation or load local content
  },

  ai: async (...promptWords) => {
    const prompt = promptWords.join(" ");
    if (!prompt) return print("Usage: ai [prompt]");

    print(`🤖 Thinking...`);

    const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCTEJO-_5AtzH50CWRO6p-5vDJ5RbmJ1V0", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await res.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    print(aiResponse || "AI did not return a response.");
  },

  save: (key, ...value) => {
    if (!key || value.length === 0) return print("Usage: save [key] [value]");
    localStorage.setItem(key, value.join(" "));
    print(`Saved "${key}"`);
  },

  load: (key) => {
    const value = localStorage.getItem(key);
    if (value === null) return print(`No value found for "${key}"`);
    print(`${key}: ${value}`);
  },

  clearstorage: () => {
    localStorage.clear();
    print("All saved data cleared.");
  },

  websites: () => {
    print(`🌐 Useful Links:
- https://bypassing-atomic.w3spaces.com/
- https://demonlord.vip
- https://darknexusarcade.org`);
  },

  newcmd: (name, ...responseWords) => {
    if (!name || responseWords.length === 0) return print("Usage: newcmd [name] [response]");
    const response = responseWords.join(" ");
    commands[name] = () => print(response);
    print(`Custom command "${name}" created.`);
  }
};

function print(text) {
  output.innerText += text + "\n";
  output.scrollTop = output.scrollHeight;
}

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const raw = input.value.trim();
    input.value = "";

    if (!raw) return;

    print(`C:/> ${raw}`);

    const [command, ...args] = raw.split(" ");
    const cmdFunc = commands[command.toLowerCase()];

    if (cmdFunc) {
      try {
        cmdFunc(...args);
      } catch (err) {
        print("Error running command.");
        console.error(err);
      }
    } else {
      print(`Unknown command: ${command}`);
    }
  }
});
