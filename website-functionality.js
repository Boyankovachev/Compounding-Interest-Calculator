$(function(){

    addSelectOptions();

});

function addSelectOptions(){
    var $select = $("#years");
    for (i=1;i<=100;i++){
        $select.append($('<option>' + i + '</option>'));
    }

    $select.val(50);

}