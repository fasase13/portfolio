/**
 * ==========================================================================
 * FRANCIS ANGELO S. SASE - INTERACTIVE MULTI-PAGE PORTFOLIO
 * Vanilla JavaScript Single-Page Router, Typewriter, Modals, Filters & Theme
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. Page Router Engine (SPA Navigation with Hash History)
     -------------------------------------------------------------------------- */
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link, [data-navigate]');
  const pageViews = document.querySelectorAll('.page-view');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');

  const pageTitleMap = {
    'home': 'Francis Angelo S. Sase | Web Author & Developer',
    'about': 'About | Francis Angelo S. Sase - Information Systems',
    'projects': 'Projects & Case Studies | Francis Angelo S. Sase',
    'skills': 'Skills & Competencies | Francis Angelo S. Sase',
    'certificates': 'Certificates & Credentials | Francis Angelo S. Sase',
    'contact': 'Contact & Connect | Francis Angelo S. Sase',
    'resume': 'Resume View | Francis Angelo S. Sase'
  };

  function switchPage(targetPage, updateHistory = true) {
    if (!targetPage) targetPage = 'home';
    targetPage = targetPage.replace('#', '').toLowerCase();

    // Check if view element exists
    const targetView = document.getElementById(`view-${targetPage}`);
    if (!targetView) {
      targetPage = 'home';
    }

    // Toggle active view
    pageViews.forEach(view => {
      view.classList.remove('active');
    });

    const activeView = document.getElementById(`view-${targetPage}`);
    if (activeView) {
      activeView.classList.add('active');
    }

    // Update active state on navigation links
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
      const pageAttr = link.getAttribute('data-page');
      if (pageAttr === targetPage) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update Browser Document Title
    if (pageTitleMap[targetPage]) {
      document.title = pageTitleMap[targetPage];
    }

    // Update URL Hash without breaking history
    if (updateHistory && window.location.hash.replace('#', '') !== targetPage) {
      window.location.hash = targetPage;
    }

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Close mobile drawer if open
    if (mobileDrawer && mobileDrawer.classList.contains('open')) {
      mobileDrawer.classList.remove('open');
    }


  }

  // Handle all navigation clicks
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetPage = link.getAttribute('data-page') || link.getAttribute('data-navigate');
      if (targetPage) {
        e.preventDefault();
        switchPage(targetPage);
      }
    });
  });

  // Mobile menu toggle
  if (mobileNavToggle && mobileDrawer) {
    mobileNavToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
    });
  }

  // Listen for browser Back/Forward hash changes
  window.addEventListener('hashchange', () => {
    const currentHash = window.location.hash.replace('#', '') || 'home';
    switchPage(currentHash, false);
  });

  // Initial load routing
  const initialPage = window.location.hash.replace('#', '') || 'home';
  switchPage(initialPage, false);

  /* --------------------------------------------------------------------------
     2. Theme Management (Dark / Light with LocalStorage & OS Preference)
     -------------------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  const themeLabel = document.getElementById('theme-label');
  const htmlElement = document.documentElement;

  const savedTheme = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  applyTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      showToast(`Switched to ${newTheme} mode`);
    });
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      htmlElement.setAttribute('data-theme', 'dark');
      if (themeIcon) themeIcon.className = 'fa-regular fa-sun';
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('title', 'Switch to light theme');
        themeToggleBtn.setAttribute('aria-label', 'Switch to light theme');
      }
    } else {
      htmlElement.removeAttribute('data-theme');
      if (themeIcon) themeIcon.className = 'fa-regular fa-moon';
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('title', 'Switch to dark theme');
        themeToggleBtn.setAttribute('aria-label', 'Switch to dark theme');
      }
    }
    localStorage.setItem('portfolio-theme', theme);
  }

  /* --------------------------------------------------------------------------
     3. Print / Save as PDF Functionality
     -------------------------------------------------------------------------- */
  function prepareResumeForPrint() {
    switchPage('resume');
    const resumeRoleEl = document.getElementById('typewriter-role');
    if (resumeRoleEl) {
      resumeRoleEl.textContent = 'Web Author & Developer';
    }
  }

  const printButtons = document.querySelectorAll('.print-trigger-btn');
  printButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      prepareResumeForPrint();
      setTimeout(() => {
        window.print();
      }, 250);
    });
  });

  window.addEventListener('beforeprint', prepareResumeForPrint);

  /* --------------------------------------------------------------------------
     4. Dynamic Hero Typewriter Cycling Effect
     -------------------------------------------------------------------------- */
  const heroTypewriterEl = document.getElementById('hero-typewriter');
  const heroRoles = [
    'Web Author & Developer',
    'Systems Analyst',
    'BSIS Student at CHMSU',
    'Technical Documentation Specialist'
  ];
  let roleIndex = 0;
  let textIndex = 0;
  let isDeleting = false;
  const typingSpeed = 70;
  const deletingSpeed = 35;
  const pauseEnd = 1600;

  function typeHeroRole() {
    if (!heroTypewriterEl) return;

    const currentRole = heroRoles[roleIndex];

    if (isDeleting) {
      heroTypewriterEl.textContent = currentRole.substring(0, textIndex - 1);
      textIndex--;
    } else {
      heroTypewriterEl.textContent = currentRole.substring(0, textIndex + 1);
      textIndex++;
    }

    let delay = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && textIndex === currentRole.length) {
      delay = pauseEnd;
      isDeleting = true;
    } else if (isDeleting && textIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % heroRoles.length;
      delay = 400;
    }

    setTimeout(typeHeroRole, delay);
  }

  setTimeout(typeHeroRole, 400);

  /* --------------------------------------------------------------------------
     5. Resume Role Subtitle Typewriter
     -------------------------------------------------------------------------- */
  const resumeTypewriter = document.getElementById('typewriter-role');
  const resumeCursor = document.getElementById('typewriter-cursor');
  if (resumeTypewriter) {
    let rIdx = 0;
    const rText = 'Web Author & Developer';
    function typeResumeRole() {
      if (rIdx < rText.length) {
        resumeTypewriter.textContent += rText.charAt(rIdx);
        rIdx++;
        setTimeout(typeResumeRole, 60);
      } else {
        setTimeout(() => {
          if (resumeCursor) resumeCursor.classList.add('hidden');
        }, 1200);
      }
    }
    setTimeout(typeResumeRole, 600);
  }

  /* --------------------------------------------------------------------------
     6. Staggered Fade Entrance (IntersectionObserver)
     -------------------------------------------------------------------------- */
  const fadeSections = document.querySelectorAll('.fade-section');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, idx * 90);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    fadeSections.forEach(s => observer.observe(s));
  } else {
    fadeSections.forEach(s => s.classList.add('is-visible'));
  }

  /* --------------------------------------------------------------------------
     7. Interactive Skill Pills with Tooltip / Highlight
     -------------------------------------------------------------------------- */
  const skillPills = document.querySelectorAll('.skill-pill');
  skillPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const isAlreadyActive = pill.classList.contains('active');
      skillPills.forEach(p => p.classList.remove('active'));
      if (!isAlreadyActive) {
        pill.classList.add('active');
      }
    });

    pill.setAttribute('tabindex', '0');
    pill.setAttribute('role', 'button');
    pill.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        pill.click();
      }
    });
  });

  /* --------------------------------------------------------------------------
     8. Copy to Clipboard Contact Items + Toast Notification
     -------------------------------------------------------------------------- */
  const copyButtons = document.querySelectorAll('.copy-btn');
  const toastContainer = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  let toastTimeoutId = null;

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const textToCopy = btn.getAttribute('data-copy');
      const label = btn.getAttribute('data-label') || 'Text';

      if (!textToCopy) return;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          const tempInput = document.createElement('textarea');
          tempInput.value = textToCopy;
          tempInput.style.position = 'fixed';
          tempInput.style.opacity = '0';
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }

        const icon = btn.querySelector('i');
        const originalClass = icon ? icon.className : '';
        btn.classList.add('copied');
        if (icon) icon.className = 'fa-solid fa-check';

        showToast(`${label} copied to clipboard!`);

        setTimeout(() => {
          btn.classList.remove('copied');
          if (icon) icon.className = originalClass;
        }, 1800);
      } catch (err) {
        console.error('Failed to copy: ', err);
        showToast('Failed to copy to clipboard');
      }
    });
  });

  function showToast(message) {
    if (!toastContainer || !toastMessage) return;

    toastMessage.textContent = message;
    toastContainer.classList.add('show');

    if (toastTimeoutId) {
      clearTimeout(toastTimeoutId);
    }

    toastTimeoutId = setTimeout(() => {
      toastContainer.classList.remove('show');
    }, 2500);
  }

  /* --------------------------------------------------------------------------
     9. Collapsible Experience Bullets (Compact / Detailed View)
     -------------------------------------------------------------------------- */
  const toggleExpBtn = document.getElementById('toggle-experience-btn');
  const expBulletsList = document.getElementById('experience-bullets-list');
  const toggleExpText = document.getElementById('toggle-experience-text');
  const toggleExpIcon = document.getElementById('toggle-experience-icon');

  let isDetailedView = true;
  if (toggleExpBtn && expBulletsList) {
    toggleExpBtn.addEventListener('click', () => {
      isDetailedView = !isDetailedView;
      if (isDetailedView) {
        expBulletsList.classList.remove('compact');
        if (toggleExpText) toggleExpText.textContent = 'Compact View';
        if (toggleExpIcon) toggleExpIcon.className = 'fa-solid fa-compress';
        showToast('Displaying all 5 experience highlights');
      } else {
        expBulletsList.classList.add('compact');
        if (toggleExpText) toggleExpText.textContent = 'Detailed View';
        if (toggleExpIcon) toggleExpIcon.className = 'fa-solid fa-expand';
        showToast('Condensed to summary view');
      }
    });
  }

  /* --------------------------------------------------------------------------
     10. Project Filtering by Category
     -------------------------------------------------------------------------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue || category.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     11. Interactive Project Detail Modal (WashQueue Capstone)
     -------------------------------------------------------------------------- */
  const projectModal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalProjectTitle = document.getElementById('modal-project-title');
  const modalProjectCategory = document.getElementById('modal-project-category');
  const modalProjectImg = document.getElementById('modal-project-img');
  const modalProjectDesc = document.getElementById('modal-project-desc');
  const modalProjectTags = document.getElementById('modal-project-tags');
  const triggerWashqueueModal = document.getElementById('trigger-washqueue-modal');

  const washqueueData = {
    title: 'WashQueue: Smart Queuing & Scheduling',
    category: 'BS Information Systems • CHMSU Capstone',
    image: 'assets/washqueue_icon.png',
    liveUrl: 'https://www.washqueue.online/',
    description: 'WashQueue is a production web and mobile application that eliminates physical wait lines at car wash establishments. It features remote virtual queue entry, real-time status tracking, service bay scheduling, an operator dashboard, and Google authentication.',
    tags: [
      '👑 Project Lead',
      'CHMSU Capstone',
      'Flutter Web & Mobile',
      'Progressive Web App (PWA)',
      'Virtual Queuing',
      'Bay Scheduling',
      'Google Auth Bridge',
      'Geolocation',
      'Real-Time Cloud DB'
    ]
  };

  function openWashqueueModal() {
    if (modalProjectTitle) modalProjectTitle.textContent = washqueueData.title;
    if (modalProjectCategory) modalProjectCategory.textContent = washqueueData.category;
    if (modalProjectImg) modalProjectImg.src = washqueueData.image;
    if (modalProjectDesc) modalProjectDesc.textContent = washqueueData.description;

    if (modalProjectTags) {
      modalProjectTags.innerHTML = '';
      washqueueData.tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'tech-tag';
        span.textContent = tag;
        modalProjectTags.appendChild(span);
      });
    }

    if (projectModal) {
      projectModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  if (triggerWashqueueModal) {
    triggerWashqueueModal.addEventListener('click', openWashqueueModal);
  }

  if (modalCloseBtn && projectModal) {
    modalCloseBtn.addEventListener('click', closeModal);
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeModal();
    });
  }

  function closeModal() {
    if (projectModal) {
      projectModal.classList.remove('open');
      document.body.style.overflow = '';
    }
    const certModal = document.getElementById('cert-modal');
    if (certModal) {
      certModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  /* --------------------------------------------------------------------------
     12. Interactive Certificate Modal Controller & Authentic Credentials Data
     -------------------------------------------------------------------------- */
  const certificatesData = [
    {
      title: 'Database Security',
      issuer: 'Cybrary • Continuing Education',
      category: 'Database Security & Access Governance',
      status: 'Verified (1 CEU)',
      date: 'May 29, 2025',
      certNumber: 'CC-2e200e90-f092-448d-918b-06d26850c702',
      description: 'Completed training in Database Security covering SQL injection defense, access control, privilege separation, data encryption, and audit logging.',
      image: 'assets/certificates/database-security-cybrary.png',
      pdf: 'assets/certificates/database-security-cybrary.pdf'
    },
    {
      title: 'IT Fundamentals: Security',
      issuer: 'Cybrary • Continuing Education',
      category: 'IT Security & Defense Fundamentals',
      status: 'Verified (3 CEUs)',
      date: 'June 4, 2025',
      certNumber: 'CC-5476a453-7258-48ea-ac0e-fa83b0b728c7',
      description: 'Completed training in IT Fundamentals: Security covering fundamental security models, network defenses, threat identification, and host protection.',
      image: 'assets/certificates/it-fundamentals-security-cybrary.png',
      pdf: 'assets/certificates/it-fundamentals-security-cybrary.pdf'
    },
    {
      title: 'Responsible AI: Applying AI Principles with Google Cloud',
      issuer: 'Google Cloud • Simplilearn | SkillUP',
      category: 'Artificial Intelligence & Ethics',
      status: 'Verified Credential',
      date: 'October 28, 2025',
      certNumber: 'Declaration of Completion',
      description: 'Completed Google Cloud course on Responsible AI, covering ethical principles, human-centric evaluation, bias mitigation, and safety practices.',
      image: 'assets/certificates/responsible-ai-google-cloud.png',
      pdf: null
    },
    {
      title: 'Introduction to Modern AI',
      issuer: 'Cisco • DICT-ITU DTC Initiative',
      category: 'Artificial Intelligence & Machine Learning',
      status: 'Verified Credential',
      date: 'November 09, 2025',
      certNumber: 'DICT-ITU DTC Initiative',
      description: 'Completed Cisco Networking Academy course on Modern AI, covering core AI paradigms, machine learning concepts, algorithms, and practical applications.',
      image: 'assets/certificates/intro-modern-ai-cisco.png',
      pdf: 'assets/certificates/intro-modern-ai-cisco.pdf'
    },
    {
      title: 'Introduction to Cybersecurity',
      issuer: 'Cisco • DICT-ITU DTC Initiative',
      category: 'Cybersecurity Principles & Threat Defense',
      status: 'Verified Credential',
      date: 'November 16, 2025',
      certNumber: 'DICT-ITU DTC Initiative',
      description: 'Completed Cisco Networking Academy course on Cybersecurity, covering cyber defense principles, threat landscapes, CIA triads, and system countermeasures.',
      image: 'assets/certificates/intro-cybersecurity-cisco.png',
      pdf: 'assets/certificates/intro-cybersecurity-cisco.pdf'
    }
  ];

  const certCards = document.querySelectorAll('.certificate-card');
  const certModal = document.getElementById('cert-modal');
  const certModalCloseBtn = document.getElementById('cert-modal-close-btn');
  const certModalImg = document.getElementById('cert-modal-img');
  const certModalTitle = document.getElementById('cert-modal-title');
  const certModalIssuer = document.getElementById('cert-modal-issuer');
  const certModalDesc = document.getElementById('cert-modal-desc');
  const certModalDate = document.getElementById('cert-modal-date');
  const certModalNumber = document.getElementById('cert-modal-number');
  const certModalCategory = document.getElementById('cert-modal-category');
  const certModalPdfBtn = document.getElementById('cert-modal-pdf-btn');
  const certModalImageBtn = document.getElementById('cert-modal-image-btn');
  const certModalCopyIdBtn = document.getElementById('cert-modal-copy-id-btn');

  function openCertificateModal(index) {
    const cert = certificatesData[index];
    if (!cert) return;

    if (certModalImg) {
      certModalImg.src = cert.image;
      certModalImg.alt = `${cert.title} - ${cert.issuer}`;
    }
    if (certModalTitle) certModalTitle.textContent = cert.title;
    if (certModalIssuer) certModalIssuer.textContent = cert.issuer;
    if (certModalDesc) certModalDesc.textContent = cert.description;
    if (certModalDate) certModalDate.textContent = cert.date;
    if (certModalNumber) certModalNumber.textContent = cert.certNumber || 'Accredited Completion';
    if (certModalCategory) certModalCategory.textContent = cert.category;

    if (certModalImageBtn) {
      certModalImageBtn.href = cert.image;
    }

    if (certModalPdfBtn) {
      if (cert.pdf) {
        certModalPdfBtn.href = cert.pdf;
        certModalPdfBtn.style.display = 'inline-flex';
      } else {
        certModalPdfBtn.style.display = 'none';
      }
    }

    if (certModalCopyIdBtn) {
      if (cert.certNumber && cert.certNumber.startsWith('CC-')) {
        certModalCopyIdBtn.style.display = 'inline-flex';
        certModalCopyIdBtn.onclick = () => {
          if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(cert.certNumber).then(() => {
              showToast('Credential ID copied to clipboard!');
            });
          } else {
            const temp = document.createElement('textarea');
            temp.value = cert.certNumber;
            document.body.appendChild(temp);
            temp.select();
            document.execCommand('copy');
            document.body.removeChild(temp);
            showToast('Credential ID copied to clipboard!');
          }
        };
      } else {
        certModalCopyIdBtn.style.display = 'none';
      }
    }

    if (certModal) {
      certModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  certCards.forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.getAttribute('data-cert-index'), 10);
      openCertificateModal(idx);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const idx = parseInt(card.getAttribute('data-cert-index'), 10);
        openCertificateModal(idx);
      }
    });
  });

  if (certModalCloseBtn && certModal) {
    certModalCloseBtn.addEventListener('click', closeModal);
    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) closeModal();
    });
  }



  /* --------------------------------------------------------------------------
     15. Interactive Contact Form Submission & Validation
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('portfolio-contact-form');
  const formSubmitBtn = document.getElementById('form-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('sender-name');
      const emailInput = document.getElementById('sender-email');
      const messageInput = document.getElementById('sender-message');

      if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
        showToast('Please fill out all required fields');
        return;
      }

      // Simulate loading state
      const originalText = formSubmitBtn.innerHTML;
      formSubmitBtn.disabled = true;
      formSubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending message...';

      setTimeout(() => {
        formSubmitBtn.disabled = false;
        formSubmitBtn.innerHTML = originalText;
        contactForm.reset();
        showToast('Thank you! Your message has been sent successfully.');
      }, 1200);
    });
  }

  /* --------------------------------------------------------------------------
     16. Graceful Image Fallback
     -------------------------------------------------------------------------- */
  const profileImgs = document.querySelectorAll('.profile-photo, .hero-avatar-img');
  profileImgs.forEach(img => {
    img.addEventListener('error', () => {
      img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220"><rect width="220" height="220" fill="%23563a2a"/><text x="50%" y="54%" font-family="Montserrat, sans-serif" font-weight="700" font-size="64" fill="%23ffffff" text-anchor="middle" dominant-baseline="middle">FS</text></svg>';
    });
  });
});
