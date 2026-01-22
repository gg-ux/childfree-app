"use client";

import { useEffect, useRef, useState } from "react";

interface DataPoint {
  year: number;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  title?: string;
  yLabel?: string;
  color?: "coral" | "forest" | "marigold";
}

export function LineChart({
  data,
  title,
  yLabel = "%",
  color = "forest"
}: LineChartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const width = 600;
  const height = 320;
  const padding = { top: 40, right: 40, bottom: 50, left: 55 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate scales
  const years = data.map(d => d.year);
  const values = data.map(d => d.value);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  const maxValue = Math.ceil(Math.max(...values) / 10) * 10; // Round up to nearest 10

  const xScale = (year: number) =>
    padding.left + ((year - minYear) / (maxYear - minYear)) * chartWidth;
  const yScale = (value: number) =>
    padding.top + chartHeight - (value / maxValue) * chartHeight;

  // Generate smooth curved path using catmull-rom to bezier conversion
  const generateSmoothPath = () => {
    if (data.length < 2) return '';

    const points = data.map(d => ({ x: xScale(d.year), y: yScale(d.value) }));

    if (points.length === 2) {
      // For 2 points, create a subtle curve
      const [p0, p1] = points;
      const midX = (p0.x + p1.x) / 2;
      const midY = (p0.y + p1.y) / 2 - 20; // Slight upward curve
      return `M ${p0.x} ${p0.y} Q ${midX} ${midY} ${p1.x} ${p1.y}`;
    }

    // For multiple points, use smooth bezier curves
    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    return path;
  };

  const pathD = generateSmoothPath();

  // Calculate path length for animation
  const pathLength = 1000; // Approximate, will be set by CSS

  // Color mapping
  const colors = {
    coral: "#D4654A",
    forest: "#2F7255",
    marigold: "#D9A441",
  };

  const strokeColor = colors[color];

  // Y-axis ticks
  const yTicks = [0, maxValue / 2, maxValue];

  return (
    <div ref={ref} className="my-8 bg-foreground/[0.03] rounded-2xl p-6 overflow-hidden">
      {title && (
        <p className="theme-body-sm text-muted mb-4">{title}</p>
      )}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        role="img"
        aria-label="Line chart showing childfree percentage over time"
      >
        {/* Grid lines */}
        {yTicks.map((tick) => (
          <line
            key={tick}
            x1={padding.left}
            y1={yScale(tick)}
            x2={width - padding.right}
            y2={yScale(tick)}
            stroke="currentColor"
            strokeOpacity={0.08}
          />
        ))}

        {/* Y-axis labels */}
        {yTicks.map((tick) => (
          <text
            key={tick}
            x={padding.left - 15}
            y={yScale(tick)}
            textAnchor="end"
            dominantBaseline="middle"
            className="fill-muted"
            style={{ fontSize: '12px', fontFamily: 'Satoshi, sans-serif', fontWeight: 500 }}
          >
            {tick}{yLabel}
          </text>
        ))}

        {/* X-axis labels */}
        {data.map((d) => (
          <text
            key={d.year}
            x={xScale(d.year)}
            y={height - padding.bottom + 28}
            textAnchor="middle"
            className="fill-muted"
            style={{ fontSize: '12px', fontFamily: 'Satoshi, sans-serif', fontWeight: 500 }}
          >
            {d.year}
          </text>
        ))}

        {/* Animated line */}
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: pathLength,
            strokeDashoffset: isVisible ? 0 : pathLength,
            transition: 'stroke-dashoffset 1.2s ease-out',
          }}
        />

        {/* Data points with animation */}
        {data.map((d, i) => (
          <g
            key={d.year}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
              transition: `opacity 0.4s ease-out ${0.8 + i * 0.15}s, transform 0.4s ease-out ${0.8 + i * 0.15}s`,
            }}
          >
            <circle
              cx={xScale(d.year)}
              cy={yScale(d.value)}
              r={6}
              fill={strokeColor}
            />
            <circle
              cx={xScale(d.year)}
              cy={yScale(d.value)}
              r={10}
              fill={strokeColor}
              opacity={0.2}
            />
            {/* Value label */}
            <text
              x={xScale(d.year)}
              y={yScale(d.value) - 20}
              textAnchor="middle"
              className="fill-foreground"
              style={{ fontSize: '15px', fontWeight: 600 }}
            >
              {d.value}%
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
