const selectTag = document.querySelectorAll('select')
const translateBtn = document.querySelector('button')
const fromText = document.querySelector('.from-text')
const toText = document.querySelector('.to-text')
const exchangeIcon = document.querySelector(".exchange")
const icons = document.querySelectorAll('.row i');

//Verificar se o select está ativado    
selectTag.forEach((tag, id) => {
    for(const country_code in countries) { // Buscando os paises
        // Selecionando o português como linguagem padrão e o inglês com tradução
        let selected
        if(id == 0 && country_code == "pt-PT") {
            selected = "selected"
        }
        else if(id == 1 && country_code == "en-GB") {
            selected = "selected"
        }
        let option = `<option value="${country_code}" ${selected}>${countries[country_code]}</option>`
        tag.insertAdjacentHTML("beforeend", option) //adicionando a tag de opções dentro da tag de seleção
    }
})

exchangeIcon.addEventListener("click", () => {
    // Trocando os valores dos textareas e dos selects
    let tempText = fromText.value
    let tempLang = selectTag[0].value
    fromText.value = toText.value
    selectTag[0].value = selectTag[1].value
    toText.value = tempText
    selectTag[1].value = tempLang
})

translateBtn.addEventListener("click", () => {
    let text = fromText.value
    let translateFrom = selectTag[0].value // Pegando o valor do texto digitado
    let translateTo = selectTag[1].value  // Pegando o valor do texto traduzido
    if(!text) return
    toText.setAttribute("placeholder", "Translating...")
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`


    fetch(apiUrl).then(res => res.json()).then(data => {
        //buscando a resposta da API e retornando-a com a análise no objeto js
        //e em outro método, então, recebendo esse objeto
        toText.value = data.responseData.translatedText
        toText.setAttribute("placeholder", "Translation")
    })
})

icons.forEach(icon => {
    icon.addEventListener("click", ({target}) => {
        if(target.classList.contains("fa-copy")){
            //se o ícone clicado for de id, copie o valor de fromTextarea, caso contrário, copie o valor de toTextrea
            if(target.id == "from") {
                navigator.clipboard.writeText(fromText.value)
            }
            else {
                navigator.clipboard.writeText(toText.value)
            }
        }
        else {
            let utterance
            if(target.id == "from") {
                utterance = new SpeechSynthesisUtterance(fromText.value)
                utterance.lang = selectTag[0].value // definindo o idioma do enunciado para fromSelect tag value
            }
            else {
                utterance = new SpeechSynthesisUtterance(toText.value)
                utterance.lang = selectTag[1].value // definindo o idioma do enunciado para fromSelect tag value
            }
            speechSynthesis.speak(utterance) // falar o texto escrito
        }
    })
})