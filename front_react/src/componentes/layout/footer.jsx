import { Link } from "react-router-dom";
import styles from "../styles/footer.module.css";
import React, { useState } from "react";


function Footer() {
  return (
    <footer>
      <p className="footer-links">
        <a
          href="https://github.com/sivadass/react-shopping-cart"
          target="_blank"
        >
          Plusnet
        </a>
        <span> / </span>
        <a href="mailto:contact@sivadass.in" target="_blank">
          Plusnet
        </a>
        <span> / </span>
        <a href="https://twitter.com/NSivadass" target="_blank">
          Plusnet
        </a>
        <span> / </span>
        <a href="https://sivadass.in" target="_blank">
          Plusnet
        </a>
      </p>
      <p>
      </p>
    </footer>
  );
}

export default Footer;