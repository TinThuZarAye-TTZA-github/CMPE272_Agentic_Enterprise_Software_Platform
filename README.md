# Microservices Architecture Assignment

# Environment Setup
## Create a virtual environment
     python3 -m venv myenv
## Activate the virtual environment
### On Windows:
     myenv/Scripts/activate
### on MasOS/Linux:
     source myenv/bin/activate
## Install Flask
     pip install flask
     pip install requests
## Running the Service
### Start the user_service:
     python3 user_service.py
### Start the order_service:
     python3 order_service.py
## Example Requests
### Create a User 
     http://localhost:5001/users/1
### Get a User
     http://localhost:5001/users/1
### Create an Order
     http://localhost:5002/orders
   <img width="1000" height="500" alt="Screenshot 2025-09-12 at 12 38 59 AM" src="https://github.com/user-attachments/assets/065dafb3-96e5-4b55-aff2-52b184375712" />

### Get an Order
     http://localhost:5002/orders/1
     
