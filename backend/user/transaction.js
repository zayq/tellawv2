import { database } from "/backend/database/database.js";

export class Transaction {
    constructor(type){
      this.symbol = document.getElementById("symbol").value;
      this.ammount = parseFloat(document.getElementById("ammount").value);
      this.type = type
    }
    async transac(){
    
      this.validTransac()
    
      const userCryptoRef = database.ref(`users/${id}/cryptos/${this.symbol}`);
    
      userCryptoRef.transaction((currentValue) => {
        if (!currentValue) {
          return this.ammount
        }
        let newValue;
  
        if (this.type) {newValue = currentValue + this.ammount;} 
  
        else {newValue = currentValue - this.ammount;}
  
        return newValue >= 0 ? newValue : currentValue;
      })
      .then(() => {
        loadcryptos();
      })
      .catch((error) => {
        console.error('Error adding crypto:', error);
      });
    }
  
    async validTransac(){
      if (!this.symbol.trim() || this.ammount < 0) {
        console.error('Crypto name or amount is empty');
        return;
      }
      try {
        await getcryptoprice(this.symbol);
      } catch (error) {
        alert(`This is not a valid crypto ${this.symbol}:`, error);
        return;
      }
      return true
    }
  }