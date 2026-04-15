/**
 * DikEra AI Chatbot - Soru & Cevap Veritabanı
 * 
 * Bu dosyayı düzenleyerek chatbot'un cevaplarını güncelleyebilirsiniz.
 * 
 * Yapı:
 *   - responses: Sabit konu başlıklarına göre cevaplar (quick reply butonlarıyla eşleşir)
 *   - keywords:  Kullanıcının serbest yazdığı mesajlardaki anahtar kelimelerle eşleşen kurallar
 *   - welcome:   Chatbot açıldığında gösterilen ilk mesaj
 * 
 * Her cevap objesi:
 *   text         : string   — Chatbot'un göstereceği metin (\n satır sonu, **kalın** desteklenir)
 *   quickReplies : string[] — Mesajın altında gösterilecek hızlı yanıt butonları
 */

window.DIKERA_CHATBOT_DATA = {

    welcome: {
        text: 'Merhaba! 👋 DikEra AI Hukuk Asistanına hoş geldiniz.\nSize nasıl yardımcı olabilirim?',
        quickReplies: ['Platform Nasıl Çalışır?', 'Modüller Neler?', 'Güvenlik', 'Demo Talep Et', 'İletişim']
    },

    responses: {

        'Platform Nasıl Çalışır?': {
            text: 'DikEra AI platformu şu şekilde çalışır:\n\n1. 📁 Dokümanlarınızı güvenle yükleyin\n2. 🔍 Yapay zeka ile analiz edin\n3. ⚖️ Emsal karar ve mevzuat araştırın\n4. 📝 Sözleşme ve dilekçe oluşturun\n\nTüm verileriniz Türkiye\'deki sunucularda, KVKK uyumlu altyapıda saklanır.',
            quickReplies: ['Modüller Neler?', 'Güvenlik', 'Demo Talep Et']
        },

        'Modüller Neler?': {
            text: 'DikEra AI\'da 5 temel modül bulunur:\n\n📂 **Davalarım** — Dava dosyalarını yükleyin, soru sorun, özetleyin\n⚖️ **Emsal Karar Arama** — 10M+ içtihatta doğal dilde arama\n📜 **Mevzuat Arama** — Güncel mevzuata madde bazlı erişim\n📝 **Sözleşme Oluşturma** — 35+ şablonla hızlı üretim ve karşılaştırma\n✍️ **Dilekçe Oluşturma** — Profesyonel dilekçe taslakları\n\nHer modül hakkında detaylı bilgi almak ister misiniz?',
            quickReplies: ['Platform Nasıl Çalışır?', 'Güvenlik', 'Demo Talep Et']
        },

        'Güvenlik': {
            text: 'Güvenlik altyapımız:\n\n🔐 **Şifreleme**: Uçtan uca veri şifreleme\n🏢 **Veri İzolasyonu**: Her firma için ayrı güvenli alan\n🇹🇷 **Veri Merkezi**: %100 Türkiye lokasyonlu sunucular\n🛡️ **Uyumluluk**: KVKK ve GDPR uyumlu mimari\n📋 **Denetlenebilirlik**: Tam şeffaf ve kayıtlı işlem geçmişi\n\nVerileriniz asla yurt dışına çıkmaz, model eğitiminde kullanılmaz.',
            quickReplies: ['KVKK Uyumluluğu', 'Platform Nasıl Çalışır?', 'Demo Talep Et']
        },

        'KVKK Uyumluluğu': {
            text: 'KVKK uyumluluk detayları:\n\n✅ Veriler %100 Türkiye\'deki sunucularda saklanır\n✅ 3. şahıs veri aktarım onayı gerekmez\n✅ Kullanıcı verileri model eğitiminde asla kullanılmaz\n✅ Rol bazlı erişim kontrolü (RBAC) ile yetki yönetimi\n✅ Tam denetlenebilir işlem kayıtları\n\nDetaylı bilgi için KVKK Aydınlatma Metnimizi inceleyebilirsiniz.',
            quickReplies: ['Güvenlik', 'Demo Talep Et', 'İletişim']
        },

        'Demo Talep Et': {
            text: 'Demo talebiniz için teşekkürler!\n\nDemo sürecimiz:\n1. ✅ Sayfamızdaki talep formunu doldurun\n2. 📞 Ekibimiz 24 saat içinde sizi arar\n3. 💻 Size özel kişiselleştirilmiş demo sunar\n4. 🚀 Hemen kullanmaya başlarsınız\n\nAşağıdaki "Demo Formunu Aç" butonuna tıklayarak hemen başlayabilirsiniz.',
            quickReplies: ['Demo Formunu Aç', 'Modüller Neler?', 'İletişim']
        },

        'Demo Formunu Aç': {
            text: 'Demo talep formunu açıyorum...',
            quickReplies: ['Platform Nasıl Çalışır?', 'Modüller Neler?', 'İletişim'],
            action: 'openDemoForm'
        },

        'İletişim': {
            text: 'İletişim bilgilerimiz:\n\n📧 **E-posta**: info@dikera.com\n🌐 **Web**: www.dikera.com\n📍 **Adres**: İstanbul, Türkiye\n\nDemo talep formunu doldurarak da bizimle iletişime geçebilirsiniz.',
            quickReplies: ['Demo Talep Et', 'Platform Nasıl Çalışır?', 'Modüller Neler?']
        },

        'Desteklenen Dosya Türleri': {
            text: 'Desteklenen dosya türleri:\n\n📄 **Metin**: PDF, DOC, DOCX, TXT\n🖼️ **Görseller**: JPG, PNG (OCR ile tarama)\n\n📌 Tek seferde en fazla 10 dosya yükleyebilirsiniz.\n📌 Her dosya maksimum 16 MB olmalıdır.\n\nTüm dosyalar güvenli bir şekilde işlenir ve analiz edilir.',
            quickReplies: ['Modüller Neler?', 'Güvenlik', 'Demo Talep Et']
        }
    },

    keywords: [
        {
            patterns: ['merhaba', 'selam', 'hey', 'meraba', 'selamlar'],
            text: 'Merhaba! 👋 DikEra AI\'ya hoş geldiniz! Size nasıl yardımcı olabilirim?',
            quickReplies: ['Platform Nasıl Çalışır?', 'Modüller Neler?', 'Demo Talep Et']
        },
        {
            patterns: ['teşekkür', 'sağol', 'thanks', 'eyvallah'],
            text: 'Rica ederim! 😊 Başka sorularınız varsa her zaman buradayım.',
            quickReplies: ['Platform Nasıl Çalışır?', 'Modüller Neler?', 'İletişim']
        },
        {
            patterns: ['nasıl çalış', 'nasıl kullan', 'ne işe yarar', 'nedir', 'ne yapar'],
            response: 'Platform Nasıl Çalışır?'
        },
        {
            patterns: ['demo', 'deneme', 'dene', 'test', 'göster'],
            response: 'Demo Talep Et'
        },
        {
            patterns: ['güvenlik', 'güvenli', 'şifre', 'koruma', 'veri güvenliği'],
            response: 'Güvenlik'
        },
        {
            patterns: ['kvkk', 'gdpr', 'kişisel veri', 'gizlilik', 'uyumluluk'],
            response: 'KVKK Uyumluluğu'
        },
        {
            patterns: ['dosya', 'belge', 'format', 'boyut', 'yükle', 'pdf', 'doc'],
            response: 'Desteklenen Dosya Türleri'
        },
        {
            patterns: ['modül', 'özellik', 'fonksiyon', 'ne yapabilir'],
            response: 'Modüller Neler?'
        },
        {
            patterns: ['iletişim', 'telefon', 'mail', 'adres', 'contact', 'ulaş'],
            response: 'İletişim'
        },
        {
            patterns: ['emsal', 'içtihat', 'karar arama', 'yargıtay'],
            text: 'Emsal Karar Arama modülümüz ile 10 milyondan fazla yargı kararı arasında doğal dilde arama yapabilirsiniz.\n\nKonunuzu yazmanız yeterli — ilgili kararlar yapay zeka tarafından sıralanır ve özetlenir.',
            quickReplies: ['Modüller Neler?', 'Mevzuat Arama', 'Demo Talep Et']
        },
        {
            patterns: ['mevzuat', 'kanun', 'madde', 'yönetmelik', 'tüzük'],
            text: 'Mevzuat Arama modülümüz ile güncel kanun, yönetmelik ve tüzükler arasında konu bazlı arama yapabilirsiniz.\n\nİlgili maddelere ve bağlantılı düzenlemelere hızlıca erişin.',
            quickReplies: ['Modüller Neler?', 'Emsal Karar Arama', 'Demo Talep Et']
        },
        {
            patterns: ['sözleşme', 'kontrat', 'şablon'],
            text: 'Sözleşme Oluşturma modülümüzde 35\'ten fazla hazır şablon bulunur.\n\nYeni sözleşmeler üretin, mevcut sözleşmeleri karşılaştırın ve risk analizi yapın.',
            quickReplies: ['Modüller Neler?', 'Dilekçe Oluşturma', 'Demo Talep Et']
        },
        {
            patterns: ['dilekçe', 'başvuru', 'talep yazısı'],
            text: 'Dilekçe Oluşturma modülü ile talebinizi konuşma dilinde belirtin; yapay zeka profesyonel ve yapılandırılmış bir taslak oluşturur.',
            quickReplies: ['Modüller Neler?', 'Sözleşme Oluşturma', 'Demo Talep Et']
        }
    ],

    defaultResponse: {
        text: 'Bu konuda henüz detaylı bilgi veremiyorum, ancak aşağıdaki konular hakkında size yardımcı olabilirim:',
        quickReplies: ['Platform Nasıl Çalışır?', 'Modüller Neler?', 'Güvenlik', 'Demo Talep Et', 'İletişim']
    }
};
