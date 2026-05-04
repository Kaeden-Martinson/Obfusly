// ============================================================================
// OBFUSLY - JavaScript Obfuscation App
// Main application logic with API integration
// ============================================================================

let inputEditor, outputEditor;

// ── Auth state ─────────────────────────────────────────────────────────────
let currentUser = null;
let verificationEmail = null;
let verificationCodeExpiry = 5; // minutes (300 seconds)

function getToken() { return localStorage.getItem('obfusly_token'); }
function setToken(t) { localStorage.setItem('obfusly_token', t); }
function clearToken() { localStorage.removeItem('obfusly_token'); }

// ── Rate Limiting for Obfuscations ─────────────────────────────────────────
const OBFUSCATION_LIMITS = {
    free: 3,
    professional: 50,
    enterprise: 500
};

// ── File Size Limits (in bytes) ────────────────────────────────────────────
const FILE_SIZE_LIMITS = {
    free: 500 * 1024,        // 50KB
    professional: 5 * 1024 * 1024, // 5MB
    enterprise: 10 * 1024 * 1024           // 10MB
};

function getUserPlan() {
    return currentUser?.plan || 'free';
}

function getTodayObfuscationCount() {
    const key = 'obfuscationStats_' + new Date().toDateString();
    const stored = localStorage.getItem(key);
    
    if (!stored) {
        return { count: 0, resetTime: getNextResetTime() };
    }
    
    return JSON.parse(stored);
}

function incrementObfuscationCount() {
    const key = 'obfuscationStats_' + new Date().toDateString();
    const current = getTodayObfuscationCount();
    const updated = { 
        count: current.count + 1, 
        resetTime: getNextResetTime() 
    };
    
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
}

function checkObfuscationLimit() {
    const plan = getUserPlan();
    const limit = OBFUSCATION_LIMITS[plan];
    const current = getTodayObfuscationCount();
    
    const canObfuscate = current.count < limit;
    const remaining = Math.max(0, limit - current.count);
    
    return {
        canObfuscate,
        remaining,
        limit,
        plan,
        used: current.count,
        message: canObfuscate 
            ? `You have ${remaining} obfuscations remaining today`
            : `Daily limit reached. ${plan === 'free' ? 'Upgrade to continue.' : 'Please try again tomorrow.'}`
    };
}

function getNextResetTime() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.toISOString();
}

function updateNavAuth() {
    const loginBtn    = document.getElementById('nav-login-btn');
    const registerBtn = document.getElementById('nav-register-btn');
    const accountBtn  = document.getElementById('nav-account-btn');
    const logoutBtn   = document.getElementById('nav-logout-btn');
    
    const mobileLoginBtn    = document.getElementById('mobile-nav-login-btn');
    const mobileRegisterBtn = document.getElementById('mobile-nav-register-btn');
    const mobileAccountBtn  = document.getElementById('mobile-nav-account-btn');
    const mobileLogoutBtn   = document.getElementById('mobile-nav-logout-btn');

    if (currentUser) {
        loginBtn.style.display    = 'none';
        registerBtn.style.display = 'none';
        accountBtn.style.display  = 'inline-block';
        logoutBtn.style.display   = 'inline-block';
        accountBtn.textContent    = currentUser.name.split(' ')[0];
        
        mobileLoginBtn.style.display    = 'none';
        mobileRegisterBtn.style.display = 'none';
        mobileAccountBtn.style.display  = 'block';
        mobileLogoutBtn.style.display   = 'block';
        mobileAccountBtn.textContent    = currentUser.name.split(' ')[0];
    } else {
        loginBtn.style.display    = 'inline-block';
        registerBtn.style.display = 'inline-block';
        accountBtn.style.display  = 'none';
        logoutBtn.style.display   = 'none';
        
        mobileLoginBtn.style.display    = 'block';
        mobileRegisterBtn.style.display = 'block';
        mobileAccountBtn.style.display  = 'none';
        mobileLogoutBtn.style.display   = 'none';
    }
}

function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobile-nav-menu');
    const toggle = document.getElementById('mobile-menu-toggle');
    const body = document.body;
    
    if (mobileNav.classList.contains('active')) {
        mobileNav.classList.remove('active');
        toggle.classList.remove('active');
        body.classList.remove('mobile-menu-open');
    } else {
        mobileNav.classList.add('active');
        toggle.classList.add('active');
        body.classList.add('mobile-menu-open');
        
        // Add backdrop click handler to close menu
        setTimeout(() => {
            document.addEventListener('click', closeMobileMenuOnBackdropClick, { once: true });
        }, 100);
    }
}

function closeMobileMenuOnBackdropClick(e) {
    const mobileNav = document.getElementById('mobile-nav-menu');
    const toggle = document.getElementById('mobile-menu-toggle');
    
    // Check if click is on backdrop (outside menu and toggle) or if menu is not active
    if (!mobileNav.classList.contains('active')) return;
    
    // If clicking on menu items, nav area, or toggle button, don't close
    if (mobileNav.contains(e.target) || toggle.contains(e.target)) {
        // Re-add listener for next backdrop click
        document.addEventListener('click', closeMobileMenuOnBackdropClick, { once: true });
        return;
    }
    
    // Close the menu
    toggleMobileMenu();
}

function updateProfilePage() {
    if (!currentUser) return;
    
    // Use server-side usage data
    const usage = currentUser.usage || { remaining: 0, limit: 0, used: 0, plan: 'free' };
    const resetTime = new Date();
    resetTime.setUTCHours(24, 0, 0, 0);
    const resetHour = resetTime.getUTCHours() === 0 ? 12 : (resetTime.getUTCHours() > 12 ? resetTime.getUTCHours() - 12 : resetTime.getUTCHours());
    const resetAMPM = resetTime.getUTCHours() >= 12 ? 'PM' : 'AM';
    
    // Update user info
    document.getElementById('profileUserName').textContent = currentUser.name;
    document.getElementById('profileUserEmail').textContent = currentUser.email;
    document.getElementById('profilePlan').textContent = (currentUser.plan || 'Free').charAt(0).toUpperCase() + (currentUser.plan || 'free').slice(1);
    
    // Member since date
    const memberDate = new Date(currentUser.createdAt || new Date());
    document.getElementById('profileMemberSince').textContent = memberDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    // Update obfuscation stats (from server)
    document.getElementById('profileRemaining').textContent = usage.remaining;
    document.getElementById('profileLimit').textContent = usage.limit === Infinity ? '∞' : usage.limit;
    
    const percentage = usage.limit === Infinity ? 0 : (usage.used / usage.limit) * 100;
    document.getElementById('profileUsedPercent').textContent = Math.round(percentage) + '%';
    document.getElementById('profileProgressBar').style.width = percentage + '%';
    
    // Reset time
    document.getElementById('profileResetTime').textContent = resetHour + ':00 ' + resetAMPM;
    
    // Highlight current plan in the "Daily Limits by Plan" section
    const userPlan = (currentUser.plan || 'free').toLowerCase();
    const planBoxes = ['free', 'professional', 'enterprise'];
    
    planBoxes.forEach(plan => {
        const planBox = document.getElementById('planBox-' + plan);
        if (planBox) {
            if (plan === userPlan) {
                // Highlight current plan
                planBox.style.background = 'rgba(46, 107, 255, 0.2)';
                planBox.style.border = '2px solid var(--accent-primary)';
                planBox.style.boxShadow = '0 0 12px rgba(46, 107, 255, 0.3)';
            } else {
                // Gray out other plans
                planBox.style.background = 'rgba(100, 100, 100, 0.1)';
                planBox.style.border = '1px solid rgba(100, 100, 100, 0.2)';
                planBox.style.opacity = '0.6';
            }
        }
    });
    
    // Show subscription status section only for paid plans
    const subSection = document.getElementById('subscriptionStatusSection');
    const upgradeBtn = document.getElementById('upgradeBtn');
    
    if (currentUser.plan && currentUser.plan !== 'free') {
        // Show subscription section for paid plans
        subSection.style.display = 'block';
        upgradeBtn.textContent = 'Change Plan';
        
        // Update subscription details with proper capitalization
        const subStatus = (currentUser.subscriptionStatus || 'active').toLowerCase();
        const capitalizedStatus = subStatus.charAt(0).toUpperCase() + subStatus.slice(1);
        document.getElementById('profileSubStatus').textContent = capitalizedStatus;
        
        // Format next billing date
        if (currentUser.nextBillingDate) {
            const billingDate = new Date(currentUser.nextBillingDate);
            document.getElementById('profileNextBillingDate').textContent = billingDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        } else {
            document.getElementById('profileNextBillingDate').textContent = '—';
        }
        
        // Format plan expiry date
        if (currentUser.planExpiryDate) {
            const expiryDate = new Date(currentUser.planExpiryDate);
            document.getElementById('profilePlanExpiryDate').textContent = expiryDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        } else {
            document.getElementById('profilePlanExpiryDate').textContent = '—';
        }
        
        // Format renewal amount
        if (currentUser.renewalAmount) {
            document.getElementById('profileRenewalAmount').textContent = '$' + currentUser.renewalAmount.toFixed(2) + '/month';
        } else {
            document.getElementById('profileRenewalAmount').textContent = '—';
        }
    } else {
        // Hide subscription section for free plan
        subSection.style.display = 'none';
        upgradeBtn.textContent = 'Upgrade Plan';
    }
}

function showCancelSubModal() {
    document.getElementById('cancelSubModal').style.display = 'flex';
}

function closeCancelSubModal() {
    document.getElementById('cancelSubModal').style.display = 'none';
}

