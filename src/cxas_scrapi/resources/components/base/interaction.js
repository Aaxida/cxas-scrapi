var failuresOnly = false;
var latencyExpanded = false;

function toggleTheme() {
  var doc = document.documentElement;
  var isDark = doc.dataset.theme === "dark" ||
      document.body.classList.contains("dark-mode") ||
      (!doc.dataset.theme && !document.body.classList.contains("light-mode") &&
       window.matchMedia &&
       window.matchMedia("(prefers-color-scheme: dark)").matches);
  if (isDark) {
    doc.dataset.theme = "light";
    document.body.classList.remove("dark-mode");
    document.body.classList.add("light-mode");
  } else {
    doc.dataset.theme = "dark";
    document.body.classList.remove("light-mode");
    document.body.classList.add("dark-mode");
  }
}

function switchTab(tabName) {
  if (!tabName) return;
  if (tabName.startsWith("tab-")) {
    tabName = tabName.substring(4);
  }
  var panes = document.querySelectorAll(".tab-pane");
  var buttons = document.querySelectorAll("#report-nav button");

  var targetPane = document.getElementById("tab-" + tabName);
  if (!targetPane) return;

  panes.forEach(function(p) {
    p.classList.remove("active");
  });
  targetPane.classList.add("active");

  buttons.forEach(function(b) {
    b.classList.toggle("active", b.dataset.tab === tabName);
  });

  if (window.history && window.history.replaceState) {
    history.replaceState(null, "", "#t=" + tabName);
  } else {
    location.hash = "t=" + tabName;
  }
}

function openSuiteLatency() {
  switchTab("latency");
  var el = document.getElementById("section-latency");
  if (el) {
    el.setAttribute("open", "");
    setTimeout(function() {
      el.scrollIntoView({behavior: "smooth", block: "start"});
    }, 50);
  }
}

function toggleAllLatency() {
  latencyExpanded = !latencyExpanded;
  var btn = document.getElementById("btn-latency");
  if (btn) {
    btn.classList.toggle("active", latencyExpanded);
    btn.textContent = latencyExpanded
        ? "⏱ Collapse All Latency"
        : "⏱ Expand All Latency";
  }
  document.querySelectorAll("details.latency-drawer").forEach(function(d) {
    if (latencyExpanded) {
      d.setAttribute("open", "");
    } else {
      d.removeAttribute("open");
    }
  });
}

function switchPlSlice(key) {
  document.querySelectorAll(".pl-slice-panel").forEach(function(panel) {
    panel.style.display = (panel.id === "pl-slice-" + key) ? "block" : "none";
  });
  document.querySelectorAll(".pl-slice-btn").forEach(function(btn) {
    btn.classList.toggle("active", btn.id === "pl-btn-" + key);
  });
}

function jumpTo(type, evalName) {
  if (evalName === undefined) {
    evalName = type;
    type = "sim";
  }
  if (type === "golden") {
    switchTab("goldens");
  } else if (type === "sim") {
    switchTab("sims");
  } else if (type === "tool" || type === "callback") {
    switchTab("unit");
  }

  var safeEval = evalName.replace(/[^a-zA-Z0-9_-]/g, "_");
  var card = document.getElementById("eval-" + type + "-" + evalName) ||
      document.getElementById("eval-" + evalName) ||
      document.getElementById("eval-" + type + "-" + safeEval);
  if (!card) return;

  var details = card.querySelectorAll("details.run-detail");
  var opened = false;
  details.forEach(function(d) {
    if (!opened && d.dataset.failed === "true") {
      d.setAttribute("open", "");
      opened = true;
    } else {
      d.removeAttribute("open");
    }
  });
  if (!opened && details.length > 0) details[0].setAttribute("open", "");

  setTimeout(function() {
    card.scrollIntoView({behavior: "smooth", block: "start"});
    card.classList.add("highlight-target");
    setTimeout(function() { card.classList.remove("highlight-target"); }, 2000);
  }, 50);
}

