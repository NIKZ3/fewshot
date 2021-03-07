from fastapi import FastAPI
import uvicorn

from database import models
from database.connection import engine
from api.common import login, userhome
from api.v1.routers import inference, finetune

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(login.router)
app.include_router(userhome.router)
app.include_router(inference.router)
app.include_router(finetune.router)


@app.get("/")
async def root():
    try:
        return {"status": "alive"}
    except Exception as e:
        return {"status": f"server down: {str(e)}"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
