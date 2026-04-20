document.addEventListener('DOMContentLoaded', async () => {
    // Check auth
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user || user.role !== 'admin') {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('userEmail').textContent = user.email;

    try {
        await loadMetrics();
        await loadFaculties();
    } catch (err) {
        console.error('Failed to load dashboard data:', err);
        alert('Error loading dashboard data. ' + err.message);
    }
});

async function loadMetrics() {
    const metrics = await api.admin.getMetrics();
    
    // Animate numbers
    animateValue("totalFaculty", 0, metrics.total_faculties, 1000);
    document.getElementById('avgScore').textContent = metrics.average_score;
    animateValue("totalPublications", 0, metrics.total_publications, 1000);
}

async function loadFaculties() {
    const faculties = await api.admin.getFaculties();
    const tbody = document.getElementById('facultyTableBody');
    tbody.innerHTML = '';

    faculties.forEach(f => {
        const tr = document.createElement('tr');
        
        let statusBadge = '';
        if (f.latest_score) {
            const score = parseFloat(f.latest_score);
            if (score >= 80) statusBadge = '<span style="color: #10B981; font-weight: 600;">Excellent</span>';
            else if (score >= 60) statusBadge = '<span style="color: #F59E0B; font-weight: 600;">Good</span>';
            else statusBadge = '<span style="color: #EF4444; font-weight: 600;">Needs Improvement</span>';
        } else {
            statusBadge = '<span style="color: #6B7280;">No Data</span>';
        }

        tr.innerHTML = `
            <td style="font-weight: 500;">${f.name}</td>
            <td>${f.department}</td>
            <td>${f.designation}</td>
            <td>${f.latest_year || '-'}</td>
            <td style="font-weight: bold; color: var(--primary);">${f.latest_score ? parseFloat(f.latest_score).toFixed(1) : '-'}</td>
            <td>${statusBadge}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Helper to animate metrics
function animateValue(id, start, end, duration) {
    if (start === end) return;
    const obj = document.getElementById(id);
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}