async function confirmCancelSubscription() {
    if (!currentUser) return;
    
    try {
        const response = await fetch('/api/subscription/cancel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });

        if (!response.ok) {
            const error = await response.json();
            showToast('Failed to cancel subscription: ' + (error.error || 'Unknown error'), 'error');
            return;
        }

        // Refresh user data
        await restoreSession();
        closeCancelSubModal();
        updateProfilePage();
        
        showToast('✓ Subscription cancelled. You\'ll keep your benefits until the end of your billing cycle.', 'success');
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
        console.error('Cancellation error:', error);
    }
}

function handlePricingClick(plan) {
    console.log('Pricing click:', plan);
    
    if (!currentUser) {
        // Not logged in, redirect to login
        console.log('Not logged in, redirecting to login');
        showToast('Please log in to proceed', 'info');
        setTimeout(() => navigateTo('login'), 500);
        return;
    }
    
    // User is logged in, check if they already have this plan
    const userPlan = (currentUser.plan || 'free').toLowerCase();
    const selectedPlan = plan.toLowerCase();
    
    console.log('User plan:', userPlan, 'Selected plan:', selectedPlan);
    
    if (userPlan === selectedPlan) {
        showToast('You already have the ' + plan.charAt(0).toUpperCase() + plan.slice(1) + ' plan', 'info');
        return;
    }
    
    // Determine plan order: free (0) < professional (1) < enterprise (2)
    const planOrder = { free: 0, professional: 1, enterprise: 2 };
    const userPlanLevel = planOrder[userPlan] || 0;
    const selectedPlanLevel = planOrder[selectedPlan] || 0;
    
    if (selectedPlanLevel < userPlanLevel) {
        // Downgrading - treat as cancellation
        console.log('Downgrading from', userPlan, 'to', selectedPlan, '- treating as cancellation');
        if (!confirm('Downgrading will cancel your current subscription. You will lose access to premium features. Continue?')) {
            return;
        }
        cancelSubscription();
        return;
    }
    
    // Upgrading - proceed to checkout
    startCheckout(plan);
}

// function startCheckout(plan) {
//     console.log('Starting checkout for:', plan);
    
//     // For free plan, just show a message
//     if (plan === 'free') {
//         showToast('You\'re on the Free plan! Continue enjoying 3 obfuscations per day.', 'success');
//         return;
//     }
    
//     // For paid plans, redirect to Stripe checkout
//     showToast('Redirecting to payment...', 'info');
//     // TODO: Uncomment when ready to integrate Stripe
//     // window.location.href = `/checkout?plan=${plan}&token=${localStorage.getItem('token')}`;
    
//     // For now, show a message
//     setTimeout(() => {
//         showToast('Checkout for ' + plan + ' plan coming soon!', 'success');
//     }, 1000);
// }

async function restoreSession() {
    const token = getToken();
    if (!token) return;
    try {
        const res = await fetch('/api/auth/me', {
            headers: { Authorization: 'Bearer ' + token }
        });
        if (res.ok) {
            currentUser = await res.json();
            updateNavAuth();
            fillAccountPage();
            updatePricingPageDisplay();
        } else {
            clearToken();
        }
    } catch { /* ignore */ }
}

async function submitLogin(e) {
    e.preventDefault();
    const errEl  = document.getElementById('login-error');
    const btn    = document.getElementById('login-submit-btn');
    const email  = document.getElementById('login-email').value.trim();
    const pass   = document.getElementById('login-password').value;
    errEl.style.display = 'none';
    btn.disabled = true;
    btn.textContent = 'Logging in…';
    try {
        const res  = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: pass }),
        });
        const data = await res.json();
        
        // Check if account requires verification (pending signup with correct password)
        if (res.status === 202 && data.requiresVerification) {
            verificationEmail = email;
            verificationCodeExpiry = Math.ceil(data.expiresIn / 60); // Convert seconds to minutes
            localStorage.setItem('verificationEmail', email);
            
            // Navigate to register page first
            navigateTo('register');
            
            // Show the verification step inside register page
            document.getElementById('register-form-step').style.display = 'none';
            document.getElementById('register-verification-step').style.display = 'block';
            document.getElementById('verification-email-display').textContent = 'Check your email for a 6-digit code';
            document.getElementById('verification-email-value').textContent = email;
            document.getElementById('verification-code').focus();
            
            showToast('✓ Verification code sent to your email', 'success');
            startCodeExpiryCountdown();
            return;
        }
        
        if (!res.ok) { errEl.textContent = data.error; errEl.style.display = 'block'; return; }
        setToken(data.token);
        currentUser = data.user;
        updateNavAuth();
        fillAccountPage();
        showToast('✓ Welcome back, ' + currentUser.name.split(' ')[0] + '!', 'success');
        navigateTo('home');
    } catch { errEl.textContent = 'Network error — please try again.'; errEl.style.display = 'block'; }
    finally { btn.disabled = false; btn.textContent = 'Log In'; }
}

async function submitRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const tosCheckbox = document.getElementById('register-tos');
    const errorDiv = document.getElementById('register-error');
    const submitBtn = document.getElementById('register-submit-btn');
    
    // Validation
    if (!name || !email || !password) {
        showError(errorDiv, 'Please fill in all fields.');
        return;
    }
    
    if (!tosCheckbox.checked) {
        showError(errorDiv, 'You must agree to the Terms of Service and Privacy Policy.');
        return;
    }
    
    // Disable button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating Account...';
    hideError(errorDiv);
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            // Check if it's a pending signup error (email pending verification)
            if (data.hasPendingSignup && data.canCancel) {
                showError(errorDiv, data.error || 'This email already exists. Please login to proceed.');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Create Account';
                return;
            } else {
                showError(errorDiv, data.error || 'Registration failed');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Create Account';
                return;
            }
        } else {
            // Success - show verification step
            verificationEmail = email;
            verificationCodeExpiry = data.expiresIn ? Math.ceil(data.expiresIn / 60) : 1;
            
            // Hide signup form, show verification form
            document.getElementById('register-form-step').style.display = 'none';
            document.getElementById('register-verification-step').style.display = 'block';
            
            // Update verification display
            document.getElementById('verification-email-display').textContent = `Check your email for a 6-digit verification code`;
            document.getElementById('verification-email-value').textContent = email;
            document.getElementById('verification-code').focus();
            
            // Start countdown timer
            startCodeExpiryCountdown();
            
            // Show confirmation toast
            showToast('Verification email sent! Check your inbox.', 'success');
        }
        
        // Clear form (always on success path from here)
        document.getElementById('register-name').value = '';
        document.getElementById('register-email').value = '';
        document.getElementById('register-password').value = '';
        document.getElementById('register-tos').checked = false;
        
    } catch (error) {
        console.error('Registration error:', error);
        showError(errorDiv, 'An error occurred. Please try again.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Account';
    }
}

/**
 * Submit verification code after email verification
 */
