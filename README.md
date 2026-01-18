# 🚀 Dev-Connect (Backend) 💻✨

**Dev-Connect** is a high-performance full-stack social networking ecosystem built specifically for developers. This backend handles real-time communication, scalable data management, and secure monetization flows using the MERN stack.

---

## 🛠️ Technical Stack

- **Runtime:** [![Node.js Version](https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/120px-Node.js_logo.svg.png)](https://nodejs.org/en)
- **Framework:** [Express.js](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
- **Real-time:** [Socket.io](https://socket.io/)
- **Payments:** [Razorpay API](https://razorpay.com/)
- **Security:** [JWT (JSON Web Tokens)](https://www.jwt.io/) & [Bcrypt](https://www.npmjs.com/package/bcrypt)

---

## 🔐 Security & Middleware

### **Authentication (JWT)**

The platform utilizes a secure **JWT-based authentication** layer to protect user data:

- **Middleware Verification:** A custom middleware validates the JSON Web Token provided in the request cookies or headers.
- **User Context:** Once verified, the user’s full profile is attached to the request object (`req.user`), allowing downstream controllers to access the authenticated user's ID and permissions.
- **Encryption:** Industry-standard **Bcrypt** hashing is used for all sensitive credential storage.

---

## 📡 API Architecture

### 🧑‍💻 Developer Feed

- `GET /feed` — Retrieves profiles of other developers. It intelligently filters out your own profile and developers you are already connected with.

### 🤝 Connections & Networking

- `POST /request/send/:userId` — Send a connection request to a developer to start networking.
- `POST /request/review/:status/:requestId` — Manage incoming requests.
  - ✅ **Accept:** Moves the user into your "Connections" list.
  - ❌ **Reject:** Removes the pending request.

### ✍️ User Profile

- `PATCH /user/edit` — Allows users to update their technical skills, bio, and professional profile details.

### 💬 Real-Time Chat

- `GET /chat/:targetUserId` — Fetches existing conversation history.
  - **Performance Optimization:** Implemented message pagination. The API loads the latest **30 messages** initially, with a "Load Previous" trigger to maintain high performance during long conversations.

### 💳 Premium Subscriptions

- `POST /payment/create` — Integrates with the [Razorpay API](razorpay.com) (Test Mode).
  - **Verification Logic:** Upon a successful transaction, the user’s document is updated to include a **Verified Blue Tick** 🔵 status.

---

## ⚡ Real-Time Features ([Socket.io](socket.io))

Built-in WebSocket support ensures a "live" feel across the platform:

- **🟢 Online/Last Seen:** Real-time presence tracking to show when developers are active.
- **🚀 Instant Messaging:** Messages are delivered and stored instantly with zero page refreshing.
- **📜 Syncing:** Real-time events for connection acceptance and message delivery.

---

## 📥 Getting Started

### 1. Clone the repo

```bash
git clone github.com
cd Dev-Connect-Backend
```

### Install Dependencies

```bash
npm install
```

### Environment Setup

### Create a .env file and add your credentials:

```env
PORT=4000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
```

### Run the Server

```bash
npm start
```

### 🌟 Acknowledgments

- Special thanks to **Akshay Saini 🚀** and the **NamasteDev** community. The **Namaste Node.js** course was the driving force behind the architectural patterns used in this project.
- Developed with ❤️ by **Anupam Boral**
