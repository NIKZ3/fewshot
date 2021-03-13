from fastapi import APIRouter, Depends, Response
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session
import bcrypt

from repository import userRepository
from database.connection import get_db
from database.schemas import User
from api.auth import create_access_token, get_current_user

router = APIRouter(prefix="/api/users", tags=["login", "users"], responses={
                   404: {"description": "Not found"}, 403: {"description": "Unauthorized Request"}})


@router.post("/login")
async def login(response: Response, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user: User = await userRepository.get_by_username(db, form_data.username)
    if not user:
        raise HTTPException(status_code=403, detail="Username or password incorrect", headers={
                            "WWW-Authenticate": "Bearer"})
    verificaion_success = bcrypt.checkpw(password=form_data.password.encode('utf-8'),
                                         hashed_password=user.hashed_password)
    if not verificaion_success:
        raise HTTPException(status_code=403, detail="Username or password incorrect", headers={
                            "WWW-Authenticate": "Bearer"})
    token = create_access_token({"username": user.username})
    response.headers['Authorization'] = "Bearer "+token
    return {"message": "Successfully logged in!"}


@router.post("/signup")
async def signup(response: Response, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user: User = await userRepository.get_by_username(db, form_data.username)
    if user is not None:
        print(user)
        raise HTTPException(status_code=400, detail="Username already in use, try a different username", headers={
                            "WWW-Authenticate": "Bearer"})
    hashed_password = bcrypt.hashpw(
        form_data.password.encode('utf-8'), bcrypt.gensalt())
    user: User = await userRepository.create_new_user(
        db, form_data.username, hashed_password)
    token = create_access_token({"username": user.username})
    response.headers['Authorization'] = "Bearer "+token
    db.commit()
    return {"message": "User account created!"}


@router.get("/logout")
async def logout(response: Response, user_data: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    username = user_data["username"]
    user: User = await userRepository.get_by_username(db, username)
    del response.headers['Authorization']
    return user
