import { database } from "/backend/database/database.js";
import { getCryptoPrice} from "/backend/api/crypto/crypto.js";

export class Transaction {
    constructor(symbol, ammount, type, id, walletid, what){
      this.symbol = symbol;
      this.ammount = ammount;
      this.type = type
      this.id = id
      this.walletid = walletid
      this.what = what
    }
    async transac(){
    
      const userCryptoRef = database.ref(`users/${this.id}/wallets/${this.walletid}/${what}/${this.symbol}`);
      
      userCryptoRef.transaction((currentValue) => {
        if (!currentValue) {
          return parseFloat(this.ammount);
        }
        let newValue = 0;
        if (this.type) {
          newValue = currentValue + parseFloat(this.ammount);
        } else {
          newValue = currentValue - parseFloat(this.ammount);
        }
      
        return newValue >= 0 ? parseFloat(newValue) : currentValue;
      })
      .then(() => {
        console.log(`${what} edited!`);
      })
      .catch((error) => {
        console.error(`Error adding ${what} :`, error);
      });
    }
  }

export async function createWallet(name, type, logo, userId){
  const userWalletsRef = database.ref(`users/${userId}/wallets`);
  const newWalletRef = userWalletsRef.child(name);
  const walletData = {
    type: type,
    logo: logo
  };
  
  try {
    await newWalletRef.set(walletData);
    console.log(`Wallet ${name} created with type ${type} for user ${userId}`);
  } catch (error) {
    console.error(`Error creating wallet ${name} for user ${userId}:`, error);
  }
}




