const app = require('express')();
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/screenshare', (req, res) => {
    console.log(req.body);
    res.send('ok');
})

app.listen(3445, () => console.log('Listening on 3445'));