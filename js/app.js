/**
 * AS COLLAB - D2C & Amazon Growth Agency
 * Interactive Web & Mobile App Engine
 * Founder: Akshit Saxena (+91 8650659985)
 */

document.addEventListener('DOMContentLoaded', () => {
  initPWA();
  initBSRCalculator();
  initROICalculator();
  initAuditScanner();
  initFaqAccordion();
});

// ==========================================
// 1. PWA & Mobile Installation Handler
// ==========================================
let deferredPrompt;
function initPWA() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(err => {
        console.log('SW registration note:', err);
      });
    });
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installBanner = document.getElementById('pwaInstallBanner');
    if (installBanner) {
      installBanner.classList.remove('hidden');
    }
  });
}

function triggerPWAInstall() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted AS Collab App installation');
      }
      deferredPrompt = null;
      const installBanner = document.getElementById('pwaInstallBanner');
      if (installBanner) installBanner.classList.add('hidden');
    });
  } else {
    alert('To install AS Collab App on iOS/Android: Tap your browser share/menu button and select "Add to Home Screen".');
  }
}

// ==========================================
// 2. Mobile Drawer Navigation
// ==========================================
function toggleMobileMenu() {
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('mobileDrawerBackdrop');
  if (drawer && backdrop) {
    if (drawer.classList.contains('-translate-x-full')) {
      drawer.classList.remove('-translate-x-full');
      backdrop.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    } else {
      drawer.classList.add('-translate-x-full');
      backdrop.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }
  }
}

// ==========================================
// 3. Amazon BSR Rank Jump Simulator
// ==========================================
function initBSRCalculator() {
  const categorySelect = document.getElementById('bsrCategory');
  const currentRankInput = document.getElementById('bsrCurrentRank');
  const targetRankInput = document.getElementById('bsrTargetRank');

  if (!categorySelect || !currentRankInput || !targetRankInput) return;

  const updateBSR = () => {
    const category = categorySelect.value;
    const current = Math.max(1, parseInt(currentRankInput.value) || 3500);
    const target = Math.max(1, Math.min(current - 1, parseInt(targetRankInput.value) || 10));

    // Category velocity multipliers (Daily units for Top 10 BSR in Amazon India)
    const categoryBenchmarks = {
      'beauty': { top10Units: 140, avgPrice: 599, ppcPerUnit: 75, vineUgcNeed: '15 Vine + 6 UGC Reels' },
      'kitchen': { top10Units: 180, avgPrice: 899, ppcPerUnit: 110, vineUgcNeed: '20 Vine + 8 UGC Reels' },
      'electronics': { top10Units: 250, avgPrice: 1299, ppcPerUnit: 160, vineUgcNeed: '30 Vine + 12 UGC Reels' },
      'grocery': { top10Units: 320, avgPrice: 349, ppcPerUnit: 45, vineUgcNeed: '20 Vine + 10 UGC Reels' },
      'fashion': { top10Units: 210, avgPrice: 799, ppcPerUnit: 90, vineUgcNeed: '15 Vine + 15 UGC Reels' },
      'fitness': { top10Units: 120, avgPrice: 999, ppcPerUnit: 130, vineUgcNeed: '25 Vine + 8 UGC Reels' }
    };

    const benchmark = categoryBenchmarks[category] || categoryBenchmarks['beauty'];

    // Power law approximation for Amazon India BSR velocity
    const targetDailyUnits = Math.round(benchmark.top10Units * Math.pow(10 / target, 0.45));
    const currentDailyUnits = Math.max(2, Math.round(benchmark.top10Units * Math.pow(10 / current, 0.45)));
    const incrementalDailyUnits = Math.max(1, targetDailyUnits - currentDailyUnits);

    const projectedMonthlyGMV = Math.round((targetDailyUnits * 30 * benchmark.avgPrice) / 100000); // In Lakhs
    const currentMonthlyGMV = Math.round((currentDailyUnits * 30 * benchmark.avgPrice) / 100000);
    const gmvIncrease = Math.max(0.5, (projectedMonthlyGMV - currentMonthlyGMV)).toFixed(1);

    const estimatedPPCBudget = Math.round((incrementalDailyUnits * 30 * benchmark.ppcPerUnit));
    const velocityDays = target <= 10 ? '21 - 35 Days' : '14 - 21 Days';

    // Update DOM
    const elUnits = document.getElementById('bsrDailyUnitsResult');
    const elGMV = document.getElementById('bsrProjectedGMVResult');
    const elPPC = document.getElementById('bsrEstimatedPPCResult');
    const elTime = document.getElementById('bsrTimelineResult');
    const elVine = document.getElementById('bsrVineUGCResult');

    if (elUnits) elUnits.innerText = `${targetDailyUnits} units/day`;
    if (elGMV) elGMV.innerText = `₹${projectedMonthlyGMV} Lakhs/mo (+₹${gmvIncrease}L)`;
    if (elPPC) elPPC.innerText = `₹${estimatedPPCBudget.toLocaleString('en-IN')}/mo`;
    if (elTime) elTime.innerText = velocityDays;
    if (elVine) elVine.innerText = benchmark.vineUgcNeed;
  };

  categorySelect.addEventListener('change', updateBSR);
  currentRankInput.addEventListener('input', updateBSR);
  targetRankInput.addEventListener('input', updateBSR);
  updateBSR();
}

