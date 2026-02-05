"use client";

import { useState } from "react";
import { Button, Divider } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import UploadForm from "../../components/admin/UploadForm";
import RangeFilter from "../../components/admin/RangeFilter";
// import AllProductsDisplay from "../../components/admin/AllProductsDisplay";
import styles from "../../styles/Page.module.css";

export default function AdminPage() {
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.title}>
              <span className={styles.cyber}>CYBER</span>
              <span className={styles.city}>CITY</span>
            </h1>
            <p className={styles.subtitle}>Admin Dashboard</p>
          </div>
          <Button
            type="default"
            icon={<HomeOutlined />}
            onClick={() => router.push("/")}
            size="large"
            className={styles.homeButton}
            style={{
              color: "white",
            }}
          >
            Home
          </Button>
        </div>
      </motion.div>

      <div className={styles.content}>
        {/* All Products Display Section - Shows all uploaded products */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AllProductsDisplay refreshTrigger={refreshKey} />
        </motion.div> */}

        <Divider className={styles.divider} />

        <div className={styles.mainGrid}>
          <div className={styles.uploadSection}>
            <UploadForm onSuccess={handleUploadSuccess} />
          </div>

          <div className={styles.filterSection}>
            <RangeFilter key={refreshKey} />
          </div>
        </div>

        <Divider className={styles.divider} />

        <motion.div
          className={styles.info}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <h3 className={styles.infoTitle}>How It Works</h3>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div>
                <h4>Upload Laptops</h4>
                <p>
                  Select a price range and upload laptop images with a
                  description
                </p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div>
                <h4>Filter & View</h4>
                <p>Use the filter to view laptops in specific price ranges</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div>
                <h4>Share with Customers</h4>
                <p>Copy the range URL and send it to customers via WhatsApp</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
