
const html = document.documentElement;
const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

async function loadProjects(){
  const grid = $('#projectsGrid');
  try{
    const res = await fetch('assets/projects.json?v=7');
    const data = await res.json();
    grid.innerHTML = '';
    data.projects.forEach(p => {
      const el = document.createElement('article');
      el.className = 'proj';
      el.dataset.tags = p.tags.join(' ').toLowerCase();
      el.innerHTML = `
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <div class="badges">${p.badges.map(b=>`<span>${b}</span>`).join('')}</div>
        <div class="links">
          ${p.repo ? `<a class="link" href="${p.repo}" target="_blank" rel="noopener">Repo</a>` : ''}
          ${p.demo ? `<a class="link" href="${p.demo}" target="_blank" rel="noopener">Demo</a>` : ''}
        </div>`;
      grid.appendChild(el);
    });
  }catch(e){
    grid.innerHTML = '<p class="muted">خطا در بارگذاری پروژه‌ها.</p>';
  }
}

function setTheme(mode){
  if(mode === 'light'){ html.classList.add('light'); }
  else { html.classList.remove('light'); }
  localStorage.setItem('theme', mode);
}
function toggleTheme(){
  const now = localStorage.getItem('theme') === 'light' ? 'dark' : 'light';
  setTheme(now);
}
function applyFilter(){
  const active = $('.chip.active').dataset.filter;
  const q = $('#searchInput').value.toLowerCase();
  $$('#projectsGrid .proj').forEach(card => {
    const tags = card.dataset.tags;
    const text = card.textContent.toLowerCase();
    const okTag = active === 'all' || tags.includes(active);
    const okSearch = !q || text.includes(q);
    card.style.display = okTag && okSearch ? '' : 'none';
  });
}

function bindUI(){
  $('#themeToggle')?.addEventListener('click', toggleTheme);
  $$('.chip').forEach(ch => ch.addEventListener('click', e => {
    $$('.chip').forEach(c => c.classList.remove('active'));
    e.currentTarget.classList.add('active');
    applyFilter();
  }));
  $('#searchInput').addEventListener('input', applyFilter);
}

(function init(){
  const savedTheme = localStorage.getItem('theme'); setTheme(savedTheme || 'dark');
  loadProjects().then(()=>applyFilter());
  bindUI();
  // Service Worker disabled
})();