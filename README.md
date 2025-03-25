# URL Shortener Service

A simple and efficient URL shortening service built using **TypeScript**, **Redis**, and **MongoDB**. The service allows users to shorten long URLs and retrieve the original URL using a short identifier.

---

## Features
- 🔗 Shorten long URLs efficiently.
- ⚡ Fast retrieval using **Redis caching**.
- 🗄️ Persistent storage using **MongoDB**.
- 🕒 TTL (Time-to-Live) indexing to auto-delete expired URLs.
- 🚀 Scalable and optimized for performance.

---

## Tech Stack
- **Node.js** with **Express.js** - Backend framework
- **TypeScript** - Strongly typed JavaScript
- **MongoDB** - Database for persistent URL storage
- **Redis** - Caching layer for fast lookup
- **NanoID** - Unique ID generator for short URLs
- **Axios** - HTTP client for URL validation

---

## Installation & Setup
### Prerequisites
Make sure you have the following installed:
- **Node.js** (v16+ recommended)
- **MongoDB Atllas**
- **Redis**

### 1️⃣ Clone the Repository
```bash
 git clone https://github.com/Manoj936/url-shortner.git
 cd url-shortener
```

### 2️⃣ Install Dependencies
```bash
 npm install
```

### 3️⃣ Environment Variables
Create a `.env` file in the root directory and configure it:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/urlShortener
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
BASE_URL=http://localhost:5000
```

### 4️⃣ Start the Application
#### Development Mode
```bash
 npm run dev
```
#### Production Mode
```bash
 npm run build
 npm start
```

---

## API Endpoints

### ➤ Shorten a URL
**POST** `/get-shortened-url`
#### Request Body:
```json
{
  "longUrl": "https://example.com/some-long-url"
}
```
#### Response:
```json
{
  "shortUrl": "http://localhost:5000/abc123"
}
```

### ➤ Redirect to Original URL
**GET** `/:shortId`
#### Example:
`http://localhost:5000/abc123` → Redirects to `https://example.com/some-long-url`

---

## System Design
### **Data Storage**
#### MongoDB Schema (Persistent Storage)
```ts
const urlSchema = new mongoose.Schema({
  shortId: { type: String, required: true, unique: true },
  longUrl: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  clicks: { type: Number, default: 0 }
});
```
- **Indexes**
  - `shortId`: Fast lookup for redirection.
  - `longUrl`: Prevent duplicate entries.
  - `createdAt`: TTL index to expire URLs after 1 year.

### **Caching Strategy (Redis)**
- Shortened URLs are cached in Redis for **fast retrieval**.
- Redis **reduces database queries** and improves performance.
- Expiration time (`86400` seconds = **1 day**) for cache consistency.

### **Flow of Operations**
1️⃣ User sends a request to shorten a URL.
2️⃣ Service **validates the URL**.
3️⃣ Checks **Redis Cache** → Returns if found.
4️⃣ If not found, checks **MongoDB**.
5️⃣ If still not found, generates **NanoID**, stores in **MongoDB & Redis**.
6️⃣ Returns the shortened URL.
7️⃣ On request to short URL, checks **Redis first**, then **MongoDB** if needed.
8️⃣ Redirects the user to the original URL.

---


## License
This project is licensed under the MIT License.

