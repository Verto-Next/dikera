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
    var sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName('Dikera_Website_Demo_Leads');

    if (!sheet) {
      return jsonResponse({ status: 'error', message: 'Sheet "Dikera_Website_Demo_Leads" bulunamadı.' });
    }

    var data = getPayload(e);

    var personalDomains = [
      'gmail.com', 'hotmail.com', 'outlook.com',
      'yahoo.com', 'icloud.com'
    ];

    var email = (data.email || '').toString().trim();
    var domain = email.indexOf('@') !== -1 ? email.split('@')[1] : '';
    var emailType = personalDomains.indexOf(domain) !== -1 ? 'Bireysel' : 'Kurumsal';

    var segment = '';
    if (data.kurulus_tipi === 'Hukuk Bürosu') {
      segment = 'LAW_' + (data.avukat_sayisi || 'Unknown');
    } else if (data.kurulus_tipi === 'Kurumsal Şirket') {
      segment = 'CORP_' + (data.calisan_sayisi || 'Unknown');
    } else if (data.kurulus_tipi === 'Kamu') {
      segment = 'PUBLIC';
    }

    var kvkkOk = data.kvkk === true || data.kvkk === 'true' || data.kvkk === 'on' || data.kvkk === '1';

    var row = [
      new Date(),
      (data.ad || '').toString().trim(),
      (data.soyad || '').toString().trim(),
      email,
      emailType,
      (data.telefon || '').toString().trim(),
      (data.sirket_adi || '').toString().trim(),
      (data.kurulus_tipi || '').toString().trim(),
      (data.avukat_sayisi || '').toString().trim(),
      (data.calisan_sayisi || '').toString().trim(),
      (data.hukuki_surec_yonetimi || '').toString().trim(),
      (data.gorev || '').toString().trim().substring(0, 500),
      (data.problem || '').toString().trim().substring(0, 500),
      kvkkOk ? 'Onaylandı' : 'Onay Yok',
      (data.sourceUrl || '').toString().trim().substring(0, 500),
      'Pending',
      segment
    ];

    sheet.appendRow(row);

    return jsonResponse({ status: 'success' });
  } catch (err) {
    return jsonResponse({
      status: 'error',
      message: err.message || 'Beklenmeyen hata.'
    });
  }
}

function getPayload(e) {
  if (e.postData && e.postData.contents) {
    return JSON.parse(e.postData.contents);
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
