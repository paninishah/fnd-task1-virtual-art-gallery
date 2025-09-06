const apiKey = '4b520844-87f0-4b8e-bb0d-e0284ceef1de';
const gallery = document.querySelector('.gallery');
const numberOfCards = 12;

fetch(`https://api.harvardartmuseums.org/object?apikey=${apiKey}&size=${numberOfCards}&hasimage=1&classification=Paintings`)
  .then(response => response.json())
  .then(data => {
    data.records.forEach(item => {
      if (!item.primaryimageurl) return;

      const card = document.createElement('div');
      card.className = "w-[300px] h-[400px] bg-[#D9D9D9] border-[7px] border-[#C76A4E] transition-shadow duration-300 hover:shadow-[0_0_40px_#1C2A44] flex flex-col items-center justify-center text-[#1C2A44]/50 font-spline overflow-hidden";

      card.innerHTML = `
        <img src="${item.primaryimageurl}" alt="${item.title}" class="w-full h-[70%] object-cover">
        <div class="p-2 text-center">
          <h3 class="font-lora font-semibold text-sm text-[#1C2A44] truncate">${item.title || 'Untitled'}</h3>
          <p class="text-xs text-[#1C2A44]/70 truncate">${item.people?.[0]?.name || 'Unknown Artist'}</p>
        </div>
      `;

      gallery.appendChild(card);
    });
  })
  .catch(err => console.error('Error fetching artworks:', err));
