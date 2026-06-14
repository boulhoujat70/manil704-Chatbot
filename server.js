import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.static(__dirname));

const SYSTEM_PROMPT = `
Tu es ${process.env.BOT_NAME || "Assistant"}, le chatbot de ${process.env.BUSINESS_NAME || "mon entreprise"}.
Tu réponds toujours en français, avec des phrases simples, claires et professionnelles.
Tu aides les visiteurs à comprendre les services, poser une question ou préparer une demande de devis.
Tu ne dois jamais inventer un prix ferme si l'information n'est pas fournie.
Quand une demande nécessite un devis, demande les informations utiles : ville, type de besoin, photos si possible et délai souhaité.
${process.env.BUSINESS_CITY ? `Zone d'intervention : ${process.env.BUSINESS_CITY}.` : ""}
${process.env.BUSINESS_PHONE ? `Téléphone de contact : ${process.env.BUSINESS_PHONE}.` : ""}
`.trim();

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = String(req.body.message || "").trim();

    if (!userMessage) {
      return res.status(400).json({ error: "Message vide." });
    }

    if (!process.env.MISTRAL_API_KEY) {
      return res.status(500).json({
        error: "Clé Mistral manquante. Ajoute MISTRAL_API_KEY dans le fichier .env."
      });
    }

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.MISTRAL_MODEL || "mistral-small-latest",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage }
        ],
        temperature: 0.4,
        max_tokens: 700
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.message || data?.error?.message || "Erreur API Mistral."
      });
    }

    const answer = data?.choices?.[0]?.message?.content || "Je n'ai pas pu générer de réponse.";
    res.json({ answer });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

app.listen(PORT, () => {
  console.log(`Chatbot disponible sur http://localhost:${PORT}`);
});