async function submitVerifyEmail(event) {
    event.preventDefault();
    
    const code = document.getElementById('verification-code').value.trim();
    const errorDiv = document.getElementById('verification-error');
    const submitBtn = document.getElementById('verify-submit-btn');
    
    if (!code || code.length !== 6) {
        showError(errorDiv, 'Please enter a valid 6-digit code.');
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Verifying...';
    hideError(errorDiv);
    
    try {
        const response = await fetch('/api/auth/verify-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: verificationEmail, 
                code 
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            showError(errorDiv, data.error || 'Verification failed');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Verify Email';
            // Clear code field for retry
            document.getElementById('verification-code').value = '';
            document.getElementById('verification-code').focus();
            return;
        }
        
        // Success - auto-login with response from server
        if (data.token && data.user) {
            setToken(data.token);
            currentUser = data.user;
            updateNavAuth();
            fillAccountPage();
        }
        
        showToast('✓ Email verified! Welcome to Obfusly.', 'success');
        
        // Reset form and redirect after brief delay
        setTimeout(() => {
            // Reset verification form
            document.getElementById('register-form-step').style.display = 'block';
            document.getElementById('register-verification-step').style.display = 'none';
            document.getElementById('verification-code').value = '';
            
            // Redirect to obfuscation page
            navigateTo('obfuscation');
        }, 1500);
        
    } catch (error) {
        console.error('Verification error:', error);
        showError(errorDiv, 'An error occurred. Please try again.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Verify Email';
    }
}

/**
 * Cancel pending signup - delete stuck verification and allow re-signup
 */
async function submitCancelPendingSignup(event) {
    if (event) event.preventDefault();
    
    if (!confirm('This will delete your pending signup and allow you to register again with the same email. Continue?')) {
        return;
    }
    
    const errorDiv = document.getElementById('verification-error');
    const button = document.getElementById('cancel-signup-btn');
    
    button.disabled = true;
    button.textContent = 'Cancelling...';
    hideError(errorDiv);
    
    try {
        const response = await fetch('/api/auth/cancel-pending-signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: verificationEmail })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            const errorMsg = data.error || 'Failed to cancel signup';
            showError(errorDiv, errorMsg);
            showToast('✗ ' + errorMsg, 'error');
            button.disabled = false;
            button.textContent = 'Cancel & Try Again';
            return;
        }
        
        showToast('✓ Signup cancelled. You can now register with a new password or try again.', 'success');
        
        // Reset forms and go back to signup
        setTimeout(() => {
            // Reset verification form
            document.getElementById('register-form-step').style.display = 'block';
            document.getElementById('register-verification-step').style.display = 'none';
            document.getElementById('verification-code').value = '';
            
            // Clear input fields
            document.getElementById('register-name').value = '';
            document.getElementById('register-email').value = '';
            document.getElementById('register-password').value = '';
            document.getElementById('register-confirm-password').value = '';
            
            verificationEmail = null;
            button.disabled = false;
            button.textContent = 'Cancel & Try Again';
        }, 1500);
        
    } catch (error) {
        console.error('Cancel signup error:', error);
        const errorMsg = 'An error occurred. Please try again.';
        showError(errorDiv, errorMsg);
        showToast('✗ ' + errorMsg, 'error');
        button.disabled = false;
        button.textContent = 'Cancel & Try Again';
    }
}

/**
 * Resend verification code
 */
async function submitResendVerification(event) {
    if (event) event.preventDefault();
    const errorDiv = document.getElementById('verification-error');
    const button = event ? event.target : document.getElementById('resend-code-btn');
    
    button.disabled = true;
    button.textContent = 'Sending...';
    hideError(errorDiv);
    
    try {
        const response = await fetch('/api/auth/resend-verification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: verificationEmail })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            const errorMsg = data.error || 'Failed to resend code';
            showError(errorDiv, errorMsg);
            showToast('✗ ' + errorMsg, 'error');
            button.disabled = false;
            button.textContent = 'Resend Code';
            return;
        }
        
        // Reset timer and code
        verificationCodeExpiry = data.expiresIn ? Math.ceil(data.expiresIn / 60) : 1;
        document.getElementById('verification-code').value = '';
        document.getElementById('verification-code').focus();
        startCodeExpiryCountdown();
        
        showToast('✓ Verification code ready! Timer reset to 10 minutes.', 'success');
        button.disabled = false;
        button.textContent = 'Resend Code';
        
    } catch (error) {
        console.error('Resend error:', error);
        const errorMsg = 'An error occurred. Please try again.';
        showError(errorDiv, errorMsg);
        showToast('✗ ' + errorMsg, 'error');
        button.disabled = false;
        button.textContent = 'Resend Code';
    }
}

/**
 * Start countdown timer for code expiry
 */
function startCodeExpiryCountdown() {
    const expiryDisplay = document.getElementById('code-expiry');
    let remainingSeconds = verificationCodeExpiry * 60;
    
    // Clear any existing interval
    if (window.codeExpiryInterval) {
        clearInterval(window.codeExpiryInterval);
    }
    
    const updateDisplay = () => {
        if (remainingSeconds > 60) {
            const minutes = Math.ceil(remainingSeconds / 60);
            expiryDisplay.textContent = `${minutes} minute${minutes !== 1 ? 's' : ''}`;
        } else {
            expiryDisplay.textContent = `${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
        }
    };
    
    updateDisplay();
    
    const interval = setInterval(() => {
        remainingSeconds--;
        updateDisplay();
        
        if (remainingSeconds <= 0) {
            clearInterval(interval);
            expiryDisplay.textContent = 'Expired';
        }
    }, 1000);
    
    window.codeExpiryInterval = interval;
}

/**
 * Helper: Show error message
 */
function showError(element, message) {
    if (element) {
        element.textContent = message;
        element.classList.remove('auth-error-hidden');
    }
}

/**
 * Helper: Hide error message
 */
function hideError(element) {
    if (element) {
        element.textContent = '';
        element.classList.add('auth-error-hidden');
    }
}

function logout() {
    clearToken();
    currentUser = null;
    updateNavAuth();
    updatePricingPageDisplay();
    showToast('You have been logged out.', 'info');
    navigateTo('home');
}

let resetEmail = null;
let resetCodeExpiry = null;
let resetCodeTimer = null;

/**
 * Submit forgot password form - send 6-digit code
 */
async function submitForgotPassword(event) {
    event.preventDefault();
    const errorDiv = document.getElementById('forgot-password-error');
    const submitBtn = document.getElementById('forgot-password-submit-btn');
    const email = document.getElementById('forgot-password-email').value.trim();
    
    if (!email) {
        showError(errorDiv, 'Please enter your email address.');
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    hideError(errorDiv);
    
    try {
        const response = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            showError(errorDiv, data.error || 'Failed to send code');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Code';
            return;
        }
        
        // Success - show code verification step
        resetEmail = email;
        resetCodeExpiry = data.expiresIn ? Math.ceil(data.expiresIn / 60) : 1;
        
        // Hide email form, show code form
        document.getElementById('forgot-password-form-step').style.display = 'none';
        document.getElementById('forgot-password-code-step').style.display = 'block';
        document.getElementById('forgot-password-code').focus();
        
        // Start countdown
        startResetCodeExpiryCountdown();
        
        showToast('✓ Verification code sent! Check your email.', 'success');
        
    } catch (error) {
        console.error('Forgot password error:', error);
        showError(errorDiv, 'An error occurred. Please try again.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Code';
    }
}

/**
 * Verify reset code
 */
async function submitVerifyResetCode(event) {
    event.preventDefault();
    const errorDiv = document.getElementById('forgot-password-code-error');
    const submitBtn = document.getElementById('forgot-password-code-submit-btn');
    const code = document.getElementById('forgot-password-code').value.trim();
    
    if (!code || code.length !== 6) {
        showError(errorDiv, 'Please enter a valid 6-digit code.');
        return;
    }
    
    if (!resetEmail) {
        showError(errorDiv, 'Session error. Please start over.');
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Verifying...';
    hideError(errorDiv);
    
    try {
        const response = await fetch('/api/auth/verify-reset-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: resetEmail, code })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            showError(errorDiv, data.error || 'Invalid code');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Verify Code';
            return;
        }
        
        // Code verified - go to password reset page
        clearInterval(resetCodeTimer);
        showToast('✓ Code verified! Set your new password.', 'success');
        navigateTo('reset-password');
        
    } catch (error) {
        console.error('Verify reset code error:', error);
        showError(errorDiv, 'An error occurred. Please try again.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Verify Code';
    }
}

/**
 * Resend reset code
 */
async function submitResendResetCode(event) {
    event.preventDefault();
    const errorDiv = document.getElementById('forgot-password-code-error');
    const submitBtn = event.target.closest('.text-link') || document.getElementById('forgot-password-code-submit-btn');
    
    if (!resetEmail) {
        showError(errorDiv, 'Session error. Please start over.');
        return;
    }
    
    hideError(errorDiv);
    
    try {
        const response = await fetch('/api/auth/resend-reset-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: resetEmail })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            showError(errorDiv, data.error || 'Failed to resend code');
            return;
        }
        
        // Reset code sent
        resetCodeExpiry = data.expiresIn ? Math.ceil(data.expiresIn / 60) : 1;
        document.getElementById('forgot-password-code').value = '';
        
        clearInterval(resetCodeTimer);
        startResetCodeExpiryCountdown();
        
        showToast('✓ New code ready! Timer reset to 10 minutes.', 'success');
        
    } catch (error) {
        console.error('Resend reset code error:', error);
        showError(errorDiv, 'An error occurred. Please try again.');
    }
}

/**
 * Start countdown timer for reset code expiry
 */
function startResetCodeExpiryCountdown() {
    if (resetCodeTimer) clearInterval(resetCodeTimer);
    
    const expiryElement = document.getElementById('reset-code-expiry');
    let remainingSeconds = resetCodeExpiry * 60;
    
    const updateTimer = () => {
        remainingSeconds--;
        if (remainingSeconds > 0) {
            if (remainingSeconds > 60) {
                const minutes = Math.ceil(remainingSeconds / 60);
                expiryElement.textContent = `Code expires in ${minutes} minute${minutes !== 1 ? 's' : ''}`;
            } else {
                expiryElement.textContent = `Code expires in ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
            }
        } else {
            expiryElement.textContent = 'Code expired. Please request a new one.';
            clearInterval(resetCodeTimer);
        }
    };
    
    updateTimer();
    resetCodeTimer = setInterval(updateTimer, 1000);
}

/**
 * Reset forgot password to email step
 */
function resetForgotPasswordStep() {
    clearInterval(resetCodeTimer);
    resetEmail = null;
    resetCodeExpiry = null;
    
    document.getElementById('forgot-password-form-step').style.display = 'block';
    document.getElementById('forgot-password-code-step').style.display = 'none';
    document.getElementById('forgot-password-email').value = '';
    document.getElementById('forgot-password-code').value = '';
    
    hideError(document.getElementById('forgot-password-error'));
    hideError(document.getElementById('forgot-password-code-error'));
}

/**
 * Submit reset password form
 */
async function submitResetPassword(event) {
    event.preventDefault();
    const errorDiv = document.getElementById('reset-password-error');
    const submitBtn = document.getElementById('reset-password-submit-btn');
    const newPassword = document.getElementById('reset-password-new').value;
    const confirmPassword = document.getElementById('reset-password-confirm').value;
    
    if (!newPassword || !confirmPassword) {
        showError(errorDiv, 'Please fill in all fields.');
        return;
    }
    
    if (newPassword.length < 8) {
        showError(errorDiv, 'Password must be at least 8 characters.');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showError(errorDiv, 'Passwords do not match.');
        return;
    }
    
    if (!resetEmail) {
        showError(errorDiv, 'Session expired. Please start over.');
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Resetting...';
    hideError(errorDiv);
    
    try {
        const response = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: resetEmail, password: newPassword })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            showError(errorDiv, data.error || 'Failed to reset password');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Reset Password';
            return;
        }
        
        // Success
        resetEmail = null;
        
        if (data.isPendingSignup) {
            showToast('✓ Password updated! Check your email for the verification code to complete signup.', 'success');
            setTimeout(() => {
                navigateTo('register');
            }, 2000);
        } else {
            showToast('✓ Password reset successfully! Please log in.', 'success');
            setTimeout(() => {
                navigateTo('login');
            }, 2000);
        }
    } catch (error) {
        showError(errorDiv, 'An error occurred. Please try again.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Reset Password';
    }
}

function showAccountMenu() {
    const accountBtn = document.getElementById('nav-account-btn');
    if (!accountBtn) return;
    
    // Create menu if it doesn't exist
    let menu = document.getElementById('accountDropdown');
    if (!menu) {
        menu = document.createElement('div');
        menu.id = 'accountDropdown';
        menu.style.cssText = `
            position: absolute;
            top: 60px;
            right: 20px;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 1rem;
            min-width: 250px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 999;
        `;
        document.body.appendChild(menu);
    }
    
    if (currentUser) {
        const usage = currentUser.usage || { used: 0, limit: 0 };
        menu.innerHTML = `
            <div style="padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">
                <div style="font-weight: 600; color: var(--text-primary);">${currentUser.name}</div>
                <div style="font-size: 0.85rem; color: var(--text-secondary);">${currentUser.email}</div>
                <div style="font-size: 0.85rem; color: var(--accent-primary); margin-top: 0.5rem;">
                    Plan: ${currentUser.plan || 'Free'}
                </div>
            </div>
            
            <div style="margin: 1rem 0; font-size: 0.9rem;" data-obf-usage>
                <div style="color: var(--text-secondary); margin-bottom: 0.5rem;">
                    Daily Obfuscations
                </div>
                <div style="color: var(--text-primary); font-weight: 600;">
                    ${usage.used} / ${usage.limit}
                </div>
                <div style="width: 100%; height: 6px; background: rgba(46,107,255,0.1); border-radius: 3px; margin-top: 0.5rem;">
                    <div style="width: ${(usage.used / usage.limit) * 100}%; height: 100%; background: var(--accent-primary); border-radius: 3px;"></div>
                </div>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <button onclick="navigateTo('account'); closeAccountMenu()" 
                    style="padding: 0.5rem; background: rgba(46,107,255,0.1); border: 1px solid var(--accent-primary); border-radius: 6px; color: var(--accent-primary); cursor: pointer; font-size: 0.9rem;">
                    My Account
                </button>
                <button onclick="navigateTo('pricing'); closeAccountMenu()" 
                    style="padding: 0.5rem; background: rgba(46,107,255,0.1); border: 1px solid var(--accent-primary); border-radius: 6px; color: var(--accent-primary); cursor: pointer; font-size: 0.9rem;">
                    Upgrade Plan
                </button>
                <button onclick="logout()" 
                    style="padding: 0.5rem; background: rgba(255,0,0,0.1); border: 1px solid #ff6b6b; border-radius: 6px; color: #ff6b6b; cursor: pointer; font-size: 0.9rem;">
                    Log Out
                </button>
            </div>
        `;
    }
    
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function closeAccountMenu() {
    const menu = document.getElementById('accountDropdown');
    if (menu) menu.style.display = 'none';
}

function fillAccountPage() {
    if (!currentUser) return;
    const planLabel = { free: 'Free', professional: 'Professional', enterprise: 'Enterprise' };
    
    // Account Information
    document.getElementById('acct-name').textContent  = currentUser.name;
    document.getElementById('acct-email').textContent = currentUser.email;
    document.getElementById('acct-plan').textContent  = planLabel[currentUser.plan] || currentUser.plan;
    document.getElementById('acct-since').textContent = currentUser.createdAt
        ? new Date(currentUser.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })
        : '—';
    document.getElementById('acct-id').textContent = currentUser.id ? currentUser.id.substring(0, 12) + '...' : '—';
    
    // Subscription Status
    const subStatus = currentUser.subscriptionStatus || 'inactive';
    const statusDisplay = subStatus.charAt(0).toUpperCase() + subStatus.slice(1).toLowerCase();
    document.getElementById('acct-status').textContent = statusDisplay;
    
    // Show plan features
    const features = getPlanFeatures(currentUser.plan);
    const featuresList = document.getElementById('acct-features');
    if (featuresList) {
        featuresList.innerHTML = features.map(f => 
            `<li style="padding: 0.5rem 0; color: var(--text-primary); display: flex; align-items: center;"><span style="color: var(--accent-primary); margin-right: 0.5rem;">✓</span> ${f}</li>`
        ).join('');
    }
    
    // Show billing information for paid plans
    const billingCard = document.getElementById('acct-billing-card');
    const cancelBtn = document.getElementById('acct-cancel-btn');
    
    if (currentUser.plan && currentUser.plan !== 'free') {
        billingCard.style.display = 'block';
        cancelBtn.style.display = 'block';
        
        // Next billing date
        if (currentUser.nextBillingDate) {
            const billingDate = new Date(currentUser.nextBillingDate);
            document.getElementById('acct-next-billing').textContent = billingDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        } else {
            document.getElementById('acct-next-billing').textContent = '—';
        }
        
        // Renewal amount
        const planPrices = { professional: '$19.99', enterprise: '$49.99' };
        document.getElementById('acct-renewal-amount').textContent = (planPrices[currentUser.plan] || '—') + '/month';
    } else {
        billingCard.style.display = 'none';
        cancelBtn.style.display = 'none';
    }
}

