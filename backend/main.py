from fastapi import FastAPI, Form
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pymongo
import os
from dotenv import load_dotenv

load_dotenv()

app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserData(BaseModel):
    title:str
    by:str
    more_details:str

MONGO_URI = os.getenv("MONGO_URI")

@app.post("/add_task")
def add_task(data:UserData):
    try:
        client=pymongo.MongoClient(MONGO_URI)
        db=client["To-Do"]
        collection=db["details"]
        collection.insert_one(data.dict())
        return {"message":"Data Saved Successfully!","data":data.dict()}
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
        client = pymongo.MongoClient(MONGO_URI)
        db = client["To-Do"]
        collection = db["details"]
        collection.delete_one({"title":title})
        return {"message": "Task deleted successfully"}
        
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)