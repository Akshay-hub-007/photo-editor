# Photo Editor

A modern web-based photo editor with AI-powered features. Create, edit, and enhance images using smart tools and generative AI.

Live demo: https://akshay-edits-omega.vercel.app/

Status: Production-ready demo deployed on Vercel.

## Features
- Crop, resize, and adjust images
- AI background removal
- AI image extender and upscaler
- Color and light adjustments
- Text and content editing
- Project management (create, edit, delete)

## Usage
1. Create a new project and upload an image
2. Use the editor tools (crop, resize, adjust, AI features)
3. Save and export your edited images

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server (PowerShell example):
   ```powershell
   npm run dev
   # If you use npm scripts with other package managers:
   # yarn dev
   # pnpm dev
   ```
3. Open your browser at `http://localhost:3000`

## Plans
- Free: 3 projects, 20 exports/month, basic tools
- Pro: Unlimited projects, all AI features

---
For more details, see the code and UI for each feature in the `components/` and `app/` folders.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:
```powershell
# Install and run
npm install
npm run dev

# Open http://localhost:3000 in your browser
```

Hot reloading is enabled — edit files under the `app/` or `components/` folders and your browser will update automatically.

Notes:
- This is a Next.js (app router) project. Files live under `app/` and shared UI in `components/`.
- Fonts are optimized using Next.js built-in font tooling.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

This repository is already deployed: https://akshay-edits-omega.vercel.app/

Troubleshooting (common issue):
- Windows is case-insensitive but Linux (used by Vercel) is case-sensitive. File name casing mismatches (for example `Canvas.jsx` vs `canvas.jsx`) will build locally but fail on Vercel. Keep filenames consistent.

Environment variables
- Copy `.env.local.example` (if present) or create a `.env.local` in the repo root with the required variables (do NOT commit secrets):
   - `NEXT_PUBLIC_CONVEX_URL`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
   - `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
   - `CLERK_JWT_ISSUER_DOMAIN`
   - `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY`
   - `NEXT_PUBLIC_IMAGEURL_UR_ENDPOINT`
   - `IMAGEKIT_PRIVATE_KEY`
   - `NEXT_PUBLIC_UNPLASH_ACCESS_KEY`

Keep `.env.local` out of version control. Add it to `.gitignore` if it's not already ignored.

Development checklist
- Node.js (recommended LTS)
- npm or yarn/pnpm
- `npm install` then `npm run dev`

Contributing
- Open an issue for bugs or feature requests.
- Create feature branches and open pull requests against `main`.
- Follow existing code style; prefer small, focused commits.

License
- Check the repository root for a `LICENSE` file. If none is present, add one appropriate to your project.
