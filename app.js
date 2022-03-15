const http = require('http');
const fs = require('fs');

const server = http.createServer((request, response) => {
    const url = request.url;
    const method = request.method;

    if (url === '/') {
        response.write('<html>');
        response.write('<head><title>Enter Message</title></head>');
        response.write(
            '<body>' +
                '<form action="/message" method="POST">' +
                    '<input type="text" name="message"/>' +
                    '<button type="submit">Send</button>' +
                '</form>' +
            '</body>'
        );
        response.write('</html>');

        return response.end();
    }

    if (url === '/message' && method === 'POST') {
        const body = [];

        request.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk);
        });

        request.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            console.log(parsedBody);

            const message = parsedBody.split('=')[1];
            fs.writeFileSync('message.text', message);
        })

        response.writeHead(302, {
            location: '/',
        });

        return response.end();
    }

    response.setHeader('Content-Type', 'text/html');

    response.write('<html>');
    response.write('<head><title>My First Page</title></head>');
    response.write('<body><h1>Hello from my Node.js Server</h1></body>');
    response.write('</html>');

    response.end();
});

server.listen(3000);
