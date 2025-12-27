#!/usr/bin/env python
# coding: utf-8

# In[1]:


import pandas as pd
from openpyxl import load_workbook
import random


# In[2]:


file_path = "New1.xlsx"
output_path = "Shuffled_New1.xlsx"


# In[3]:


# Load the Excel workbook
excel_file = pd.ExcelFile(file_path, engine='openpyxl')
writer = pd.ExcelWriter(output_path, engine='openpyxl')


# In[4]:


# Process each sheet
for sheet_name in excel_file.sheet_names:
    df = excel_file.parse(sheet_name)
    
    # Check if dataframe is not empty
    if not df.empty:
        # Shuffle the dataframe (excluding header if needed)
        df_shuffled = df.sample(frac=1, random_state=42).reset_index(drop=True)
    else:
        df_shuffled = df

    # Save the shuffled sheet
    df_shuffled.to_excel(writer, sheet_name=sheet_name, index=False)

# Save the workbook
writer.close()

print("Shuffled Excel file saved as:", output_path)


# In[ ]:


# from textblob import TextBlob


# In[ ]:


# # Load the data from 'Sheet1' and drop missing rows in 'Complaint_Text'
# df = excel_file.parse("Sheet1")
#  df_cleaned = df.dropna(subset=["Complaint_Text"]).copy()


# In[ ]:


# # Perform sentiment analysis
# def get_sentiment(text):
#     blob = TextBlob(str(text))
#     polarity = blob.sentiment.polarity
#     if polarity > 0.1:
#         return "Positive"
#     elif polarity < -0.1:
#         return "Negative"
#     else:
#         return "Neutral"
    
# df_cleaned["Sentiment"] = df_cleaned["Complaint_Text"].apply(get_sentiment)


# In[ ]:


# # Add sentiment polarity score alongside sentiment label
# def get_sentiment_score(text):
#     blob = TextBlob(str(text))
#     return blob.sentiment.polarity

# df_cleaned["Sentiment_Score"] = df_cleaned["Complaint_Text"].apply(get_sentiment_score)


# In[ ]:


# # Preview the results
# df_cleaned.head(20)


# In[ ]:


# # Save the cleaned and sentiment-analyzed data to a new Excel file
# output_path = "Sentiment_Analyzed_Complaints.xlsx"
# df_cleaned.to_excel(output_path, index=False)

# output_path


# DistilBERT
# 

# In[5]:


import os
print(os.getcwd())

# Terminal
# Remove-Item -Recurse -Force .\**\__pycache__
# >> Remove-Item -Recurse -Force .\**\*.pyc


# In[6]:


import torch
import torchvision

print(torch.__version__)
print(torchvision.__version__)


# In[7]:


import os
os.environ["USE_TF"] = "0"


# In[8]:


from transformers import pipeline


# In[9]:


# Load a sentiment-analysis pipeline (DistilBERT SST-2)
sentiment_pipeline = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")


# In[10]:


def classify_sentiment_safe(text):
    text = str(text)
    if text.strip() == '' or text.lower() == 'nan':
        return pd.Series(['Neutral', 0.0])
    try:
        result = sentiment_pipeline(text[:512])[0]
        return pd.Series([result['label'], result['score']])
    except Exception as e:
        return pd.Series(['Error', 0.0])




# In[11]:


# Apply sentiment classification
df[['Sentiment_Label', 'Sentiment_Confidence']] = df['Complaint_Text'].apply(classify_sentiment_safe)
df.head(20)


# In[12]:


# Save to Excel
df.to_excel("High_Accuracy_Sentiment_Analyzed.xlsx", index=False)


# In[13]:


import pandas as pd
import re
from collections import defaultdict


# In[14]:


# Load the sentiment-analyzed data
df = pd.read_excel("High_Accuracy_Sentiment_Analyzed.xlsx")


# In[15]:


# Define railway complaint categories and keyword stems

