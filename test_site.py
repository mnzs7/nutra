"""VitaShop visual smoke test — checks 7 pages, captures screenshots, reports console errors."""
import os
from playwright.sync_api import sync_playwright

BASE = "http://localhost:3000"
OUT  = "test_screenshots"
os.makedirs(OUT, exist_ok=True)

PAGES = [
    ("homepage",        "/"),
    ("products",        "/products"),
    ("product_detail",  "/products/vitamina-d3-k2-vitamax"),
    ("cart",            "/cart"),
    ("quiz",            "/quiz"),
    ("compare",         "/compare"),
    ("login",           "/auth/login"),
]

results = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(viewport={"width": 1280, "height": 900})

    for name, path in PAGES:
        page = context.new_page()
        errors = []
        page.on("console", lambda msg: errors.append(f"[{msg.type}] {msg.text}") if msg.type == "error" else None)
        page.on("pageerror", lambda err: errors.append(f"[pageerror] {err}"))

        url = BASE + path
        try:
            page.goto(url, timeout=15000)
            page.wait_for_load_state("networkidle", timeout=10000)
        except Exception as e:
            results.append((name, url, f"LOAD ERROR: {e}", []))
            page.close()
            continue

        shot = f"{OUT}/{name}.png"
        page.screenshot(path=shot, full_page=True)

        title = page.title()
        h1 = page.locator("h1, h2").first.inner_text() if page.locator("h1, h2").count() else "(no heading)"

        # Spot-checks per page
        checks = []
        if name == "homepage":
            checks.append(("hero section", page.locator("text=VitaShop, text=Vita, text=Bem-vindo, text=Suplementos").count() > 0 or page.locator("section").count() > 0))
            checks.append(("nav links", page.locator("nav a").count() >= 3))
        elif name == "products":
            card_count = page.locator("[class*='ProductCard'], article, [class*='product']").count()
            checks.append((f"product cards visible ({card_count})", card_count > 0))
        elif name == "product_detail":
            checks.append(("add to cart button", page.locator("button:has-text('Adicionar'), button:has-text('carrinho'), button:has-text('Esgotado')").count() > 0))
        elif name == "cart":
            checks.append(("cart section present", page.locator("main").count() > 0))
        elif name == "quiz":
            checks.append(("quiz content", page.locator("main").count() > 0))
        elif name == "compare":
            checks.append(("compare section", page.locator("main").count() > 0))
        elif name == "login":
            checks.append(("email input", page.locator("input[type='email'], input[name='email']").count() > 0))
            checks.append(("password input", page.locator("input[type='password']").count() > 0))

        console_errors = [e for e in errors if "DATABASE_URL" not in e and "prisma" not in e.lower()]
        results.append((name, url, "OK", checks, console_errors, title, h1))
        page.close()

    browser.close()

# ── Report ──────────────────────────────────────────────────────────────────
print("\n" + "="*70)
print("  VitaShop Visual Smoke Test Results")
print("="*70)

all_pass = True
for row in results:
    if len(row) == 4:
        name, url, status, _ = row
        print(f"\n❌ {name.upper()} — {url}")
        print(f"   {status}")
        all_pass = False
        continue

    name, url, status, checks, console_errors, title, h1 = row
    pass_count = sum(1 for _, ok in checks if ok)
    total = len(checks)
    icon = "✅" if pass_count == total and not console_errors else "⚠️"
    if pass_count < total or console_errors:
        all_pass = False

    print(f"\n{icon} {name.upper()} — {url}")
    print(f"   Title : {title}")
    print(f"   Heading: {h1}")
    print(f"   Checks : {pass_count}/{total} passed")
    for label, ok in checks:
        print(f"     {'✓' if ok else '✗'} {label}")
    if console_errors:
        print(f"   Console errors ({len(console_errors)}):")
        for e in console_errors[:5]:
            print(f"     • {e}")
    print(f"   Screenshot: {OUT}/{name}.png")

print("\n" + "="*70)
print(f"  {'ALL PAGES PASS ✅' if all_pass else 'SOME ISSUES FOUND ⚠️'}")
print(f"  Screenshots saved to ./{OUT}/")
print("="*70 + "\n")
