import bcrypt from 'bcryptjs';

const users =[
  {
    name: 'Admin User',
    email: 'admin@email.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true
  },
  {
    name: 'Brianna',
    email: 'brianna@email.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false
  },
  {
    name: 'Ambrose',
    email: 'ambrose@email.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false
  }
];

export default users;