categories = {
    "Food": [
        "food", "cater", "meal", "packet", "drink", "vendor", "bottl", "hygien", "stale",
        "expire", "cold food", "unhygien", "contamin", "dirty plate", "refill", "storag",
        "spoil", "flies", "insect", "rotten", "packag", "soft drink", "snack", "beverage",
        "caterer", "meal qualiti", "food qualiti", "food servic", "food item", "food wast",
        "food adulter", "food adul", "food safety", "food tast", "food packag", "food item",
        "food wast", "food spoil", "food storag", "food vendor", "food cater", "food drink",
    ],
    "Delay": [
        "delay", "late", "reschedul", "tim", "punctual", "postpon", "miss", "arriv",
        "depart", "wait", "run behind", "not on time", "held up", "schedul", "late train",
        "late arriv", "late depart", "late board", "late schedul", "late servic",
    ],
    "Seat Issues": [
        "seat", "berth", "invad", "unauthor", "allot", "change seat", "swap", "occup",
        "taken", "adjust", "reserv error", "someone else", "sitt", "encroach",
        "seat shar", "double book", "berth conflict", "seat conflict",
        "seat assign", "seat chang", "seat problem", "seat issue", "seat reserv", "seat unavail",
        "seat not avail", "seat not assign", "seat not reserv", "seat not book",
    ],
    "Misbehaviour": [
        "rude", "misbehav", "shout", "abus", "fight", "harass", "argu", "ill-treat",
        "verbal abus", "threat", "yell", "arrog", "bad behav", "disrespect",
        "misconduct", "unprofession", "scold", "misconduct", "criminals", "weapon",
    ],
    "Cleanliness": [
        "clean", "dirti", "garbag", "washroom", "toilet", "filth", "sanit", "unhygien",
        "stain", "overflow", "smell", "odor", "not clean", "sewag", "mosquito",
        "pest", "sweep", "no clean", "hygiene", "unclean", "mess", "litter", "stagnant",
        "clutter", "cleanliness", "uncleanli", "dust", "cleaner", "cleaning", "no soap", "no towel",
        "no sanit", "no water", "no clean", "no hygien", "no sanitari", "no cleanli",
    ],
    "Facilities": [
        "fan", "light", "charg", "ac", "toilet", "water", "bedroll", "blanket", "window",
        "door", "sheet", "pillow", "rack", "malfunct", "equip", "shutter", "no soap",
        "no towel", "flush", "seatbelt", "ventilat", "socket", "jam", "lock", "door lock",
        "door jam", "door malfunct", "door problem", "door issue", "door facil",
    ],
    "Ticketing": [
        "ticket", "book", "reserv", "cancel", "refund", "pnr", "payment", "app",
        "site down", "confirm", "wait list", "invalid", "wrong name", "mistak",
        "fail", "problem in app", "gateway", "transact", "error", "no response", "board", "unavail", "unauthor", 
    ],
    "Safety": [
        "secur", "police", "safe", "robb", "thief", "threat", "fire", "emerg",
        "no guard", "unauthor access", "chain pull", "fight", "danger", "help",
        "bag miss", "cctv", "suspici", "crime", "harass", "safety", "safeti",
        "safeguard", "safeguard", "safeti", "safeti issue", "safeti concern",
    ],
}


# In[16]:


# # Function to categorize a complaint
# def categorize_complaint(text):
#     text = str(text).lower()
#     for category, keywords in categories.items():
#         for keyword in keywords:
#             if re.search(keyword, text):  # Allow partial, non-strict stem match
#                 return category
#     return "Other"


# # Apply categorization
# df["Category"] = df["Complaint_Text"].apply(categorize_complaint)

# Function to find all matching categories
def get_matching_categories(text):
    text = str(text).lower()
    matched = []

    for category, keywords in categories.items():
        for kw in keywords:
            if re.search(rf"\b{kw}", text):
                matched.append(category)
                break  # stop after the first keyword match for this category

    return ", ".join(sorted(set(matched))) if matched else "Other"

# Apply the function
df["Categories"] = df["Complaint_Text"].apply(get_matching_categories)

# Function to find most dominant category
def find_dominant_category(text):
    text = str(text).lower()
    keyword_count = defaultdict(int)

    for category, keywords in categories.items():
        for kw in keywords:
            # fuzzy match using root/stemmed pattern
            if re.search(rf"\b{kw}", text):  
                keyword_count[category] += 1

    if keyword_count:
        # Return category with highest keyword matches
        return max(keyword_count, key=keyword_count.get)
    return "Other"

