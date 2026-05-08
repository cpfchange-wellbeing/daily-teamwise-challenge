# Daily TeamWise Challenge

เว็บเกม Daily TeamWise Challenge สำหรับให้พนักงานตอบวันละ 2 คำถาม:

1. มุมหัวหน้า
2. มุมลูกน้อง / Team Member

## สิ่งที่มีใน MVP นี้

- ลงทะเบียนครั้งแรกด้วย Employee ID, ชื่อจริง, ชื่อเล่น, ทีม/แผนก, บทบาทหลัก
- จำผู้เล่นบนเครื่องเดิมด้วย `localStorage`
- หน้า Welcome Back พร้อม campaign tone
- Question Bank Day 1–7 รวม 14 ข้อ
- เลือกคำถามตามวันแบบวนรอบ 7 วัน
- คะแนนเต็มวันละ 20 คะแนน
- Result, Reflection, Micro Tip
- Ranking mockup + คะแนนที่เล่นจริงบนเครื่องนั้น

## วิธีรันในเครื่อง

```bash
npm install
npm run dev
```

จากนั้นเปิด:

```text
http://localhost:3000
```

## วิธี deploy ขึ้น Vercel

1. อัปโหลดโปรเจกต์นี้ขึ้น GitHub
2. เข้า Vercel
3. กด Add New Project
4. เลือก repository นี้
5. กด Deploy

## หมายเหตุ

เวอร์ชันนี้ยังใช้ `localStorage` จึงเหมาะกับ demo / prototype ก่อนเชื่อม Supabase จริงในขั้นถัดไป
