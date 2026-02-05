"use client";

import { useState } from "react";
import { Form, Input, InputNumber, Upload, Button, message } from "antd";
import { InboxOutlined, RocketOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { motion } from "framer-motion";
import styles from "../../styles/Uploadform.module.css";

const { TextArea } = Input;
const { Dragger } = Upload;

interface UploadFormProps {
  onSuccess: () => void;
}

export default function UploadForm({ onSuccess }: UploadFormProps) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    if (fileList.length === 0) {
      message.warning("Please upload at least one image");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("productName", values.productName);
      formData.append("minPrice", values.minPrice.toString());
      formData.append("maxPrice", values.maxPrice.toString());
      formData.append("description", values.description || "");

      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("images", file.originFileObj);
        }
      });

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        message.success(result.message || "Upload successful!");
        form.resetFields();
        setFileList([]);
        onSuccess();
      } else {
        message.error(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Failed to upload images");
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    fileList,
    onChange: ({ fileList }: any) => setFileList(fileList),
    beforeUpload: () => false,
    accept: "image/*",
    multiple: true,
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>Upload Laptops</h2>
        <p className={styles.subtitle}>Add new laptops to your inventory</p>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className={styles.form}
        requiredMark={false}
      >
        <Form.Item
          label="Product Name"
          name="productName"
          rules={[{ required: true, message: "Please enter product name" }]}
        >
          <Input
            placeholder="e.g., Dell-Thinkpad"
            size="large"
            className={styles.input}
          />
        </Form.Item>

        <div className={styles.priceRow}>
          <Form.Item
            label="Min Price (RS)"
            name="minPrice"
            rules={[{ required: true, message: "Required" }]}
            className={styles.priceInput}
          >
            <InputNumber
              placeholder="e.g.,10000"
              size="large"
              min={0}
              style={{ width: "100%" }}
              className={styles.inputNumber}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            />
          </Form.Item>

          <Form.Item
            label="Max Price (RS)"
            name="maxPrice"
            rules={[
              { required: true, message: "Required" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("minPrice") < value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Must be greater than min price"),
                  );
                },
              }),
            ]}
            className={styles.priceInput}
          >
            <InputNumber
              placeholder="e.g.,20000"
              size="large"
              min={0}
              className={styles.inputNumber}
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            />
          </Form.Item>
        </div>

        <Form.Item label="Description" name="description">
          <TextArea
            placeholder="Describe this range of laptops..."
            rows={4}
            className={styles.textarea}
          />
        </Form.Item>

        <Form.Item label="Upload Images" className="child">
          <Dragger {...uploadProps} className={styles.dragger}>
            <p className={styles.draggerIcon}>
              <InboxOutlined />
            </p>
            <p className={styles.draggerText}>Click or drag images to upload</p>
            <p className={styles.draggerHint}>
              Support for multiple images. PNG, JPG, WEBP formats accepted.
            </p>
          </Dragger>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            icon={<RocketOutlined />}
            block
            className={styles.submitButton}
          >
            {loading ? "Uploading..." : "Upload Laptops"}
          </Button>
        </Form.Item>
      </Form>
    </motion.div>
  );
}
