from fastapi import FastAPI, Form, Request, Response, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware
import pymongo
import os
from dotenv import load_dotenv
from urllib.parse import unquote


load_dotenv()

app=FastAPI()
origins = [
    "https://my-to-do-web-app-p85l.vercel.app",  
    "https://my-to-do-web-app.vercel.app",
    "https://my-to-do-web-app.vercel.app/todo",  
    "http://127.0.0.1:5500" 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,  
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    SessionMiddleware,
    secret_key="ibuildknockie", 
    session_cookie="session_id",
    same_site="none",  
    https_only=True  
)


class UserData(BaseModel):
    title:str
    by:str
    more_details:str

class SignUpData(BaseModel):
    fname:str
    email:str
    password:str

class LoginData(BaseModel):
    email_login:str
    password_login:str

MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise ValueError("❌ MONGO_URI is not set in environment variables!")

@app.post("/add_task")
def add_task(data:UserData):
    try:
        client=pymongo.MongoClient(MONGO_URI)
        db=client["To-Do"]
        collection=db["details"]
        collection.insert_one(data.dict())
        return {"message":"Task Added Successfully!","data":data.dict()}
    except Exception as e:
        return {"message":"An error occurred"}

@app.get("/my_tasks")
def refresh_tasks():
    try:
        client=pymongo.MongoClient(MONGO_URI)
        db=client["To-Do"]
        collection=db["details"]
        data = list(collection.find({}, {"_id": 0}))
        if not data: 
            return JSONResponse(content={"message": "No tasks found"}, status_code=404)

        return JSONResponse(content={"tasks": data})  
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
@app.get("/my_tasks/{title}")
def getItem(title):
    try:
        title=unquote(title)
        client=pymongo.MongoClient(MONGO_URI)
        db=client["To-Do"]
        collection=db["details"]
        one=collection.find_one({"title":title})
        if not one: 
            return JSONResponse(content={"message": "Task not found"}, status_code=404)
        one["_id"] = str(one["_id"])

        return one
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
    
@app.put("/update")
def update_it(data: UserData):
    try:
        client = pymongo.MongoClient(MONGO_URI)
        db = client["To-Do"]
        collection = db["details"]
        result = collection.update_one({"title": data.title}, {"$set": data.dict()})
        if result.matched_count == 0:
            return JSONResponse(content={"message": "Task not found"}, status_code=404)
        return {"message": "Task updated successfully"}
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
@app.delete("/delete/{title}")
def delete_it(title):
    try:
        title=unquote(title)
        client = pymongo.MongoClient(MONGO_URI)
        db = client["To-Do"]
        collection = db["details"]
        collection.delete_one({"title":title})
        return {"message": "Task deleted successfully"}
        
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
    

@app.post("/submit")
def submit_data(user: SignUpData):
    try:
        client=pymongo.MongoClient(MONGO_URI)
        db=client["Credentials"]
        collection=db["Passwords"]
        collection.insert_one(user.dict())
        return {"message": "Account created successfully!", "data": user.dict()}
    
    except Exception as e:
        print(e)
        return {"message":"An error occurred"}
    
@app.post("/credentials")
def read_credentials(request:Request,login_cred:LoginData):
    try:
        client = pymongo.MongoClient(MONGO_URI)
        db = client["Credentials"]
        collection = db["Passwords"]
        user = collection.find_one({"email": login_cred.email_login})

        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        if user["password"] != login_cred.password_login:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        request.session["user"] = user["fname"] 
        return {"message": "Login successful"}

    except Exception as e:
        return {"message": f"Error retrieving data: {str(e)}"}

@app.get("/todos")
async def get_todos(request: Request):
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    return {"message": f"Welcome {user}! Here are your To-Do tasks"}

@app.get("/logout",methods=["GET","POST"])
def logout(request:Request):
    response = RedirectResponse(url="/login")

    if "session_id" in request.cookies:
        response.delete_cookie("session_id", path="/") 
    
    return response