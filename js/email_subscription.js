document.addEventListener('DOMContentLoaded', function() {
    // Find the newsletter form in your existing HTML
    const forms = document.querySelectorAll('form[action*="subscribe-newsletter"]');
    
    forms.forEach(function(form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault(); // Prevent default form submission
            
            const emailInput = this.querySelector('input[type="email"]');
            const submitBtn = this.querySelector('button[type="submit"], .submit');
            const resultsDiv = this.querySelector('.form-results');
            
            if (!emailInput || !submitBtn) {
                console.error('Form elements not found');
                return;
            }
            
            const email = emailInput.value.trim();
            
            // Validate email
            if (!email) {
                showFormMessage(resultsDiv, 'Lütfen e-posta adresinizi girin!', 'alert-danger');
                return;
            }
            
            if (!isValidEmail(email)) {
                showFormMessage(resultsDiv, 'Lütfen geçerli bir e-posta adresi girin!', 'alert-danger');
                return;
            }
            
            // Show loading state
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Gönderiliyor...';
            
            try {
                // Send the request to your PHP script
                const formData = new FormData();
                formData.append('email', email);
                
                const response = await fetch('email-templates/subscribe-newsletter.php', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                
                // Parse response
                let result;
                const contentType = response.headers.get('content-type');
                
                if (contentType && contentType.includes('application/json')) {
                    result = await response.json();
                } else {
                    // Fallback for non-JSON responses
                    const text = await response.text();
                    console.log('Server response:', text);
                    
                    if (response.ok) {
                        result = {
                            alert: 'alert-success',
                            message: 'Demo talebiniz başarıyla gönderildi! En kısa sürede size dönüş yapacağız.'
                        };
                    } else {
                        throw new Error('Server error: ' + response.status);
                    }
                }
                
                // Show result message
                showFormMessage(resultsDiv, result.message, result.alert);
                
                // Clear form if successful
                if (result.alert === 'alert-success') {
                    emailInput.value = '';
                    
                    // Optional: Show additional success actions
                    setTimeout(() => {
                        showFormMessage(resultsDiv, 
                            'E-posta adresinize onay mesajı gönderildi. Spam klasörünü kontrol etmeyi unutmayın!', 
                            'alert-info');
                    }, 3000);
                }
                
            } catch (error) {
                console.error('Demo request error:', error);
                
                // Show user-friendly error message
                showFormMessage(resultsDiv, 
                    'Bağlantı hatası oluştu. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.', 
                    'alert-danger');
                
                // Optional: Log error for debugging
                logError({
                    error: error.message,
                    email: email,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent
                });
                
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
            }
        });
    });
});

// Helper function to validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Helper function to show form messages
function showFormMessage(resultsDiv, message, alertType) {
    if (!resultsDiv) {
        // Create a temporary message if no results div exists
        const tempDiv = document.createElement('div');
        tempDiv.style.cssText = `
            position: fixed; 
            top: 20px; 
            right: 20px; 
            z-index: 9999; 
            padding: 15px 20px; 
            border-radius: 5px; 
            color: white;
            font-weight: bold;
            max-width: 300px;
            ${alertType === 'alert-success' ? 'background: #28a745;' : 'background: #dc3545;'}
        `;
        tempDiv.textContent = message;
        document.body.appendChild(tempDiv);
        
        setTimeout(() => {
            document.body.removeChild(tempDiv);
        }, 5000);
        
        return;
    }
    
    // Show message in the existing results div
    resultsDiv.className = `form-results border-radius-100px mt-15px p-15px fs-15 w-100 text-center ${alertType}`;
    resultsDiv.textContent = message;
    resultsDiv.classList.remove('d-none');
    
    // Auto-hide after 8 seconds
    setTimeout(() => {
        resultsDiv.classList.add('d-none');
    }, 8000);
    
    // Scroll message into view if needed
    resultsDiv.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
    });
}

// Optional: Error logging function
function logError(errorData) {
    // You can send errors to your server for debugging
    fetch('email-templates/log-error.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorData)
    }).catch(err => {
        console.log('Error logging failed:', err);
    });
}

// Optional: Add visual feedback for better UX
document.addEventListener('DOMContentLoaded', function() {
    // Add focus effects to email inputs
    const emailInputs = document.querySelectorAll('input[type="email"]');
    
    emailInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        input.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
        });
        
        // Real-time email validation
        input.addEventListener('input', function() {
            const email = this.value.trim();
            if (email && !isValidEmail(email)) {
                this.style.borderColor = '#dc3545';
                this.style.boxShadow = '0 0 0 0.2rem rgba(220, 53, 69, 0.25)';
            } else {
                this.style.borderColor = '';
                this.style.boxShadow = '';
            }
        });
    });
});

// Add CSS for better visual feedback
const style = document.createElement('style');
style.textContent = `
    .form-results.alert-success {
        background-color: #d4edda !important;
        color: #155724 !important;
        border: 1px solid #c3e6cb !important;
    }
    
    .form-results.alert-danger {
        background-color: #f8d7da !important;
        color: #721c24 !important;
        border: 1px solid #f5c6cb !important;
    }
    
    .form-results.alert-info {
        background-color: #cce7ff !important;
        color: #004085 !important;
        border: 1px solid #99d3ff !important;
    }
    
    /* Loading animation for submit buttons */
    .fa-spinner {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    /* Smooth transitions for form elements */
    input[type="email"] {
        transition: all 0.3s ease !important;
    }
    
    button[type="submit"] {
        transition: all 0.3s ease !important;
    }
    
    button[type="submit"]:disabled {
        opacity: 0.7 !important;
        cursor: not-allowed !important;
    }
`;
document.head.appendChild(style);