# iTech Academy Admin Panel

## Texnologiyalar

- **React 18** (TypeScript)
- **React Query** (data fetching & cache)
- **React Router v6**
- **Tailwind CSS** (UI)
- **Lucide React** (ikonlar)
- **Radix UI** (accessible UI)
- **React Hook Form** (formlar)
- **Recharts** (diagrammalar)
- **Axios** (API)
- **Vite** (build tool)

## Production uchun tayyorlash

### 1. Build qilish

```bash
npm install
npm run build
```

- Build natijasi `dist/` papkasida bo‘ladi.
- Static server (nginx, vercel, netlify, s3, docker) orqali serve qilinadi.

### 2. Environment sozlamalari

`.env` yoki `env.example` faylidan nusxa oling va quyidagilarni to‘ldiring:

```
VITE_API_URL=https://api.itech-academy.uz
```

- **Eslatma:** Maxfiy ma’lumotlar (token, API key) frontendda saqlanmasin.

### 3. Deployment

- **Docker:**
  - Dockerfile yozilgan bo‘lsa, `docker build -t itech-admin . && docker run -p 80:80 itech-admin`
- **Nginx:**
  - `dist/` papkasini nginx static root’ga ko‘chiring.
- **Vercel/Netlify:**
  - `npm run build` → `dist/` ni deploy qiling.

### 4. Best Practices

- **HTTPS** ishlating.
- **CORS** backendda to‘g‘ri sozlangan bo‘lishi kerak.
- **API URL** productionda to‘g‘ri ko‘rsatilganini tekshiring.
- **.env** va maxfiy fayllarni git’da saqlamang.
- **Linter va testlar**: `npm run lint` (agar mavjud bo‘lsa)

### 5. Monitoring va Health

- Sentry, LogRocket yoki boshqa monitoring integratsiyasi tavsiya etiladi.
- Build va deploydan so‘ng barcha sahifalar va asosiy funksiyalarni test qiling.

---

## Qisqacha

- Kodlar toza, barcha matnlar o‘zbekcha, UI zamonaviy.
- Barcha CRUD, login, toast, modal, diagramma va boshqalar to‘g‘ri ishlaydi.
- **Savollar yoki muammolar bo‘lsa, dev jamoaga murojaat qiling!**
