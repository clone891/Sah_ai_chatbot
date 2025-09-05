import aiohttp
import asyncio
import os
from typing import List, Dict

class LlamaService:
    def __init__(self):
        self.token = os.getenv("HUGGINGFACE_TOKEN")
        self.model_url = "https://api-inference.huggingface.co/models/meta-llama/Llama-3.1-8B-Instruct"
        self.ready = False
        
    async def initialize(self):
        """Test connection to Hugging Face API"""
        try:
            test_response = await self.generate_response("Hello", [])
            print(f"✅ Llama service initialized. Test response: {test_response[:50]}...")
            self.ready = True
        except Exception as e:
            print(f"❌ Failed to initialize Llama service: {e}")
            self.ready = False
    
    def is_ready(self) -> bool:
        return self.ready
    
    async def generate_response(self, message: str, conversation_history: List[Dict]) -> str:
        """Generate response using Llama 3.1"""
        try:
            # Create conversation context
            context = ""
            for msg in conversation_history[-3:]:  # Last 3 messages
                role = "User" if msg["role"] == "user" else "Assistant"
                context += f"{role}: {msg['content']}\n"
            
            # Mental health focused system prompt
            system_prompt = """You are a compassionate mental health support assistant. 
            Provide empathetic, supportive responses while always reminding users to seek professional help when needed.
            Keep responses under 150 words. Be warm, understanding, and culturally sensitive for Indian users.
            If someone mentions serious distress, gently suggest professional resources."""
            
            full_prompt = f"{system_prompt}\n\nConversation:\n{context}User: {message}\nAssistant:"
            
            headers = {"Authorization": f"Bearer {self.token}"}
            payload = {
                "inputs": full_prompt,
                "parameters": {
                    "max_new_tokens": 150,
                    "temperature": 0.7,
                    "return_full_text": False,
                    "stop": ["User:", "Assistant:"]
                }
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(self.model_url, headers=headers, json=payload) as response:
                    if response.status == 200:
                        result = await response.json()
                        return result[0]["generated_text"].strip()
                    else:
                        error_text = await response.text()
                        print(f"API Error: {response.status} - {error_text}")
                        return "I'm having trouble connecting right now. Please try again in a moment."
                        
        except Exception as e:
            print(f"Error generating response: {e}")
            return "I apologize, but I'm experiencing some technical difficulties. How else can I help you today?"