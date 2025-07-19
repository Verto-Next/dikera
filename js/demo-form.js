document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('enhancedDemoForm');
    const submitBtn = document.getElementById('enhancedSubmitBtn');
    const resultsDiv = document.getElementById('enhancedFormResults');

    if (!form || !submitBtn || !resultsDiv) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const sector = formData.get('sector');

        // Validate required fields
        if (!name || !email || !sector) {
            showFormMessage('Lütfen zorunlu alanları doldurun.', 'alert-danger');
            return;
        }

        // Validate email
        if (!isValidEmail(email)) {
            showFormMessage('Lütfen geçerli bir e-posta adresi girin.', 'alert-danger');
            return;
        }

        // Show loading state
        setButtonLoading(true);

        try {
            const response = await fetch('demo-request-handler.php', {
                method: 'POST',
                body: formData
            });

            let result;
            try {
                result = await response.json();
            } catch (jsonError) {
                if (response.ok) {
                    result = {
                        alert: 'alert-success',
                        message: 'Demo talebiniz başarıyla alındı! En kısa sürede size dönüş yapacağız.'
                    };
                } else {
                    throw new Error('Server error: ' + response.status);
                }
            }

            // Show result
            showFormMessage(result.message, result.alert);

            // Clear form if successful
            if (result.alert === 'alert-success') {
                form.reset();
                
                // Show additional success message after delay
                setTimeout(() => {
                    showFormMessage(
                        'Demo talebiniz sistem yöneticilerimize iletildi. 24 saat içinde sizinle iletişime geçeceğiz.',
                        'alert-info'
                    );
                }, 3000);
            }

        } catch (error) {
            console.error('Demo request error:', error);
            showFormMessage(
                'Bağlantı hatası oluştu. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.',
                'alert-danger'
            );
        } finally {
            setButtonLoading(false);
        }
    });

    // Real-time email validation
    const emailInput = document.getElementById('demo_email');
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            const email = this.value.trim();
            if (email && !isValidEmail(email)) {
                this.style.borderColor = '#dc3545';
                this.style.boxShadow = '0 0 0 0.2rem rgba(220, 53, 69, 0.25)';
            } else {
                this.style.borderColor = '';
                this.style.boxShadow = '';
            }
        });
    }

    // Form input focus effects
    const formInputs = form.querySelectorAll('.form-control');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.transform = 'translateY(-1px)';
        });
        
        input.addEventListener('blur', function() {
            if (!this.matches(':focus')) {
                this.style.transform = 'translateY(0)';
            }
        });
    });

    function setButtonLoading(loading) {
        const btnText = submitBtn.querySelector('.btn-text');
        const btnIcon = submitBtn.querySelector('.btn-icon');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        if (loading) {
            submitBtn.disabled = true;
            btnText.classList.add('d-none');
            btnIcon.classList.add('d-none');
            btnLoading.classList.remove('d-none');
        } else {
            submitBtn.disabled = false;
            btnText.classList.remove('d-none');
            btnIcon.classList.remove('d-none');
            btnLoading.classList.add('d-none');
        }
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showFormMessage(message, alertType) {
        resultsDiv.className = `form-results mt-15px p-15px text-center border-radius-8px ${alertType}`;
        resultsDiv.textContent = message;
        resultsDiv.classList.remove('d-none');

        // Auto-hide after 8 seconds
        setTimeout(() => {
            resultsDiv.classList.add('d-none');
        }, 8000);

        // Scroll to message
        resultsDiv.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }
});