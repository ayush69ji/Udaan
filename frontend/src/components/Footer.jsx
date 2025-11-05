import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 text-center py-3 mt-10">
      <p>© {new Date().getFullYear()} Udaan. All rights reserved.</p>
    </footer>
  );
}
