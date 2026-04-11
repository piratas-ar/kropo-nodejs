#!/opt/bots/kropo/.nvm/versions/node/v24.11.1/bin/ts-node
import { getMessage } from './lib';

// ECMAscript/TypeScript
import TelegramBot from "node-telegram-bot-api";

const BOT_TOKEN = process.env.KROPO_TOKEN;

if (!BOT_TOKEN) {
  throw new Error("You need to config KROPO_TOKEN with telegram credentials")
}

let bot: TelegramBot;

const sanitize = (text: string) => {
  return text.replace(/[\W_]/, ' ')
}

const automaticResponses: Array<{ regexp: RegExp, message: string | string[]}> = [
  {
    regexp: /(?<!no )ha(y|bria|bría) que(?!.+\?)/i,
    message: "che que buena idea, ¿querés organizarla?"
  },
  {
    regexp: /:[c(]/i,
    message: [ "te mando un abrazo :(", "te mando un abrazo :c" ]
  },
  {
    regexp: /windows/i,
    message: "eso en linux/GNU no pasa xD"
  },
  {
    regexp: /( |^)gat(it)?[oiaex]s?( |$)/i,
    message: "LXS GATITXS SON LO MEJOR"
  },
  {
    regexp: /( |^)(yuta|polic[ií]a|rati)( |$)/i,
    message: ["muerte a la $2", "never yuta"]
  },
  {
    regexp: /( |^)copi(a|ar?)( |$)/i,
    message: "¡copiar no es robar!"
  },
  {
    regexp: /( |^)bot( |$)/i,
    message: ['¿a quién le habla?', '¿hay unx bot por acá? :O', '¬¬', '¿qué estás haciendo, dave?']
  },
  {
    regexp: /(^| )Software Libre( |$)/i,
    message: ["¡Ningún Software es libre hasta que todo Software sea libre!"]
  },
  {
    regexp: /(^| )https:\/\/www.instagram.com\S+\/( |$)/i,
    message: ["Yo estaba acostumbrade a un poco de porro cada tanto pero instagram es fentanilo..."]
  },
  {
    regexp: /(^| )([Aa]rgentin[oae]|[Ll]at[ií]n[oa]|[Ss]udam[ée]rica|[Ss]udam[ée]rican[aeo])( |$)/i,
    message: ["¡Cuanto menos yanqui y europeo, mejor!"]
  },
  {
    regexp: /(^| )[Qq]uiero ser pir[áa]t[aeo]( |$)/i,
    message: ["En el fondo, ya lo sos. <3"]
  },
  {
    regexp: /(^| )Tengo que trabajar( |$)/i,
    message: ["¡Quiero estar haciendo cosas lindas todo el dia! ¿Quién mierda inventó trabajar?"]
  },
    {
    regexp: /(^| )torrent( |$)/i,
    message: ["compartir es bueno", "copiar no es robar", "torrent o patria","si no torrenteamos, la cultura se netflixea", "no descargarías el pan"]
  }
]

const tgInit = async () => {
  try {
    await bot.setMyCommands([
      {
        command: "/start",
        description: "Starting command",
      },
    ]);
    const me = await bot.getMe();
    console.log(`Bot @${me.username} is the ready status!`);
  } catch (e) {
    console.error("Error setting commands:", e);
  }
}

const newMember = async (msg: TelegramBot.Message) => {
  if (!msg.new_chat_members || msg.new_chat_members.length === 0) return;
  
  const newMember = msg.new_chat_members[0];
  if (!newMember) return;

  const { id, username, first_name, last_name } = newMember;

  const name = username ? `@${username.replace('_', '\\_')}` : `[${sanitize(first_name)} ${sanitize(last_name || '')}](tg://user?id=${id})`
  const text = `Bienvenide, ${name}\\!
Soy Kropotkin, une de les cyborgs del Partido Interdimensional Pirata\\.
Uso pronombres neutros, ¿vos qué pronombres usás?

Te invitamos a leer nuestros [códigos para compartir](https://utopia.partidopirata.com.ar/zines/codigos_para_compartir.html)

Recordamos a todes que este grupo es público, así como su lista de participantes\\. Cuidemos entre todes qué datos y metadatos compartimos\\.`
  
  try {
    // Send typing action
    await bot.sendChatAction(msg.chat.id, 'typing');
    
    // Wait for 3 seconds before sending the message
    setTimeout(async () => {
      try {
        await bot.sendMessage(msg.chat.id, text, {
          parse_mode: "MarkdownV2"
        });
      } catch (e) {
        console.error('error intentando saludar a un usuario', e, text, newMember);
      }
    }, 3000);
  } catch (e) {
    console.error('error intentando saludar a un usuario', e, text, newMember)
  }
}

const answerMessage = async (msg: TelegramBot.Message) => {
  if (!msg.text || !msg.chat || msg.from?.username === 'kropotkine_bot') {
    return;
  }

  for (let response of automaticResponses) {
    const res = response.regexp.exec(msg.text)
    if (res) {
      let message = getMessage(response.message);
      for (let i = 1; i < res.length; i++) {
        message = message.replace('$'+i, res[i])
      }
      try {
        // Send typing action
        await bot.sendChatAction(msg.chat.id, 'typing');
        
        // Wait for 3 seconds before sending the message
        setTimeout(async () => {
          try {
            await bot.sendMessage(msg.chat.id, message, {
              parse_mode: "HTML",
              reply_to_message_id: msg.message_id
            });
          } catch (e) {
            console.error('error intentando mandar un mensaje automático', e, message, msg.chat);
          }
        }, 3000);
      } catch (e) {
        console.error('error intentando mandar un mensaje automático', e, message, msg.chat)
      }
    }
  }
}

const start = () => {
  try {
    // Node-telegram-bot-api can use polling or webhook
    // Using polling for simplicity (same as previous behavior)
    bot = new TelegramBot(BOT_TOKEN, { polling: true });

    bot.on("polling_error", (err) => {
      console.error("Telegram polling error:", err);
    });

    bot.on("message", (msg) => {
      // Check if it's a new member event
      if (msg.new_chat_members && msg.new_chat_members.length > 0) {
        newMember(msg);
      } else {
        // Handle regular messages
        answerMessage(msg);
      }
    });

    // Initial setup
    tgInit();
    
    console.log("Bot started successfully!");
  } catch (e) {
    console.error(e, 'restarting in 60 seconds')
    setTimeout(start, 60 * 1000)
  }
}

// Only run if not in test environment
if (process.env.NODE_ENV !== 'test') {
  start()
}
