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

        // Force restore control panel visibility
        restoreControlsPanel();

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
    handleFullscreenChange();
});

// Cross-browser fullscreen change listeners
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);

function handleFullscreenChange() {
    // If we've exited native fullscreen (via ESC or browser UI), ensure UI/state are restored
    if (!document.fullscreenElement) {
        const container = document.querySelector('.presentation-container');
        const btn = document.getElementById('fullscreenBtn');

        isFullscreen = false;
        document.body.classList.remove('fullscreen-active');
        if (container) container.classList.remove('fullscreen-mode');
        if (btn) btn.textContent = 'Fullscreen';

        // Restore control panel visibility explicitly
        // Use a tiny delay to ensure style recalculation after exiting fullscreen
        setTimeout(() => {
            restoreControlsPanel();
            showSlide(currentSlide);
        }, 0);

        removeFloatingExitButton();
    }
}

function restoreControlsPanel() {
    const controls = document.querySelector('.presentation-controls');
    if (controls) {
        controls.style.display = 'flex';
        controls.style.visibility = 'visible';
        controls.style.opacity = '1';
    }
}

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
        // Initialize dynamic content for specific details
        if (detailId === 'macroeconomic-indicators') {
            setTimeout(initMacroChart, 50);
        }
        if (detailId === 'markets-energy') {
            setTimeout(() => initEnergyPricingWidget(detailPage), 30);
        }
        if (detailId === 'core-decision-system') {
            setTimeout(() => {
                if (window.initDecisionProcessWidget) {
                    window.initDecisionProcessWidget();
                }
            }, 30);
        }
    } else {
        // Try to lazy-load external detail file
        const modal = ensureDetailModal();
        const titleEl = modal.querySelector('#detail-title');
        const bodyEl = modal.querySelector('#detail-body');
        // optimistic default title
        if (titleEl) titleEl.textContent = '';
        if (bodyEl) bodyEl.innerHTML = '<div style="padding:16px;color:#94a3b8">Loading…</div>';

        const url = `details/detail-${detailId}.html`;
        fetch(url, { cache: 'no-store' })
            .then(r => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.text();
            })
            .then(html => {
                // Parse fetched HTML in a detached container to avoid duplicating IDs
                const temp = document.createElement('div');
                temp.innerHTML = html;

                // Prefer inner .detail-content; ignore outer wrappers with IDs
                const fetchedRoot = temp.querySelector(`#detail-${detailId} .detail-content`) || temp.querySelector('.detail-content') || temp;

                // Extract title from fetched content, if present, and use the modal's single header
                const fetchedTitle = fetchedRoot.querySelector('.detail-title');
                if (titleEl && fetchedTitle && fetchedTitle.textContent) {
                    titleEl.textContent = fetchedTitle.textContent.trim();
                }

                // Remove any header/close inside fetched content to prevent duplicate controls
                const fetchedHeader = fetchedRoot.querySelector('.detail-header');
                if (fetchedHeader) fetchedHeader.remove();

                // Per project rule: avoid injecting elements with IDs into modals to prevent conflicts
                fetchedRoot.querySelectorAll('[id]')
                    .forEach(el => el.removeAttribute('id'));

                // Inject only the inner HTML of fetched content under the modal body
                if (bodyEl) bodyEl.innerHTML = fetchedRoot.innerHTML;

                // Initialize dynamic content as needed
                if (detailId === 'macroeconomic-indicators') setTimeout(initMacroChart, 50);
                if (detailId === 'markets-energy') setTimeout(() => initEnergyPricingWidget(bodyEl || document), 30);
                if (detailId === 'core-decision-system') setTimeout(() => {
                    if (window.initDecisionProcessWidget) {
                        window.initDecisionProcessWidget();
                    }
                }, 30);
                
            })
            .catch(() => {
                // Fallback for missing detail files
                    if (titleEl) titleEl.textContent = 'Details';
                    if (bodyEl) bodyEl.innerHTML = '<div style="padding:16px">Details not available.</div>';
            })
            .finally(() => {
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
            });
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