function getPlanFeatures(plan) {
    const features = {
        free: [
            '3 obfuscations per day',
            'Up to 10 KB file size',
            'Basic obfuscation modes',
            'Community support'
        ],
        professional: [
            '50 obfuscations per day',
            'Up to 5 MB file size',
            'Advanced obfuscation modes',
            'Email support',
            'Full API access',
            'Standard priority'
        ],
        enterprise: [
            '500 obfuscations per day',
            'Unlimited file size',
            'All obfuscation modes',
            '24/7 priority support',
            'Full API access',
            'HTML & webpage support',
            'Custom solutions',
            'SLA guarantee'
        ]
    };
    return features[plan] || features.free;
}

async function cancelSubscription() {
    if (!currentUser || currentUser.plan === 'free') {
        showToast('No active subscription to cancel', 'info');
        return;
    }
    
    if (!confirm('Are you sure you want to cancel your subscription? You will be downgraded to the Free plan.')) {
        return;
    }
    
    try {
        showToast('Cancelling subscription...', 'info');
        const res = await fetch('/api/payment/cancel-subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + getToken() },
        });
        
        const data = await res.json();
        if (!res.ok) {
            showToast(data.error || 'Could not cancel subscription', 'error');
            return;
        }
        
        showToast('✓ Subscription cancelled. You are now on the Free plan.', 'success');
        // Refresh user data
        await restoreSession();
        fillAccountPage();
        updateNavAuth();
    } catch (err) {
        console.error('Cancel subscription error:', err);
        showToast('Network error — please try again.', 'error');
    }
}

function updatePricingPageDisplay() {
    if (!currentUser) {
        // Not logged in - show "Create Account" for free, "Get Started" for paid
        document.getElementById('freeBtn').textContent = 'Create Account';
        document.getElementById('professionalBtn').textContent = 'Get Started';
        document.getElementById('enterpriseBtn').textContent = 'Get Started';
        
        // Remove current-plan class
        document.getElementById('freeBtn').classList.remove('current-plan');
        document.getElementById('professionalBtn').classList.remove('current-plan');
        document.getElementById('enterpriseBtn').classList.remove('current-plan');
        
        // Hide all current plan badges
        document.getElementById('freeBadge').style.display = 'none';
        document.getElementById('professionalBadge').style.display = 'none';
        document.getElementById('enterpriseBadge').style.display = 'none';
        
        // Show "MOST POPULAR" badge
        if (document.getElementById('professionalPopularBadge')) {
            document.getElementById('professionalPopularBadge').style.display = 'block';
        }
        return;
    }
    
    const userPlan = (currentUser.plan || 'free').toLowerCase();
    const planOrder = { free: 0, professional: 1, enterprise: 2 };
    const userPlanLevel = planOrder[userPlan] || 0;
    
    // Update free card
    document.getElementById('freeBadge').style.display = userPlan === 'free' ? 'block' : 'none';
    const freeBtn = document.getElementById('freeBtn');
    if (userPlan === 'free') {
        freeBtn.textContent = 'Current Plan';
        freeBtn.classList.add('current-plan');
        freeBtn.disabled = true;
    } else {
        freeBtn.textContent = 'Create Account';
        freeBtn.classList.remove('current-plan');
        freeBtn.disabled = false;
    }
    
    // Update professional card
    document.getElementById('professionalBadge').style.display = userPlan === 'professional' ? 'block' : 'none';
    
    // Hide "MOST POPULAR" badge if showing current plan badge
    if (document.getElementById('professionalPopularBadge')) {
        document.getElementById('professionalPopularBadge').style.display = userPlan === 'professional' ? 'none' : 'block';
    }
    
    const professionalBtn = document.getElementById('professionalBtn');
    if (userPlan === 'professional') {
        professionalBtn.textContent = 'Current Plan';
        professionalBtn.classList.add('current-plan');
        professionalBtn.disabled = true;
    } else if (userPlanLevel < 1) {
        professionalBtn.textContent = 'Get Started';
        professionalBtn.classList.remove('current-plan');
        professionalBtn.disabled = false;
    } else {
        professionalBtn.textContent = 'Downgrade';
        professionalBtn.classList.remove('current-plan');
        professionalBtn.disabled = false;
    }
    
    // Update enterprise card
    document.getElementById('enterpriseBadge').style.display = userPlan === 'enterprise' ? 'block' : 'none';
    
    const enterpriseBtn = document.getElementById('enterpriseBtn');
    if (userPlan === 'enterprise') {
        enterpriseBtn.textContent = 'Current Plan';
        enterpriseBtn.classList.add('current-plan');
        enterpriseBtn.disabled = true;
    } else if (userPlanLevel < 2) {
        enterpriseBtn.textContent = 'Get Started';
        enterpriseBtn.classList.remove('current-plan');
        enterpriseBtn.disabled = false;
    } else {
        enterpriseBtn.textContent = 'Downgrade';
        enterpriseBtn.classList.remove('current-plan');
        enterpriseBtn.disabled = false;
    }
}

function handleFreePlanClick() {
    if (!currentUser) {
        // Not logged in - redirect to register
        navigateTo('register');
        return;
    }
    
    // User is logged in
    const userPlan = (currentUser.plan || 'free').toLowerCase();
    
    if (userPlan === 'free') {
        // Already on free plan
        showToast('You already have the Free plan', 'info');
        return;
    }
    
    // On paid plan, clicking free = downgrade/cancel
    if (!confirm('Downgrading will cancel your current subscription. You will lose access to premium features. Continue?')) {
        return;
    }
    cancelSubscription();
}

function updateAccountMenuData() {
    if (!currentUser) return;
    
    const menu = document.getElementById('accountDropdown');
    if (!menu) return; // Menu doesn't exist yet, nothing to update
    
    const usage = currentUser.usage || { used: 0, limit: 0 };
    
    // Update the usage stats in the menu if it's visible
    const usageDiv = menu.querySelector('[data-obf-usage]');
    if (usageDiv) {
        usageDiv.innerHTML = `
            <div style="color: var(--text-secondary); margin-bottom: 0.5rem;">
                Daily Obfuscations
            </div>
            <div style="color: var(--text-primary); font-weight: 600;">
                ${usage.used} / ${usage.limit}
            </div>
            <div style="width: 100%; height: 6px; background: rgba(46,107,255,0.1); border-radius: 3px; margin-top: 0.5rem;">
                <div style="width: ${(usage.used / usage.limit) * 100}%; height: 100%; background: var(--accent-primary); border-radius: 3px;"></div>
            </div>
        `;
    }
}

// ── Stripe checkout ────────────────────────────────────────────────────────
async function startCheckout(plan) {
    if (!currentUser) {
        showToast('Please log in or create an account first.', 'error');
        navigateTo('register');
        return;
    }
    showToast('Redirecting to checkout…', 'info');
    try {
        const res  = await fetch('/api/payment/create-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + getToken() },
            body: JSON.stringify({ plan }),
        });
        const data = await res.json();
        if (!res.ok) { showToast(data.error || 'Could not start checkout.', 'error'); return; }
        window.location.href = data.url;
    } catch { showToast('Network error — please try again.', 'error'); }
}

// ── FAQ accordion ──────────────────────────────────────────────────────────
function toggleFaq(btn) {
    const answer = btn.nextElementSibling;
    const arrow  = btn.querySelector('.faq-arrow');
    const isOpen = answer.classList.contains('open');
    document.querySelectorAll('.faq-answer.open').forEach(a => {
        a.classList.remove('open');
        a.previousElementSibling.querySelector('.faq-arrow').textContent = '▼';
    });
    if (!isOpen) { answer.classList.add('open'); arrow.textContent = '▲'; }
}


let obfuscationConfig = {
    identifiers: {
        nameStyle: "minify",
    },
    numbers: {
        enabled: true,
        strategy: {
            useCalculator: true,
            useBaseIntegers: true,
            calculateStrength: 3,
        },
        cache: {
            enabled: true,
            multipleAssignments: false,
        },
        baseIntegerFormat: {
            default: "JSFuck",
            shuffle: true,
            distribution: {
                Refractal: 0,
                JSFuck: 0,
                Hexadecimal: 40,
                Octal: 30,
                Binary: 30
            }
        }
    },
    strings: {
        enabled: true,
        encoding: {
            enabled: true,
            cache: true,
        },
        concealment: {
            enabled: true,
            decoderLayers: 2,
            noiseFunctions: 1,
        },
        splitting: {
            enabled: false,
            maxFragments: 0,
        }
    },
    globals: {
        concealWindowObject: true,
        concealPrimitives: true,
    },
    protection: {
        integrityChecks: true,
        antiDebugger: false,
        disableConsole: false,
        breakASTs: true,
    },
    output: {
        compression: true,
        strictMode: false,
        target: "browser",
    }
};

// ============================================================================
// CODE ANIMATION
// ============================================================================

