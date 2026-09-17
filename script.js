const page = window.location.pathname.split('/').pop() || 'index.html';

document.querySelectorAll('.site-nav .nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === page) link.classList.add('active');
});

const progress = document.createElement('div');
progress.className = 'reading-progress';
document.body.appendChild(progress);

window.addEventListener('scroll', () => {
  const doc = document.documentElement;
  const max = doc.scrollHeight - doc.clientHeight;
  const pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
  progress.style.width = `${pct}%`;
});

const button = document.createElement('button');
button.id = 'btnTopo';
button.setAttribute('aria-label', 'Voltar ao topo');
button.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
document.body.appendChild(button);

window.addEventListener('scroll', () => {
  button.style.display = window.scrollY > 450 ? 'block' : 'none';
});

button.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const id = link.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(el => {
    el.classList.add('reveal-ready');
    observer.observe(el);
  });
} else {
  // Fallback: em navegadores sem IntersectionObserver, o conteúdo permanece visível.
  revealElements.forEach(el => el.classList.add('visible'));
}

const year = document.getElementById('ano');
if (year) year.textContent = new Date().getFullYear();
