import React, { useEffect, useMemo, useState } from "react";

/**
 * EnableMeNow — Single-file React simulation
 * ------------------------------------------------------------
 * This is a self-contained preview of the EnableMeNow site.
 * - TailwindCSS styles are used for layout & polish.
 * - No external deps; everything is in this file for reliability.
 * - Tabs simulate routing: Home, About, Videos, Products, Membership, Cart.
 * - Cart & membership are fully interactive (in-memory only).
 *
 * Quick customization inside the UI (no code edits required):
 * 1) Videos ▶ paste your two YouTube PLAYLIST IDs (or keep the samples).
 * 2) Products ▶ tweak cart, try checkout.
 * 3) Membership ▶ pick a plan & email, then “Join”.
 */

// ----------------------------- Utility ------------------------------
const currency = (n) => `$${n.toFixed(2)}`;

const classNames = (...xs) => xs.filter(Boolean).join(" ");

// ----------------------------- Data ---------------------------------
const FEATURED_QUOTES = [
  {
    q: "We judge ourselves by our intentions. Others judge us by our actions.",
    a: "— JonJon",
  },
  {
    q: "If you’re not uncomfortable, you’re not growing.",
    a: "— JonJon",
  },
  {
    q: "Profit can turn pain into pride. Control turns chaos into clarity.",
    a: "— JonJon",
  },
];

const PRODUCTS = [
  {
    id: "ebook-versioning",
    title: "Versioning Yourself (E‑book)",
    desc: "A fast, practical blueprint to become a new version of you—on demand.",
    price: 19,
    badge: "New",
    type: "ebook",
  },
  {
    id: "sprint-7",
    title: "7‑Day Cognitive Reframe Sprint",
    desc: "Daily micro‑lessons + prompts to break autopilot thinking.",
    price: 99,
    badge: "Popular",
    type: "course",
  },
  {
    id: "power-pack",
    title: "Mindfulness Power Pack (Bundle)",
    desc: "Guided audios + worksheets for momentum in 30 minutes/day.",
    price: 149,
    badge: "Bundle",
    type: "bundle",
  },
  {
    id: "clarity-1on1",
    title: "1:1 Clarity Call (60 min)",
    desc: "Get unstuck fast—direct feedback, reframes, and action steps.",
    price: 199,
    badge: "Limited",
    type: "coaching",
  },
];

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    priceMonthly: 9,
    blurb: "Weekly reframing prompts + private newsletter.",
    features: ["Weekly prompts", "Private newsletter", "Member comments"],
  },
  {
    id: "pro",
    name: "Pro",
    priceMonthly: 29,
    blurb: "Courses library + monthly live Q&A.",
    features: ["All Starter", "Courses library", "Monthly live Q&A"],
    popular: true,
  },
  {
    id: "elite",
    name: "Elite",
    priceMonthly: 79,
    blurb: "Everything + quarterly 1:1 sprint with JonJon.",
    features: ["All Pro", "Quarterly 1:1 sprint", "Beta access"],
  },
];

// ----------------------------- UI Bits -------------------------------
function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs font-medium">
      {children}
    </span>
  );
}

function Button({ as = "button", className = "", children, ...props }) {
  const Cmp = as;
  return (
    <Cmp
      className={classNames(
        "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold shadow-sm",
        "bg-black text-white hover:bg-zinc-800 active:scale-98 transition",
        "dark:bg-white dark:text-black dark:hover:bg-zinc-200",
        className
      )}
      {...props}
    >
      {children}
    </Cmp>
  );
}

function Card({ children }) {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm p-5">
      {children}
    </div>
  );
}

function Section({ title, kicker, actions, children }) {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          {kicker && (
            <div className="text-xs uppercase tracking-widest text-zinc-500 mb-1">{kicker}</div>
          )}
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h2>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </section>
  );
}

