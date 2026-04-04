const Footer = () => (
  <footer className="py-8 bg-background border-t border-border">
    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="font-display text-lg font-bold text-foreground">
        ITA <span className="text-primary">FRAMES</span>
      </p>
      <p className="font-body text-xs text-muted-foreground tracking-wider">
        © {new Date().getFullYear()} Ita Frames. Todos os direitos reservados.
      </p>
    </div>
  </footer>
);

export default Footer;