# Apply categorization
df['Dominant_Category'] = df['Complaint_Text'].apply(find_dominant_category)


# In[17]:


# Save categorized version
df.to_excel("Categorized_Complaints.xlsx", index=False)
print("✅ Categorized complaints saved as Categorized_Complaints.xlsx")


# Fine-Tuning DistilBERT

# In[18]:


import pandas as pd
from sklearn.model_selection import train_test_split

# Load and preprocess data
df = pd.read_excel("Categorized_Complaints.xlsx")
df = df[["Complaint_Text", "Dominant_Category"]].dropna()

# Encode categories
from sklearn.preprocessing import LabelEncoder
label_encoder = LabelEncoder()
df['Label'] = label_encoder.fit_transform(df['Dominant_Category'])
df
# Random train-test split without stratification to include all categories
train_texts, val_texts, train_labels, val_labels = train_test_split(
    df['Complaint_Text'].tolist(), df['Label'].tolist(), test_size=0.2, random_state=42)


# In[19]:


from transformers import BertTokenizer

tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")

train_encodings = tokenizer(train_texts, truncation=True, padding=True, max_length=128)
val_encodings = tokenizer(val_texts, truncation=True, padding=True, max_length=128)


# In[ ]:


# import torch

# class ComplaintDataset(torch.utils.data.Dataset):
#     def __init__(self, encodings, labels):
#         self.encodings = encodings
#         self.labels = labels
        
#     def __len__(self):
#         return len(self.labels)
    
#     def __getitem__(self, idx):
#         item = {key: torch.tensor(val[idx]) for key, val in self.encodings.items()}
#         item['labels'] = torch.tensor(self.labels[idx])
#         return item

# train_dataset = ComplaintDataset(train_encodings, train_labels)
# val_dataset = ComplaintDataset(val_encodings, val_labels)
# # 


# In[ ]:


# from transformers import BertForSequenceClassification, Trainer, TrainingArguments

# num_labels = len(set(df['Label']))

# model = BertForSequenceClassification.from_pretrained("bert-base-uncased", num_labels=num_labels)

# training_args = TrainingArguments(
#     output_dir="./results",
#     evaluation_strategy="epoch",
#     learning_rate=2e-5,
#     per_device_train_batch_size=8,
#     per_device_eval_batch_size=8,
#     num_train_epochs=4,
#     weight_decay=0.01,
# )

# trainer = Trainer(
#     model=model,
#     args=training_args,
#     train_dataset=train_dataset,
#     eval_dataset=val_dataset
# )


# In[ ]:


# trainer.train()


# In[ ]:


# trainer.evaluate()


# In[ ]:


# model.save_pretrained("./railway_complaint_classifier2")
# tokenizer.save_pretrained("./railway_complaint_classifier2")


# In[ ]:





# In[20]:


from transformers import pipeline

classifier = pipeline("text-classification", model="./railway_complaint_classifier2", tokenizer="./railway_complaint_classifier2")

# text = "Food was stale and unhygienic"
text = "My seat was taken by someone and I got into a fight with them. No help from staff."
pred = classifier(text)
label = label_encoder.inverse_transform([int(pred[0]['label'].split('_')[-1])])
print("Predicted Category:", label[0])

# Step 5: Display all possible categories
print("\nAll Possible Categories:")
for i, category in enumerate(label_encoder.classes_):
    print(f"LABEL_{i}: {category}")

# Optional: Category dictionary mapping
label_map = {f'LABEL_{i}': category for i, category in enumerate(label_encoder.classes_)}
print("\nLabel Map Dictionary:", label_map)


# In[ ]:





# PRIORITY ASSIGNMENT

# In[21]:


from sklearn.metrics import accuracy_score, precision_recall_fscore_support, classification_report, confusion_matrix
import numpy as np

# Get validation texts and labels
val_texts = df["Complaint_Text"].tolist()
true_labels = df["Label"].tolist()

