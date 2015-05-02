(function() {
  var spinnerVisible = false;
  function showgi() {
      if (!spinnerVisible) {
          $("div#spinner").fadeIn("fast");
          spinnerVisible = true;
      }
  }
  function hide() {
      if (spinnerVisible) {
          var spinner = $("div#spinner");
          spinner.stop();
          spinner.fadeOut("fast");
          spinnerVisible = false;
      }
  }
  show();
  $.getJSON( '/igMediaCounts')
    .done(function( data ) {
      
      var yCounts = data.users.map(function(item){
        return item.counts.media;
      });
      
      yCounts.unshift('Media Count');

      var chart = c3.generate({
        bindto: '#chart',
        data: {
          columns: [
            yCounts 
          ]
        }
      });
      hide();
    });
})();
