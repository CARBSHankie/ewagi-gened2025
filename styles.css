let currentSlide = 0;
let isFullscreen = false;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

document.getElementById('totalSlides').textContent = totalSlides;

// Minimal helpers
const isFS = () => isFullscreen || document.fullscreenElement;
const updateCounters = () => {
    document.getElementById('currentSlide').textContent = currentSlide + 1;
    document.getElementById('prevBtn').disabled = currentSlide === 0;
    document.getElementById('nextBtn').disabled = currentSlide === totalSlides - 1;
    const info = document.getElementById('fullscreen-slide-info');
    if (info) info.textContent = `${currentSlide + 1}/${totalSlides}`;
};

function showSlide(n) {
    slides[currentSlide].classList.remove('active');
    currentSlide = (n + totalSlides) % totalSlides;
    slides[currentSlide].classList.add('active');
    updateCounters();
    window.location.hash = `slide-${currentSlide + 1}`;
}

function changeSlide(direction) {
    showSlide(currentSlide + direction);
}

function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const idx = [...slides].findIndex(s => s.id === id);
    if (idx >= 0) showSlide(idx);
    window.scrollTo({
        top: document.querySelector('.presentation-container').offsetTop,
        behavior: 'smooth'
    });
}

function toggleFullscreen() {
    const container = document.querySelector('.presentation-container');
    const btn = document.getElementById('fullscreenBtn');
    if (!container || !btn) return;

    if (!isFullscreen) {
        try {
            document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
        } catch (_) {
            console.log('Native fullscreen failed, using fallback');
        }
        document.body.classList.add('fullscreen-active');
        container.classList.add('fullscreen-mode');
        isFullscreen = true;
        showSlide(currentSlide);
        setTimeout(() => {
            btn.textContent = 'Exit Fullscreen';
            console.log('Fullscreen slide displayed:', currentSlide + 1, '/', totalSlides);
        }, 50);
        setTimeout(createFloatingExitButton, 100);
    } else {
        try {
            document.exitFullscreen && document.exitFullscreen();
        } catch (_) {}
        document.body.classList.remove('fullscreen-active');
        container.classList.remove('fullscreen-mode');
        isFullscreen = false;
        btn.textContent = 'Fullscreen';
        showSlide(currentSlide);
        setTimeout(removeFloatingExitButton, 100);
    }
}

function createFloatingExitButton() {
    removeFloatingExitButton();
    const exitBtn = document.createElement('button');
    exitBtn.className = 'fullscreen-exit-btn';
    exitBtn.textContent = 'Exit (ESC)';
    exitBtn.onclick = toggleFullscreen;
    document.body.appendChild(exitBtn);

    const navDiv = document.createElement('div');
    navDiv.style.cssText = 'position:fixed!important;bottom:20px!important;left:50%!important;transform:translateX(-50%)!important;z-index:1000002!important;opacity:0!important;transition:opacity 0.3s ease!important;display:flex!important;gap:10px!important;';
    navDiv.className = 'fullscreen-nav-controls';

    const prevBtn = document.createElement('button');
    prevBtn.textContent = '← Prev';
    prevBtn.style.cssText = 'background:rgba(0,0,0,0.7)!important;color:white!important;border:none!important;padding:10px 15px!important;border-radius:5px!important;cursor:pointer!important;font-size:14px!important;';
    prevBtn.onclick = () => changeSlide(-1);

    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next →';
    nextBtn.style.cssText = 'background:rgba(0,0,0,0.7)!important;color:white!important;border:none!important;padding:10px 15px!important;border-radius:5px!important;cursor:pointer!important;font-size:14px!important;';
    nextBtn.onclick = () => changeSlide(1);

    const slideInfo = document.createElement('span');
    slideInfo.textContent = `${currentSlide + 1}/${totalSlides}`;
    slideInfo.style.cssText = 'background:rgba(0,0,0,0.7)!important;color:white!important;padding:10px 15px!important;border-radius:5px!important;font-size:14px!important;';
    slideInfo.id = 'fullscreen-slide-info';

    navDiv.appendChild(prevBtn);
    navDiv.appendChild(slideInfo);
    navDiv.appendChild(nextBtn);
    document.body.appendChild(navDiv);

    let showTimer;
    function showControls() {
        exitBtn.classList.add('show');
        navDiv.style.opacity = '1';
        clearTimeout(showTimer);
        showTimer = setTimeout(() => {
            exitBtn.classList.remove('show');
            navDiv.style.opacity = '0';
        }, 3000);
    }
    document.addEventListener('mousemove', showControls);
    document.addEventListener('keydown', showControls);
    setTimeout(showControls, 500);
}

