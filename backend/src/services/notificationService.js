// OWNER - KARDAM
// PURPOSE - Best-effort Expo push notification sender for new/escalated danger alerts.

async function sendExpoPush({ tokens, title, body, data }) {
  if (!Array.isArray(tokens) || !tokens.length) return { ok: true, sent: 0 };

  const messages = tokens
    .filter((t) => typeof t === "string" && t.length)
    .map((to) => ({
      to,
      sound: "default",
      title,
      body,
      data: data || {},
      priority: "high",
    }));

  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messages),
    });
    const json = await response.json().catch(() => null);
    return { ok: response.ok, sent: messages.length, response: json };
  } catch (err) {
    return { ok: false, sent: 0, error: err?.message || String(err) };
  }
}

module.exports = { sendExpoPush };

