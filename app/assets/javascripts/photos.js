Navarra.namespace("photos");
Navarra.photos = function() {

function open_photos(app_id) {
   $.ajax({
        type: 'GET',
        url: '/photos/show_photos',
        datatype: 'json',
        data: {
          project_id: app_id,
        },
        success: function(data) {
            console.log(data)
            //borra datos anteriores
            $('.photo_container').empty();
            $('.photo_mini_container').empty();
            $('.photo_descrip_container').html("No hay fotos para este registro");
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
                    new_photo.id = "main_photo";
                    new_photo.src = "data:image/png;base64," + photo.image;
                    $('.photo_container').append(new_photo);
                    $('.photo_descrip_container').html(photo.name)
                }
            });
        }
    });
}

function open_photo_mini(){
    var clic_src = event.target.src;
    var photo_name = event.target.title;
    $('#main_photo').attr("src",clic_src);
    $('.photo_descrip_container').html(photo_name);
    $('.photo_mini').css('border','solid 2px transparent');
    event.target.style.border='solid 2px white';
}

return {
    open_photos: open_photos,
    open_photo_mini: open_photo_mini
}
}();
