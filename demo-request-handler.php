<?php
// demo-request-handler.php - DikEra AI Demo Request Handler
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Security check
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['alert' => 'alert-danger', 'message' => 'Method not allowed']);
    exit;
}

// Validate required fields
$required_fields = ['name', 'email', 'sector'];
foreach ($required_fields as $field) {
    if (empty($_POST[$field])) {
        echo json_encode(['alert' => 'alert-danger', 'message' => 'Lütfen zorunlu alanları doldurun!']);
        exit;
    }
}

// Sanitize and validate input
$name = filter_var(trim($_POST['name']), FILTER_SANITIZE_SPECIAL_CHARS);
$email = filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL);
$company = isset($_POST['company']) ? filter_var(trim($_POST['company']), FILTER_SANITIZE_SPECIAL_CHARS) : '';
$phone = isset($_POST['phone']) ? filter_var(trim($_POST['phone']), FILTER_SANITIZE_SPECIAL_CHARS) : '';
$sector = filter_var(trim($_POST['sector']), FILTER_SANITIZE_SPECIAL_CHARS);
$message = isset($_POST['message']) ? filter_var(trim($_POST['message']), FILTER_SANITIZE_SPECIAL_CHARS) : '';

if (!$email) {
    echo json_encode(['alert' => 'alert-danger', 'message' => 'Lütfen geçerli bir e-posta adresi girin!']);
    exit;
}

// Configuration
$to_email = 'info@dikera.com';
$subject = 'Yeni Demo Talebi - DikEra AI';
$timestamp = date('d.m.Y H:i:s');
$request_id = 'DEM-' . date('Ymd') . '-' . substr(md5($email . time()), 0, 6);

// Get user info for tracking
$user_ip = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
$user_agent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';

// Format sector names for display
$sector_names = [
    'teknoloji' => 'Teknoloji',
    'finans' => 'Finans',
    'saglik' => 'Sağlık',
    'egitim' => 'Eğitim',
    'e-ticaret' => 'E-ticaret',
    'imalat' => 'İmalat',
    'hizmet' => 'Hizmet',
    'diger' => 'Diğer'
];
$sector_display = $sector_names[$sector] ?? $sector;

// Create HTML email content
$html_message = "
<!DOCTYPE html>
<html lang='tr'>
<head>
    <meta charset='UTF-8'>
    <title>Demo Talebi - DikEra AI</title>
</head>
<body style='font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f4f4f4;'>
    <div style='max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);'>
        <div style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;'>
            <h1 style='color: white; margin: 0; font-size: 24px;'>🚀 Yeni Demo Talebi</h1>
            <p style='color: rgba(255,255,255,0.9); margin: 10px 0 0 0;'>DikEra AI Platformu</p>
        </div>
        
        <div style='padding: 30px;'>
            <div style='background: #e8f4fd; border-left: 4px solid #667eea; padding: 20px; margin-bottom: 25px; border-radius: 5px;'>
                <h2 style='color: #333; margin: 0 0 10px 0;'>📧 Demo Talep Detayları</h2>
                <p style='color: #666; margin: 0; font-size: 14px;'>Talep ID: <strong>$request_id</strong></p>
            </div>
            
            <table style='width: 100%; border-collapse: collapse;'>
                <tr style='background: #f8f9fa;'>
                    <td style='padding: 15px; border: 1px solid #dee2e6; font-weight: bold; color: #495057; width: 30%;'>Ad Soyad</td>
                    <td style='padding: 15px; border: 1px solid #dee2e6; color: #212529;'>$name</td>
                </tr>
                <tr>
                    <td style='padding: 15px; border: 1px solid #dee2e6; font-weight: bold; color: #495057;'>E-posta</td>
                    <td style='padding: 15px; border: 1px solid #dee2e6; color: #212529;'><a href='mailto:$email' style='color: #667eea;'>$email</a></td>
                </tr>";

if (!empty($company)) {
    $html_message .= "
                <tr style='background: #f8f9fa;'>
                    <td style='padding: 15px; border: 1px solid #dee2e6; font-weight: bold; color: #495057;'>Şirket</td>
                    <td style='padding: 15px; border: 1px solid #dee2e6; color: #212529;'>$company</td>
                </tr>";
}

