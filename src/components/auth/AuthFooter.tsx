
import React from "react";

const AuthFooter: React.FC = () => {
  return (
    <div className="border-t text-center text-sm px-6 py-4 flex-col gap-2">
      <p className="text-muted-foreground w-full">Sistema de Gerenciamento de Filas v1.0</p>
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <span>Produzido pela Sling Soluções de Mercado</span>
        <a href="https://www.slingbr.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
          <i className="fas fa-globe text-sm"></i>
        </a>
        <a href="https://www.instagram.com/slingbr_" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
          <i className="fab fa-instagram text-sm"></i>
        </a>
      </div>
    </div>
  );
};

export default AuthFooter;
