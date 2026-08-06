export type Product = {
  slug: string
  title: string
  tagline: string
  color: string
  tech: string[]
  status: "Live" | "Building" | "Open Source"
  timeline: string
  overview: string
  whyItExists: string
  engineeringChallenges: { title: string; description: string }[]
  engineeringDecisions: { title: string; description: string; tradeoff: string }[]
  features: string[]
  metrics: { label: string; value: string }[]
  roadmap: string[]
  links: { label: string; url: string }[]
}

export const productsData: Product[] = [
  {
    slug: "papertrade",
    title: "PaperTrade",
    tagline: "High-frequency algorithmic execution engine for equities.",
    color: "#16a34a", // Green
    tech: ["FastAPI", "React", "PostgreSQL", "WebSockets", "Redis"],
    status: "Live",
    timeline: "Q3 2025 - Present",
    overview: "PaperTrade is a low-latency trading simulation engine capable of processing thousands of ticks per second. It integrates directly with Polygon.io and Alpaca APIs to provide real-time market data and simulated execution against live order books.",
    whyItExists: "Existing paper trading platforms are either too slow, simulating execution at the minute level, or lock you into a heavy monolithic UI. I needed an API-first engine that could backtest and forward-test algorithmic strategies with millisecond precision without risking real capital.",
    engineeringChallenges: [
      {
        title: "High-Throughput Race Conditions",
        description: "Handling concurrent order executions when the market price swings rapidly. If two strategies attempt to execute massive block trades simultaneously, ensuring ledger consistency at high throughput required moving from standard database locks to a Redis-backed optimistic locking model."
      },
      {
        title: "WebSocket Data Streaming",
        description: "Broadcasting live tick data to thousands of potential client connections without bottlenecking the main execution thread. Achieved by offloading Pub/Sub duties to a dedicated Redis cluster."
      }
    ],
    engineeringDecisions: [
      {
        title: "PostgreSQL for Ledger",
        description: "Used PostgreSQL to guarantee ACID compliance for all simulated transactions and account balances.",
        tradeoff: "Slower write speeds compared to NoSQL alternatives, mitigated by heavy Redis caching and batch writes."
      },
      {
        title: "FastAPI over Node.js",
        description: "Chose FastAPI (Python) for the core engine to leverage the extensive quantitative finance libraries (Pandas, NumPy) natively.",
        tradeoff: "Python's GIL complicates multi-threading, requiring a multi-process uvicorn setup to utilize full CPU cores."
      }
    ],
    features: [
      "Sub-10ms simulated execution latency",
      "Real-time NBBO (National Best Bid and Offer) tracking",
      "Full REST and WebSocket API",
      "Advanced charting and strategy visualization"
    ],
    metrics: [
      { label: "Execution Latency", value: "< 5ms" },
      { label: "Peak TPS", value: "15,000" },
      { label: "Uptime", value: "99.99%" }
    ],
    roadmap: [
      "Options and Futures support",
      "WASM-based strategy compilation for edge execution",
      "Historical data backtesting engine integration"
    ],
    links: [
      { label: "Live Application", url: "#" },
      { label: "API Documentation", url: "#" }
    ]
  },
  {
    slug: "apisense",
    title: "APISense",
    tagline: "Real-time telemetry and anomaly detection.",
    color: "#6366f1", // Indigo
    tech: ["Next.js", "ClickHouse", "Redis", "Kafka"],
    status: "Building",
    timeline: "Q1 2026 - Present",
    overview: "APISense is a distributed monitoring system that ingests high-throughput API logs, runs statistical anomaly detection models, and provides sub-second aggregations via ClickHouse.",
    whyItExists: "Most API monitoring tools are either too expensive at scale or lack the ability to instantly query vast amounts of telemetry data without pre-aggregation limits.",
    engineeringChallenges: [
      {
        title: "Ingestion Bottlenecks",
        description: "Handling burst traffic without dropping telemetry data. Implemented a Kafka buffer to absorb traffic spikes before writing to ClickHouse in optimized batches."
      }
    ],
    engineeringDecisions: [
      {
        title: "ClickHouse for Analytics",
        description: "Adopted ClickHouse for its exceptional columnar query performance on massive datasets.",
        tradeoff: "Complex operational overhead and requires strict schema design for efficient querying."
      }
    ],
    features: [
      "Real-time traffic anomaly alerts",
      "Sub-second complex analytical queries",
      "Customizable dashboarding"
    ],
    metrics: [
      { label: "Ingestion Rate", value: "50k/sec" },
      { label: "Query Latency", value: "< 100ms" }
    ],
    roadmap: [
      "AI-driven anomaly categorization",
      "Distributed tracing support (OpenTelemetry)"
    ],
    links: [
      { label: "GitHub Repository", url: "#" }
    ]
  },
  {
    slug: "motionx",
    title: "MotionX",
    tagline: "AI-driven animation orchestrator.",
    color: "#f59e0b", // Amber
    tech: ["Flutter", "Python", "LLMs", "R3F"],
    status: "Open Source",
    timeline: "2025 - 2026",
    overview: "MotionX is an experimental agentic framework that generates fluid, physics-based UI animations from natural language prompts, leveraging LLM reasoning and Framer Motion / R3F.",
    whyItExists: "Prototyping complex physics-based UI animations is time-consuming. MotionX bridges the gap between design intent and implementation by translating natural language into executable motion parameters.",
    engineeringChallenges: [
      {
        title: "Deterministic Animation Parameters",
        description: "Ensuring LLMs output stable, deterministic spring values (stiffness, damping, mass) that don't result in broken or jarring UI states."
      }
    ],
    engineeringDecisions: [
      {
        title: "Abstract Syntax Tree Generation",
        description: "Rather than outputting raw code, the LLM outputs an AST of motion parameters which is then safely evaluated by the client runtime.",
        tradeoff: "Limits the absolute flexibility of generated code but guarantees safety and crash-prevention."
      }
    ],
    features: [
      "Natural language to spring parameters",
      "Live Flutter and React previews",
      "Exportable code snippets"
    ],
    metrics: [
      { label: "Supported Runtimes", value: "3" },
      { label: "Generation Speed", value: "< 2s" }
    ],
    roadmap: [
      "3D Camera path generation",
      "Figma plugin integration"
    ],
    links: [
      { label: "View Source", url: "#" }
    ]
  }
]

export function getProductBySlug(slug: string): Product | undefined {
  return productsData.find(p => p.slug === slug)
}
