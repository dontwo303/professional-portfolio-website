const featuredServices = [
  {
    slug: 'ai-marketing-strategy', icon: '✳',
    title: 'AI-Powered Digital Marketing Strategy',
    description: 'Stop guessing your next move. Get a clear marketing strategy built around your business, audience, and goals.'
  },
  {
    slug: 'seo', icon: '⌕',
    title: 'Search Engine Optimization (SEO)',
    description: 'Get discovered by people who are already searching for products or services like yours.'
  },
  {
    slug: 'social-media-marketing', icon: '◌',
    title: 'Social Media Marketing',
    description: 'Turn your social media presence into a powerful way to connect with potential customers and build trust.'
  },
  {
    slug: 'paid-advertising', icon: '↗',
    title: 'Google & Meta Ads',
    description: 'Reach the right audience with targeted advertising campaigns designed to generate quality leads and sales.'
  },
  {
    slug: 'marketing-automation', icon: '⟲',
    title: 'AI-Powered Marketing Automation',
    description: 'Save time by automating repetitive marketing tasks, lead follow-ups, and customer communication.'
  },
  {
    slug: 'website-optimization', icon: '◇',
    title: 'Website & Conversion Optimization',
    description: 'Turn more website visitors into inquiries, bookings, and paying customers.'
  }
];

export function renderConsultationForm(contactEmail) {
  return `<form data-inquiry-form id="consultation-form" action="https://formsubmit.co/${contactEmail}" method="POST" novalidate>
    <input type="hidden" name="kind" value="consultation">
    <input type="hidden" name="_subject" value="New DIGITAL ARUN consultation request">
    <input type="hidden" name="_template" value="table">
    <label class="honeypot" aria-hidden="true">Leave this blank<input name="_honey" tabindex="-1" autocomplete="off"></label>
    <div class="form-row">
      <label>Your Name *<input name="name" autocomplete="name" required maxlength="100"><small class="field-error"></small></label>
      <label>Business Name *<input name="businessName" autocomplete="organization" required maxlength="150"><small class="field-error"></small></label>
    </div>
    <div class="form-row">
      <label>Email Address *<input name="email" type="email" autocomplete="email" required maxlength="254"><small class="field-error"></small></label>
      <label>Phone Number <span>(optional)</span><input name="phone" type="tel" autocomplete="tel" maxlength="40"><small class="field-error"></small></label>
    </div>
    <label>Website or Social Media Link <span>(optional)</span><input name="website" type="text" inputmode="url" maxlength="500" placeholder="https://example.com or https://instagram.com/yourbusiness"><small class="field-error"></small></label>
    <label>What's Your Biggest Marketing Challenge? *<textarea name="message" required minlength="20" maxlength="3000" rows="5" placeholder="Tell us what is holding your business back."></textarea><small class="field-error"></small></label>
    <div class="form-status" role="status" aria-live="polite"></div>
    <button class="btn btn-primary submit-btn" type="submit">Book My Free Consultation →</button>
    <p class="form-privacy">Submitting this form requests a consultation; it does not confirm a time. Your inquiry is delivered through FormSubmit. See the <a href="/privacy-policy/">Privacy Policy</a>.</p>
  </form>`;
}

