
// function to load categories exp music comedy etc
const loadCategories = () => {
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories))
    .catch((error) => console.log(error));
};
// function to display the categories buttons
const displayCategories = (categories) => {
  const categoryContainer = document.getElementById("categories-container");
  categories.forEach((item) => {
    // create button container
    const btnContainer = document.createElement("div");
    btnContainer.innerHTML = `
      <button id='btn-${item.category_id}' class='btn btn-category' onclick='loadVideoCategories(${item.category_id
      })'>
        ${item.category}
      </button>
    `
    // append button container to category container
    categoryContainer.append(btnContainer);
  });
};

// function to load videos
const loadVideos = (searchText = '') => {
  fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
    .then((res) => res.json())
    .then((data) => displayVideos(data.videos))
    .catch((error) => console.log(error));
};
// function to display videos on ui
const displayVideos = (videos) => {
  const videoContainer = document.getElementById("video-container");
  videoContainer.innerHTML ='';
  if(videos.length===0){
    videoContainer.classList.remove('grid')
    videoContainer.innerHTML =`
        <div class='flex flex-col space-y-3 justify-center items-center'>
            <img src='./assets/Icon.png'/>
            <h2 class='text-center font-bold text-xl'>No content here to display in this category</h2>
        </div>
    `
    return;
  }
  else{
    videoContainer.classList.add('grid')
  }
  videos.forEach((item) => {
    // create video cards
    const card = document.createElement("div");
    card.classList = "card card-compact"
    card.innerHTML = `
         <figure class='h-[200px] relative'>
            <img class='h-full w-full object-cover'
                src=${item.thumbnail}
            />
            ${item.others.posted_date?.length===0? '' : `<span class='absolute right-2 bottom-2 bg-black text-white p-1 rounded text-xs'>${postedTime(item.others.posted_date)}</span>`}  
        </figure>
        <div class="px-2 py-2">
            <div class='flex gap-3 items-center'>
            <div class="w-10 h-10">
              <img src=${item.authors[0].profile_picture} alt="" class="w-full h-full rounded-full object-cover">
            </div>
            <div class='space-y-1'>
            <h3 class='font-bold'>${item.title}</h3>
            <div class='flex gap-2 items-center'>
                <p class='text-gray-400'>${item.authors[0].profile_name}</p>
                ${item.authors[0].verified === true ? `<img class='w-5 h-5' src="https://img.icons8.com/?size=40&id=41816&format=png"/>` : ''}   
            </div>
            <button onclick="loadDetails('${item.video_id}')"  class='btn btn-sm btn-primary'>details</button>
            </div>
            </div>
        </div>
    `;
    // append on video container
    videoContainer.append(card)
  });
};

// load modals with description
const loadDetails =async(videoId) => {
   const url =`https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
   const res = await fetch(url)
   const data = await res.json()
   displayDetails(data.video)
}
// display video details
const displayDetails =(video)=>{
  const modalContainer =document.getElementById('modal-details');
  modalContainer.innerHTML = `
    <img src=${video.thumbnail}/>
    <p>${video.description}</p>
  `
  document.getElementById('myModal').showModal();
}

// remove active button background
const activeButton =()=>{
  const buttons = document.getElementsByClassName('btn-category');
  for (const button of buttons){
    button.classList.remove('active')
  }
}

// load videos as per categories
const loadVideoCategories =(id) =>{
  // alert (id)
  fetch (`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
  .then(res=>res.json())
  .then(data=>{
    const button = document.getElementById(`btn-${id}`)
    activeButton();
    button.classList.add('active');
    displayVideos(data.category)
  })
  .catch(error=>console.log(error))
}

// show time hour minute and on seconds
const postedTime =(time) =>{
   const hour = parseInt(time/3600);
   let remainingSecond = parseInt(time % 3600);
   const minute = parseInt(remainingSecond / 60) ;
   remainingSecond = remainingSecond % 60;
   return `posted ${hour} hour ${minute} minute and ${remainingSecond}second ago`
}
// show search result according to search value
document.getElementById('searchText').addEventListener('keyup',(e)=>{
  loadVideos(e.target.value)
})
loadCategories();
loadVideos();

const cardDemo = {
  "category_id": "1001",
  "video_id": "aaaa",
  "thumbnail": "https://i.ibb.co/L1b6xSq/shape.jpg",
  "title": "Shape of You",
  "authors": [
      {
          "profile_picture": "https://i.ibb.co/D9wWRM6/olivia.jpg",
          "profile_name": "Olivia Mitchell",
          "verified": ""
      }
  ],
  "others": {
      "views": "100K",
      "posted_date": "16278"
  },
  "description": "Dive into the rhythm of 'Shape of You,' a captivating track that blends pop sensibilities with vibrant beats. Created by Olivia Mitchell, this song has already gained 100K views since its release. With its infectious melody and heartfelt lyrics, 'Shape of You' is perfect for fans looking for an uplifting musical experience. Let the music take over as Olivia's vocal prowess and unique style create a memorable listening journey."
}