// ===== Macroeconomic Indicators chart utilities =====
function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/);
    const header = lines.shift().split(',');
    return lines.filter(Boolean).map(line => {
        const cols = line.split(',');
        const row = {};
        header.forEach((h, i) => { row[h] = cols[i]; });
        return row;
    });
}

let macroChartInstance = null;
function initMacroChart() {
    // Wait for Chart.js to be fully loaded
    if (!window.Chart) {
        setTimeout(initMacroChart, 100);
        return;
    }
    
    // Find the visible canvas in any modal
    let canvas = null;
    
    // First try the dynamic modal
    const modal = document.getElementById('detail-modal');
    if (modal && modal.style.display !== 'none') {
        canvas = modal.querySelector('.macro-chart, #macroChart');
    }
    
    // Then try any detail page that might be visible
    if (!canvas) {
        const detailPages = document.querySelectorAll('.detail-page');
        for (const page of detailPages) {
            if (page.style.display !== 'none' && page.style.visibility !== 'hidden') {
                canvas = page.querySelector('.macro-chart, #macroChart');
                if (canvas) break;
            }
        }
    }
    
    // Fallback: find any visible canvas with the macroChart id
    if (!canvas) {
        const canvases = document.querySelectorAll('.macro-chart, #macroChart');
        for (const c of canvases) {
            if (c.offsetParent !== null && c.clientWidth > 0) {
                canvas = c;
                break;
            }
        }
    }
    
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function render(data) {
        if (macroChartInstance) macroChartInstance.destroy();
        macroChartInstance = new Chart(ctx, {
            type: 'line',
            data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                scales: {
                    x: { grid: { display: false } },
                    y: { type: 'linear', position: 'left', grid: { color: 'rgba(229,238,246,.7)' }, title: { display: true, text: 'Output / Price Index' } },
                    y1: { type: 'linear', position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: 'Unemployment (%)' } }
                },
                plugins: { legend: { display: true, position: 'bottom' } }
            }
        });
    }

    function datasetFromCSV(rows) {
        const labels = rows.map(r => r.Tick);
        const toNum = v => (v == null || v === '' ? null : Number(v));
        const output = rows.map(r => toNum(r.TotalOutput));
        const price = rows.map(r => toNum(r.PriceIndex));
        const unemp = rows.map(r => toNum(r.UnemploymentRate));
        return {
            labels,
            datasets: [
                { label: 'Total Output', data: output, borderColor: '#2ecc71', backgroundColor: 'transparent', tension: .2, yAxisID: 'y' },
                { label: 'Price Index', data: price, borderColor: '#e67e22', backgroundColor: 'transparent', tension: .2, yAxisID: 'y' },
                { label: 'Unemployment (%)', data: unemp, borderColor: '#3498db', backgroundColor: 'transparent', tension: .2, yAxisID: 'y1' }
            ]
        };
    }

    // Try CSV; fallback to embedded JSON payload
    fetch('./assets/simulations/macro_indicators.csv', { 
        cache: 'no-store',
        mode: 'cors',
        credentials: 'same-origin'
    })
        .then(r => { 
            if (!r.ok) throw new Error(`HTTP ${r.status}: ${r.statusText}`); 
            return r.text(); 
        })
        .then(text => parseCSV(text))
        .then(rows => render(datasetFromCSV(rows)))
        .catch((err) => {
            console.warn('CSV fetch failed:', err.message);
            // Look for data script in any modal or detail page
            let dataEl = document.querySelector('.macro-data, #macro-data');
            if (!dataEl) {
                // Try to find it in any detail page
                const detailPages = document.querySelectorAll('.detail-page');
                for (const page of detailPages) {
                    dataEl = page.querySelector('.macro-data, #macro-data');
                    if (dataEl) break;
                }
            }
            if (!dataEl) return;
            try {
                const payload = JSON.parse(dataEl.textContent);
                render({
                    labels: payload.labels,
                    datasets: [
                        { label: 'GDP (index)', data: payload.series.GDP, borderColor: '#2ecc71', backgroundColor: 'transparent', tension: .2, yAxisID: 'y' },
                        { label: 'Inflation (%)', data: payload.series.Inflation, borderColor: '#e67e22', backgroundColor: 'transparent', tension: .2, yAxisID: 'y' },
                        { label: 'Unemployment (%)', data: payload.series.Unemployment, borderColor: '#3498db', backgroundColor: 'transparent', tension: .2, yAxisID: 'y1' }
                    ]
                });
            } catch(_) { 
                console.warn('Fallback JSON also failed');
            }
        });
}

