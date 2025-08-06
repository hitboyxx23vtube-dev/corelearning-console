const input = document.getElementById("commandInput");
const output = document.getElementById("output");

let customCommands = {};

window.addEventListener("load", () => {
  const saved = localStorage.getItem("terminal-history");
  if (saved) output.innerHTML = saved;

  const savedCmds = localStorage.getItem("customCommands");
  if (savedCmds) customCommands = JSON.parse(savedCmds);
  input.focus();
});

window.addEventListener("click", () => input.focus());

input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    const command = input.value.trim();
    if (command) runCommand(command);
    input.value = "";
  }
});

function runCommand(command) {
  print(`C:/> ${command}`);
  saveHistory();

  const [baseCmd, ...args] = command.split(" ");
  const fullArg = args.join(" ").toLowerCase();

  switch (baseCmd.toLowerCase()) {
    case "cls":
    case "clear":
      clearOutput();
      break;

    case "calculator":
      calculator();
      break;

    case "timer":
      timerPrompt();
      break;

    case "help":
    case "cmds":
      listCommands();
      break;

    case "goto":
      loadPage(args[0]);
      break;

    case "ai":
      geminiAI(fullArg);
      break;

    case "social":
      socialHelp(args[0]);
      break;

    case "newcmd":
      createNewCommand();
      break;

    case "clearstorage":
    case "clearlocal":
      clearLocalStorage();
      break;

    case "websites":
      showWebsites();
      break;

    default:
      if (customCommands[baseCmd]) {
        print(customCommands[baseCmd]);
      } else {
        print(`'${command}' is not recognized.`);
      }
  }

  saveHistory();
}

function print(text) {
  output.innerHTML += text + "\n";
  output.scrollTop = output.scrollHeight;
}

function clearOutput() {
  output.innerHTML = "";
  localStorage.removeItem("terminal-history");
}

function saveHistory() {
  localStorage.setItem("terminal-history", output.innerHTML);
  localStorage.setItem("customCommands", JSON.stringify(customCommands));
}

function listCommands() {
  const cmds = [
    "cls / clear - Clear the terminal",
    "clearstorage / clearlocal - Clear all saved progress",
    "calculator - Open calculator prompt",
    "timer - Set a countdown timer",
    "goto {page} - Navigate internal pages",
    "ai {question} - Ask Gemini AI",
    "social {flirt/look-better/compliment} - Social tips",
    "newcmd - Create a custom command",
    "websites - Show useful websites",
    "help / cmds - List all commands"
  ];
  print("📖 CoreLearning Terminal Commands:\n" + cmds.join("\n"));
}

function calculator() {
  const expression = prompt("Enter calculation (e.g. 5 + 3):");
  try {
    const result = eval(expression);
    print(`Result: ${result}`);
  } catch {
    print("Invalid expression.");
  }
}

function timerPrompt() {
  const minutes = parseInt(prompt("Enter time in minutes:"), 10);
  if (isNaN(minutes)) {
    print("Invalid number.");
    return;
  }
  print(`⏳ Timer started for ${minutes} minute(s).`);
  setTimeout(() => print("⏰ Time's up!"), minutes * 60000);
}

function loadPage(page) {
  const pages = {
    home: "🏠 Welcome to CoreLearning Terminal! Use 'goto about', 'goto math', etc.",
    about: "ℹ️ CoreLearning Terminal helps you study interactively through commands.",
    math: "➗ Math Page: Practice problems and math tips (coming soon).",
    science: "🧪 Science Page: Learn about physics, chemistry, and biology.",
  };
  print(pages[page?.toLowerCase()] || `Page '${page}' not found.`);
}

function socialHelp(topic) {
  const tips = {
    flirt: "💬 Flirting Tip: Be kind, confident, and listen carefully.",
    "look-better": "🪞 Tip: Stand tall, dress clean, smile often, stay hydrated.",
    compliment: "😊 Compliment Tip: Be genuine and specific.",
  };
  print(tips[topic?.toLowerCase()] || "Try: flirt, look-better, compliment");
}

function createNewCommand() {
  const name = prompt("Enter new command name:");
  if (!name) return print("Command name is required.");
  const response = prompt("Enter the response for this command:");
  if (!response) return print("Response is required.");
  customCommands[name.toLowerCase()] = response;
  saveHistory();
  print(`✅ Custom command '${name}' added.`);
}

function clearLocalStorage() {
  localStorage.clear();
  clearOutput();
  print("✅ Local storage cleared. Terminal reset.");
}

function showWebsites() {
  const sites = [
    { name: "Bypassing Atomic", url: "https://bypassing-atomic.w3spaces.com/" },
    { name: "Demonlord VIP", url: "https://demonlord.vip" },
    { name: "Dark Nexus Arcade", url: "https://darknexusarcade.org" }
  ];

  print("🌐 Useful Websites:");
  sites.forEach(site => {
    output.innerHTML += `<a href="${site.url}" target="_blank" style="color:#00ff00; text-decoration: underline;">${site.name}</a>\n`;
  });
  output.scrollTop = output.scrollHeight;
}

// Gemini AI integration (test only, key exposed!)

async function geminiAI(promptText) {
  if (!promptText) {
    print("AI: Try something like 'ai explain gravity'");
    return;
  }
  print("🤖 AI is thinking...");

  const apiKey = "AIzaSyCTEJO-_5AtzH50CWRO6p-5vDJ5RbmJ1V0"; // Testing only
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey;

  const body = {
    contents: [
      {
        parts: [{ text: promptText }]
      }
    ]
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (reply) {
      print("AI: " + reply);
    } else {
      print("AI: No response from server.");
    }
  } catch (err) {
    print("AI Error: " + err.message);
  }
}
