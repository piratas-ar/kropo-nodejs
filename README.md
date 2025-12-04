# Kropotkin telegram cyborg PIP

Migrado a nodejs desde el original en ruby en [0xacab](https://0xacab.org/pip/kropotkin-telegram) (ahora privado)

Inspiradx en [kropotkin](https://github.com/fauno/kropotkin) Telegram Bot

Tiene un unit file para correrlo como servicio de systemd si se lo aloja en /opt/bots/kropo

Está pensando correr con el usuario "kropotkin" (con home en /opt/bots/kropo) y hay que modificar el unit.service para sumar la clave de bot

Usa ts-node sobre nvm y la versión v24.11.1 de nodejs
