window.addEventListener('error', e => { try { (window.__errs = window.__errs || []).push(String(e.message).slice(0, 200)); if (!/[?&#]debug/.test(location.href) || /^script error\.?$/i.test(String(e.message || '').trim())) return; let b = document.getElementById('errBox'); if (!b) { b = document.createElement('div'); b.id = 'errBox'; b.style.cssText = 'position:fixed;left:8px;right:8px;bottom:8px;z-index:99;background:#300;color:#fbb;font:11px monospace;padding:8px;border-radius:8px;white-space:pre-wrap'; document.body.appendChild(b); } b.textContent = 'error: ' + e.message + ' @' + e.lineno + ':' + e.colno; } catch (x) {} });
(() => {
'use strict';
const $ = id => document.getElementById(id);
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;

/* ================= Dyes & color science ================= */