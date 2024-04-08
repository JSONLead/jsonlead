const express = require('express');
const marked  = require('marked');
const path    = require('path');
const fs      = require('fs');
const cors    = require('cors')
const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.static('public'));
app.use('/tools', express.static('dist'));
app.get('/tools/builder', (_, res) => res.sendFile('index.html', { root: 'dist' }));
app.get('/tools/validator', (_, res) => res.sendFile('index.html', { root: 'dist' }));

marked.use({ renderer: {
  table: (header, body) => {
    if (body) body = '<tbody>' + body + '</tbody>';

    return '<table class=table>\n'
         + '<thead class=thead-light>\n'
         + header
         + '</thead>\n'
         + body
         + '</table>\n';
  }
}});


app.get('/*.md', (req, res) => {
  const file = fs.readFileSync(path.join('build', 'md', req.path));
  res.send(`
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>JSONLead.org</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <link rel="stylesheet" href="css/doc.css">
</head>
<body>
  <div>
   ${marked(file.toString())}
  </div>
</body>
</html>
`);
})


app.listen(PORT);
