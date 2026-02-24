import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Create Languages
  const en = await prisma.language.upsert({
    where: { code: 'en' },
    update: {},
    create: {
      code: 'en',
      name: 'English',
      fontFamily: "'Inter', sans-serif",
      direction: 'ltr',
      isDefault: true,
    },
  });

  const vi = await prisma.language.upsert({
    where: { code: 'vi' },
    update: {},
    create: {
      code: 'vi',
      name: 'Tiếng Việt',
      fontFamily: "'Inter', sans-serif",
      direction: 'ltr',
    },
  });

  const he = await prisma.language.upsert({
    where: { code: 'he' },
    update: {},
    create: {
      code: 'he',
      name: 'Hebrew',
      fontFamily: "'Inter', sans-serif",
      direction: 'rtl',
    },
  });

  const ru = await prisma.language.upsert({
    where: { code: 'ru' },
    update: {},
    create: {
      code: 'ru',
      name: 'Russian',
      fontFamily: "'Inter', sans-serif",
      direction: 'ltr',
    },
  });

  const languages = [en, vi, he, ru];

  // 2. UI Content (Nav & Common)
  const commonContent = [
    { key: 'nav.home', en: 'Home', vi: 'Trang chủ', he: 'בית', ru: 'Главная' },
    { key: 'nav.about', en: 'About', vi: 'Giới thiệu', he: 'אודות', ru: 'О нас' },
    { key: 'nav.projects', en: 'Projects', vi: 'Dự án', he: 'פרויקטים', ru: 'Проекты' },
    { key: 'nav.experience', en: 'Experience', vi: 'Kinh nghiệm', he: 'ניסיון', ru: 'Опыт' },
    { key: 'nav.blog', en: 'Blog', vi: 'Bài viết', he: 'בלוג', ru: 'Блог' },
    { key: 'common.available', en: 'Available for new opportunities', vi: 'Sẵn sàng cho các cơ hội mới', he: 'זמין להזדמנויות חדשות', ru: 'Доступен для новых возможностей' },
    { key: 'common.resume', en: 'Download Resume', vi: 'Tải CV', he: 'הורד קורות חיים', ru: 'Скачать резюме' },
    { key: 'common.epic', en: "Let's build something epic.", vi: 'Hãy cùng tạo nên điều kỳ diệu.', he: 'בואו נבנה משהו אפי.', ru: 'Давайте создадим что-то эпическое.' },
    { key: 'common.footer', en: 'Crafted by Antigravity', vi: 'Thiết kế bởi Antigravity', he: 'נוצר על ידי Antigravity', ru: 'Создано Antigravity' },
    { key: 'hero.title', en: 'Crafting Digital Excellence', vi: 'Kiến Tạo Sự Hoàn Hảo Số', he: 'יצירת מצוינות דיגיטלית', ru: 'Создание цифрового совершенства' },
    { key: 'hero.subtitle', en: "I'm a Full-stack Engineer dedicated to building high-performance, accessible, and visually stunning applications using Clean Architecture.", vi: 'Tôi là một Kỹ sư Full-stack tận tâm xây dựng các ứng dụng hiệu suất cao, dễ tiếp cận và có giao diện ấn tượng dựa trên Kiến trúc Sạch (Clean Architecture).', he: 'אני מהנדס פול-סטאק המוקדש לבניית אפליקציות עתירות ביצועים, נגישות ומרהיבות ויזואלית באמצעות ארכיטקטורה נקייה.', ru: 'Я Full-stack инженер, занимающийся созданием высокопроизводительных, доступных и визуально потрясающих приложений с использованием чистой архитектуры.' },
    { key: 'blog.views', en: 'Views', vi: 'Lượt xem', he: 'צפיות', ru: 'Просмотры' },
    { key: 'blog.how_was_it', en: 'Transmission Feedback', vi: 'Phản hồi Bản tin', he: 'משוב על השידור', ru: 'Обратная связь по трансляции' },
    { key: 'blog.comments', en: 'Comments', vi: 'Bình luận', he: 'תגובות', ru: 'Комментарии' },
    { key: 'blog.share_knowledge', en: 'Share Knowledge', vi: 'Chia sẻ Kiến thức', he: 'שתף ידע', ru: 'Поделиться знаниями' },
    { key: 'blog.link_copied', en: 'Link copied to clipboard', vi: 'Đã sao chép liên kết', he: 'הקישור הועתק ללוח', ru: 'Ссылка скопирована в буфер обмена' },
    { key: 'blog.copy_link', en: 'Copy Link', vi: 'Sao chép Liên kết', he: 'העתק קישור', ru: 'Копировать ссылку' },
    { key: 'blog.comment_placeholder', en: 'Type your transmission here...', vi: 'Nhập nội dung của bạn tại đây...', he: 'הקלד את השידור שלך כאן...', ru: 'Введите ваше сообщение здесь...' },
  ];

  for (const item of commonContent) {
    for (const lang of languages) {
      const value = (item as any)[lang.code];
      if (value) {
        await prisma.uIContent.upsert({
          where: { key_languageId: { key: item.key, languageId: lang.id } },
          update: { value },
          create: { key: item.key, value, languageId: lang.id },
        });
      }
    }
  }

  // 3. Projects
  const projects = [
    {
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      techStack: ['Next.js', 'Typescript'],
      en: { title: 'Vision Dashboard', desc: 'Real-time data visualization platform built with Next.js and D3.js.' },
      vi: { title: 'Bảng điều khiển Tầm nhìn', desc: 'Nền tảng trực quan hóa dữ liệu thời gian thực được xây dựng bằng Next.js và D3.js.' }
    },
    {
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
      techStack: ['NestJS', 'Docker'],
      en: { title: 'SecureOps', desc: 'Automated security monitoring for distributed cloud infrastructure.' },
      vi: { title: 'SecureOps', desc: 'Giám sát bảo mật tự động cho hạ tầng đám mây phân tán.' }
    }
  ];

  for (const p of projects) {
    const project = await prisma.project.create({
      data: {
        image: p.image,
        techStack: p.techStack,
        translations: {
          create: [
            { languageId: en.id, title: p.en.title, description: p.en.desc },
            { languageId: vi.id, title: p.vi.title, description: p.vi.desc },
          ]
        }
      }
    });
  }

  // 4. Experiences
  const exps = [
    {
      period: '2023 - Present',
      en: { company: 'Global Tech Solutions', role: 'Senior Full-stack Engineer', desc: 'Leading a team of 5 developers to build a high-performance e-commerce engine.' },
      vi: { company: 'Global Tech Solutions', role: 'Kỹ sư Full-stack Cao cấp', desc: 'Dẫn dắt đội ngũ 5 lập trình viên xây dựng công cụ thương mại điện tử hiệu suất cao.' }
    }
  ];

  for (const e of exps) {
    await prisma.experience.create({
      data: {
        period: e.period,
        translations: {
          create: [
            { languageId: en.id, company: e.en.company, role: e.en.role, description: e.en.desc },
            { languageId: vi.id, company: e.vi.company, role: e.vi.role, description: e.vi.desc },
          ]
        }
      }
    });
  }

  // 5. Auth (Roles & Permissions)
  const allPermissions = await prisma.permission.upsert({
    where: { name: '*:*' },
    update: {},
    create: { name: '*:*', description: 'Full access to everything' },
  });

  const superAdminRole = await prisma.role.upsert({
    where: { name: 'SUPERADMIN' },
    update: {},
    create: {
      name: 'SUPERADMIN',
      description: 'System owner with all permissions',
      permissions: { connect: { id: allPermissions.id } },
    },
  });

  // Create Default SuperAdmin User
  const adminEmail = 'admin@antigravity.dev';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        fullName: 'System Administrator',
        roleId: superAdminRole.id,
      },
    });
    console.log('Default SuperAdmin created: admin@antigravity.dev / Admin@123');
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
