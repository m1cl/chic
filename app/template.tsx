"use client";
import { ReactNode } from "react";
import { motion } from "framer-motion";

export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div initial={{ y: 21, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
      {children}
    </motion.div>
  );
}
