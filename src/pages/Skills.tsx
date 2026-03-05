import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Terminal, Cpu, Database, Network, Wrench, Code2, Server, ArrowRight } from 'lucide-react';

const skillsData = [
  {
    category: 'Embedded Systems',
    icon: Cpu,
    color: 'text-green-400',
    bg: 'bg-green-400/10',
    border: 'border-green-400/20',
    skills: [
      { name: 'C / C++', level: 90, projects: ['Arduino Custom Board'] },
      { name: 'Microcontrollers (AVR, ARM)', level: 85, projects: ['Arduino Custom Board'] },
      { name: 'RTOS', level: 70, projects: [] },
      { name: 'Hardware Debugging', level: 80, projects: ['Medical Device Evaluation'] },
    ]
  },
  {
    category: 'Hardware & PCB',
    icon: Wrench,
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
    border: 'border-orange-400/20',
    skills: [
      { name: 'Altium Designer', level: 85, projects: ['Custom UNO PCB'] },
      { name: 'Schematic Capture', level: 90, projects: ['Arduino Custom Board'] },
      { name: 'High-Speed Routing', level: 75, projects: [] },
      { name: 'Signal Integrity', level: 70, projects: [] },
    ]
  },
  {
    category: 'Industrial Automation',
    icon: Network,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
    skills: [
      { name: 'Modbus TCP/RTU', level: 85, projects: ['Machine Monitoring System'] },
      { name: 'PLC Integration', level: 75, projects: ['SMT Line Monitoring'] },
      { name: 'MES Integration', level: 80, projects: ['Machine Monitoring System'] },
      { name: 'SCADA', level: 65, projects: [] },
    ]
  },
  {
    category: 'Software & Data',
    icon: Code2,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/20',
    skills: [
      { name: 'Python', level: 85, projects: ['SMT Machine Error Log Standardization'] },
      { name: 'Node.js / Express', level: 80, projects: ['Machine Monitoring System'] },
      { name: 'Apache Kafka', level: 75, projects: ['Error Log Dashboard'] },
      { name: 'PostgreSQL', level: 70, projects: ['Machine Monitoring System'] },
    ]
  }
];

export function Skills() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
            Technical <span className="text-black dark:text-white">Skills Map</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            A comprehensive overview of my technical proficiencies, mapped directly to the projects where they were applied.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {skillsData.map((category, idx) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`p-6 md:p-8 rounded-2xl bg-gray-100 dark:bg-gray-900/50 border ${category.border} relative overflow-hidden group`}
            >
              {/* Background glow */}
              <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full ${category.bg} blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className={`p-3 rounded-xl ${category.bg} ${category.color}`}>
                  <category.icon className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-black dark:text-white">{category.category}</h2>
              </div>

              <div className="space-y-6 relative z-10">
                {category.skills.map((skill) => (
                  <div key={skill.name} className="group/skill">
                    <div className="flex justify-between items-end mb-2">
                      <h3 className="text-gray-800 dark:text-gray-200 font-medium">{skill.name}</h3>
                      <span className="text-xs font-mono text-gray-500 dark:text-gray-500">{skill.level}%</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mb-3">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: 0.2 + (idx * 0.1) }}
                        className={`h-full rounded-full ${category.color.replace('text-', 'bg-')}`}
                      />
                    </div>

                    {/* Linked Projects */}
                    {skill.projects.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {skill.projects.map(project => (
                          <Link 
                            key={project} 
                            to="/projects" 
                            className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-gray-200 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 hover:text-black dark:text-white hover:bg-gray-200 dark:bg-gray-800 transition-colors border border-gray-300 dark:border-gray-700/50"
                          >
                            {project}
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-600 italic">Applied in internal/confidential work</div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
