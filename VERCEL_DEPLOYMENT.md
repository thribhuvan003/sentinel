# Deploying Sentinel Enterprise Suite to Vercel

This guide outlines the steps to deploy the Sentinel Enterprise Suite to Vercel.

## 1. Import from GitHub

1.  Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Select **"Import"** next to the `sentinel` repository you just created.

## 2. Configure Project

Vercel should automatically detect that this is a **Vite** project.

-   **Framework Preset**: Vite
-   **Root Directory**: \`./\` (default)
-   **Build Command**: \`npm run build\` (default)
-   **Output Directory**: \`dist\` (default)

## 3. Environment Variables

You need to add your Supabase environment variables here.

Copy the values from your local \`.env\` file (DO NOT upload the file itself, just copy the values).

| Variable Name | Value |
| :--- | :--- |
| \`VITE_SUPABASE_URL\` | Your Supabase Project URL |
| \`VITE_SUPABASE_ANON_KEY\` | Your Supabase Anon Key |

## 4. Deploy

Click **"Deploy"**. Vercel will build your project and assign a domain (e.g., \`sentinel.vercel.app\`).

## 5. Update Supabase Auth Settings

After deployment is complete:

1.  Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2.  Navigate to **Authentication** -> **URL Configuration**.
3.  Add your new Vercel URL (e.g., \`https://sentinel.vercel.app\`) to the **Site URL** and **Redirect URLs**.
4.  This ensures authentication redirects work correctly in production.

## Troubleshooting

-   **Build Fails?** Check the logs. If it's a type error, ensure `npm run build` passes locally.
-   **404 on Refresh?** Vercel should handle client-side routing automatically for Vite, but if not, ensure `vercel.json` is configured (usually not needed for Vite on Vercel).