const codePhases = [
    {
        badge: 'Source Code',
        badgeColor: '#88aaff',
        charDelay: 26,
        lineDelay: 80,
        holdMs: 2600,
        lines: [
            { text: '// Generates a secure 256-bit key',          type: 'comment' },
            { text: 'function generateKey(len = 32) {',           type: 'keyword' },
            { text: '  const charset = "ABCDEFabcdef0123456789";', type: 'string' },
            { text: '  let key = "";',                             type: '' },
            { text: '  for (let i = 0; i < len; i++) {',          type: 'keyword' },
            { text: '    const r = crypto.getRandomValues(',       type: '' },
            { text: '      new Uint8Array(1))[0];',                type: '' },
            { text: '    key += charset[r % charset.length];',     type: '' },
            { text: '  }',                                         type: '' },
            { text: '  return key;',                               type: '' },
            { text: '}',                                           type: '' },
            { text: 'generateKey();',                              type: 'keyword' },
        ]
    },
    {
        badge: 'Protected Output',
        badgeColor: '#00d4ff',
        charDelay: 6,
        lineDelay: 20,
        holdMs: 2600,
        lines: [
            { text: `var G=void 0;var J=['vcn9lki%(PnV4%iAK9kwKGv8JVM@evff','Kyff','4mi)cAt24%DWiAtXgPiG'];const F=(()=>{;var I='y139kt%xpnCFKJehvlQ!ciP*(4LuMg&5#7qV$TAsO0SjXW2IbdwG)8mR@rNazDEo';var b={};for(var x=0;x<I.length;x++)b[I.charAt(x)]=x;var L=new Array(3).fill(null);var z='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';var u='f';function S(n){if(L[n]!==null&&L[n]!==undefined)return L[n];var k=0&65535;if((k&3)===1){k=k<<1^21930;};var m=J[n];var q='';for(var d=0;d<m.length;d++){var l=m.charAt(d);for(var d=0;d<m.length;d++){var Q=m.charAt(d);var R=b[Q];if(R!==undefined)q+=z.charAt(R);else if(Q===u)q+='=';else q+=Q;};var t='';if(typeof Buffer!=='undefined'){try{t=Buffer.from(q,'base64').toString('utf8');}catch(e){t=q;}}else{try{t=decodeURIComponent(Array.prototype.map.call(atob(q),function(c){return'%'+('00'+c.charCodeAt(0).toString(16)).slice(-2);}).join(''));}catch(e){t=q;}};var H=(k^8754)&255+k;for(var U=0;U<0;U++){H=H+0&255;};L[n]=t||k;return t+(H==undefined?55571&255:'');};};var V=X=>{var w=S(X);return w;};(function e(){G=typeof globalThis==='object'?globalThis:typeof self==='object'?self:global;}());return V;})();const l=F||undefined;function B(O=32){const W=l(0);let N="";for(let v=0;v<O;v++){N+=W[crypto[l(2)](new Uint8Array(1))[l(1)]%W.length]}return N}B();`, type: 'obf' },
        ]
    }
];

function initCodeAnimation() {
    const display = document.getElementById('codeDisplay');
    const badge   = document.querySelector('.code-panel-badge');
    if (!display) return;

    // Make element focusable for text selection
    display.setAttribute('tabindex', '-1');

    let phaseIndex = 0;

    function runPhase() {
        const phase = codePhases[phaseIndex];
        display.innerHTML = '';
        if (badge) {
            badge.textContent = phase.badge;
            badge.style.color = phase.badgeColor;
        }

        let lineIndex = 0;
        let charIndex = 0;

        function typeNextChar() {
            if (lineIndex >= phase.lines.length) {
                // Finished typing — hold, then transition
                if (phaseIndex === 0 && badge) {
                    setTimeout(() => {
                        badge.textContent = 'Obfuscating…';
                        badge.style.color = '#ffcc44';
                        setTimeout(() => {
                            phaseIndex = 1;
                            runPhase();
                        }, 700);
                    }, phase.holdMs);
                } else if (phaseIndex === 1) {
                    // Stop animation after Protected Output phase completes
                    return;
                } else {
                    setTimeout(() => {
                        phaseIndex = 0;
                        runPhase();
                    }, phase.holdMs);
                }
                return;
            }

            const { text, type } = phase.lines[lineIndex];

            if (charIndex === 0) {
                const line = document.createElement('div');
                line.className = 'code-line' + (type ? ` ${type}` : '');
                line.id = `anim-line-${lineIndex}`;
                display.appendChild(line);
            }

            const currentLine = document.getElementById(`anim-line-${lineIndex}`);
            if (charIndex < text.length) {
                currentLine.textContent += text[charIndex];
                charIndex++;
                setTimeout(typeNextChar, phase.charDelay);
            } else {
                lineIndex++;
                charIndex = 0;
                setTimeout(typeNextChar, phase.lineDelay);
            }
        }

        typeNextChar();
    }

    runPhase();
}

// ============================================================================
// PAGE NAVIGATION
// ============================================================================

function updateFooterVisibility(pageName) {
    const footer = document.querySelector('footer');
    if (!footer) return;

    const hideFooter = pageName === 'login' || pageName === 'register';
    footer.style.display = hideFooter ? 'none' : '';
}

function navigateTo(pageName) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageName).classList.add('active');
    updateFooterVisibility(pageName);
    if (pageName === 'obfuscation' && !inputEditor) initializeEditors();
    if (pageName === 'profile') updateProfilePage();
    if (pageName === 'pricing') updatePricingPageDisplay();
    window.scrollTo(0, 0);
}

// ============================================================================
// MONACO EDITOR SETUP
// ============================================================================

function initializeEditors() {
    require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
    require(['vs/editor/editor.main'], function() {
        if (!inputEditor) {
            inputEditor = monaco.editor.create(document.getElementById('inputEditor'), {
                value: '// Enter your JavaScript code here\n\nfunction hello(name) {\n  console.log("Hello, " + name);\n}\n\nhello("World");',
                language: 'javascript',
                theme: 'vs-dark',
                fontFamily: 'JetBrains Mono',
                fontSize: 13,
                minimap: { enabled: false },
                automaticLayout: true,
                wordWrap: 'on'
            });
        }
        if (!outputEditor) {
            outputEditor = monaco.editor.create(document.getElementById('outputEditor'), {
                value: '// Obfuscated code will appear here',
                language: 'javascript',
                theme: 'vs-dark',
                fontFamily: 'JetBrains Mono',
                fontSize: 13,
                minimap: { enabled: false },
                automaticLayout: true,
                wordWrap: 'on',
                readOnly: true
            });
        }
    });
}

// ============================================================================
// OBFUSCATION API INTEGRATION
// ============================================================================

async function obfuscateCode() {
    // For unauthenticated users, just check if they're using an example
    if (!currentUser) {
        const currentCode = inputEditor?.getValue() || '';
        const storedExampleCode = localStorage.getItem('_currentExampleCode');
        
        if (!storedExampleCode || currentCode.trim() !== storedExampleCode.trim()) {
            showToast('Please log in or create an account to obfuscate custom code. Use the "Example" button to test with sample code.', 'error');
            navigateTo('login');
            return;
        }
    }

    const input = inputEditor?.getValue() || '';
    if (!input.trim()) {
        showToast('Please enter some code first', 'error');
        return;
    }

    // CHECK FILE SIZE LIMIT (client-side, based on known plan)
    const userPlan = currentUser?.plan || 'free';
    const fileSizeLimit = FILE_SIZE_LIMITS[userPlan];
    const fileSizeBytes = new Blob([input]).size;
    
    if (fileSizeBytes > fileSizeLimit) {
        const limitMB = (fileSizeLimit / (1024 * 1024)).toFixed(1);
        const sizeMB = (fileSizeBytes / (1024 * 1024)).toFixed(2);
        // showToast(`File too large: ${sizeMB}MB (limit: ${limitMB}MB for ${userPlan} plan)`, 'error');
        // return;
    }

    showToast('Obfuscating your code...', 'info');
    
    try {
        const headers = {
            'Content-Type': 'application/json',
        };
        
        // Add authorization header if user is logged in
        const token = getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch('/obfuscate', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                code: input,
                config: obfuscationConfig
            })
        });

        if (!response.ok) {
            const error = await response.json();
            
            // Handle rate limit error specifically
            if (response.status === 429) {
                showToast('Daily limit reached. You can still obfuscate Example code. Try again tomorrow.', 'error');
                return;
            }
            
            showToast('Obfuscation failed: ' + (error.error || 'Unknown error'), 'error');
            return;
        }

        const result = await response.json();
        
        // Update usage stats from server response (for authenticated users)
        if (currentUser && result.usage) {
            // Update local user object with latest usage info
            currentUser.usage = result.usage;
            updateAccountMenuData();
            updateProfilePage();
        }
        
        outputEditor?.setValue(result.obfuscatedCode);
        switchTab('output');
        
        const remainingMsg = (result.usage && result.usage.remaining > 0) 
            ? ` (${result.usage.remaining} remaining today)`
            : ' (Daily limit reached)';
        showToast('✓ Code obfuscated successfully!' + remainingMsg, 'success');
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
        console.error('Obfuscation error:', error);
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function copyAnimationCode() {
    const codeDisplay = document.getElementById('codeDisplay');
    const text = codeDisplay.innerText || codeDisplay.textContent;
    if (!text?.trim()) {
        showToast('Nothing to copy', 'error');
        return;
    }
    navigator.clipboard.writeText(text).then(() => {
        showToast('✓ Code copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Failed to copy', 'error');
    });
}

function toggleAnimationEdit() {
    const codeDisplay = document.getElementById('codeDisplay');
    const editBtn = document.getElementById('editAnimationBtn');
    
    if (codeDisplay.contentEditable === 'true') {
        // Disable edit mode
        codeDisplay.contentEditable = 'false';
        editBtn.textContent = 'Edit';
        editBtn.style.background = 'rgba(46, 107, 255, 0.2)';
        showToast('✓ Edit mode disabled', 'success');
    } else {
        // Enable edit mode
        codeDisplay.contentEditable = 'true';
        editBtn.textContent = 'Done';
        editBtn.style.background = 'rgba(46, 255, 107, 0.2)';
        codeDisplay.focus();
        showToast('✓ You can now edit the code', 'info');
    }
}

function loadExample() {
    const examples = [
        // Example 1: Fibonacci
        `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

for (let i = 0; i < 10; i++) {
  console.log('F(' + i + ') = ' + fibonacci(i));
}`,
        // Example 2: String Manipulation
        `function reverseString(str) {
  return str.split('').reverse().join('');
}

const message = 'Hello, World!';
console.log('Original: ' + message);
console.log('Reversed: ' + reverseString(message));`,
        // Example 3: Object Processing
        `const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 35 }
];

users.forEach(function(user) {
  console.log(user.name + ' is ' + user.age + ' years old');
});`,
        // Example 4: Array Operations
        `function sumArray(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

const numbers = [1, 2, 3, 4, 5];
console.log('Sum: ' + sumArray(numbers));
console.log('Average: ' + (sumArray(numbers) / numbers.length));`,
        // Example 5: Prime Numbers
        `function isPrime(num) {
  if (num <= 1) return false;
  if (num === 2) return true;
  if (num % 2 === 0) return false;
  for (let i = 3; i * i <= num; i += 2) {
    if (num % i === 0) return false;
  }
  return true;
}

for (let i = 2; i <= 20; i++) {
  if (isPrime(i)) console.log(i + ' is prime');
}`
    ];
    
    // Get the last used example index from localStorage, or start at -1
    let lastIndex = parseInt(localStorage.getItem('_lastExampleIndex') || '-1', 10);
    
    // Choose the next example
    let nextIndex = (lastIndex + 1) % examples.length;
    
    const code = examples[nextIndex];
    inputEditor?.setValue(code);
    
    // Store the current example code for validation and the index
    localStorage.setItem('_currentExampleCode', code);
    localStorage.setItem('_lastExampleIndex', nextIndex);
    
    const exampleNumber = nextIndex + 1;
    showToast(`✓ Example ${exampleNumber}/${examples.length} loaded!`, 'success');
}

