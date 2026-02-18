# 🚀 All Send  
### High-Performance Peer-to-Peer File Sharing Platform

![License](https://img.shields.io/badge/License-MIT-green.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-API-black?logo=express)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)
![WebRTC](https://img.shields.io/badge/WebRTC-P2P-blue?logo=webrtc)
![Socket.io](https://img.shields.io/badge/Socket.io-RealTime-black?logo=socketdotio)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render)

---

## 🌍 Overview

**All Send** is a production-ready peer-to-peer file sharing application designed for seamless file transfers between devices on the same network.

Built using **WebRTC for direct P2P communication** and **Node.js + Socket.io for signaling**, All Send eliminates unnecessary server load while ensuring secure, fast, and reliable transfers.

Inspired by modern file-sharing SaaS platforms like AirDrop and ShareIt, this system demonstrates scalable architecture principles and real-time communication engineering.

---

## 🏗 Architecture

### 🔹 Signaling Layer (Backend)
- Node.js + Express API
- Socket.io real-time signaling
- Peer discovery and handshake coordination
- Lightweight and scalable

### 🔹 Data Transfer Layer (Frontend)
- WebRTC direct device-to-device communication
- Encrypted data channels
- Zero server bandwidth for file payloads

```
Sender  ───┐
           ├──>  Signaling Server (Socket.io)
Receiver ──┘
               ↓
        WebRTC Direct P2P Transfer
```

---

## ✨ Key Features

- 🔍 Automatic device discovery (local network)
- ⚡ Direct encrypted P2P transfer
- 📁 Drag-and-drop file support
- 📊 Real-time transfer progress
- 📱 Responsive ShareIt-style interface
- 🌐 Cross-browser compatibility

---

## 🛠 Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript (ES6+)
- WebRTC API
- Socket.io Client

### Backend
- Node.js
- Express.js
- Socket.io

---

# 🧪 Local Development

## 1️⃣ Clone Repository

```bash
git clone https://github.com/joshcolored/allsend.git
cd allsend
```

## 2️⃣ Install Backend Dependencies

```bash
cd server
npm install
```

## 3️⃣ Start Backend

```bash
npm start
```

Server runs at:
```
http://localhost:5000
```

## 4️⃣ Run Frontend

If using React/Vite:
```bash
cd client
npm install
npm run dev
```

If static:
Open `index.html` in browser.

---

# 🚀 Deployment

## 🌐 Backend → Render

1. Push backend to GitHub  
2. Go to https://render.com  
3. Create **New Web Service**
4. Configure:

| Setting | Value |
|----------|--------|
| Build Command | npm install |
| Start Command | npm start |
| Environment | Node |

Update CORS to allow your frontend domain.

---

## ⚡ Frontend → Vercel

1. Push frontend to GitHub  
2. Import project in https://vercel.com  
3. Configure build settings if needed  
4. Deploy  

Update backend URL inside frontend:
```js
const socket = io("https://your-backend.onrender.com");
```

---

# 🔐 Production Considerations

- Free-tier hosting may sleep after inactivity
- Use HTTPS for secure WebRTC signaling
- Consider TURN server for NAT traversal (advanced setup)
- Monitor real-time connection stability in production

---

# 📜 License

MIT License © 2026

See LICENSE file for full details.

---

## 👨‍💻 Author

Joshua Grijaldo  
Aspiring Web Developer

If you found this project useful, ⭐ consider starring the repository.
