const fs = require('fs');
const http = require('http');
const url = require('url');

const replaceTemplate = require('./modules/replaceTemplate');

////////////////////////////////////
// SERVER
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8");
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8");
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8");
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
    const {query, pathname} = url.parse(req.url, true);

    // Overview page
    if (pathname === "/" || pathname === "/overview") {
        res.writeHead(200, { 'Content-Type': 'text/html' });

        const cardsHtml = dataObj.map(element => replaceTemplate(tempCard, element));
        const finalHtml = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

        res.end(finalHtml);

    } else if (pathname === "/product") {
        res.writeHead(200, { 'Content-Type': 'text/html' });

        const product = dataObj[query.id];
        const finalHtml = replaceTemplate(tempProduct, product);

        res.end(finalHtml);
    } else if (pathname === "/api") {
        res.writeHead(200, { 'Content-type': 'application/json'});
        res.end(data);
    } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('This is the DEFAULT PAGE');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log("Listening to requests on port 8000");
});