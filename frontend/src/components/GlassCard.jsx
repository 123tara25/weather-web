import { motion } from "framer-motion";

const GlassCard = ({ children, className = "", delay = 0, hover = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -8, scale: 1.01 } : {}}
      transition={{
        type: "spring",
        stiffness: 100,
        delay
      }}
      className={`card ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;

