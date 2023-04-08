import { User } from "/backend/user/user.js";
import { CryptoWallet } from "/backend/user/wallets.js";
let user = new User()
await user.setUserData();
console.log(user)