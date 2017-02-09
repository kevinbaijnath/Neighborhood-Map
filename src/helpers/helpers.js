export function addErrorAlert(text){
  let newAlert = $(`
  <div class="alert alert-danger alert-dismissible fade show" role="alert">
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
    <strong>Uh oh!</strong> ${text}
  </div>`);
  $("#alert").append(newAlert);
}

export function animateMarker(marker){
  marker.setAnimation(google.maps.Animation.BOUNCE);
  window.setTimeout(function(){
    marker.setAnimation(null)
  }, 1000);
}
