# Admin dashboard setup

The private dashboard is available at `/admin/login`. It uses one administrator account supplied through server-only environment variables. This workspace has a generated local account in the ignored `.env.local` file; never commit that file. New installations must choose their own credentials.

For this workspace, the local admin account is already configured in `.env.local`. Restart the Next.js server and open `/admin/login` to use it. For a new installation, copy `.env.example` to `.env.local`, set a private `ADMIN_USERNAME`, choose a unique `ADMIN_PASSWORD` of at least 16 characters, and generate `ADMIN_SESSION_SECRET` with `openssl rand -base64 48`.

The dashboard lets the administrator edit the public homepage copy, storefront and hero photos, solution cards, products, store contact details and the assumptions used by the solar-cost estimate. Image uploads accept JPEG, PNG, WebP and AVIF up to 8 MB; uploads are resized and stored as WebP. Click **Save & publish** after uploading or editing.

## Persistent storage for Vercel or other serverless hosts

For Vercel or other hosts with ephemeral filesystems, configure Supabase so edits and image uploads persist:

1. Create a Supabase project and run `supabase/migrations/202610290001_site_content.sql` in its SQL Editor. It creates the private content table and public image bucket.
2. Set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_STORAGE_BUCKET=awadh-media` in `.env.local` and in the hosting provider's server-side environment settings. Keep the service-role key server-only; never add it to a `NEXT_PUBLIC_` variable.
3. Restart/redeploy the app. Site content is cached and the dashboard invalidates that cache when you publish.

If both Supabase variables are empty, local/self-hosted Node.js mode stores `data/site-content.json` and `data/uploads/` on disk. Keep that directory writable and backed up. A default Vercel filesystem is ephemeral, so use Supabase there.

The login cookie is HTTP-only, same-site strict and expires after eight hours. Configure HTTPS in production. Login attempts are rate-limited per server process; use an upstream rate limit as well when running multiple instances.
