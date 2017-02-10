/**
 * Animates a google marker
 * @param {Object} - google maps marker
*/
function animateMarker(marker){
  marker.setAnimation(google.maps.Animation.BOUNCE);
  window.setTimeout(function(){
    marker.setAnimation(null)
  }, 1400);
}

export {animateMarker};
