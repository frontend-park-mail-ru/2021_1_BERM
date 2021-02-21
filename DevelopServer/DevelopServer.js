const http = require('http');
const fs = require('fs')
if (process.argv.length < 4) {
    console.log('Не указаны аргументы командной строки, первый аргумнет - путь к директории с файлами, второй - порт на котором будет открыт сервер');
    process.exit(0);
}

const dirName = process.argv[2];
const port =    process.argv[3];

const mimeMap = new Map([
    ['html', 'text/html'],
    ['htm', 'text/html'],
    ['php', 'text/html'],
    ['css', 'text/css'],
    ['txt', 'text/plain'],
    ['js', 'application/javascript'],
    ['json', 'application/json'],
    ['xml', 'application/xml'],
    ['swf', 'application/x-shockwave-flash'],
    ['flv', 'video/x-flv'],
    ['png' , 'image/png'],
    ['jpe', 'image/jpeg'],
    ['jpeg', 'image/jpeg'],
    ['jpg', 'image/jpeg'],
    ['gif','image/gif'],
    ['bmp', 'image/bmp'],
    ['ico', 'image/vnd.microsoft.icon'],
    ['tiff', 'image/tiff'],
    ['tif', 'image/tiff'],
    ['svg', 'image/svg+xml'],
    ['svgz', 'image/svg+xml']
]);

const errorMsg = '<!DOCTYPE html>\n' +
    '<html>\n' +
    '<head>\n' +
    '\t<title>Заголовок</title>\n' +
    '</head>\n' +
    '<body>\n' +
    '\t<div>\n' +
    '\t\t<p>"HUETA =("</p>\n' +
    '\t</div>\n' +
    '</body>\n' +
    '</html>';

const server = http.createServer();

server.on('request', (req, res) =>{
    let extend = req.url.split('.')[1];
    let filePath = dirName;
    if (req.url[0] === '/'){
        if (req.url.length === 1){
            filePath = filePath + '/' +'index.html';
            extend = 'html';
        }
        else {
            filePath = filePath + req.url;
        }
    }
    else{
        filePath = filePath + '/' + req.url;
    }
    fs.readFile(filePath, ((err, data) => {
        if (err == null){
            const testExtend = mimeMap.get(extend);
            res.writeHead(200, {'Content-Type' : mimeMap.get(extend)});
            res.end(data);
        }
        else{
            res.writeHead(400,  {'Content-Type' : 'text/html'});
            res.end(errorMsg);
        }
    }));

});

server.listen(port, () => console.log('Server work!'));

