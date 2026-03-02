export const getMessage: (msg: string | string[]) => string = (msg: string | string[]) => {
  if (typeof msg === 'string') {
    return msg
  } else if (msg instanceof Array) {
    const rnd = Math.floor(Math.random() * msg.length)
    return msg[rnd]
  } else {
    console.error("something is off on the message dictonary", msg)
    return "?"
  }
}
