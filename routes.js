const fs = require('fs')

const reqHandler = (req, res) => {
    const url = req.url
    const method = req.method

// (1.4) handle req
    if (url === '/') {
        res.write
            (`<html>
                <body>
                <form action='/message' method='post'>
                    <input type='text' name='message'>
                    <input type='submit'>
                </form>
                </body>
            </html>`)   
        return res.end() // continue redirect if not end from outside
    }

// (1.5) redirect req
    if (url === '/message' && method === 'POST') {
    // (1.6) parse & get data of incoming req
            const body = []
            req.on('data', chunk => body.push(chunk)) // get data from chunk
            req.on('end', () => {
                const parsedBody = Buffer.concat(body).toString()
                console.log(parsedBody);
                const msg = parsedBody.split('=')[1]
                fs.writeFileSync('message.text', msg)
            }) // work on chunks
            res.writeHeader(302, {'location': '/'})
            return res.end()
    }

// (1.3) send res 
    res.setHeader('content-type', 'text/html') // set singular header
    res.write('<h1> hello from nodejs server </h1>')
    res.end()
}

// (1.7) export module
module.exports = {
    handler : reqHandler,
    someText : 'someText'
}