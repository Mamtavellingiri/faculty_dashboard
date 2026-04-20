document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMsg = document.getElementById('errorMsg');

    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token && user) {
        redirectBasedOnRole(user.role);
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const btn = loginForm.querySelector('.btn');
            
            try {
                btn.textContent = 'Logging in...';
                btn.disabled = true;
                
                const response = await api.auth.login({ email, password });
                
                // Store token and user data
                localStorage.setItem('token', response.accessToken);
                localStorage.setItem('user', JSON.stringify({
                    id: response.id,
                    email: response.email,
                    role: response.role,
                    profileId: response.profileId
                }));

                redirectBasedOnRole(response.role);
            } catch (err) {
                errorMsg.textContent = err.message || 'Login failed. Try again.';
                errorMsg.style.display = 'block';
                btn.textContent = 'Sign In';
                btn.disabled = false;
            }
        });
    }
});

function redirectBasedOnRole(role) {
    if (role === 'admin') {
        window.location.href = 'admin-dashboard.html';
    } else if (role === 'faculty') {
        window.location.href = 'faculty-dashboard.html';
    }
}

function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}
