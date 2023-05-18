const inputEl = document.getElementById("input-el")
const addBtn = document.getElementById("add-btn")
const deleteBtn = document.getElementById("delete-btn")
const clearEl = document.getElementById("clear-el")
const ulEl = document.getElementById("ul-el")
const tokenFromLocalStorage = JSON.parse(localStorage.getItem("tokenList"))
let tokenList = []

if(tokenFromLocalStorage){
  tokenList = tokenFromLocalStorage
  render(tokenList)
}

addBtn.addEventListener("click", function(){
  tokenList.push(inputEl.value)
  inputEl.value = ""
  localStorage.setItem("tokenList", JSON.stringify(tokenList))
  clearEl.style.display = "none";
  render(tokenList)
})


function render(list){
  let myToken = ""
  for (i = 0; i < list.length; i++){
    myToken += `
    <li>
    <p>Name: ${list[i].name}</p>
    <p>Symbol: ${list[i].symbol}</p>
    <p>Address: ${list[i].address}</p>
    <button id="delete-btn" data-index="${i}"><img src="delete-icon.svg"></button>
    </li>
    `
  }
  ulEl.innerHTML = myToken
}
if (inputEl.value === "") {
  clearEl.style.display = "none";
}

inputEl.addEventListener("input", function() {
  const tokenInput = inputEl.value.trim();
  clearEl.style.display = tokenInput ? "block" : "none";
  if (tokenInput) {
    fetch(`https://api.dexscreener.com/latest/dex/tokens/:tokenAddreses/${tokenInput}`)
      .then(response => response.json())
      .then(data => {
        const tokenData = { name: data.name, symbol: data.symbol, address: data.address };
        tokenList.push(tokenData);
        localStorage.setItem("tokenList", JSON.stringify(tokenList));
        render(tokenList);
      })
      .catch(error => {
        console.log("Error fetching token:", error);
      });
  }
});


// inputEl.addEventListener("input", function() {
//   if (inputEl.value === "") {
//     clearEl.style.display = "none";
//   } else {
//     clearEl.style.display = "block";
//   }
// });

clearEl.addEventListener("click", function(){
  inputEl.value = ""
  clearEl.style.display = "none";
})

ulEl.addEventListener("click", function(event) {
  if (event.target.tagName === "IMG") {
    const button = event.target.parentElement;
    const index = button.dataset.index;
    tokenList.splice(index, 1);
    localStorage.setItem("tokenList", JSON.stringify(tokenList));
    render(tokenList);
  }
});