function jumpToRun(type, evalName, runIdx) {
  if (runIdx === undefined) {
    runIdx = evalName;
    evalName = type;
    type = "sim";
  }
  if (type === "golden") {
    switchTab("goldens");
  } else if (type === "sim") {
    switchTab("sims");
  } else if (type === "tool" || type === "callback") {
    switchTab("unit");
  }

  var safeEval = evalName.replace(/[^a-zA-Z0-9_-]/g, "_");
  var card = document.getElementById("eval-" + type + "-" + evalName) ||
      document.getElementById("eval-" + evalName) ||
      document.getElementById("eval-" + type + "-" + safeEval);
  if (!card) return;

  var details = card.querySelectorAll("details.run-detail");
  details.forEach(function(d) {
    d.removeAttribute("open");
  });
  if (details[runIdx]) {
    details[runIdx].setAttribute("open", "");
  }
  setTimeout(function() {
    card.scrollIntoView({behavior: "smooth", block: "start"});
    card.classList.add("highlight-target");
    setTimeout(function() { card.classList.remove("highlight-target"); }, 2000);
  }, 50);
}

function toggleFailures() {
  failuresOnly = !failuresOnly;
  var btn = document.getElementById("btn-failures");
  if (btn) {
    btn.classList.toggle("active", failuresOnly);
  }
  document.querySelectorAll("tr[data-passed]").forEach(function(row) {
    if (failuresOnly && row.dataset.passed === "true") {
      row.classList.add("hidden-row");
    } else {
      row.classList.remove("hidden-row");
    }
  });
  document.querySelectorAll(".eval-card[data-passed]").forEach(function(card) {
    if (failuresOnly && card.dataset.passed === "true") {
      card.classList.add("hidden-card");
    } else {
      card.classList.remove("hidden-card");
    }
  });
}

function expandAll() {
  document.querySelectorAll("details:not(.latency-drawer)").forEach(function(d) {
    d.setAttribute("open", "");
  });
}

function collapseAll() {
  document.querySelectorAll("details").forEach(function(d) {
    d.removeAttribute("open");
  });
  latencyExpanded = false;
  var btn = document.getElementById("btn-latency");
  if (btn) {
    btn.classList.remove("active");
    btn.textContent = "⏱ Expand All Latency";
  }
}

function filterEvals(query) {
  var q = (query || "").toLowerCase().trim();
  document.querySelectorAll("tr[data-passed]").forEach(function(row) {
    var text = (row.textContent || "").toLowerCase();
    var match = !q || text.indexOf(q) !== -1;
    row.style.display = match ? "" : "none";
  });
  document.querySelectorAll(".eval-card").forEach(function(card) {
    var text = (card.textContent || "").toLowerCase();
    var match = !q || text.indexOf(q) !== -1;
    card.style.display = match ? "" : "none";
  });
}

// Global initialization
window.addEventListener("DOMContentLoaded", function() {
  function handleHash() {
    var hash = location.hash || "";
    if (hash.startsWith("#t=")) {
      switchTab(hash.substring(3));
    } else if (hash === "#section-latency") {
      switchTab("latency");
      openSuiteLatency();
    } else if (hash === "#section-goldens") {
      switchTab("goldens");
    } else if (hash === "#section-sims") {
      switchTab("sims");
    } else if (hash === "#section-tools" || hash === "#section-callbacks") {
      switchTab("unit");
    } else if (hash.startsWith("#eval-")) {
      var el = document.getElementById(hash.substring(1));
      if (el) {
        var pane = el.closest(".tab-pane");
        if (pane) {
          switchTab(pane.id.replace("tab-", ""));
        }
        setTimeout(function() {
          el.scrollIntoView({behavior: "smooth", block: "start"});
          el.classList.add("highlight-target");
        }, 50);
      }
    }
  }

  handleHash();
  window.addEventListener("hashchange", handleHash);

  var searchInput = document.getElementById("q");
  if (searchInput) {
    searchInput.addEventListener("input", function(e) {
      filterEvals(e.target.value);
    });
  }

  document.addEventListener("keydown", function(e) {
    if (e.key === "/" && document.activeElement !== searchInput) {
      var tag = (document.activeElement && document.activeElement.tagName) || "";
      if (tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
    }
  });
});
