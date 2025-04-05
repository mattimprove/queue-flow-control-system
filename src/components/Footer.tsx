
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-card p-3 border-t border-border mt-auto">
      <div className="text-xs text-center text-muted-foreground">
        <div className="flex items-center justify-center gap-2">
          <p>Produzido pela Sling Soluções de Mercado</p>
          <a href="https://www.slingbr.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            <i className="fas fa-globe text-sm"></i>
          </a>
          <a href="https://www.instagram.com/slingbr_" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            <i className="fab fa-instagram text-sm"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
