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

const BASE_URL = "http://localhost:3000"

// Transactions class
class Transactions {
  static async renderTransactions(_transactions, _filter) {
    // transactionItems.innerHTML = "<div class='loading'>Loading...</div>";
    try {
      let data = allTransactiondata;
      if (_filter.searchItems) {
        const response = await axios.get(`${BASE_URL}/transactions?refId_like=${_filter.searchItems}`);
        data = response.data;
      }
      // transactionItems.innerHTML = ""; // Clear loader
      this.showTransaction(data);
    } catch (err) {
      console.error(err);
      domUi.showError("Failed to fetch transactions.");
    }
  }

  static async getTransactions() {
    domUi.showHeader();

    try {
      const response = await axios.get(`${BASE_URL}/transactions`);
      allTransactiondata = response.data;
      this.renderTransactions(allTransactiondata, filters);
    } catch (err) {
      console.error(err);
      domUi.showError("Failed to fetch transactions.");
    }
  }

  static showTransaction(_transactions) {
    if (_transactions.length > 0) {
      domUi.showHeader();
      const fragment = document.createDocumentFragment();
      _transactions.forEach((item) => {
        const transactionItem = document.createElement("div");
        transactionItem.classList.add("transaction__item");
        transactionItem.innerHTML = `
          <span>${item.id || "N/A"}</span>
          <span class="type">${item.type || "N/A"}</span>
          <span>${item.price || "N/A"}</span>
          <span>${item.refId || "N/A"}</span>
          <span>${new Date(item.date || Date.now()).toLocaleString("fa", {
          dateStyle: "short",
          timeStyle: "medium",
        })}</span>`;
        fragment.appendChild(transactionItem);
      });
      transactionItems.appendChild(fragment);
      domUi.changeColor();
    } else {
      domUi.hideHeader();
    }
  }

  static searchTransaction() {
    transactionSearch.addEventListener("input", (e) => {
      filters.searchItems = e.target.value;
      // transactionItems.innerHTML = "";
      this.renderTransactions(allTransactiondata, filters);
    });
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
    // transactionItems.innerHTML = "";
    await axios
      .get(`${BASE_URL}/transactions?_sort=${nameSort}&_order=${typeSort}`)
      .then((res) => {
        Transactions.showTransaction(res.data);
      })
      .catch((err) => console.log(err));


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

  static showError(message) {
    msgResult.style.visibility = "visible";
    msgResult.innerHTML = `<span>${message}</span>`;
    transactionBody.appendChild(msgResult);
  }

  static changeColor() {
    const typeItems = document.querySelectorAll(".type");
    typeItems.forEach((item) => {
      if (item.textContent.includes("برداشت از حساب")) {
        item.classList.add("red");
      } else if (item.textContent.includes("افزایش اعتبار")) {
        item.classList.add("green");
      }
    });
  }
}



// Initialize
document.addEventListener("DOMContentLoaded", () => {
  Transactions.searchTransaction();

});


// loading button event
showBtn.addEventListener("click", () => {

  Transactions.getTransactions();

}
);
