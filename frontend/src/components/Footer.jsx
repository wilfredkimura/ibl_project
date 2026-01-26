import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <footer>
        <div className="container text-center py-2">
          <p>
            &copy; {new Date().getFullYear()} YCS St. Dominic Catholic Church. All rights reserved.
          </p>
        </div>
      </footer>
    </motion.footer>
  );
};

export default Footer;
