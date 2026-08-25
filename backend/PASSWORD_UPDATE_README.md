# Password Update Documentation

## Summary
All local database user passwords have been rotated for development. New temporary password (development only): **40c9c2dbc4cd7ad63ef66254**

## Files Updated

### 1. Database Initialization Files
- `backend/database/init.sql` - Main initialization script
- `backend/database/init.sql.backup` - Backup initialization script
- `backend/local_data.sql` - Local data dump

### 2. New Files Created
- `backend/database/update_passwords.sql` - SQL script to update existing database passwords
- `backend/update-passwords.bat` - Windows batch script to run the update

## Updated User Accounts

The following development user accounts have been updated to use the temporary development password listed above:

1. **superadmin@nitaclinics.local** - Super Administrator
2. **admin@nitaclinics.local** - System Administrator
3. **admin2@nitaclinics.local** - Admin User
4. **staff@nitaclinics.local** - Staff User
5. **support@nitaclinics.local** - Support User

## How to Apply Changes

### For New Database Setup
The new password will be automatically applied when you run the initialization scripts.

### For Existing Database
Run one of the following commands:

#### Option 1: Using the batch script (Windows)
```bash
cd backend
update-passwords.bat
```

#### Option 2: Using psql directly
```bash
cd backend
psql -h localhost -p 5432 -U postgres -d dental_db -f database/update_passwords.sql
```

#### Option 3: Manual SQL execution
Connect to your database and run:
```sql
UPDATE users 
SET password = '$2a$10$.7PBd05WH8KTU5ZpOztbS.LR8ACk4KCwtxO72lgyvucupuYmk8p0G',
    updated_at = NOW()
WHERE email IN (
  'superadmin@nitaclinics.local',
  'admin@nitaclinics.local',
  'admin2@nitaclinics.local',
  'staff@nitaclinics.local',
  'support@nitaclinics.local'
);
```

## Password Hash Details

- **Plain Text Password**: Admin@123
- **Bcrypt Hash**: $2b$10$ikUlxQ8UQd4aDIU2jRqoBOGIhgEgc7INYc4jjPMOqSQKP63PxqgNe
- **Bcrypt Rounds**: 10

## Security Notes

⚠️ **Important**: This password is for local development only. For production environments:
1. Use strong, unique passwords for each user
2. Never commit passwords or hashes to version control
3. Use environment variables for sensitive data
4. Implement proper password policies
5. Enable two-factor authentication where possible

## Testing the Update

After applying the changes, test login with:
- Email: Any of the accounts listed above
- Password: [rotated]

## Rollback

If you need to rollback, you can restore from your database backup or use the old password hashes from your git history.
