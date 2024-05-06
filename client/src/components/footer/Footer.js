import React from "react";
import BackToTopButton from "./BackToTopButton";

function Footer() {
  return (
    <>
    <BackToTopButton/>
    <div className="flex flex-col p-3 items-center gap-5">
      <h1 className="text-4xl uppercase">Lamia Store</h1>
      <p className="text-center">© Copyright LAMIA. All rights reserved | Design by L* </p>
    </div>
    </>
  );
}

export default Footer;
