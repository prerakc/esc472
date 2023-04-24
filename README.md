# esc472

## How to run

### Step 1: Start MongoDB Docker container

```
docker run -d -p 27017:27017 --name test-mongo mongo:latest
```

### Step 2: Start server

```
cd server
npm install
node index.js
```

### Step 3: Start client

```
cd client
npm install
npm start
```
