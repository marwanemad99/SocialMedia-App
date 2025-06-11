import bcrypt from 'bcrypt';

export const generateHash = ({ plainText = "", saltRounds = process.env.SALT }) => {
  return bcrypt.hashSync(plainText, parseInt(saltRounds));

}

export const compareHash = ({ plainText = "", hash = "" } = {}) => {
  return bcrypt.compareSync(plainText, hash);
}