export function renderHome({contactEmail}) {
  const serviceCards = featuredServices.map(service => `<a class="service-card reveal" href="/services/${service.slug}/">
    <span class="service-icon" aria-hidden="true">${service.icon}</span>
    <h3>${service.title}</h3>
    <p>${service.description}</p>
    <span class="text-link">Learn more</span>
  </a>`).join('');

  const problems = [
    ['Not getting enough leads?', "People aren't finding your business when they need your services."],
    ['Spending money on ads with little return?', 'Your budget is disappearing without bringing enough customers.'],
    ['Posting on social media but seeing no growth?', "You're putting in effort, but it's not turning into sales."],
    ["Don't know what marketing strategy works?", 'Too many options, not enough clarity.']
  ];

  const benefits = [
    'Reach customers who are more likely to buy.',
    'Make better use of your marketing budget.',
    'Save time with smarter automation.',
    "Understand what's working and what needs improvement.",
    'Focus on growing your business while we handle the marketing.'
  ];

  const steps = [
    ['Book Your Free Consultation', "Tell us about your business, your goals, and what's stopping you from growing."],
    ['Get Your Customized Marketing Plan', "We'll identify opportunities and recommend a digital marketing strategy designed specifically for your business."],
    ['Start Growing Smarter', "Choose your next steps with confidence. If we're a good fit, we can help you put your plan into action."]
  ];

  return `<section class="hero">
    <div class="container hero-grid">
      <div class="hero-copy">
        <span class="eyebrow light">DIGITAL ARUN / AI-POWERED MARKETING</span>
        <h1>AI-Powered Digital Marketing That <em>Helps Your Business Grow</em></h1>
        <p class="hero-lead"><strong>Struggling to get customers online? We make digital marketing easier, smarter, and more effective.</strong></p>
        <p>Stop wasting time and money on marketing that doesn't bring results. We combine AI-powered tools with smart marketing strategies to help your business attract the right people, generate quality leads, and turn more visitors into paying customers.</p>
        <div class="hero-actions"><a class="btn btn-primary" href="/book-consultation/">Get My FREE Marketing Plan →</a></div>
        <div class="hero-note">Book a free consultation. No pressure. No obligation.</div>
      </div>
      <div class="hero-visual" role="img" aria-label="Marketing strategy connecting audience research, customer journeys, and continuous improvement">
        <div class="visual-glow"></div><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div>
        <div class="visual-center"><span class="visual-symbol">✳</span><strong>SMARTER<br>GROWTH</strong><small>AI · Strategy · Action</small></div>
        <div class="float-card float-one"><span class="float-icon">⌕</span><div><small>DISCOVER</small><strong>Right audience</strong></div></div>
        <div class="float-card float-two"><span class="float-icon">◇</span><div><small>CONNECT</small><strong>Better journeys</strong></div></div>
        <div class="float-card float-three"><span class="float-icon">⟲</span><div><small>IMPROVE</small><strong>Useful insights</strong></div></div>
      </div>
    </div>
  </section>
  <section class="section home-problem">
    <div class="container home-split">
      <div class="home-sticky-copy"><span class="eyebrow">THE PROBLEM</span><h2>You're Working Hard. But Is Your Marketing Working?</h2><p class="lead">Running a business is already challenging. Getting customers shouldn't make it harder.</p></div>
      <div><div class="problem-list">${problems.map(([title,description]) => `<div class="problem-item"><span aria-hidden="true">◇</span><div><h3>${title}</h3><p>${description}</p></div></div>`).join('')}</div><p class="home-emphasis">You don't need to work harder on marketing. You need a smarter way to grow.</p></div>
    </div>
  </section>
  <section class="section home-solution">
    <div class="container why-grid">
      <div class="why-art"><div class="why-art-grid"></div><span class="why-art-kicker">SMARTER MARKETING</span><div class="why-art-message">Less guesswork.<br>More opportunity<span>.</span></div><div class="why-art-footer"><span>AI</span><span>CREATIVITY</span><span>STRATEGY</span></div></div>
      <div class="why-content"><span class="eyebrow">THE SOLUTION</span><h2>Smarter Marketing. Less Guesswork. Better Growth.</h2><p>We use the power of AI and proven digital marketing strategies to help your business reach the right customers at the right time.</p><p>Instead of guessing what works, we use data, AI-powered insights, and continuous improvements to build marketing strategies around your business goals.</p><p class="lead">More visibility. Better leads. More opportunities to grow.</p><a class="btn btn-primary" href="/book-consultation/">Let's Build Your Growth Plan →</a></div>
    </div>
  </section>
  <section class="section services-section"><div class="container"><span class="eyebrow">OUR SERVICES</span><h2>Everything You Need to Grow Online</h2><div class="service-grid home-service-grid">${serviceCards}</div><div class="center-action"><a class="btn btn-dark" href="/services/">Explore All Services</a></div></div></section>
  <section class="section home-why"><div class="container home-split"><div class="home-sticky-copy"><span class="eyebrow">WHY CHOOSE US</span><h2>Marketing Built Around Your Business, Not a One-Size-Fits-All Formula</h2><p>Every business is different. Your marketing strategy should be too.</p></div><div><p>We combine smart AI technology, creative thinking, and real marketing experience to help you:</p><ul class="benefit-list-home">${benefits.map(benefit => `<li>${benefit}</li>`).join('')}</ul><p class="home-emphasis">No complicated marketing jargon. Just clear strategies, honest communication, and a focus on results.</p></div></div></section>
  <section class="section process-section"><div class="container"><span class="eyebrow">HOW IT WORKS</span><h2>Your Growth Starts With 3 Simple Steps</h2><div class="process-grid home-process-grid">${steps.map(([title,description],index) => `<div><span class="step-num">0${index+1}</span><h3>${title}</h3><p>${description}</p></div>`).join('')}</div></div></section>
  <section class="final-cta"><div class="container final-cta-inner"><div><span class="eyebrow light">YOUR NEXT STEP</span><h2>Your Next Customer Is Out There. Let's Help Them Find You.</h2><p>You have a business to grow. You shouldn't have to figure out digital marketing alone.</p><p>Let's discover what's holding your business back and create a smarter plan to move forward.</p><p><strong>Book your FREE consultation today and get a customized digital marketing plan built around your business goals.</strong></p><small>100% free consultation. No commitment required.</small></div><a class="btn btn-white" href="/book-consultation/">Get My FREE Customized Marketing Plan →</a></div></section>
  <section class="section home-booking" id="consultation-request"><div class="container booking-grid"><div><span class="eyebrow">CONTACT / BOOKING</span><h2>Let's Talk About Growing Your Business</h2><p class="lead">Tell us a little about your business so we can make our conversation more useful.</p><p>Let's find the right marketing strategy for your business.</p></div><div class="form-card">${renderConsultationForm(contactEmail)}</div></div></section>`;
}
