
import db from './db';
import { AuthenticatedUser, User } from '../interfaces/userInterfaces';

import { emptyOrRows } from '../lib/helper';

export const fetchAllUsersSql = async () => {
  const rows = await db.query(`SELECT id, fullname, email FROM user`);
  console.log({rows})
  const users: User[] = emptyOrRows(rows);
  console.log({users})
  return users;
}
