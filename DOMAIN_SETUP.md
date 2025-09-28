# Domain Canonical Switch - Manual Infrastructure Setup

## Overview
This document outlines the manual infrastructure setup required to switch from `blog.marlowgate.com` to `marlowgate.com` as the primary domain.

## ⚠️ Important: Complete these steps BEFORE merging the PR

### 1. Cloudflare DNS Configuration

1. **Navigate to Cloudflare DNS settings** for the `marlowgate.com` domain
2. **Add/Update DNS Records:**
   ```
   Type: CNAME
   Name: @ (or marlowgate.com)
   Content: cname.vercel-dns.com
   TTL: Auto
   Proxy Status: Proxied (orange cloud)
   ```
   
   Alternative for APEX domain:
   ```
   Type: A
   Name: @
   Content: 76.76.19.61 (Vercel's IP)
   TTL: Auto
   Proxy Status: Proxied
   ```

3. **Ensure subdomain redirect:**
   ```
   Type: CNAME  
   Name: blog
   Content: cname.vercel-dns.com
   TTL: Auto
   Proxy Status: Proxied
   ```

### 2. Vercel Domain Configuration

1. **Navigate to your Vercel project dashboard**
2. **Go to Settings → Domains**
3. **Add `marlowgate.com` as Primary Domain:**
   - Click "Add Domain"
   - Enter `marlowgate.com`
   - Set as **Primary Domain**
4. **Configure `blog.marlowgate.com` as Redirect:**
   - Keep `blog.marlowgate.com` in the domain list
   - Set it to **Redirect** to `marlowgate.com`
   - Choose **Permanent (301)** redirect

### 3. Environment Variables

Update the following environment variables in Vercel dashboard:

```bash
NEXT_PUBLIC_SITE_URL=https://marlowgate.com
NEXT_PUBLIC_BASE_URL=https://marlowgate.com
```

### 4. Analytics Updates

#### Google Analytics 4
1. **Go to GA4 Admin → Data Streams**
2. **Update Web Stream URL** from `blog.marlowgate.com` to `marlowgate.com`
3. **Update Referrer Exclusions** if any references to the old domain exist

#### Google Search Console
1. **Add new property** for `https://marlowgate.com`
2. **Verify ownership** using DNS or HTML file method
3. **Submit new sitemap:** `https://marlowgate.com/sitemap.xml`
4. **Set up 301 redirect monitoring** in the old property

### 5. SSL Certificate Verification

1. **Wait for Vercel to provision SSL** for `marlowgate.com` (usually automatic)
2. **Test HTTPS access:** `https://marlowgate.com`
3. **Verify redirect:** `https://blog.marlowgate.com` → `https://marlowgate.com`

### 6. Testing Checklist

After deployment, verify:

- [ ] `https://marlowgate.com` loads correctly
- [ ] `https://blog.marlowgate.com` redirects to `https://marlowgate.com` with 301 status
- [ ] `https://marlowgate.com/sitemap.xml` is accessible
- [ ] `https://marlowgate.com/robots.txt` shows correct host
- [ ] All internal links work correctly
- [ ] RSS feed is accessible at new domain
- [ ] JSON-LD structured data shows correct URLs

### 7. Post-Deployment Tasks

1. **Update any external link references** to point to the new domain
2. **Notify search engines** of the domain change via Search Console
3. **Monitor 404 errors** for any missed redirects
4. **Update social media profiles** with new domain
5. **Update any bookmark/favorite links**

## Expected Timeline

- DNS propagation: 24-48 hours
- SSL certificate provisioning: 5-10 minutes
- Search engine reindexing: 1-4 weeks

## Rollback Plan

If issues occur:

1. **Revert DNS settings** in Cloudflare
2. **Remove new domain** from Vercel
3. **Restore environment variables** to old values
4. **Revert code changes** by reverting the PR

## Support

For issues during setup:
- Cloudflare Support: For DNS-related issues
- Vercel Support: For domain and SSL issues
- GA4 Help Center: For analytics configuration