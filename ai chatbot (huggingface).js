const a = "PUT IN API KEY"; //replace with key
const b = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill";
let c = true;

function d(e) {
  client.queue("text", {
    type: "chat",
    needs_translation: false,
    source_name: "",
    xuid: "",
    message: e,
    filtered_message: ""
  });
}

async function f(g) {
  const h = { inputs: g }, i = { Authorization: `Bearer ${a}`, "Content-Type": "application/json" };
  try {
    const j = await fetch(b, { method: "POST", headers: i, body: JSON.stringify(h) });
    if (!j.ok) throw new Error(`e${j.status}`);
    const k = await j.json();
    return k?.[0]?.generated_text || k?.generated_text || "Chatbot failed";
  } catch (l) {
    console.error("Err:", l);
    return "Error occured.";
  }
}

client.on("text", (m) => {
  const n = m.message;
  if (n === "?toggleAI") {
    c = !c;
    d(`AI is now ${c ? "enabled" : "disabled"}.`); //auto enabled, (can remove)
  }
});

client.on("text", async (o) => {
  const p = o.message, q = o.source_name;
  if (q === clientArgs.username || !p.startsWith("KEYWORD") || !c) return; //replace KEYWORD with desired word (can remove)
  const r = p.slice(7).trim().replace(/[^\w\s?.,!]/g, "");
  const s = await f(r);
  d(s);
});
