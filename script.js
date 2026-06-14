// Si votre serveur Mistral est hébergé ailleurs, mettez son URL ici.
// Exemple Render : const API_URL = "https://mon-chatbot.onrender.com/api/chat";
const API_URL = "/api/chat";

const form = document.getElementById("chatForm");
const input = document.getElementById("messageInput");
const messages = document.getElementById("messages");
const sendButton = document.getElementById("sendButton");

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = "message " + type;
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  return div;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";
  sendButton.disabled = true;

  const loading = addMessage("Réponse en cours...", "bot");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: text })
    });

    const data = await response.json();
    loading.textContent = data.answer || data.error || "Erreur inconnue.";
  } catch (error) {
    loading.textContent =
      "Le serveur du chatbot n’est pas connecté. Sur GitHub Pages, le HTML s’affiche, mais Node.js ne fonctionne pas. Il faut héberger le serveur sur Render, Railway ou Vercel.";
  } finally {
    sendButton.disabled = false;
    input.focus();
  }
});
