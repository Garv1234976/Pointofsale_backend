require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path')
const cookieParser = require('cookie-parser');

// routes
const vendorRoutes = require('./routes/VendorProfile/routes.VendorProfile');
const vendorStoreRoutes = require('./routes/VendorStore/routes.vendorStore')
const productRoutes = require('./routes/Product/routes.products');

// LoginRoutes
const loginVendor = require('./routes/AuthRoutes/routes.authRoutes')
// CsvParser Routes
const csvParserRoutes = require('./routes/ParserRoutes/routes.productCsvParser')

// ExcelParser Routes 
const excelParserRoutes = require('./routes/ParserRoutes/routes.productsExcelParser')
const app = express();


app.use(cookieParser())
app.use(cors({
    origin: process.env.ALLOW_RIGEON,
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
app.use('/api/vendorStore', vendorStoreRoutes);
app.use('/api/product', productRoutes);

// login page
app.use('/api/vendor', loginVendor)
// Csv parser Mounted
app.use('/api/csvParser',csvParserRoutes);

// Excel Parser Mounted
app.use('/api/excelParser', excelParserRoutes)


// Context api
app.use('/api/infoAbout/', require('./routes/Context/routes.vendorAbout'))

app.listen(process.env.PORT || 3000, () =>{
    console.log(`✅ Server running on http://localhost:3000`)
})