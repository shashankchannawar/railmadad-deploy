#!/bin/bash

# Start Python Chatbot Server in the background
# We assume the virtual environment is in PATH or dependencies are installed globally/user-level
python src/python/chatbot.py &

# Start Node.js API Server
npm run start
