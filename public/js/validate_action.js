

// var data;
// var movieid = 0;

// $(document).ready(() => {
//     render();
// })




var data;
var movieid = 0;

$(document).ready(() => {
    render();
})

function render() {
    //get
    $.ajax({
        method: 'get',
        url: 'http://localhost:3000/api/getallmovie',
        success: function(response) {
        // success: (response) => {
            console.log('render', response)
            if(response.RespCode == 200) {
                data = response.Result;
                if(data.length > 0) {
                    var html = '';
                    for (let i = 0; i < data.length; i++) {
                        html += `
                            <tr>
                                <th scope="row">${i+1}</th>
                                <td>${data[i].name}</td>
                                <td>${gettimetodate(data[i].mil)}</td>
                                <td>
                                    <button onclick="editmovie(${data[i].id}, ${i})" type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#modaledit">Edit</button>
                                    <button onclick="deletemovie(${data[i].id}, ${i}, '${data[i].name}')" type="button" class="btn btn-danger">Delete</button>
                                </td>
                            </tr>
                        `;
                    }
                    $("#tbody").html(html)
                }
            }
        }, error: (err) => {
            console.log('bad', err)
        }
    })
}

function gettimetodate(mil) {
    mil = parseInt(mil)
    var d = new Date(mil)
    var dd = d.getDate() < 10 ? '0'+d.getDate() : d.getDate();
    var dm = (d.getMonth()+1) < 10 ? '0'+(d.getMonth()+1) : (d.getMonth()+1);
    var dy = d.getFullYear();
    var th = d.getHours() < 10 ? '0'+d.getHours() : d.getHours();
    var tm = d.getMinutes() < 10 ? '0'+d.getMinutes() : d.getMinutes();
    var ts = d.getSeconds() < 10 ? '0'+d.getSeconds() : d.getSeconds();

    return `${dy}/${dm}/${dd} ${th}:${tm}:${ts}`
}


//create
function savemovie() {
    $.ajax({
        method: 'post',
        url: 'http://localhost:3000/api/createmovie',
        data: {
            name: $("#txtaddmodal").val(),
            mil: new Date().getTime()
        }, success: (response) => {
            console.log('save', response)
            if (response.RespCode == 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Add movie successfully'
                })
                $("#closeaddmodal").trigger('click')
                render();
            } else if (response.RespCode == 400) {
                Swal.fire({
                    icon: 'error',
                    title: 'กรุณากรอกข้อมูล'
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'กรุณาตรวจสอบ API'
                })
            }
        }, error: (err) => {
           
            console.log('bad', err)
        }
    })
}

function editmovie(mid, index) {
    $("#txteditmodal").val(data[index].name)
    
    movieid = mid;
}

function updatemovie() {
    $.ajax({
        method: 'put',
        url: 'http://localhost:3000/api/updatemovie',
        data: {
            id: parseInt(movieid),
            name: $("#txteditmodal").val(),
            mil: new Date().getTime()
        }, success: (response) => {
            console.log('update', response)
            if(response.RespCode == 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Update successfully'
                })
                $("#closeeditmodal").trigger('click')
                render();
            } else if (response.RespCode == 400) {
                Swal.fire({
                    icon: 'error',
                    title: 'กรุณากรอกข้อมูล'
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'กรุณาตรวจสอบ API'
                })
            }
        }, error: (err) => {
            console.log('bad', err)
        }
    })
}

function deletemovie(mid, index, name) {
    Swal.fire({
        icon: "warning",
        title: 'Are you sure to delete '+ name +'?',
        showConfirmButton: false,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `DELETE`,
    }).then((result) => {
        if (result.isDenied) {
            $.ajax({
                method: "delete",
                url: 'http://localhost:3000/api/deletemoviebyid',
                data: {
                    id: mid
                }, success: (response) => {
                    console.log('good', response)
                    if(response.RespCode == 200) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Delete successfully'
                        })
                        render();
                    }
                }, error: (err) => {
                    console.log('bad', err)
                }
            })
        }
    })
}