"use client";

import { useState, useEffect } from "react";
import { Select, Spin, message, Empty } from "antd";
import { motion } from "framer-motion";
import LaptopGrid from "./LaptopGrid";
import type { LaptopRange } from "../../lib/types";
import styles from "../../styles/AllProducts.module.css";

interface AllProductsDisplayProps {
  refreshTrigger?: number;
}

export default function AllProductsDisplay({
  refreshTrigger,
}: AllProductsDisplayProps) {
  const [ranges, setRanges] = useState<LaptopRange[]>([]);
  const [selectedRange, setSelectedRange] = useState<string>("all");
  const [allLaptops, setAllLaptops] = useState<any[]>([]);
  const [filteredLaptops, setFilteredLaptops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllProducts();
  }, [refreshTrigger]);

  useEffect(() => {
    filterLaptops();
  }, [selectedRange, allLaptops]);

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/all-products");
      const result = await response.json();

      if (result.success) {
        setRanges(result.data.ranges || []);
        setAllLaptops(result.data.laptops || []);
      } else {
        message.error("Failed to load products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      message.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const filterLaptops = () => {
    if (selectedRange === "all") {
      setFilteredLaptops(allLaptops);
    } else {
      const filtered = allLaptops.filter(
        (laptop) => laptop.range_id === selectedRange,
      );
      setFilteredLaptops(filtered);
    }
  };

  const handleDelete = async () => {
    await fetchAllProducts();
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>All Uploaded Products</h2>
          <p className={styles.subtitle}>
            {filteredLaptops.length} laptop
            {filteredLaptops.length !== 1 ? "s" : ""} in inventory
          </p>
        </div>
        <Select
          size="large"
          value={selectedRange}
          onChange={setSelectedRange}
          className={styles.select}
          style={{ minWidth: 250 }}
        >
          <Select.Option value="all">
            All Ranges ({allLaptops.length})
          </Select.Option>
          {ranges.map((range) => {
            const count = allLaptops.filter(
              (laptop) => laptop.range_id === range.id,
            ).length;
            return (
              <Select.Option key={range.id} value={range.id}>
                {range.name} ({count})
              </Select.Option>
            );
          })}
        </Select>
      </div>

      {filteredLaptops.length > 0 ? (
        <LaptopGrid laptops={filteredLaptops} onDelete={handleDelete} />
      ) : (
        <Empty
          description="No products uploaded yet"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className={styles.empty}
        />
      )}
    </motion.div>
  );
}
