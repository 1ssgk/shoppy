export async function uploadImage(file){
  const data = new FormData();
  data.append('file',file);
  data.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET);
  
  return fetch(process.env.REACT_APP_CLOUDINARY_URL, {
    method: "POST",
    body: data
  })
  .then((res) => res.json())
  .then((data)=> data.url);
} 


// form.addEventListener("submit", (e) => {
//   e.preventDefault();

//   const files = document.querySelector("[type=file]").files;
//   const formData = new FormData();

//   for (let i = 0; i < files.length; i++) {
//     let file = files[i];
//     formData.append("file", file);
//     formData.append("upload_preset", "docs_upload_example_us_preset");

//     fetch(url, {
//       method: "POST",
//       body: formData
//     })
//       .then((response) => {
//         return response.text();
//       })
//       .then((data) => {
//         document.getElementById("data").innerHTML += data;
//       });
//   }
// });