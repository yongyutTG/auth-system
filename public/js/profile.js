const dataContainer = document.getElementById("txt_test");
//console.log(dataContainer);

fetch("https://jsonplaceholder.typicode.com/posts")

    //jsonให้เป็น javascript object `ด้วย method .json
    .then(respone => respone.json ())
    .then(data =>{
        data.forEach(post => {
            console.log(post);
            const postElement = document.createElement("p");
            postElement.textContent = `
            Post ID:${post.id} - Title: ${post.title}, Body: ${post.Body};
            `;

            dataContainer.appendChild(postElement);

        })
    })
    .catch(error =>{
        console.log("Eror fetching data:",error);


    })

// fetch("https://jsonplaceholder.typicode.com/posts")
//   .then(
//     function(response) {
//       if (response.status !== 200) {
//         console.log('Looks like there was a problem. Status Code:' +
//         response.status);
//         return;
//       }

//       // Examine the text in the response
//       response.json().then(function(data) {
//         console.log(data);
//       });
//     }
//   )
//   .catch(function(err) {
//     console.log('Fetch Error :-S', err);
//   });

