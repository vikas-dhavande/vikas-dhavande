import { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Download, Clock, Filter } from 'lucide-react';

const docCategories = ['All', 'PCB', 'Embedded', 'Industrial', 'Medical'];

const documents = [
  {
    id: 1,
    title: 'Custom Arduino Board Schematic & Layout',
    category: 'PCB',
    description: 'Complete Altium Designer project files, gerbers, and BOM for the industrial-grade Arduino compatible board.',
    version: 'v1.2',
    date: 'Oct 2023',
    size: '4.2 MB',
    tags: ['Altium', 'Schematic', 'Gerber'],
    link: '#',
  },
  {
    id: 2,
    title: 'Modbus TCP Monitoring System Architecture',
    category: 'Industrial',
    description: 'High-level system architecture, database schema, and API documentation for the CNC machine monitoring dashboard.',
    version: 'v2.0',
    date: 'Sep 2023',
    size: '1.8 MB',
    tags: ['Architecture', 'API', 'Database'],
    link: '#',
  },
  {
    id: 3,
    title: 'SMT Error Log Pipeline Design',
    category: 'Data Engineering',
    description: 'Detailed design document outlining the Kafka topics, Python consumer logic, and Elasticsearch indexing strategy.',
    version: 'v1.0',
    date: 'Aug 2023',
    size: '2.5 MB',
    tags: ['Kafka', 'Python', 'Design Doc'],
    link: '#',
  },
  {
    id: 4,
    title: 'Portable ECG Monitor Evaluation Report',
    category: 'Medical',
    description: 'Comprehensive test results, SNR calculations, and compliance checks against IEC 60601-1 for the evaluated ECG device.',
    version: 'Final',
    date: 'Jul 2023',
    size: '5.1 MB',
    tags: ['Testing', 'Compliance', 'Report'],
    link: '#',
  },
  {
    id: 5,
    title: 'Firmware Update Protocol Specification',
    category: 'Embedded',
    description: 'Specification for a custom, robust over-the-air (OTA) firmware update protocol designed for low-bandwidth industrial networks.',
    version: 'v0.9 (Draft)',
    date: 'Nov 2023',
    size: '1.2 MB',
    tags: ['Protocol', 'OTA', 'Firmware'],
    link: '#',
  },
];

export function Docs() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredDocs = documents.filter(
    (doc) => activeCategory === 'All' || doc.category === activeCategory
  );

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
            Project <span className="text-black dark:text-white">Documentation</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Downloadable resources, technical specifications, and detailed reports from my engineering projects.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-500 mr-2">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filter:</span>
          </div>
          {docCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-black dark:bg-white text-white dark:text-black'
                  : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:bg-gray-800 hover:text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Documents List */}
        <div className="bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
          {/* Desktop Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 p-6 border-b border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900/80 text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider">
            <div className="col-span-5">Document Title</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Version / Date</div>
            <div className="col-span-2">Tags</div>
            <div className="col-span-1 text-right">Action</div>
          </div>

          {/* List Items */}
          <div className="divide-y divide-slate-800/50">
            {filteredDocs.length > 0 ? (
              filteredDocs.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 hover:bg-gray-200 dark:bg-gray-800/30 transition-colors items-center group"
                >
                  {/* Title & Mobile Description */}
                  <div className="md:col-span-5 flex items-start gap-4">
                    <div className="mt-1 p-2 rounded bg-gray-200 dark:bg-gray-800 text-black dark:text-white">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 dark:text-gray-200 group-hover:text-black dark:text-white transition-colors mb-1">
                        {doc.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-500 line-clamp-2 md:line-clamp-1">
                        {doc.description}
                      </p>
                      
                      {/* Mobile-only metadata */}
                      <div className="md:hidden flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-600 dark:text-gray-400">
                        <span className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-800">{doc.category}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {doc.date}</span>
                        <span>{doc.version}</span>
                        <span>{doc.size}</span>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Metadata */}
                  <div className="hidden md:block md:col-span-2">
                    <span className="px-2.5 py-1 rounded text-xs font-medium bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                      {doc.category}
                    </span>
                  </div>

                  <div className="hidden md:flex flex-col gap-1 md:col-span-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-mono text-gray-700 dark:text-gray-300">{doc.version}</span>
                    <span className="flex items-center gap-1 text-xs"><Clock className="w-3 h-3" /> {doc.date}</span>
                  </div>

                  <div className="hidden md:flex flex-wrap gap-1 md:col-span-2">
                    {doc.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-200 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700/50">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Button */}
                  <div className="md:col-span-1 flex justify-end mt-4 md:mt-0">
                    <a
                      href={doc.link}
                      className="flex items-center justify-center gap-2 w-full md:w-auto px-4 py-2 md:p-2 rounded-lg md:rounded-full bg-black dark:bg-white/10 text-black dark:text-white hover:bg-black dark:bg-white hover:text-white dark:text-black transition-colors border border-black dark:border-white/20 hover:border-black dark:border-white"
                      aria-label={`Download ${doc.title}`}
                    >
                      <Download className="w-4 h-4" />
                      <span className="md:hidden text-sm font-medium">Download ({doc.size})</span>
                    </a>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-12 text-center text-gray-600 dark:text-gray-400">
                No documents found in this category.
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