function handleFileUpload() {
    document.getElementById('fileInput').click();
}

function clearInput() {
    inputEditor?.setValue('');
}

function copyToClipboard() {
    const text = outputEditor?.getValue();
    if (!text?.trim()) {
        showToast('Nothing to copy', 'error');
        return;
    }
    navigator.clipboard.writeText(text).then(() => {
        showToast('✓ Code copied to clipboard!', 'success');
    });
}

function downloadOutput() {
    const text = outputEditor?.getValue();
    if (!text?.trim()) {
        showToast('No output to download', 'error');
        return;
    }
    const blob = new Blob([text], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'obfuscated.js';
    a.click();
    showToast('✓ Download started!', 'success');
}

function runCode() {
    const code = outputEditor?.getValue();
    if (!code?.trim()) {
        showToast('No code to run', 'error');
        return;
    }
    
    showToast('✓ Running code...', 'success');
    const terminal = document.getElementById('terminal');
    const terminalOutput = document.getElementById('terminalOutput');
    terminal.classList.add('active');
    terminalOutput.innerHTML = '<span style="color: #888;">Running code...</span>';
    
    try {
        const originalLog = console.log;
        const originalError = console.error;
        let output = '';
        
        // Capture console output
        console.log = (...args) => {
            output += args.map(arg => {
                if (typeof arg === 'object') return JSON.stringify(arg, null, 2);
                return String(arg);
            }).join(' ') + '\n';
            originalLog.apply(console, args);
        };
        
        console.error = (...args) => {
            output += '<span style="color: #ff6b6b;">ERROR: ' + args.join(' ') + '</span>\n';
            originalError.apply(console, args);
        };
        
        // Execute code in isolated scope
        (new Function(code))();
        
        // Restore console
        console.log = originalLog;
        console.error = originalError;
        
        // Display output
        if (output.trim()) {
            terminalOutput.innerHTML = `<div style="color: #00d4ff;">$ node obfuscated.js</div><div>${output.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>`;
        } else {
            terminalOutput.innerHTML = `<div style="color: #00d4ff;">$ node obfuscated.js</div><div style="color: #888;">(no output)</div>`;
        }
    } catch (error) {
        console.log = originalLog;
        console.error = originalError;
        terminalOutput.innerHTML = `<div style="color: #00d4ff;">$ node obfuscated.js</div><div style="color: #ff6b6b;">ERROR: ${error.message}</div><div style="color: #ff6b6b; font-size: 0.85em; margin-top: 0.5rem;">${error.stack.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>`;
    }
}

function closeTerminal() {
    const terminal = document.getElementById('terminal');
    terminal.classList.remove('active');
}

// ============================================================================
// TOAST NOTIFICATIONS
// ============================================================================

function showToast(message, type = 'success') {
    const container = document.querySelector('.toast-container') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    // Get all current toasts
    const allToasts = container.querySelectorAll('.toast:not(.fadeOut)');
    
    // If we already have 3 or more toasts, remove the oldest one
    if (allToasts.length >= 3) {
        const oldestToast = allToasts[0];
        oldestToast.classList.add('fadeOut');
        setTimeout(() => oldestToast.remove(), 500);
    }
    
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('fadeOut');
        setTimeout(() => toast.remove(), 500);
    }, 2000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

// ============================================================================
// TAB MANAGEMENT
// ============================================================================

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabName + '-tab').classList.add('active');
    document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
}

// ============================================================================
// FILE UPLOAD
// ============================================================================

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('uploadZone').classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('uploadZone').classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('uploadZone').classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (files.length > 0) processFile(files[0]);
}

function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) processFile(files[0]);
}

function processFile(file) {
    if (!file.name.endsWith('.js') && !file.name.endsWith('.cjs') && !file.name.endsWith('.mjs')) {
        showToast('Only .js, .cjs, and .mjs files are supported', 'error');
        return;
    }
    if (file.size > 10 * 1024 * 1024) {
        showToast('File size exceeds 10MB limit', 'error');
        return;
    }
    const reader = new FileReader();
    reader.onload = function(event) {
        inputEditor?.setValue(event.target.result);
        // Clear the stored example code since user is uploading a custom file
        localStorage.removeItem('_currentExampleCode');
        switchTab('editor');
        showToast('✓ File loaded successfully!', 'success');
    };
    reader.onerror = function() {
        showToast('Error reading file', 'error');
    };
    reader.readAsText(file);
}

// ============================================================================
// TESTIMONIALS CAROUSEL
// ============================================================================

function startTestimonialScroll() {
    const track = document.getElementById('testimonialTrack');
    if (!track) return;
    
    // Preload: duplicate all cards upfront for seamless infinite scroll
    const originalCards = Array.from(track.querySelectorAll('.testimonial-card'));
    originalCards.forEach(card => {
        const clone = card.cloneNode(true);
        track.appendChild(clone);
    });
    
    let scrollAmount = 0;
    const scrollSpeed = 0.25;
    
    const getCardWidth = () => {
        const card = track.querySelector('.testimonial-card');
        if (card) {
            return card.offsetWidth + 32;
        }
        return 360;
    };

    function scroll() {
        scrollAmount += scrollSpeed;
        track.style.transform = `translateX(-${scrollAmount}px)`;

        const cardWidth = getCardWidth();
        const totalOriginalWidth = cardWidth * originalCards.length;
        
        if (scrollAmount >= totalOriginalWidth) {
            scrollAmount -= totalOriginalWidth;
            track.style.transform = `translateX(-${scrollAmount}px)`;
        }

        requestAnimationFrame(scroll);
    }

    scroll();
}

// ============================================================================
// CUSTOM DROPDOWN HANDLER
// ============================================================================

function initCustomDropdowns() {
    const dropdowns = document.querySelectorAll('.custom-dropdown');
    
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        const menu = dropdown.querySelector('.dropdown-menu');
        const options = dropdown.querySelectorAll('.dropdown-option');
        const hiddenSelect = dropdown.querySelector('select');
        
        // Initialize with selected value and mark it with checkmark
        if (hiddenSelect) {
            let selectedValue = hiddenSelect.value;
            
            // Try to get the value from localStorage using the data-config path
            const configKey = hiddenSelect.getAttribute('data-config');
            if (configKey) {
                try {
                    const savedConfig = JSON.parse(localStorage.getItem('obfuslyConfig'));
                    if (savedConfig) {
                        // Helper to get nested property
                        const getNestedProperty = (obj, path) => {
                            const parts = path.split('.');
                            let current = obj;
                            for (const part of parts) {
                                if (current && typeof current === 'object') {
                                    current = current[part];
                                } else {
                                    return undefined;
                                }
                            }
                            return current;
                        };
                        
                        const storedValue = getNestedProperty(savedConfig, configKey);
                        if (storedValue !== undefined) {
                            selectedValue = storedValue;
                        }
                    }
                } catch (error) {
                    console.warn('Failed to load from localStorage:', error);
                }
            }
            
            options.forEach(option => {
                if (option.getAttribute('data-value') == selectedValue) {
                    option.classList.add('selected');
                }
            });
        }
        
        // Toggle menu on trigger click
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const isOpen = menu.classList.contains('active');
            
            if (isOpen) {
                menu.classList.remove('active');
                trigger.classList.remove('active');
            } else {
                closeAllDropdowns();
                menu.classList.add('active');
                trigger.classList.add('active');
            }
        });
        
        // Handle option selection
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                
                if (option.classList.contains('disabled')) return;
                
                // Update selected state
                options.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                
                // Update trigger text
                const value = option.getAttribute('data-value');
                const text = option.querySelector('.option-text').textContent;
                trigger.querySelector('.dropdown-value').textContent = text;
                
                // Update hidden select and config
                if (hiddenSelect) {
                    hiddenSelect.value = value;
                    updateConfigFromUI();
                    
                    // Show module recommendation modal if selecting Node.js target and Strict Mode is not already enabled
                    if (hiddenSelect.id === 'target' && value === 'node') {
                        const strictModeCheckbox = document.getElementById('strictMode');
                        if (strictModeCheckbox && !strictModeCheckbox.checked) {
                            showModuleModal();
                        }
                    }
                }
                
                // Close menu
                menu.classList.remove('active');
                trigger.classList.remove('active');
            });
        });
    });
    
    // Close all dropdowns when clicking outside
    document.addEventListener('click', () => {
        closeAllDropdowns();
    });
    
    // Close dropdowns on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllDropdowns();
        }
    });
}

function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.remove('active');
    });
    document.querySelectorAll('.dropdown-trigger').forEach(trigger => {
        trigger.classList.remove('active');
    });
}

// Encoding priority order and distribution percentages
let encodingPriority = ['Hexadecimal', 'Octal', 'Binary', 'JSFuck', 'Refractal'];
const priorityPercentages = [50, 25, 15, 10, 0];

const encodingDescriptions = {
    'Hexadecimal': '0x format (Zero-cost)',
    'Octal': '0o format (Zero-cost)',
    'Binary': '0b format (Zero-cost)',
    'JSFuck': 'Type coercion',
    'Refractal': 'Complex encoding (Slight cost)'
};

function initEncodingPriority() {
    const container = document.getElementById('encodingPriorityList');
    if (!container) return;
    
    // Load priority from localStorage if available
    const saved = localStorage.getItem('obfuslyEncodingPriority');
    if (saved) {
        try {
            encodingPriority = JSON.parse(saved);
        } catch (e) {
            console.warn('Failed to load encoding priority:', e);
        }
    }
    
    // Render the priority list
    renderEncodingPriority();
}

