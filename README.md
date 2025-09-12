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