# Predict labels for validation texts
predicted_labels = []
for text in val_texts:
    pred = classifier(text)
    label_idx = int(pred[0]['label'].split('_')[-1])
    predicted_labels.append(label_idx)

# Convert to numpy arrays
true_labels = np.array(true_labels)
predicted_labels = np.array(predicted_labels)

# Accuracy
accuracy = accuracy_score(true_labels, predicted_labels)
print("Accuracy:", round(accuracy * 100, 2), "%")

# Precision, Recall, F1
precision, recall, f1, _ = precision_recall_fscore_support(true_labels, predicted_labels, average='weighted')
print("Precision:", round(precision * 100, 2), "%")
print("Recall:", round(recall * 100, 2), "%")
print("F1 Score:", round(f1 * 100, 2), "%")

# Classification Report
print("\nClassification Report:")
print(classification_report(true_labels, predicted_labels, target_names=label_encoder.classes_))

# Confusion Matrix
print("Confusion Matrix:")
print(confusion_matrix(true_labels, predicted_labels))


# In[22]:


high_priority = [
    "Safety",             # Security threats, fire, robbery, threats
    "Misbehaviour",       # Staff/passenger misconduct, harassment
    "Medical Emergency",  # Health-related urgency (if applicable)
    "Seat Issues",        # Unauthorized occupation can lead to confrontations
]
medium_priority = [
    "Delay",              # Affecting punctuality, cascading impact
    "Cleanliness",        # Unhygienic washrooms, garbage
    "Food",               # Stale/unsafe food, poor catering
    "Facilities",         # AC, lights, charging points, water not working
]
low_priority = [
    "Ticketing",          # App/payment issues, refund delays
    "Information Display",# LED screens, announcements
    "Other",              # Feedbacks or vague reports
]


# In[23]:


print(df.columns)
df = df[["Complaint_Text", "Dominant_Category", ]].dropna()


# In[24]:


# Function to assign the highest priority among multiple categories
df = pd.read_excel("Categorized_Complaints.xlsx")
def assign_priority(categories_str):
    categories = [cat.strip() for cat in categories_str.split(",")]

    if any(cat in high_priority for cat in categories):
        return "High"
    elif any(cat in medium_priority for cat in categories):
        return "Medium"
    elif any(cat in low_priority for cat in categories):
        return "Low"
    else:
        return "Low"  # Default fallback

# Apply to Matched_Categories column
df["Priority"] = df["Categories"].apply(assign_priority)


# In[25]:


# Save prioritized version
df.to_excel("Prioritized_Complaints.xlsx", index=False)
print("✅ Prioritized complaints saved as Prioritized_Complaints.xlsx")


# In[26]:


severity_keywords = {
    "Critical": [
        "fight", "fire", "harass", "threat", "theft", "robbery", "unconscious",
        "bleeding", "danger", "no police", "violence", "emergency", "chain pull", "injury", "dead", "deadly", "criminals", "weapon", "gun", "knife", "bomb", "explosion", "accident", 
    ],
    "Moderate": [
        "misbehave", "abus", "argu", "delay", "stolen", "suspicious", "lost bag", "verbal",
        "rude", "seat taken", "dirty toilet", "malfunction", "broken", "power cut", "drunk", "unhygienic",  "no safety", "no security", "no guard", "no police", "no service",
    ],
    "Mild": [
        "late", "no fan", "bedroll", "blanket issue", "no water", "dirty", "no light", 
        "seat change", "ticket error", "app issue", "refund delay", "wrong seat", "wrong name",
        "wrong ticket", "wrong berth", "wrong train", "wrong platform", "wrong time", "wrong date", "wrong route", "wrong destination", "wrong origin", "wrong station", "wrong location", "wrong destination", 
    ]
}


# In[27]:


def assign_severity(text, priority):
    text = str(text).lower()
    
    # Only assign severity for high and medium priorities
    if priority not in ["High", "Medium"]:
        return None
    
    for keyword in severity_keywords["Critical"]:
        if keyword in text:
            return "Critical"
    for keyword in severity_keywords["Moderate"]:
        if keyword in text:
            return "Moderate"
    for keyword in severity_keywords["Mild"]:
        if keyword in text:
            return "Mild"
    # If no keyword matched
    return "Mild"

