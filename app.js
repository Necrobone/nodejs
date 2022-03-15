const http = require('http');

const server = http.createServer((request, response) => {
    const url = request.url;

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

    response.setHeader('Content-Type', 'text/html');

    response.write('<html>');
    response.write('<head><title>My First Page</title></head>');
    response.write('<body><h1>Hello from my Node.js Server</h1></body>');
    response.write('</html>');

    response.end();
});

server.listen(3000);
