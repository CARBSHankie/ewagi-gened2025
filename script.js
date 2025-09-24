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
            // Small delay to ensure modal is visible and canvas has dimensions
            setTimeout(initMacroChart, 50);
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
            })
            .catch(() => {
                // Fallback to inline map
                const entry = DETAIL_MAP[detailId];
                if (entry) {
                    if (titleEl) titleEl.textContent = entry.t || '';
                    if (bodyEl) bodyEl.innerHTML = entry.b || '';
                } else {
                    if (titleEl) titleEl.textContent = 'Details';
                    if (bodyEl) bodyEl.innerHTML = '<div style="padding:16px">Details not available.</div>';
                }
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
    
    // Find the visible canvas in the modal (not the hidden static one)
    let canvas = null;
    const modal = document.getElementById('detail-modal');
    if (modal && modal.style.display !== 'none') {
        canvas = modal.querySelector('#macroChart');
    }
    
    // Fallback: find any visible canvas with the macroChart id
    if (!canvas) {
        const canvases = document.querySelectorAll('#macroChart');
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
            const dataEl = document.getElementById('macro-data');
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

const DETAIL_MAP = {
    'agents-firms': { 
        t: '🏭 Firms', 
        b: `<h3>Scale & Distribution</h3>
            <p>20,000+ heterogeneous firms across 72 economic divisions (German WZ 2008 classification)</p>
            <ul class="detail-list">
                <li>3,598 active firms in current simulation</li>
                <li>Size distribution: micro (1-9), small (10-49), medium (50-249), large (250+)</li>
                <li>Regional distribution across 16 German states</li>
                <li>Total employment: 44.6 million workers</li>
                <li>Capital stock: €8.2 trillion across all firms</li>
            </ul>
            <h3>Production Model</h3>
            <p>Capital-labor production function with energy inputs</p>
            <ul class="detail-list">
                <li>Cobb-Douglas production function: Y = A × K^α × L^β × E^γ</li>
                <li>Technology parameter A varies by sector and firm size</li>
                <li>Energy efficiency improvements through investment</li>
                <li>Returns to scale: α + β + γ = 0.95 (slightly decreasing)</li>
                <li>Energy elasticity: γ = 0.08 (energy-intensive sectors)</li>
            </ul>
            <h3>Decision Making Framework</h3>
            <p>Policy-driven framework for capacity and efficiency decisions</p>
            <ul class="detail-list">
                <li>Capacity expansion when utilization > 85%</li>
                <li>Efficiency upgrades in response to energy price changes</li>
                <li>Capital renewal based on equipment age and performance</li>
                <li>Investment threshold: 15% internal rate of return</li>
                <li>Risk-adjusted discount rate: 8-12% by sector</li>
            </ul>
            <h3>Energy Adaptation Strategies</h3>
            <p>Heterogeneous responses to energy price changes</p>
            <ul class="detail-list">
                <li>Energy efficiency: 2-5% annual improvement potential</li>
                <li>Fuel switching: Natural gas to electricity substitution</li>
                <li>Self-generation: On-site renewable energy systems</li>
                <li>Process optimization: Lean manufacturing principles</li>
                <li>Technology adoption: Industry 4.0 integration</li>
            </ul>
            <h3>Sectoral Characteristics</h3>
            <p>Key differences across economic sectors</p>
            <ul class="detail-list">
                <li>Energy-intensive: Steel, cement, chemicals (high E/L ratio)</li>
                <li>Manufacturing: Automotive, machinery (medium E/L ratio)</li>
                <li>Services: IT, finance (low E/L ratio)</li>
                <li>Construction: Building materials (medium E/L ratio)</li>
            </ul>
            <h3>Financial Structure</h3>
            <p>Capital structure and financing mechanisms</p>
            <ul class="detail-list">
                <li>Debt-to-equity ratio: 0.3-0.8 by sector</li>
                <li>Working capital: 15-25% of total assets</li>
                <li>Credit rating: AAA to BBB based on size and sector</li>
                <li>Interest coverage: 3-8x EBITDA by risk category</li>
            </ul>
            <h3>Market Behavior</h3>
            <p>Competitive dynamics and market positioning</p>
            <ul class="detail-list">
                <li>Market share: 0.1-15% depending on sector concentration</li>
                <li>Price setting: Cost-plus or market-based pricing</li>
                <li>Product differentiation: Quality, innovation, service</li>
                <li>Export orientation: 20-80% of sales by sector</li>
            </ul>
            <h3>Innovation & R&D</h3>
            <p>Research and development investment patterns</p>
            <ul class="detail-list">
                <li>R&D intensity: 1-8% of sales by sector</li>
                <li>Patent applications: 0.1-2.0 per firm annually</li>
                <li>Technology adoption: 2-5 year lag for new technologies</li>
                <li>Digital transformation: Industry 4.0 integration</li>
            </ul>
            <h3>Environmental Performance</h3>
            <p>Sustainability and environmental impact</p>
            <ul class="detail-list">
                <li>Carbon intensity: 0.1-2.0 tCO2/€1000 revenue</li>
                <li>Energy efficiency: 2-5% annual improvement potential</li>
                <li>Renewable energy: 10-40% of total consumption</li>
                <li>Circular economy: Waste reduction and recycling</li>
            </ul>`
    },
    'agents-households': { 
        t: '👥 Households', 
        b: `<h3>Scale & Demographics</h3>
            <p>41,039 households representing German population demographics</p>
            <ul class="detail-list">
                <li>Income distribution based on German household survey data</li>
                <li>Regional distribution across 16 German states</li>
                <li>Age and education level heterogeneity</li>
            </ul>
            <h3>Consumption Behavior</h3>
            <p>Multi-sector consumption with energy-specific choices</p>
            <ul class="detail-list">
                <li>Consumption across 20 economic sectors</li>
                <li>Energy consumption: electricity, heating, transportation</li>
                <li>Price elasticity varies by income level and region</li>
            </ul>
            <h3>Labor Supply</h3>
            <p>Labor market participation and wage negotiation</p>
            <ul class="detail-list">
                <li>Labor supply based on wage levels and unemployment</li>
                <li>Skill level matching with firm requirements</li>
                <li>Geographic mobility constraints</li>
            </ul>`
    },
    'agents-banks': { t: '🏦 Banks', b: 'Credit & risk assessment, dynamic rates' },
    'markets-goods': { t: '🛒 Goods Markets', b: 'Inventory, exports, price discovery' },
    'markets-labor': { t: '👷 Labor Market', b: 'Wages, hiring, matching' },
    'markets-financial': { t: '💹 Financial Market', b: 'Credit allocation, liquidity' },
    'markets-energy': { t: '⚡ Energy Market', b: 'Policy, pricing, technology' },
    'institutions-government': { t: '🏛️ Government', b: 'Fiscal & energy policy' },
    'institutions-clearing': { t: '⚖️ Clearing House', b: 'Trade execution & settlement' },
    'institutions-trade': { t: '🌍 Trade System', b: 'Export/import, exchange rates' },
    'simulation-engine': { t: '🏛️ Enterprise Simulation', b: '20k+ agents, multi-market system' },
    'decision-system': { 
        t: '🧠 Decision System', 
        b: `<h3>Policy-Driven Framework</h3>
            <p>Clean separation of concerns with modular design</p>
            <ul class="detail-list">
                <li>DecisionEngine: Orchestrates decision processes</li>
                <li>DecisionPolicy: Implements specific strategies</li>
                <li>CapitalAllocator: Manages budget allocation</li>
                <li>DecisionExecutor: Executes decisions</li>
            </ul>
            <h3>Investment Policies</h3>
            <p>Sophisticated capital allocation mechanisms</p>
            <ul class="detail-list">
                <li>Capacity expansion (utilization > 85%)</li>
                <li>Efficiency upgrades (step-wise improvements)</li>
                <li>Capital renewal (equipment replacement)</li>
            </ul>
            <h3>Adaptive Behavior</h3>
            <p>Learning and adaptation to changing conditions</p>
            <ul class="detail-list">
                <li>Performance-based strategy adjustment</li>
                <li>Market condition adaptation</li>
                <li>Policy response mechanisms</li>
            </ul>`
    },
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
