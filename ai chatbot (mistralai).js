const fetch = require("node-fetch");// add to top of file



// start AI
const k = "replace-with-key"; //replace with your api key
const u = "https://api.mistral.ai/v1/chat/completions";
let l = true;
let r = 0;
const c = 3000;

function s(m) {
  const n = Date.now();
  if (n - r < c) return console.log("CD active:", m);
  r = n;
  const z = Math.floor(Math.random() * 9) + 1;
  const q = `§${z} ${m}`;
  client.queue("text", {
    type: "chat",
    needs_translation: false,
    source_name: "",
    xuid: "",
    platform_chat_id: "",
    message: q,
    filtered_message: ""
  });
}

async function f(m) {
  const d = {
    model: "mistral-tiny", // can change model but tiny is default
    messages: [{ role: "user", content: m }]
  };
  const h = {
    Authorization: `Bearer ${k}`,
    "Content-Type": "application/json"
  };
  try {
    const e = await fetch(u, {
      method: "POST",
      headers: h,
      body: JSON.stringify(d)
    });
    console.log("Code:", e.status);
    if (!e.ok) throw new Error(`Fail ${e.status}`);
    const j = await e.json();
    console.log("Resp:", JSON.stringify(j, null, 2));
    return j.choices?.[0]?.message?.content || "No response.";
  } catch (x) {
    console.error("ERR", x);
    return "ERROR";
  }
}

client.on("text", (p) => {
  const m = p.message;
  if (m === "?toggleAI") {
    l = !l;
    s(`AI is now ${l ? "enabled" : "disabled"}.`); // you can remove this if you want, ai is auto enabled when joining
  }
});

client.on("text", async (p) => {
  const m = p.message, t = p.source_name;
  if (t === clientArgs.username) return;
  if (!m.startsWith("KEYWORD")) return; //replace keyword with your word
  if (!l) return console.log("AI off");
  const b = m.slice("KEYWORD".length).trim().replace(/[^\w\s?.,!]/g, ""); //replace keyword with your word
  console.log(`To bot (${t}):`, b);
  const o = await f(b);
  console.log("Bot:", o);
  s(o);
});
