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

  // 2. UI Content (Nav & Common)
  const commonContent = [
    { key: 'nav.home', en: 'Home', vi: 'Trang chủ' },
    { key: 'nav.about', en: 'About', vi: 'Giới thiệu' },
    { key: 'nav.projects', en: 'Projects', vi: 'Dự án' },
    { key: 'nav.experience', en: 'Experience', vi: 'Kinh nghiệm' },
    { key: 'nav.blog', en: 'Blog', vi: 'Bài viết' },
    { key: 'common.available', en: 'Available for new opportunities', vi: 'Sẵn sàng cho các cơ hội mới' },
    { key: 'common.resume', en: 'Download Resume', vi: 'Tải CV' },
    { key: 'common.epic', en: "Let's build something epic.", vi: 'Hãy cùng tạo nên điều kỳ diệu.' },
    { key: 'common.footer', en: 'Crafted by Antigravity', vi: 'Thiết kế bởi Antigravity' },
    { key: 'hero.title', en: 'Crafting Digital Excellence', vi: 'Kiến Tạo Sự Hoàn Hảo Số' },
    { key: 'hero.subtitle', en: "I'm a Full-stack Engineer dedicated to building high-performance, accessible, and visually stunning applications using Clean Architecture.", vi: 'Tôi là một Kỹ sư Full-stack tận tâm xây dựng các ứng dụng hiệu suất cao, dễ tiếp cận và có giao diện ấn tượng dựa trên Kiến trúc Sạch (Clean Architecture).' },
    { key: 'about.title', en: 'Passionate about solving complex problems.', vi: 'Đam mê giải quyết những vấn đề phức tạp.' },
    { key: 'about.p1', en: 'My journey began with a curiosity about how things work under the hood. Today, I build systems that are not only functional but also architecturally sound.', vi: 'Hành trình của tôi bắt đầu từ sự tò mò về cách mọi thứ vận hành. Ngày nay, tôi xây dựng các hệ thống không chỉ hoạt động tốt mà còn có cấu trúc vững chắc.' },
    { key: 'about.p2', en: 'I specialize in Clean Architecture, ensuring that my codebases are maintainable, testable, and future-proof. Whether it\'s a high-concurrency backend or a pixel-perfect frontend, I strive for excellence in every line of code.', vi: 'Tôi chuyên về Clean Architecture, đảm bảo mã nguồn dễ bảo trì, dễ kiểm thử và bền vững. Dù là backend xử lý song song cao hay frontend pixel-perfect, tôi luôn hướng tới sự xuất sắc trong từng dòng code.' },
    { key: 'about.frontend', en: 'Frontend', vi: 'Giao diện (Frontend)' },
    { key: 'about.backend', en: 'Backend', vi: 'Hệ thống (Backend)' },
    { key: 'about.caption', en: 'That\'s me at the AI Summit', vi: 'Đó là tôi tại AI Summit' },
  ];

  for (const item of commonContent) {
    await prisma.uIContent.upsert({
      where: { key_languageId: { key: item.key, languageId: en.id } },
      update: { value: item.en },
      create: { key: item.key, value: item.en, languageId: en.id },
    });
    await prisma.uIContent.upsert({
      where: { key_languageId: { key: item.key, languageId: vi.id } },
      update: { value: item.vi },
      create: { key: item.key, value: item.vi, languageId: vi.id },
    });
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