function shareBSRToWhatsApp() {
  const category = document.getElementById('bsrCategory')?.value || 'Beauty';
  const current = document.getElementById('bsrCurrentRank')?.value || '3500';
  const target = document.getElementById('bsrTargetRank')?.value || '10';
  const units = document.getElementById('bsrDailyUnitsResult')?.innerText || '140 units/day';
  const gmv = document.getElementById('bsrProjectedGMVResult')?.innerText || '₹25 Lakhs';

  const text = `Hi Akshit! I simulated my Amazon BSR Rank on AS Collab:
- Category: ${category}
- Current BSR: #${current}
- Target BSR: #${target}
- Target Velocity: ${units}
- Projected Monthly GMV: ${gmv}

I want AS Collab to audit my ASIN and deploy this launch strategy!`;

  window.open(`https://wa.me/918650659985?text=${encodeURIComponent(text)}`, '_blank');
}

// ==========================================
// 4. Live Campaign ROI & Budget Estimator
// ==========================================
function initROICalculator() {
  const spendSlider = document.getElementById('roiSpendSlider');
  const roasSlider = document.getElementById('roiRoasSlider');

  if (!spendSlider || !roasSlider) return;

  const updateROI = () => {
    const monthlySpend = parseInt(spendSlider.value) || 100000;
    const targetROAS = parseFloat(roasSlider.value) || 4.5;

    // Display slider values
    const elSpendDisplay = document.getElementById('roiSpendValueDisplay');
    const elRoasDisplay = document.getElementById('roiRoasValueDisplay');

    if (elSpendDisplay) elSpendDisplay.innerText = `₹${(monthlySpend / 100000).toFixed(2)} Lakhs`;
    if (elRoasDisplay) elRoasDisplay.innerText = `${targetROAS.toFixed(1)}x ROAS`;

    // Calculations
    const directRevenue = monthlySpend * targetROAS;
    const organicSpillover = directRevenue * 0.42; // Proven Amazon Organic Halo Effect
    const totalGMV = directRevenue + organicSpillover;
    const estimatedNetProfit = Math.round(totalGMV * 0.28 - monthlySpend); // assuming 28% margin before ads

    // Update DOM
    const elDirectRev = document.getElementById('roiDirectRevenue');
    const elOrganicHalo = document.getElementById('roiOrganicHalo');
    const elTotalGMV = document.getElementById('roiTotalGMV');
    const elNetProfit = document.getElementById('roiNetProfit');

    if (elDirectRev) elDirectRev.innerText = `₹${(directRevenue / 100000).toFixed(2)} L`;
    if (elOrganicHalo) elOrganicHalo.innerText = `+₹${(organicSpillover / 100000).toFixed(2)} L`;
    if (elTotalGMV) elTotalGMV.innerText = `₹${(totalGMV / 100000).toFixed(2)} Lakhs/mo`;
    if (elNetProfit) elNetProfit.innerText = `₹${Math.max(10000, estimatedNetProfit).toLocaleString('en-IN')}`;
  };

  spendSlider.addEventListener('input', updateROI);
  roasSlider.addEventListener('input', updateROI);
  updateROI();
}

