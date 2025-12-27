FROM node:18

# Install Python and pip
RUN apt-get update || : && apt-get install -y python3 python3-pip python3-venv

# Create app directory
WORKDIR /usr/src/app

# Copy Python requirements and install
COPY requirements.txt ./
# Fix for potential externally managed environment error in newer debian/ubuntu images
# We use --break-system-packages or use a venv. Simplest for docker is break-system-packages or just pip install if allowed.
# Safe approach: create virtual env
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install -r requirements.txt

# Copy Node.js dependencies and install
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Expose ports (Node: 5001, Python: 5000)
# Render only exposes one port publicly (usually defined by PORT env var, defaults to 10000 or similar).
# Node app is the PUBLIC facing app (Port 5001/PORT). 
# Python app is INTERNAL (Port 5000).

EXPOSE 5001

# Copy start script
COPY start.sh .
RUN chmod +x start.sh

CMD ["./start.sh"]
