"use client";

import { useState } from "react";
import { Card, Modal, Button, Empty } from "antd";
import { EyeOutlined, WhatsAppOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import Image from "next/image";
import type { Laptop, LaptopRange } from "../../lib/types";
import styles from "../../styles/Productshowcase.module.css";

interface ProductShowcaseProps {
  range: LaptopRange;
  laptops: Laptop[];
}

export default function ProductShowcase({
  range,
  laptops,
}: ProductShowcaseProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.hero}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{range.name}</h1>
          <div className={styles.priceTag}>
            <span className={styles.currency}>RS</span>
            <span className={styles.priceRange}>
              {range.min_price.toLocaleString()} -{" "}
              {range.max_price.toLocaleString()}
            </span>
          </div>
          {range.description && (
            <p className={styles.description}>{range.description}</p>
          )}
        </div>
      </motion.div>

      {laptops.length === 0 ? (
        <motion.div
          className={styles.empty}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Empty
            description="No laptops available in this range"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </motion.div>
      ) : (
        <motion.div
          className={styles.grid}
          variants={container}
          initial="hidden"
          animate="show"
        >
          {laptops.map((laptop, index) => (
            <motion.div key={laptop.id} variants={item}>
              <Card
                className={styles.card}
                cover={
                  <div className={styles.imageContainer}>
                    <Image
                      src={laptop.image_url}
                      alt={laptop.image_name || "Laptop"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                      className={styles.image}
                      priority={index < 3}
                    />
                    <div className={styles.overlay}>
                      <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => setPreviewImage(laptop.image_url)}
                        size="large"
                        className={styles.viewButton}
                      >
                        View Full Image
                      </Button>
                    </div>
                    <div className={styles.badge}>#{index + 1}</div>
                  </div>
                }
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      <motion.div
        className={styles.footer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className={styles.footerContent}>
          <div className={styles.contactInfo}>
            <h3>Interested in these laptops?</h3>
            <p>Contact us on WhatsApp for more information and pricing</p>
          </div>
          <Button
            type="primary"
            icon={<WhatsAppOutlined />}
            size="large"
            className={styles.whatsappButton}
            onClick={() => window.open("https://wa.me/923377638063", "_blank")}
          >
            Contact on WhatsApp
          </Button>
        </div>
      </motion.div>

      <Modal
        open={!!previewImage}
        onCancel={() => setPreviewImage(null)}
        footer={null}
        width="90%"
        style={{ maxWidth: 1200 }}
        centered
        className={styles.modal}
      >
        {previewImage && (
          <div className={styles.previewContainer}>
            <Image
              src={previewImage}
              alt="Preview"
              width={1200}
              height={800}
              style={{ objectFit: "contain", width: "100%", height: "auto" }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
