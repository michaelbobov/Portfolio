'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Navigation from '@/app/components/Navigation';
import FullSizeLink from '@/app/components/FullSizeLink';

export default function PDFPenguinCaseStudy() {
  return (
    <main className="bg-[#FAFAF8] min-h-screen">
      {/* Navigation */}
      <nav className="container mx-auto px-6 md:px-12 lg:px-20 py-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="font-mono text-sm tracking-wide text-gray-900 font-medium hover:text-[#B5502F] transition-colors">
            MICHAEL BOBOV
          </Link>
          <Navigation />
        </div>
      </nav>

      {/* Hero Section */}
      <section id="main-content" tabIndex={-1} className="container mx-auto px-6 md:px-12 lg:px-20 pt-16 md:pt-24 mb-16 focus:outline-none">
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
          className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8"
        >
          AI-powered PDF to JSON conversion for structured, usable data.
        </motion.p>

        {/* TL;DR */}
        <div className="max-w-4xl bg-white border border-gray-200 rounded-lg p-6 md:p-8 mb-8">
          <h2 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-4">TL;DR</h2>
          <dl className="grid md:grid-cols-3 gap-6 text-sm">
            <div><dt className="text-gray-900 font-medium mb-1">Problem</dt><dd className="text-gray-600">Getting structured data out of PDFs means technical tools, manual area selection, or 15+ minutes of setup.</dd></div>
            <div><dt className="text-gray-900 font-medium mb-1">What I did</dt><dd className="text-gray-600">Working solo, I tested Tabula, Acrobat, and DocParser as a first-time user, then designed and built a drag-and-drop, plain-language PDF-to-JSON tool in 2 weeks.</dd></div>
            <div><dt className="text-gray-900 font-medium mb-1">Outcome</dt><dd className="text-gray-600">Under 10 seconds to first output with zero setup, and 2 clicks from upload to export.</dd></div>
          </dl>
        </div>

        {/* Project Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          <div>
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-2">Role</p>
            <p className="text-gray-900">Founder</p>
            <p className="text-gray-900">Product Designer</p>
            <p className="text-gray-900">Frontend Developer</p>
      </div>
          <div>
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-2">Timeline</p>
            <p className="text-gray-900">2 weeks</p>
            <p className="text-gray-600 text-sm">Design MVP · Pre-launch</p>
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
            width={2400}
            height={1552}
            className="w-full h-auto"
            sizes="(min-width: 1536px) 1376px, 100vw"
            priority
          />
        </motion.div>
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
          <h2 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Overview</h2>
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
          <h2 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Problem</h2>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed mb-8">
            Non-technical users struggle to extract structured data from PDFs. Existing tools require setup, technical knowledge, or produce inconsistent results.
          </p>
          <div className="space-y-6 mb-8">
            <div className="flex gap-4">
              <span className="text-[#B5502F] font-mono text-sm">01</span>
            <div>
                <p className="text-gray-900 font-medium">Tools are too technical</p>
                <p className="text-gray-600 text-sm mt-1">Tabula requires manual area selection. DocParser needs schema expertise. Adobe exports break formatting.</p>
              </div>
                </div>
            <div className="flex gap-4">
              <span className="text-[#B5502F] font-mono text-sm">02</span>
              <div>
                <p className="text-gray-900 font-medium">Inconsistent results</p>
                <p className="text-gray-600 text-sm mt-1">Scanned PDFs fail. Multi-page documents break. Output requires extensive cleanup.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-[#B5502F] font-mono text-sm">03</span>
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
          <h2 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Research</h2>
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
                  <th className="border-2 border-gray-300 px-4 py-3 text-left font-medium text-[#B5502F]">PDF Penguin</th>
                      </tr>
                    </thead>
              <tbody>
                      <tr>
                  <td className="border-2 border-gray-300 px-4 py-3 font-medium text-gray-900">How to Use</td>
                  <td className="border-2 border-gray-300 px-4 py-3 text-gray-600">Install → select area → export</td>
                  <td className="border-2 border-gray-300 px-4 py-3 text-gray-600">Open → Export To → fix formatting</td>
                  <td className="border-2 border-gray-300 px-4 py-3 text-gray-600">Create parser → define rules → run</td>
                  <td className="border-2 border-gray-300 px-4 py-3 text-gray-600 font-medium text-[#B5502F]">Drag & drop → describe → copy</td>
                      </tr>
                      <tr className="bg-gray-50">
                  <td className="border-2 border-gray-300 px-4 py-3 font-medium text-gray-900">Setup Time</td>
                  <td className="border-2 border-gray-300 px-4 py-3 text-gray-600">10–15 mins</td>
                  <td className="border-2 border-gray-300 px-4 py-3 text-gray-600">5–10 mins per doc</td>
                  <td className="border-2 border-gray-300 px-4 py-3 text-gray-600">15–30 mins upfront</td>
                  <td className="border-2 border-gray-300 px-4 py-3 text-gray-600 font-medium text-[#B5502F]">&lt;10 seconds</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4 mb-8">
            <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Tabula</h3>
              <p className="text-sm text-gray-600">Install → select area → export. 10–15 min setup.</p>
                  </div>
            <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Adobe Acrobat</h3>
              <p className="text-sm text-gray-600">Open → Export → fix formatting. 5–10 min per doc.</p>
                </div>
            <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">DocParser</h3>
              <p className="text-sm text-gray-600">Create parser → define rules → run. 15–30 min upfront.</p>
                  </div>
            <div className="bg-[#B5502F]/5 border-2 border-[#B5502F] rounded-lg p-4">
              <h3 className="font-medium text-[#B5502F] mb-2">PDF Penguin</h3>
              <p className="text-sm text-gray-600">Drag & drop → describe → copy. &lt;10 seconds.</p>
                  </div>
                </div>
                
          <div>
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-3">Key Insight</p>
            <p className="text-gray-900 text-lg mb-4">
              <span className="text-[#B5502F] font-medium">Zero-config wins.</span> Competing tools expect users to know schemas and export settings. PDF Penguin should require zero setup.
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
          <h2 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Solution</h2>
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
                width={1440}
                height={2656}
                className="max-w-md w-full h-auto"
                sizes="(min-width: 448px) 448px, 100vw"
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
          <h2 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Design Process</h2>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed">
            From sketches to high-fidelity prototypes through rapid iteration.
          </p>
                </div>
                
        <div className="space-y-16">
          {/* Initial Sketches */}
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="max-w-4xl mb-6">
              <h3 className="text-gray-900 font-medium text-lg mb-2">Initial Sketches</h3>
              <p className="text-gray-600">Early exploration of layout concepts and interaction patterns.</p>
            </div>
            <div className="flex justify-center">
                    <Image
                src="/sketchpdfpenguin.png"
                alt="PDF Penguin Initial Sketches"
                width={1024}
                height={1024}
                className="max-w-xl w-full h-auto"
                sizes="(min-width: 576px) 576px, 100vw"
                quality={95}
                    />
                </div>
              </div>

          {/* Lo-Fi Prototype */}
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="max-w-4xl mb-6">
              <h3 className="text-gray-900 font-medium text-lg mb-2">Lo-Fi Prototypes</h3>
              <p className="text-gray-600">Testing the upload, prompt, and output flow with minimal styling.</p>
                </div>

            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <FullSizeLink src="/pengu1lowfi.png" className="max-w-lg w-full">
                <Image src="/pengu1lowfi.png" alt="PDF Penguin lo-fi wireframe: upload interface" width={1728} height={1117} className="w-full h-auto" sizes="(min-width: 512px) 512px, 100vw" quality={95} />
              </FullSizeLink>
              <FullSizeLink src="/pengu2lowfi.png" className="max-w-lg w-full">
                <Image src="/pengu2lowfi.png" alt="PDF Penguin lo-fi wireframe: JSON output" width={1728} height={1117} className="w-full h-auto" sizes="(min-width: 512px) 512px, 100vw" quality={95} />
              </FullSizeLink>
              <FullSizeLink src="/pengu3lowfi.png" className="max-w-lg w-full">
                <Image src="/pengu3lowfi.png" alt="PDF Penguin lo-fi wireframe: library view" width={1728} height={1117} className="w-full h-auto" sizes="(min-width: 512px) 512px, 100vw" quality={95} />
              </FullSizeLink>
              <FullSizeLink src="/pengu4lowfi.png" className="max-w-lg w-full">
                <Image src="/pengu4lowfi.png" alt="PDF Penguin lo-fi wireframe: document view" width={1728} height={1117} className="w-full h-auto" sizes="(min-width: 512px) 512px, 100vw" quality={95} />
              </FullSizeLink>
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
              <h3 className="text-gray-900 font-medium text-lg mb-2">High-Fidelity Prototypes</h3>
              <p className="text-gray-600">Polished designs ready for development.</p>
                </div>
                
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <FullSizeLink src="/highfipengu1.png" className="max-w-lg w-full">
                <Image src="/highfipengu1.png" alt="PDF Penguin hi-fi design: upload interface" width={1728} height={1117} className="w-full h-auto" sizes="(min-width: 512px) 512px, 100vw" quality={95} />
              </FullSizeLink>
              <FullSizeLink src="/highfipengu2.png" className="max-w-lg w-full">
                <Image src="/highfipengu2.png" alt="PDF Penguin hi-fi design: JSON output" width={1728} height={1117} className="w-full h-auto" sizes="(min-width: 512px) 512px, 100vw" quality={95} />
              </FullSizeLink>
              <FullSizeLink src="/highfipengu3.png" className="max-w-lg w-full">
                <Image src="/highfipengu3.png" alt="PDF Penguin hi-fi design: library view" width={1728} height={1117} className="w-full h-auto" sizes="(min-width: 512px) 512px, 100vw" quality={95} />
              </FullSizeLink>
              <FullSizeLink src="/highfipengu4.png" className="max-w-lg w-full">
                <Image src="/highfipengu4.png" alt="PDF Penguin hi-fi design: document view" width={1728} height={1117} className="w-full h-auto" sizes="(min-width: 512px) 512px, 100vw" quality={95} />
              </FullSizeLink>
                </div>
                
                <div className="text-center">
                <a 
                  href="https://www.figma.com/proto/6gUB6gR6ATucf890UPjQO6/Pdf-Pengu?node-id=14-418&t=O1XBikXg0ng6HNMv-1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#B5502F] hover:bg-[#A84A2E] text-white px-6 py-3 rounded-xl font-medium transition-colors"
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
              <h3 className="text-gray-900 font-medium text-lg mb-2">Final Product</h3>
              <p className="text-gray-600">Built with React + TailwindCSS, integrated OCR and OpenAI APIs, deployed via Vercel.</p>
            </div>
            <div className="flex justify-center">
              <Image 
                src="/pdf-penguin.png"
                alt="PDF Penguin Final Product"
                width={1336}
                height={870}
                className="max-w-3xl w-full h-auto"
                sizes="(min-width: 768px) 768px, 100vw"
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
          <h2 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Design Decisions</h2>
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
          <h2 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Outcomes</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <p className="text-3xl font-serif text-[#B5502F] mb-2">&lt;10s</p>
              <p className="text-gray-600 text-sm">Time to first output</p>
              </div>
            <div>
              <p className="text-3xl font-serif text-[#B5502F] mb-2">90%+</p>
              <p className="text-gray-600 text-sm">Parse success rate</p>
            </div>
            <div>
              <p className="text-3xl font-serif text-[#B5502F] mb-2">0</p>
              <p className="text-gray-600 text-sm">Setup required</p>
            </div>
            <div>
              <p className="text-3xl font-serif text-[#B5502F] mb-2">2 clicks</p>
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
          <h2 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Learnings</h2>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed mb-8">
            What I learned building this product.
          </p>
          
          <div className="space-y-6">
            <div>
              <p className="text-gray-900 font-medium"><span className="text-[#B5502F]">01</span> AI does the work; UX makes it usable</p>
              <p className="text-gray-600 mt-1">AI capability alone isn’t a product. The model does the heavy lifting; the drop zone, plain-language prompt, and instant preview are what make it usable for non-technical people.</p>
            </div>
            <div>
              <p className="text-gray-900 font-medium"><span className="text-[#B5502F]">02</span> Stripping features is harder than adding them</p>
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
          <h2 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Next Steps</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <span className="text-[#B5502F] font-mono text-sm">01</span>
              <p className="text-gray-600">User authentication and upload history</p>
            </div>
            <div className="flex gap-4">
              <span className="text-[#B5502F] font-mono text-sm">02</span>
              <p className="text-gray-600">CSV and XML export formats</p>
            </div>
            <div className="flex gap-4">
              <span className="text-[#B5502F] font-mono text-sm">03</span>
              <p className="text-gray-600">Improved support for scanned/low-quality PDFs</p>
            </div>
            <div className="flex gap-4">
              <span className="text-[#B5502F] font-mono text-sm">04</span>
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
          <h2 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Final Thoughts</h2>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed mb-8">
            PDF Penguin is about making powerful technology accessible to everyone, regardless of technical background.
            </p>
            <p className="text-gray-600 leading-relaxed">
            Every decision, from the two-panel layout to natural-language prompts, came from testing Tabula, Acrobat, and DocParser as a first-time user and seeing where they broke down. PDF Penguin started as a tool I needed for EZ Recipe; it’s now a core part of my toolset and continues to evolve.
          </p>
        </motion.div>
      </section>

      {/* Footer Navigation */}
      <section className="container mx-auto px-6 md:px-12 lg:px-20 py-16 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <Link href="/" className="text-gray-600 hover:text-[#B5502F] transition-colors flex items-center gap-2">
            <span>←</span>
            <span>Back to Home</span>
          </Link>
          <Link href="/work/spotify-loop" className="text-gray-600 hover:text-[#B5502F] transition-colors">Next: Spotify Loop →</Link>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}
            className="text-gray-600 hover:text-[#B5502F] transition-colors"
          >
            Back to Top ↑
          </button>
        </div>
      </section>
    </main>
  );
} 