# df["Severity"] = df.apply(lambda row: assign_severity(row["Complaint_Text"], row["Priority"]), axis=1)


# In[28]:


low_priority_severity_keywords = {
    "Moderate": [
        "fail", "cancel", "not working", "error", "no response", "refund", "wrong ticket",
        "wrong name", "pnr not found", "booking issue", "payment issue", "gateway", "transaction",
        "can't board", "invalid pnr", "double booking", "seat not confirmed", "payment deducted",
        "ticket not received", "server error", "deducted money", "no ticket", "no refund", "refund not received", "refund not processed", 
    ],
    "Mild": [
        "problem in app", "site down", "app issue", "invalid", "delay in app", "wait list",
        "wrong info", "mistake", "can't book", "slow", "ticket pending", "login issue", 
        "not updated", "stuck", "glitch", "long time", "temporary issue", "lag", "hang", "crash", "frozen", "no response", "not working",
        "not available", "not reachable", "not responding", "not functioning", "not operable", "not accessible",
        "not usable", "not supported", "not compatible", "not recognized", "not detected", "not found",
    ],
    "Negligible": [
        "minor issue", "question", "info", "general query", "load time", "typo", "spelling error",
        "confusing interface", "suggestion", "feedback", "layout issue", "design problem",
        "unclear instruction", "language option", "request", "how to", "need help", "complaint number", "contact number", "contact details", "contact info", "phone number", "email address", "email id", "email", "phone", "mobile number", "mobile", "address", "location", "city", "state", "country",
        "zip code", "postal code", "pincode", "area code", "country code", "region", "district", "town", "village", "suburb", "neighborhood", "locality", "landmark", "street", "road", "avenue", "boulevard",
        "lane", "alley", "court", "place", 
    ]
}


# In[29]:


def assign_low_priority_severity(text, priority):
    text = str(text).lower()

    if priority != "Low":
        return None  # Only process low priority complaints

    for keyword in low_priority_severity_keywords["Moderate"]:
        if keyword in text:
            return "Moderate"
    for keyword in low_priority_severity_keywords["Mild"]:
        if keyword in text:
            return "Mild"
    for keyword in low_priority_severity_keywords["Negligible"]:
        if keyword in text:
            return "Negligible"
    
    return "Mild"  # Default fallback


# In[30]:


# First apply high & medium severity
df["Severity"] = df.apply(lambda row: assign_severity(row["Complaint_Text"], row["Priority"]), axis=1)

# Now apply low priority severity where needed
df["Severity"] = df.apply(
    lambda row: assign_low_priority_severity(row["Complaint_Text"], row["Priority"]) if row["Severity"] is None else row["Severity"],
    axis=1
)


# In[31]:


# Save Severity version
df.to_excel("Severity_Prioritized_Complaints.xlsx", index=False)
print("✅ Severity Prioritized complaints saved as Severity_Prioritized_Complaints.xlsx")


# In[32]:


# Function to test a single input query
def process_query(query):
    # query_sentiment = get_sentiment(query)
    
    query_sentiment = classify_sentiment_safe(query)[0]
    query_sentiment_score = classify_sentiment_safe(query)[1]
    categories_found = get_matching_categories(query)

    dominant = find_dominant_category(categories_found)
    priority = assign_priority(dominant)
    severity = assign_severity(query, priority)
    return {
        "Query": query,
        "Sentiment_Label": query_sentiment,
        "Sentiment_Confidence": query_sentiment_score,
        "Categories": categories_found,
        "Dominant_Category": dominant,
        "Priority": priority,
        "Severity": severity
    }



# In[53]:


# Example:
query_result = process_query("seat is occupied by someone else")
print(query_result)


# In[39]:


import pandas as pd

# Load existing file if exists
try:
    df = pd.read_excel("Final_Complaints.xlsx")
    last_serial = df["NO."].max() if "NO." in df.columns else 0
except FileNotFoundError:
    df = pd.DataFrame(columns=[
        "NO.", "Complaint_Text", "Sentiment", "Sentiment_Score", "Categories",
        "Dominant_Category", "Priority", "Severity"
    ])
    last_serial = 0

