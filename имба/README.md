# OpenAI Proxy for Vercel

Минимальный прокси для проекта генерации презентаций на Timeweb.

## Маршруты

Проверка прокси:

```txt
/api/health
```

Основной маршрут для проекта на Timeweb:

```txt
/api/v1/chat/completions
```

## Переменные на Vercel

```env
OPENAI_API_KEY=sk-proj_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PROXY_SECRET=prezentation_proxy_secret_2026_simple_key
```

`OPENAI_API_KEY` — настоящий ключ OpenAI. Он хранится только на Vercel.

`PROXY_SECRET` — секрет между Timeweb и Vercel. Его же нужно поставить в основном проекте на Timeweb в переменную `OPENAI_API_KEY`.

## Переменные на Timeweb в основном проекте

```env
OPENAI_PROXY_URL=https://YOUR-PROXY.vercel.app/api/v1
OPENAI_API_KEY=prezentation_proxy_secret_2026_simple_key
OPENAI_MODEL=gpt-4o-mini
PEXELS_API_KEY=твой_ключ_pexels
```

Важно: если на Timeweb есть `OPENAI_BASE_URL`, удали его или поставь туда тот же адрес, что и в `OPENAI_PROXY_URL`.

## Проверка

Открой в браузере:

```txt
https://YOUR-PROXY.vercel.app/api/health
```

Должно быть:

```json
{
  "ok": true,
  "service": "openai-proxy-vercel",
  "hasOpenAiKey": true,
  "hasProxySecret": true
}
```

После этого основной проект на Timeweb должен обращаться сюда:

```txt
https://YOUR-PROXY.vercel.app/api/v1/chat/completions
```