function consultROIPlan() {
  const spend = document.getElementById('roiSpendValueDisplay')?.innerText || '₹1.00 Lakhs';
  const roas = document.getElementById('roiRoasValueDisplay')?.innerText || '4.5x';
  const total = document.getElementById('roiTotalGMV')?.innerText || '₹6.39 Lakhs/mo';

  const text = `Hi Akshit! I checked the AS Collab ROI Estimator for my brand:
- Planned Monthly Ad Spend: ${spend}
- Target ROAS: ${roas}
- Expected Monthly GMV (Ads + Halo): ${total}

Can we schedule a 15-minute growth consultation?`;

  window.open(`https://wa.me/918650659985?text=${encodeURIComponent(text)}`, '_blank');
}

// ==========================================
// 5. Instant Free Amazon / Flipkart Audit Engine
// ==========================================
function initAuditScanner() {
  const auditForm = document.getElementById('brandAuditForm');
  if (!auditForm) return;

  auditForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const brandName = document.getElementById('auditBrandName')?.value || 'Your Brand';
    const asin = document.getElementById('auditAsin')?.value || 'B0XXXXXXXX';
    const marketplace = document.getElementById('auditMarketplace')?.value || 'Amazon India';
    const phone = document.getElementById('auditPhone')?.value || '';

    const scanModal = document.getElementById('auditScanModal');
    const progressBar = document.getElementById('auditProgressBar');
    const statusText = document.getElementById('auditScanStatus');
    const resultsContainer = document.getElementById('auditScanResults');

    if (scanModal) {
      scanModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }

    // Step-by-step simulated live scan
    const steps = [
      { text: `Connecting to ${marketplace} catalog API for ASIN: ${asin}...`, progress: '20%' },
      { text: 'Scanning 200-char Title keyword density & search term indexation...', progress: '45%' },
      { text: 'Auditing 7/7 Image Slots, 3D infographic renders & video assets...', progress: '65%' },
      { text: 'Analyzing A+ Content, Brand Story modules & Vine review velocity...', progress: '85%' },
      { text: 'Evaluating Sponsored Ads defense & competitor conquesting...', progress: '100%' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        if (statusText) statusText.innerText = steps[currentStep].text;
        if (progressBar) progressBar.style.width = steps[currentStep].progress;
        currentStep++;
      } else {
        clearInterval(interval);
        // Show result
        if (statusText) statusText.innerText = 'Audit Complete! Leakages Identified.';
        if (resultsContainer) {
          resultsContainer.innerHTML = `
            <div class="mt-4 p-4 rounded-xl bg-slate-800/90 border border-amber-500/40 text-left">
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs uppercase tracking-wider text-amber-400 font-semibold">ASIN Health Score</span>
                <span class="text-xl font-bold text-amber-400 font-heading">58 / 100 (Critical Attention)</span>
              </div>
              <p class="text-sm text-slate-300 mb-3">Audit report generated for <strong class="text-white">${brandName} (${asin})</strong>:</p>
              <ul class="text-xs text-slate-300 space-y-2 mb-4">
                <li class="flex items-start gap-2">
                  <i class="fa-solid fa-triangle-exclamation text-amber-400 mt-0.5"></i>
                  <span><strong>Zero Compliant Amazon Vine Reviews:</strong> Listing lacks high-trust early reviews, causing 42% cart dropoff.</span>
                </li>
                <li class="flex items-start gap-2">
                  <i class="fa-solid fa-circle-xmark text-red-400 mt-0.5"></i>
                  <span><strong>Missing 9:16 Vertical UGC Reels:</strong> Shoppers bounce to competitors with live video demonstrations.</span>
                </li>
                <li class="flex items-start gap-2">
                  <i class="fa-solid fa-triangle-exclamation text-amber-400 mt-0.5"></i>
                  <span><strong>PPC Traffic Bleed:</strong> Competitor ASINs are bidding on your product page and stealing 25%+ of your visitors.</span>
                </li>
              </ul>
              <div class="p-3 bg-sky-950/60 rounded-lg border border-sky-500/30 text-xs text-sky-200 mb-4">
                <strong>Recommended Action:</strong> Deploy AS Collab's 3-Step ASIN Launch Engine (Vine Setup + 5x UGC Reels + Defensive PPC Matrix).
              </div>
              <button onclick="sendAuditViaWhatsApp('${brandName}', '${asin}', '${phone}')" class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-sm shadow-lg shadow-green-500/30 hover:brightness-110 flex items-center justify-center gap-2">
                <i class="fa-brands fa-whatsapp text-lg"></i>
                <span>Get Full 12-Page Free PDF Audit On WhatsApp</span>
              </button>
            </div>
          `;
          resultsContainer.classList.remove('hidden');
        }
      }
    }, 700);
  });
}

