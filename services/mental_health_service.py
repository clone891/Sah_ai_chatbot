from typing import List, Dict
from .llama_service import LlamaService

class MentalHealthService:
    def __init__(self):
        self.llama_service = LlamaService()
        self.crisis_keywords = {
            "emergency": ["suicide", "kill myself", "end it all", "want to die", "harm myself"],
            "high": ["hopeless", "worthless", "better off dead", "can't go on"],
            "medium": ["depressed", "anxious", "overwhelmed", "stressed"]
        }
        self.ready = False
        
    async def initialize(self):
        """Initialize mental health service"""
        await self.llama_service.initialize()
        self.ready = self.llama_service.is_ready()
        print(f"✅ Mental Health service initialized: {self.ready}")
        
    def is_ready(self) -> bool:
        return self.ready
        
    def detect_crisis_level(self, message: str) -> str:
        """Detect crisis level in user message"""
        message_lower = message.lower()
        
        for keyword in self.crisis_keywords["emergency"]:
            if keyword in message_lower:
                return "emergency"
                
        for keyword in self.crisis_keywords["high"]:
            if keyword in message_lower:
                return "high"
                
        for keyword in self.crisis_keywords["medium"]:
            if keyword in message_lower:
                return "medium"
                
        return "low"
    
    async def generate_response(self, message: str, conversation_history: List[Dict]) -> Dict:
        """Generate mental health focused response"""
        try:
            # Detect crisis level
            crisis_level = self.detect_crisis_level(message)
            
            # Generate AI response
            ai_response = await self.llama_service.generate_response(message, conversation_history)
            
            # Add safety disclaimer for mental health context
            if any(word in message.lower() for word in ["help", "depressed", "sad", "anxiety"]):
                ai_response += "\n\nRemember, I'm here to listen, but please consider speaking with a mental health professional if you're struggling."
            
            # Add crisis resources if needed
            crisis_detected = crisis_level in ["emergency", "high"]
            if crisis_detected:
                ai_response += "\n\n🆘 Crisis Resources:\n• Suicide Prevention: 022-25521111\n• KIRAN Helpline: 1800-599-0019"
            
            return {
                "response": ai_response,
                "crisis_detected": crisis_detected,
                "crisis_level": crisis_level
            }
            
        except Exception as e:
            print(f"Error in mental health service: {e}")
            return {
                "response": "I'm here to listen and support you. While I'm having some technical difficulties right now, please know that you're not alone. If you're in crisis, please reach out to: 022-25521111",
                "crisis_detected": True,
                "crisis_level": "medium"
            }