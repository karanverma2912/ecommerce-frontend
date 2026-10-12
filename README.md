# Ecommerce Frontend

A **Next.js / TypeScript shopping interface** developed as a companion to the [Ecommerce Rails API](https://github.com/karanverma2912/ecommerce).

> **Portfolio / development project:** This repository showcases frontend implementation. Production deployment and end-to-end integrations have not been verified as part of this documentation update.

## Built with

- Next.js 16, React 19, TypeScript
- Tailwind CSS 4
- Framer Motion, Lucide icons
- React Hot Toast, Recharts

## What's in the repository

- Shopping experience with cart and wishlist sections
- Profile and account-related UI
- Admin area
- Auth, cart, theme, and wishlist React contexts
- Interactive and responsive frontend elements

Explore [`app/`](app/) for the pages and UI components.

## Run locally

**Prerequisites:** Node.js and npm.

```bash
git clone https://github.com/karanverma2912/ecommerce-frontend.git
cd ecommerce-frontend
npm install
npm run dev
```

Open `http://localhost:3000` to view the frontend. Some flows depend on the separate Rails API and require its URL/configuration to be set correctly.

## Project scripts

```bash
npm run dev    # Development server
npm run build  # Production build
npm run lint   # ESLint
```

## Related repository

[**Ecommerce Rails API**](https://github.com/karanverma2912/ecommerce) — product, cart, order, account, and review endpoints.

## Maintainer

[Karan Verma](https://github.com/karanverma2912) · [LinkedIn](https://www.linkedin.com/in/karan-verma-4068541a0/)
