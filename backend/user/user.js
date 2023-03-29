import { database } from "/backend/database/database.js";
import { Transaction } from "/backend/user/transaction.js";
import { auth_token } from "/backend/user/cookies.js";
import { getCryptoPrice} from "/backend/api/crypto/crypto.js";

function getuser() {
    const userId = auth_token();
  
    if (!userId) {
      console.error('User ID cookie not found');
      return null;
    }
  
    return firebase.database().ref("users/" + userId).once('value')
      .then((dataSnapshot) => {
        if (!dataSnapshot.exists()) {
          throw new Error(`User ${userId} not found.`);
        }
  
        var user = dataSnapshot.val()
  
        return user;
      })
      .catch((error) => {
        console.error("Unexpected error:", error);
      });
  }


export class User {

    async setUserData() {
      const user = await getuser();
      this.email = user.email;
      this.username = user.username;
      this.id = auth_token();
      this.cryptos = user.cryptos;
      this.profilepicture = user.profilepicture;
      this.wallets = user.wallets;
      return this;
    }
  
    async editCrypto(transactionType) {
      let transac = new Transaction(transactionType);
      transac.transac();
      this.loadCryptos();
    }
    async getBalance() {
      try {
        const userWalletsRef = database.ref('users/' + this.id + '/wallets');
        let balance = 0;
        const snapshot = await userWalletsRef.once('value');
        const wallets = snapshot.val();
        for (const wallet in wallets) {
          for (const crypto in wallets[wallet].cryptos) {
            const price = parseFloat(await getCryptoPrice(crypto));
            const holdingvalue = price * wallets[wallet].cryptos[crypto];
            balance += holdingvalue;
          }
        }
        return balance.toFixed(2);
      } catch (error) {
        console.error('Error retrieving wallets data: ', error);
      }
    }
  }

