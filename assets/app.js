(() => {
  const config = window.SITE_CONFIG || {};
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  }));

  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: .05 });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  } else {
    document.querySelectorAll('.reveal').forEach(element => element.classList.add('visible'));
  }

  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const search = document.querySelector('#blog-search');
  const cards = [...document.querySelectorAll('#article-grid .article-card')];
  const loadMore = document.querySelector('#load-more');
  let category = 'all';
  let limit = 3;
  function filterArticles() {
    if (!cards.length) return;
    const query = (search?.value || '').trim().toLowerCase();
    let count = 0;
    cards.forEach(card => {
      const matches = (category === 'all' || card.dataset.category === category) &&
        (!query || card.dataset.title.includes(query));
      if (matches) count++;
      card.hidden = !matches || count > limit;
    });
    const empty = document.querySelector('#empty-results');
    const resultCount = document.querySelector('#result-count');
    if (empty) empty.hidden = count !== 0;
    if (resultCount) resultCount.textContent = `${count} article${count === 1 ? '' : 's'}`;
    if (loadMore) loadMore.hidden = count <= limit;
  }
  filterButtons.forEach(button => button.addEventListener('click', () => {
    category = button.dataset.filter;
    limit = 3;
    filterButtons.forEach(item => item.classList.toggle('active', item === button));
    filterArticles();
  }));
  search?.addEventListener('input', () => { limit = 3; filterArticles(); });
  loadMore?.addEventListener('click', () => { limit += 3; filterArticles(); });
  filterArticles();

  document.querySelectorAll('.copy-link').forEach(button => button.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(location.href); button.textContent = 'Link copied'; }
    catch { button.textContent = 'Unable to copy link'; }
  }));
  document.querySelectorAll('.share-linkedin').forEach(button => button.addEventListener('click', () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(location.href)}`, '_blank', 'noopener,noreferrer');
  }));

  document.querySelectorAll('form[data-inquiry-form]').forEach(form => {
    const status = form.querySelector('.form-status');
    const submit = form.querySelector('button[type="submit"]');
    const initialLabel = submit.textContent;
    const consultation = form.querySelector('[name="kind"]')?.value === 'consultation';
    const fields = [...form.querySelectorAll('input:not([type="hidden"]):not([name="_honey"]),select,textarea')];

    function errorFor(field) {
      const value = field.value.trim();
      if (field.required && !value) return 'This field is required.';
      if (field.name === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address.';
      if (field.name === 'website' && value) {
        try { if (!['http:', 'https:'].includes(new URL(value).protocol)) throw Error(); }
        catch { return 'Enter a full link starting with https://'; }
      }
      if (field.name === 'message' && value.length < 20) return 'Please add at least 20 characters.';
      if (field.name === 'goal' && value.length < 10) return 'Please add at least 10 characters.';
      return '';
    }
    function showError(field, message) {
      field.classList.toggle('invalid', Boolean(message));
      field.setAttribute('aria-invalid', String(Boolean(message)));
      const error = field.parentElement.querySelector('.field-error');
      if (error) error.textContent = message;
    }
    fields.forEach(field => field.addEventListener('input', () => {
      if (field.classList.contains('invalid')) showError(field, errorFor(field));
    }));

    form.addEventListener('submit', async event => {
      event.preventDefault();
      status.textContent = '';
      status.className = 'form-status';
      const invalid = fields.filter(field => {
        const error = errorFor(field);
        showError(field, error);
        return Boolean(error);
      });
      if (invalid.length) {
        status.textContent = 'Please correct the highlighted fields.';
        status.classList.add('error');
        invalid[0].focus();
        return;
      }
      if (form.querySelector('[name="_honey"]').value) return;
      const endpoint = config.contactEndpoint;
      const formSubmitEndpoint = `https://formsubmit.co/ajax/${config.contactEmail}`;
      if (endpoint !== '/api/contact' && endpoint !== formSubmitEndpoint) {
        status.textContent = 'The form is unavailable. Please email the address on this page.';
        status.classList.add('error');
        return;
      }
      submit.disabled = true;
      submit.textContent = 'Sending…';
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            ...Object.fromEntries(new FormData(form).entries()),
            _replyto: form.querySelector('[name="email"]').value.trim(),
            _url: location.href
          })
        });
        if (!response.ok) throw Error(`Submission failed (${response.status}).`);
        const result = await response.json();
        if (result.success === false || result.success === 'false') throw Error(result.message || 'The form service declined the inquiry.');
        status.textContent = consultation
          ? 'Your consultation request was sent. I’ll reply by email to arrange a time.'
          : 'Your message was submitted. I’ll reply by email.';
        status.classList.add('success');
        form.reset();
      } catch (error) {
        status.textContent = `Your request could not be sent. ${error.message} Please try again or email me directly.`;
        status.classList.add('error');
      } finally {
        submit.disabled = false;
        submit.textContent = initialLabel;
      }
    });
  });
})();
