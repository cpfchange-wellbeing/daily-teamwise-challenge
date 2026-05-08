import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trophy, HeartHandshake, Users, Sparkles, RotateCcw, CheckCircle2, CalendarDays } from "lucide-react";

const STORAGE_KEY = "teamwise_player_v1";
const ATTEMPT_KEY = "teamwise_attempts_v1";

const roleLabels = {
  leader: "หัวหน้า",
  member: "ลูกน้อง / Team Member",
};

function todayKey() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });
}

function getDayIndex(dateKey) {
  const startDate = new Date("2026-05-08T00:00:00+07:00");
  const currentDate = new Date(`${dateKey}T00:00:00+07:00`);
  const diffDays = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
  return ((diffDays % 7) + 7) % 7;
}

const questionBank = [
  {
    day: 1,
    leader: {
      id: "D1-L",
      roleType: "leader",
      title: "มุมหัวหน้า",
      theme: "Feedback & Accountability",
      competency: "การให้ feedback และการสร้างความรับผิดชอบ",
      scenario: "ลูกทีมส่งงานช้ากว่ากำหนดเป็นครั้งที่สอง และไม่ได้แจ้งล่วงหน้าว่าจะส่งไม่ทัน",
      question: "ในฐานะหัวหน้า คุณควรเริ่มต้นอย่างไร?",
      options: [
        { id: "D1L-A", label: "A", text: "ตำหนิทันที เพื่อให้เขารู้ว่าสิ่งนี้ยอมรับไม่ได้", score: 2 },
        { id: "D1L-B", label: "B", text: "เรียกคุยส่วนตัว ถามสาเหตุ และตกลงวิธีป้องกันไม่ให้เกิดซ้ำร่วมกัน", score: 10 },
        { id: "D1L-C", label: "C", text: "ไม่พูดอะไรตอนนี้ แต่จำไว้ใช้ประกอบการประเมินผลงานปลายปี", score: 1 },
        { id: "D1L-D", label: "D", text: "ดึงงานกลับมาทำเอง เพื่อให้มั่นใจว่างานจะเสร็จทัน", score: 4 },
      ],
      bestOptionId: "D1L-B",
      explanation: "การพูดคุยส่วนตัวช่วยรักษาศักดิ์ศรีของลูกทีม และการถามสาเหตุก่อนตัดสินช่วยให้หัวหน้าเข้าใจปัญหาที่แท้จริง ขณะเดียวกันการตกลงวิธีป้องกันร่วมกันยังช่วยสร้าง accountability โดยไม่ทำลายความไว้วางใจ",
      microTip: "Feedback ที่ดีไม่ใช่การตำหนิ แต่คือการทำให้พฤติกรรมดีขึ้นอย่างชัดเจนและปลอดภัยพอให้คนกล้าปรับตัว",
    },
    member: {
      id: "D1-M",
      roleType: "member",
      title: "มุมลูกน้อง",
      theme: "แจ้งปัญหาล่วงหน้า",
      competency: "Ownership & Communication",
      scenario: "คุณเริ่มเห็นว่างานที่รับมาอาจเสร็จไม่ทัน deadline",
      question: "ในฐานะสมาชิกทีม คุณควรทำอย่างไร?",
      options: [
        { id: "D1M-A", label: "A", text: "รอให้ใกล้ deadline ก่อน เพราะอาจยังทำทัน", score: 2 },
        { id: "D1M-B", label: "B", text: "ขอให้เพื่อนช่วยทำแทน โดยไม่แจ้งหัวหน้า", score: 3 },
        { id: "D1M-C", label: "C", text: "ส่งงานเท่าที่มี แม้ยังไม่ครบ เพื่อให้ถือว่าส่งแล้ว", score: 5 },
        { id: "D1M-D", label: "D", text: "แจ้งหัวหน้าล่วงหน้า พร้อมบอกสาเหตุ ทางเลือก และเวลาที่คาดว่าจะทำเสร็จ", score: 10 },
      ],
      bestOptionId: "D1M-D",
      explanation: "การแจ้งล่วงหน้าพร้อมทางเลือกแสดงถึงความรับผิดชอบ ไม่ใช่การโยนปัญหาให้หัวหน้า แต่เป็นการช่วยให้ทีมมีเวลาตัดสินใจและจัดลำดับงานใหม่ได้ทัน",
      microTip: "การแจ้งปัญหาเร็วไม่ได้แปลว่าคุณทำงานไม่ดี แต่แปลว่าคุณรับผิดชอบต่อผลลัพธ์ของทีม",
    },
  },
  {
    day: 2,
    leader: {
      id: "D2-L",
      roleType: "leader",
      title: "มุมหัวหน้า",
      theme: "Psychological Safety",
      competency: "การสร้างพื้นที่ปลอดภัยในการสื่อสาร",
      scenario: "ในการประชุมทีม ทุกคนเงียบเมื่อคุณถามว่า “มีปัญหาอะไรไหม” แต่หลังประชุมคุณได้ยินว่าหลายคนมีข้อกังวล",
      question: "ในฐานะหัวหน้า คุณควรทำอย่างไร?",
      options: [
        { id: "D2L-A", label: "A", text: "สร้างวิธีให้ทีมพูดได้ง่ายขึ้น เช่น ถามเป็นรายคน เปิดช่องทาง anonymous หรือเริ่มจากการยอมรับว่าทุกความเห็นมีคุณค่า", score: 10 },
        { id: "D2L-B", label: "B", text: "บอกทีมว่าครั้งหน้าถ้ามีปัญหาต้องพูดในห้องประชุมเท่านั้น", score: 4 },
        { id: "D2L-C", label: "C", text: "เลือกถามเฉพาะคนที่พูดเก่ง เพราะจะได้ไม่เสียเวลา", score: 3 },
        { id: "D2L-D", label: "D", text: "สรุปเองว่าไม่มีปัญหา เพราะไม่มีใครพูดในที่ประชุม", score: 1 },
      ],
      bestOptionId: "D2L-A",
      explanation: "ความเงียบในทีมไม่ได้แปลว่าไม่มีปัญหา แต่อาจแปลว่าคนยังไม่รู้สึกปลอดภัยพอที่จะพูด หัวหน้าจึงควรออกแบบพื้นที่และวิธีสื่อสารที่ลดความกลัวการถูกตัดสิน",
      microTip: "ถ้าอยากให้คนกล้าพูด หัวหน้าต้องทำให้เขาเชื่อว่าการพูดความจริงจะไม่ทำให้เขาเสียความปลอดภัย",
    },
    member: {
      id: "D2-M",
      roleType: "member",
      title: "มุมลูกน้อง",
      theme: "กล้าพูดอย่างมืออาชีพ",
      competency: "Professional Communication",
      scenario: "คุณเห็นว่ามีแผนงานบางอย่างอาจทำให้ทีมเจอปัญหา แต่ในที่ประชุมยังไม่มีใครพูดถึงเรื่องนี้",
      question: "คุณควรแสดงความเห็นอย่างไร?",
      options: [
        { id: "D2M-A", label: "A", text: "เงียบไว้ เพราะไม่อยากขัดความเห็นของหัวหน้า", score: 2 },
        { id: "D2M-B", label: "B", text: "บ่นกับเพื่อนหลังประชุมว่าแผนนี้น่าจะมีปัญหา", score: 1 },
        { id: "D2M-C", label: "C", text: "พูดด้วยข้อมูลและความเคารพ เช่น “ขออนุญาตเสนอประเด็น/ ปัญหา/ ความเสี่ยง หนึ่งจุดที่เราอาจต้องเตรียมแผนรองรับ”", score: 10 },
        { id: "D2M-D", label: "D", text: "พูดแรง ๆ ในที่ประชุม เพื่อให้ทุกคนเห็นว่าปัญหานี้สำคัญ", score: 4 },
      ],
      bestOptionId: "D2M-C",
      explanation: "การกล้าพูดไม่จำเป็นต้องขัดแย้งหรือโจมตีใคร หากสื่อสารด้วยข้อมูล ความเคารพ และเจตนาช่วยทีม จะทำให้ความเห็นของคุณมีน้ำหนักและสร้างประโยชน์ต่อการตัดสินใจ",
      microTip: "การพูดอย่างมืออาชีพคือการกล้าบอกความจริงโดยไม่ทำร้ายความสัมพันธ์",
    },
  },
  {
    day: 3,
    leader: {
      id: "D3-L",
      roleType: "leader",
      title: "มุมหัวหน้า",
      theme: "Delegation",
      competency: "การมอบหมายงานอย่างชัดเจน",
      scenario: "คุณมอบหมายงานสำคัญให้ลูกทีม แต่เมื่อถึงเวลาส่ง งานไม่ตรงกับที่คุณคาดหวัง",
      question: "คุณควรทบทวนและปรับวิธีทำงานอย่างไร?",
      options: [
        { id: "D3L-A", label: "A", text: "สรุปว่าลูกทีมยังไม่พร้อมรับงานสำคัญ และครั้งหน้าทำเองจะดีกว่า", score: 3 },
        { id: "D3L-B", label: "B", text: "บอกลูกทีมว่า “ควรเข้าใจเอง” เพราะเป็นงานในความรับผิดชอบของเขา", score: 2 },
        { id: "D3L-C", label: "C", text: "แก้งานให้เองทั้งหมดโดยไม่อธิบาย เพื่อประหยัดเวลา", score: 4 },
        { id: "D3L-D", label: "D", text: "ทบทวนว่าตอนมอบหมายงาน คุณสื่อสารเป้าหมาย ขอบเขต deadline และผลลัพธ์ที่คาดหวังชัดพอหรือไม่", score: 10 },
      ],
      bestOptionId: "D3L-D",
      explanation: "การมอบหมายงานที่ดีไม่ใช่แค่บอกว่าให้ทำอะไร แต่ต้องสื่อสารผลลัพธ์ที่ต้องการ เกณฑ์ความสำเร็จ ขอบเขตงาน และจุดที่ต้องรายงานความคืบหน้าให้ชัดเจน",
      microTip: "งานที่ออกมาไม่ตรงใจ อาจไม่ได้เกิดจากคนทำไม่เก่งเสมอไป แต่อาจเกิดจาก brief ที่ไม่ชัดพอ",
    },
    member: {
      id: "D3-M",
      roleType: "member",
      title: "มุมลูกน้อง",
      theme: "Ownership",
      competency: "ความเป็นเจ้าของงาน",
      scenario: "คุณได้รับมอบหมายงานใหม่ แต่ยังไม่แน่ใจว่าผลลัพธ์ที่หัวหน้าต้องการคืออะไร",
      question: "คุณควรทำอย่างไร?",
      options: [
        { id: "D3M-A", label: "A", text: "ถามให้ชัดเจนก่อนเริ่ม เช่น เป้าหมาย deadline รูปแบบงาน และเกณฑ์ที่ถือว่างานสำเร็จ", score: 10 },
        { id: "D3M-B", label: "B", text: "เริ่มทำไปก่อน แล้วค่อยแก้เมื่อหัวหน้าติ", score: 4 },
        { id: "D3M-C", label: "C", text: "ถามเพื่อนแทน เพราะไม่อยากรบกวนหัวหน้า", score: 5 },
        { id: "D3M-D", label: "D", text: "รอให้หัวหน้าอธิบายเพิ่มเอง หากเรื่องนี้สำคัญจริง", score: 1 },
      ],
      bestOptionId: "D3M-A",
      explanation: "Ownership ไม่ได้แปลว่าต้องทำเองทุกอย่างโดยไม่ถาม แต่คือการรับผิดชอบให้ตัวเองเข้าใจงานก่อนเริ่ม เพื่อเพิ่มโอกาสให้งานออกมาตรงเป้าหมาย",
      microTip: "คนที่มี ownership จะไม่รอให้ทุกอย่างชัดเอง แต่จะช่วยทำให้ความคาดหวังชัดขึ้นตั้งแต่ต้น",
    },
  },
  {
    day: 4,
    leader: {
      id: "D4-L",
      roleType: "leader",
      title: "มุมหัวหน้า",
      theme: "Listening",
      competency: "การรับฟังอย่างตั้งใจ",
      scenario: "ลูกทีมเข้ามาบอกว่ารู้สึกเหนื่อยและเริ่มรับภาระงานไม่ไหว",
      question: "คุณควรตอบสนองอย่างไรเป็นอันดับแรก?",
      options: [
        { id: "D4L-A", label: "A", text: "บอกว่า “ทุกคนก็เหนื่อยเหมือนกัน ต้องอดทน”", score: 1 },
        { id: "D4L-B", label: "B", text: "บอกให้เขาไปพักผ่อน แล้วค่อยกลับมาทำงานต่อ", score: 5 },
        { id: "D4L-C", label: "C", text: "ฟังให้จบ ถามรายละเอียดของภาระงาน แล้วช่วยดูว่ามีอะไรที่ต้องจัดลำดับหรือปรับความคาดหวังใหม่", score: 10 },
        { id: "D4L-D", label: "D", text: "รีบเสนอวิธีแก้ทันที โดยยังไม่ฟังรายละเอียดทั้งหมด", score: 4 },
      ],
      bestOptionId: "D4L-C",
      explanation: "การรับฟังที่ดีเริ่มจากการเข้าใจสถานการณ์จริง ไม่ลดทอนความรู้สึกของลูกทีม และไม่รีบแก้ปัญหาก่อนเข้าใจภาระงานที่แท้จริง",
      microTip: "บางครั้งสิ่งที่ทีมต้องการก่อนคำตอบ คือการได้รับฟังอย่างจริงจัง",
    },
    member: {
      id: "D4-M",
      roleType: "member",
      title: "มุมลูกน้อง",
      theme: "รับ Feedback",
      competency: "Growth Mindset",
      scenario: "หัวหน้าให้ feedback ว่างานของคุณยังไม่ละเอียดพอ และต้องปรับหลายจุด",
      question: "คุณควรตอบสนองอย่างไร?",
      options: [
        { id: "D4M-A", label: "A", text: "ปกป้องตัวเองทันทีว่าเพราะเวลาน้อยและงานเยอะ", score: 3 },
        { id: "D4M-B", label: "B", text: "ฟังให้จบ ถามตัวอย่างที่ชัดเจน และตกลงว่าจะปรับส่วนใดก่อน", score: 10 },
        { id: "D4M-C", label: "C", text: "รับฟังเงียบ ๆ แต่ในใจคิดว่า feedback นี้ไม่ยุติธรรม", score: 4 },
        { id: "D4M-D", label: "D", text: "ขอโทษหลายครั้ง แต่ไม่ถามว่าควรปรับอย่างไร", score: 5 },
      ],
      bestOptionId: "D4M-B",
      explanation: "การรับ feedback อย่างมืออาชีพไม่ใช่การยอมรับทุกอย่างโดยไม่คิด แต่คือการฟังเพื่อเข้าใจ ถามให้ชัด และแปลง feedback เป็นการลงมือปรับปรุง",
      microTip: "Feedback ไม่ได้บอกว่าคุณไม่ดี แต่บอกว่ามีจุดไหนที่คุณสามารถทำให้ดีขึ้นได้",
    },
  },
  {
    day: 5,
    leader: {
      id: "D5-L",
      roleType: "leader",
      title: "มุมหัวหน้า",
      theme: "Conflict Management",
      competency: "การจัดการความขัดแย้งในทีม",
      scenario: "ลูกทีมสองคนมีความเห็นไม่ตรงกัน และเริ่มพูดถึงกันในทางลบกับคนอื่นในทีม",
      question: "ในฐานะหัวหน้า คุณควรจัดการอย่างไร?",
      options: [
        { id: "D5L-A", label: "A", text: "เรียกคุยเพื่อให้ทั้งสองฝ่ายอธิบายข้อเท็จจริง ความต้องการ และตกลงวิธีทำงานร่วมกันต่อไป", score: 10 },
        { id: "D5L-B", label: "B", text: "ปล่อยไว้ก่อน เพราะความขัดแย้งเล็ก ๆ มักหายไปเอง", score: 2 },
        { id: "D5L-C", label: "C", text: "เลือกเชื่อคนที่คุณสนิทมากกว่า เพราะน่าจะรู้สถานการณ์ดี", score: 1 },
        { id: "D5L-D", label: "D", text: "บอกทั้งสองคนให้หยุดทะเลาะกัน โดยไม่ต้องลงรายละเอียด", score: 5 },
      ],
      bestOptionId: "D5L-A",
      explanation: "ความขัดแย้งที่ไม่ถูกจัดการอาจกลายเป็นปัญหาความไว้วางใจในทีม หัวหน้าควรช่วยแยกข้อเท็จจริงออกจากอารมณ์ และพาทีมกลับมาคุยกันที่เป้าหมายร่วม",
      microTip: "การจัดการความขัดแย้งที่ดีไม่ใช่การหาคนผิด แต่คือการทำให้คนกลับมาร่วมมือกันได้",
    },
    member: {
      id: "D5-M",
      roleType: "member",
      title: "มุมลูกน้อง",
      theme: "ทำงานร่วมกับทีม",
      competency: "Collaboration",
      scenario: "คุณไม่เห็นด้วยกับวิธีทำงานของเพื่อนร่วมทีม และเริ่มรู้สึกหงุดหงิด",
      question: "คุณควรทำอย่างไร?",
      options: [
        { id: "D5M-A", label: "A", text: "บ่นกับคนอื่นก่อน เพื่อระบายความรู้สึก", score: 2 },
        { id: "D5M-B", label: "B", text: "ทำส่วนของตัวเองให้เสร็จ แล้วไม่ยุ่งกับเขาอีก", score: 5 },
        { id: "D5M-C", label: "C", text: "ตอบโต้ด้วยการไม่ช่วยงานของเขา", score: 1 },
        { id: "D5M-D", label: "D", text: "คุยกับเพื่อนร่วมทีมโดยตรงอย่างสุภาพ อธิบายผลกระทบ และชวนหาวิธีทำงานที่เหมาะกับทั้งสองฝ่าย", score: 10 },
      ],
      bestOptionId: "D5M-D",
      explanation: "การทำงานเป็นทีมต้องกล้าคุยเรื่องที่ไม่สบายใจด้วยความเคารพ การพูดตรงกับคนที่เกี่ยวข้องช่วยลดความเข้าใจผิดและป้องกันปัญหาลุกลาม",
      microTip: "ความร่วมมือไม่ได้แปลว่าต้องเห็นด้วยเสมอ แต่ต้องคุยกันให้กลับมาทำงานร่วมกันได้",
    },
  },
  {
    day: 6,
    leader: {
      id: "D6-L",
      roleType: "leader",
      title: "มุมหัวหน้า",
      theme: "Well-being & Workload",
      competency: "การดูแล workload และพลังงานของทีม",
      scenario: "ทีมของคุณมีงานเร่งเข้ามาหลายงานพร้อมกัน และเริ่มมีสัญญาณว่าหลายคนทำงานล่วงเวลาต่อเนื่อง",
      question: "คุณควรทำอย่างไร?",
      options: [
        { id: "D6L-A", label: "A", text: "บอกทีมว่าเป็นช่วงสำคัญ ทุกคนต้องช่วยกันอดทน", score: 3 },
        { id: "D6L-B", label: "B", text: "กระจายงานเพิ่มให้ทุกคนเท่า ๆ กัน เพื่อให้ดูยุติธรรม", score: 5 },
        { id: "D6L-C", label: "C", text: "ทบทวน priority ร่วมกับทีม แยกงานด่วนจริงออกจากงานที่เลื่อนได้ และสื่อสาร trade-off กับผู้เกี่ยวข้อง", score: 10 },
        { id: "D6L-D", label: "D", text: "ทำงานแทนทีมให้มากที่สุด เพื่อไม่ให้ทีมเหนื่อย", score: 4 },
      ],
      bestOptionId: "D6L-C",
      explanation: "Well-being ในทีมไม่ใช่แค่การบอกให้คนพัก แต่รวมถึงการจัดลำดับงานให้ชัด ลดงานที่ไม่จำเป็น และกล้าสื่อสารข้อจำกัดกับผู้เกี่ยวข้องอย่างเป็นระบบ",
      microTip: "ทีมที่มี well-being ไม่ใช่ทีมที่ไม่มีงานหนัก แต่เป็นทีมที่รู้ว่าอะไรสำคัญจริงและมีพื้นที่จัดการพลังงานของตัวเอง",
    },
    member: {
      id: "D6-M",
      roleType: "member",
      title: "มุมลูกน้อง",
      theme: "ดูแลพลังงานตัวเอง",
      competency: "Self-management & Well-being",
      scenario: "ช่วงนี้คุณมีงานเยอะต่อเนื่อง และเริ่มรู้สึกว่าความเหนื่อยส่งผลต่อคุณภาพงาน",
      question: "คุณควรทำอย่างไร?",
      options: [
        { id: "D6M-A", label: "A", text: "ทบทวนงานของตัวเอง จัดลำดับความสำคัญ และสื่อสารกับหัวหน้าหากมีงานที่ต้องปรับ timeline หรือขอความช่วยเหลือ", score: 10 },
        { id: "D6M-B", label: "B", text: "ฝืนทำต่อไป เพราะไม่อยากให้ใครคิดว่าคุณรับผิดชอบงานไม่ไหว", score: 2 },
        { id: "D6M-C", label: "C", text: "ลดคุณภาพงานบางส่วนลง เพื่อให้งานเสร็จทันโดยไม่บอกใคร", score: 3 },
        { id: "D6M-D", label: "D", text: "บ่นกับเพื่อนร่วมงานเพื่อระบาย แต่ยังไม่แจ้งปัญหาอย่างเป็นระบบ", score: 4 },
      ],
      bestOptionId: "D6M-A",
      explanation: "การดูแล well-being ของตัวเองเป็นส่วนหนึ่งของความรับผิดชอบต่องาน เพราะเมื่อพลังงานลดลง คุณภาพงานและการทำงานร่วมกับผู้อื่นอาจได้รับผลกระทบ การสื่อสารอย่างเป็นระบบช่วยให้ทีมจัดการสถานการณ์ได้ดีขึ้น",
      microTip: "การขอปรับ priority ไม่ใช่ความอ่อนแอ แต่เป็นการดูแลคุณภาพงานและสุขภาพของทีมในระยะยาว",
    },
  },
  {
    day: 7,
    leader: {
      id: "D7-L",
      roleType: "leader",
      title: "มุมหัวหน้า",
      theme: "Coaching Mindset",
      competency: "การ coach แทนการสั่งอย่างเดียว",
      scenario: "ลูกทีมมาขอคำตอบจากคุณทุกครั้งที่เจอปัญหา แม้เป็นปัญหาที่เขาน่าจะลองคิดเองได้ก่อน",
      question: "คุณควรตอบสนองอย่างไร?",
      options: [
        { id: "D7L-A", label: "A", text: "ให้คำตอบทันที เพื่อให้งานเดินเร็ว", score: 5 },
        { id: "D7L-B", label: "B", text: "บอกว่าให้ไปคิดเอง เพราะเรื่องนี้ไม่ควรถาม", score: 2 },
        { id: "D7L-C", label: "C", text: "รับปัญหานั้นมาจัดการเอง เพราะคุณมีประสบการณ์มากกว่า", score: 4 },
        { id: "D7L-D", label: "D", text: "ถามกลับอย่างสร้างสรรค์ เช่น “มีทางเลือกที่จะช่วยแก้ปัญหานี้ให้พี่ไหม / ลองออกความเห็นว่าจะแก้ปัญหานี้อย่างไร” และช่วยเขาคิดผ่านทางเลือกก่อนตัดสินใจ", score: 10 },
      ],
      bestOptionId: "D7L-D",
      explanation: "Coaching Mindset คือการช่วยให้ลูกทีมคิดเป็นและตัดสินใจดีขึ้น ไม่ใช่การให้คำตอบทุกครั้ง หัวหน้าควรถามคำถามที่ช่วยให้เขามองเห็นทางเลือกและเรียนรู้จากกระบวนการคิด",
      microTip: "หัวหน้าที่ดีไม่ได้ทำให้ทีมพึ่งพาเขาตลอดเวลา แต่ช่วยให้ทีมค่อย ๆ พึ่งพาตัวเองได้มากขึ้น",
    },
    member: {
      id: "D7-M",
      roleType: "member",
      title: "มุมลูกน้อง",
      theme: "เสนอทางออก",
      competency: "Solution-oriented Mindset",
      scenario: "คุณพบปัญหาในงานที่อาจกระทบ deadline ของทีม",
      question: "คุณควรสื่อสารกับหัวหน้าอย่างไร?",
      options: [
        { id: "D7M-A", label: "A", text: "แจ้งเฉพาะปัญหา แล้วรอให้หัวหน้าตัดสินใจ", score: 5 },
        { id: "D7M-B", label: "B", text: "แจ้งปัญหา ผลกระทบ และเสนอทางเลือกอย่างน้อย 1–2 ทางเพื่อให้ตัดสินใจได้เร็วขึ้น", score: 10 },
        { id: "D7M-C", label: "C", text: "แก้เองเงียบ ๆ แม้ยังไม่มั่นใจว่าวิธีนั้นถูกต้อง", score: 4 },
        { id: "D7M-D", label: "D", text: "รอให้ปัญหาชัดเจนกว่านี้ก่อนค่อยแจ้ง", score: 2 },
      ],
      bestOptionId: "D7M-B",
      explanation: "การเสนอทางออกช่วยให้การสื่อสารมีคุณค่ามากขึ้น เพราะไม่ได้หยุดอยู่ที่การรายงานปัญหา แต่ช่วยให้หัวหน้าและทีมตัดสินใจได้เร็วขึ้นบนข้อมูลที่ครบกว่าเดิม",
      microTip: "เมื่อเจอปัญหา ลองถามตัวเองว่า “ฉันเสนอทางเลือกอะไรให้ทีมได้บ้าง” ก่อนส่งต่อเรื่องให้คนอื่น",
    },
  },
];

