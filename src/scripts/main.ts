import "./smooth-scroll";

export function initializeSite(): void {
  // --- HEADER SCROLL LOGIC ---
  const header = document.getElementById("site-header");
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Init
  }

  // --- MOBILE DRAWER LOGIC ---
  const toggleBtn = document.getElementById("mobile-menu-toggle") as HTMLButtonElement | null;
  const closeBtn = document.getElementById("mobile-menu-close") as HTMLButtonElement | null;
  const drawer = document.getElementById("mobile-drawer");
  const backdrop = document.getElementById("mobile-backdrop");
  const navLinks = document.querySelectorAll(".mobile-nav-link");

  const openDrawer = () => {
    if (drawer && backdrop && toggleBtn) {
      drawer.classList.add("is-open");
      backdrop.classList.add("is-open");
      backdrop.setAttribute("aria-hidden", "false");
      toggleBtn.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }
  };

  const closeDrawer = () => {
    if (drawer && backdrop && toggleBtn) {
      drawer.classList.remove("is-open");
      backdrop.classList.remove("is-open");
      backdrop.setAttribute("aria-hidden", "true");
      toggleBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
  };

  if (toggleBtn) toggleBtn.addEventListener("click", openDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  if (backdrop) backdrop.addEventListener("click", closeDrawer);
  
  navLinks.forEach((link) => {
    link.addEventListener("click", closeDrawer);
  });

  // --- REVEAL ANIMATIONS ---
  const revealElements = document.querySelectorAll("[data-reveal]");
  
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -50px 0px",
        threshold: 0.1,
      }
    );

    revealElements.forEach((el) => {
      revealObserver.observe(el);
    });
  } else {
    // Fallback
    revealElements.forEach((el) => {
      el.classList.add("is-revealed");
    });
  }
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeSite);
  } else {
    initializeSite();
  }
}
