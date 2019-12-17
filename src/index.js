// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 


const quoteUl = document.querySelector("#quote-list")
const newForm = document.querySelector("#new-quote-form")


fetch("http://localhost:3000/quotes?_embed=likes")
.then(r => r.json())
.then((quoteObjectArray) => {
    quoteObjectArray.forEach((quoteObject) => {
        makeJSONtoHTML(quoteObject)
    })
})

function makeJSONtoHTML(element) {
    newLi = document.createElement("li")
    newLi.className = 'quote-card'
    let tempNumber
    if (!element.likes) {
        tempNumber = 0 
    } else {
        tempNumber = element.likes.length
    }
    newLi.dataset.id = element.id
    newLi.innerHTML = `
    <blockquote class="blockquote">
        <p class="mb-0">${element.quote}</p>
        <footer class="blockquote-footer">${element.author}</footer>
        <br>
        <button class='btn-success' data-id=${element.id} id='${element.id}-like'>Likes: <span>${tempNumber}</span></button>
        <button class='btn-danger' data-id=${element.id} id='${element.id}-delete'>Delete</button>
    </blockquote>
    `


    let delButton = newLi.querySelector("button.btn-danger")
    delButton.addEventListener("click", (e) => {
        fetch(`http://localhost:3000/quotes/${element.id}`, {
            method: "DELETE"
        })
        .then(r => r.json())
        .then((response) => {
            let currentLi = e.target.parentNode.parentNode

            currentLi.remove()
            // let tempT = document.querySelector(`li[dataset-id-${newLi.dataset.id}]`)
            // tempT.style.display = "none"
            // let allTheLis = document.querySelectorAll("li")
            // let newLiList = allTheLis.filter((li) => {
            //     !(li.dataset.id === newLi.dataset.id)
            // })
            // console.log(newLiList)
            // quoteUl.remove()
            // newLiList.forEach((singleLi) => {
            //     quoteUl.append(singleLi)
            // })
            // filter instead of for each
            // itll give you the array minus one deleted one
            // clear the dom
            // take filtered array
            // for each it
            // append li to dom
        })
    })
    let idString = element.id
    let idNumber = parseInt(idString)
    let likeButton = newLi.querySelector('button.btn-success')
    likeButton.addEventListener("click", (e) => {
        let id = e.target.parentNode.parentNode.dataset.id
        // console.log(id)
        fetch(`http://localhost:3000/likes`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({
                quoteId: parseInt(id)
            })
        })
        .then(r => r.json())
        .then((response) => {
            let currentLikeButton = e.target.querySelector('span')
            
            console.log(currentLikeButton)

            currentLikeButton.innerText = parseInt(currentLikeButton.innerText) + 1
            
        })
    })


    quoteUl.append(newLi)
}

newForm.addEventListener("submit", (e) => {
    e.preventDefault()
    let newQuote = e.target['new-quote'].value
    let newAuthor = e.target['author'].value
    fetch("http://localhost:3000/quotes", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            quote: newQuote,
            author: newAuthor
        })
    })
    .then(r => r.json())
    .then((newQuoteObject) => {
        makeJSONtoHTML(newQuoteObject)
        newForm.reset()
    })
})

