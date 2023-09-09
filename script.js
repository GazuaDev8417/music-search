const form = document.getElementById('form')
const searchInput = document.getElementById('search')
const songsContainer = document.getElementById('songs-container')
const prevNextContainer = document.getElementById('prev-and-next-container')
const url = `https://api.lyrics.ovh`




const getMoreSongs = async(nextUrl)=>{
    try{
        const response = await fetch(`https://cors-anywhere.herokuapp.com/${nextUrl}`)
        const data = await response.json()
        
        displaySongs(data)
    }catch(e){
        alert(`Erro ao buscar próximas letras: ${e} `)
    }
}


const displaySongs = (songsInfo)=>{
    const data = songsInfo.data
    console.log(data)
    songsContainer.innerHTML = data.map(song =>`
        <li class='song' data-artist='' data-song-title=''>
            <img 
                class='artist-logo' 
                src='${song.artist.picture}' 
                alt='artist-logo'>
            <a href='${song.artist.link}' target='_blank'>
                <strong>${song.artist.name}</strong> - ${song.title}
            </a>
            <audio controls>
                <source src='${song.preview}' type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
        </li>
    `).join('')

    if(songsInfo.prev || songsInfo.next){
        prevNextContainer.innerHTML = `
            ${songsInfo.prev ? (
                `<button class='btn' onClick="getMoreSongs('${songsInfo.prev}')">Anteriores</button>`
            ) : ''}

            ${songsInfo.next ? (
                `<button class='btn' onClick="getMoreSongs('${songsInfo.next}')">Próximas</button>`
            ) : ''}
        `
        return
    }

    prevNextContainer.innerHTML = ''
}


const fetchSongs = async(term)=>{
    try{
        const response = await fetch(`${url}/suggest/${term}`)
        const data = await response.json()

        displaySongs(data)
    }catch(e){
        alert(`Erro ao buscar letra: ${e}`)
    }
}


form.addEventListener('submit', (e)=>{
    e.preventDefault()

    const searchTerm = searchInput.value.trim()
    
    if(!searchTerm){
        songsContainer.innerHTML = `<li class='warning-message'>Digite um termo válido!</li>`
        return
    }

    fetchSongs(searchTerm)
})


const fetchLyrics = async(artist, songTitle)=>{
    try{
        const response = await fetch(`${url}/v1/${artist}/${songTitle}`)
        const data = await response.json()
        const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>')
    }catch(e){
        alert(`Erro ao buscar letra da música ${songTitle}: ${e}`)
    }
}

/* songsContainer.addEventListener('click', (e)=>{
    const clickedElement = e.target
    const artist = clickedElement.getAttribute('data-artist')
    const songTitle = clickedElement.getAttribute('data-song-title')
    
    fetchLyrics(artist, songTitle)
}) */