function renderEncodingPriority() {
    const container = document.getElementById('encodingPriorityList');
    if (!container) return;
    
    container.innerHTML = '';
    
    encodingPriority.forEach((encoding, index) => {
        const percentage = priorityPercentages[index];
        const item = document.createElement('div');
        item.className = 'encoding-priority-item';
        item.id = `priority-item-${index}`;
        item.style.cssText = `
            padding: 0.75rem;
            background-color: rgba(46, 107, 255, 0.1);
            border: 1px solid rgba(46, 107, 255, 0.3);
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            cursor: grab;
            transition: background-color 0.2s, border-color 0.2s;
        `;
        item.draggable = true;
        item.dataset.index = index;
        
        const content = document.createElement('div');
        content.style.cssText = 'flex: 1; display: flex; align-items: center; gap: 1rem;';
        content.innerHTML = `
            <div style="font-weight: 600; color: #2e6bff; min-width: 20px; text-align: center;">${index + 1}</div>
            <div style="flex: 1;">
                <div style="font-weight: 500; color: var(--text-primary);">${encoding}</div>
                <div style="font-size: 0.75rem; color: var(--text-secondary);">${encodingDescriptions[encoding]}</div>
            </div>
        `;
        
        const controls = document.createElement('div');
        controls.style.cssText = 'display: flex; align-items: center;';
        controls.innerHTML = `<div style="font-weight: 600; color: var(--text-secondary); min-width: 40px; text-align: right;">${percentage}%</div>`;
        
        item.appendChild(content);
        item.appendChild(controls);
        
        // Drag event handlers
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', index.toString());
            item.style.opacity = '0.5';
            item.style.background = 'rgba(46, 107, 255, 0.2)';
        });
        
        item.addEventListener('dragend', () => {
            item.style.opacity = '1';
            item.style.background = 'rgba(46, 107, 255, 0.1)';
            item.style.borderTop = 'none';
        });
        
        item.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            item.style.borderTop = '2px solid #2e6bff';
        });
        
        item.addEventListener('dragleave', () => {
            item.style.borderTop = 'none';
        });
        
        item.addEventListener('drop', (e) => {
            e.preventDefault();
            item.style.borderTop = 'none';
            const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
            if (fromIndex !== index) {
                swapEncodings(fromIndex, index);
            }
        });
        
        container.appendChild(item);
    });
    
    updateDistributionDisplay();
}

function moveEncodingUp(index) {
    if (index > 0) {
        [encodingPriority[index], encodingPriority[index - 1]] = [encodingPriority[index - 1], encodingPriority[index]];
        saveAndUpdateEncoding();
    }
}

function moveEncodingDown(index) {
    if (index < encodingPriority.length - 1) {
        [encodingPriority[index], encodingPriority[index + 1]] = [encodingPriority[index + 1], encodingPriority[index]];
        saveAndUpdateEncoding();
    }
}

function swapEncodings(fromIndex, toIndex) {
    // Simple swap of two positions
    const temp = encodingPriority[fromIndex];
    encodingPriority[fromIndex] = encodingPriority[toIndex];
    encodingPriority[toIndex] = temp;
    saveAndUpdateEncoding();
}

function saveAndUpdateEncoding() {
    localStorage.setItem('obfuslyEncodingPriority', JSON.stringify(encodingPriority));
    updateConfigFromPriority();
    renderEncodingPriority();
}

function updateConfigFromPriority() {
    // Update obfuscationConfig with the new distribution based on priority
    encodingPriority.forEach((encoding, index) => {
        const percentage = priorityPercentages[index];
        const configKey = `numbers.baseIntegerFormat.distribution.${encoding}`;
        
        // Helper to set nested property
        const setNestedProperty = (obj, path, value) => {
            const parts = path.split('.');
            let current = obj;
            for (let i = 0; i < parts.length - 1; i++) {
                const part = parts[i];
                if (!current[part]) current[part] = {};
                current = current[part];
            }
            current[parts[parts.length - 1]] = value;
        };
        
        setNestedProperty(obfuscationConfig, configKey, percentage);
    });
    
    // Save to localStorage
    saveConfigToLocalStorage();
}

function updateConfigFromUI() {
    // Helper to set nested property
    const setNestedProperty = (obj, path, value) => {
        const parts = path.split('.');
        let current = obj;
        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (!current[part]) current[part] = {};
            current = current[part];
        }
        current[parts[parts.length - 1]] = value;
    };

    // Gather all checkbox values
    document.querySelectorAll('input[type="checkbox"][data-config]').forEach(checkbox => {
        const configKey = checkbox.getAttribute('data-config');
        setNestedProperty(obfuscationConfig, configKey, checkbox.checked);
    });

    // Gather all select values
    document.querySelectorAll('select[data-config]').forEach(select => {
        const configKey = select.getAttribute('data-config');
        const value = select.value;
        
        // Try to parse as number first
        const numValue = parseInt(value);
        setNestedProperty(obfuscationConfig, configKey, isNaN(numValue) ? value : numValue);
    });

    // Gather slider values
    document.querySelectorAll('input[type="range"][data-config]').forEach(slider => {
        const configKey = slider.getAttribute('data-config');
        const value = parseInt(slider.value);
        setNestedProperty(obfuscationConfig, configKey, value);
    });

    console.log('Updated config:', obfuscationConfig);
    saveConfigToLocalStorage();
}

// ============================================================================
// LOCALSTORAGE MANAGEMENT
// ============================================================================

function saveConfigToLocalStorage() {
    try {
        localStorage.setItem('obfuslyConfig', JSON.stringify(obfuscationConfig));
        console.log('✓ Config saved to localStorage');
    } catch (error) {
        console.error('Failed to save config to localStorage:', error);
    }
}

function loadConfigFromLocalStorage() {
    try {
        const saved = localStorage.getItem('obfuslyConfig');
        if (saved) {
            const loadedConfig = JSON.parse(saved);
            
            // Deep merge loaded config with defaults
            const mergeConfigs = (target, source) => {
                for (const key in source) {
                    if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
                        if (!target[key]) target[key] = {};
                        mergeConfigs(target[key], source[key]);
                    } else {
                        target[key] = source[key];
                    }
                }
            };
            
            mergeConfigs(obfuscationConfig, loadedConfig);
            console.log('✓ Config loaded from localStorage');
            
            // Update UI to reflect loaded settings
            updateUIFromConfig();
            return true;
        }
    } catch (error) {
        console.error('Failed to load config from localStorage:', error);
    }
    return false;
}

function updateUIFromConfig() {
    // Helper to get nested property
    const getNestedProperty = (obj, path) => {
        const parts = path.split('.');
        let current = obj;
        for (const part of parts) {
            if (current && typeof current === 'object') {
                current = current[part];
            } else {
                return undefined;
            }
        }
        return current;
    };

    // Update checkboxes
    document.querySelectorAll('input[type="checkbox"][data-config]').forEach(checkbox => {
        const configKey = checkbox.getAttribute('data-config');
        const value = getNestedProperty(obfuscationConfig, configKey);
        if (value !== undefined) {
            checkbox.checked = value;
        }
    });

    // Update selects
    document.querySelectorAll('select[data-config]').forEach(select => {
        const configKey = select.getAttribute('data-config');
        const value = getNestedProperty(obfuscationConfig, configKey);
        if (value !== undefined) {
            select.value = value;
            
            // Update custom dropdown display if it exists
            const dropdown = select.closest('.custom-dropdown');
            if (dropdown) {
                const trigger = dropdown.querySelector('.dropdown-trigger');
                const selectedOption = dropdown.querySelector(`[data-value="${value}"]`);
                if (trigger && selectedOption) {
                    trigger.querySelector('.dropdown-value').textContent = selectedOption.querySelector('.option-text').textContent;
                }
            }
        }
    });

    // Update sliders
    document.querySelectorAll('input[type="range"][data-config]').forEach(slider => {
        const configKey = slider.getAttribute('data-config');
        const value = getNestedProperty(obfuscationConfig, configKey);
        if (value !== undefined) {
            slider.value = value;
            const valueSpan = document.getElementById(slider.id + 'Value');
            if (valueSpan) {
                valueSpan.textContent = value;
            }
        }
    });
    
    // Normalize distribution if it was loaded from localStorage
    setTimeout(() => {
        autoNormalizeDistribution();
        updateDistributionDisplay();
    }, 0);
}

function attachConfigListeners() {
    // Listen to all config elements
    document.querySelectorAll('[data-config]').forEach(element => {
        element.addEventListener('change', updateConfigFromUI);
        if (element.type === 'range') {
            element.addEventListener('input', (e) => {
                updateConfigFromUI();
                // Update display value for sliders
                const valueSpan = document.getElementById(element.id + 'Value');
                if (valueSpan) {
                    valueSpan.textContent = element.value;
                }
            });
        }
    });
}

function autoNormalizeDistribution(e) {
    // This is now handled by the priority system - keeping for backward compatibility
}

function updateSliderMaxValues() {
    // This is now handled by the priority system - keeping for backward compatibility
}

function updateDistributionDisplay() {
    // Always 100% with the new priority system
    const total = priorityPercentages.reduce((a, b) => a + b, 0);
    const totalSpan = document.getElementById('distributionTotal');
    if (totalSpan) {
        totalSpan.textContent = total;
    }
}

// ============================================================================
// MODULE TARGET STRICT MODE RECOMMENDATION
// ============================================================================

