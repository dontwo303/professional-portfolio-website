(() => {
  const config = window.SITE_CONFIG || {};
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.primary-nav');
  menuButton?.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menu.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }));

  if (config.bookingUrl && /^https:\/\//i.test(config.bookingUrl)) {
    document.querySelectorAll('.booking-link').forEach(link => {
      link.href = config.bookingUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    });
    const status = document.querySelector('#booking-status');
    if (status) status.textContent = "Choose a time for your free consultation. We'll review your business and create a customized digital marketing plan with no obligation.";
  }
  if (config.contactEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.contactEmail)) {
    const email = document.querySelector('#contact-email');
    if (email) { email.textContent = config.contactEmail; email.href = `mailto:${config.contactEmail}`; }
  }
  if (config.location) {
    const location = document.querySelector('#contact-location');
    if (location) location.textContent = config.location;
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: .08 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } else document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));

  const categoryButtons = [...document.querySelectorAll('[data-filter]')];
  const searchInput = document.querySelector('#blog-search');
  const articleCards = [...document.querySelectorAll('#article-grid .article-card')];
  const loadMore = document.querySelector('#load-more');
  let selectedCategory = 'all';
  let visibleLimit = 3;
  function filterArticles() {
    if (!articleCards.length) return;
    const query = (searchInput?.value || '').trim().toLowerCase();
    let matches = 0;
    articleCards.forEach(card => {
      const match = (selectedCategory === 'all' || card.dataset.category === selectedCategory) && (!query || card.dataset.title.includes(query));
      if (match) matches++;
      card.hidden = !match || matches > visibleLimit;
    });
    const empty = document.querySelector('#empty-results');
    if (empty) empty.hidden = matches !== 0;
    const count = document.querySelector('#result-count');
    if (count) count.textContent = `${matches} article${matches === 1 ? '' : 's'}`;
    if (loadMore) loadMore.hidden = matches <= visibleLimit;
  }
  categoryButtons.forEach(button => button.addEventListener('click', () => {
    selectedCategory = button.dataset.filter;
    visibleLimit = 3;
    categoryButtons.forEach(item => item.classList.toggle('active', item === button));
    filterArticles();
  }));
  searchInput?.addEventListener('input', () => { visibleLimit = 3; filterArticles(); });
  loadMore?.addEventListener('click', () => { visibleLimit += 3; filterArticles(); });
  filterArticles();

  document.querySelectorAll('.copy-link').forEach(button => button.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(location.href); button.textContent = 'Link copied'; }
    catch { button.textContent = 'Unable to copy link'; }
  }));

  const form = document.querySelector('#contact-form');
  if (!form) return;
  const status = document.querySelector('#form-status');
  const submit = form.querySelector('button[type=submit]');
  const fields = [...form.querySelectorAll('input:not([type="hidden"]), select, textarea')];
  function errorFor(field) {
    const value = field.value.trim();
    if (field.required && !value) return 'This field is required.';
    if (field.name === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address.';
    if (field.name === 'website' && value) {
      try { const parsed = new URL(value); if (!['http:', 'https:'].includes(parsed.protocol)) throw Error(); }
      catch { return 'Enter a full URL starting with https://'; }
    }
    if (field.name === 'message' && value.length < 20) return 'Please add at least 20 characters.';
    return '';
  }
  function showFieldError(field, message) {
    field.classList.toggle('invalid', Boolean(message));
    field.setAttribute('aria-invalid', String(Boolean(message)));
    const error = field.parentElement.querySelector('.field-error');
    if (error) error.textContent = message;
  }
  fields.forEach(field => field.addEventListener('input', () => {
    if (field.classList.contains('invalid')) showFieldError(field, errorFor(field));
  }));
  form.addEventListener('submit', async event => {
    event.preventDefault();
    status.textContent = '';
    status.className = 'form-status';
    const invalid = fields.filter(field => {
      const error = errorFor(field);
      showFieldError(field, error);
      return Boolean(error);
    });
    if (invalid.length) {
      status.textContent = 'Please correct the highlighted fields.';
      status.classList.add('error');
      invalid[0].focus();
      return;
    }
    const endpoint = /^https:\/\//i.test(config.contactEndpoint || '')
      ? config.contactEndpoint
      : form.action.replace('https://formsubmit.co/', 'https://formsubmit.co/ajax/');
    if (!/^https:\/\//i.test(endpoint)) {
      status.textContent = 'The form is temporarily unavailable. Please email us directly using the address on this page.';
      status.classList.add('error');
      return;
    }
    submit.disabled = true;
    submit.textContent = 'Sending…';
    const payload = Object.fromEntries(new FormData(form).entries());
    payload._url = location.href;
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`The form service returned ${response.status}.`);
      const result = await response.json();
      if (result.success === false || result.success === 'false') throw new Error(result.message || 'The form service declined the message.');
      status.textContent = 'Thanks for reaching out. Your message was submitted. We’ll get back to you by email.';
      status.classList.add('success');
      form.reset();
    } catch (error) {
      status.textContent = `Your message could not be sent. ${error.message} Please try again later.`;
      status.classList.add('error');
    } finally {
      submit.disabled = false;
      submit.textContent = 'Send message ↗';
    }
  });
})();
