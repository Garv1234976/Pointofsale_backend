# Server Installation Guide

This guide will walk you through setting up and running the Node.js backend server.

---

## ✅ **Prerequisites**

Ensure you have the following installed on your system:

### **1. Node.js (v16+)**

Download from: [https://nodejs.org](https://nodejs.org)

### **2. MongoDB**

Install MongoDB locally or use a cloud service like MongoDB Atlas.

### **3. Git (optional)**

For version control: [https://git-scm.com/](https://git-scm.com/)

---

## ✅ **1. Clone or Download the Project**

```bash
git clone https://github.com/Garv1234976/Pointofsale_backend

cd Pointofsale_backend
```

Or download and extract the ZIP, then open the folder.

---

## ✅ **2. Install Dependencies**

Run:

```bash
npm install
```

This installs:

* express
* mongoose
* multer
* bcrypt
* jsonwebtoken
* cookie-parser
* cors
* dotenv

---

## ✅ **3. Create `.env` File**

Inside your project root, create a `.env` file:

```
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/vendorDB
JWT_SECRET=yourSecretKey123
```

✅ Edit values as needed.

---

## ✅ **4. Project Structure**

```
project/
│ server.js
│ .env
│ package.json
│
├── controllers/
├── routes/
├── middleware/
├── models/
├── utils/
└── public/uploads/
```

---

## ✅ **5. Start the Server**

### Development mode (auto-restart with nodemon):

```bash
npm run dev
```

### For development:

```bash
npm start
```

### Or using nodemon (if installed):

```bash
npm run dev
```

---

## ✅ **6. API Base URL**

```
http://localhost:3000
```

---

## ✅ **7. Test the Server**

Open your browser or Postman:

```
GET http://localhost:3000/
```

---

## ✅ **8. Common Routes**

### **Vendor Authentication**

```
POST /api/vendor/createVendorProfile
POST /api/auth/login
POST /api/auth/logout
```

### **Vendor Store**

```
POST /api/vendorStore/createVendorStore
GET  /api/vendorStore/getAllVendorStores
GET  /api/vendorStore/getVendorStoreById/:id
PUT  /api/vendorStore/updateVendorStore/:id
PATCH /api/vendorStore/partialUpdateVendorStore/:id
DELETE /api/vendorStore/deleteVendorStore/:id
```

---

## ✅ **9. Troubleshooting**

### MongoDB not connecting?

* Make sure MongoDB is running
* Check your MONGO_URI

### CORS errors?

Ensure `server.js` contains:

```js
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
```

### Cookies not setting?

* Use `withCredentials: true` in Axios
* Use `cookie-parser` in server

---

## ✅ **10. Next Steps**

* Add more APIs
* Deploy to a hosting provider
* Connect frontend (React/Vite)

---

### ✅ **Server Ready!**

If you need a deployment guide (Render, Railway, Vercel, or AWS), tell me!
