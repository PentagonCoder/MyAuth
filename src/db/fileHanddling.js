import fs from 'fs';
import path from 'path';

const filePath = path.join(__dirname, 'users.json');

const readUsersFromFile = () => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading users from file:', err);
    return [];
  }
};

const writeUsersToFile = (users) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('Error writing users to file:', err);
  }
};

export { readUsersFromFile, writeUsersToFile };