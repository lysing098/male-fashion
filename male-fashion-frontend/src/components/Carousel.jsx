import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import api from "../utils/api";
import { HiArrowNarrowRight } from "react-icons/hi";
import { NavLink } from "react-router-dom";

const Carousel = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetechData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/carousel");
      setData(res.data?.carousels.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetechData();
  }, []);

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    autoplay: true,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // ✅ Skeleton UI
  if (loading) {
    return (
      <div className="relative w-full h-[500px] bg-gray-200 animate-pulse">
        {/* Fake Image */}
        <div className="w-full h-full bg-gray-300"></div>

        {/* Fake Text Overlay */}
        <div className="absolute top-[30%] left-[380px] flex flex-col gap-5 w-[480px]">
          <div className="h-4 w-32 bg-gray-400 rounded"></div>
          <div className="h-10 w-full bg-gray-400 rounded"></div>
          <div className="h-4 w-3/4 bg-gray-400 rounded"></div>
          <div className="h-10 w-32 bg-gray-500 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <Slider {...settings}>
      {data.map((item) => (
        <div key={item.id} className="relative">
          <img
            src={`http://127.0.0.1:8000/storage/${item.image}`}
            className="w-full h-auto"
            alt={item.title}
          />
          <div className="absolute top-[30%] left-[380px] flex flex-col items-start gap-5 w-[480px]">
            <p className="uppercase text-red-400 font-medium">
              {item.collection}
            </p>
            <h1 className="capitalize text-5xl font-semibold">
              {item.title}
            </h1>
            <p>{item.description}</p>
            <NavLink
              to="/shop"
              className="px-8 py-2 bg-black text-white font-medium uppercase flex items-center gap-2.5"
            >
              shop now <HiArrowNarrowRight />
            </NavLink>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default Carousel;
