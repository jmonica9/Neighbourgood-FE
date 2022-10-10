import "bootstrap/dist/css/bootstrap.min.css";
import Carousel from "react-bootstrap/Carousel";
import charityone from "../images/charityone.jpg";
import charitytwo from "../images/charitytwo.jpg";
import spdbanner from "../images/spdbanner.jpeg";

function LandingPageCarousel() {
  return (
    <Carousel>
      <Carousel.Item interval={4000}>
        <div
          style={{
            backgroundImage: `url(${charityone})`,
            height: "50vh",
            backgroundSize: "100% 100%",
            overflow: "clip",
            backgroundRepeat: "no-repeat",
          }}
        ></div>

        <Carousel.Caption>
          {/* <h3>Label for first slide</h3>
                <p>Sample Text for Image One</p> */}
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={4000}>
        <div
          style={{
            backgroundImage: `url(${charitytwo})`,
            height: "50vh",
            backgroundSize: "100% 100%",
            overflow: "clip",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        <Carousel.Caption>
          {/* <h3>Label for second slide</h3>
                <p>Sample Text for Image Two</p> */}
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={4000}>
        <div
          style={{
            backgroundImage: `url(${spdbanner})`,
            height: "50vh",
            backgroundSize: "100% 100%",
            overflow: "clip",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        <Carousel.Caption>
          {/* <h3>Label for third slide</h3>
                <p>Sample Text for Image Three</p> */}
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default LandingPageCarousel;