function removeFloatingExitButton() {
    const existingBtn = document.querySelector('.fullscreen-exit-btn');
    const existingNav = document.querySelector('.fullscreen-nav-controls');
    if (existingBtn) existingBtn.remove();
    if (existingNav) existingNav.remove();
}

function initializeButtons() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (fullscreenBtn) fullscreenBtn.onclick = e => {
        e.preventDefault();
        toggleFullscreen();
    };
    if (prevBtn) prevBtn.onclick = e => {
        e.preventDefault();
        changeSlide(-1);
    };
    if (nextBtn) nextBtn.onclick = e => {
        e.preventDefault();
        changeSlide(1);
    };
}

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'Left') {
        e.preventDefault();
        changeSlide(-1);
    }
    if (e.key === 'ArrowRight' || e.key === 'Right') {
        e.preventDefault();
        changeSlide(1);
    }
    if (e.key === 'Home') {
        e.preventDefault();
        showSlide(0);
    }
    if (e.key === 'End') {
        e.preventDefault();
        showSlide(totalSlides - 1);
    }
    if (e.key === 'Escape' && isFullscreen) {
        e.preventDefault();
        toggleFullscreen();
    }
    if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
    }
    if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
    }
});

document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && isFullscreen) {
        isFullscreen = false;
        document.getElementById('fullscreenBtn').textContent = 'Fullscreen';
        removeFloatingExitButton();
    }
});

window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    if (hash.startsWith('#slide-')) {
        const slideNum = parseInt(hash.replace('#slide-', '')) - 1;
        if (slideNum >= 0 && slideNum < totalSlides) showSlide(slideNum);
    }
});

if (window.location.hash.startsWith('#slide-')) {
    const slideNum = parseInt(window.location.hash.replace('#slide-', '')) - 1;
    if (slideNum >= 0 && slideNum < totalSlides) showSlide(slideNum);
} else {
    showSlide(0);
}

document.addEventListener('DOMContentLoaded', () => {
    initializeButtons();
    if (slides.length > 0) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[0].classList.add('active');
        currentSlide = 0;
    }
});

document.addEventListener('click', function(e) {
    const target = e.target.closest && e.target.closest('.module-box.clickable');
    if (target) {
        const detailId = target.getAttribute('data-detail');
        if (detailId) {
            e.preventDefault();
            e.stopPropagation();
            try {
                showDetail(detailId);
            } catch (err) {
                console.log('showDetail error', err);
            }
        }
    }
}, true);

