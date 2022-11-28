import bcrypt from 'bcrypt';
import postgres from 'postgres';
const saltRounds = 10;

const sql = postgres({
  host: "localhost",
  port: 5432,
  database: "solid_start_auth_made_secure",
  username: "anes",
});

let users = [];
export const pepper: string = 'this_is_some_really_secure_pepper';
export const db = {
  user: {
    async create({ data }) {
      return await sql`INSERT INTO application_users (username, digested_password) 
          VALUES (${data.username}, ${bcrypt.hashSync(data.password + pepper, saltRounds).toString()})
          RETURNING *;`;
    },
    async findUnique({ where: { username = undefined, id = undefined } }) {
      if (id !== undefined && id.toString() !== 'NaN') {
        // return users.find((user) => user.id === id);
        const result = await sql`SELECT * FROM application_users WHERE id = ${id};`;
        return result.at(0);
      } else if (username !== undefined) {
        // return users.find((user) => user.username === username);
        const result = await sql`SELECT * FROM application_users WHERE username = ${username} LIMIT 1;`;
        return result.at(0);
      }
      return null;
    },
  },
};
