const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();


app.set('view engine','ejs');

app.set('views','views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorcontroller = require('./controller/404');

app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname,'public')));

app.use('/admin',adminRoutes);
app.use(shopRoutes);

app.use(errorcontroller.geterror);


app.listen(3000);
 