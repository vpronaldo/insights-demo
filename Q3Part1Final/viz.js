
$(document).ready(function() {
     var $radiobtn = $('<div class="col-sm-9"><div class="btn-group" data-toggle="buttons"><label class="btn btn-default test"><input type="radio" class = "menu-ui" name="plan" checked=true value="Tenth Plan">Tenth Plan</input></label><label class="btn btn-default test1"><input type="radio" class = "menu-ui" name="plan" value="Ninth Plan">Ninth Plan</input></label></div></div>')
     .appendTo($('#radiobtn'));
      $("input[name='plan']").change(function(){

      	
        updatePieChart($("input[name='plan']:checked").val())
       });

        updatePieChart($("input[name='plan']:checked").val());

});