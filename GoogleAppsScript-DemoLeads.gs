/**
 * Google Apps Script: Demo Talep formu → "Dikera_Website_Demo_Leads" sheet
 * Dağıtım: Web uygulaması olarak dağıt, "Herkes" erişim, doPost kullanılır.
 */

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'Demo formu için POST ile veri gönderin.'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var data = getPayload(e);

    function clean(val, maxLen) {
      var s = (val === null || val === undefined) ? '' : String(val);
      s = s.trim();
      if (maxLen && s.length > maxLen) s = s.substring(0, maxLen);
      return s;
    }

    function escapeHtml(s) {
      return clean(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    var TO_EMAIL = 'mustafa.kucuk@vertonext.com';
    var SUBJECT = 'Yeni Demo Talebi - DikEra AI';
    var now = new Date();
    var tz = Session.getScriptTimeZone() || 'Europe/Istanbul';
    var timestamp = Utilities.formatDate(now, tz, 'dd.MM.yyyy HH:mm:ss');

    var ad = clean(data.ad, 100);
    var soyad = clean(data.soyad, 100);
    var email = clean(data.email, 200);
    var telefon = clean(data.telefon, 100);
    var sirket_adi = clean(data.sirket_adi, 200);
    var kurulus_tipi = clean(data.kurulus_tipi, 100);
    var avukat_sayisi = clean(data.avukat_sayisi, 100);
    var calisan_sayisi = clean(data.calisan_sayisi, 100);
    var hukuki_surec_yonetimi = clean(data.hukuki_surec_yonetimi, 150);
    var gorev = clean(data.gorev, 150);
    var problem = clean(data.problem, 500);
    var sourceUrl = clean(data.sourceUrl, 500);

    var kvkkOk = (data.kvkk === true) || (data.kvkk === 'true') || (data.kvkk === 'on') || (data.kvkk === '1');

    // Backend tarafında minimum validasyon
    if (!ad || !soyad || !email || !telefon || !sirket_adi || !kurulus_tipi || !kvkkOk) {
      return jsonResponse({ status: 'error', message: 'Eksik zorunlu alanlar veya KVKK onayı yok.' });
    }

    var kvkkText = kvkkOk ? 'Onaylandı' : 'Onay Yok';

    var htmlMessage = ''
      + '<!doctype html><html lang="tr"><head><meta charset="UTF-8"></head><body style="font-family:Arial,sans-serif;background:#f5f7fb;padding:20px;color:#1f2937;">'
      + '<div style="max-width:720px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">'
      + '<div style="background:#08102c;color:#fff;padding:18px 24px;font-size:20px;font-weight:700;">Yeni Demo Talebi</div>'
      + '<div style="padding:20px 24px;">'
      + '<table style="width:100%;border-collapse:collapse;">'
      + '<tr><td style="padding:8px 0;font-weight:600;width:220px;">Ad Soyad</td><td style="padding:8px 0;">' + escapeHtml(ad) + ' ' + escapeHtml(soyad) + '</td></tr>'
      + '<tr><td style="padding:8px 0;font-weight:600;">E-posta</td><td style="padding:8px 0;">' + escapeHtml(email) + '</td></tr>'
      + '<tr><td style="padding:8px 0;font-weight:600;">Telefon</td><td style="padding:8px 0;">' + escapeHtml(telefon) + '</td></tr>'
      + '<tr><td style="padding:8px 0;font-weight:600;">Şirket Adı</td><td style="padding:8px 0;">' + escapeHtml(sirket_adi) + '</td></tr>'
      + '<tr><td style="padding:8px 0;font-weight:600;">Kuruluş Tipi</td><td style="padding:8px 0;">' + escapeHtml(kurulus_tipi) + '</td></tr>'
      + '<tr><td style="padding:8px 0;font-weight:600;">Avukat Sayısı</td><td style="padding:8px 0;">' + escapeHtml(avukat_sayisi) + '</td></tr>'
      + '<tr><td style="padding:8px 0;font-weight:600;">Çalışan Sayısı</td><td style="padding:8px 0;">' + escapeHtml(calisan_sayisi) + '</td></tr>'
      + '<tr><td style="padding:8px 0;font-weight:600;">Hukuki Süreç Yönetimi</td><td style="padding:8px 0;">' + escapeHtml(hukuki_surec_yonetimi) + '</td></tr>'
      + '<tr><td style="padding:8px 0;font-weight:600;">Görev</td><td style="padding:8px 0;">' + escapeHtml(gorev) + '</td></tr>'
      + '<tr><td style="padding:8px 0;font-weight:600;">Problem</td><td style="padding:8px 0;">' + escapeHtml(problem).replace(/\n/g, '<br/>') + '</td></tr>'
      + '<tr><td style="padding:8px 0;font-weight:600;">KVKK</td><td style="padding:8px 0;">' + kvkkText + '</td></tr>'
      + '<tr><td style="padding:8px 0;font-weight:600;">Kaynak URL</td><td style="padding:8px 0;">' + escapeHtml(sourceUrl) + '</td></tr>'
      + '<tr><td style="padding:8px 0;font-weight:600;">Tarih</td><td style="padding:8px 0;">' + escapeHtml(timestamp) + '</td></tr>'
      + '</table>'
      + '</div></div>'
      + '</body></html>';

    MailApp.sendEmail({
      to: TO_EMAIL,
      subject: SUBJECT,
      htmlBody: htmlMessage,
      name: 'DikEra AI Demo Sistemi'
    });

    return jsonResponse({
      status: 'success',
      alert: 'alert-success',
      message: 'Talebiniz alındı!'
    });
  } catch (err) {
    return jsonResponse({
      status: 'error',
      message: err.message || 'Beklenmeyen hata.'
    });
  }
}

function getPayload(e) {
  if (e.postData && e.postData.contents) {
    // Ön yüzümüzdeki gönderim form-urlencoded olduğu için çoğu durumda e.postData.contents JSON değildir.
    // Yine de JSON gönderimi ihtimali varsa desteklemek için önce JSON parse deneriz.
    try {
      return JSON.parse(e.postData.contents);
    } catch (err) {
      // JSON değilse e.parameter'dan devam edeceğiz.
    }
  }
  if (e.parameter && typeof e.parameter === 'object') {
    return e.parameter;
  }
  throw new Error('Veri bulunamadı.');
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
