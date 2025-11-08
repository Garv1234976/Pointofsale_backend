require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path')
const cookieParser = require('cookie-parser');

// routes
const vendorRoutes = require('./routes/routes.VendorProfile');
const vendorStoreRoutes = require('./routes/routes.vendorStore')
const app = express();


app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));


// server upload imges

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')))


// connect db
mongoose
.connect(process.env.MONGODB_URI)
.then(() => console.log('Mongodb Connected'))
.catch((err) => console.log('faild db connection', err.message) );

app.use('/api/vendor', vendorRoutes);
app.use('/api/vendorStore', vendorStoreRoutes)

app.listen(process.env.PORT || 3000, () =>{
    console.log(`✅ Server running on http://localhost:3000`)
})