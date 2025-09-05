from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
import uvicorn
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

# Import our services (we'll create these)
from services.llama_service import LlamaService
from services.mental_health_service import MentalHealthService

# Initialize FastAPI app
app = FastAPI(
    title="Mental Health Chatbot API",
    description="Multilingual Mental Health Support Chatbot with Llama 3.1",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Initialize services
llama_service = LlamaService()
mental_health_service = MentalHealthService()

# Pydantic models for API
class ChatMessage(BaseModel):
    message: str
    session_id: str
    language: str = "en"

class ChatResponse(BaseModel):
    response: str
    session_id: str
    language: str
    crisis_detected: bool = False

# In-memory conversation storage (for MVP)
conversations = {}

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    print("🚀 Starting Mental Health Chatbot...")
    await llama_service.initialize()
    await mental_health_service.initialize()
    print("✅ All services initialized successfully")

@app.get("/")
async def serve_frontend():
    """Serve a simple test frontend"""
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Mental Health Chatbot</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            .chat-container { border: 1px solid #ccc; height: 400px; overflow-y: auto; padding: 10px; margin-bottom: 10px; }
            .message { margin: 10px 0; padding: 8px; border-radius: 8px; }
            .user { background: #e3f2fd; text-align: right; }
            .bot { background: #f5f5f5; }
            .input-container { display: flex; gap: 10px; }
            input { flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 4px; }
            button { padding: 10px 20px; background: #2196f3; color: white; border: none; border-radius: 4px; cursor: pointer; }
        </style>
    </head>
    <body>
        <h1>🤖 Mental Health Support Chatbot</h1>
        <div id="chatContainer" class="chat-container"></div>
        <div class="input-container">
            <input type="text" id="messageInput" placeholder="Type your message here..." onkeypress="handleKeyPress(event)">
            <button onclick="sendMessage()">Send</button>
        </div>
        
        <script>
            const sessionId = Date.now().toString();
            
            function addMessage(content, isUser) {
                const chatContainer = document.getElementById('chatContainer');
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
                messageDiv.textContent = content;
                chatContainer.appendChild(messageDiv);
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
            
            async function sendMessage() {
                const input = document.getElementById('messageInput');
                const message = input.value.trim();
                if (!message) return;
                
                addMessage(message, true);
                input.value = '';
                
                try {
                    const response = await fetch('/api/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            message: message,
                            session_id: sessionId,
                            language: 'en'
                        })
                    });
                    
                    const result = await response.json();
                    addMessage(result.response, false);
                    
                    if (result.crisis_detected) {
                        addMessage('⚠️ If you are in crisis, please contact: 022-25521111 (Suicide Prevention Helpline)', false);
                    }
                } catch (error) {
                    addMessage('Sorry, I encountered an error. Please try again.', false);
                }
            }
            
            function handleKeyPress(event) {
                if (event.key === 'Enter') {
                    sendMessage();
                }
            }
        </script>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "services": {
            "llama": llama_service.is_ready(),
            "mental_health": mental_health_service.is_ready()
        }
    }

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(message: ChatMessage):
    """Main chat endpoint"""
    try:
        session_id = message.session_id
        user_message = message.message
        language = message.language
        
        # Initialize conversation history if new session
        if session_id not in conversations:
            conversations[session_id] = []
        
        # Add user message to history
        conversations[session_id].append({
            "role": "user",
            "content": user_message
        })
        
        # Generate response using mental health service
        response_data = await mental_health_service.generate_response(
            user_message, 
            conversations[session_id][-5:]  # Last 5 messages for context
        )
        
        # Add bot response to history
        conversations[session_id].append({
            "role": "assistant",
            "content": response_data["response"]
        })
        
        return ChatResponse(
            response=response_data["response"],
            session_id=session_id,
            language=language,
            crisis_detected=response_data.get("crisis_detected", False)
        )
        
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)