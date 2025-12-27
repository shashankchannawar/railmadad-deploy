# ml_model.py
import sys
import json
from ml_core import process_query  # you can rename your notebook .py and import here

if __name__ == "__main__":
    input_text = sys.argv[1]
    result = process_query(input_text)
    print(json.dumps(result))
