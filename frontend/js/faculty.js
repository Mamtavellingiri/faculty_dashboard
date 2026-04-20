let chartInstance = null;

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user || user.role !== 'faculty') {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('userEmail').textContent = user.email;

    try {
        await loadProfileData();
    } catch (err) {
        console.error('Failed to load profile:', err);
        alert('Error loading profile data. ' + err.message);
    }

    // Handle form submission
    document.getElementById('performanceForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const data = {
            academic_year: document.getElementById('acadYear').value,
            teaching_score: document.getElementById('teachingScore').value,
            research_score: document.getElementById('researchScore').value,
            publications: document.getElementById('pubCount').value,
            publications_score: document.getElementById('pubScore').value,
            other_score: document.getElementById('otherScore').value,
            remarks: document.getElementById('remarks').value,
        };

        const msgDiv = document.getElementById('perfMsg');
        
        try {
            await api.faculty.addPerformance(data);
            msgDiv.textContent = 'Performance submitted successfully!';
            msgDiv.style.color = 'var(--secondary)';
            
            // Reload data
            await loadProfileData();
            document.getElementById('performanceForm').reset();
            
            setTimeout(() => msgDiv.textContent = '', 3000);
        } catch (err) {
            msgDiv.textContent = err.message || 'Error submitting performance.';
            msgDiv.style.color = '#ef4444';
        }
    });
});

async function loadProfileData() {
    const data = await api.faculty.getProfile();
    const profile = data.profile;
    const perfs = data.performance;

    // Update Profile Header
    document.getElementById('profileName').textContent = profile.name;
    document.getElementById('profileDetails').textContent = `${profile.department} - ${profile.designation}`;
    document.getElementById('avatarInitial').textContent = profile.name.charAt(0);

    // Update Table
    const tbody = document.getElementById('perfTableBody');
    tbody.innerHTML = '';
    
    const years = [];
    const scores = [];

    // Sort to ascending for chart
    const chartPerfs = [...perfs].sort((a, b) => a.academic_year.localeCompare(b.academic_year));
    
    chartPerfs.forEach(p => {
        years.push(p.academic_year);
        scores.push(p.total_score);
    });

    // Populate table (descending order)
    perfs.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-weight: 500;">${p.academic_year}</td>
            <td>${p.teaching_score}</td>
            <td>${p.research_score}</td>
            <td>${p.publications_score} (${p.publications})</td>
            <td>${p.other_score}</td>
            <td style="font-weight: bold; color: var(--primary);">${p.total_score}</td>
        `;
        tbody.appendChild(tr);
    });

    // Update Chart
    updateChart(years, scores);
}

function updateChart(labels, data) {
    const ctx = document.getElementById('scoreChart').getContext('2d');
    
    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Score',
                data: data,
                borderColor: '#4F46E5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                borderWidth: 2,
                pointBackgroundColor: '#10B981',
                pointRadius: 4,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}
