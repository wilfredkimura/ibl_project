import { motion } from "framer-motion";
import { Container, Typography } from "@mui/material";

const Footer = () => {
  return (
    <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Container sx={{ py: 1.25 }}>
        <Typography align="center" variant="body2" color="inherit">
          &copy; {new Date().getFullYear()} YCS St. Dominic Catholic Church. All rights reserved.
        </Typography>
      </Container>
    </motion.footer>
  );
};

export default Footer;
