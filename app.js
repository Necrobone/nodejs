const http = require('http');

const server = http.createServer((request, response) => {
    console.log(request.url, request.method, request.headers);

    response.setHeader('Content-Type', 'text/html');

    response.write('<html>');
    response.write('<head><title>My First Page</title></head>');
    response.write('<body><h1>Hello from my Node.js Server</h1></body>');
    response.write('</html>');

    response.end();
});

server.listen(3000);
