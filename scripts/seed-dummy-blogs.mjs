import { Client, Databases, ID } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://sgp.cloud.appwrite.io/v1')
    .setProject('69a1c49e000f514136ff')
    .setKey(process.env.APPWRITE_API_KEY);

const db = new Databases(client);
const DB_ID = '69a4841a0004318eda5d';
const BLOGS_COLLECTION_ID = '69a5b95f00262c98bcf1';

const dummyBlogs = [
    {
        title: 'Getting Started with FPGA Programming in VHDL',
        description: 'A beginner-friendly introduction to FPGA development using VHDL. We cover basic syntax, simulation workflows, and implement a simple 4-bit counter on a Xilinx Artix-7 board.',
        date: 'Jul 18, 2023',
        readTime: '9 min read',
        category: 'Semiconductor',
        tags: ['FPGA', 'VHDL', 'Xilinx', 'Digital Design'],
        slug: 'getting-started-fpga-vhdl',
    },
    {
        title: 'CAN Bus Protocol Deep Dive for Automotive Systems',
        description: 'Understand how the Controller Area Network (CAN) protocol powers modern automotive electronics. Includes frame structure, error handling, and a hands-on example with STM32.',
        date: 'Jul 02, 2023',
        readTime: '11 min read',
        category: 'Embedded Systems',
        tags: ['CAN Bus', 'STM32', 'Automotive', 'Protocols'],
        slug: 'can-bus-automotive-deep-dive',
    },
    {
        title: 'Designing Low-Power BLE Sensor Nodes',
        description: 'How to architect a Bluetooth Low Energy sensor node that runs on a coin cell battery for over 2 years. Covers ADC sampling, duty cycling, and nRF52 power profiling.',
        date: 'Jun 14, 2023',
        readTime: '8 min read',
        category: 'Embedded Systems',
        tags: ['BLE', 'nRF52', 'Low Power', 'IoT'],
        slug: 'low-power-ble-sensor-nodes',
    },
    {
        title: 'Signal Integrity Fundamentals: Reflections and Termination',
        description: 'Why does your high-speed signal look like a staircase on the oscilloscope? We break down transmission line theory, reflections, and the three main termination strategies.',
        date: 'May 30, 2023',
        readTime: '7 min read',
        category: 'PCB Design',
        tags: ['Signal Integrity', 'PCB', 'Hardware', 'High Speed'],
        slug: 'signal-integrity-reflections-termination',
    },
    {
        title: 'OPC UA: The Modern Standard for Industrial Connectivity',
        description: 'A practical introduction to OPC Unified Architecture — the protocol replacing OPC Classic in Industry 4.0 deployments. Includes a Python client example connecting to a Siemens PLC.',
        date: 'May 10, 2023',
        readTime: '6 min read',
        category: 'Industrial Automation',
        tags: ['OPC UA', 'Industry 4.0', 'Python', 'Siemens'],
        slug: 'opc-ua-industrial-connectivity',
    },
    {
        title: 'ISO 13485 for Engineers: What You Actually Need to Know',
        description: 'A practical breakdown of the ISO 13485 medical device quality standard — written for engineers, not auditors. Covers design controls, risk management, and documentation requirements.',
        date: 'Apr 25, 2023',
        readTime: '10 min read',
        category: 'Medical Electronics',
        tags: ['ISO 13485', 'Medical Devices', 'Quality', 'Compliance'],
        slug: 'iso-13485-engineers-guide',
    },
    {
        title: 'From Engineer to Open Source Contributor: My First PR',
        description: 'How I went from lurking on GitHub to getting my first meaningful pull request merged into an open-source embedded toolchain. The lessons learned about code review and community.',
        date: 'Apr 08, 2023',
        readTime: '5 min read',
        category: 'Career & Learning',
        tags: ['Open Source', 'GitHub', 'Career', 'Community'],
        slug: 'first-open-source-pr',
    },
    {
        title: 'Hands-On with RISC-V: Building a Soft Core on iCE40',
        description: 'We synthesize a small RISC-V RV32I core (PicoRV32) on a Lattice iCE40 FPGA and run a simple LED blink firmware entirely on it. All open-source toolchain.',
        date: 'Mar 22, 2023',
        readTime: '12 min read',
        category: 'Semiconductor',
        tags: ['RISC-V', 'FPGA', 'iCE40', 'Open Source'],
        slug: 'risc-v-soft-core-ice40',
    },
];

console.log(`🌱 Seeding ${dummyBlogs.length} blog posts...\n`);

let success = 0;
for (const blog of dummyBlogs) {
    try {
        await db.createDocument(DB_ID, BLOGS_COLLECTION_ID, ID.unique(), blog);
        console.log(`  ✅ "${blog.title.slice(0, 55)}"`);
        success++;
        await new Promise(r => setTimeout(r, 150));
    } catch (err) {
        console.error(`  ❌ "${blog.title.slice(0, 55)}" – ${err.message}`);
    }
}

console.log(`\n🎉 Done! ${success}/${dummyBlogs.length} blogs added to Appwrite.`);
