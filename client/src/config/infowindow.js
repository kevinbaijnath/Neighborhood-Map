const INFO_WINDOW = `<div id="infoWindow" class="info-window">
    <div data-bind="with: currentRestaurant">
        <div data-bind="text: name" class="infowindow-title"></div>
        <div data-bind="text: address"></div>
        <a data-bind="attr: { href: yelp_url }">
            <img data-bind="attr: { src: yelp_img_url }" />
        </a>
        <div id="carouselControl" class="carousel slide" data-ride="carousel" data-bind="foreach: flickr_images">
            <!-- ko if:($index()===0) -->
            <div class="carousel-item active">
              <picture>
                <source media="(max-width: 480px)" data-bind="attr: { srcset: $data.thumbnail }"/>
                <img data-bind="attr: { src: $data.small }" />
              </picture>
            </div>
            <!-- /ko -->

            <!-- ko if:($index() > 0) -->
            <div class="carousel-item">
              <picture>
                <source data-bind="attr: { media: '(max-width: 480px)', srcset: $data.thumbnail }"/>
                <img data-bind="attr: { src: $data.small }" />
              </picture>
            </div>
            <!-- /ko -->

            <a class="carousel-control-prev" href="#carouselControl" role="button" data-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="sr-only">Previous</span>
            </a>
            <a class="carousel-control-next" href="#carouselControl" role="button" data-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="sr-only">Next</span>
            </a>
        </div>
    </div>
</div>`

export default INFO_WINDOW;
