import pickle
import os
import numpy as np
from typing import Dict, Tuple

class AIService:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.load_model()
    
    def load_model(self):
        """Load the trained ML model and scaler"""
        model_path = os.path.join(os.path.dirname(__file__), '../../ml/model.pkl')
        scaler_path = os.path.join(os.path.dirname(__file__), '../../ml/scaler.pkl')
        
        try:
            with open(model_path, 'rb') as f:
                self.model = pickle.load(f)
            
            with open(scaler_path, 'rb') as f:
                self.scaler = pickle.load(f)
            
            print("✅ ML Model and Scaler loaded successfully")
        except FileNotFoundError:
            print("⚠️  Model not found. Please train the model first.")
            print("   Run: python ml/train_model.py")
            self.model = None
            self.scaler = None
    
    def predict_loan_approval(self, income: float, credit_score: int, 
                             age: int, loan_amount: float) -> Dict:
        """
        Predict loan approval and calculate risk score
        
        Returns:
            Dict with approval_probability, risk_score, and decision
        """
        if self.model is None or self.scaler is None:
            # Fallback to rule-based system if model not loaded
            return self._fallback_prediction(income, credit_score, age, loan_amount)
        
        # Prepare features
        features = np.array([[income, credit_score, age, loan_amount]])
        features_scaled = self.scaler.transform(features)
        
        # Get prediction probability
        approval_proba = self.model.predict_proba(features_scaled)[0][1]
        
        # Calculate risk score (inverse of approval probability)
        risk_score = 1 - approval_proba
        
        # Determine approval decision (threshold at 0.5)
        approved = approval_proba >= 0.5
        
        # Determine approval status
        if approved:
            if approval_proba >= 0.8:
                status = "approved"
            else:
                status = "approved"  # Could add "conditional_approval" status
        else:
            status = "rejected"
        
        return {
            "approval_probability": float(approval_proba),
            "risk_score": float(risk_score),
            "approval_status": status,
            "confidence": float(max(approval_proba, 1 - approval_proba))
        }
    
    def _fallback_prediction(self, income: float, credit_score: int, 
                            age: int, loan_amount: float) -> Dict:
        """Rule-based fallback when ML model is not available"""
        # Simple rule-based scoring
        score = 0
        
        # Credit score component (0-40 points)
        if credit_score >= 750:
            score += 40
        elif credit_score >= 700:
            score += 30
        elif credit_score >= 650:
            score += 20
        elif credit_score >= 600:
            score += 10
        
        # Income component (0-30 points)
        if income >= 70000:
            score += 30
        elif income >= 50000:
            score += 20
        elif income >= 35000:
            score += 10
        
        # Debt-to-income ratio (0-20 points)
        dti_ratio = loan_amount / income if income > 0 else 1
        if dti_ratio < 0.3:
            score += 20
        elif dti_ratio < 0.5:
            score += 10
        
        # Age component (0-10 points)
        if age >= 30:
            score += 10
        elif age >= 25:
            score += 5
        
        # Convert to probability
        approval_proba = score / 100
        risk_score = 1 - approval_proba
        
        status = "approved" if approval_proba >= 0.5 else "rejected"
        
        return {
            "approval_probability": float(approval_proba),
            "risk_score": float(risk_score),
            "approval_status": status,
            "confidence": float(max(approval_proba, 1 - approval_proba))
        }
    
    def detect_fraud(self, income: float, credit_score: int, 
                    age: int, loan_amount: float) -> Dict:
        """
        Mock fraud detection logic
        
        Returns:
            Dict with fraud_score and is_fraudulent flag
        """
        fraud_score = 0.0
        
        # Suspicious patterns
        # 1. Very high loan amount relative to income
        if income > 0 and (loan_amount / income) > 2:
            fraud_score += 0.3
        
        # 2. Unusually high income for young age
        if age < 25 and income > 80000:
            fraud_score += 0.2
        
        # 3. High loan amount with low credit score
        if credit_score < 600 and loan_amount > 20000:
            fraud_score += 0.25
        
        # 4. Extreme values
        if income > 200000 or loan_amount > 100000:
            fraud_score += 0.15
        
        # 5. Perfect credit score (850) is rare and suspicious
        if credit_score == 850:
            fraud_score += 0.1
        
        # Cap at 1.0
        fraud_score = min(fraud_score, 1.0)
        
        is_fraudulent = fraud_score > 0.6
        
        return {
            "fraud_score": float(fraud_score),
            "is_fraudulent": is_fraudulent,
            "fraud_level": self._get_fraud_level(fraud_score)
        }
    
    def _get_fraud_level(self, fraud_score: float) -> str:
        """Categorize fraud score into levels"""
        if fraud_score < 0.3:
            return "low"
        elif fraud_score < 0.6:
            return "medium"
        else:
            return "high"
    
    def calculate_repayment_risk(self, loan_amount: float, repayment_amount: float,
                                 original_risk_score: float) -> float:
        """
        Recalculate risk based on repayment progress
        
        Args:
            loan_amount: Original loan amount
            repayment_amount: Amount repaid so far
            original_risk_score: Original risk score
        
        Returns:
            Updated risk score
        """
        if loan_amount == 0:
            return original_risk_score
        
        repayment_ratio = repayment_amount / loan_amount
        
        # Good repayment history reduces risk
        risk_reduction = repayment_ratio * 0.3  # Up to 30% risk reduction
        new_risk_score = max(0, original_risk_score - risk_reduction)
        
        return float(new_risk_score)

# Singleton instance
ai_service = AIService()