const DETAIL_MAP = {
    'agents-firms': { t: '🏭 Firms', b: '<h3>Scale</h3>20k+ firms, 72 divisions<h3>Production</h3>Capital+labor model' },
    'agents-households': { t: '👥 Households', b: '<h3>Scale</h3>41k households<h3>Behavior</h3>Income, consumption, energy choices' },
    'agents-banks': { t: '🏦 Banks', b: 'Credit & risk assessment, dynamic rates' },
    'markets-goods': { t: '🛒 Goods Markets', b: 'Inventory, exports, price discovery' },
    'markets-labor': { t: '👷 Labor Market', b: 'Wages, hiring, matching' },
    'markets-financial': { t: '💹 Financial Market', b: 'Credit allocation, liquidity' },
    'markets-energy': { t: '⚡ Energy Market', b: 'Policy, pricing, technology' },
    'institutions-government': { t: '🏛️ Government', b: 'Fiscal & energy policy' },
    'institutions-clearing': { t: '⚖️ Clearing House', b: 'Trade execution & settlement' },
    'institutions-trade': { t: '🌍 Trade System', b: 'Export/import, exchange rates' },
    'simulation-engine': { t: '🏛️ Enterprise Simulation', b: '20k+ agents, multi-market system' },
    'decision-system': { t: '🧠 Decision System', b: 'Policy-driven framework, capacity & efficiency decisions' },
    'banking-system': { t: '💰 Banking System', b: 'Risk assessment, loans, dynamic rates' },
    'market-clearing': { t: '⚖️ Market Clearing', b: 'Supply-demand matching, settlement' },
    'energy-policy': { t: '⚡ Energy Policy', b: 'Carbon pricing, renewables, efficiency' },
    'hpc-implementation': { t: '🖥️ HPC Implementation', b: '15m-2h runtime, G1 GC, 30GB heap' },
    'macroeconomic-indicators': { t: '📊 Macro Indicators', b: 'GDP €4.2T, Pop 83.2M, Unemployment 5.7%' },
    'sector-analysis': { t: '🏭 Sector Performance', b: '20 sectors: manufacturing, services, energy-intensive' },
    'household-behavior': { t: '👥 Household Behavior', b: 'Income, consumption, energy choices' },
    'firm-dynamics': { t: '🏢 Firm Dynamics', b: 'Capacity, efficiency, technology' },
    'simulation-performance': { t: '⚡ Performance', b: '15m-2h runtime, G1 GC, parallel processing' },
    'validation-results': { t: '✅ Validation', b: 'Stats verified, consistency checks, robustness tests' },
    'data-economic-structure': { t: '📊 Economic Structure', b: '20 sectors, 72 divisions, German WZ 2008 classification' },
    'data-regional-sectoral': { t: '🗺️ Regional Data', b: 'State indicators, NUTS2 employment, sector distribution' },
    'data-firm-employment': { t: '🏢 Firm Data', b: 'Harmonized employment stats, firm counts, size distribution' },
    'data-input-output': { t: '⚙️ Input-Output', b: '72x72 coefficients matrix, inter-industry relationships' },
    'data-gdp-indicators': { t: '💰 GDP Data', b: 'Final GDP, value added by sector/state, growth rates' },
    'data-processing': { t: '🛠️ Processing', b: 'Python tools, aggregation, 3 processing modes' },
    'data-hierarchy': { t: '🏗️ Database Structure', b: 'Country→Region→Sector→Division→Agent hierarchy, SQLite' },
    'data-validation': { t: '✅ Data Validation', b: 'Relationship validation, consistency checks, completeness' },
    'data-calibration': { t: '🎯 Calibration', b: 'GDP 1.5%, Unemployment 5.5%, Inflation 2.0%, firm metrics' }
};

function ensureDetailModal() {
    let modal = document.getElementById('detail-modal');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.id = 'detail-modal';
    modal.className = 'detail-page';
    modal.innerHTML = `<div class="detail-content"><div class="detail-header"><h2 class="detail-title" id="detail-title"></h2><button class="detail-close" onclick="hideDetail()">Close</button></div><div id="detail-body"></div></div>`;
    document.body.appendChild(modal);
    return modal;
}

function showDetail(detailId) {
    let detailPage = document.getElementById('detail-' + detailId);
    if (!detailPage) {
        detailPage = document.getElementById(detailId);
    }
    if (detailPage) {
        if (isFS()) {
            detailPage.style.display = 'block';
            detailPage.style.visibility = 'visible';
            detailPage.style.opacity = '1';
            detailPage.style.zIndex = '2147483649';
            detailPage.style.position = 'fixed';
            detailPage.style.top = '0';
            detailPage.style.left = '0';
            detailPage.style.width = '100vw';
            detailPage.style.height = '100vh';
            detailPage.style.overflow = 'visible';
        } else {
            detailPage.style.display = 'block';
            detailPage.style.zIndex = '2147483647';
            detailPage.style.position = 'fixed';
            detailPage.style.top = '0';
            detailPage.style.left = '0';
            detailPage.style.width = '100vw';
            detailPage.style.height = '100vh';
        }
        document.body.style.overflow = 'hidden';
    } else {
        const entry = DETAIL_MAP[detailId];
        if (entry) {
            const modal = ensureDetailModal();
            const titleEl = modal.querySelector('#detail-title');
            const bodyEl = modal.querySelector('#detail-body');
            if (titleEl) titleEl.textContent = entry.t || '';
            if (bodyEl) bodyEl.innerHTML = entry.b || '';
            const fs = isFS();
            modal.style.display = 'block';
            modal.style.visibility = 'visible';
            modal.style.opacity = '1';
            modal.style.zIndex = '2147483647';
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100vw';
            modal.style.height = '100vh';
            document.body.style.overflow = 'hidden';
        }
    }
}

function hideDetail() {
    const detailPages = document.querySelectorAll('.detail-page');
    detailPages.forEach(page => {
        page.style.display = 'none';
        page.style.zIndex = '1000';
        page.style.position = 'fixed';
        page.style.top = '0';
        page.style.left = '0';
        page.style.width = '100%';
        page.style.height = '100%';
    });
    document.body.style.overflow = 'auto';
}
