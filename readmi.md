# Camp Gallery App Architecture

## Goal

Build a lightweight camp image gallery app with:

- 🖼️ Pinterest-style image dashboard
- 👤 1 Admin + user dashboards
- ❄️ Clean, white, blank design
- 📱 Web-first

## Stack

| Layer | Choice |
| --- | --- |
| Frontend | React + TypeScript + CSS, Vite |
| Backend | FastAPI (or serverless functions) |
| Auth | Firebase Auth |
| Email | sendlib |
| Images | imgbb |
| Storage | sendbyte |
| Deployment | Vercel |

---

# Project Structure

```
camp-gallery/
│
├── backend/
│   ├── app/
│   ├── requirements.txt
│   └── main.py
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

# Development Flow

```
npm run dev
    │
    ▼
Develop and test
    │
    ▼
npm run build
    │
    ▼
dist/
```

The generated `dist` folder is the production website.

---

# Deployment

Deploy the `dist` folder to **Vercel**:

```
https://gallery.mycamp.com
```

---

# User Experience

## Role: Admin

Manages the whole gallery:

- Upload / delete images
- Moderate content
- Manage users
- View analytics

## Role: User

Pinterest-style dashboard:

- Browse images
- Search
- Favorites
- Albums
- Download

---

# UI Style

Minimal and clean:

- White background
- Blank / simple
- Card-based Pinterest grid
- Small accent color (single accent)

---

# Authentication

```
Firebase Auth
    │
    ├── Email / Password
    └── Google
    │
    ▼
FastAPI middleware
    │
    ▼
Album Permissions
```

Email notifications handled by **sendlib**.

---

# Image Handling

Images are hosted on **imgbb**:

- Lightweight
- Direct image URLs

Long-term / binary storage on **sendbyte**.

---

# Backend Architecture

```
React App
    │
    ▼
FastAPI
    │
 ├── Firebase Auth
 ├── sendbyte (storage)
 ├── sendlib (email)
 └── imgbb (images)
```

---

# Roles & Permissions

```
Admin
    │
    ▼
Manage everything
(users, uploads, albums)

Users
    │
    ▼
View / favorite / search / download
```

---

# Recommended Roadmap

## Phase 1

Build the complete lightweight web app.

Features:

- Firebase Auth + roles
- Admin upload dashboard
- User Pinterest grid dashboard
- Search
- Favorites
- Albums
- Downloads

Deploy to **Vercel**.

Collect feedback.

---

## Phase 2

Polish and expand:

- Push notifications
- More admin tools
- Per-user permissions
- Sync improvements

---

# Advantages

- Lightweight
- Minimal design
- Cheap to run
- Vercel = fast global deploys
- Firebase = no server auth setup
- Quick to build
- Easy to maintain