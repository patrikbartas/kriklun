import { removeWatcher } from "@/lib/store";

export const dynamic = "force-dynamic";

// Odhlasovaci odkaz z mailu. Tokenom je id zaznamu, ktore je nahodne uuid.
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id") ?? "";
  let ok = false;
  try {
    ok = await removeWatcher(id);
  } catch {
    ok = false;
  }

  const msg = ok
    ? "Hotovo. Na túto vec ti už nič nepríde."
    : "Toto sledovanie sme nenašli. Možno si sa už odhlásil.";

  return new Response(
    `<!doctype html><meta charset="utf-8">
     <meta name="viewport" content="width=device-width,initial-scale=1">
     <title>kriklún</title>
     <body style="background:#000;color:#f2f2f2;font:13px ui-monospace,monospace;padding:40px 20px">
       <p>${msg}</p>
       <p><a href="/" style="color:#f2f2f2">späť na kriklún</a></p>
     </body>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}
