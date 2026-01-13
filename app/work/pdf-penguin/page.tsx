'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Navigation from '@/app/components/Navigation';

export const dynamic = 'force-dynamic';

export default function PDFPenguinCaseStudy() {
  return (
    <main className="bg-[#FAFAF8] min-h-screen">
      {/* Navigation */}
      <nav className="container mx-auto px-6 md:px-12 lg:px-20 py-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="font-mono text-sm tracking-wide text-gray-900 font-medium hover:text-[#C75B3B] transition-colors">
            MICHAEL BOBOV
          </Link>
          <Navigation />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 md:px-12 lg:px-20 pt-16 md:pt-24 mb-16">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-4"
        >
          AI • Developer Tools • 2025
        </motion.p>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 mb-6"
        >
          PDF Penguin
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-600 max-w-2xl mb-12"
        >
          AI-powered PDF to JSON conversion for structured, usable data.
        </motion.p>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full"
        >
          <Image 
            src="/mockuuups-macknook-air.png"
            alt="PDF Penguin Interface"
            width={1920}
            height={1080}
            className="w-full h-auto"
            priority
          />
        </motion.div>
      </section>

      {/* Project Details */}
      <section className="container mx-auto px-6 md:px-12 lg:px-20 py-16 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-8">
          <div>
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-2">Role</p>
            <p className="text-gray-900">Founder</p>
            <p className="text-gray-900">Product Designer</p>
            <p className="text-gray-900">Frontend Developer</p>
      </div>
          <div>
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-2">Timeline</p>
            <p className="text-gray-900">2 weeks</p>
            <p className="text-gray-600 text-sm">Design MVP (product not out yet)</p>
            </div>
          <div>
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-2">Team</p>
            <p className="text-gray-900">Solo Project</p>
            <p className="text-gray-600 text-sm">End-to-end ownership</p>
            </div>
          <div>
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-2">Skills</p>
            <p className="text-gray-900">Product Design</p>
            <p className="text-gray-900">AI Integration</p>
            <p className="text-gray-900">Frontend Dev</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-6 md:px-12 lg:px-20 max-w-4xl">
        
        {/* Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-16 border-t border-gray-200"
        >
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Overview</p>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed mb-8">
            PDF Penguin converts unstructured PDFs into clean, structured JSON data using AI. Drag, drop, describe what you need — get instant results.
              </p>
              <p className="text-gray-600 leading-relaxed">
            I built this while developing EZ Recipe, where I needed to extract USDA nutrition data from messy PDFs. Existing tools were too technical or unreliable, so I created something simpler. PDF Penguin has since evolved into a standalone product with broader applications.
          </p>
        </motion.div>

        {/* Problem */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-16 border-t border-gray-200"
        >
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Problem</p>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed mb-8">
            Non-technical users struggle to extract structured data from PDFs. Existing tools require setup, technical knowledge, or produce inconsistent results.
          </p>
          <div className="space-y-6 mb-8">
            <div className="flex gap-4">
              <span className="text-[#C75B3B] font-mono text-sm">01</span>
            <div>
                <p className="text-gray-900 font-medium">Tools are too technical</p>
                <p className="text-gray-600 text-sm mt-1">Tabula requires manual area selection. DocParser needs schema expertise. Adobe exports break formatting.</p>
              </div>
                </div>
            <div className="flex gap-4">
              <span className="text-[#C75B3B] font-mono text-sm">02</span>
              <div>
                <p className="text-gray-900 font-medium">Inconsistent results</p>
                <p className="text-gray-600 text-sm mt-1">Scanned PDFs fail. Multi-page documents break. Output requires extensive cleanup.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-[#C75B3B] font-mono text-sm">03</span>
            <div>
                <p className="text-gray-900 font-medium">Slow time-to-first-output</p>
                <p className="text-gray-600 text-sm mt-1">Users spend 15+ minutes on setup, configuration, or manual data copying.</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg">
            <p className="text-gray-900 italic">"I just need to get this table data into a spreadsheet, but the PDF is a mess."</p>
            <p className="text-gray-500 text-sm mt-2">— Common user frustration</p>
          </div>
        </motion.div>

        {/* Research */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-16 border-t border-gray-200"
        >
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Research</p>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed mb-8">
            I tested Tabula, Adobe Acrobat, and DocParser as a first-time user with minimal technical background.
              </p>
          
              {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto mb-8">
            <table className="w-full border-collapse border-2 border-gray-300 text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                  <th className="border-2 border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Category</th>
                  <th className="border-2 border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Tabula</th>
                  <th className="border-2 border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Adobe Acrobat</th>
                  <th className="border-2 border-gray-300 px-4 py-3 text-left font-medium text-gray-900">DocParser</th>
                  <th className="border-2 border-gray-300 px-4 py-3 text-left font-medium text-[#C75B3B]">PDF Penguin</th>
                      </tr>
                    </thead>
              <tbody>
                      <tr>
                  <td className="border-2 border-gray-300 px-4 py-3 font-medium text-gray-900">How to Use</td>
                  <td className="border-2 border-gray-300 px-4 py-3 text-gray-600">Install → select area → export</td>
                  <td className="border-2 border-gray-300 px-4 py-3 text-gray-600">Open → Export To → fix formatting</td>
                  <td className="border-2 border-gray-300 px-4 py-3 text-gray-600">Create parser → define rules → run</td>
                  <td className="border-2 border-gray-300 px-4 py-3 text-gray-600 font-medium text-[#C75B3B]">Drag & drop → describe → copy</td>
                      </tr>
                      <tr className="bg-gray-50">
                  <td className="border-2 border-gray-300 px-4 py-3 font-medium text-gray-900">Setup Time</td>
                  <td className="border-2 border-gray-300 px-4 py-3 text-gray-600">10–15 mins</td>
                  <td className="border-2 border-gray-300 px-4 py-3 text-gray-600">5–10 mins per doc</td>
                  <td className="border-2 border-gray-300 px-4 py-3 text-gray-600">15–30 mins upfront</td>
                  <td className="border-2 border-gray-300 px-4 py-3 text-gray-600 font-medium text-[#C75B3B]">&lt;10 seconds</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4 mb-8">
            <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2">Tabula</h5>
              <p className="text-sm text-gray-600">Install → select area → export. 10–15 min setup.</p>
                  </div>
            <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2">Adobe Acrobat</h5>
              <p className="text-sm text-gray-600">Open → Export → fix formatting. 5–10 min per doc.</p>
                </div>
            <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2">DocParser</h5>
              <p className="text-sm text-gray-600">Create parser → define rules → run. 15–30 min upfront.</p>
                  </div>
            <div className="bg-[#C75B3B]/5 border-2 border-[#C75B3B] rounded-lg p-4">
              <h5 className="font-medium text-[#C75B3B] mb-2">PDF Penguin</h5>
              <p className="text-sm text-gray-600">Drag & drop → describe → copy. &lt;10 seconds.</p>
                  </div>
                </div>
                
          <div>
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-3">Key Insight</p>
            <p className="text-gray-900 text-lg mb-4">
              <span className="text-[#C75B3B] font-medium">Zero-config wins.</span> Competing tools expect users to know schemas and export settings. PDF Penguin should require zero setup.
            </p>
          </div>
        </motion.div>

        {/* Solution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-16 border-t border-gray-200"
        >
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Solution</p>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed mb-8">
            A two-panel interface: drag and drop PDFs on the left, describe your desired output in plain language, get clean JSON on the right.
                </p>

          {/* User Flow */}
          <div className="mb-8">
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-3">User Flow</p>
            <div className="flex justify-center">
              <Image
                src="/pdfpenguinflow.png"
                alt="PDF Penguin User Flow Chart"
                width={1920}
                height={1280}
                className="max-w-md w-full h-auto"
                quality={95}
              />
              </div>
            </div>

          <div className="space-y-6 mb-8">
            <div>
              <p className="text-gray-900 font-medium mb-2">Upload & Process</p>
              <p className="text-gray-600">Drag PDF → AI analyzes structure → Extracts data based on prompt</p>
            </div>
            <div>
              <p className="text-gray-900 font-medium mb-2">Customize Output</p>
              <p className="text-gray-600">Describe structure in plain language → Preview results → Iterate</p>
            </div>
            <div>
              <p className="text-gray-900 font-medium mb-2">Export & Save</p>
              <p className="text-gray-600">Copy JSON → Save to library → Access anytime</p>
            </div>
                </div>
                
          <div>
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-3">Design Principles</p>
            <div className="space-y-3 text-gray-600">
              <p><span className="text-gray-900 font-medium">Zero setup:</span> No installation, no configuration, no learning curve.</p>
              <p><span className="text-gray-900 font-medium">Natural language:</span> Describe what you want, not how to extract it.</p>
              <p><span className="text-gray-900 font-medium">Instant feedback:</span> See results immediately, iterate quickly.</p>
                  </div>
                </div>
        </motion.div>
      </section>

      {/* Design Process */}
      <section className="py-16 border-t border-gray-200">
        <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-4xl mb-12">
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Design Process</p>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed">
            From sketches to high-fidelity prototypes through rapid iteration.
          </p>
                </div>
                
        <div className="space-y-16">
          {/* Initial Sketches */}
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="max-w-4xl mb-6">
              <p className="text-gray-900 font-medium text-lg mb-2">Initial Sketches</p>
              <p className="text-gray-600">Early exploration of layout concepts and interaction patterns.</p>
            </div>
            <div className="flex justify-center">
                    <Image
                src="/sketchpdfpenguin.png"
                alt="PDF Penguin Initial Sketches"
                width={1920}
                height={1280}
                className="max-w-xl w-full h-auto"
                quality={95}
                    />
                </div>
              </div>

          {/* Lo-Fi Prototype */}
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="max-w-4xl mb-6">
              <p className="text-gray-900 font-medium text-lg mb-2">Lo-Fi Prototypes</p>
              <p className="text-gray-600">Testing the upload, prompt, and output flow with minimal styling.</p>
                </div>

            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <Image src="/pengu1lowfi.png" alt="Upload Interface" width={1920} height={1280} className="max-w-lg w-full h-auto" quality={95} />
              <Image src="/pengu2lowfi.png" alt="JSON Output" width={1920} height={1280} className="max-w-lg w-full h-auto" quality={95} />
              <Image src="/pengu3lowfi.png" alt="Library View" width={1920} height={1280} className="max-w-lg w-full h-auto" quality={95} />
              <Image src="/pengu4lowfi.png" alt="Document View" width={1920} height={1280} className="max-w-lg w-full h-auto" quality={95} />
            </div>

            <div className="max-w-4xl">
              <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-3">Testing Insights</p>
              <ul className="text-gray-600 space-y-2">
                <li>• Two-panel layout preferred for immediate visual feedback</li>
                <li>• Prompt field needed placeholder text to guide AI instructions</li>
                <li>• Error states required helpful messaging with next steps</li>
              </ul>
                  </div>
                </div>
                
          {/* High-Fidelity Prototypes */}
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="max-w-4xl mb-6">
              <p className="text-gray-900 font-medium text-lg mb-2">High-Fidelity Prototypes</p>
              <p className="text-gray-600">Polished designs ready for development.</p>
                </div>
                
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <Image src="/highfipengu1.png" alt="Upload Interface Hi-Fi" width={1920} height={1280} className="max-w-lg w-full h-auto" quality={95} />
              <Image src="/highfipengu2.png" alt="JSON Output Hi-Fi" width={1920} height={1280} className="max-w-lg w-full h-auto" quality={95} />
              <Image src="/highfipengu3.png" alt="Library View Hi-Fi" width={1920} height={1280} className="max-w-lg w-full h-auto" quality={95} />
              <Image src="/highfipengu4.png" alt="Document View Hi-Fi" width={1920} height={1280} className="max-w-lg w-full h-auto" quality={95} />
                </div>
                
                <div className="text-center">
                <a 
                  href="https://www.figma.com/proto/6gUB6gR6ATucf890UPjQO6/Pdf-Pengu?node-id=14-418&t=O1XBikXg0ng6HNMv-1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#C75B3B] hover:bg-[#A84A2E] text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  Open Figma Prototype
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

          {/* Final Product */}
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="max-w-4xl mb-6">
              <p className="text-gray-900 font-medium text-lg mb-2">Final Product</p>
              <p className="text-gray-600">Built with React + TailwindCSS, integrated OCR and OpenAI APIs, deployed via Vercel.</p>
            </div>
            <div className="flex justify-center">
              <Image 
                src="/pdf-penguin.png"
                alt="PDF Penguin Final Product"
                width={1920}
                height={1280}
                className="max-w-3xl w-full h-auto"
                quality={95}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Design Decisions */}
      <section className="container mx-auto px-6 md:px-12 lg:px-20 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-16 border-t border-gray-200"
        >
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Design Decisions</p>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed mb-8">
            Key decisions that shaped the final product.
          </p>
          
          <div className="space-y-8">
            <div>
              <p className="text-gray-900 font-medium mb-2">Why a two-panel layout?</p>
              <p className="text-gray-600">Immediate feedback. Users see results as they type prompts — no page refreshes, no waiting. The familiar pattern (think code editors) reduces cognitive load.</p>
            </div>
            <div>
              <p className="text-gray-900 font-medium mb-2">Why natural language prompts instead of forms?</p>
              <p className="text-gray-600">Non-technical users don't know schema syntax. Describing output in plain English ("Extract all product names and prices as a list") lowers the barrier to zero.</p>
            </div>
            <div>
              <p className="text-gray-900 font-medium mb-2">Why JSON as the primary output?</p>
              <p className="text-gray-600">Developers need structured data. JSON is universal — works with APIs, databases, and spreadsheet imports. Future versions will add CSV/XML export.</p>
            </div>
            <div>
              <p className="text-gray-900 font-medium mb-2">Why include a library feature?</p>
              <p className="text-gray-600">Users often process the same document types repeatedly. Saving past parses lets them reference outputs, compare results, and build workflows.</p>
            </div>
          </div>
        </motion.div>

        {/* Outcomes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-16 border-t border-gray-200"
        >
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Outcomes</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <p className="text-3xl font-serif text-[#C75B3B] mb-2">&lt;10s</p>
              <p className="text-gray-600 text-sm">Time to first output</p>
              </div>
            <div>
              <p className="text-3xl font-serif text-[#C75B3B] mb-2">90%+</p>
              <p className="text-gray-600 text-sm">Parse success rate</p>
            </div>
            <div>
              <p className="text-3xl font-serif text-[#C75B3B] mb-2">0</p>
              <p className="text-gray-600 text-sm">Setup required</p>
            </div>
            <div>
              <p className="text-3xl font-serif text-[#C75B3B] mb-2">2 clicks</p>
              <p className="text-gray-600 text-sm">Upload to export</p>
            </div>
          </div>
        </motion.div>

        {/* Learnings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-16 border-t border-gray-200"
        >
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Learnings</p>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed mb-8">
            What I learned building this product.
          </p>
          
          <div className="space-y-6">
            <div>
              <p className="text-gray-900 font-medium"><span className="text-[#C75B3B]">01</span> AI + UX = Magic</p>
              <p className="text-gray-600 mt-1">The combination of AI capabilities with thoughtful UX creates tools that feel almost magical. The AI does the heavy lifting; the interface makes it accessible.</p>
            </div>
            <div>
              <p className="text-gray-900 font-medium"><span className="text-[#C75B3B]">02</span> Simplicity scales</p>
              <p className="text-gray-600 mt-1">The most powerful tools often do one thing exceptionally well. PDF Penguin's success comes from a ruthless focus on the core use case.</p>
            </div>
            <div>
              <p className="text-gray-900 font-medium"><span className="text-[#C75B3B]">03</span> Stripping features is harder than adding them</p>
              <p className="text-gray-600 mt-1">I had to constantly resist scope creep. Every "nice to have" feature threatened the two-click simplicity that makes the product work.</p>
            </div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-16 border-t border-gray-200"
        >
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Next Steps</p>
          <div className="space-y-4">
            <div className="flex gap-4">
              <span className="text-[#C75B3B] font-mono text-sm">01</span>
              <p className="text-gray-600">User authentication and upload history</p>
            </div>
            <div className="flex gap-4">
              <span className="text-[#C75B3B] font-mono text-sm">02</span>
              <p className="text-gray-600">CSV and XML export formats</p>
            </div>
            <div className="flex gap-4">
              <span className="text-[#C75B3B] font-mono text-sm">03</span>
              <p className="text-gray-600">Improved support for scanned/low-quality PDFs</p>
            </div>
            <div className="flex gap-4">
              <span className="text-[#C75B3B] font-mono text-sm">04</span>
              <p className="text-gray-600">API access for developer integrations</p>
            </div>
          </div>
        </motion.div>

        {/* Final Thoughts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-16 border-t border-gray-200"
        >
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Final Thoughts</p>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed mb-8">
            PDF Penguin is about making powerful technology accessible to everyone, regardless of technical background.
            </p>
            <p className="text-gray-600 leading-relaxed">
            This project reminded me why I love product design: solving real problems for real people. Every decision — from the two-panel layout to natural language prompts — was grounded in research and empathy. It's now a core part of my toolset and continues to evolve.
          </p>
        </motion.div>
      </section>

      {/* Footer Navigation */}
      <section className="container mx-auto px-6 md:px-12 lg:px-20 py-16 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-gray-600 hover:text-[#C75B3B] transition-colors flex items-center gap-2">
            <span>←</span>
            <span>Back to Home</span>
          </Link>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-gray-600 hover:text-[#C75B3B] transition-colors"
          >
            Back to Top ↑
          </button>
        </div>
      </section>
    </main>
  );
} 
