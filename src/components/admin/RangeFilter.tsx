"use client";

import { useState, useEffect } from "react";
import { Select, Button, message, Empty } from "antd";
import { FilterOutlined, CopyOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import type { LaptopRange } from "../../lib/types";
import LaptopGrid from "./LaptopGrid";
import styles from "../../styles/Rangefilter.module.css";

export default function RangeFilter() {
  const [ranges, setRanges] = useState<LaptopRange[]>([]);
  const [selectedRange, setSelectedRange] = useState<string>("");
  const [laptops, setLaptops] = useState<any[]>([]);
  const [rangeData, setRangeData] = useState<LaptopRange | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingRanges, setLoadingRanges] = useState(true);

  useEffect(() => {
    fetchRanges();
  }, []);

  const fetchRanges = async () => {
    try {
      const response = await fetch("/api/ranges");
      const result = await response.json();

      if (result.success) {
        setRanges(result.data);
      }
    } catch (error) {
      console.error("Error fetching ranges:", error);
      message.error("Failed to load ranges");
    } finally {
      setLoadingRanges(false);
    }
  };

  const handleFilter = async () => {
    if (!selectedRange) {
      message.warning("Please select a range");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/ranges?rangeId=${selectedRange}`);
      const result = await response.json();

      if (result.success) {
        setLaptops(result.data.laptops);
        setRangeData(result.data.range);
      } else {
        message.error("Failed to load laptops");
      }
    } catch (error) {
      console.error("Error filtering:", error);
      message.error("Failed to filter laptops");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = () => {
    if (!selectedRange) {
      message.warning("Please select and filter a range first");
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
    const url = `${baseUrl}/range/${selectedRange}`;

    navigator.clipboard
      .writeText(url)
      .then(() => {
        message.success("URL copied to clipboard!");
      })
      .catch(() => {
        message.error("Failed to copy URL");
      });
  };

  const handleDelete = async () => {
    await fetchRanges();
    if (selectedRange) {
      await handleFilter();
    }
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>Filter by Range</h2>
        <p className={styles.subtitle}>
          View laptops in a specific price range
        </p>
      </div>

      <div className={styles.controls}>
        <Select
          size="large"
          placeholder="Select a price range"
          value={selectedRange || undefined}
          onChange={setSelectedRange}
          loading={loadingRanges}
          className={styles.select}
          style={{ flex: 1 }}
        >
          {ranges.map((range) => (
            <Select.Option key={range.id} value={range.id}>
              {range.name} (RS {range.min_price.toLocaleString()} - RS{" "}
              {range.max_price.toLocaleString()})
            </Select.Option>
          ))}
        </Select>

        <Button
          type="primary"
          size="large"
          icon={<FilterOutlined />}
          onClick={handleFilter}
          loading={loading}
          className={styles.filterButton}
        >
          Filter
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {rangeData && laptops.length > 0 && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.rangeInfo}>
              <div className={styles.rangeHeader}>
                <div>
                  <h3 className={styles.rangeName}>{rangeData.name}</h3>
                  <p className={styles.rangePrice}>
                    RS {rangeData.min_price.toLocaleString()} - RS{" "}
                    {rangeData.max_price.toLocaleString()}
                  </p>
                </div>
                <Button
                  type="primary"
                  icon={<CopyOutlined />}
                  onClick={handleCopyUrl}
                  size="large"
                  className={styles.copyButton}
                >
                  Copy URL
                </Button>
              </div>

              {rangeData.description && (
                <p className={styles.rangeDescription}>
                  {rangeData.description}
                </p>
              )}
            </div>

            <LaptopGrid laptops={laptops} onDelete={handleDelete} />
          </motion.div>
        )}

        {rangeData && laptops.length === 0 && !loading && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.empty}
          >
            <Empty
              description="No laptops found in this range"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
