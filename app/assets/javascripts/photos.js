Navarra.namespace("photos");
Navarra.photos = function() {
var dif_y
var dif_x

function open_photos(app_id, ischild) {
    if(ischild){
        var url_get = '/photos_children/show_photos_children';
        var data_get = {
            project_data_child_id: app_id,
        }
    } else{
        var url_get = '/photos/show_photos';
        var data_get = {
            project_id: app_id,
        }
    }
   $.ajax({
        type: 'GET',
        url: url_get,
        datatype: 'json',
        data: data_get,
        success: function(data) {
            console.log(data)
            //borra datos anteriores
            $('.photo_container').empty();
            $('.photo_mini_container').empty();
            $('#photo_title').html("No hay fotos para este registro");
            $('#photos-modal').modal('show');
            data.forEach(function(photo,index) {
                var new_photo = document.createElement('IMG');
                new_photo.className = "photo_mini";
                new_photo.src = "data:image/png;base64," + photo.image;
                new_photo.setAttribute('onClick','Navarra.photos.open_photo_mini()');
                new_photo.title = photo.name;
                if(index==0){
                    new_photo.style.border = 'solid 2px white';
                } else{
                    new_photo.style.border = 'solid 2px transparent';
                }
                $('.photo_mini_container').append(new_photo);
                if(index==0){
                    var new_photo = document.createElement('IMG');
                    new_photo.className = "photo";
                    if($('.custom_modal_photos').hasClass('custom_modal_photos_max')){
                        new_photo.className = "photo photo_max";
                    }
                    new_photo.id = "main_photo";
                    new_photo.src = "data:image/png;base64," + photo.image;
                    $('.photo_container').append(new_photo);
                    $('#photo_title').html(photo.name)
                }
            });
        }
    });
}

function open_photo_mini(){
    var clic_src = event.target.src;
    var photo_name = event.target.title;
    $('#main_photo').attr("src",clic_src);
    $('#photo_title').html(photo_name);
    $('.photo_mini').css('border','solid 2px transparent');
    event.target.style.border='solid 2px white';
}
//Drag and Drop Modal
function drag_photos(ev) {
    var top_y = event.target.offsetTop;
    var top_x = event.target.offsetLeft;
    dif_y = ev.clientY - top_y;
    dif_x = ev.clientX - top_x;
    ev.dataTransfer.setData("text", ev.target.id);
}
function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var Yfinal=ev.clientY - dif_y;
    var Xfinal=ev.clientX - dif_x;
    Yfinal=Yfinal+"px";
    Xfinal=Xfinal+"px";
    $('.custom_modal_photos').css('top',Yfinal);
    $('.custom_modal_photos').css('left',Xfinal);
}

return {
    open_photos: open_photos,
    open_photo_mini: open_photo_mini,
    drag_photos:drag_photos,
    allowDrop:allowDrop,
    drop:drop
}
}();