if (!empty($phone)) {
    $html_message .= "
                <tr>
                    <td style='padding: 15px; border: 1px solid #dee2e6; font-weight: bold; color: #495057;'>Telefon</td>
                    <td style='padding: 15px; border: 1px solid #dee2e6; color: #212529;'><a href='tel:$phone' style='color: #667eea;'>$phone</a></td>
                </tr>";
}

$html_message .= "
                <tr style='background: #f8f9fa;'>
                    <td style='padding: 15px; border: 1px solid #dee2e6; font-weight: bold; color: #495057;'>Sektör</td>
                    <td style='padding: 15px; border: 1px solid #dee2e6; color: #212529;'>$sector_display</td>
                </tr>";

if (!empty($message)) {
    $html_message .= "
                <tr>
                    <td style='padding: 15px; border: 1px solid #dee2e6; font-weight: bold; color: #495057; vertical-align: top;'>Mesaj</td>
                    <td style='padding: 15px; border: 1px solid #dee2e6; color: #212529;'>" . nl2br($message) . "</td>
                </tr>";
}

$html_message .= "
                <tr style='background: #f8f9fa;'>
                    <td style='padding: 15px; border: 1px solid #dee2e6; font-weight: bold; color: #495057;'>Tarih</td>
                    <td style='padding: 15px; border: 1px solid #dee2e6; color: #212529;'>$timestamp</td>
                </tr>
                <tr>
                    <td style='padding: 15px; border: 1px solid #dee2e6; font-weight: bold; color: #495057;'>IP Adresi</td>
                    <td style='padding: 15px; border: 1px solid #dee2e6; color: #212529;'>$user_ip</td>
                </tr>
            </table>
            
            <div style='background: #fff3cd; border-radius: 5px; padding: 20px; margin: 25px 0;'>
                <h3 style='color: #856404; margin: 0 0 10px 0;'>⚡ Aksiyon Gerekli</h3>
                <p style='color: #856404; margin: 0;'>Bu kullanıcı DikEra AI platformu için demo talebinde bulunmuştur. Lütfen 24 saat içinde kendisiyle iletişime geçin.</p>
            </div>
            
            <div style='text-align: center;'>
                <a href='mailto:$email?subject=DikEra%20AI%20Demo%20Hakkında&body=Merhaba%20$name,%0A%0ADikEra%20AI%20demo%20talebiniz%20için%20teşekkür%20ederiz.%0A%0ASize%20uygun%20bir%20demo%20randevusu%20ayarlamak%20için%20iletişime%20geçtik.%0A%0AEn%20kısa%20sürede%20size%20dönüş%20yapacağız.%0A%0ATeşekkürler,%0ADikEra%20AI%20Ekibi' 
                   style='background: #667eea; color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;'>
                    📧 Cevap Gönder
                </a>
            </div>
        </div>
        
        <div style='background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;'>
            <p style='color: #6c757d; margin: 0; font-size: 14px;'>Bu e-posta DikEra AI demo sistemi tarafından otomatik gönderildi.</p>
        </div>
    </div>
</body>
</html>";

// Email sending with multiple methods
$email_sent = false;
$error_message = '';

// Method 1: Try PHPMailer with Hostinger SMTP (RECOMMENDED)
if (class_exists('PHPMailer\\PHPMailer\\PHPMailer') || file_exists('PHPMailer/Exception.php')) {
    
    // Include PHPMailer files (adjust path as needed)
    if (file_exists('PHPMailer/Exception.php')) {
        require_once 'PHPMailer/Exception.php';
        require_once 'PHPMailer/PHPMailer.php';
        require_once 'PHPMailer/SMTP.php';
    } elseif (file_exists('phpmailer/Exception.php')) {
        require_once 'phpmailer/Exception.php';
        require_once 'phpmailer/PHPMailer.php';
        require_once 'phpmailer/SMTP.php';
    }

    try {
        $mail = new PHPMailer\PHPMailer\PHPMailer(true);
        
        // Server settings
        $mail->isSMTP();
        $mail->CharSet = 'UTF-8';
        $mail->Host = 'smtp.hostinger.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'info@dikera.com';
        $mail->Password = 'YOUR_EMAIL_PASSWORD'; // Replace with actual password
        $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 465;

        // Recipients
        $mail->setFrom('info@dikera.com', 'DikEra AI Demo Sistemi');
        $mail->addAddress($to_email, 'DikEra AI Demo Talepleri');
        $mail->addReplyTo($email, $name);

        // Content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $html_message;

        if ($mail->send()) {
            $email_sent = true;
        } else {
            $error_message = "SMTP Error: " . $mail->ErrorInfo;
        }
        
    } catch (Exception $e) {
        $error_message = "PHPMailer Exception: " . $e->getMessage();
    }
}

