import "./smooth-scroll";

export function initializeSite(): void {
  // Mobile Menu Drawer
  const hamburger = document.getElementById('hamburgerBtn') as HTMLButtonElement | null;
  const menu = document.getElementById('mobileMenu') as HTMLElement | null;
  const backdrop = document.getElementById('mobile-backdrop') as HTMLElement | null;

  if (hamburger && menu) {
    const closeMenu = (): void => {
      menu.classList.remove('is-open');
      if (backdrop) backdrop.classList.remove('is-visible');
      menu.setAttribute('aria-hidden', 'true');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
      hamburger.focus();
    };

    const openMenu = (): void => {
      menu.classList.add('is-open');
      if (backdrop) backdrop.classList.add('is-visible');
      menu.setAttribute('aria-hidden', 'false');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
    };

    hamburger.addEventListener('click', () => {
      if (menu.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    menu.querySelectorAll<HTMLElement>('[data-close-menu]').forEach((el) => {
      el.addEventListener('click', closeMenu);
    });

    if (backdrop) {
      backdrop.addEventListener('click', closeMenu);
    }

    menu.querySelectorAll<HTMLAnchorElement>('.mobile-nav a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menu.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  // Hero word-by-word reveal animation (desktop only)
  const heroContent = document.querySelector<HTMLElement>('.hero-content');
  const isDesktopHero = window.matchMedia('(min-width: 761px)').matches;

  if (heroContent && isDesktopHero) {
    const heroEyebrow = heroContent.querySelector<HTMLElement>('.eyebrow');
    const heroTitle = heroContent.querySelector<HTMLElement>('h1');
    const heroTagline = heroContent.querySelector<HTMLElement>('.hero-tagline');
    const heroLead = heroContent.querySelector<HTMLElement>('.lead');
    const heroActions = heroContent.querySelector<HTMLElement>('.hero-actions');
    const heroTrustStrip = heroContent.querySelector<HTMLElement>('.hero-trust-strip');

    const splitHeroWords = (element: HTMLElement | null): HTMLElement[] => {
      if (!element) return [];
      const newChildren: Node[] = [];
      const wordSpans: HTMLElement[] = [];
      
      const processNode = (node: Node, isHighlightContext: boolean) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const textContent = (node.textContent || '').trim();
          if (!textContent) return;
          const words = textContent.split(/\s+/).filter(Boolean);
          words.forEach((text) => {
            const word = document.createElement('span');
            word.className = `hero-reveal-word${isHighlightContext ? ' text-accent' : ''}`;
            word.textContent = text;
            newChildren.push(word);
            wordSpans.push(word);
            newChildren.push(document.createTextNode(' '));
          });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          if (el.tagName === 'BR') {
            newChildren.push(el.cloneNode());
          } else {
            const isHighlight = isHighlightContext || el.classList.contains('text-accent');
            Array.from(el.childNodes).forEach(child => processNode(child, isHighlight));
          }
        }
      };

      Array.from(element.childNodes).forEach(child => processNode(child, false));
      element.replaceChildren(...newChildren);
      return wordSpans;
    };

    const scheduleHeroWords = (words: HTMLElement[], startDelay: number): number => {
      if (words.length === 0) return 0;
      let line = 0;
      let wordInLine = 0;
      let previousTop: number | null = null;
      words.forEach((word) => {
        const currentTop = word.offsetTop;
        if (previousTop !== null && Math.abs(currentTop - previousTop) > 2) {
          line += 1;
          wordInLine = 0;
        }
        word.style.setProperty('--hero-delay', `${startDelay + line * 0.07 + wordInLine * 0.018}s`);
        wordInLine += 1;
        previousTop = currentTop;
      });
      return line + 1;
    };

    const startHeroReveal = (): void => {
      const titleWords = splitHeroWords(heroTitle);
      const taglineWords = splitHeroWords(heroTagline);
      const leadWords = splitHeroWords(heroLead);
      heroContent.classList.add('hero-reveal-ready');
      
      const eyebrowDelay = 0.05;
      if (heroEyebrow) heroEyebrow.style.setProperty('--hero-delay', `${eyebrowDelay}s`);

      let currentDelay = 0.12;
      
      const titleLines = scheduleHeroWords(titleWords, currentDelay);
      if (titleLines > 0) currentDelay += titleLines * 0.07 + 0.24;

      const taglineLines = scheduleHeroWords(taglineWords, currentDelay);
      if (taglineLines > 0) currentDelay += taglineLines * 0.07 + 0.24;

      const leadLines = scheduleHeroWords(leadWords, currentDelay);
      if (leadLines > 0) currentDelay += leadLines * 0.07 + 0.24;

      const actionsDelay = currentDelay;
      if (heroActions) {
        heroActions.querySelectorAll<HTMLElement>(':scope > *').forEach((item, index) => {
          item.style.setProperty('--hero-delay', `${actionsDelay + index * 0.06}s`);
        });
        currentDelay += 0.3; // Give button some time before trust strip
      }

      if (heroTrustStrip) heroTrustStrip.style.setProperty('--hero-delay', `${currentDelay}s`);
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(startHeroReveal);
    } else {
      startHeroReveal();
    }
  }

  // FAQ Smooth Accordion (Exact parity with Instalacao-ar-condicionado-am-climatizar)
  const faqItems = document.querySelectorAll<HTMLDetailsElement>('.faq-list details');
  if (faqItems.length) {
    const faqTimeouts = new WeakMap<HTMLDetailsElement, number>();
    const FAQ_DURATION = 400;

    const clearFaqTimeout = (details: HTMLDetailsElement): void => {
      const timeout = faqTimeouts.get(details);
      if (timeout !== undefined) window.clearTimeout(timeout);
    };

    const finishOpenFaq = (details: HTMLDetailsElement, answer: HTMLElement): void => {
      clearFaqTimeout(details);
      faqTimeouts.set(
        details,
        window.setTimeout(() => {
          if (details.open && !details.classList.contains('is-closing')) {
            answer.style.height = 'auto';
          }
        }, FAQ_DURATION)
      );
    };

    const animatedCloseFaq = (details: HTMLDetailsElement): void => {
      const answer = details.querySelector<HTMLElement>('.faq-answer');
      if (!details.open || !answer || details.classList.contains('is-closing')) return;
      details.classList.add('is-closing');
      answer.style.height = `${answer.offsetHeight}px`;
      answer.style.opacity = '1';
      void answer.offsetHeight;
      answer.style.height = '0px';
      answer.style.opacity = '0';
      clearFaqTimeout(details);
      faqTimeouts.set(
        details,
        window.setTimeout(() => {
          details.removeAttribute('open');
          details.classList.remove('is-closing');
          answer.style.height = '';
          answer.style.opacity = '';
        }, FAQ_DURATION)
      );
    };

    const animatedOpenFaq = (details: HTMLDetailsElement): void => {
      const answer = details.querySelector<HTMLElement>('.faq-answer');
      if (!answer || details.open) return;
      details.classList.remove('is-closing');
      details.setAttribute('open', '');
      answer.style.height = '0px';
      answer.style.opacity = '0';
      void answer.offsetHeight;
      answer.style.height = `${answer.scrollHeight}px`;
      answer.style.opacity = '1';
      finishOpenFaq(details, answer);
    };

    faqItems.forEach((details) => {
      const summary = details.querySelector('summary');
      if (!summary) return;

      summary.addEventListener('click', (event: MouseEvent) => {
        event.preventDefault();
        if (details.classList.contains('is-closing')) {
          clearFaqTimeout(details);
          details.classList.remove('is-closing');
          const answer = details.querySelector<HTMLElement>('.faq-answer');
          if (answer) {
            answer.style.height = `${answer.scrollHeight}px`;
            answer.style.opacity = '1';
            finishOpenFaq(details, answer);
          }
          return;
        }
        if (details.open) {
          animatedCloseFaq(details);
        } else {
          faqItems.forEach((other) => {
            if (other !== details && other.open) animatedCloseFaq(other);
          });
          animatedOpenFaq(details);
        }
      });
    });
  }

  // Lightbox Modal
  const modal = document.getElementById('image-modal') as HTMLDialogElement | null;
  const modalImg = document.getElementById('modal-img') as HTMLImageElement | null;
  const modalCaption = document.getElementById('modal-caption') as HTMLElement | null;
  const modalClose = document.querySelector<HTMLButtonElement>('.modal-close');
  const projectCards = document.querySelectorAll<HTMLButtonElement>('.project-card');
  let lastFocusedElement: HTMLElement | null = null;

  function openModal(imageSrc: string, captionText: string): void {
    if (!modal || !modalImg || !modalCaption) return;
    lastFocusedElement = document.activeElement as HTMLElement | null;
    modalImg.src = imageSrc;
    modalImg.alt = captionText;
    modalCaption.textContent = captionText;
    modal.showModal();
    document.body.style.overflow = 'hidden';
  }

  function closeModal(): void {
    if (!modal) return;
    modal.close();
    document.body.style.overflow = '';
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  projectCards.forEach((card) => {
    card.addEventListener('click', () => {
      const imgSrc = card.getAttribute('data-image');
      const caption = card.getAttribute('data-caption') ?? '';
      if (imgSrc) {
        openModal(imgSrc, caption);
      }
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (event: MouseEvent) => {
      const rect = modal.getBoundingClientRect();
      const isInDialog =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!isInDialog) {
        closeModal();
      }
    });

    modal.addEventListener('close', () => {
      document.body.style.overflow = '';
      if (lastFocusedElement) {
        lastFocusedElement.focus();
      }
    });
  }

  // Scroll animations with IntersectionObserver (desktop/tablet only >= 761px)
  const isDesktop = window.matchMedia('(min-width: 761px)').matches;
  if (isDesktop && 'IntersectionObserver' in window) {
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-visible');
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const fadeElements = document.querySelectorAll<HTMLElement>('section:not(.hero)');
    fadeElements.forEach((el) => {
      el.classList.add('fade-in-hidden');
      observer.observe(el);
    });
  }

  // ScrollSpy for Navigation Links
  const scrollSpySections = document.querySelectorAll<HTMLElement>('section[id]');
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-link, .mobile-nav-link');

  if (scrollSpySections.length > 0 && navLinks.length > 0) {
    // Seções sem link no menu (ex.: #metodo, #faq) não devem apagar o indicador na passagem
    const linkedIds = new Set<string>();
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) linkedIds.add(href.slice(1));
    });

    const setActiveLink = (id: string | null): void => {
      navLinks.forEach(link => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
      });
    };

    // Durante a rolagem programática (Lenis / smooth nativo) o observer é suspenso
    // para o sublinhado não piscar nas seções intermediárias do trajeto.
    let scrollSpySuspended = false;
    let scrollSpyResumeTimeout = 0;

    const resumeScrollSpy = (): void => {
      window.clearTimeout(scrollSpyResumeTimeout);
      scrollSpySuspended = false;
    };

    const suspendScrollSpy = (): void => {
      scrollSpySuspended = true;
      window.clearTimeout(scrollSpyResumeTimeout);
      // Fallback absoluto: se nenhum scroll ocorrer (ex.: item já visível), retoma sozinho
      scrollSpyResumeTimeout = window.setTimeout(resumeScrollSpy, 2500);
    };

    // Retoma o spy logo após a rolagem terminar (debounce do último evento de scroll)
    window.addEventListener('scroll', () => {
      if (!scrollSpySuspended) return;
      window.clearTimeout(scrollSpyResumeTimeout);
      scrollSpyResumeTimeout = window.setTimeout(resumeScrollSpy, 200);
    }, { passive: true });

    // Clique no menu: marca o item na hora e suspende o spy até a chegada
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        const href = link.getAttribute('href');
        if (!href || !href.startsWith('#') || href.length < 2) return;
        setActiveLink(href.slice(1));
        suspendScrollSpy();
      });
    });

    const scrollSpyOptions = {
      root: null,
      rootMargin: '-40% 0px -60% 0px', // Ativa quando a seção cruza a linha de 40% do topo
      threshold: 0
    };

    const scrollSpyObserver = new IntersectionObserver((entries) => {
      if (scrollSpySuspended) return;
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          if (id && linkedIds.has(id)) {
            setActiveLink(id);
          }
        }
      });
    }, scrollSpyOptions);

    scrollSpySections.forEach(section => scrollSpyObserver.observe(section));
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSite);
  } else {
    initializeSite();
  }
}

