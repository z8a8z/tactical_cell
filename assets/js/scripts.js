/**
 * Tactical Cell (الخلية التكتيكية) — Interactive Client-Side Script
 * Zero-dependency Vanilla JS with full defensive guards (Gate 1 Compliant)
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    /* ----------------------------------------------------------------------
       0. Defensive Guards for Optional Vendor Libraries (Gate 1 Requirement)
       ---------------------------------------------------------------------- */
    if (typeof Lenis !== 'undefined') {
      try {
        const lenis = new Lenis({ duration: 1.1 });
        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      } catch (err) {
        // Fallback to native CSS smooth scroll
      }
    }

    if (typeof WOW !== 'undefined') {
      try {
        new WOW().init();
      } catch (err) {
        // Ignore if WOW fails
      }
    }

    /* ----------------------------------------------------------------------
       1. Sticky Navigation & Mobile Drawer Toggle (#navigation) — Gate 3
       ---------------------------------------------------------------------- */
    const header = document.getElementById('navigation');
    const toggleBtn = document.querySelector('.navbar-toggler');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('#navMenu .nav-link');

    function closeMobileMenu() {
      if (!toggleBtn || !navMenu) return;
      navMenu.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.setAttribute('aria-label', 'فتح القائمة الرئيسية');
      document.body.classList.remove('menu-open');
    }

    function openMobileMenu() {
      if (!toggleBtn || !navMenu) return;
      navMenu.classList.add('active');
      toggleBtn.setAttribute('aria-expanded', 'true');
      toggleBtn.setAttribute('aria-label', 'إغلاق القائمة الرئيسية');
      document.body.classList.add('menu-open');
    }

    if (toggleBtn && navMenu) {
      toggleBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
          closeMobileMenu();
        } else {
          openMobileMenu();
        }
      });

      navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
          closeMobileMenu();
        });
      });

      document.addEventListener('click', function (e) {
        if (
          navMenu.classList.contains('active') &&
          !navMenu.contains(e.target) &&
          !toggleBtn.contains(e.target)
        ) {
          closeMobileMenu();
        }
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
          closeMobileMenu();
          toggleBtn.focus();
        }
      });

      window.addEventListener('resize', function () {
        if (window.innerWidth > 1080 && navMenu.classList.contains('active')) {
          closeMobileMenu();
        }
      });
    }

    /* ----------------------------------------------------------------------
       2. Scroll State & Active Section Spy
       ---------------------------------------------------------------------- */
    const sections = document.querySelectorAll('main section[id]');

    function handleScroll() {
      const scrollY = window.scrollY || window.pageYOffset;

      if (header) {
        if (scrollY > 24) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }

      if (sections.length && navLinks.length) {
        let currentSectionId = 'hero';
        sections.forEach(function (sec) {
          const top = sec.offsetTop - 130;
          const height = sec.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            currentSectionId = sec.getAttribute('id');
          }
        });

        navLinks.forEach(function (link) {
          const href = link.getAttribute('href');
          if (href === '#' + currentSectionId) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    /* ----------------------------------------------------------------------
       3. Visual Intelligence Archive Filtering (#gallery)
       ---------------------------------------------------------------------- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const archiveItems = document.querySelectorAll('.archive-item');

    if (filterBtns.length && archiveItems.length) {
      filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          const filterValue = btn.getAttribute('data-filter');

          filterBtns.forEach(function (b) {
            b.classList.remove('active');
            b.setAttribute('aria-pressed', 'false');
          });
          btn.classList.add('active');
          btn.setAttribute('aria-pressed', 'true');

          archiveItems.forEach(function (item) {
            const itemCat = item.getAttribute('data-category');
            if (filterValue === 'all' || itemCat === filterValue) {
              item.classList.remove('hidden');
            } else {
              item.classList.add('hidden');
            }
          });
        });
      });
    }

    /* ----------------------------------------------------------------------
       4. FAQ Accordion (#faq)
       ---------------------------------------------------------------------- */
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length) {
      faqItems.forEach(function (item) {
        const questionBtn = item.querySelector('.faq-question');
        if (!questionBtn) return;

        questionBtn.addEventListener('click', function () {
          const isOpen = item.classList.contains('active');

          faqItems.forEach(function (other) {
            other.classList.remove('active');
            const otherBtn = other.querySelector('.faq-question');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          });

          if (!isOpen) {
            item.classList.add('active');
            questionBtn.setAttribute('aria-expanded', 'true');
          }
        });
      });
    }

    /* ----------------------------------------------------------------------
       5. Analytical Dossier Reader Modal (#dossierModal)
       ---------------------------------------------------------------------- */
    const modalBackdrop = document.getElementById('dossierModal');
    const modalTitle = document.getElementById('modalDossierTitle');
    const modalImg = document.getElementById('modalDossierImg');
    const modalSummary = document.getElementById('modalDossierSummary');
    const modalPoints = document.getElementById('modalDossierPoints');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const dossierButtons = document.querySelectorAll('.dossier-read-btn');

    function closeDossierModal() {
      if (!modalBackdrop) return;
      modalBackdrop.classList.remove('active');
      modalBackdrop.setAttribute('aria-hidden', 'true');
    }

    if (modalBackdrop && dossierButtons.length) {
      dossierButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          const title = btn.getAttribute('data-title') || '';
          const img = btn.getAttribute('data-img') || '';
          const summary = btn.getAttribute('data-summary') || '';
          const pointsRaw = btn.getAttribute('data-points') || '';

          if (modalTitle) modalTitle.textContent = title;
          if (modalImg) {
            modalImg.src = img;
            modalImg.alt = title;
          }
          if (modalSummary) modalSummary.textContent = summary;
          if (modalPoints) {
            modalPoints.innerHTML = '';
            pointsRaw.split('|').forEach(function (pt) {
              if (pt.trim()) {
                const li = document.createElement('li');
                li.textContent = pt.trim();
                modalPoints.appendChild(li);
              }
            });
          }

          modalBackdrop.classList.add('active');
          modalBackdrop.setAttribute('aria-hidden', 'false');
          if (modalCloseBtn) modalCloseBtn.focus();
        });
      });

      if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeDossierModal);
      }

      modalBackdrop.addEventListener('click', function (e) {
        if (e.target === modalBackdrop) {
          closeDossierModal();
        }
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
          closeDossierModal();
        }
      });
    }

    /* ----------------------------------------------------------------------
       6. Research & Media Inquiry Form (#researchContactForm)
       ---------------------------------------------------------------------- */
    const contactForm = document.getElementById('researchContactForm');
    const formFeedback = document.getElementById('formFeedback');

    if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const nameInput = document.getElementById('senderName');
        const emailInput = document.getElementById('senderEmail');
        const topicInput = document.getElementById('inquiryTopic');
        const messageInput = document.getElementById('inquiryMessage');

        const nameVal = nameInput ? nameInput.value.trim() : '';
        const emailVal = emailInput ? emailInput.value.trim() : '';
        const topicVal = topicInput ? topicInput.value.trim() : 'طلب استشارة / تعاون بحثي';
        const messageVal = messageInput ? messageInput.value.trim() : '';

        if (!nameVal || !emailVal || !messageVal) {
          return;
        }

        if (formFeedback) {
          formFeedback.textContent =
            'تم تجهيز رسالتك بنجاح إلى وحدة الأبحاث في الخلية التكتيكية (tacticalcell.business@gmail.com). جاري فتح برنامج البريد الإلكتروني لإتمام الإرسال الرسمي.';
          formFeedback.classList.add('visible');
        }

        const subject = encodeURIComponent('الخلية التكتيكية | ' + topicVal + ' - ' + nameVal);
        const body = encodeURIComponent(
          'الاسم / الجهة: ' + nameVal + '\n' +
          'البريد الإلكتروني: ' + emailVal + '\n' +
          'نوع المراسلة: ' + topicVal + '\n\n' +
          'تفاصيل الرسالة:\n' + messageVal
        );

        window.location.href = 'mailto:tacticalcell.business@gmail.com?subject=' + subject + '&body=' + body;
      });
    }
  });
})();
