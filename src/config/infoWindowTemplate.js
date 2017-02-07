export default function infoWindowTemplate(){
  return `<div>
  <div id="name"></div>
  <div id="address"></div>
  <a id="yelp_link" href=""><img id="yelp_rating" src=""></img></a>
  <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
    <div class="carousel-inner" role="listbox">
      <div class="carousel-item active">
        <img id="carousel_0" class="d-block img-fluid" src="">
      </div>
      <div class="carousel-item">
        <img id="carousel_1" class="d-block img-fluid" src="">
      </div>
      <div class="carousel-item">
        <img id="carousel_2" class="d-block img-fluid" src="">
      </div>
      <div class="carousel-item">
        <img id="carousel_3" class="d-block img-fluid" src="">
      </div>
      <div class="carousel-item">
        <img id="carousel_4" class="d-block img-fluid" src="">
      </div>
    </div>
    <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="sr-only">Previous</span>
    </a>
    <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="sr-only">Next</span>
    </a>
  </div>
</div>`;
}
