import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-light text-center text-lg-start mt-auto">
      <div className="container p-4">
        <div className="text-center p-3">
          &copy; {new Date().getFullYear()} EventManager. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
