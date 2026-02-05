"use client";

import { motion } from "framer-motion";
import { Button } from "antd";
import { RocketOutlined, ShoppingOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import styles from "../styles/Page.module.css";
import AllProductsDisplay from "../components/admin/AllProductsDisplay";

export default function Home() {
  const router = useRouter();

  return (
    <main className={styles.main}>
      <motion.div
        className={styles.hero}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <span className={styles.cyber}>CYBER</span>
          <span className={styles.city}>CITY</span>
        </motion.h1>

        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Next-Gen Laptop Management System
        </motion.p>

        <motion.div
          className={styles.description}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <p>
            Streamline your laptop inventory with our cutting-edge admin panel.
            Upload, categorize by price range, and share with customers
            instantly.
          </p>
        </motion.div>

        <motion.div
          className={styles.actions}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Button
            type="primary"
            size="large"
            icon={<RocketOutlined />}
            onClick={() => router.push("/admin")}
            className={styles.primaryButton}
          >
            Admin Dashboard
          </Button>
        </motion.div>

        <motion.div
          className={styles.features}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <div className={styles.feature}>
            <RocketOutlined className={styles.featureIcon} />
            <h3>Instant Sharing</h3>
            <p>Generate shareable customer links</p>
          </div>
          <div className={styles.feature}>
            <ShoppingOutlined className={styles.featureIcon} />
            <h3>Range-Based </h3>
            <p>Organize laptops by price ranges</p>
          </div>
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        style={{ marginTop: "4rem", width: "100%" }}
      >
        <AllProductsDisplay />
      </motion.div>

      <div className={styles.particles}>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={styles.particle}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * -100, Math.random() * 100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </main>
  );
}