# Sample input query
query = "Fire in Coach No. B1, please help!"
query_result = process_query(query)

# Rename key
query_result["Complaint_Text"] = query_result.pop("Query")

# Create a one-row DataFrame
query_df = pd.DataFrame([query_result])

# Add serial number based on current Excel row
query_df.insert(0, "NO.", last_serial + 1)

# Append to the original DataFrame
df = pd.concat([df, query_df], ignore_index=True)

# Save updated DataFrame
df.to_excel("Final_Complaints.xlsx", index=False)

print(f"✅ Complaint added as row {last_serial + 1} and saved to Final_Complaints.xlsx")


# In[ ]:





# In[40]:


import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer


# In[41]:


# Load data
df = pd.read_excel("Final_Complaints.xlsx")
df = df[df['Complaint_Text'].notna()]
df['Priority_Level'] = df['Severity'].str.capitalize()


# In[42]:


# Encode labels
label_encoder = LabelEncoder()
df['label'] = label_encoder.fit_transform(df['Priority_Level'])


# In[43]:


# TF-IDF vectorization
vectorizer = TfidfVectorizer(max_features=5000)
X = vectorizer.fit_transform(df['Complaint_Text']).toarray()
y = df['label'].values


# In[44]:


# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)


# In[45]:


X.shape, y.shape


# In[46]:


# Custom Dataset
class ComplaintDataset(Dataset):
    def __init__(self, X, y):
        self.X = torch.tensor(X, dtype=torch.float32)
        self.y = torch.tensor(y, dtype=torch.long)

    def __len__(self):
        return len(self.X)

    def __getitem__(self, idx):
        return self.X[idx], self.y[idx]


# In[47]:


train_data = ComplaintDataset(X_train, y_train)
test_data = ComplaintDataset(X_test, y_test)

train_loader = DataLoader(train_data, batch_size=32, shuffle=True)
test_loader = DataLoader(test_data, batch_size=32)


# In[48]:


# Model Definition
class ComplaintClassifier(nn.Module):
    def __init__(self, input_dim, hidden_dim, output_dim):
        super(ComplaintClassifier, self).__init__()
        self.fc1 = nn.Linear(input_dim, hidden_dim)
        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(0.3)
        self.fc2 = nn.Linear(hidden_dim, output_dim)

    def forward(self, x):
        out = self.fc1(x)
        out = self.relu(out)
        out = self.dropout(out)
        out = self.fc2(out)
        return out


# In[49]:


# Initialize model
input_dim = X_train.shape[1]
hidden_dim = 128
output_dim = len(label_encoder.classes_)

model = ComplaintClassifier(input_dim, hidden_dim, output_dim)
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)


# In[50]:


# Training
num_epochs = 10
model.train()
for epoch in range(num_epochs):
    total_loss = 0
    for X_batch, y_batch in train_loader:
        optimizer.zero_grad()
        outputs = model(X_batch)
        loss = criterion(outputs, y_batch)
        loss.backward()
        optimizer.step()
        total_loss += loss.item()
    print(f"Epoch [{epoch+1}/{num_epochs}], Loss: {total_loss:.4f}")


# In[51]:


# Evaluation
model.eval()
y_preds = []
y_true = []

with torch.no_grad():
    for X_batch, y_batch in test_loader:
        outputs = model(X_batch)
        _, predicted = torch.max(outputs, 1)
        y_preds.extend(predicted.tolist())
        y_true.extend(y_batch.tolist())

print("\n🧾 Classification Report:\n")
print(classification_report(y_true, y_preds, target_names=label_encoder.classes_))


# In[52]:


def predict_priority_pytorch(query):
    model.eval()
    query_vec = vectorizer.transform([query]).toarray()
    query_tensor = torch.tensor(query_vec, dtype=torch.float32)
    with torch.no_grad():
        output = model(query_tensor)
        predicted = torch.argmax(output, dim=1).item()
    return label_encoder.inverse_transform([predicted])[0]

# Example usage
query = "My seat was broken and the staff didn't respond"
print("Predicted Severity:", predict_priority_pytorch(query))


# In[ ]:




