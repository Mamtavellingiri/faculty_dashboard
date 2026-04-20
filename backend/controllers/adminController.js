const db = require('../config/db');

exports.getAllFaculties = async (req, res) => {
    try {
        const sql = `
            SELECT 
                fp.id, fp.name, fp.department, fp.designation, u.email,
                (SELECT total_score FROM performance p WHERE p.faculty_id = fp.id ORDER BY academic_year DESC LIMIT 1) as latest_score,
                (SELECT academic_year FROM performance p WHERE p.faculty_id = fp.id ORDER BY academic_year DESC LIMIT 1) as latest_year
            FROM faculty_profiles fp
            JOIN users u ON fp.user_id = u.id
        `;
        const [faculties] = await db.execute(sql);
        res.status(200).json(faculties);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving faculties', error: err.message });
    }
};

exports.getSystemMetrics = async (req, res) => {
    try {
        const [facultyCount] = await db.execute('SELECT COUNT(*) as count FROM faculty_profiles');
        const [avgScore] = await db.execute('SELECT AVG(total_score) as average FROM performance');
        const [totalPublications] = await db.execute('SELECT SUM(publications) as total_pub FROM performance');

        res.status(200).json({
            total_faculties: facultyCount[0].count || 0,
            average_score: avgScore[0].average ? parseFloat(avgScore[0].average).toFixed(2) : 0,
            total_publications: totalPublications[0].total_pub || 0
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching metrics', error: err.message });
    }
};
