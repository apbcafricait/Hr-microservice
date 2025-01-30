import bcrypt from 'bcryptjs';

const decryptPassword = async (password, encryptedPassword) => {
    return await bcrypt.compare(password, encryptedPassword);

}
export {decryptPassword}