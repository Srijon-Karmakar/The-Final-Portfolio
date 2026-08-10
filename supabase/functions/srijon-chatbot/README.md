# Srijon Chatbot Edge Function

This function keeps OpenAI and Claude API keys server-side while the portfolio remains a static export.

Routing order:

1. OpenAI
2. Claude
3. Rule-based local answer

If OpenAI fails because quota/tokens are exhausted, the key is missing, the request times out, or the provider returns an error, the function tries Claude. If Claude also fails, the function returns the rule-based answer.

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
```

Optional model overrides:

```bash
supabase secrets set ANTHROPIC_MODEL=claude-3-5-haiku-latest --project-ref oqzytgaswelsossrqife
supabase secrets set OPENAI_MODEL=gpt-5.6-sol --project-ref oqzytgaswelsossrqife
supabase secrets set OPENAI_REASONING_EFFORT=none --project-ref oqzytgaswelsossrqife
```

Optional public debugging during setup:

```bash
supabase secrets set DEBUG_PROVIDER_ERRORS=true --project-ref oqzytgaswelsossrqife
```

Leave `DEBUG_PROVIDER_ERRORS` unset in production so provider quota/auth details are only visible in Supabase function logs.

## Static Site

The browser calls:

```text
{NEXT_PUBLIC_SUPABASE_URL}/functions/v1/srijon-chatbot
```

It sends the visitor question plus the public markdown knowledge from `/public/chatbot`. If the function is not deployed or all providers fail, the widget falls back to the local static chatbot.