// ===== Energy Pricing Widget (detail-markets-energy) =====
function initEnergyPricingWidget(root) {
    try {
        const container = root || document;
        const s1 = container.querySelector('.ep-s1');
        const s2 = container.querySelector('.ep-s2');
        const p1 = container.querySelector('.ep-p1');
        const p2 = container.querySelector('.ep-p2');
        const qt = container.querySelector('.ep-qt');
        const v1El = container.querySelector('.ep-v1');
        const v2El = container.querySelector('.ep-v2');
        const bar1 = container.querySelector('.ep-bar1');
        const bar2 = container.querySelector('.ep-bar2');
        const weightedEl = container.querySelector('.ep-weighted');
        const qtyEl = container.querySelector('.ep-qty');
        if (!s1 || !s2 || !p1 || !p2 || !qt || !v1El || !v2El || !bar1 || !bar2 || !weightedEl || !qtyEl) return;

        function clamp(n) { return isFinite(n) ? n : 0; }

        function syncShares(source) {
            const a = clamp(Number(s1.value));
            const b = clamp(Number(s2.value));
            if (source === 's1') {
                s2.value = String(Math.max(0, Math.min(100, 100 - a)));
            } else if (source === 's2') {
                s1.value = String(Math.max(0, Math.min(100, 100 - b)));
            } else {
                s2.value = String(Math.max(0, Math.min(100, 100 - a)));
            }
        }

        function update() {
            const share1 = clamp(Number(s1.value));        // 0..100
            const share2 = 100 - share1;
            const totalQ = clamp(Number(qt.value));        // total quantity
            const Q1 = Math.max(0, Math.round((share1 / 100) * totalQ));
            const Q2 = Math.max(0, totalQ - Q1);
            const P1 = clamp(Number(p1.value));
            const P2 = clamp(Number(p2.value));
            const V1 = Q1 * P1;
            const V2 = Q2 * P2;
            const QT = Q1 + Q2; // equals totalQ
            const WT = QT > 0 ? (V1 + V2) / QT : 0;

            // Update slider value displays
            const s1Val = container.querySelector('.ep-s1-val');
            const s2Val = container.querySelector('.ep-s2-val');
            const p1Val = container.querySelector('.ep-p1-val');
            const p2Val = container.querySelector('.ep-p2-val');
            const qtVal = container.querySelector('.ep-qt-val');
            if (s1Val) s1Val.textContent = share1.toString();
            if (s2Val) s2Val.textContent = share2.toString();
            if (p1Val) p1Val.textContent = P1.toString();
            if (p2Val) p2Val.textContent = P2.toString();
            if (qtVal) qtVal.textContent = totalQ.toString();

            v1El.textContent = Math.round(V1).toString();
            v2El.textContent = Math.round(V2).toString();
            weightedEl.textContent = (Math.round(WT * 100) / 100).toFixed(2);
            qtyEl.textContent = Math.round(QT).toString();

            const modeBtn = container.querySelector('.ep-mode-btn.active');
            const mode = modeBtn ? modeBtn.getAttribute('data-mode') : 'qty';
            const base = mode === 'val' ? (V1 + V2) : QT;
            const sBar1 = base > 0 ? ((mode === 'val' ? V1 : Q1) / base) * 100 : 0;
            const sBar2 = 100 - sBar1;
            bar1.style.width = `${sBar1}%`;
            bar2.style.width = `${sBar2}%`;

            // Update composition label
            const compLabel = container.querySelector('.ep-comp-label');
            if (compLabel) {
                compLabel.textContent = mode === 'val' ? 'Value Split' : 'Quantity Split';
            }

            // Revenue share tags always reflect value shares
            const rev1 = container.querySelector('.ep-rev1');
            const rev2 = container.querySelector('.ep-rev2');
            const VT = V1 + V2;
            const r1 = VT > 0 ? (V1 / VT) * 100 : 0;
            const r2 = 100 - r1;
            if (rev1) rev1.textContent = `${(Math.round(r1 * 10) / 10).toFixed(1)}%`;
            if (rev2) rev2.textContent = `${(Math.round(r2 * 10) / 10).toFixed(1)}%`;
        }
        ['input','change'].forEach(evt => {
            s1.addEventListener(evt, () => { syncShares('s1'); update(); });
            s2.addEventListener(evt, () => { syncShares('s2'); update(); });
            p1.addEventListener(evt, update);
            p2.addEventListener(evt, update);
            qt.addEventListener(evt, update);
        });
        const modeButtons = container.querySelectorAll('.ep-mode-btn');
        modeButtons.forEach(btn => btn.addEventListener('click', () => {
            modeButtons.forEach(b => {
                b.classList.remove('active');
                b.style.border = '1px solid #cbd5e1';
                b.style.background = '#fff';
                b.style.color = '#0f172a';
            });
            btn.classList.add('active');
            btn.style.border = '1px solid #3b82f6';
            btn.style.background = '#dbeafe';
            btn.style.color = '#1e40af';
            update();
        }));
        syncShares('init');
        update();
    } catch (_) {}
}