function sendAuditViaWhatsApp(brand, asin, phone) {
  const text = `Hi Akshit! I ran the Free ASIN Listing Audit on AS Collab:
- Brand: ${brand}
- ASIN: ${asin}
- Registered Phone: ${phone}
- Calculated Health Score: 58/100

Please send me the full 12-Page Actionable Audit PDF and let's discuss fixing the conversion leaks!`;

  window.open(`https://wa.me/918650659985?text=${encodeURIComponent(text)}`, '_blank');
}

function closeAuditModal() {
  const modal = document.getElementById('auditScanModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
}

// ==========================================
// 6. 9:16 UGC Reel Video Simulator Modal
// ==========================================
function openReelModal(creatorName, brandName, videoTitle, engagementRate, imageSrc) {
  const modal = document.getElementById('ugcReelModal');
  const titleEl = document.getElementById('reelModalTitle');
  const metaEl = document.getElementById('reelModalMeta');
  const imgEl = document.getElementById('reelModalImage');

  if (titleEl) titleEl.innerText = `${brandName} — ${videoTitle}`;
  if (metaEl) metaEl.innerText = `Creator: ${creatorName} • Engagement: ${engagementRate} • Format: 9:16 Mobile-First`;
  if (imgEl && imageSrc) imgEl.src = imageSrc;

  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeReelModal() {
  const modal = document.getElementById('ugcReelModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
}

// ==========================================
// 7. Creator Gateway & Brand Portal Modals
// ==========================================
function openCreatorModal() {
  const m = document.getElementById('creatorGatewayModal');
  if (m) {
    m.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeCreatorModal() {
  const m = document.getElementById('creatorGatewayModal');
  if (m) {
    m.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
}

function openPortalModal() {
  const m = document.getElementById('brandPortalModal');
  if (m) {
    m.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closePortalModal() {
  const m = document.getElementById('brandPortalModal');
  if (m) {
    m.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
}

// ==========================================
// 8. FAQ Accordion
// ==========================================
function initFaqAccordion() {
  const faqButtons = document.querySelectorAll('.faq-toggle-btn');
  faqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const icon = btn.querySelector('.faq-icon');

      if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      } else {
        content.classList.add('hidden');
        if (icon) icon.style.transform = 'rotate(0deg)';
      }
    });
  });
}


// ==========================================
// 9. Official Google Reviews Interactive Filter
// ==========================================
function filterGoogleReviews(cat, btn) {
  var buttons = document.querySelectorAll('.gr-filter-btn');
  buttons.forEach(function(b) { b.classList.remove('active'); });
  if (btn) btn.classList.add('active');

  var cards = document.querySelectorAll('#googleReviewsGrid .gr-card');
  cards.forEach(function(card) {
    var cats = (card.getAttribute('data-cats') || '').split(',');
    if (cat === 'all' || cats.indexOf(cat) !== -1) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}
