# Srijon Chatbot Edge Function

This function keeps Claude, OpenAI, and Gemini API keys server-side while the portfolio remains a static export.

## Deploy

Install and log in to the Supabase CLI, then run:

```bash
supabase functions deploy srijon-chatbot --project-ref oqzytgaswelsossrqife
```

## Secrets

Set provider keys as Supabase function secrets:

```bash
supabase secrets set ANTHROPIC_API_KEY=your_claude_key --project-ref oqzytgaswelsossrqife
supabase secrets set OPENAI_API_KEY=your_openai_key --project-ref oqzytgaswelsossrqife
supabase secrets set GEMINI_API_KEY=your_gemini_key --project-ref oqzytgaswelsossrqife
```

Optional model overrides:

```bash
supabase secrets set ANTHROPIC_MODEL=claude-3-5-haiku-latest --project-ref oqzytgaswelsossrqife
supabase secrets set OPENAI_MODEL=gpt-4o-mini --project-ref oqzytgaswelsossrqife
supabase secrets set GEMINI_MODEL=gemini-1.5-flash --project-ref oqzytgaswelsossrqife
```

## Static Site

The browser calls:

```text
{NEXT_PUBLIC_SUPABASE_URL}/functions/v1/srijon-chatbot
```

It sends the visitor question plus the public markdown knowledge from `/public/chatbot`. If the function is not deployed or all providers fail, the widget falls back to the local static chatbot.
