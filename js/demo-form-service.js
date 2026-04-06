document.addEventListener('DOMContentLoaded', function () {
  // Google Apps Script Web App endpoint (doPost)
  var DEMO_SHEETS_URL = (typeof window !== 'undefined' && window.DEMO_SHEETS_URL)
    ? window.DEMO_SHEETS_URL
    : 'https://script.google.com/macros/s/AKfycbyPY4bQ6cd3h22uZBTKBUbuhe4oJIbMBmFkTpx4cBONFEF3LOXYVpRB25cBPSA9chT_QA/exec';
  var demoModal = document.getElementById('demo-modal');
  var demoForm = document.getElementById('demo-form');
  var demoSuccess = document.getElementById('demo-success');

  if (!demoModal || !demoForm) return;

  var freeEmailDomains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'live.com', 'msn.com', 'yandex.com', 'mynet.com', 'turkcell.com.tr', 'ttmail.com', 'windowslive.com', 'icloud.com', 'me.com', 'mac.com'];

  function sanitizeText(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/<[^>]*>?/g, '').replace(/[\u0000-\u001F]/g, '').trim().substring(0, 500);
  }

  function hideAllDemoErrors() {
    demoModal.querySelectorAll('.demo-error').forEach(function (el) {
      el.classList.add('hidden');
      el.textContent = '';
    });
  }

  function showDemoError(fieldId, message) {
    var err = demoModal.querySelector('.demo-error[data-for="' + fieldId + '"]');
    if (err) {
      err.textContent = message;
      err.classList.remove('hidden');
    }
  }

  function toggleDemoConditionalFields() {
    var tip = (document.getElementById('demo-kurulus-tipi') || {}).value;
    var avukatWrap = document.getElementById('demo-avukat-wrap');
    var kurumsalWrap = document.getElementById('demo-kurumsal-wrap');
    var avukatSel = document.getElementById('demo-avukat-sayisi');
    var calisanSel = document.getElementById('demo-calisan-sayisi');
    var hukukiSel = document.getElementById('demo-hukuki-surec');
    if (avukatWrap) avukatWrap.classList.add('hidden');
    if (kurumsalWrap) kurumsalWrap.classList.add('hidden');
    if (avukatSel) avukatSel.removeAttribute('required');
    if (calisanSel) calisanSel.removeAttribute('required');
    if (hukukiSel) hukukiSel.removeAttribute('required');
    if (tip === 'Hukuk Bürosu') {
      if (avukatWrap) avukatWrap.classList.remove('hidden');
      if (avukatSel) avukatSel.setAttribute('required', 'required');
    } else if (tip === 'Kurumsal Şirket' || tip === 'Kamu') {
      if (kurumsalWrap) kurumsalWrap.classList.remove('hidden');
      if (calisanSel) calisanSel.setAttribute('required', 'required');
      if (hukukiSel) hukukiSel.setAttribute('required', 'required');
    }
  }

  function updateProblemCount() {
    var ta = document.getElementById('demo-problem');
    var count = document.getElementById('demo-problem-count');
    if (ta && count) count.textContent = (ta.value || '').length;
  }

  function openDemoModal() {
    if (!demoModal) return;
    demoModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    demoForm.reset();
    if (demoSuccess) demoSuccess.classList.add('hidden');
    demoForm.classList.remove('hidden');
    hideAllDemoErrors();
    toggleDemoConditionalFields();
    updateProblemCount();
    var warn = document.getElementById('demo-email-warning');
    if (warn) warn.classList.add('hidden');
    var first = demoModal.querySelector('input:not([type=\"checkbox\"]), select');
    if (first) first.focus();
  }

  function closeDemoModal() {
    if (!demoModal) return;
    demoModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-demo-open]').forEach(function (btn) {
    btn.addEventListener('click', openDemoModal);
  });
  document.querySelectorAll('[data-demo-close]').forEach(function (el) {
    el.addEventListener('click', closeDemoModal);
  });

  if (window.location.hash === '#demo') {
    openDemoModal();
    if (history.replaceState) history.replaceState(null, '', window.location.pathname + window.location.search);
  }

  var kurulusTipiEl = document.getElementById('demo-kurulus-tipi');
  if (kurulusTipiEl) kurulusTipiEl.addEventListener('change', toggleDemoConditionalFields);

  var problemEl = document.getElementById('demo-problem');
  if (problemEl) {
    problemEl.addEventListener('input', function () {
      if (this.value.length > 500) this.value = this.value.substring(0, 500);
      updateProblemCount();
    });
    problemEl.addEventListener('paste', function () {
      var self = this;
      setTimeout(function () {
        if (self.value.length > 500) self.value = self.value.substring(0, 500);
        updateProblemCount();
      }, 0);
    });
  }

  var demoEmailEl = document.getElementById('demo-email');
  if (demoEmailEl) {
    demoEmailEl.addEventListener('blur', function () {
      var warn = document.getElementById('demo-email-warning');
      if (!warn) return;
      var email = this.value || '';
      var domain = email.includes('@') ? email.split('@')[1].toLowerCase().trim() : '';
      if (freeEmailDomains.some(function (d) { return domain === d || domain.endsWith('.' + d); })) {
        warn.classList.remove('hidden');
      } else {
        warn.classList.add('hidden');
      }
    });
  }

  demoForm.addEventListener('submit', function (e) {
    e.preventDefault();
    hideAllDemoErrors();

    var ad = (document.getElementById('demo-ad') || {}).value.trim();
    var soyad = (document.getElementById('demo-soyad') || {}).value.trim();
    var email = (document.getElementById('demo-email') || {}).value.trim();
    var telefon = (document.getElementById('demo-telefon') || {}).value.trim();
    var sirket = (document.getElementById('demo-sirket') || {}).value.trim();
    var kurulusTipi = (document.getElementById('demo-kurulus-tipi') || {}).value;
    var valid = true;

    if (!ad) { showDemoError('demo-ad', 'Ad zorunludur.'); valid = false; }
    if (!soyad) { showDemoError('demo-soyad', 'Soyad zorunludur.'); valid = false; }
    if (!email) { showDemoError('demo-email', 'E-posta zorunludur.'); valid = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showDemoError('demo-email', 'Geçerli bir e-posta adresi girin.'); valid = false; }
    if (!telefon) { showDemoError('demo-telefon', 'Telefon zorunludur.'); valid = false; }
    if (!sirket) { showDemoError('demo-sirket', 'Şirket adı zorunludur.'); valid = false; }
    if (!kurulusTipi) { showDemoError('demo-kurulus-tipi', 'Kuruluş tipi seçiniz.'); valid = false; }

    if (kurulusTipi === 'Hukuk Bürosu') {
      var av = (document.getElementById('demo-avukat-sayisi') || {}).value;
      if (!av) { showDemoError('demo-avukat-sayisi', 'Avukat sayısı seçiniz.'); valid = false; }
    }
    if (kurulusTipi === 'Kurumsal Şirket' || kurulusTipi === 'Kamu') {
      var cs = (document.getElementById('demo-calisan-sayisi') || {}).value;
      var hs = (document.getElementById('demo-hukuki-surec') || {}).value;
      if (!cs) { showDemoError('demo-calisan-sayisi', 'Çalışan sayısı seçiniz.'); valid = false; }
      if (!hs) { showDemoError('demo-hukuki-surec', 'Hukuki süreç yönetimini seçiniz.'); valid = false; }
    }

    var kvkk = document.getElementById('demo-kvkk');
    if (!kvkk || !kvkk.checked) { showDemoError('demo-kvkk', 'KVKK metnini okuyup onaylamanız gerekiyor.'); valid = false; }

    var problemRaw = (document.getElementById('demo-problem') || {}).value || '';
    if (problemRaw.length > 500) { showDemoError('demo-problem', 'En fazla 500 karakter girebilirsiniz.'); valid = false; }
    if (!valid) return;

    var payload = {
      ad: ad,
      soyad: soyad,
      email: email,
      telefon: telefon,
      sirket_adi: sirket,
      kurulus_tipi: kurulusTipi,
      avukat_sayisi: kurulusTipi === 'Hukuk Bürosu' ? (document.getElementById('demo-avukat-sayisi') || {}).value : '',
      calisan_sayisi: (kurulusTipi === 'Kurumsal Şirket' || kurulusTipi === 'Kamu') ? (document.getElementById('demo-calisan-sayisi') || {}).value : '',
      hukuki_surec_yonetimi: (kurulusTipi === 'Kurumsal Şirket' || kurulusTipi === 'Kamu') ? (document.getElementById('demo-hukuki-surec') || {}).value : '',
      gorev: sanitizeText((document.getElementById('demo-gorev') || {}).value || '').substring(0, 150),
      problem: sanitizeText(problemRaw || ''),
      kvkk: !!(kvkk && kvkk.checked),
      sourceUrl: typeof window !== 'undefined' && window.location ? window.location.href : ''
    };

    var submitBtn = document.getElementById('demo-submit');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Gönderiliyor...'; }
    if (!DEMO_SHEETS_URL) {
      setTimeout(function () {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Talebi Gönder'; }
        alert('Demo endpoint tanımlı değil. Lütfen yöneticiye iletin: DEMO_SHEETS_URL');
      }, 300);
      return;
    }

    var fields = {
      ad: payload.ad,
      soyad: payload.soyad,
      email: payload.email,
      telefon: payload.telefon,
      sirket_adi: payload.sirket_adi,
      kurulus_tipi: payload.kurulus_tipi,
      avukat_sayisi: payload.avukat_sayisi,
      calisan_sayisi: payload.calisan_sayisi,
      hukuki_surec_yonetimi: payload.hukuki_surec_yonetimi,
      gorev: payload.gorev,
      problem: payload.problem,
      sourceUrl: payload.sourceUrl
    };
    if (payload.kvkk) fields.kvkk = 'on';

    var payloadToSend = fields;
    fetch(DEMO_SHEETS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify(payloadToSend)
    })
      .then(function (res) {
        // no-cors nedeniyle yanıt "opaque" gelir; JSON okumak mümkün olmaz.
        if (res && res.type === 'opaque') {
          return { status: 'success', alert: 'alert-success', message: 'Talebiniz alındı!' };
        }
        return res.json().catch(function () {
          return res.text().then(function (t) { return { status: 'error', message: t }; });
        });
      })
      .then(function (result) {
        if (result && (result.status === 'success' || result.status === 'ok' || result.alert === 'alert-success')) {
          demoForm.classList.add('hidden');
          if (demoSuccess) demoSuccess.classList.remove('hidden');
        } else {
          throw new Error((result && result.message) || 'Form gönderimi başarısız');
        }
      })
      .catch(function (err) {
        alert(err && err.message ? err.message : 'Form gönderimi başarısız. Lütfen tekrar deneyin.');
      })
      .finally(function () {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Talebi Gönder'; }
      });
  });
});

