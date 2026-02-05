"use client";

import { Button } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import styles from "../../styles/not-found.module.css";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>Range Not Found</h2>
        <p className={styles.description}>
          The laptop range you're looking for doesn't exist or has been removed.
        </p>
        <Button
          type="primary"
          size="large"
          icon={<HomeOutlined />}
          onClick={() => router.push("/")}
          className={styles.button}
        >
          Back to Home
        </Button>
      </motion.div>
    </div>
  );
}
