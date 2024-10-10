from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import openai
import os

# Load OpenAI API Key
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

class QueryRequest(BaseModel):
    natural_language_query: str

@app.post("/generate_sql")
async def generate_sql(request: QueryRequest):
    try:
        response = openai.Completion.create(
            model="text-davinci-003",
            prompt=f"Convert this natural language query to SQL: {request.natural_language_query}",
            max_tokens=150
        )
        sql_query = response.choices[0].text.strip()
        return {"sql_query": sql_query}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
