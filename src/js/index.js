const showBtn = document.querySelector(".transaction__loadBtn");
const transactionSct = document.querySelector(".transaction");
const transactionItems = document.querySelector(".transaction__items");
const transactionSearch = document.querySelector(".search__container");
const transactionBody = document.querySelector(".transaction__body");
const transactionHeader = document.querySelector('.transaction__subtitle');
const msgResult = document.createElement("div");

const sortPrice = document.querySelector('.transaction__price .chevaron');
const sortDate = document.querySelector('.transaction__date .chevaron');
let isAscending = true;



let allTransactiondata = [];
let searchInput = [];
const filters = {
  searchItems: "",
};



// Transactions class

class transactions {

  static async renderTransactions(_transactions, _filter) {
    if (_filter.searchItems) {
      axios
        .get(`http://localhost:3000/transactions?refId_like=${_filter.searchItems}`)
        .then((res) => {
          this.showTransaction(res.data);
        })
        .catch((err) => console.log(err));
    } else {
      this.showTransaction(allTransactiondata);
    }
  }


  static async getTransactions() {

    domUi.showHeader();
    await axios
      .get("http://localhost:3000/transactions")
      .then((res) => {
        allTransactiondata = res.data;

        this.renderTransactions(res.data, filters);
      })
      .catch((err) => console.log(err));
  }


  static showTransaction(_transactions) {
    console.log(_transactions.length);
    if (_transactions.length > 0) {
      domUi.showHeader();
      _transactions.forEach((item, index) => {
        const transactionItem = document.createElement("div");
        transactionItem.classList.add("transaction__item");
        transactionItem.innerHTML = `
      <span>${item.id}</span>
      <span class="type" >${item.type} 
      </span>
     <span>${item.price}</span> 
      <span>${item.refId} </span>
      <span>
      ${new Date(item.date).toLocaleString("fa", {
          dateStyle: "short",
          timeStyle: "medium",
        })}</span>`;

        transactionItems.appendChild(transactionItem);

        domUi.changeColor();
      }


      );
    }
    else {
      domUi.hideHeader();
      // this.showTransaction(_transactions);
    }
  }

  static searchTransaction() {
    transactionSearch.addEventListener("input", (e) => {
      filters.searchItems = e.target.value;
      transactionItems.innerHTML = "";
      this.renderTransactions(allTransactiondata, filters);
    });
  }


}

// DOM class

class domUi {
  static showHeader() {
    transactionItems.innerHTML = "";
    transactionSearch.style.visibility = "visible";
    transactionBody.style.visibility = "visible";
    transactionItems.style.visibility = "visible";
    transactionHeader.style.visibility = "visible";
    showBtn.style.visibility = "hidden";
    msgResult.style.visibility = "hidden";
  }
  static hideHeader() {
    transactionItems.innerHTML = "";
    transactionSearch.style.visibility = "visible";
    transactionBody.style.visibility = "visible";
    transactionHeader.style.visibility = "hidden";
    transactionItems.style.visibility = "hidden";
    showBtn.style.visibility = "hidden";
    msgResult.style.visibility = "visible";
    msgResult.classList.add("resultMsg");

    msgResult.innerHTML = `<span>تراکنش یافت نشد</span>`;
    transactionBody.appendChild(msgResult);

  }
  static changeColor() {
    const typeItems = document.querySelectorAll(".type");
    typeItems.forEach((item) => {
      if (item.textContent.includes("برداشت از حساب")) {
        item.classList.add("red");
      }
      else if (item.textContent.includes("افزایش اعتبار")) {
        item.classList.add("green");
      }
    })
  }

}

class sorting {
  static detectTpySort(nameSort) {
    if (isAscending) {
      this.sortData({ nameSort: nameSort, typeSort: 'asc' });
      isAscending = false;
      if (nameSort === 'price') {
        sortPrice.classList.add('rotate');
        sortDate.classList.remove('rotate');
      }
      else {
        sortDate.classList.add('rotate');
        sortPrice.classList.remove('rotate');
      }
    }
    else {
      this.sortData({ nameSort: nameSort, typeSort: 'desc' });
      isAscending = true;
      sortPrice.classList.remove('rotate');
      sortDate.classList.remove('rotate');

    }



  }
  static async sortData({ nameSort, typeSort }) {
    transactionItems.innerHTML = "";
    await axios
      .get(`http://localhost:3000/transactions?_sort=${nameSort}&_order=${typeSort}`)
      .then((res) => {
        transactions.showTransaction(res.data);
      })
      .catch((err) => console.log(err));


  }

}

// loading button event
showBtn.addEventListener("click", () => {

  transactions.getTransactions();
}
);


// Document event
document.addEventListener("DOMContentLoaded", (event) => {
  transactions.searchTransaction();

});
