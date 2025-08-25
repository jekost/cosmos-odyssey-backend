# Cosmos Odyssey Web Application Back End
The back end of a full-stack web application for seamless interplanetary travel booking.

## Key Features

### Data Handling
- Retrieves travel data from an internal API and processes it into a readable format.
- Stores data in a **PostgreSQL database** for easy access via API endpoints.

### Interactive UI
- Users can browse and filter travel options based on **departure, destination, price, company,** and more.

### Shopping & Checkout
- Users can add trips to a **cart** and complete purchases using their **name and surname**.
- Before checkout, the system **verifies if the price list is still valid** to prevent outdated transactions.

### Purchase Records
- All **completed purchases** are stored and accessible via API.

### Data Storage & Expiration Handling
- **Valid travel data** is stored indefinitely.
- The system retains **the last 15 expired price lists** for reference.

## Tech Stack
- **Front End:** React + Vite  
- **Back End:** Node.js, Sequelize  
- **Database:** PostgreSQL  
- **Automation:** Cron Job

## Setup Guide using Node Package Manager & PostgreSQL
- **Database**:
make sure an empty PostgreSQL database using the name `cosmos_odyssey` exists
  - `create database cosmos_odyssey;`
- **Back End** `https://github.com/jekost/cosmos-odyssey-backend`:
  - rename `config/config_example` to `config/config.json`
  - rename `env_example` to `.env`
  - `npm install`
  - `npm start`
- **Front End** `https://github.com/jekost/cosmos-odyssey-frontend`:
  - rename `env_example` to `.env`
  - `npm install`
  - `npm run dev`
 

## Access points
- Access the UI at `http://localhost:5173`
- All current and last 15 pricelists are available here: `http://localhost:5000/api/pricelists`
- All flights recorded during that time are here: `http://localhost:5000/api/travels`
- And all purchases are accessible here: `http://localhost:5000/api/reservations`

## Limitations
- Currently the data retrieval is automated using Cron Job. This could very well be replaced with some checker that looks right after the current pricelist expires, however that may not always be the best case.



## Seperate front end and back end (+db) repositories:

https://github.com/jekost/cosmos-odyssey-backend

https://github.com/jekost/cosmos-odyssey-frontend



 
# Jan Erik Köst
jan.erik.kost@hotmail.com