-- Update development users' passwords to Admin@123 (development only)
UPDATE users
SET password = '$2b$10$ikUlxQ8UQd4aDIU2jRqoBOGIhgEgc7INYc4jjPMOqSQKP63PxqgNe',
    updated_at = NOW()
WHERE email IN (
  'superadmin@nitaclinics.local',
  'admin@nitaclinics.local',
  'admin2@nitaclinics.local',
  'staff@nitaclinics.local',
  'support@nitaclinics.local'
);