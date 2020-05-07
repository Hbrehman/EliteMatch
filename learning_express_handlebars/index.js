const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.set('views', path.join(__dirname, '/views/'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

const u = ['ali', 'wali'];

app.get('/', (req, res) => {
    res.render('home', {
        form_title: 'Input Form',
        data: u
    });
});
app.post('/api/courses', (req, res) => {
    console.log(req.body);
    
})
app.listen(3000);