const demoRanking = [
  { name: "แนน ก.", team: "Agro-สุกร", score: 10, streak: 8 },
  { name: "บี พ.", team: "SSC-MDM", score: 9, streak: 5 },
  { name: "ต้น ส.", team: "Business Service", score: 8, streak: 7 },
];

function getDisplayName(player) {
  const initial = player.fullName?.trim()?.[0] || "";
  return `${player.nickname || "ผู้เล่น"}${initial ? ` ${initial}.` : ""}`;
}

function levelFromScore(score) {
  if (score >= 9) return "Role Model";
  if (score >= 7) return "Strong Performer";
  if (score >= 5) return "Developing";
  return "Needs Awareness";
}

function loadJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

export default function DailyTeamWiseChallenge() {
  const [player, setPlayer] = useState(null);
  const [screen, setScreen] = useState("loading");
  const [answers, setAnswers] = useState({});
  const [attempts, setAttempts] = useState([]);
  const [form, setForm] = useState({
    employeeId: "",
    fullName: "",
    nickname: "",
    team: "",
    primaryRole: "leader",
  });

  const today = todayKey();
  const dayIndex = getDayIndex(today);
  const daySet = questionBank[dayIndex];
  const selectedRole = player?.primaryRole === "member" ? "member" : "leader";
  const roleQuestion = daySet[selectedRole];
  const todaysQuestions = [roleQuestion];

  useEffect(() => {
    const savedPlayer = loadJson(STORAGE_KEY, null);
    const savedAttempts = loadJson(ATTEMPT_KEY, []);
    setAttempts(savedAttempts);

    if (savedPlayer?.employeeId) {
      setPlayer(savedPlayer);
      setForm(savedPlayer);
      const playedToday = savedAttempts.some(
        (item) => item.employeeId === savedPlayer.employeeId && item.date === today
      );
      setScreen(playedToday ? "completed" : "welcome");
    } else {
      setScreen("register");
    }
  }, [today]);

  const currentAttempt = useMemo(() => {
    if (!player) return null;
    return attempts.find((item) => item.employeeId === player.employeeId && item.date === today);
  }, [attempts, player, today]);

  const selectedCount = Object.keys(answers).length;

  const totalScore = todaysQuestions.reduce((sum, question) => {
    const selected = question.options.find((option) => option.id === answers[question.id]);
    return sum + (selected?.score || 0);
  }, 0);

  const savePlayer = () => {
    if (!form.employeeId.trim() || !form.fullName.trim() || !form.nickname.trim() || !form.team.trim()) return;

    const newPlayer = {
      employeeId: form.employeeId.trim(),
      fullName: form.fullName.trim(),
      nickname: form.nickname.trim(),
      team: form.team.trim(),
      primaryRole: form.primaryRole,
      registeredAt: player?.registeredAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPlayer));
    setPlayer(newPlayer);
    setForm(newPlayer);
    setScreen("welcome");
  };

  const submitQuiz = () => {
    const selectedQuestion = roleQuestion;
    const selectedOption = selectedQuestion.options.find((o) => o.id === answers[selectedQuestion.id]);
    const score = selectedOption?.score || 0;

    const attempt = {
      employeeId: player.employeeId,
      nickname: player.nickname,
      displayName: getDisplayName(player),
      team: player.team,
      role: player.primaryRole,
      roleLabel: roleLabels[selectedRole],
      date: today,
      bankDay: daySet.day,
      score,
      totalScore: score,
      maxScore: 10,
      level: levelFromScore(score),
      answers: {
        [selectedRole]: {
          questionId: selectedQuestion.id,
          selectedOptionId: selectedOption?.id,
          selectedLabel: selectedOption?.label,
          score,
        },
      },
      completedAt: new Date().toISOString(),
    };

    const nextAttempts = [
      ...attempts.filter((item) => !(item.employeeId === player.employeeId && item.date === today)),
      attempt,
    ];

    localStorage.setItem(ATTEMPT_KEY, JSON.stringify(nextAttempts));
    setAttempts(nextAttempts);
    setScreen("result");
  };

  const resetPlayer = () => {
    localStorage.removeItem(STORAGE_KEY);
    setPlayer(null);
    setAnswers({});
    setScreen("register");
  };

  const clearTodayForDemo = () => {
    if (!player) return;
    const nextAttempts = attempts.filter((item) => !(item.employeeId === player.employeeId && item.date === today));
    localStorage.setItem(ATTEMPT_KEY, JSON.stringify(nextAttempts));
    setAttempts(nextAttempts);
    setAnswers({});
    setScreen("welcome");
  };

  const rankingRows = useMemo(() => {
    const todayAttempts = attempts
      .filter((item) => item.date === today)
      .map((item) => ({
        name: item.displayName || item.nickname,
        team: item.team,
        score: item.totalScore,
        streak: 1,
      }));

    return [...todayAttempts, ...demoRanking]
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [attempts, today]);

  const attemptForResult = currentAttempt || {
    totalScore,
    score: totalScore,
    maxScore: 10,
    roleLabel: roleLabels[selectedRole],
    level: levelFromScore(totalScore),
    bankDay: daySet.day,
  };

  const resultMicroTip = roleQuestion.microTip;

  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-3xl bg-white p-6 shadow-sm"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                <HeartHandshake className="h-4 w-4" /> Daily Well-being Game
              </div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Daily TeamWise Challenge</h1>
              <p className="mt-2 max-w-2xl text-slate-600">
                เพียงตอบวันละ 1 คำถาม ตามบทบาทหลักของคุณ เพื่อฝึกฝนการแสดงออก ปรับทัศนคติของแต่ละบุคคล ที่ช่วยสร้างให้ที่ทำงานเป็น well-being org. พร้อมสะสมคะแนนและจัดระดับพัฒนาการอย่างต่อเนื่อง
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => setScreen("ranking")}>ดู Ranking</Button>
              {player && <Button variant="ghost" onClick={resetPlayer}>เปลี่ยนผู้เล่น</Button>}
            </div>
          </div>
        </motion.div>

        {screen === "register" && (
          <Card className="rounded-3xl shadow-sm">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-2xl bg-slate-100 p-3"><Users className="h-6 w-6" /></div>
                <div>
                  <h2 className="text-2xl font-semibold">ลงทะเบียนครั้งแรก</h2>
                  <p className="text-slate-600">กรอกครั้งเดียว ระบบจะจำข้อมูลไว้บนเครื่องนี้สำหรับครั้งต่อไป</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>เลข ID พนักงาน</Label>
                  <Input value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} placeholder="ตัวเลขจำนวน 8 หลัก" />
                </div>
                <div className="space-y-2">
                  <Label>ชื่อ-นามสกุล</Label>
                  <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="สำหรับลงทะเบียนครั้งแรกเท่านั้น" />
                </div>
                <div className="space-y-2">
                  <Label>ชื่อเล่น</Label>
                  <Input value={form.nickname} onChange={(e) => setForm({ ...form, nickname: e.target.value })} placeholder="ใช้ทักทายและแสดงใน Ranking" />
                </div>
                <div className="space-y-2">
                  <Label>ทีม / แผนก</Label>
                  <Input value={form.team} onChange={(e) => setForm({ ...form, team: e.target.value })} placeholder="ตัวอย่าง Agro-สุกร, SSC-MDM, CoE, ธุรกิจค้าต่างประเทศ, Business Service" />
                </div>
              </div>

              <div className="mt-5">
                <Label>บทบาทหลักของคุณในปัจจุบัน</Label>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {Object.entries(roleLabels).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setForm({ ...form, primaryRole: key })}
                      className={`rounded-2xl border p-4 text-left transition ${form.primaryRole === key ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white hover:bg-slate-50"}`}
                    >
                      <div className="font-semibold">{label}</div>
                      <div className={`mt-1 text-sm ${form.primaryRole === key ? "text-slate-200" : "text-slate-500"}`}>
                        ใช้เพื่อเลือกคำถามรายวันที่ตรงกับบทบาทของคุณ
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <p className="mt-5 rounded-2xl bg-slate-100 p-4 text-sm text-slate-600">
                ระบบจะจำข้อมูลผู้เล่นไว้บนเครื่องนี้ เพื่อให้ครั้งต่อไปเข้าเล่นได้โดยไม่ต้องกรอกใหม่ หากใช้เครื่องสาธารณะ กรุณากด “เปลี่ยนผู้เล่น” หลังเล่นเสร็จ
              </p>

              <Button className="mt-5 w-full rounded-2xl py-6 text-base" onClick={savePlayer}>บันทึกและเริ่มใช้งาน</Button>
            </CardContent>
          </Card>
        )}

        {screen === "welcome" && player && (
          <Card className="overflow-hidden rounded-3xl shadow-sm">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-[1.2fr_0.8fr]">
                <div className="p-8">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                    <Sparkles className="h-4 w-4" /> Welcome Back
                  </div>
                  <h2 className="text-3xl font-bold">ยินดีต้อนรับกลับ “{player.nickname}”</h2>
                  <p className="mt-3 text-lg text-slate-600">
                    บทบาทหลักของคุณคือ: <span className="font-semibold text-slate-900">{roleLabels[player.primaryRole]}</span>
                  </p>
                  <div className="mt-6 rounded-3xl bg-slate-900 p-6 text-white">
                    <p className="text-2xl font-semibold leading-relaxed">วันนี้เรามาเริ่มสร้างองค์กรที่มี well-being ไปด้วยกัน</p>
                  </div>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Button className="rounded-2xl px-6 py-6 text-base" onClick={() => setScreen("quiz")}>ยืนยันเข้าร่วมเล่นเกมวันนี้</Button>
                    <Button variant="outline" className="rounded-2xl px-6 py-6 text-base" onClick={() => setScreen("register")}>แก้ไขข้อมูลของฉัน</Button>
                  </div>
                </div>
                <div className="bg-slate-100 p-8">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm text-slate-600 shadow-sm">
                    <CalendarDays className="h-4 w-4" /> Question Bank Day {daySet.day}/7
                  </div>
                  <h3 className="mb-4 text-lg font-semibold">Daily Challenge วันนี้</h3>
                  <div className="space-y-3">
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <div className="font-semibold">คำถามบทบาท: {roleLabels[selectedRole]}</div>
                      <p className="text-sm text-slate-600">{roleQuestion.theme} · {roleQuestion.competency}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {screen === "quiz" && (
          <div className="space-y-5">
            {todaysQuestions.map((question, index) => (
              <Card key={question.id} className="rounded-3xl shadow-sm">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-medium text-slate-500">Day {daySet.day} · ข้อ {index + 1}/1 · {question.title}</div>
                      <h2 className="mt-1 text-xl font-semibold">{question.scenario}</h2>
                      <p className="mt-2 text-slate-600">{question.question}</p>
                    </div>
                    <div className="hidden rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 md:block">{question.theme}</div>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {question.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setAnswers({ ...answers, [question.id]: option.id })}
                        className={`rounded-2xl border p-4 text-left transition ${answers[question.id] === option.id ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white hover:bg-slate-50"}`}
                      >
                        <div className="font-semibold">{option.label}</div>
                        <div className="mt-1">{option.text}</div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button disabled={selectedCount < todaysQuestions.length} onClick={submitQuiz} className="w-full rounded-2xl py-6 text-base">
              ส่งคำตอบและดูผลลัพธ์
            </Button>
          </div>
        )}

        {(screen === "result" || screen === "completed") && player && (
          <Card className="rounded-3xl shadow-sm">
            <CardContent className="p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-2xl bg-slate-100 p-3"><CheckCircle2 className="h-7 w-7" /></div>
                <div>
                  <h2 className="text-2xl font-bold">วันนี้คุณตอบคำถามครบแล้ว</h2>
                  <p className="text-slate-600">Question Bank Day {attemptForResult.bankDay || daySet.day}/7 · กลับมาเจอคำถามใหม่ได้พรุ่งนี้</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-3xl bg-slate-900 p-5 text-white md:col-span-2">
                  <div className="text-sm text-slate-300">คะแนนวันนี้</div>
                  <div className="mt-2 text-5xl font-bold">{attemptForResult.totalScore}/10</div>
                  <div className="mt-2 text-lg">{attemptForResult.level}</div>
                </div>
                <div className="rounded-3xl bg-white p-5 shadow-sm md:col-span-2">
                  <div className="text-sm text-slate-500">บทบาทคำถามวันนี้</div>
                  <div className="mt-2 text-2xl font-bold">{attemptForResult.roleLabel || roleLabels[selectedRole]}</div>
                </div>
              </div>

              <div className="mt-5 rounded-3xl bg-slate-100 p-5">
                <h3 className="font-semibold">Reflection วันนี้</h3>
                <p className="mt-2 text-slate-700">{roleQuestion.explanation}</p>
              </div>

              <div className="mt-5 rounded-3xl bg-white p-5 shadow-sm">
                <h3 className="font-semibold">Micro Tip วันนี้</h3>
                <p className="mt-2 text-slate-700">{resultMicroTip}</p>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Button className="rounded-2xl px-6 py-6" onClick={() => setScreen("ranking")}>ดู Ranking</Button>
                <Button variant="outline" className="rounded-2xl px-6 py-6" onClick={clearTodayForDemo}>
                  <RotateCcw className="mr-2 h-4 w-4" /> เล่นซ้ำสำหรับ Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {screen === "ranking" && (
          <Card className="rounded-3xl shadow-sm">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-2xl bg-slate-100 p-3"><Trophy className="h-7 w-7" /></div>
                <div>
                  <h2 className="text-2xl font-bold">Ranking วันนี้</h2>
                  <p className="text-slate-600">ตัวอย่าง Ranking รายวัน ใช้คะแนนเต็ม 10 คะแนน</p>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border bg-white">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100 text-slate-600">
                    <tr>
                      <th className="p-4">อันดับ</th>
                      <th className="p-4">ผู้เล่น</th>
                      <th className="p-4">ทีม</th>
                      <th className="p-4">คะแนน</th>
                      <th className="p-4">Streak</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankingRows.map((row, index) => (
                      <tr key={`${row.name}-${index}`} className="border-t">
                        <td className="p-4 font-semibold">{index + 1}</td>
                        <td className="p-4">{row.name}</td>
                        <td className="p-4">{row.team}</td>
                        <td className="p-4 font-semibold">{row.score}/10</td>
                        <td className="p-4">{row.streak} วัน</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 flex gap-3">
                <Button onClick={() => setScreen(player ? "welcome" : "register")} className="rounded-2xl px-6 py-6">กลับหน้าแรก</Button>
                {player && <Button variant="outline" onClick={() => setScreen(currentAttempt ? "completed" : "welcome")} className="rounded-2xl px-6 py-6">ดูผลวันนี้</Button>}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
