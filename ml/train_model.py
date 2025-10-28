import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import pickle
import os

def generate_mock_data(n_samples=500):
    """Generate additional mock loan data for training"""
    np.random.seed(42)
    
    data = []
    for _ in range(n_samples):
        income = np.random.randint(18000, 100000)
        credit_score = np.random.randint(500, 850)
        age = np.random.randint(21, 65)
        loan_amount = np.random.randint(5000, 40000)
        
        # Approval logic: higher income, credit score, and age increase approval chances
        # Lower loan amounts relative to income also help
        approval_score = (
            (income / 100000) * 0.3 +
            (credit_score / 850) * 0.4 +
            (age / 65) * 0.1 +
            (1 - (loan_amount / income)) * 0.2
        )
        
        # Add some randomness
        approval_score += np.random.normal(0, 0.1)
        
        approved = 1 if approval_score > 0.5 else 0
        
        data.append({
            'income': income,
            'credit_score': credit_score,
            'age': age,
            'loan_amount': loan_amount,
            'approved': approved
        })
    
    return pd.DataFrame(data)

def train_model():
    """Train the loan approval model"""
    print("🚀 Starting model training...")
    
    # Load CSV data
    csv_path = os.path.join(os.path.dirname(__file__), 'data', 'mock_loans.csv')
    df_csv = pd.read_csv(csv_path)
    print(f"📊 Loaded {len(df_csv)} samples from CSV")
    
    # Generate additional mock data
    df_generated = generate_mock_data(500)
    print(f"📊 Generated {len(df_generated)} additional samples")
    
    # Combine datasets
    df = pd.concat([df_csv, df_generated], ignore_index=True)
    print(f"📊 Total training samples: {len(df)}")
    
    # Prepare features and target
    X = df[['income', 'credit_score', 'age', 'loan_amount']]
    y = df['approved']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train Random Forest model
    print("🤖 Training Random Forest Classifier...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        class_weight='balanced'
    )
    model.fit(X_train_scaled, y_train)
    
    # Evaluate model
    y_pred = model.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"\n✅ Model Training Complete!")
    print(f"📈 Accuracy: {accuracy:.2%}")
    print("\n📊 Classification Report:")
    print(classification_report(y_test, y_pred, target_names=['Rejected', 'Approved']))
    print("\n🔍 Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': X.columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    print("\n🎯 Feature Importance:")
    print(feature_importance)
    
    # Save model and scaler
    model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
    scaler_path = os.path.join(os.path.dirname(__file__), 'scaler.pkl')
    
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    
    with open(scaler_path, 'wb') as f:
        pickle.dump(scaler, f)
    
    print(f"\n💾 Model saved to: {model_path}")
    print(f"💾 Scaler saved to: {scaler_path}")
    
    return model, scaler, accuracy

if __name__ == "__main__":
    train_model()

