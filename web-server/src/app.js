const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

console.log(__dirname)
console.log(path.join(__dirname, '../public'))

const app = express()

//define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialPath = path.join(__dirname , '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine','hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialPath)

//Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('',(req,res)=>{
    res.render('index',{
        title: 'Weather App',
        name: 'Bisheshwor Neupane '
    })
})


app.get('/help', (req,res)=>{
    res.render('help',{
        title: 'Help',
        name: 'Bisheshwor Neupane'
    })
})


app.get('/about', (req,res)=>{
    res.render('about' ,{
        title: 'about',
        name:'Bisheshwor Neupane'
    })
})


app.get('/weather', (req,res)=>{
    if(!req.query.address){
        return res.send({
            error: 'You must provide an address'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location})=>{
        if(error){
            return res.send({error})
        }

        forecast(latitude, longitude, (error, forecastData)=>{
            if(error){
                return res.send({error})
            }
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })

    // res.send({
    //     forecast: 'It is sunny',
    //     location: 'Nepal',
    //     address: req.query.address
    // })
})

app.get('/products',(req,res)=>{
    if(!req.query.search){
        return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query.search)
    res.send({
        products : []
    })
})

app.get('*', (req,res)=>{
    res.render('404', {
        title: '404',
        name: 'Bisheshwor Neupane',
        errorMessage: 'Page Not found'
    })    
})

app.get('/help/*', (req,res)=>{
    res.render('404', {
        title: '404',
        name: 'Bisheshwor Neupane',
        errorMessage: 'Page not Found'
    })
})



//app.com
//app.com/index
//app.com/about

app.listen(3000, ()=>{
    console.log('Server is up on the port 3000')
})