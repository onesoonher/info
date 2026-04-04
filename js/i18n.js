/**
 * Site i18n: zh (Traditional Chinese, default) / en. URL ?lang=en takes priority, then localStorage, then zh.
 * Internal codes are "zh" | "en" (no hyphen) so language toggle labels stay clean.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "info.lang";
  var SITE_PAGES = ["index.html", "experience.html", "research.html", "publications.html"];

  function normalizeStoredLang(s) {
    if (s === "zh-Hant") return "zh";
    if (s === "en" || s === "zh") return s;
    return null;
  }

  function getQueryLang() {
    var params = new URLSearchParams(window.location.search);
    var raw = (params.get("lang") || "").toLowerCase().trim();
    if (raw === "en") return "en";
    if (raw === "zh-hant" || raw === "zh_tw" || raw === "zh-tw" || raw === "zh") return "zh";
    return null;
  }

  function resolveLang() {
    var q = getQueryLang();
    if (q) return q;
    try {
      var s = localStorage.getItem(STORAGE_KEY);
      var n = normalizeStoredLang(s);
      if (n) {
        if (s === "zh-Hant") {
          try {
            localStorage.setItem(STORAGE_KEY, "zh");
          } catch (e2) {}
        }
        return n;
      }
    } catch (e) {}
    return "zh";
  }

  function setStoredLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
  }

  function getNested(obj, path) {
    return path.split(".").reduce(function (o, k) {
      return o && o[k] !== undefined ? o[k] : null;
    }, obj);
  }

  function isSitePageHref(href) {
    if (!href || href.indexOf("#") === 0) return false;
    if (/^https?:\/\//i.test(href)) return false;
    if (href.indexOf("mailto:") === 0) return false;
    var path = href.split("?")[0].split("#")[0];
    var file = path.replace(/^.*\//, "");
    return SITE_PAGES.indexOf(file) !== -1;
  }

  function buildHrefWithLang(href, lang) {
    if (!isSitePageHref(href)) return href;
    var parts = href.split("#");
    var baseAndQuery = parts[0];
    var hash = parts.length > 1 ? "#" + parts.slice(1).join("#") : "";
    var bq = baseAndQuery.split("?");
    var base = bq[0];
    var params = new URLSearchParams(bq[1] || "");
    if (lang === "en") {
      params.set("lang", "en");
    } else {
      params.delete("lang");
    }
    var q = params.toString();
    return base + (q ? "?" + q : "") + hash;
  }

  function syncUrlBar(lang) {
    var url = new URL(window.location.href);
    if (lang === "en") {
      url.searchParams.set("lang", "en");
    } else {
      url.searchParams.delete("lang");
    }
    if (window.history && window.history.replaceState) {
      window.history.replaceState({}, "", url.pathname + url.search + url.hash);
    }
  }

  var messages = null;

  function applyMessages(lang) {
    if (!messages) return;
    document.documentElement.lang = lang === "en" ? "en" : "zh-Hant";
    document.body.classList.toggle("lang-en", lang === "en");
    document.body.classList.toggle("lang-zh-hant", lang === "zh");

    var t = getNested(messages, "site.title");
    if (t) document.title = t;

    var desc = document.querySelector('meta[name="description"]');
    var d = getNested(messages, "site.description");
    if (desc && d) desc.setAttribute("content", d);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var val = getNested(messages, key);
      if (val != null) el.textContent = val;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-placeholder");
      var val = getNested(messages, key);
      if (val != null) el.setAttribute("placeholder", val);
    });

    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria");
      var val = getNested(messages, key);
      if (val != null) el.setAttribute("aria-label", val);
    });

    document.querySelectorAll("a[href]").forEach(function (a) {
      var href = a.getAttribute("href");
      if (!href || !isSitePageHref(href)) return;
      a.setAttribute("href", buildHrefWithLang(href, lang));
    });

    document.querySelectorAll(".lang-switch-btn").forEach(function (btn) {
      var target = btn.getAttribute("data-lang");
      var labelKey = target === "en" ? "lang.en" : "lang.zh";
      var label = getNested(messages, labelKey);
      if (label != null) {
        btn.textContent = String(label).replace(/-+$/g, "").trim();
      }
      btn.classList.toggle("active", target === lang);
      btn.setAttribute("aria-pressed", target === lang ? "true" : "false");
    });
  }

  function loadJson(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error(url);
      return r.json();
    });
  }

  function init() {
    var lang = resolveLang();
    if (lang === "en" && getQueryLang() !== "en") {
      syncUrlBar("en");
    }

    var jsonName = lang === "en" ? "en.json" : "zh-Hant.json";

    loadJson("i18n/" + jsonName)
      .then(function (data) {
        messages = data;
        setStoredLang(lang);
        applyMessages(lang);
      })
      .catch(function () {
        return loadJson("i18n/zh-Hant.json").then(function (data) {
          messages = data;
          lang = "zh";
          setStoredLang(lang);
          syncUrlBar(lang);
          applyMessages(lang);
        });
      });

    document.querySelectorAll(".lang-switch-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var target = btn.getAttribute("data-lang");
        if (!target || target === resolveLang()) return;

        var next = target;
        setStoredLang(next);
        syncUrlBar(next);

        var jsonFile = next === "en" ? "en.json" : "zh-Hant.json";
        loadJson("i18n/" + jsonFile)
          .then(function (data) {
            messages = data;
            applyMessages(next);
          })
          .catch(function () {
            console.warn("i18n: failed to load", jsonFile);
          });
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
