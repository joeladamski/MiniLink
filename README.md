<div align="center">
  
  # MiniLink
  
  **Your Premium Link-in-Bio Platform**

  <img width="1421" height="811" alt="Screenshot 2026-05-22 at 1 12 37 PM" src="https://github.com/user-attachments/assets/428d5b68-38e1-422e-97a1-c9fc0118c7e4" />




  Create a stunning, personalized link page in seconds. Share your world with a single URL.
  

  [![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Prisma](https://img.shields.io/badge/Prisma-5.9-2D3748?style=for-the-badge&logo=prisma)](https://prisma.io/)
  [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
</div>


---

## Features

| Feature | Description |
|---------|-------------|
| **Unlimited Links** | Add as many links as you want with drag-and-drop reordering. Now supports **Link Folders** to group and nest your links for a cleaner layout. |
| **Coding Platform Icons** | Built-in high-quality SVG icons for **LeetCode, CodeChef, Codeforces, HackerRank, HackerEarth, and GFG**. |
| **Real-Time Analytics** | Track views and clicks live. Features a **dynamic glowing graph**. Folders are excluded from click tracking to keep your conversion data pure. |
| **12+ Premium Themes** | Select from beautiful presets or use the **Custom Theme Builder**. Includes an **Accurate Live Preview** that renders exactly like your public profile. |
| **Smart Profile Generation** | Users get a beautiful waiting page with an urgent CTA if they visit an unclaimed `/username` URL. |
| **Viral Branding Badge** | Built-in sleek floating footer on user profiles that directs their traffic back to your sign-up page. |
| **Lightning Fast** | Optimized for speed with edge caching and instant transitions. |
| **Secure & Open** | Built with enterprise-grade security (Clerk Auth) and fully open source. |
| **Fully Responsive** | Looks stunning on every screen, from big monitors to mobile phones. |
| **Social Proof & Premium Badge** | Admin profile features a rotating testimonial widget, a crown on the avatar, and a verified badge next to the name — making the creator's profile look premium. |

---

## MiniLink Demo

[Click Here to view demo](https://youtu.be/BVS7qoXoRCs?si=inbXyVGfRnwLge0V)



*A quick walkthrough showing how to create a MiniLink, customize it, and track clicks in real time.*

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + Framer Motion (Animations)
- **Database:** PostgreSQL (Supabase/Neon) via Prisma ORM
- **Auth:** Clerk
- **Icons:** Lucide React

---

## Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/TuShArBhArDwA/MiniLink.git
cd MiniLink
npm install
```

### 2. Environment Setup
Create `.env.local`:
```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
NEXT_PUBLIC_ADMIN_USER_ID=your_clerk_user_id  # Enables creator badge & testimonials
```

### 3. Run It
```bash
npx prisma db push
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) for the magic! 🌟

---

## Documentation

Detailed design docs for developers:
- [High-Level Design (HLD)](docs/HLD.md)
- [Low-Level Design (LLD)](docs/LLD.md)

---

## Contributing

Contributions are welcome! Feel free to open issues or pull requests to improve MiniLink.


---

## Sponsor

If you find this helpful, consider supporting me:

- **Sponsor Me:** [Buy Me a Coffee!](https://github.com/sponsors/TuShArBhArDwA)

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Connect with me

If you’d like to connect, feel free to reach out — [Click here](https://minianonlink.vercel.app/tusharbhardwaj)


---

**[Try MiniLink](https://minianonlink.vercel.app/)** | **[Submit Feedback](https://github.com/TuShArBhArDwA/MiniLink/issues)**
