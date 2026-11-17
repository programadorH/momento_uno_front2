if (typeof localStorage !== 'undefined' && typeof document !== 'undefined') {
  if (localStorage.getItem('sazon_theme') === 'dark') {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  }
}


function toggleSidebar() {
  
  if (typeof window !== 'undefined' && typeof window.toggleSidebar === 'function' && window.toggleSidebar !== toggleSidebar) {
    window.toggleSidebar();
    return;
  }
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (!sidebar || !overlay) return;
  const isHidden = sidebar.classList.contains('-translate-x-full');
  if (isHidden) {
    sidebar.classList.remove('-translate-x-full');
    overlay.classList.remove('hidden');
    setTimeout(() => overlay.classList.remove('opacity-0'), 10);
    document.body.style.overflow = 'hidden';
  } else {
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('opacity-0');
    setTimeout(() => overlay.classList.add('hidden'), 300);
    document.body.style.overflow = '';
  }
}

function showToast(message) {
  const toast = document.getElementById('custom-toast');
  const toastMsg = document.getElementById('toast-msg');
  if (!toast || !toastMsg) return;
  toastMsg.textContent = message;
  toast.classList.remove('hidden');
  clearTimeout(window._toastTimeout);
  window._toastTimeout = setTimeout(() => toast.classList.add('hidden'), 3500);
}

function switchTheme(theme) {
  const html = document.documentElement;
  const dayBtn = document.getElementById('themeDayBtn');
  const nightBtn = document.getElementById('themeNightBtn');
  
  if (theme === 'dark') {
    html.classList.add('dark');
    html.classList.remove('light');
    try { localStorage.setItem('sazon_theme', 'dark'); } catch { /* almacenamiento no disponible */ }
    if (dayBtn && nightBtn) {
      nightBtn.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#3D8E33] text-white font-bold shadow-sm transition-all duration-200';
      dayBtn.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200';
    }
  } else {
    html.classList.remove('dark');
    html.classList.add('light');
    try { localStorage.setItem('sazon_theme', 'light'); } catch { /* almacenamiento no disponible */ }
    if (dayBtn && nightBtn) {
      dayBtn.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#3D8E33] text-white font-bold shadow-sm transition-all duration-200';
      nightBtn.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200';
    }
  }
}
window.toggleSidebar = toggleSidebar;
window.showToast = showToast;
window.switchTheme = switchTheme;

function handleGlobalSearch(event) {
  const target = event ? event.target : document.getElementById('global-search');
  if (!target) return;
  const query = target.value.toLowerCase().trim();
  const cards = document.querySelectorAll('#modules-container article, [data-searchable]');
  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(query) ? '' : 'none';
  });
}
window.handleGlobalSearch = handleGlobalSearch;

function syncHeaderSession() {
  if (typeof localStorage === 'undefined') return;
  try {
    let sesionStr = localStorage.getItem('sazon_sesion_activa');
    if (!sesionStr) {
      const defaultUser = {
        id: 3,
        nombre: 'Mariana Morales',
        email: 'mariana@nutresa.com',
        rol: 'creador de contenido',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
        biografia: 'Chef entusiasta y creadora de recetas para la comunidad Sa·zón. Comprometida con la nutrición balanceada y la creatividad culinaria con marcas Grupo Nutresa.'
      };
      localStorage.setItem('sazon_sesion_activa', JSON.stringify(defaultUser));
      sesionStr = JSON.stringify(defaultUser);
    }
    const sesion = JSON.parse(sesionStr);
    const nameEl = document.getElementById('header-name');
    const roleEl = document.getElementById('header-role');
    const avatarEl = document.getElementById('header-avatar');
    if (nameEl && sesion.nombre) nameEl.textContent = sesion.nombre;
    if (roleEl && sesion.rol) roleEl.textContent = sesion.rol;
    if (avatarEl && sesion.avatar) avatarEl.src = sesion.avatar;
  } catch { /* almacenamiento no disponible */ }
}
window.syncHeaderSession = syncHeaderSession;

// Registra un listener una sola vez aunque initGlobals() se llame varias veces
// (DOMContentLoaded + useEffect de Header, que StrictMode ejecuta dos veces).
function escucharUnaVez(el, evento, manejador) {
  if (!el || el.dataset.listenerAttached) return;
  el.dataset.listenerAttached = 'true';
  el.addEventListener(evento, manejador);
}

function initGlobals() {
  syncHeaderSession();

  // Los clicks de Día/Noche, notificaciones, perfil y el submit del buscador
  // ya los manejan los componentes React (onClick/onSubmit): aquí solo se
  // aplica el tema guardado para no duplicar listeners.
  if (document.getElementById('themeDayBtn')) {
    try {
      switchTheme(localStorage.getItem('sazon_theme') === 'dark' ? 'dark' : 'light');
    } catch {
      switchTheme('light');
    }
  }

  document.querySelectorAll('button[id*="toggle-pass"], button[id*="toggle-password"], [data-action="toggle-password"]').forEach(btn => {
    escucharUnaVez(btn, 'click', () => {
      const container = btn.closest('section') || btn.parentElement;
      const input = container ? container.querySelector('input') : null;
      const icon = btn.querySelector('i');
      if (input) {
        const isPass = input.type === 'password';
        input.type = isPass ? 'text' : 'password';
        if (icon) {
          icon.className = isPass ? 'bi bi-eye-slash text-sm' : 'bi bi-eye text-sm';
        }
      }
    });
  });

  document.querySelectorAll('[data-action="toggle-sidebar"]').forEach(el => {
    escucharUnaVez(el, 'click', (e) => {
      // Evitar doble toggle si React ya lo manejó
      if (e.defaultPrevented) return;
      toggleSidebar();
    });
  });

  const searchInput = document.getElementById('global-search');
  escucharUnaVez(searchInput, 'keydown', (e) => {
    if (e.key === 'Enter') {
      showToast('Buscando: ' + searchInput.value);
    }
  });
}
window.initGlobals = initGlobals;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGlobals);
} else {
  initGlobals();
}