// Method 2: Fallback to PHP mail() function with optimized headers
if (!$email_sent) {
    $headers = array();
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-Type: text/html; charset=UTF-8';
    $headers[] = 'From: DikEra AI Demo <info@dikera.com>';
    $headers[] = 'Reply-To: ' . $name . ' <' . $email . '>';
    $headers[] = 'X-Mailer: PHP/' . phpversion();
    $headers[] = 'X-Priority: 1';
    $headers[] = 'Return-Path: info@dikera.com';
    
    // Additional parameters for Hostinger
    $additional_params = '-f info@dikera.com';
    
    if (mail($to_email, $subject, $html_message, implode("\r\n", $headers), $additional_params)) {
        $email_sent = true;
    } else {
        $error_message = "PHP mail() function failed";
    }
}

// Log the demo request (optional)
$log_entry = [
    'timestamp' => $timestamp,
    'request_id' => $request_id,
    'name' => $name,
    'email' => $email,
    'company' => $company,
    'phone' => $phone,
    'sector' => $sector,
    'message' => $message,
    'ip' => $user_ip,
    'user_agent' => $user_agent,
    'email_sent' => $email_sent,
    'error' => $error_message
];

// Save to log file (optional - create logs directory first)
if (is_dir('logs') || mkdir('logs', 0755, true)) {
    $log_file = 'logs/demo-requests-' . date('Y-m') . '.log';
    $log_line = json_encode($log_entry) . "\n";
    file_put_contents($log_file, $log_line, FILE_APPEND | LOCK_EX);
}

// Send response
if ($email_sent) {
    // Send auto-reply to user (optional)
    sendAutoReply($email, $name, $request_id);
    
    echo json_encode([
        'alert' => 'alert-success',
        'message' => 'Demo talebiniz başarıyla alındı! En kısa sürede size dönüş yapacağız.',
        'request_id' => $request_id
    ]);
} else {
    echo json_encode([
        'alert' => 'alert-danger',
        'message' => 'Demo talebiniz gönderilemedi. Lütfen tekrar deneyin veya doğrudan bizimle iletişime geçin.',
        'error' => $error_message
    ]);
}

