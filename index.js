require("dotenv").config();
const { Telegraf } = require("telegraf");
const axios = require("axios");

const bot = new Telegraf(process.env.BOT_TOKEN);

// Daftar crypto yang didukung
const SUPPORTED_CRYPTOS = {
  bitcoin: "Bitcoin (BTC)",
  ethereum: "Ethereum (ETH)",
  solana: "Solana (SOL)",
  cardano: "Cardano (ADA)",
  ripple: "XRP (Ripple)",
  binancecoin: "Binance Coin (BNB)",
  polkadot: "Polkadot (DOT)",
  avalanche: "Avalanche (AVAX)",
  dogecoin: "Dogecoin (DOGE)",
  shiba_inu: "Shiba Inu (SHIB)",
};

// Fungsi ambil harga crypto
async function getCryptoPrice(cryptoId) {
  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=usd`;
    const response = await axios.get(url);
    if (response.data[cryptoId]) {
      return `💰 Harga ${SUPPORTED_CRYPTOS[cryptoId]}: $${response.data[cryptoId].usd}`;
    }
    return "⚠️ Data tidak ditemukan.";
  } catch (error) {
    return "❌ Gagal mengambil harga!";
  }
}

// Handle command `/start`
bot.start((ctx) =>
  ctx.reply("👋 Selamat datang! Ketik nama crypto (misalnya 'Bitcoin') untuk melihat harganya.")
);

// Handle pesan user
bot.on("text", async (ctx) => {
  const text = ctx.message.text.toLowerCase();
  for (let cryptoId in SUPPORTED_CRYPTOS) {
    if (text.includes(cryptoId)) {
      const price = await getCryptoPrice(cryptoId);
      return ctx.reply(price);
    }
  }
  ctx.reply("⚠️ Crypto tidak dikenali! Coba ketik nama seperti 'Bitcoin' atau 'Ethereum'.");
});

// Jalankan bot
bot.launch();
console.log("🚀 Bot berjalan...");