import sqlite3 from 'sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

// Database file path
const dbPath = path.join(process.cwd(), 'users.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    return;
  }
  console.log('Connected to SQLite database');
  initializeDatabase();
});

// Initialize database tables
function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME,
      reset_token TEXT,
      reset_token_expiry INTEGER,
      admin_id TEXT,
      department TEXT,
      role TEXT,
      status TEXT DEFAULT 'active'
    )
  `, (err) => {
    if (err) {
      console.error('Error creating users table:', err);
      return;
    }
    console.log('Users table created or already exists');
    createDefaultUsers();
  });
}

// Create default users if none exist
async function createDefaultUsers() {
  const defaultUsers = [
    {
      id: 'user1',
      name: 'Test User',
      password: 'password123',
      status: 'active'
    },
    {
      id: 'demo',
      name: 'Demo User',
      password: 'demo123',
      status: 'active'
    }
  ];

  for (const user of defaultUsers) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    
    db.get('SELECT id FROM users WHERE id = ?', [user.id], (err, row) => {
      if (err) {
        console.error('Error checking user:', err);
        return;
      }
      
      if (!row) {
        db.run(
          'INSERT INTO users (id, name, password_hash, status) VALUES (?, ?, ?, ?)',
          [user.id, user.name, hashedPassword, user.status],
          (err) => {
            if (err) {
              console.error('Error creating default user:', err);
            } else {
              console.log(`Default user ${user.id} created`);
            }
          }
        );
      }
    });
  }
}

// User operations
export const userOperations = {
  db, // Expose the database instance
  // Find user by ID
  findById: (id: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  // Create new user
  create: async (userData: {
    id: string;
    name: string;
    email?: string;
    password: string;
    adminId?: string;
    department?: string;
    role?: string;
    status?: string;
  }): Promise<any> => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO users (
          id, name, email, password_hash, admin_id, department, role, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userData.id,
          userData.name,
          userData.email,
          hashedPassword,
          userData.adminId,
          userData.department,
          userData.role,
          userData.status || 'active'
        ],
        function(err) {
          if (err) reject(err);
          else resolve({ ...userData });
        }
      );
    });
  },

  // Update user
  update: (id: string, updates: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      const setClause = Object.keys(updates)
        .map(key => `${key} = ?`)
        .join(', ');
      
      db.run(
        `UPDATE users SET ${setClause} WHERE id = ?`,
        [...Object.values(updates), id],
        function(err) {
          if (err) reject(err);
          else resolve({ id, ...updates });
        }
      );
    });
  },

  // Delete user
  delete: (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM users WHERE id = ?', [id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  },

  // Verify password
  verifyPassword: async (password: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
  },

  // Update last login
  updateLastLogin: (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
        [id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }
};

export default db; 