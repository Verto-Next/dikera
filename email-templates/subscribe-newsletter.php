<?php
// hostinger-email-sender.php - Optimized for Hostinger hosting
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$mail->Host = 'smtp.hostinger.com';
$mail->Username = 'info@legasis.ai';  // Your actual email
$mail->Password = 'Vn21022025!';  // Your email password

// Security check
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['alert' => 'alert-danger', 'message' => 'Method not allowed']);
    exit;
}

// Validate email input
if (empty($_POST['email'])) {
    echo json_encode(['alert' => 'alert-danger', 'message' => 'Lütfen e-posta adresinizi girin!']);
    exit;
}

$email = filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL);
if (!$email) {
    echo json_encode(['alert' => 'alert-danger', 'message' => 'Lütfen geçerli bir e-posta adresi girin!']);
    exit;
}

// Configuration
$to_email = 'info@legasis.ai';
$subject = 'Yeni Demo Talebi - Legasis AI';
$timestamp = date('d.m.Y H:i:s');
$request_id = 'DEM-' . date('Ymd') . '-' . substr(md5($email . time()), 0, 6);

// Get user info
$user_ip = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
$user_agent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';

// Email content
$html_message = "
<!DOCTYPE html>
<html lang='tr'>
<head>
    <meta charset='UTF-8'>
    <title>Demo Talebi</title>
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
                    <td style='padding: 15px; border: 1px solid #dee2e6; font-weight: bold; color: #495057;'>E-posta Adresi</td>
                    <td style='padding: 15px; border: 1px solid #dee2e6; color: #212529;'><a href='mailto:$email' style='color: #667eea;'>$email</a></td>
                </tr>
                <tr>
                    <td style='padding: 15px; border: 1px solid #dee2e6; font-weight: bold; color: #495057;'>Tarih & Saat</td>
                    <td style='padding: 15px; border: 1px solid #dee2e6; color: #212529;'>$timestamp</td>
                </tr>
                <tr style='background: #f8f9fa;'>
                    <td style='padding: 15px; border: 1px solid #dee2e6; font-weight: bold; color: #495057;'>IP Adresi</td>
                    <td style='padding: 15px; border: 1px solid #dee2e6; color: #212529;'>$user_ip</td>
                </tr>
            </table>
            
            <div style='background: #fff3cd; border-radius: 5px; padding: 20px; margin: 25px 0;'>
                <h3 style='color: #856404; margin: 0 0 10px 0;'>⚡ Aksiyon Gerekli</h3>
                <p style='color: #856404; margin: 0;'>Bu kullanıcı DikEra AI platformu için demo talebinde bulunmuştur. Lütfen 24 saat içinde kendisiyle iletişime geçin.</p>
            </div>
            
            <div style='text-align: center;'>
                <a href='mailto:$email?subject=DikEra%20AI%20Demo%20Hakkında&body=Merhaba,%0A%0ADikEra%20AI%20demo%20talebiniz%20için%20teşekkür%20ederiz.' 
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

// Method 1: Try Hostinger SMTP with PHPMailer (RECOMMENDED)
$email_sent = false;
$error_message = '';

// Check if PHPMailer is available
if (file_exists('phpmailer/PHPMailer.php')) {
    require_once 'phpmailer/Exception.php';
    require_once 'phpmailer/PHPMailer.php';
    require_once 'phpmailer/SMTP.php';

    try {
        $mail = new PHPMailer\PHPMailer\PHPMailer();
        $mail->isSMTP();
        $mail->CharSet = 'UTF-8';
        
        // Hostinger SMTP settings
        $mail->Host = 'smtp.hostinger.com';  // Hostinger SMTP server
        $mail->SMTPAuth = true;
        $mail->Username = 'info@legasis.ai';  // Your Hostinger email
        $mail->Password = 'your-email-password';  // Your email password
        $mail->SMTPSecure = 'tls';  // TLS encryption
        $mail->Port = 587;  // TLS port

        // Email settings
        $mail->setFrom('info@legasis.ai', 'Legasis AI Demo Sistemi');
        $mail->addAddress($to_email, 'Legasis AI Demo Talepleri');
        $mail->addReplyTo($email);
        
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $html_message;

        if ($mail->send()) {
            $email_sent = true;
        } else {
            $error_message = "SMTP Error: " . $mail->ErrorInfo;
        }
    } catch (Exception $e) {
        $error_message = "Exception: " . $e->getMessage();
    }
}

// Method 2: Fallback to PHP mail() with proper headers for Hostinger
if (!$email_sent) {
    // Hostinger-optimized headers
    $headers = array();
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-Type: text/html; charset=UTF-8';
    $headers[] = 'From: Legasis AI <info@legasis.ai>';
    $headers[] = 'Reply-To: ' . $email;
    $headers[] = 'Return-Path: info@legasis.ai';
    $headers[] = 'X-Mailer: Legasis AI v1.0';
    $headers[] = 'X-Priority: 2';
    
    // Use \r\n for Hostinger (important for deliverability)
    $header_string = implode("\r\n", $headers);
    
    if (mail($to_email, $subject, $html_message, $header_string)) {
        $email_sent = true;
    } else {
        $last_error = error_get_last();
        $error_message .= "PHP mail() failed. Error: " . ($last_error['message'] ?? 'Unknown error');
    }
}

// Log the request
$log_data = [
    'timestamp' => $timestamp,
    'request_id' => $request_id,
    'email' => $email,
    'ip' => $user_ip,
    'email_sent' => $email_sent,
    'method' => $email_sent ? (file_exists('phpmailer/PHPMailer.php') ? 'SMTP' : 'PHP_MAIL') : 'FAILED',
    'error' => $error_message
];

@file_put_contents('demo_requests.log', json_encode($log_data) . "\n", FILE_APPEND | LOCK_EX);

// Response
if ($email_sent) {
    // Send confirmation to user
    $user_subject = "Demo Talebiniz Alındı - DikEra AI";
    $user_message = "
    <div style='font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; background: white; border-radius: 10px;'>
        <h1 style='color: #667eea; text-align: center;'>✅ Demo Talebiniz Alındı!</h1>
        <p>Merhaba,</p>
        <p>DikEra AI platformu için demo talebiniz başarıyla alınmıştır.</p>
        <div style='background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;'>
            <p style='margin: 0; color: #666;'><strong>Talep ID:</strong> $request_id<br><strong>Tarih:</strong> $timestamp</p>
        </div>
        <p>Ekibimiz en kısa sürede sizinle iletişime geçecektir.</p>
        <p>Teşekkürler,<br><strong>DikEra AI Ekibi</strong></p>
    </div>";
    
    $user_headers = "From: Legasis AI <info@legasis.ai>\r\nContent-Type: text/html; charset=UTF-8\r\n";
    @mail($email, $user_subject, $user_message, $user_headers);
    
    echo json_encode([
        'alert' => 'alert-success',
        'message' => 'Demo talebiniz başarıyla gönderildi! En kısa sürede size dönüş yapacağız.',
        'request_id' => $request_id
    ]);
} else {
    echo json_encode([
        'alert' => 'alert-danger',
        'message' => 'E-posta gönderilirken hata oluştu. Lütfen doğrudan info@legasis.ai adresine yazın.',
        'request_id' => $request_id,
        'error' => $error_message
    ]);
}
?>