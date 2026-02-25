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
    { key: 'nav.login', en: 'Login', vi: 'Đăng nhập', he: 'כניסה', ru: 'Вход' },
    { key: 'nav.dashboard', en: 'Dashboard', vi: 'Bảng điều khiển', he: 'לוח בקרה', ru: 'Панель управления' },
    { key: 'auth.client_portal', en: 'Client Portal', vi: 'Giao diện người dùng', he: 'פורטל לקוחות', ru: 'Клиентский портал' },
    { key: 'auth.command_center', en: 'Command Center', vi: 'Trung tâm chỉ huy', he: 'מרכז פיקוד', ru: 'Центр управления' },
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
    { key: 'blog.post_comment', en: 'Post Comment', vi: 'Gửi bình luận', he: 'פרסם תגובה', ru: 'Опубликовать комментарий' },
    { key: 'blog.no_comments', en: 'The void is silent. Be the first to speak.', vi: 'Chưa có bình luận nào. Hãy là người đầu tiên lên tiếng.', he: 'החלל שקט. היה הראשון לדבר.', ru: 'Тишина. Будьте первым, кто выскажется.' },
    { key: 'blog.reaction.cool', en: 'Cool', vi: 'Tuyệt', he: 'מגניב', ru: 'Круто' },
    { key: 'blog.reaction.love', en: 'Love', vi: 'Yêu thích', he: 'אהבתי', ru: 'Любовь' },
    { key: 'blog.reaction.wow', en: 'Wow', vi: 'Nhạc nhiên', he: 'וואו', ru: 'Вау' },
    { key: 'blog.reaction.bravo', en: 'Bravo', vi: 'Hoan hô', he: 'בראבו', ru: 'Браво' },
    { key: 'auth.login_required', en: 'Authentication Required', vi: 'Yêu cầu đăng nhập', he: 'נדרשת התחברות', ru: 'Требуется аутентификация' },
    { key: 'auth.go_to_login', en: 'Go to Login', vi: 'Đến trang đăng nhập', he: 'עבור להתחברות', ru: 'Перейти к логину' },
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
      techStack: ['Next.js', 'Typescript', 'D3.js'],
      translations: {
        en: { title: 'Vision Dashboard', desc: 'Real-time data visualization platform built with Next.js and D3.js.' },
        vi: { title: 'Bảng điều khiển Tầm nhìn', desc: 'Nền tảng trực quan hóa dữ liệu thời gian thực được xây dựng bằng Next.js và D3.js.' },
        ru: { title: 'Vision Дашборд', desc: 'Платформа визуализации данных в реальном времени, созданная с использованием Next.js и D3.js.' },
        he: { title: 'לוח בקרה חזותי', desc: 'פלטפורמת ויזואליזציית נתונים בזמן אמת שנבנתה עם Next.js ו-D3.js.' }
      }
    },
    {
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
      techStack: ['NestJS', 'Docker', 'Cloudflare'],
      translations: {
        en: { title: 'SecureOps', desc: 'Automated security monitoring for distributed cloud infrastructure.' },
        vi: { title: 'SecureOps', desc: 'Giám sát bảo mật tự động cho hạ tầng đám mây phân tán.' },
        ru: { title: 'SecureOps', desc: 'Автоматизированный мониторинг безопасности для распределенной облачной инфраструктуры.' },
        he: { title: 'SecureOps', desc: 'ניטור אבטחה אוטומטי לתשתית ענן מבוזרת.' }
      }
    },
    {
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
      techStack: ['React', 'Node.js', 'PostgreSQL'],
      translations: {
        en: { title: 'Commerce Hub', desc: 'Scalable e-commerce platform with microservices architecture.' },
        vi: { title: 'Trung tâm Thương mại', desc: 'Nền tảng thương mại điện tử có thể mở rộng với kiến trúc microservices.' },
        ru: { title: 'Commerce Hub', desc: 'Масштабируемая платформа электронной коммерции с микросервисной архитектурой.' },
        he: { title: 'מוקד סחר', desc: 'פלטפורמת מסחר אלקטרוני ניתנת להרחבה עם ארכיטקטורת מיקרו-שירותים.' }
      }
    }
  ];

  for (const p of projects) {
    await prisma.project.create({
      data: {
        image: p.image,
        techStack: p.techStack,
        translations: {
          create: languages.map(lang => ({
            languageId: lang.id,
            title: (p.translations as any)[lang.code]?.title || '',
            description: (p.translations as any)[lang.code]?.desc || '',
          }))
        }
      }
    });
  }

  // 4. Experiences
  const exps = [
    {
      period: '2023 - Present',
      translations: {
        en: { company: 'Global Tech Solutions', role: 'Senior Full-stack Engineer', desc: 'Leading a team of 5 developers to build a high-performance e-commerce engine.' },
        vi: { company: 'Global Tech Solutions', role: 'Kỹ sư Full-stack Cao cấp', desc: 'Dẫn dắt đội ngũ 5 lập trình viên xây dựng công cụ thương mại điện tử hiệu suất cao.' },
        ru: { company: 'Global Tech Solutions', role: 'Старший Full-stack инженер', desc: 'Руководство командой из 5 разработчиков по созданию высокопроизводительного движка электронной коммерции.' },
        he: { company: 'Global Tech Solutions', role: 'מהנדס פול-סטאק בכיר', desc: 'הובלת צוות של 5 מפתחים לבניית מנוע מסחר אלקטרוני עתיר ביצועים.' }
      }
    },
    {
      period: '2021 - 2023',
      translations: {
        en: { company: 'CyberGuard Systems', role: 'Backend Developer', desc: 'Developed secure API endpoints and optimized database queries for a cybersecurity product.' },
        vi: { company: 'CyberGuard Systems', role: 'Lập trình viên Backend', desc: 'Phát triển các điểm cuối API an toàn và tối ưu hóa các truy vấn cơ sở dữ liệu cho sản phẩm an ninh mạng.' },
        ru: { company: 'CyberGuard Systems', role: 'Backend разработчик', desc: 'Разработка безопасных API-интерфейсов и оптимизация запросов к базе данных для продукта по кибербезопасности.' },
        he: { company: 'CyberGuard Systems', role: 'מפתח בקאנד', desc: 'פיתוח נקודות קצה מאובטחות של API ואופטימיזציה של שאילתות בסיס נתונים עבור מוצר סייבר.' }
      }
    }
  ];

  for (const e of exps) {
    await prisma.experience.create({
      data: {
        period: e.period,
        translations: {
          create: languages.map(lang => ({
            languageId: lang.id,
            company: (e.translations as any)[lang.code]?.company || '',
            role: (e.translations as any)[lang.code]?.role || '',
            description: (e.translations as any)[lang.code]?.desc || '',
          }))
        }
      }
    });
  }

  // 5. Blog Posts
  const adminUser = await prisma.user.findFirst({
    where: { email: 'admin@antigravity.dev' }
  });

  if (adminUser) {
    const blogs = [
      {
        slug: 'clean-architecture-in-nodejs',
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop',
        published: true,
        translations: {
          en: {
            title: 'Mastering Clean Architecture in Node.js',
            content: '# Introduction\n\nClean Architecture is not just a buzzword; it is a way to build sustainable software.\n\n## Why Clean Architecture?\n\n1. Independent of Frameworks.\n2. Testable.\n3. Independent of UI.'
          },
          vi: {
            title: 'Làm chủ Kiến trúc Sạch (Clean Architecture) trong Node.js',
            content: '# Giới thiệu\n\nClean Architecture không chỉ là một thuật ngữ thời thượng; nó là cách để xây dựng phần mềm bền vững.\n\n## Tại sao chọn Clean Architecture?\n\n1. Độc lập với Framework.\n2. Có thể kiểm thử.\n3. Độc lập với Giao diện.'
          },
          ru: {
            title: 'Освоение чистой архитектуры в Node.js',
            content: '# Введение\n\nЧистая архитектура — это не просто модное слово; это способ создания устойчивого программного обеспечения.'
          },
          he: {
            title: 'שליטה בארכיטקטורה נקייה ב-Node.js',
            content: '# מבוא\n\nארכיטקטורה נקייה היא לא רק מונח אופנתי; זו דרך לבנות תוכנה בת-קיימא.'
          }
        }
      },
      {
        slug: 'the-future-of-web-security',
        thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop',
        published: true,
        translations: {
          en: {
            title: 'The Future of Web Security',
            content: '# Security First\n\nAs we move towards a more decentralized web, security becomes paramount.'
          },
          vi: {
            title: 'Tương lai của Bảo mật Web',
            content: '# Bảo mật là trên hết\n\nKhi chúng ta tiến tới một môi trường web phi tập trung hơn, bảo mật trở nên tối quan trọng.'
          },
          ru: {
            title: 'Будущее веб-безопасности',
            content: '# Безопасность прежде всего\n\nПо мере того как мы движемся к более децентрализованному вебу, безопасность становится первостепенной.'
          },
          he: {
            title: 'העתיד של אבטחת אינטרנט',
            content: '# אבטחה תחילה\n\nככל שאנו נעים לעבר רשת מבוזרת יותר, האבטחה הופכת למכרעת.'
          }
        }
      }
    ];

    for (const b of blogs) {
      await prisma.blog.upsert({
        where: { slug: b.slug },
        update: {},
        create: {
          slug: b.slug,
          thumbnail: b.thumbnail,
          published: b.published,
          authorId: adminUser.id,
          translations: {
            create: languages.map(lang => ({
              languageId: lang.id,
              title: (b.translations as any)[lang.code]?.title || '',
              content: (b.translations as any)[lang.code]?.content || '',
            }))
          }
        }
      });
    }
  }

  // 6. Auth (Roles & Permissions)
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
    const bcrypt = await import('bcryptjs');
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
