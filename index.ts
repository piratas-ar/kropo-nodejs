#!/opt/bots/kropo/.nvm/versions/node/v24.11.1/bin/ts-node

// ECMAscript/TypeScript
import { TelegramClient } from "telegramsjs";

const BOT_TOKEN = process.env.KROPO_TOKEN;

if (!BOT_TOKEN) {
  throw new Error("You need to config KROPO_TOKEN with twitter credentials")
}

const client = new TelegramClient(BOT_TOKEN);

const automaticResponses: Array<{ regexp: RegExp, message: string | string[]}> = [
  {
    regexp: /(?<!no )ha(y|bria|bría) que/i,
    message: "che que buena idea, querés organizarla?"
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
    message: "copiar no es robar!"
  },
  {
    regexp: /( |^)bot( |$)/i,
    message: ['a quién le habla?', 'hay unx bot por acá? :O', '¬¬', 'qué estás haciendo, dave?']
  },
  {
    regexp: /(^| )torrent( |$)/i,
    message: ["compartir es bueno", "copiar no es robar", "torrent o patria","si no torrenteamos, la cultura se netflixea", "no descargarías el pan"]
  }
]

const getMessage: (msg: string | string[]) => string = (msg) => {
  if (typeof msg === 'string') {
    return msg
  } else if (msg instanceof Array) {
    const rnd = Math.floor(Math.random() * msg.length)
    return msg[rnd]
  } else {
    console.error("something is off on the message dict", msg)
    return "?"
  }
}

client.on("ready", async ({ user }) => {
  if (user) {
    await user.setCommands([
      {
        command: "/start",
        description: "Starting command",
      },
    ]);
    console.log(`Bot @${user.username} is the ready status!`);
  } else {
    console.log(`Bot was not available`);
  }
});

client.on("chatMember", async (memberEvent) => {
  if (memberEvent.newMember.status !== "member") return;
  const newMember= memberEvent.newMember
  if (!newMember || !newMember.user) {
    console.error(`Unexpected event format`, memberEvent);
    return;
  }
  const name = newMember.user.username ? `@${newMember.user.username}` : `[${newMember.user.firstName} ${newMember.user.lastName || ''}](tg://user?id=${newMember.user.id})`
  client.sendMessage({
    chatId: memberEvent.chat.id,
    parseMode: "Markdown",
    text: `Bienvenide, ${name}!
Soy Kropotkin, une de les cyborgs del Partido Interdimensional Pirata.
Uso pronombres neutros, ¿vos qué pronombres usás?

Te invitamos a leer nuestros [códigos para compartir](https://utopia.partidopirata.com.ar/zines/codigos_para_compartir.html)

Recordamos a todes que este grupo es público, así como su lista de participantes. Cuidemos entre todes qué datos y metadatos compartimos.`,
  })
});

client.on("message", async (eventMessage) => {
  if (!eventMessage.content || !eventMessage.chat) {
    return;
  }

  for (let response of automaticResponses) {
    const res = response.regexp.exec(eventMessage.content)
    if (res) {
      let message = getMessage(response.message);
      for (let i = 1; i < res.length; i++) {
        message = message.replace('$'+i, res[i])
      }
      client.sendMessage({
        chatId: eventMessage.chat.id,
        text: message,
        replyParameters: {
          message_id: eventMessage.id
        }
      })
    }
  }
})

client.getUpdates({
  allowedUpdates: ["chat_member"]
})

client.login()
