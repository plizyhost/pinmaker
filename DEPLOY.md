# Deploy Pinterest Pin Studio to Vercel (free, no code)

## What you need
- A free GitHub account → https://github.com
- A free Vercel account → https://vercel.com (sign up with GitHub)

---

## Step 1 — Upload to GitHub

1. Go to https://github.com/new
2. Name it `pinterest-pin-studio`, keep it **Private**
3. Click **Create repository**
4. Click **uploading an existing file**
5. Drag the entire `pin-studio` folder contents into the upload area
   (upload all files — keep the folder structure: `src/`, `public/`, `package.json`)
6. Click **Commit changes**

---

## Step 2 — Deploy on Vercel

1. Go to https://vercel.com → click **Add New Project**
2. Click **Import** next to your `pinterest-pin-studio` repo
3. Vercel auto-detects React — just click **Deploy**
4. Wait ~2 minutes ✓

You'll get a live URL like: `https://pinterest-pin-studio-xxx.vercel.app`

---

## Step 3 — Share with your team

- Send teammates your Vercel URL
- Only people with the link can access it (it's not listed anywhere)
- For extra privacy: in Vercel → Settings → Password Protection (requires Pro plan)

---

## Updating the app

Whenever you want to make changes:
1. Edit the files locally
2. Go to your GitHub repo → upload the changed file
3. Vercel automatically redeploys in ~1 minute

---

## Troubleshooting

**"Build failed"** → Make sure `package.json` and `src/App.jsx` and `src/index.js` and `public/index.html` are all uploaded

**Fonts not loading** → The app loads Google Fonts from the internet, so an internet connection is required

**Images from sitemap not showing** → Some sites block external image loading (CORS). Upload images manually using the file upload on each pin row.
