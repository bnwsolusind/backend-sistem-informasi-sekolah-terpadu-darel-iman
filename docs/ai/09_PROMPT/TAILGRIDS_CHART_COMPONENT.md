Read docs/ai/README.md and INDEX.md first.

# TailGrids Chart Component Integration Prompt & Guideline

## Overview
Dokumen ini berisi panduan dan prompt integrasi komponen **Chart / Grafik** berbasis **TailGrids UI Library** (`@/components/tailgrids/core/chart`) & **Recharts** untuk Sistem Manajemen Sekolah Terpadu (SIMSIT).

---

## Canonical Imports & Component Anatomy

```jsx
"use client";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/tailgrids/core/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
```

### Sub-Components:
- **`<ChartContainer>`**: Responsive wrapper container berbasis Recharts `ResponsiveContainer`.
- **`<ChartTooltip>`**: Recharts Tooltip wrapper.
- **`<ChartTooltipContent indicator="dot | line | square">`**: Content tooltip kustom dengan indikator visual.
- **`<ChartLegend>`**: Recharts Legend wrapper.
- **`<ChartLegendContent>`**: Content legend kustom dengan style SIMSIT.

---

## 1. Chart Preview (Area Chart dengan Gradient & Custom Tooltip)

```jsx
"use client";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/tailgrids/core/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

export default function ChartPreview() {
  const data = [
    {
      name: "January",
      uv: 1890
    },
    {
      name: "February",
      uv: 2780
    },
    {
      name: "March",
      uv: 2000
    },
    {
      name: "April",
      uv: 3200
    },
    {
      name: "May",
      uv: 3000
    },
    {
      name: "June",
      uv: 3400
    }
  ];

  return (
    <div className="w-80 pl-0 p-4 md:pl-0 md:p-8 md:w-140 aspect-video bg-background-50 rounded">
      <ChartContainer
        initialDimension={{
          width: 280,
          height: 160
        }}
        className="[&_.recharts-tooltip-cursor]:stroke-slate-200"
      >
        <AreaChart data={data}>
          <defs>
            <linearGradient id="background" x1="0" y1="0" x2="0" y2="1">
              <stop offset={"5%"} stopColor="#3758F9" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3758F9" stopOpacity={0} />
            </linearGradient>
          </defs>

          <Area
            dataKey={"uv"}
            stroke="#3758F9"
            fill="url(#background)"
            type="monotone"
          />

          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tickMargin={6}
            tickCount={6}
            tickFormatter={value => value.slice(0, 3)}
          />
          <YAxis axisLine={false} tickLine={false} />

          <ChartTooltip
            content={<ChartTooltipContent indicator={"square"} />}
          />
          <ChartLegend content={<ChartLegendContent />} />
          <CartesianGrid vertical={false} />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}

---

## 2. Line Chart Preview (ChartLinePreview dengan Multi-Series & Line Tooltip)

```jsx
"use client";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/tailgrids/core/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

export default function ChartLinePreview() {
  const data = [
    { name: "Jan", desktop: 400, mobile: 240 },
    { name: "Feb", desktop: 300, mobile: 139 },
    { name: "Mar", desktop: 200, mobile: 980 },
    { name: "Apr", desktop: 278, mobile: 390 },
    { name: "May", desktop: 189, mobile: 480 },
    { name: "Jun", desktop: 239, mobile: 380 }
  ];

  return (
    <div className="w-80 p-4 md:p-8 md:w-140 aspect-video bg-background-50 rounded">
      <ChartContainer
        initialDimension={{ width: 280, height: 160 }}
      >
        <LineChart data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tickMargin={8}
            tickCount={6}
          />
          <YAxis axisLine={false} tickLine={false} />
          <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Line
            dataKey="desktop"
            type="monotone"
            stroke="#3758F9"
            strokeWidth={2}
            dot={false}
          />
          <Line
            dataKey="mobile"
            type="monotone"
            stroke="#13C296"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}

---

## 3. Bar Chart Preview (ChartBarPreview dengan Multi-Bar & Square Tooltip)

```jsx
"use client";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/tailgrids/core/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

export default function ChartBarPreview() {
  const data = [
    { name: "Jan", desktop: 400, mobile: 240 },
    { name: "Feb", desktop: 300, mobile: 139 },
    { name: "Mar", desktop: 200, mobile: 980 },
    { name: "Apr", desktop: 278, mobile: 390 },
    { name: "May", desktop: 189, mobile: 480 },
    { name: "Jun", desktop: 239, mobile: 380 }
  ];

  return (
    <div className="w-80 p-4 md:p-8 md:w-140 aspect-video bg-background-50 rounded">
      <ChartContainer
        initialDimension={{ width: 280, height: 160 }}
      >
        <BarChart data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tickMargin={8}
            tickCount={6}
          />
          <YAxis axisLine={false} tickLine={false} />
          <ChartTooltip content={<ChartTooltipContent indicator="square" />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="desktop"
            fill="#3758F9"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="mobile"
            fill="#13C296"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}

---

## 4. Pie / Donut Chart Preview (ChartPiePreview dengan Custom Colors & Inner Radius)

```jsx
"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/tailgrids/core/chart";
import { Cell, Pie, PieChart } from "recharts";

export default function ChartPiePreview() {
  const data = [
    { name: "Desktop", value: 400 },
    { name: "Mobile", value: 300 },
    { name: "Tablet", value: 300 },
    { name: "Other", value: 200 }
  ];

  const COLORS = ['#3758F9', '#13C296', '#F2994A', '#E0E0E0'];

  return (
    <div className="w-80 p-4 md:p-8 md:w-140 aspect-video bg-background-50 rounded">
      <ChartContainer
        initialDimension={{ width: 280, height: 160 }}
        className="w-full h-full min-h-40"
      >
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        </PieChart>
      </ChartContainer>
    </div>
  );
}
```

```

```

```