// DETAIL_MAP removed - all detail files now exist in details/ folder

// ===== Global tooltip helpers (used by dynamically loaded detail HTML) =====
(function registerGlobalTooltips() {
    if (window.showTooltip && window.hideTooltip) return;

    function ensureTooltipStylesInjected() {
        if (document.querySelector('style[data-ewagi-tooltips]')) return;
        const style = document.createElement('style');
        style.setAttribute('data-ewagi-tooltips', '');
        style.textContent = `
            .ewagi-tooltip{position:fixed;background:rgba(0,0,0,.9);color:#fff;padding:12px 16px;border-radius:8px;font-size:13px;max-width:320px;z-index:2147483650;pointer-events:none;box-shadow:0 4px 12px rgba(0,0,0,.3);opacity:0;transform:translateY(-4px);transition:opacity .12s ease,transform .12s ease}
            .ewagi-tooltip.show{opacity:1;transform:translateY(0)}
            .ewagi-tooltip .title{font-weight:700;margin-bottom:6px;color:#ffd700}
        `;
        document.head.appendChild(style);
    }

    window.showTooltip = function showTooltip(event, title, content) {
        try {
            window.hideTooltip();
            ensureTooltipStylesInjected();

            const tooltip = document.createElement('div');
            tooltip.className = 'ewagi-tooltip';
            tooltip.innerHTML = `<div class="title">${title || ''}</div><div>${content || ''}</div>`;
            document.body.appendChild(tooltip);

            const target = event.currentTarget || event.target;
            const rect = target.getBoundingClientRect();
            const tRect = tooltip.getBoundingClientRect();

            let left = rect.left + rect.width / 2 - tRect.width / 2;
            let top = rect.top - tRect.height - 10;

            if (left < 10) left = 10;
            if (left + tRect.width > window.innerWidth - 10) left = window.innerWidth - tRect.width - 10;
            if (top < 10) top = rect.bottom + 10;

            tooltip.style.left = `${Math.round(left)}px`;
            tooltip.style.top = `${Math.round(top)}px`;

            requestAnimationFrame(() => tooltip.classList.add('show'));
        } catch (_) {}
    };

    window.hideTooltip = function hideTooltip() {
        const existing = document.querySelector('.ewagi-tooltip');
        if (existing) existing.remove();
    };

    // Decision Process Widget Initialization
    window.initDecisionProcessWidget = function initDecisionProcessWidget() {
        const container = document.querySelector('.decision-process-widget');
        if (!container) return;

        const energyPriceSlider = container.querySelector('.dp-energy-price');
        const interestRateSlider = container.querySelector('.dp-interest-rate');
        const budgetSlider = container.querySelector('.dp-budget');
        
        const energyPriceVal = container.querySelector('.dp-energy-price-val');
        const interestRateVal = container.querySelector('.dp-interest-rate-val');
        const budgetVal = container.querySelector('.dp-budget-val');

        const energyStatus = container.querySelector('.dp-energy-status');
        const proposalsCount = container.querySelector('.dp-proposals-count');
        const selectedCount = container.querySelector('.dp-selected-count');
        const investmentTotal = container.querySelector('.dp-investment-total');
        const roi = container.querySelector('.dp-roi');

        const totalInvestment = container.querySelector('.dp-total-investment');
        const budgetUsed = container.querySelector('.dp-budget-used');
        const expectedROI = container.querySelector('.dp-expected-roi');

        // Step elements for staged visualization
        const stepEl1 = container.querySelector('.dp-step-1');
        const stepEl2 = container.querySelector('.dp-step-2');
        const stepEl3 = container.querySelector('.dp-step-3');
        const stepEl4 = container.querySelector('.dp-step-4');
        const stepEl5 = container.querySelector('.dp-step-5');

        // Staging helpers
        let sequenceTimers = [];
        function clearSequenceTimers() {
            sequenceTimers.forEach(t => clearTimeout(t));
            sequenceTimers = [];
        }
        function setStepState(step, state) {
            if (!step) return;
            const titleEl = step.querySelector('div');
            if (state === 'inactive') {
                step.style.borderColor = '#e5e7eb';
                if (titleEl) titleEl.style.color = '#6b7280';
            } else if (state === 'active') {
                step.style.borderColor = '#3b82f6';
                if (titleEl) titleEl.style.color = '#3b82f6';
            } else if (state === 'done') {
                step.style.borderColor = '#10b981';
                if (titleEl) titleEl.style.color = '#10b981';
            }
        }
        function resetSteps() {
            setStepState(stepEl1, 'inactive');
            setStepState(stepEl2, 'inactive');
            setStepState(stepEl3, 'inactive');
            setStepState(stepEl4, 'inactive');
            setStepState(stepEl5, 'inactive');
        }

        function updateDecisionProcess() {
            // cancel any in-flight staged updates
            clearSequenceTimers();
            const energyPrice = Number(energyPriceSlider.value);
            const interestRate = Number(interestRateSlider.value);
            const budget = Number(budgetSlider.value);

            // Update slider value displays
            energyPriceVal.textContent = energyPrice.toString();
            interestRateVal.textContent = interestRate.toFixed(1);
            budgetVal.textContent = budget.toString();

            // Determine market analysis label (applied in stage 1)
            const energyLevel = energyPrice > 150 ? 'Very High' : energyPrice > 120 ? 'High' : energyPrice > 90 ? 'Medium' : 'Low';

            // Calculate investment proposals based on energy price
            // Simple NPV responsiveness (illustrative):
            // Efficiency becomes more attractive when energy price rises, and when rates fall
            const efficiencyNPV = (energyPrice > 100 ? 12.5 + (energyPrice - 100) * 0.1 : 8.5) * (1 - (interestRate - 1) * 0.03);
            // Capacity becomes less attractive at high energy price and high rates
            const capacityNPV = (18.2 - (energyPrice - 100) * 0.05) * (1 - (interestRate - 1) * 0.04);
            const renewalNPV = 8.7 * (1 - (interestRate - 1) * 0.02);

            // Proposal rows
            const efficiencyRow = container.querySelector('[data-type="efficiency"]');
            const capacityRow = container.querySelector('[data-type="capacity"]');
            const renewalRow = container.querySelector('[data-type="renewal"]');

            // Budget allocation logic (costs can be edited in the table)
            const getCost = (type, fallback) => {
                const input = container.querySelector(`.dp-cost-input[data-type="${type}"]`);
                const v = input ? Number(input.value) : NaN;
                return Number.isFinite(v) && v >= 0 ? v : fallback;
            };
            const efficiencyCost = getCost('efficiency', 8);
            const capacityCost = getCost('capacity', 15);
            const renewalCost = getCost('renewal', 12);

            let selectedInvestments = [];
            let totalCost = 0;

            // Sort by NPV and select within budget
            const investments = [
                { type: 'efficiency', cost: efficiencyCost, npv: efficiencyNPV, row: efficiencyRow },
                { type: 'capacity', cost: capacityCost, npv: capacityNPV, row: capacityRow },
                { type: 'renewal', cost: renewalCost, npv: renewalNPV, row: renewalRow }
            ].sort((a, b) => b.npv - a.npv);

            investments.forEach(inv => {
                if (totalCost + inv.cost <= budget) {
                    selectedInvestments.push(inv);
                    totalCost += inv.cost;
                }
            });

            // Calculate ROI now (applied in stage 5)
            const totalNPV = selectedInvestments.reduce((sum, inv) => sum + inv.npv, 0);
            const avgROI = totalCost > 0 ? ((totalNPV - totalCost) / totalCost * 100) : 0;

            // Reset step visuals
            resetSteps();

            // Stage 1: Market analysis
            sequenceTimers.push(setTimeout(() => {
                energyStatus.textContent = energyLevel;
                setStepState(stepEl1, 'active');
            }, 0));

            // Stage 2: Proposals (update NPV cells)
            sequenceTimers.push(setTimeout(() => {
                if (efficiencyRow) efficiencyRow.querySelector('.dp-npv').textContent = efficiencyNPV.toFixed(1);
                if (capacityRow) capacityRow.querySelector('.dp-npv').textContent = capacityNPV.toFixed(1);
                proposalsCount.textContent = '3';
                setStepState(stepEl1, 'done');
                setStepState(stepEl2, 'active');
            }, 200));

            // Stage 3: Budget allocation (set selected/rejected tags)
            sequenceTimers.push(setTimeout(() => {
                [efficiencyRow, capacityRow, renewalRow].forEach(r => {
                    if (!r) return;
                    const tag = r.querySelector('.dp-status span');
                    if (tag) { tag.textContent = 'Rejected'; tag.style.background = '#ef4444'; }
                });
                selectedInvestments.forEach(inv => {
                    const tag = inv.row.querySelector('.dp-status span');
                    if (tag) { tag.textContent = 'Selected'; tag.style.background = '#10b981'; }
                });
                selectedCount.textContent = selectedInvestments.length.toString();
                setStepState(stepEl2, 'done');
                setStepState(stepEl3, 'active');
            }, 400));

            // Stage 4: Implementation (investment totals)
            sequenceTimers.push(setTimeout(() => {
                investmentTotal.textContent = `€${totalCost}M`;
                setStepState(stepEl3, 'done');
                setStepState(stepEl4, 'active');
            }, 600));

            // Stage 5: Performance tracking (ROI & summary)
            sequenceTimers.push(setTimeout(() => {
                roi.textContent = `${avgROI.toFixed(1)}%`;
                totalInvestment.textContent = `€${totalCost}M`;
                budgetUsed.textContent = `${Math.round((totalCost / budget) * 100)}%`;
                expectedROI.textContent = `${avgROI.toFixed(1)}%`;
                setStepState(stepEl4, 'done');
                setStepState(stepEl5, 'active');
            }, 800));
        }

        // Add event listeners
        [energyPriceSlider, interestRateSlider, budgetSlider].forEach(slider => {
            slider.addEventListener('input', updateDecisionProcess);
        });

        // React to manual cost edits
        const costInputs = container.querySelectorAll('.dp-cost-input');
        costInputs.forEach(inp => {
            ['input','change'].forEach(evt => inp.addEventListener(evt, updateDecisionProcess));
        });

        // Initial update
        updateDecisionProcess();
    }

    // Initialize decision process widget if present
    initDecisionProcessWidget();
})();
