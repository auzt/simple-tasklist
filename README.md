# Simple Tasklist Application

Aplikasi web Tasklist sederhana yang responsif, modern, dan modular menggunakan Go (Gin + GORM) di backend dan Next.js (Tailwind + TypeScript) di frontend.

## Cara Menjalankan

### Persyaratan
- Docker dan Docker Compose
- Database Postgres `dev-postgres` (sudah berjalan di port `5432` server)

### Menjalankan Project
```bash
docker compose up --build -d
```

## API Specification (Go Backend)
- `GET /api/v1/tasks` - Mengambil semua daftar tugas
- `POST /api/v1/tasks` - Menambahkan tugas baru
- `PUT /api/v1/tasks/:id` - Memperbarui judul/status tugas
- `DELETE /api/v1/tasks/:id` - Menghapus satu tugas
- `DELETE /api/v1/tasks/completed` - Menghapus semua tugas yang selesai
