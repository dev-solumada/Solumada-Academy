
function getCour(id)
{
    $.ajax(
        {
            url: '/getCours',
            method: 'post',
            data: {id: id},
            dataType: 'json',
            success: function(response){
                alert(response);
                $('#cours_id').val(response._id);
                $('#nameCours_update').val(response.name_Cours);
                $('#date_Commenc_update').val(response.date_Commenc);
                $('#professeur_update').val(response.professeur);
                $('#typeCours_update').val(response.type);
            },
            error: function(response){
                alert(response);
            }
        }
    )
}


function updateCours(url)
{
    formUpdateCours = {
        id = $('#cours_id').val(response._id),
        name_Cours = $('#nameCours_update').val(response.name_Cours),
        date_Commenc = $('#date_Commenc_update').val(response.date_Commenc),
        $('#professeur_update').val(response.professeur);
        $('#typeCours_update').val(response.type);
    }
    $.ajax(
        {
            url: url,
            method: 'post',
            data: { }
        }
    )
}


