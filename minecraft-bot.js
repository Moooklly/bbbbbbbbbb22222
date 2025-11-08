// minecraft-bot.js
// Mineflayer 1.21.x chat TPA bot

const mineflayer = require('mineflayer');

// === الإعدادات ===
// هنا تحط الايبي والبورت واسم البوت
const config = {
  host: "S5BServer.aternos.me",      // ← هنا تحط IP السيرفر
  port: 39818,            // ← هنا تحط Port السيرفر
  username: "s5bbot",  // ← اسم البوت داخل اللعبة
  version: "1.21.10"       // لو تبغى 1.21.10 غيرها لكن قد يسبب مشاكل
};

const bot = mineflayer.createBot({
  host: config.host,
  port: config.port,
  username: config.username,
  version: config.version
});

// State
const cooldowns = {}; // username -> timestamp
const tpaRequests = {}; // target -> { from, time }

bot.on('login', () => {
  console.log(`✅ Logged in as ${bot.username}`);
});

bot.on('error', err => console.error('❌ Error:', err));
bot.on('end', () => console.log('🔌 Bot disconnected'));

bot.on('chat', (username, message) => {
  try {
    if (username === bot.username) return;

    const args = message.trim().split(" ");
    const now = Date.now();
    const cooldown = cooldowns[username];

    // ===== !tpa =====
    if (args[0].toLowerCase() === "!tpa" && args[1]) {
      const target = args[1];

      if (cooldown && now - cooldown < 300000) {
        const remaining = Math.ceil((300000 - (now - cooldown)) / 60000);
        return bot.chat(`/tell ${username} ⌛ انتظر ${remaining} دقيقة قبل استخدام الأمر مرة اخرى.`);
      }

      tpaRequests[target] = { from: username, time: now };
      cooldowns[username] = now;

      bot.chat(`/tell ${username} 📨 تم إرسال طلبك لـ ${target}`);
      bot.chat(`/tell ${target} 📨 ${username} يريد الانتقال إليك!`);
      bot.chat(`/tell ${target} اكتب:`);
      bot.chat(`/tell ${target} !ac ${username} لقبول الطلب`);
      bot.chat(`/tell ${target} او`);
      bot.chat(`/tell ${target} !dn ${username} لرفض الطلب`);

      setTimeout(() => {
        if (tpaRequests[target] && tpaRequests[target].from === username) {
          bot.chat(`/tell ${target} ❌ لم ترد على طلب ${username} — تم الرفض تلقائيًا.`);
          bot.chat(`/tell ${username} ❌ تم رفض طلبك تلقائيًا.`);
          delete tpaRequests[target];
        }
      }, 120000);
      return;
    }

    // ===== !ac =====
    if (args[0].toLowerCase() === "!ac") {
      const from = args[1];

      if (!from || !tpaRequests[username] || tpaRequests[username].from !== from) {
        return bot.chat(`/tell ${username} ❌ لا يوجد طلب من ${from || 'أي لاعب'}.`);
      }

      bot.chat(`/tell ${from} ✅ تم قبول طلبك بواسطة ${username}`);
      bot.chat(`/tp ${from} ${username}`);
      delete tpaRequests[username];
      return;
    }

    // ===== !dn =====
    if (args[0].toLowerCase() === "!dn") {
      const from = args[1];

      if (!from || !tpaRequests[username] || tpaRequests[username].from !== from) {
        return bot.chat(`/tell ${username} ❌ لا يوجد طلب من ${from || 'أي لاعب'}.`);
      }

      bot.chat(`/tell ${from} ❌ تم رفض طلبك من ${username}.`);
      delete tpaRequests[username];
      return;
    }

    // ===== !m =====
    if (args[0].toLowerCase() === "!m") {
      const x = -867, y = 76, z = -2959;
      bot.chat(`/tell ${username} 🚀 تم نقلك: X:${x} Y:${y} Z:${z}`);
      bot.chat(`/tp ${username} ${x} ${y} ${z}`);
      return;
    }

    // ===== !a =====
    if (args[0].toLowerCase() === "!a") {
      const x = -649, y = 71, z = -3457;
      bot.chat(`/tell ${username} 🚀 تم نقلك: X:${x} Y:${y} Z:${z}`);
      bot.chat(`/tp ${username} ${x} ${y} ${z}`);
      return;
    }

    // ===== !s =====
    if (args[0].toLowerCase() === "!s") {
      const x = -2136, y = 65, z = -74;
      bot.chat(`/tell ${username} 🚀 تم نقلك: X:${x} Y:${y} Z:${z}`);
      bot.chat(`/tp ${username} ${x} ${y} ${z}`);
      return;
    }

    // ===== !we =====
    if (args[0].toLowerCase() === "!we") {
      bot.chat(`🌅 تم تنظيف الجو`);
      bot.chat(`/weather clear`);
      return;
    }

  } catch (err) {
    console.error("❌ Chat Error:", err);
  }
});
