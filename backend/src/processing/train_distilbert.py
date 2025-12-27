import pandas as pd
import ast
import torch
from torch.utils.data import Dataset, DataLoader
from sklearn.preprocessing import MultiLabelBinarizer
from transformers import (
    DistilBertTokenizerFast,
    DistilBertForSequenceClassification,
    Trainer,
    TrainingArguments
)

# ---------------------------------------
# 1. Load CSV
# ---------------------------------------
df = pd.read_csv("labeled_complaints.csv")

# Convert string list → Python list
df["labels"] = df["labels"].apply(lambda x: ast.literal_eval(x))

# ---------------------------------------
# 2. Define categories
# ---------------------------------------
CATEGORIES = [
    "Medical Emergency",
    "Facility Cleaning",
    "Coach Maintenance",
    "Food Services",
    "Emergency Services",
    "Safety",
    "Operational Issues",
    "Seat Issues",
    "Others"
]

mlb = MultiLabelBinarizer(classes=CATEGORIES)
df["label_vec"] = mlb.fit_transform(df["labels"]).tolist()

# ---------------------------------------
# 3. Create Dataset Class
# ---------------------------------------
class ComplaintDataset(Dataset):
    def __init__(self, texts, labels, tokenizer):
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, idx):
        enc = self.tokenizer(
            self.texts[idx],
            padding="max_length",
            truncation=True,
            max_length=256,
            return_tensors="pt"
        )
        return {
            "input_ids": enc["input_ids"].squeeze(),
            "attention_mask": enc["attention_mask"].squeeze(),
            "labels": torch.tensor(self.labels[idx], dtype=torch.float)
        }

# ---------------------------------------
# 4. Load Tokenizer + Model
# ---------------------------------------
tokenizer = DistilBertTokenizerFast.from_pretrained("distilbert-base-uncased")

dataset = ComplaintDataset(
    df["complaint_text"].tolist(),
    df["label_vec"].tolist(),
    tokenizer
)

model = DistilBertForSequenceClassification.from_pretrained(
    "distilbert-base-uncased",
    num_labels=len(CATEGORIES),
    problem_type="multi_label_classification"
)

# ---------------------------------------
# 5. Training Arguments (for v4.57.3)
# ---------------------------------------
training_args = TrainingArguments(
    output_dir="./distilbert_model",
    per_device_train_batch_size=8,
    num_train_epochs=3,
    learning_rate=5e-5,
    weight_decay=0.01,
    logging_steps=50,
    save_total_limit=1,
    report_to="none"    # disable wandb/azure/mlflow logs
)

# ---------------------------------------
# 6. Trainer
# ---------------------------------------
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset
)

# ---------------------------------------
# 7. Train & Save
# ---------------------------------------
trainer.train()

trainer.save_model("./distilbert_model")
tokenizer.save_pretrained("./distilbert_model")

print("\n🚀 Model successfully trained & saved to ./distilbert_model/")
