# Deployment Guide for Server 143.198.228.249

## ?? Production Deployment Steps

### 1. Server Preparation

First, ensure your server has the required software:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (v18 LTS recommended)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Install PM2 for process management
sudo npm install -g pm2
```

### 2. Project Deployment

```bash
# Clone the repository
git clone https://github.com/Daniel-Gomez94/Team13_LargeProject.git
cd Team13_LargeProject

# Install all dependencies
npm run install-all

# Build the frontend
npm run build
```

### 3. Environment Configuration

Create production environment file:

```bash
cd Backend
cp .env .env.production
```

Edit the production environment file:

```bash
nano .env.production
```

Set the following values:

```env
# Production Environment Variables
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/ucf_coding_practice
JWT_SECRET=your_super_secure_production_jwt_secret_key_here
RAPIDAPI_KEY=7f086cd239msh46b973a3ab8a5d8p12c5d8jsn6cb22918b98c
HOST=0.0.0.0
PORT=5000
```

### 4. Database Setup

Initialize the database with questions:

```bash
cd Backend
NODE_ENV=production node seedDatabase.js
```

### 5. Start the Application

#### Option A: Using PM2 (Recommended for production)

Create PM2 ecosystem file:

```bash
# In the Backend directory
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'ucf-coding-practice',
    script: 'server.js',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000,
      HOST: '0.0.0.0'
    }
  }]
}
EOF

# Start with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

#### Option B: Direct start

```bash
cd Backend
NODE_ENV=production npm start
```

### 6. Firewall Configuration

Configure UFW to allow necessary ports:

```bash
# Allow SSH (if not already configured)
sudo ufw allow 22

# Allow HTTP and HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Allow the application port
sudo ufw allow 5000

# Enable firewall
sudo ufw enable
```

### 7. Nginx Setup (Optional but recommended)

Install and configure Nginx as a reverse proxy:

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx configuration
sudo cat > /etc/nginx/sites-available/ucf-coding-practice << 'EOF'
server {
    listen 80;
    server_name 143.198.228.249;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable the site
sudo ln -s /etc/nginx/sites-available/ucf-coding-practice /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 8. Access the Application

Your application will be accessible at:

- **Direct Node.js**: http://143.198.228.249:5000
- **With Nginx**: http://143.198.228.249

### 9. Monitoring and Logs

```bash
# View PM2 status
pm2 status

# View logs
pm2 logs ucf-coding-practice

# Monitor resources
pm2 monit

# Restart application
pm2 restart ucf-coding-practice
```

### 10. SSL Certificate (Recommended)

Install Let's Encrypt for HTTPS:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate (if you have a domain)
# sudo certbot --nginx -d yourdomain.com

# Or generate self-signed certificate for IP
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/selfsigned.key \
    -out /etc/ssl/certs/selfsigned.crt
```

## ?? Troubleshooting

### Common Issues:

1. **Port already in use**:
   ```bash
   sudo lsof -i :5000
   sudo kill -9 <PID>
   ```

2. **MongoDB connection issues**:
   ```bash
   sudo systemctl status mongod
   sudo systemctl restart mongod
   ```

3. **PM2 not starting on boot**:
   ```bash
   pm2 unstartup
   pm2 startup
   pm2 save
   ```

4. **Check application logs**:
   ```bash
   pm2 logs ucf-coding-practice --lines 100
   ```

### Environment Variables Check:

```bash
# Verify environment variables are loaded
cd Backend
node -e "require('dotenv').config(); console.log(process.env.NODE_ENV, process.env.PORT, process.env.HOST)"
```

## ?? Maintenance

### Regular Tasks:

1. **Update dependencies**:
   ```bash
   npm update
   cd Backend && npm update
   cd ../Frontend && npm update
   ```

2. **Backup database**:
   ```bash
   mongodump --db ucf_coding_practice --out /backup/$(date +%Y%m%d)
   ```

3. **Update application**:
   ```bash
   git pull origin main
   npm run build
   pm2 restart ucf-coding-practice
   ```

Your MERN application is now configured to run on server 143.198.228.249!