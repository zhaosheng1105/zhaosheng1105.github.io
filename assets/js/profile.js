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
    en: "Sheng Zhao — vehicle dynamics and control, reinforcement learning, and autonomous driving. NTU–SJTU joint Ph.D. candidate.",
    "zh-CN": "赵晟，南洋理工大学与上海交通大学联授博士学位项目博士研究生，研究方向为车辆动力学与控制、强化学习及自主驾驶。",
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
  });
})();
