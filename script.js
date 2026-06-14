const MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions";
const MISTRAL_MODEL = "mistral-small-latest";

const apiModal = document.getElementById("apiModal");
const apiKeyInput = document.getElementById("apiKeyInput");
const saveApiKeyButton = document.getElementById("saveApiKeyButton");
const changeKeyButton = document.getElementById("changeKeyButton");
const statusText = document.getElementById("status");

const form = document.getElementById("chatForm");
const input = document.getElementById("messageInput");
const messages = document.getElementById("messages");
const sendButton = document.getElementById("sendButton");

let apiKey = sessionStorage.getItem("MISTRAL_API_KEY") || "";

const conversation = [
  {
    role: "system",
    content:
      "Tu es un chatbot professionnel. Tu réponds toujours en français, avec des phrases simples, claires et utiles. Tu aides l'utilisateur à obtenir une réponse ou à préparer une demande de devis. Si une information manque, pose une question courte."
  }
];

function showApiModal() {
  apiModal.classList.remove("hidden");
  apiKeyInput.focus();
}

function hideApiModal() {
  apiModal.classList.add("hidden");
}

function updateStatus() {
  if (apiKey) {
    statusText.textContent = "Connecté à Mistral";
    statusText.classList.add("connected");
  } else {
    statusText.textContent = "Clé API requise";
    statusText.classList.remove("connected");
  }
}

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = "message " + type;
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  return div;
}

function saveApiKey() {
  const key = apiKeyInput.value.trim();

  if (!key) {
    alert("Veuillez entrer votre clé API Mistral.");
    return;
  }

  apiKey = key;
  sessionStorage.setItem("MISTRAL_API_KEY", apiKey);
  apiKeyInput.value = "";
  updateStatus();
  hideApiModal();

  addMessage("Clé API connectée ✅ Vous pouvez maintenant discuter avec le chatbot.", "bot");
}

saveApiKeyButton.addEventListener("click", saveApiKey);

apiKeyInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    saveApiKey();
  }
});

changeKeyButton.addEventListener("click", () => {
  sessionStorage.removeItem("MISTRAL_API_KEY");
  apiKey = "";
  updateStatus();
  showApiModal();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  if (!apiKey) {
    showApiModal();
    return;
  }

  addMessage(text, "user");
  input.value = "";
  sendButton.disabled = true;

  const loading = addMessage("Réponse en cours...", "bot");

  conversation.push({
    role: "user",
    content: text
  });

  try {
    const response = await fetch(MISTRAL_URL, {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MISTRAL_MODEL,
        messages: conversation,
        temperature: 0.4,
        max_tokens: 700
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data?.message ||
        data?.error?.message ||
        "Erreur API Mistral. Vérifiez votre clé API.";

      loading.textContent = errorMessage;
      return;
    }

    const answer =
      data?.choices?.[0]?.message?.content ||
      "Je n’ai pas pu générer de réponse.";

    loading.textContent = answer;

    conversation.push({
      role: "assistant",
      content: answer
    });

  } catch (error) {
    loading.textContent =
      "Impossible de contacter Mistral depuis le navigateur. Si GitHub Pages bloque la connexion, il faudra utiliser un petit serveur Render ou Vercel.";
  } finally {
    sendButton.disabled = false;
    input.focus();
  }
});

updateStatus();

if (!apiKey) {
  showApiModal();
} else {
  hideApiModal();
  addMessage("Clé API déjà connectée pour cette session ✅", "bot");
}
