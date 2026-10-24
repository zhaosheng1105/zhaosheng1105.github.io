(function () {
  "use strict";

  const key = "sheng-zhao-language";
  const root = document.documentElement;
  const allowed = ["en", "zh-CN"];
  const titles = {
    en: "Sheng Zhao | Personal Homepage",
    "zh-CN": "赵晟 | 个人主页",
  };
  const descriptions = {
    en: "Sheng Zhao — vehicle dynamics and control at the handling limits, autonomous racing, and vehicle drift control. NTU–SJTU joint Ph.D. candidate.",
    "zh-CN": "赵晟，新加坡南洋理工大学与上海交通大学联授博士学位项目博士研究生，研究方向为操纵极限下的车辆动力学与控制、自动驾驶赛车及车辆漂移控制。",
  };

  function applyLanguage(language) {
    root.lang = language;
    root.dataset.language = language;
    document.title = titles[language];
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = descriptions[language];
    const button = document.getElementById("language-toggle");
    if (button) button.setAttribute("aria-label", language === "en" ? "切换为中文" : "Switch to English");
  }

  let language = "en";
  const requested = new URLSearchParams(window.location.search).get("lang");
  try {
    const stored = window.localStorage.getItem(key);
    if (allowed.includes(stored)) language = stored;
  } catch (_) {
    // The language switch also works when browser storage is unavailable.
  }
  if (allowed.includes(requested)) language = requested;
  applyLanguage(language);

  document.addEventListener("DOMContentLoaded", function () {
    // Reapply after parsing so the title and button match the initial preference.
    applyLanguage(language);
    document.getElementById("language-toggle").addEventListener("click", function () {
      language = root.lang === "en" ? "zh-CN" : "en";
      applyLanguage(language);
      try {
        window.localStorage.setItem(key, language);
      } catch (_) {
        // A blocked storage policy must not prevent switching the page.
      }
      const url = new URL(window.location.href);
      url.searchParams.set("lang", language);
      try {
        window.history.replaceState(null, "", url);
      } catch (_) {
        // Content switching does not depend on the history API.
      }
    });

    const links = Array.from(document.querySelectorAll('nav a[href^="#"]'));
    const sections = links.map(function (link) {
      return document.getElementById(link.hash.slice(1));
    });
    const header = document.querySelector(".site-header");
    let scheduled = false;
    let selectedSection = sections.find(function (section) {
      return section && "#" + section.id === window.location.hash;
    });
    let selectedScrollY = null;

    function markCurrentSection(current) {
      links.forEach(function (link) {
        if (current && link.hash === "#" + current.id) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }

    function updateNavigation() {
      const mobile = window.getComputedStyle(header).position === "sticky";
      const offset = mobile ? header.getBoundingClientRect().height + 20 : 20;
      document.documentElement.style.setProperty("--scroll-offset", offset + "px");
      if (selectedSection) {
        markCurrentSection(selectedSection);
        return;
      }
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      // Give short sections near the footer their own scroll range instead of
      // forcing the last section active as soon as the page reaches the bottom.
      const endSpacing = Math.min(120, maxScroll / Math.max(1, sections.length - 1));
      let current = sections[0];
      sections.forEach(function (section, index) {
        if (!section || maxScroll === 0) return;
        const naturalStart = section.getBoundingClientRect().top + window.scrollY - offset;
        const latestStart = maxScroll - (sections.length - 1 - index) * endSpacing;
        const activationStart = Math.max(0, Math.min(naturalStart, latestStart));
        if (window.scrollY + 2 >= activationStart) current = section;
      });
      markCurrentSection(current);
    }

    function scheduleNavigationUpdate() {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(function () {
        scheduled = false;
        updateNavigation();
      });
    }

    window.addEventListener(
      "scroll",
      function () {
        if (selectedSection && selectedScrollY !== null && Math.abs(window.scrollY - selectedScrollY) > 2) selectedSection = null;
        scheduleNavigationUpdate();
      },
      { passive: true }
    );
    window.addEventListener("resize", scheduleNavigationUpdate);
    links.forEach(function (link, index) {
      link.addEventListener("click", function () {
        // A native anchor can be clamped at the bottom of the page. Keep the
        // requested section active until the visitor starts scrolling again.
        selectedSection = sections[index];
        selectedScrollY = null;
        markCurrentSection(selectedSection);
        window.requestAnimationFrame(function () {
          selectedScrollY = window.scrollY;
        });
      });
    });
    window.addEventListener("hashchange", function () {
      selectedSection = sections.find(function (section) {
        return section && "#" + section.id === window.location.hash;
      });
      selectedScrollY = window.scrollY;
      updateNavigation();
    });
    function resumeScrollTracking() {
      selectedSection = null;
      scheduleNavigationUpdate();
    }
    window.addEventListener("wheel", resumeScrollTracking, { passive: true });
    window.addEventListener("touchmove", resumeScrollTracking, { passive: true });
    window.addEventListener("pointerdown", function (event) {
      if (event.clientX >= document.documentElement.clientWidth) resumeScrollTracking();
    });
    window.addEventListener("keydown", function (event) {
      if (
        ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key) &&
        !event.target.closest("input, textarea, select, button")
      ) {
        resumeScrollTracking();
      }
    });
    document.getElementById("language-toggle").addEventListener("click", updateNavigation);
    updateNavigation();
    window.requestAnimationFrame(function () {
      selectedScrollY = window.scrollY;
    });
  });
})();
