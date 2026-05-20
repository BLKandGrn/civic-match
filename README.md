# Civic Match — Standalone App

## Deploy to Vercel

1. Upload this folder to a new GitHub repo called `civic-match`
2. In Vercel, click Add New Project → Import from GitHub → select `civic-match`
3. Before deploying, add this Environment Variable:
   - Key: `VITE_ANTHROPIC_API_KEY`
   - Value: your Anthropic API key
4. Click Deploy

Your app will be live at `https://civic-match.vercel.app` (or similar)

## Shopify Embed

Once deployed, add this to any Shopify page using the HTML editor:

```html
<iframe 
  src="https://civic-match.vercel.app" 
  width="100%" 
  height="900px" 
  frameborder="0"
  style="border-radius: 8px;"
></iframe>
```
