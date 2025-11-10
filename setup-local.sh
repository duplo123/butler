#!/bin/bash

echo "🚀 Setting up Summer Schedule Planner for local development..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Start PostgreSQL with Docker Compose
echo "🐘 Starting PostgreSQL database..."
docker-compose up -d

# Wait for PostgreSQL to be healthy
echo "⏳ Waiting for database to be ready..."
until docker-compose exec -T postgres pg_isready -U summer_user -d summer_planner > /dev/null 2>&1; do
    printf "."
    sleep 1
done
echo ""
echo "✅ Database is ready"
echo ""

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Push database schema
echo "📊 Creating database tables..."
npx prisma db push --accept-data-loss

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Run: npm run dev"
echo "   2. Open: http://localhost:3000"
echo ""
echo "🗄️  Database Management:"
echo "   - View data: npx prisma studio"
echo "   - Stop database: docker-compose down"
echo "   - Reset database: docker-compose down -v (⚠️  deletes all data)"
echo ""
