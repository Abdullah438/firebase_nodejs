import { faker } from "@faker-js/faker";

const createUsers = (limit) => {
  const users = [];
  for (let i = 0; i < limit; i++) {
    users.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
    });
  }
  return users;
};

const limit = process.argv[2] || 1;

const users = createUsers(limit);
console.log(JSON.stringify(users));
