/*
"Performerway" 
Pedro Braga  
CIS 272 Capstone Project
Main Purpose: To learn and apply the fundamental concepts of CRUD.
1st commands: npm init, followed by npm i express mongoose ejs 
npm initialize, express is a back end web application for Node.Js. 
will use Moogose (OMD), a libray for MongoDb. 
*/
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
//error  handingling 
const Joi = require('joi');

const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Venuespace = require('./models/venuespace');


mongoose.connect('mongodb://localhost:27017/performer-way', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});//og: 

//making db connection and logic to check if there is an error.
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

//load css
app.use(express.static(path.join(__dirname, '/public')));


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
//__dirname is an environment variable that tells you the absolute path of the directory containing the currently executing file.
app.set('views', path.join(__dirname, 'views'))



app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));



app.get('/', (req, res) => {
    res.render('home')
});


app.get('/venuespaces', catchAsync( async (req, res) => {
    const venuespaces = await Venuespace.find({});
    res.render('venuespaces/index', { venuespaces })
}));


app.get('/venuespaces/new', (req, res) => {
    res.render('venuespaces/new');
})



    

app.post('/venuespaces', async (req,res) => {


    try{
        const venuespace = new Venuespace(req.body.venuespace);
        await venuespace.save();
        res.redirect(`/venuespaces/${venuespace._id}`)
    }

    catch(e){

        next(e);
    }
        res.send(req.body);

 })



    
    
//First Method.
// app.post('/venuespaces', async (req,res) => {
//     const venuespace = new Venuespace(req.body.venuespace);
//    await venuespace.save();
//    res.redirect(`/venuespaces/${venuespace._id}`)
//     // res.send(req.body);
//  })




app.get('/venuespaces/:id', catchAsync( async (req, res,) => {
    const venuespace = await Venuespace.findById(req.params.id)
    res.render('venuespaces/show', { venuespace });
}));


// will get the ID, using the edit route and populate. 
app.get('/venuespaces/:id/edit', catchAsync( async (req, res) => {
    const venuespace = await Venuespace.findById(req.params.id)
    res.render('venuespaces/edit', { venuespace });
}))


app.put('/venuespaces/:id', catchAsync ( async (req, res) => {
    const { id } = req.params;
    const venuespace = await Venuespace.findByIdAndUpdate(id, { ...req.body.venuespace });
    res.redirect(`/venuespaces/${venuespace._id}`)
}));


app.delete('/venuespaces/:id', catchAsync (async (req, res) => {
    const { id } = req.params;
    await Venuespace.findByIdAndDelete(id);
    res.redirect('/venuespaces');
}));

//every single requets and path we going to call this.
app.all('*', (req, res, next) => {
   next(new ExpressError('Page Not Found!', 404))
})


//Catch all Error Handling 
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if( !err.message ) err.message = 'Oops, something went wrong. :( ';
    // error.ejs is called.
    res.status(statusCode).render('error', {err})

})

//TODO find out why when I add venuespace because  its not loading. 



// Using Async JS.
// app.get('/makevenues', async (req, res) => {
//  
//    const venue = new Venuespace({title: 'The Backyward', description: 'A backyward but lots of trees'});
//    await venue.save();
//    res.send(venue);
// });

app.listen(3000, () => {
    console.log('serving on port 3000')
})