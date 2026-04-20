const db = require('../config/db');

exports.getProfile = async (req, res) => {
    try {
        const [profiles] = await db.execute('SELECT * FROM faculty_profiles WHERE user_id = ?', [req.userId]);
        
        if (profiles.length === 0) {
            return res.status(404).json({ message: 'Profile not found.' });
        }
        
        const profile = profiles[0];
        
        // Fetch performance
        const [performance] = await db.execute('SELECT * FROM performance WHERE faculty_id = ? ORDER BY academic_year DESC', [profile.id]);
        
        res.status(200).json({
            profile: profile,
            performance: performance
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving profile data', error: err.message });
    }
};

exports.addPerformance = async (req, res) => {
    try {
        const { academic_year, teaching_score, research_score, publications, publications_score, other_score, remarks } = req.body;
        
        // First get the profile ID for this user
        const [profiles] = await db.execute('SELECT id FROM faculty_profiles WHERE user_id = ?', [req.userId]);
        if (profiles.length === 0) {
            return res.status(404).json({ message: 'Profile not found.' });
        }
        const profileId = profiles[0].id;
        
        // Calculate total score
        const total_score = parseFloat(teaching_score || 0) + parseFloat(research_score || 0) + parseFloat(publications_score || 0) + parseFloat(other_score || 0);

        const sql = `INSERT INTO performance 
            (faculty_id, academic_year, teaching_score, research_score, publications, publications_score, other_score, total_score, remarks) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            teaching_score = VALUES(teaching_score), 
            research_score = VALUES(research_score), 
            publications = VALUES(publications), 
            publications_score = VALUES(publications_score), 
            other_score = VALUES(other_score), 
            total_score = VALUES(total_score),
            remarks = VALUES(remarks)`;
            
        await db.execute(sql, [profileId, academic_year, teaching_score || 0, research_score || 0, publications || 0, publications_score || 0, other_score || 0, total_score, remarks || '']);

        res.status(200).json({ message: 'Performance recorded successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error saving performance data', error: err.message });
    }
};
