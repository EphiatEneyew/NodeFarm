const url = require('url');
const http = require('http');
const fs = require('fs');
const replaceTemplate = require('./module/replaceTemplate');

//fs === file system
     //fs is a abuilt-in module to access to functions(require) for reading data and writing data to the file system

//const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
     //console.log(textIn);

//const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;//'this is' + text.in;
//fs.writeFileSync('./txt/output.txt', textOut);
//console.log('File written!');

//Non-blocking,asynchronous way
//fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
  //if (err) return console.log('ERROR!');

  //fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
    //console.log(data2);
     //fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
       //console.log(data3);

        //fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
          //console.log('your file has been written');
        //});
    //});
  //});
//});
//console.log('will read file!');

////////////////////////////////////////////////////
//SERVER

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const temProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const {query, pathname} = url.parse(req.url, true);
 

//Overview page
  if(pathname === '/' || pathname === '/overview') {

    res.writeHead(200, {
      'Content-type': 'text/html'
    });

    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARD%}', cardsHtml)

    res.end(output);

    //product page
  } else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html'
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(temProduct, product);
    res.end(output);

    //API
  } else if (pathname === '/api') {
     res.writeHead(200, {
       'Content-type': 'application/json'
     });
     res.end(data);

     //Not found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',

    });
    res.end('<h1>page not found!<h1>')
  }
  
});

server.listen(8000, '127.0.0.1',() => {
  console.log('Listning to requests on port 8000');
});