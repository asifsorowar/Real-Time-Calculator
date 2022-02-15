# Real Time Calculator

## Branch: Backend

---

### Stack

- express - 4.17.2
- express-async-errors - 3.1.1
- express-fileupload - 1.3.1
- express-rate-limit - 6.2.1
- mongoose - 6.2.1
- socket.io - 4.4.1
- colors - 1.4.0
- cors - 2.8.5
- dotenv - 16.0.0

### How to run

- First

  > npm i

- set client host in _CLIENT_ variable from _config/config.env_ Default: http://localhost:3000

- Finally

  > npm run dev

- Important: MongoDBCompass is required for connecting with database.

### Some sample text file is given for calculation.

## Branch: Client

---

### Stack

- react - 17.0.2
- react-dom - 17.0.2
- react-scripts - 5.0.0
- react-toastify - 8.1.1
- socket.io-client - 4.4.1
- web-vitals - 2.1.4
- axios - 0.26.0
- autoprefixer - 10.4.2
- postcss - 8.4.6
- tailwindcss - 3.0.22

### How to run

- First

  > npm i

- set backend host in _REACT_APP_API_URL_ variable from _.env.development_. Default: http://localhost:4000
- set backend host in _REACT_APP_SOCKET_API_URL_ variable from _.env.development_ Default: ws://localhost:8800

- Finally

  > npm run start
