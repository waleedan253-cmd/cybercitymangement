"use client";

import { useState } from "react";
import { Card, Button, App, message, Modal } from "antd";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import Image from "next/image";
import type { Laptop } from "../../lib/types";
import styles from "../../styles/Laptopgrid.module.css";

interface LaptopGridProps {
  laptops: Laptop[];
  onDelete?: () => void;
}

export default function LaptopGrid({ laptops, onDelete }: LaptopGridProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { modal } = App.useApp();

  const handleDelete = async (laptopId: string) => {
    modal.confirm({
      title: "Delete Laptop",
      content: "Are you sure you want to delete this laptop?",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      styles: {
        // body: { backgroundColor: "white" },
        // header: { backgroundColor: "white" },
        // footer: { backgroundColor: "white" },
        content: { backgroundColor: "white" },
      },
      onOk: async () => {
        setDeletingId(laptopId);
        try {
          const response = await fetch(`/api/ranges?laptopId=${laptopId}`, {
            method: "DELETE",
          });

          const result = await response.json();

          if (result.success) {
            message.success("Laptop deleted successfully");
            onDelete?.();
          } else {
            message.error("Failed to delete laptop");
          }
        } catch (error) {
          console.error("Delete error:", error);
          message.error("Failed to delete laptop");
        } finally {
          setDeletingId(null);
        }
      },
    });
  };

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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <>
      <motion.div
        className={styles.grid}
        variants={container}
        initial="hidden"
        animate="show"
      >
        {laptops.map((laptop) => (
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
                  />
                  <div className={styles.overlay}>
                    <Button
                      type="primary"
                      icon={<EyeOutlined />}
                      onClick={() => setPreviewImage(laptop.image_url)}
                      size="large"
                    >
                      Preview
                    </Button>
                  </div>
                </div>
              }
              actions={[
                <Button
                  key="delete"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(laptop.id)}
                  loading={deletingId === laptop.id}
                  type="text"
                  className={styles.deleteButton}
                >
                  Delete
                </Button>,
              ]}
            >
              <Card.Meta
                title={
                  <span className={styles.cardTitle}>
                    {laptop.image_name || "Laptop Image"}
                  </span>
                }
                description={
                  <span className={styles.cardDescription}>
                    Uploaded: {new Date(laptop.created_at).toLocaleDateString()}
                  </span>
                }
              />
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <Modal
        open={!!previewImage}
        onCancel={() => setPreviewImage(null)}
        footer={null}
        width="90%"
        style={{ maxWidth: 1000 }}
        centered
        className={styles.modal}
      >
        {previewImage && (
          <div className={styles.previewContainer}>
            <Image
              src={previewImage}
              alt="Preview"
              width={1000}
              height={700}
              style={{ objectFit: "contain", width: "100%", height: "auto" }}
            />
          </div>
        )}
      </Modal>
    </>
  );
}
