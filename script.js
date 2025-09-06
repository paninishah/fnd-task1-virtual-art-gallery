const apiKey = '4b520844-87f0-4b8e-bb0d-e0284ceef1de';
const gallery = document.querySelector('.gallery');
const path = window.location.pathname;


if (path.endsWith('index.html') || path === '/' || path === '') {
    const randomPage = Math.floor(Math.random() * 100) + 1; // pick random page 
    const numberOfCards = 12;
    const fetchSize = 50;

    //random gallery
    fetch(`https://api.harvardartmuseums.org/object?apikey=${apiKey}&size=${fetchSize}&page=${randomPage}&hasimage=1&classification=Paintings`)
        .then(response => response.json())
        .then(data => {
            let validArtworks = data.records.filter(item => item.primaryimageurl);

            // shuffle them (Fisher–Yates)
            for (let i = validArtworks.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [validArtworks[i], validArtworks[j]] = [validArtworks[j], validArtworks[i]];
            }

            // take first 12
            validArtworks.slice(0, numberOfCards).forEach(item => {
                const card = document.createElement('div');
                card.className =
                    "w-[300px] h-[400px] bg-[#D9D9D9] border-[7px] border-[#C76A4E] transition-shadow duration-300 hover:shadow-[0_0_40px_#1C2A44] flex flex-col items-center justify-center text-[#1C2A44]/50 font-spline overflow-hidden";

                card.innerHTML = `
                    <img src="${item.primaryimageurl}" alt="${item.title}" class="w-full h-[70%] object-cover">
                    <div class="p-2 text-center">
                        <h3 class="font-lora font-semibold text-sm text-[#1C2A44] break-words">${item.title || 'Untitled'}</h3>
                        <p class="text-xs text-[#1C2A44]/70 break-words">${item.people?.[0]?.name || 'Unknown Artist'}</p>
                    </div>
                `;

                const link = document.createElement('a');
                link.href = `artwork.html?id=${item.id}`;
                link.appendChild(card);

                gallery.appendChild(link);
            });
        })
        .catch(err => console.error('Error fetching artworks:', err));

    //search
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');

    function searchArtworks(query) {
        fetch(`https://api.harvardartmuseums.org/object?apikey=${apiKey}&size=50&hasimage=1&classification=Paintings&keyword=${encodeURIComponent(query)}`)
            .then(res => res.json())
            .then(data => {
                gallery.innerHTML = ""; // clear old results
                const validArtworks = data.records.filter(item => item.primaryimageurl);

                if (validArtworks.length === 0) {
                    gallery.innerHTML = `<p class="text-white">No results found for "${query}".</p>`;
                    return;
                }

                validArtworks.slice(0, numberOfCards).forEach(item => {
                    const card = document.createElement('div');
                    card.className =
                        "w-[300px] h-[400px] bg-[#D9D9D9] border-[7px] border-[#C76A4E] transition-shadow duration-300 hover:shadow-[0_0_40px_#1C2A44] flex flex-col items-center text-[#1C2A44]/50 font-spline overflow-hidden";
                    //why doesnt the image stick to the top???
                    card.innerHTML = `
                        <img src="${item.primaryimageurl}" alt="${item.title}" class="w-full h-[70%] object-cover">
                        <div class="pt-0 pb-2 text-center">
                            <h3 class="font-lora font-semibold text-sm text-[#1C2A44] truncate">${item.title || 'Untitled'}</h3>
                            <p class="text-xs text-[#1C2A44]/70 truncate">${item.people?.[0]?.name || 'Unknown Artist'}</p>
                        </div>
                    `;

                    const link = document.createElement('a');
                    link.href = `artwork.html?id=${item.id}`;
                    link.appendChild(card);

                    gallery.appendChild(link);
                });
            })
            .catch(err => console.error('Search error:', err));
    }


    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) searchArtworks(query);
    });


    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) searchArtworks(query);
        }
    });
}


else if (path.endsWith('artwork.html')) {
  const container = document.getElementById('artwork-detail');
  const urlParams = new URLSearchParams(window.location.search);
  const artworkId = urlParams.get('id');

  if (!artworkId) {
    container.innerHTML = '<p class="text-white">Artwork ID not found.</p>';
  } else {
    fetch(`https://api.harvardartmuseums.org/object/${artworkId}?apikey=${apiKey}`)
      .then(res => res.json())
      .then(data => {
        container.innerHTML = `
          <div class="flex flex-col md:flex-column items-center gap-6">
            <img src="${data.primaryimageurl}" alt="${data.title}" class="w-full md:w-1/2 object-cover shadow-lg">
            <div class="md:w-1/2 flex flex-col justify-center mx-auto mt-8 bg-[#1C2A44]/60 hover:bg-[#1C2A44] transition flex flex-col pt-2 px-12 pb-2">
              <h2 class="font-spline font-bold text-2xl text-[#E6D5B8] mb-4">${data.title || 'Untitled'}</h2>
              <p class="text-[#D9D9D9] mb-2"><strong>Artist:</strong> ${data.people?.[0]?.name || 'Unknown'}</p>
              <p class="text-[#D9D9D9] mb-2"><strong>Culture:</strong> ${data.culture || 'N/A'}</p>
              <p class="text-[#D9D9D9] mb-2"><strong>Medium:</strong> ${data.medium || 'N/A'}</p>
              <p class="text-[#D9D9D9]"><strong>Description:</strong> ${data.description || 'No description available.'}</p>
            </div>
          </div>
        `;
      })
       .catch(err => {
        container.innerHTML = `<p class="text-white">Error loading artwork.</p>`;
        console.error(err);
      });
  }
}