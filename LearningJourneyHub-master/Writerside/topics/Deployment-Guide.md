# Deployment Guide

## 📌Part 1: Common Linux Commands

These commands are frequently used when deploying projects on a Linux-based server (e.g. Ubuntu VM on Azure):

| Command                         | Description                                                                 |
|----------------------------------|-----------------------------------------------------------------------------|
| `ls`                             | Lists files and directories in the current folder.                          |
| `cd folder/`                     | Changes into a directory. Use `cd ..` to move one level up.                |
| `mkdir folder_name`             | Creates a new directory.                                                   |
| `rm -rf folder/`                | Forcefully deletes a folder and all of its contents. ⚠️ Be careful!        |
| `cp source target`             | Copies files or directories. Add `-r` to copy folders recursively.         |
| `mv old_path new_path`         | Moves or renames files/folders.                                            |
| `nano file.txt`                | Opens a simple text editor to edit files. Useful for config files.         |
| `vim file.txt`                 | Opens the Vim text editor (more advanced).                                 |
| `pwd`                           | Prints the current directory path.                                         |
| `chmod -R 755 folder/`         | Sets executable and readable permissions on files and folders.             |
| `chown -R www-data:www-data /var/www/folder` | Changes ownership of a folder to the Nginx web server user.         |
| `ps aux | grep process_name`   | Finds running processes (e.g., to check if `uvicorn` is running).          |
| `kill PID`                     | Kills a process by its PID (Process ID).                                   |
| `df -h`                         | Shows disk usage in human-readable format.                                 |
| `top` or `htop`                 | Monitors real-time system resource usage (CPU, memory, etc.).              |
| `sudo reboot`                   | Reboots the server.                                                        |
| `sudo shutdown now`             | Immediately shuts down the server.                                         |

---

## Part 2: Server Selection and Setup

### ☁️ Step 1: Choose a Cloud Provider

We selected **Microsoft Azure** for hosting the backend services and frontend website.

#### Recommended Azure VM Configuration

| Component        | Recommended Value                |
|------------------|----------------------------------|
| OS               | Ubuntu 22.04 LTS                 |
| VM Size          | Standard B1s or B1ms (for testing), upgrade if needed |
| Disk Type        | Standard SSD                     |
| Region           | Nearest to target users          |

---

### 🛠 Step 2: Initial VM Setup (After SSH Login)

#### 🔐 Add SSH Key and Connect

Make sure your local system has SSH keys set up and your Azure VM allows SSH authentication.

```bash
ssh azureuser@<your-public-ip>
```

---

### 🧼 Step 3: Update and Install Essentials

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx git unzip ufw python3-pip python3-venv
```

---

### 🔐 Step 4: Secure the Server

Enable the firewall and allow essential services:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw allow 8000
sudo ufw enable
```

---

### 📁 Step 5: Suggested Directory Structure

```bash
/home/azureuser/
├── apps/
│   ├── personal-website/      # Spring Boot .jar
│   ├── react-website/         # React zipped build
│   ├── vue-website/           # Vue zipped build
│   ├── fastapi-quantumml/     # ML FastAPI project
│   └── fastApiProject/        # Lightweight FastAPI project
```

Each app lives in its own folder under `/home/azureuser/apps`.

---


## 🚀 Part 3: Deploy Backend Services (FastAPI + Spring Boot)

---

### 🐍 FastAPI Deployment (Python)

#### 📁 Project Setup

Your FastAPI project folder should contain:

```
fastApiProject/
├── main.py
├── requirements.txt
└── venv/ (optional, but best to recreate on the server)
```

##### ✅ 1. Create Virtual Environment and Install Dependencies

```bash
cd /home/azureuser/apps/fastApiProject

# Create venv
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt
```

##### ✅ 2. Run the FastAPI app with `uvicorn`

```bash
nohup venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
```

##### ✅ 3. Allow UFW for FastAPI

```bash
sudo ufw allow 8000
```

> 🔍 Visit your app: `http://<your-ip>:8000`  
> 🔒 Or behind Nginx: `https://meetyuwen.com/api`

---

### ☕ Spring Boot App Deployment

#### 📁 JAR Placement

Move your `.jar` file to the server:

```
/home/azureuser/apps/personal-website/personalwebsite-0.0.1-SNAPSHOT.jar
```

##### ✅ 1. Start Your Spring Boot App

```bash
cd /home/azureuser/apps/personal-website
nohup java -jar personalwebsite-0.0.1-SNAPSHOT.jar --server.port=9090 &
```

> 📌 You can change the port in `application.properties` if needed.

---

#### 🔁 Optional: Enable Auto Restart (Systemd)

You can create a `systemd` service for production FastAPI or Spring Boot apps to auto-start on boot.

```bash
sudo nano /etc/systemd/system/fastapi.service
```

Example `fastapi.service`:

```
[Unit]
Description=FastAPI Service
After=network.target

[Service]
User=azureuser
WorkingDirectory=/home/azureuser/apps/fastApiProject
ExecStart=/home/azureuser/apps/fastApiProject/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

Then:

```bash
sudo systemctl daemon-reexec
sudo systemctl enable fastapi
sudo systemctl start fastapi
```


---

## 📦 Part 4: Frontend Deployment & Nginx Reverse Proxy

---

### ⚛️ Deploying React Frontend

#### ✅ 1. Build and Upload

On your local machine:

```bash
npm run build
zip -r build.zip build
```

Then upload `build.zip` to your server and unzip to a folder like:

```
/var/www/portfolio/
```

You should see:

```
/var/www/portfolio/build/index.html
```

Then:

```bash
sudo mv /var/www/portfolio/build/* /var/www/portfolio/
```

(Optional cleanup)

```bash
sudo rm -r /var/www/portfolio/build
```

---

### 🌐 Deploying Vue Frontend

Same idea — once you `npm run build`:

```bash
zip -r dist.zip dist
```

Then upload to your server:

```
/var/www/residentialcomplex/
```

Then:

```bash
sudo mv /var/www/residentialcomplex/dist/* /var/www/residentialcomplex/
sudo rm -r /var/www/residentialcomplex/dist
```

---

### ⚙️ Nginx Reverse Proxy Setup

Edit Nginx config:

```bash
sudo nano /etc/nginx/sites-available/default
```

Update the server block:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name meetyuwen.com www.meetyuwen.com;

    root /var/www/portfolio;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /complex/ {
        root /var/www/residentialcomplex;
        try_files $uri $uri/ /index.html;
    }

    location /springapp/ {
        proxy_pass http://localhost:9090;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Then:

```bash
sudo nginx -t     # test config
sudo systemctl restart nginx
```

---

### ✅ Final UFW Rules (Firewall)

Make sure ports are open:

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

---

Now when you visit:

- `https://meetyuwen.com/` → React Homepage
- `https://meetyuwen.com/complex/` → Vue App
- `https://meetyuwen.com/springapp/` → Spring Boot API
- `https://meetyuwen.com/api/` → FastAPI Backend

🔥 You now have a full-stack cloud-deployed system!

---
