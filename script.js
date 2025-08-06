const input = document.getElementById("commandInput");
const output = document.getElementById("output");

const commands = {
  cls: () => output.innerHTML = "",

  help: () => {
    print(`Available commands:
  - cls: Clear the screen
  - help: Show this help menu
  - calc [expression]: Calculate math (supports + - * / times x)
  - timer [seconds]: Start a countdown timer
  - ai [prompt]: Ask the AI a question
  - support [topic]: Get social help (e.g., flirting, confidence)
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

  ai: async (...promptWords) => {
    const prompt = promptWords.join(" ");
    if (!prompt) return print("Usage: ai [prompt]");

    print(`🤖 Thinking...`);

    try {
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
    } catch (err) {
      print("AI request failed.");
      console.error(err);
    }
  },

  clearstorage: () => {
    localStorage.clear();
    print("All saved data cleared.");
  },

  websites: () => {
    print(`🌐 Useful Links:
- https://bypassing-atomic.w3spaces.com/
- https://demonlord-hitboy.vip
- https://darknexusarcade.org`);
  },

  support: (topic) => {
    const lower = topic?.toLowerCase();
    switch (lower) {
      case "flirting":
        print("😏 Be confident, make eye contact, and keep it fun. Compliment something unique.");
        break;
      case "looking":
      case "better":
        print("✨ Dress clean, stay groomed, smile often, and walk with confidence.");
        break;
      case "confidence":
        print("💪 Practice positive self-talk, stand tall, and take small risks to build up.");
        break;
      default:
        print("Usage: support [flirting|looking|better|confidence]");
    }
  },

  newcmd: (name, ...responseWords) => {
    if (!name || responseWords.length === 0) return print("Usage: newcmd [name] [response]");
    const response = responseWords.join(" ");
    commands[name] = () => print(response);
    print(`Custom command "${name}" created.`);
  }
};

function print(text) {
  // Convert URLs in text to clickable links
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const html = text.replace(urlRegex, url => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color:#00ff00; text-decoration: underline;">${url}</a>`;
  });

  output.innerHTML += html + "<br/>";
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