// Function to send auto-reply to user
function sendAutoReply($user_email, $user_name, $request_id) {
    $auto_reply_subject = 'Demo Talebiniz Alındı - DikEra AI';
    
    $auto_reply_html = "
    <!DOCTYPE html>
    <html lang='tr'>
    <head>
        <meta charset='UTF-8'>
        <title>Demo Talebiniz Alındı</title>
    </head>
    <body style='font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f4f4f4;'>
        <div style='max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);'>
            <div style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;'>
                <h1 style='color: white; margin: 0; font-size: 24px;'>✅ Demo Talebiniz Alındı!</h1>
                <p style='color: rgba(255,255,255,0.9); margin: 10px 0 0 0;'>DikEra AI Ekibi</p>
            </div>
            
            <div style='padding: 30px;'>
                <h2 style='color: #333; margin: 0 0 20px 0;'>Merhaba " . $user_name . ",</h2>
                
                <p style='color: #666; line-height: 1.6; margin-bottom: 20px;'>
                    DikEra AI platformu için demo talebiniz başarıyla alınmıştır. Size en uygun demo deneyimini sunabilmek için ekibimiz en kısa sürede sizinle iletişime geçecektir.
                </p>
                
                <div style='background: #e8f4fd; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 5px;'>
                    <h3 style='color: #333; margin: 0 0 10px 0;'>📋 Talep Bilgileriniz</h3>
                    <p style='color: #666; margin: 0; font-size: 14px;'>
                        <strong>Talep ID:</strong> " . $request_id . "<br>
                        <strong>E-posta:</strong> " . $user_email . "<br>
                        <strong>Tarih:</strong> " . date('d.m.Y H:i:s') . "
                    </p>
                </div>
                
                <h3 style='color: #333; margin: 30px 0 15px 0;'>🚀 Demo Sürecinde Neler Olacak?</h3>
                <ul style='color: #666; line-height: 1.8; padding-left: 20px;'>
                    <li><strong>24 saat içinde</strong> uzmanlarımız sizinle iletişime geçecek</li>
                    <li><strong>İhtiyaç analizi</strong> yaparak size özel demo hazırlayacağız</li>
                    <li><strong>Canlı demo</strong> seansında platformun tüm özelliklerini göreceğiz</li>
                    <li><strong>Sorularınızı</strong> cevaplayacak ve size özel çözümler sunacağız</li>
                </ul>
                
                <div style='background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;'>
                    <h4 style='color: #333; margin: 0 0 10px 0;'>📞 Acil Durum İletişim</h4>
                    <p style='color: #666; margin: 0;'>
                        Acil sorularınız için: <a href='mailto:info@dikera.com' style='color: #667eea;'>info@dikera.com</a>
                    </p>
                </div>
                
                <p style='color: #666; line-height: 1.6; margin-top: 30px;'>
                    DikEra AI'ın gücünü keşfetmeye hazır olduğunuz için teşekkür ederiz. Birlikte harika işler başaracağız!
                </p>
                
                <div style='text-align: center; margin-top: 30px;'>
                    <p style='color: #333; font-weight: bold; margin: 0;'>DikEra AI Ekibi</p>
                    <p style='color: #666; margin: 5px 0 0 0; font-size: 14px;'>Yapay Zeka ile Geleceği Şekillendiriyoruz</p>
                </div>
            </div>
            
            <div style='background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;'>
                <p style='color: #6c757d; margin: 0; font-size: 12px;'>
                    Bu e-posta otomatik gönderilmiştir. Lütfen bu e-postaya yanıt vermeyin.<br>
                    © 2025 DikEra AI. Tüm hakları saklıdır.
                </p>
            </div>
        </div>
    </body>
    </html>";
    
    // Try to send auto-reply
    $auto_headers = array();
    $auto_headers[] = 'MIME-Version: 1.0';
    $auto_headers[] = 'Content-Type: text/html; charset=UTF-8';
    $auto_headers[] = 'From: DikEra AI <info@dikera.com>';
    $auto_headers[] = 'X-Mailer: PHP/' . phpversion();
    
    @mail($user_email, $auto_reply_subject, $auto_reply_html, implode("\r\n", $auto_headers), '-f info@dikera.com');
}

// Rate limiting function (optional)
function checkRateLimit($email, $ip) {
    $rate_limit_file = 'logs/rate-limits.json';
    $current_time = time();
    $rate_limits = [];
    
    // Load existing rate limits
    if (file_exists($rate_limit_file)) {
        $rate_limits = json_decode(file_get_contents($rate_limit_file), true) ?: [];
    }
    
    // Clean old entries (older than 1 hour)
    $rate_limits = array_filter($rate_limits, function($timestamp) use ($current_time) {
        return ($current_time - $timestamp) < 3600;
    });
    
    // Check email rate limit (max 3 requests per hour per email)
    $email_requests = array_filter($rate_limits, function($entry, $key) use ($email) {
        return strpos($key, 'email_' . $email) === 0;
    }, ARRAY_FILTER_USE_BOTH);
    
    if (count($email_requests) >= 3) {
        return false;
    }
    
    // Check IP rate limit (max 10 requests per hour per IP)
    $ip_requests = array_filter($rate_limits, function($entry, $key) use ($ip) {
        return strpos($key, 'ip_' . $ip) === 0;
    }, ARRAY_FILTER_USE_BOTH);
    
    if (count($ip_requests) >= 10) {
        return false;
    }
    
    // Add current request
    $rate_limits['email_' . $email . '_' . $current_time] = $current_time;
    $rate_limits['ip_' . $ip . '_' . $current_time] = $current_time;
    
    // Save rate limits
    if (is_dir('logs') || mkdir('logs', 0755, true)) {
        file_put_contents($rate_limit_file, json_encode($rate_limits), LOCK_EX);
    }
    
    return true;
}

?>