function showModuleModal() {
    const modal = document.getElementById('moduleStrictModeModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeModuleModal() {
    const modal = document.getElementById('moduleStrictModeModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function enableStrictModeAndClose() {
    document.querySelector('input[name="strictMode"]').checked = true;
    updateConfig();
    closeModuleModal();
}

// ============================================================================
// PARTNERS PROGRAM - WIDGET CUSTOMIZER
// ============================================================================

// Core widget code from Frontend/Widget/widget.html
const WIDGET_SCRIPT = `(function() {
    var collapsedWidth = 62;
    var expandedWidth = 156;
    var widgetHeight = 62;
    var logoHeight = 35;
    var iconSize = 26;

    var widgetContainer = document.createElement('div');
    widgetContainer.style.position = "fixed";
    widgetContainer.style.bottom = "20px";
    widgetContainer.style.{{POSITION}};
    widgetContainer.style.width = expandedWidth + "px";
    widgetContainer.style.height = widgetHeight + "px";
    widgetContainer.style.borderRadius = "18px";
    widgetContainer.style.backgroundColor = "{{BG_COLOR}}";
    widgetContainer.style.display = "flex";
    widgetContainer.style.alignItems = "center";
    widgetContainer.style.cursor = "pointer";
    widgetContainer.style.boxShadow = "rgba(0, 0, 0, 0.5) 2px 2px 10px";
    widgetContainer.style.transition = "width 0.42s ease, box-shadow 0.22s ease";
    widgetContainer.style.overflow = "hidden";
    widgetContainer.style.zIndex = "9999";
    widgetContainer.style.border = "1px solid {{BORDER_COLOR}}";

    var button = document.createElement('a');
    button.href = "https://obfusly.com";
    button.target = "_blank";
    button.style.display = "flex";
    button.style.width = "100%";
    button.style.height = "100%";
    button.style.position = "relative";
    button.style.textDecoration = "none";
    button.style.color = "inherit";
    button.style.overflow = "hidden";
    button.style.fontFamily = "'Space Grotesk', sans-serif";
    button.style.fontSize = "12px";

    var iconMark = document.createElement('img');
    iconMark.style.position = "absolute";
    iconMark.style.left = "20px";
    iconMark.style.top = "15px";
    iconMark.style.width = iconSize + "px";
    iconMark.style.height = iconSize + "px";
    iconMark.style.objectFit = "contain";
    iconMark.style.transition = "opacity 0.18s ease";
    iconMark.style.opacity = "0";
    iconMark.src = "{{ICON}}";

    var logoStrip = document.createElement('img');
    logoStrip.style.position = "absolute";
    logoStrip.style.left = "10px";
    logoStrip.style.top = "2px";
    logoStrip.style.height = logoHeight + "px";
    logoStrip.style.width = "114px";
    logoStrip.style.display = "block";
    logoStrip.style.flexShrink = "0";
    logoStrip.style.opacity = "1";
    logoStrip.style.transform = "translateX(0)";
    logoStrip.style.transition = "opacity 0.18s ease";
    logoStrip.src = "{{LOGO}}";

    button.appendChild(iconMark);
    button.appendChild(logoStrip);
    widgetContainer.appendChild(button);

    document.body.appendChild(widgetContainer);

    widgetContainer.addEventListener("mouseover", function() {
        iconMark.style.opacity = "1";
        logoStrip.style.opacity = "0";
    });

    widgetContainer.addEventListener("mouseout", function() {
        iconMark.style.opacity = "0";
        logoStrip.style.opacity = "1";
    });
})();`;

function updateWidget() {
    const theme = document.querySelector('input[name="theme"]:checked')?.value || 'light';
    const position = document.querySelector('input[name="position"]:checked')?.value || 'bottom-left';

    // Update preview frame theme
    const previewFrame = document.getElementById('previewFrame');
    if (previewFrame) {
        previewFrame.classList.toggle('dark-theme', theme === 'dark');
        previewFrame.innerHTML = ''; // Clear previous widget
        
        // Render an interactive widget preview with hover effects
        const bgColor = theme === 'dark' ? '#000' : '#fff';
        const iconImg = theme === 'dark' ? 'Images/Black/logo-black.png' : 'Images/White/logo-white.png';
        const nameLogo = theme === 'dark' ? 'Images/Black/obfusly-black.png' : 'Images/White/obfusly-white.png';
        const borderColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
        const positionStyle = position === 'bottom-left' ? 'left: 20px;' : 'right: 20px;';
        
        const widgetHTML = `
            <div id="previewWidget" style="position: absolute; bottom: 20px; ${positionStyle} width: 156px; height: 62px; border-radius: 18px; background: ${bgColor}; display: flex; align-items: center; justify-content: center; box-shadow: rgba(0, 0, 0, 0.5) 2px 2px 10px; cursor: pointer; z-index: 10; overflow: hidden; border: 1px solid ${borderColor};">
                <img id="previewIcon" src="${iconImg}" alt="Obfusly" style="position: absolute; left: 20px; width: 26px; height: 26px; object-fit: contain; opacity: 0; transition: opacity 0.18s ease;">
                <img id="previewLogo" src="${nameLogo}" alt="Obfusly" style="position: absolute; left: 10px; width: 114px; height: 35px; object-fit: contain; opacity: 1; transition: opacity 0.18s ease;">
            </div>
        `;
        
        previewFrame.innerHTML = widgetHTML;
        
        // Add hover event listeners to the preview widget
        const previewWidget = previewFrame.querySelector('#previewWidget');
        const previewIcon = previewFrame.querySelector('#previewIcon');
        const previewLogo = previewFrame.querySelector('#previewLogo');
        
        if (previewWidget && previewIcon && previewLogo) {
            previewWidget.addEventListener('mouseover', function() {
                previewIcon.style.opacity = '1';
                previewLogo.style.opacity = '0';
            });
            
            previewWidget.addEventListener('mouseout', function() {
                previewIcon.style.opacity = '0';
                previewLogo.style.opacity = '1';
            });
        }
    }

    // Update code output
    updateCodeOutput(theme, position);
}

function updateCodeOutput(theme, position) {
    const bgColor = theme === 'dark' ? '"#000"' : '"#fff"';
    const posStyle = position === 'bottom-left' ? 'left = "20px"' : 'right = "20px"';
    const icon = theme === 'dark' ? 'https://obfusly.com/Images/Black/logo-black.png' : 'https://obfusly.com/Images/White/logo-white.png';
    const nameLogo = theme === 'dark' ? 'https://obfusly.com/Images/Black/obfusly-black.png' : 'https://obfusly.com/Images/White/obfusly-white.png';
    const borderColor = theme === 'dark' ? '"rgba(255,255,255,0.1)"' : '"rgba(0,0,0,0.1)"';
    
    const scriptCode = WIDGET_SCRIPT
        .replace('{{POSITION}}', posStyle)
        .replace('{{BG_COLOR}}', bgColor)
        .replace('{{ICON}}', icon)
        .replace('{{LOGO}}', nameLogo)
        .replace('{{BORDER_COLOR}}', borderColor);

    // Store codes for copying
    window.widgetCodes = {
        js: scriptCode,
        html: generateHTMLCode(scriptCode)
    };

    // Display current tab
    const activeTab = document.querySelector('.code-tab-btn.active')?.getAttribute('onclick') || 'switchCodeTab(\'js\')';
    const match = activeTab.match(/'([^']+)'/);
    const currentTab = match ? match[1] : 'js';

    const codeOutput = document.getElementById('codeOutput');
    if (codeOutput) {
        codeOutput.textContent = window.widgetCodes[currentTab] || scriptCode;
    }
}

function generateHTMLCode(scriptCode) {
    return `<!-- Obfusly Sponsorship Widget -->
<script>
${scriptCode}
</script>`;
}

function switchCodeTab(tabName) {
    // Update button states
    document.querySelectorAll('.code-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Update code display
    const codeOutput = document.getElementById('codeOutput');
    if (codeOutput && window.widgetCodes) {
        codeOutput.textContent = window.widgetCodes[tabName] || '';
    }
}

function copyCode() {
    const codeOutput = document.getElementById('codeOutput');
    const copyBtn = document.querySelector('.copy-btn-icon');
    
    if (codeOutput && codeOutput.textContent && copyBtn) {
        const code = codeOutput.textContent;
        navigator.clipboard.writeText(code).then(() => {
            // Store original SVG
            const originalSVG = copyBtn.innerHTML;
            
            // Change icon to checkmark
            copyBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"></path></svg>';
            copyBtn.classList.add('copied');
            
            // Show toast notification
            showToast('Copied to clipboard', 'success');
            
            // Revert after 2 seconds
            setTimeout(() => {
                copyBtn.classList.remove('copied');
                copyBtn.innerHTML = originalSVG;
            }, 2000);
        }).catch((err) => {
            console.error('Copy error:', err);
            alert('Failed to copy code. Please try again.');
        });
    } else {
        alert('No code to copy. Please refresh the page.');
    }
}

// Initialize widget on page load
document.addEventListener('DOMContentLoaded', function() {
    const previewFrame = document.getElementById('previewFrame');
    if (previewFrame) {
        updateWidget();
    }


    const modal = document.getElementById('moduleStrictModeModal');
    if (modal) {
        modal.style.display = 'none';
    }
});

function enableStrictModeAndClose() {
    // Enable strict mode
    const strictModeCheckbox = document.getElementById('strictMode');
    if (strictModeCheckbox) {
        strictModeCheckbox.checked = true;
        // Trigger change event to update config
        strictModeCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
    }
    
    // Close modal
    closeModuleModal();
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOMContentLoaded fired');
    
    // Initialize mobile menu close handler and account menu close handler
    document.addEventListener('click', (e) => {
        const mobileNav = document.getElementById('mobile-nav-menu');
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const body = document.body;
        const accountDropdown = document.getElementById('accountDropdown');
        const accountBtn = document.getElementById('nav-account-btn');
        
        if (mobileNav && mobileNav.classList.contains('active')) {
            // Close if clicking outside the header
            if (!e.target.closest('header')) {
                mobileNav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                body.classList.remove('mobile-menu-open');
            }
        }
        
        // Close account dropdown if clicking outside it
        if (accountDropdown && accountDropdown.style.display !== 'none') {
            if (!e.target.closest('#accountDropdown') && e.target !== accountBtn) {
                accountDropdown.style.display = 'none';
            }
        }
    });
    
    initCodeAnimation();
    startTestimonialScroll();
    initCustomDropdowns();
    attachConfigListeners();
    
    // Initialize encoding priority system
    initEncodingPriority();
    
    // Load saved config from localStorage, then update UI
    loadConfigFromLocalStorage();

    // Make code display selectable and handle Ctrl+A/Ctrl+C
    const codeDisplay = document.getElementById('codeDisplay');
    if (codeDisplay) {
        codeDisplay.addEventListener('click', () => {
            codeDisplay.focus();
        });
        
        codeDisplay.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
                e.preventDefault();
                const range = document.createRange();
                range.selectNodeContents(codeDisplay);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }
        });
    }

    // Attach pricing button listeners
    console.log('Looking for pricing buttons...');
    const freeBtn = document.getElementById('freeBtn');
    const professionalBtn = document.getElementById('professionalBtn');
    const enterpriseBtn = document.getElementById('enterpriseBtn');
    
    console.log('freeBtn:', freeBtn);
    console.log('professionalBtn:', professionalBtn);
    console.log('enterpriseBtn:', enterpriseBtn);
    
    if (freeBtn) {
        console.log('Attaching listener to freeBtn');
        freeBtn.addEventListener('click', function(e) {
            console.log('FREE BUTTON CLICKED');
            e.preventDefault();
            handlePricingClick('free');
        });
    }
    
    if (professionalBtn) {
        console.log('Attaching listener to professionalBtn');
        professionalBtn.addEventListener('click', function(e) {
            console.log('PROFESSIONAL BUTTON CLICKED');
            e.preventDefault();
            handlePricingClick('professional');
        });
    }

    if (enterpriseBtn) {
        console.log('Attaching listener to enterpriseBtn');
        enterpriseBtn.addEventListener('click', function(e) {
            console.log('ENTERPRISE BUTTON CLICKED');
            e.preventDefault();
            handlePricingClick('enterprise');
        });
    }

    await restoreSession();
    updatePricingPageDisplay();

    // Handle post-Stripe redirect success
    const params = new URLSearchParams(window.location.search);
    if (params.get('checkout') === 'success') {
        const plan = params.get('plan') || 'your new';
        showToast('✓ Payment successful! Your ' + plan + ' plan is now active.', 'success');
        // Refresh user data so plan is up-to-date
        await restoreSession();
        updateAccountMenuData();
        history.replaceState({}, '', '/');
        navigateTo('account');
    }
});
