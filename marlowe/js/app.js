(function () {
  const KEY = "marlowe_cart_v1";
  const PRODUCTS = {
    studio: { id: "studio", name: "Marlowe Studio Book", base: 2199, img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80" },
    "cut-15": { id: "cut-15", name: "Marlowe Cut 15", base: 1899, img: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80" },
    "grade-16": { id: "grade-16", name: "Marlowe Grade 16", base: 2599, img: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1200&q=80" },
    "frame-14": { id: "frame-14", name: "Marlowe Frame 14", base: 1699, img: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1200&q=80" },
    "reel-17": { id: "reel-17", name: "Marlowe Reel 17", base: 2899, img: "https://images.unsplash.com/photo-1485846234645-a62644f54777?auto=format&fit=crop&w=1200&q=80" }
  };
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } };
  const save = (c) => localStorage.setItem(KEY, JSON.stringify(c));
  const money = (n) => "$" + n.toLocaleString("en-US");
  const count = () => load().reduce((s, i) => s + i.qty, 0);
  const total = () => load().reduce((s, i) => s + i.price * i.qty, 0);
  function add(item) {
    const cart = load();
    const key = item.id + "|" + (item.config || "");
    const f = cart.find((x) => x.key === key);
    if (f) f.qty += item.qty || 1;
    else cart.push({ key, id: item.id, name: item.name, config: item.config || "Standard", price: item.price, img: item.img, qty: item.qty || 1 });
    save(cart); render();
  }
  function updateQty(key, qty) { save(load().map((i) => i.key === key ? { ...i, qty: Math.max(1, qty) } : i)); render(); if (window.renderCart) window.renderCart(); }
  function remove(key) { save(load().filter((i) => i.key !== key)); render(); if (window.renderCart) window.renderCart(); }
  function clear() { save([]); render(); }
  function openD() { document.getElementById("shade")?.classList.add("on"); document.getElementById("drawer")?.classList.add("on"); }
  function closeD() { document.getElementById("shade")?.classList.remove("on"); document.getElementById("drawer")?.classList.remove("on"); }
  function render() {
    document.querySelectorAll("[data-count]").forEach((e) => e.textContent = count());
    const b = document.getElementById("db");
    if (b) {
      const c = load();
      b.innerHTML = c.length ? c.map((i) => `<div style="display:grid;grid-template-columns:64px 1fr auto;gap:8px;margin-bottom:12px"><img src="${i.img}" style="width:64px;height:48px;object-fit:cover" alt=""><div><strong>${i.name}</strong><div>${i.config}</div>${money(i.price)} × ${i.qty}</div><button class="linebtn" data-rm="${i.key}">×</button></div>`).join("") : "<p>The satchel is empty.</p>";
      b.querySelectorAll("[data-rm]").forEach((x) => x.onclick = () => remove(x.dataset.rm));
    }
    const t = document.getElementById("dt");
    if (t) t.textContent = money(total());
  }
  window.MW = { PRODUCTS, load, add, updateQty, remove, clear, money, count, total, openD, closeD, render };
  document.addEventListener("DOMContentLoaded", () => {
    render();
    document.getElementById("ham")?.addEventListener("click", () => document.getElementById("nav")?.classList.toggle("open"));
    document.querySelectorAll("[data-bag]").forEach((b) => b.onclick = openD);
    document.getElementById("shade")?.addEventListener("click", closeD);
    document.getElementById("dclose")?.addEventListener("click", closeD);
    document.querySelectorAll("[data-add]").forEach((btn) => {
      btn.onclick = () => {
        const p = PRODUCTS[btn.dataset.add];
        add({ id: p.id, name: p.name, price: p.base, img: p.img, qty: 1, config: "Base" });
        openD();
      };
    });
  });
})();
