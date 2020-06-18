// Dummy crypto-function
export function crypto(salt) {
  const cipher = salt => {
    const textToChars = text => text.split('').map(c => c.charCodeAt(0))
    const byteHex = n => ("0" + Number(n).toString(16)).substr(-2)
    const applySaltToChar = code => textToChars(salt).reduce((a,b) => a ^ b, code)

    return text => text.split('')
        .map(textToChars)
        .map(applySaltToChar)
        .map(byteHex)
        .join('')
}

  const decipher = salt => {
    const textToChars = text => text.split('').map(c => c.charCodeAt(0))
    const applySaltToChar = code => textToChars(salt).reduce((a,b) => a ^ b, code)
    return encoded => encoded.match(/.{1,2}/g)
        .map(hex => parseInt(hex, 16))
        .map(applySaltToChar)
        .map(charCode => String.fromCharCode(charCode))
        .join('')
  }
  
  return [cipher(salt), decipher(salt)]
}

export function genUrl(url, params) {
  return Object.entries(params).reduce((u, [k, p]) => u.concat(`${k}=${p}`), `${url}?`)
}

export async function get(url, params) {
  const fetch = require('node-fetch')
  return await fetch(genUrl(url, params)).then(res => res.json())
}

export async function post(url, body) {
  const fetch = require('node-fetch')
  return await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then(res => res.json())
}

export function getIp(req) {
  return (req.headers['x-forwarded-for'] || '').split(',').pop().trim() || 
          req.connection.remoteAddress || 
          req.socket.remoteAddress || 
          req.connection.socket.remoteAddress || null;
}