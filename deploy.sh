#!/bin/bash

echo "🚀 Deploy boshlandi..."

# 1. Yangi kodni olish
echo "📥 Git pull..."
git pull

# 2. Backend dependencies (agar package.json o'zgargan bo'lsa)
echo "📦 Backend npm install..."
npm install

# 3. Backend restart
echo "🔄 Backend restart..."
pm2 restart lms-backend

# 4. Frontend build
echo "🏗️  Frontend build..."
cd frontend
npm install
npm run build
cd ..

echo "✅ Deploy tugadi!"
echo "🌐 Site: https://lms.sardorbekcoder.uz"