// ----------------------------- Cart ----------------------------------
function useCart() {
  const [items, setItems] = useState([]); // [{id, qty}]

  const add = (id, qty = 1) =>
    setItems((xs) => {
      const found = xs.find((x) => x.id === id);
      if (found) return xs.map((x) => (x.id === id ? { ...x, qty: x.qty + qty } : x));
      return [...xs, { id, qty }];
    });

  const update = (id, qty) => setItems((xs) => xs.map((x) => (x.id === id ? { ...x, qty } : x)));
  const remove = (id) => setItems((xs) => xs.filter((x) => x.id !== id));
  const clear = () => setItems([]);

  const lines = useMemo(() => {
    return items
      .map((x) => {
        const p = PRODUCTS.find((p) => p.id === x.id);
        if (!p) return null;
        return { ...p, qty: x.qty, subtotal: p.price * x.qty };
      })
      .filter(Boolean);
  }, [items]);

  const total = useMemo(() => lines.reduce((s, l) => s + l.subtotal, 0), [lines]);

  return { items, add, update, remove, clear, lines, total };
}

// ----------------------------- Pages ---------------------------------
function Hero({ onGetStarted, onViewProducts }) {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-white to-cyan-100 opacity-60 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black leading-tight">
              Enable<span className="text-amber-500">Me</span>Now
            </h1>
            <p className="mt-4 text-lg text-zinc-700 dark:text-zinc-300">
              Cognitive reframing + mindfulness that actually moves the needle.
              Less woo‑woo, more do‑do. (Yes, we said it.)
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={onGetStarted}>Get started</Button>
              <Button className="bg-white text-black border border-zinc-200 dark:bg-zinc-900 dark:text-white dark:border-zinc-800" onClick={onViewProducts}>
                Browse products
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <Chip>Mindset Sprints</Chip>
              <Chip>Short, punchy courses</Chip>
              <Chip>Action > Intention</Chip>
            </div>
          </div>
          <Card>
            <div className="aspect-video w-full rounded-xl bg-gradient-to-br from-amber-200 to-cyan-200 dark:from-zinc-800 dark:to-zinc-700 grid place-items-center text-center p-6">
              <div>
                <div className="text-sm uppercase tracking-wider text-zinc-600 dark:text-zinc-300">Quick Peek</div>
                <div className="text-2xl font-bold mt-1">How “Versioning Yourself” Works</div>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300 max-w-md mx-auto">
                  Make tiny upgrades daily. New you, unlocked—on purpose.
                </p>
              </div>
            </div>
            <div className="mt-4 grid sm:grid-cols-3 gap-3">
              {FEATURED_QUOTES.map((q) => (
                <Card key={q.q}>
                  <div className="text-sm">{q.q}</div>
                  <div className="mt-2 text-xs text-zinc-500">{q.a}</div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function About() {
  return (
    <Section title="About JonJon" kicker="Meet the human behind the frames">
      <div className="grid md:grid-cols-3 gap-6 items-start">
        <Card>
          <div className="aspect-square rounded-xl bg-gradient-to-br from-cyan-200 to-amber-200 dark:from-zinc-800 dark:to-zinc-700" />
          <div className="mt-4">
            <div className="text-lg font-semibold">Cognitive Reframer • Mindfulness Maker</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">
              20+ years building businesses, now building better brains. I turn
              overthinking into over‑achieving and help nice humans stop
              negotiating with their excuses.
            </div>
          </div>
        </Card>
        <div className="md:col-span-2 grid gap-6">
          <Card>
            <h3 className="text-xl font-bold">The Not‑So‑Serious Bio</h3>
            <p className="mt-2 text-zinc-700 dark:text-zinc-300">
              Former telecom exec turned mindset mechanic. I’ve climbed towers,
              shipped stuff, and deleted more drafts than most people have
              ideas. My mission: give you reframes that stick harder than your
              favorite meme and get you taking action faster than your coffee.
            </p>
            <ul className="mt-3 list-disc list-inside text-zinc-700 dark:text-zinc-300 text-sm">
              <li>Zero fluff. Maximum momentum.</li>
              <li>Proof‑based, practice‑driven, slightly goofy.</li>
              <li>We measure progress in actions taken, not vibes felt.</li>
            </ul>
          </Card>
          <Card>
            <h3 className="text-xl font-bold">What we teach</h3>
            <div className="mt-3 grid sm:grid-cols-2 gap-4 text-sm">
              <ul className="space-y-2">
                <li>• Cognitive reframing that sticks in 60 seconds</li>
                <li>• Mindfulness you’ll actually remember to use</li>
                <li>• Decision loops that kill procrastination</li>
              </ul>
              <ul className="space-y-2">
                <li>• “Versioning Yourself” micro‑upgrades</li>
                <li>• Action tracking to define importance</li>
                <li>• Anti‑self‑judgment habits that free energy</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </Section>
  );
}

function Videos() {
  const [playlist1, setPlaylist1] = useState("PL9tY0mSamplePlaylistIdAAAA");
  const [playlist2, setPlaylist2] = useState("PL9tY0mSamplePlaylistIdBBBB");

  return (
    <Section
      title="Videos"
      kicker="Two channels, one mission"
      actions={<Chip>Paste your playlist IDs</Chip>}
    >
      <Card>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium">Playlist ID #1</label>
            <input
              className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
              placeholder="e.g. PLxxxxxxxxxxxxxxxx"
              value={playlist1}
              onChange={(e) => setPlaylist1(e.target.value)}
            />
            <div className="mt-3 aspect-video rounded-xl overflow-hidden">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(
                  playlist1
                )}`}
                title="Channel 1 Playlist"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Playlist ID #2</label>
            <input
              className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
              placeholder="e.g. PLxxxxxxxxxxxxxxxx"
              value={playlist2}
              onChange={(e) => setPlaylist2(e.target.value)}
            />
            <div className="mt-3 aspect-video rounded-xl overflow-hidden">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(
                  playlist2
                )}`}
                title="Channel 2 Playlist"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
        <p className="mt-4 text-xs text-zinc-500">
          Tip: Open any playlist on YouTube and copy the ID after <code>list=</code>.
        </p>
      </Card>
    </Section>
  );
}

function Products({ onAdd }) {
  return (
    <Section title="Products" kicker="Short, sharp, transformational">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRODUCTS.map((p) => (
          <Card key={p.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-semibold">{p.title}</div>
                <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{p.desc}</div>
              </div>
              {p.badge && <Chip>{p.badge}</Chip>}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-xl font-bold">{currency(p.price)}</div>
              <Button onClick={() => onAdd(p.id)}>Add to cart</Button>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function Membership({ onJoin }) {
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("pro");

  const chosen = PLANS.find((p) => p.id === plan) || PLANS[1];

  return (
    <Section title="Membership" kicker="Momentum on tap">
      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <Card>
          <h3 className="text-xl font-bold">Join EnableMeNow</h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Pick a plan. Enter your email. Get access instantly.
          </p>
          <label className="block mt-4 text-sm font-medium">Email</label>
          <input
            className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="block mt-4 text-sm font-medium">Plan</label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {PLANS.map((x) => (
              <button
                key={x.id}
                className={classNames(
                  "rounded-xl border px-3 py-2 text-sm text-left",
                  x.id === plan
                    ? "border-black bg-black text-white dark:bg-white dark:text-black"
                    : "border-zinc-200 dark:border-zinc-800"
                )}
                onClick={() => setPlan(x.id)}
              >
                <div className="font-semibold">{x.name}</div>
                <div className="text-xs opacity-70">{currency(x.priceMonthly)}/mo</div>
              </button>
            ))}
          </div>
          <Button className="mt-4 w-full" onClick={() => onJoin({ email, plan: chosen })}>
            Join {chosen.name} — {currency(chosen.priceMonthly)}/mo
          </Button>
          <div className="mt-3 text-xs text-zinc-500">
            Cancel anytime. Your data is yours. No spam, only gains.
          </div>
        </Card>
        <div className="lg:col-span-2 grid md:grid-cols-3 gap-4">
          {PLANS.map((p) => (
            <Card key={p.id}>
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold">{p.name}</div>
                {p.popular && <Chip>Popular</Chip>}
              </div>
              <div className="mt-1 text-2xl font-black">{currency(p.priceMonthly)}<span className="text-sm font-semibold">/mo</span></div>
              <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{p.blurb}</div>
              <ul className="mt-3 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}

function CartPage({ cart, onUpdate, onRemove, onClear, onCheckout }) {
  return (
    <Section title="Your Cart" kicker="Ready when you are" actions={cart.lines.length > 0 && <Button onClick={onClear}>Clear</Button>}>
      {cart.lines.length === 0 ? (
        <Card>
          <div className="text-sm text-zinc-600 dark:text-zinc-300">Your cart is empty. Go add some momentum.</div>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid gap-4">
            {cart.lines.map((l) => (
              <Card key={l.id}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-semibold">{l.title}</div>
                    <div className="text-sm text-zinc-500">{currency(l.price)} each</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      className="w-20 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
                      value={l.qty}
                      onChange={(e) => onUpdate(l.id, Math.max(1, Number(e.target.value) || 1))}
                    />
                    <div className="w-24 text-right font-semibold">{currency(l.subtotal)}</div>
                    <Button className="bg-white text-black border border-zinc-200 dark:bg-zinc-900 dark:text-white dark:border-zinc-800" onClick={() => onRemove(l.id)}>Remove</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div>
            <Card>
              <div className="flex items-center justify-between">
                <div className="font-semibold">Subtotal</div>
                <div className="font-bold">{currency(cart.total)}</div>
              </div>
              <div className="mt-1 text-xs text-zinc-500">Taxes calculated at checkout. Digital products deliver instantly.</div>
              <Button className="mt-4 w-full" onClick={onCheckout}>Checkout</Button>
            </Card>
          </div>
        </div>
      )}
    </Section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <Section title="Get the weekly reframe" kicker="Newsletter">
      <Card>
        {done ? (
          <div className="text-sm">Boom. You’re in. Check your inbox for a welcome note.</div>
        ) : (
          <div className="flex flex-col md:flex-row items-center gap-3">
            <input
              className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm w-full"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button onClick={() => setDone(true)}>Subscribe</Button>
          </div>
        )}
      </Card>
    </Section>
  );
}

// ----------------------------- App Shell -----------------------------
const TABS = ["Home", "About", "Videos", "Products", "Membership", "Cart"];

export default function EnableMeNowApp() {
  const [tab, setTab] = useState("Home");
  const cart = useCart();
  const [toast, setToast] = useState(null);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const onJoin = ({ email, plan }) => {
    if (!email.includes("@")) return notify("Enter a valid email");
    notify(`Welcome to ${plan.name}, ${email}!`);
    cart.add(`membership-${plan.id}`, 1);
  };

  const onCheckout = () => {
    if (cart.lines.length === 0) return notify("Cart is empty");
    notify("Checkout complete — receipt sent!");
    cart.clear();
  };

  return (
    <div className="min-h-screen bg-white text-black dark:bg-zinc-950 dark:text-white">
      {/* Top bar */}
      <div className="sticky top-0 z-50 backdrop-blur border-b border-zinc-200/70 dark:border-zinc-800/70 bg-white/70 dark:bg-zinc-950/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-400 to-cyan-400" />
            <div className="font-black tracking-tight">Enable<span className="text-amber-500">Me</span>Now</div>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={classNames(
                  "px-3 py-2 rounded-xl text-sm font-medium",
                  tab === t ? "bg-black text-white dark:bg-white dark:text-black" : "hover:bg-zinc-100 dark:hover:bg-zinc-900"
                )}
              >
                {t}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button
              className="hidden sm:inline-flex bg-white text-black border border-zinc-200 dark:bg-zinc-900 dark:text-white dark:border-zinc-800"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? "Dark" : "Light"} mode
            </Button>
            <Button onClick={() => setTab("Cart")}>
              Cart {cart.lines.length > 0 && <span className="ml-1">({cart.lines.length})</span>}
            </Button>
          </div>
        </div>
        {/* Mobile nav */}
        <div className="md:hidden px-3 pb-3 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={classNames(
                "px-3 py-2 rounded-xl text-sm font-medium",
                tab === t ? "bg-black text-white dark:bg-white dark:text-black" : "bg-zinc-100 dark:bg-zinc-900"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-3 right-3 z-50">
          <div className="rounded-xl bg-black text-white dark:bg-white dark:text-black px-4 py-2 shadow-lg text-sm">
            {toast}
          </div>
        </div>
      )}

      {/* Lead magnet banner */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-amber-50/60 dark:bg-amber-500/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3 text-sm">
          <div>
            <strong>Free mini‑course:</strong> 5 reframes in 5 days — join the newsletter below.
          </div>
          <button className="underline decoration-dotted" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}>Get it</button>
        </div>
      </div>

      {/* Pages */}
      {tab === "Home" && (
        <>
          <Hero
            onGetStarted={() => setTab("Membership")}
            onViewProducts={() => setTab("Products")}
          />
          <Products onAdd={(id) => { cart.add(id); setTab("Cart"); }} />
          <Newsletter />
          <Footer />
        </>
      )}

      {tab === "About" && (
        <>
          <About />
          <Newsletter />
          <Footer />
        </>
      )}

      {tab === "Videos" && (
        <>
          <Videos />
          <Newsletter />
          <Footer />
        </>
      )}

      {tab === "Products" && (
        <>
          <Products onAdd={(id) => { cart.add(id); notify("Added to cart"); }} />
          <CartCta onGoCart={() => setTab("Cart")} />
          <Footer />
        </>
      )}

      {tab === "Membership" && (
        <>
          <Membership onJoin={(x) => { onJoin(x); setTab("Cart"); }} />
          <Footer />
        </>
      )}

      {tab === "Cart" && (
        <>
          <CartPage
            cart={cart}
            onUpdate={cart.update}
            onRemove={cart.remove}
            onClear={cart.clear}
            onCheckout={onCheckout}
          />
          <Footer />
        </>
      )}
    </div>
  );
}

function CartCta({ onGoCart }) {
  return (
    <Section title="Ready to check out?" kicker="Next step">
      <Card>
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="text-sm text-zinc-700 dark:text-zinc-300">
            Your upgrades are waiting in the cart. Let’s make them yours.
          </div>
          <Button onClick={onGoCart}>Go to cart</Button>
        </div>
      </Card>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-4 gap-6 text-sm">
        <div>
          <div className="font-black mb-2">Enable<span className="text-amber-500">Me</span>Now</div>
          <div className="text-zinc-600 dark:text-zinc-300">
            Less self‑judgment. More self‑upgrades.
          </div>
        </div>
        <div>
          <div className="font-semibold mb-2">Explore</div>
          <ul className="space-y-2">
            {TABS.map((t) => (
              <li key={t} className="opacity-80">{t}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Policies</div>
          <ul className="space-y-2 opacity-80">
            <li>Privacy</li>
            <li>Terms</li>
            <li>Refunds</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Contact</div>
          <div className="opacity-80">hello@enablemenow.example</div>
          <div className="opacity-80 mt-1">© {new Date().getFullYear()} EnableMeNow</div>
        </div>
      </div>
    </footer>
  );
}
