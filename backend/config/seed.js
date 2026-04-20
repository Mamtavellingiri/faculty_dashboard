const bcrypt = require('bcrypt');
const db = require('./db');

async function seedDatabase() {
    try {
        console.log('Seeding database...');
        
        const saltRows = 10;
        const passwordHash = await bcrypt.hash('Admin@123', saltRows);

        // Update default users with real hashes instead of placeholder
        await db.execute("UPDATE users SET password = ? WHERE email IN ('admin@fapd.edu', 'faculty1@fapd.edu', 'faculty2@fapd.edu')", [passwordHash]);

        console.log('✅ Database seeded successfully. Passwords updated for admin@fapd.edu, faculty1@fapd.edu, and faculty2@fapd.edu to "Admin@123".');
        process.exit();
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seedDatabase();
