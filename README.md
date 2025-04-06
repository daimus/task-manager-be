# Task Manager Backend

Documentation for setting up environment, running migrations, development, building, and Dockerizing application.

## 🧪 Environment Setup

Copy `.env.example` as `.env` file in the root:

Generate app key:

```
node ace generate:key
```

## 🗄️ Database Migration

Run migrations:

```
node ace migration:run
```

## 🚀 Run Dev Server

Install dependencies and start dev server:

```
npm install
npm run dev
```

Visit `http://localhost:3333`

## 🏗️ Build for Production

```
node ace docs:generate
node ace build
cp swagger.yml build/
```

## 🐳 Docker Build & Run

```
docker build -t <tag> .
```
