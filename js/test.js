$(document).ready(function(){
    $("#tags").TagHelper({"tagConverter":"EMail","separator":";"});
    $("#check").click(function(){
        console.log($("#tags").data('parsedData'));
    })
})