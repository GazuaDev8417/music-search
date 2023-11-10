const form = document.getElementById('form')
const searchInput = document.getElementById('search')
const songsContainer = document.getElementById('songs-container')
const prevNextContainer = document.getElementById('prev-and-next-container')
const url = `https://api.lyrics.ovh`



const getMoreSongs = async(nextUrl)=>{
    try{
        const response = await fetch(`https://corsproxy.io/?${nextUrl}`)
        const data = await response.json()
        
        displaySongs(data)
    }catch(e){
        alert(`Erro ao buscar próximas letras: ${e} `)
    }
}


const displayTracks = (tracks, albumCover, albumTitle, artistName)=>{
    const newArtitstName = artistName.replace(/\s+/g, '')
    const data = tracks.data
    songsContainer.innerHTML = `<h1>${albumTitle}</h1>`
    songsContainer.innerHTML += `<img class='cover-image' src='${albumCover}' alt='artist-logo'>` 
    songsContainer.innerHTML += `<h3>Músicas do album</h3>`   
    songsContainer.innerHTML += data.map(track =>`
        <li class='track-list'>
            ${track.title}
        </li>
    `).join('')


    prevNextContainer.innerHTML = `
        <button class='btn' onClick={fetchSongs('${newArtitstName}')}>Buscar artista</button>
    `
}


songsContainer.addEventListener('click', async(e)=>{
    try{

        if(e.target.tagName === 'IMG' || e.target.tagName === 'SPAN'){
            const albumCover = e.target.getAttribute('album-cover')
            const tracklist = e.target.getAttribute('album-tracks')
            const albumTitle = e.target.getAttribute('album-title')
            const artistName = e.target.getAttribute('artist-name')
            
            const response = await fetch(`https://corsproxy.io/?${tracklist}`)
            const data = await response.json()
            
            displayTracks(data, albumCover, albumTitle, artistName)
        }

    }catch(e){
        alert(e)
    }
})


const displaySongs = (songsInfo)=>{
    const data = songsInfo.data
    
    songsContainer.innerHTML = data.map(song =>`
        <li class='song' data-artist='' data-song-title=''>
            <div>
                <img 
                    album-cover='${song.album.cover_big}'
                    album-tracks='${song.album.tracklist}'
                    album-title='${song.album.title}'
                    artist-name='${song.artist.name}'
                    class='artist-logo' 
                    src='${song.artist.picture}' 
                    alt='artist-logo'>
                <a href='${song.artist.link}' target='_blank'>
                    <strong>${song.artist.name}</strong> - ${song.title}
                </a>                
            </div>
            <span
                album-cover='${song.album.cover_big}'
                album-tracks='${song.album.tracklist}'
                album-title='${song.album.title}'
                artist-name='${song.artist.name}' 
                class='track-list-link'>Ver album</span>                     
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



