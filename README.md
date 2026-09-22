# Azure Service Bus Food Delivery App (Docker + MySQL + React + Node.js)

A distributed food delivery system demonstrating the **Saga Pattern (Compensating Transactions)** over **Azure Service Bus**, containerized with **Docker** and persistent in **MySQL 8.0**.

---

## 🐳 Running with Docker Compose (Recommended)

To start the entire application stack (**MySQL 8.0 + Node.js Backend + React/Nginx Frontend**):

```bash
docker compose up --build
```

- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5001](http://localhost:5001)
- **MySQL Database**: `localhost:3306` (Database: `delivery_db`, User: `delivery_user`, Pass: `delivery_pass`)

To stop:
```bash
docker compose down
```

---

## 💻 Running Locally (Development Mode)

```bash
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend**: [http://localhost:5001](http://localhost:5001)

### Run Automated Saga Verification Tests:
```bash
npm run test:saga
```

---

## 🗄️ MySQL Database Structure

The application automatically creates and manages 6 tables on startup:
1. `orders`: Order lifecycle state machine, customer details, grand total, and compensation status.
2. `payments`: Payment capture records.
3. `refunds`: Distributed compensation refund records.
4. `kitchen_orders`: Kitchen cooking tickets and cancellation state.
5. `courier_dispatches`: Dispatch assignments and failure reasons.
6. `notifications`: SMS delivery logs.
