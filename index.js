const express = require('express')
const bodyparser = require('body-parser')
const path = require('path')
const app = express()

var Publishable_Key = 'pk_test_51LYUUIHR5sDrkTrN6rqN36y3AjWHpW9vChrrYghkYezESyIVkYN3hIn85UKRfuS0VP0cCIoEauVhtVwVEK64bQfW00HmFRhDRd'
var Secret_Key = 'sk_test_51LYUUIHR5sDrkTrNo4OFUMRb0dPb0j6u0fEGTolgyWqHI01GT37HNYnAofimOAMOh8CccNrDltKEKVqqGWSG5m3700U6307bzZ'

const stripe = require('stripe')(Secret_Key)

const port = process.env.PORT || 4000

app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

// View Engine Setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', function(req, res){
	res.render('Home', {
	key: Publishable_Key
	})
})

app.post('/payment', function(req, res){

	// Moreover you can take more details from user
	// like Address, Name, etc from form
	stripe.customers.create({
		email: req.body.stripeEmail,
		source: req.body.stripeToken,
		name: 'Gourav Hammad',
		address: {
			line1: 'TC 9/4 Old MES colony',
			postal_code: '452331',
			city: 'Indore',
			state: 'Madhya Pradesh',
			country: 'India',
		}
	})
	.then((customer) => {

		return stripe.charges.create({
			amount: 2500*100,	 // Charing Rs 25
			description: 'Web Development Product',
			currency: 'INR',
			customer: customer.id
		});
	})
	.then((charge) => {
		res.send("Success") // If no error occurs
	})
	.catch((err) => {
		res.send(err)	 // If some error occurs
	});
})

app.listen(port, function(error){
	if(error) throw error
	console.log("Server created Successfully")
})

