import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import * as React from 'react'

type Theme = 'light' | 'dark'

const ThemeContext = React.createContext<{
  theme: Theme
  toggleTheme: () => void
}>({
  theme: 'light',
  toggleTheme: () => {},
})

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<Theme>(() => {
    // Default to light mode, check localStorage for saved preference
    const saved = localStorage.getItem('theme') as Theme
    return saved || 'light'
  })

  React.useEffect(() => {
    const root = document.documentElement
    
    // Apply theme immediately
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    
    // Show the page after theme is applied
    setTimeout(() => {
      root.classList.add('loaded')
    }, 50)
    
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = React.useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

function useTheme() {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

function useScrollAnimation() {
  const [visibleElements, setVisibleElements] = React.useState<Set<string>>(new Set())

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-animate-id')
            if (id) {
              setVisibleElements(prev => new Set([...prev, id]))
            }
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    const elements = document.querySelectorAll('[data-animate-id]')
    elements.forEach(el => observer.observe(el))

    return () => {
      elements.forEach(el => observer.unobserve(el))
    }
  }, [])

  return visibleElements
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename="/maphaus">
        <main className="min-h-dvh bg-white text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100">
          <Header />
          <Routes>
            <Route path="/" element={<><Home /><ServicesAndPricing /><AboutUs /><FAQ /></>} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
          <footer className="mx-auto max-w-6xl px-6 py-16 text-center text-sm text-neutral-500">
            © {new Date().getFullYear()} MapHaus. All rights reserved.
          </footer>
        </main>
      </BrowserRouter>
    </ThemeProvider>
  )
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white p-2 text-neutral-700 shadow-sm hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ) : (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
    </button>
  )
}

function Header() {
  const scrollToServices = () => {
    // If we're on the home page, just scroll to the services section
    if (window.location.pathname === '/' || window.location.pathname === '/maphaus/') {
      const servicesSection = document.getElementById('services')
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // If we're on another page, navigate to home first, then scroll
      window.location.href = '/maphaus/#services'
    }
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-neutral-200/60 bg-white/70 backdrop-blur-md dark:border-neutral-800/60 dark:bg-neutral-950/60 animate-fade-in">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-semibold tracking-tight">MapHaus</Link>
        <nav className="hidden gap-8 text-sm md:flex">
          <button onClick={scrollToServices} className="hover:opacity-80">Services & Pricing</button>
          <Link className="hover:opacity-80" to="/contact">Contact</Link>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

function Home() {
  return (
    <section
      className="relative isolate flex items-center justify-center overflow-hidden pt-40"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1673153595682-3f9dc013df56?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2370',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 -z-10 bg-neutral-950/55" />
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-6 pb-24 text-center">
        <h1 className="text-pretty text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl animate-fade-in">
          Precision ECU tuning for refined power
        </h1>
        <p className="mx-auto max-w-2xl text-balance text-base text-neutral-100 animate-fade-in">
          Custom ECU calibrations tailored to your vehicle. Smooth power delivery, reliability first, and measurable gains you can feel.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row animate-fade-in">
          <Link to="/contact" className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200">Request a quote</Link>
          <button onClick={() => {
            const servicesSection = document.getElementById('services')
            if (servicesSection) {
              servicesSection.scrollIntoView({ behavior: 'smooth' })
            }
          }} className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200">See services</button>
        </div>
        <div className="mt-10 grid w-full grid-cols-1 gap-6 sm:grid-cols-3 animate-fade-in">
          <Feature title="Dyno-proven" description="Validated calibrations, not guesses. We verify before delivery." />
          <Feature title="OEM-safe" description="We respect factory limits to preserve drivability and longevity." />
          <Feature title="Tailored" description="No generic maps. We calibrate for your setup and goals." />
        </div>
      </div>
    </section>
  )
}

type ServicesResponse = {
  options: { name: string; fromPriceEUR: number; description: string }[]
}

function ServicesAndPricing() {
  const visibleElements = useScrollAnimation()
  
  const data: ServicesResponse = {
    options: [
      { name: 'DPF OFF (off-road only)', fromPriceEUR: 150, description: 'Disable DPF logic where legally permitted.' },
      { name: 'EGR OFF (off-road only)', fromPriceEUR: 120, description: 'Disable EGR logic where legally permitted.' },
      { name: 'AdBlue OFF (off-road only)', fromPriceEUR: 100, description: 'Disable AdBlue/SCR system where legally permitted.' },
    ]
  }

  return (
    <section id="services" className="mx-auto max-w-6xl px-6 py-24">
      <div className={`mb-10 animate-on-scroll ${visibleElements.has('services-header') ? 'visible' : ''}`} data-animate-id="services-header">
        <h2 className="text-2xl font-semibold tracking-tight">Services & Pricing</h2>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">Professional ECU tuning services for your vehicle.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className={`rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800 animate-on-scroll-left ${visibleElements.has('ecu-tuning') ? 'visible' : ''}`} data-animate-id="ecu-tuning">
          <h3 className="text-lg font-semibold mb-4">ECU Tuning</h3>
          <div className="space-y-4">
            <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-base font-semibold">Stage 1 Tuning</h4>
                <div className="text-lg font-semibold text-green-600">From €85</div>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-3">
                Safe power increase on stock hardware. Optimized fuel mapping and boost pressure for reliable gains.
              </p>
              <div className="text-xs text-neutral-500">
                • Typically 15-25% power increase<br/>
                • Improved throttle response<br/>
                • Better fuel efficiency<br/>
                • Maintains OEM reliability
              </div>
            </div>
            
            <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-base font-semibold">Stage 2 Tuning</h4>
                <div className="text-lg font-semibold text-green-600">From €149</div>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-3">
                Enhanced tuning with intake/exhaust modifications. Higher power gains with supporting hardware.
              </p>
              <div className="text-xs text-neutral-500">
                • Typically 25-40% power increase<br/>
                • Requires intake/exhaust upgrades<br/>
                • Custom mapping for your setup<br/>
                • Professional installation available
              </div>
            </div>
            
            <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-base font-semibold">Custom Tuning</h4>
                <div className="text-lg font-semibold text-green-600">Contact Us</div>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-3">
                Fully custom-made tune tailored to your specific vehicle and goals. Perfect for enthusiasts with performance modifications.
              </p>
              <div className="text-xs text-neutral-500">
                • Personalized calibration for your setup<br/>
                • Performance parts integration<br/>
                • Maximum power optimization<br/>
                • Custom dyno testing and validation<br/>
                • Ongoing support and adjustments
              </div>
            </div>
          </div>
        </div>

        <div className={`rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800 animate-on-scroll-right ${visibleElements.has('additional-services') ? 'visible' : ''}`} data-animate-id="additional-services">
          <h3 className="text-base font-semibold mb-4">Additional Services</h3>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300 mb-4">For track/off-road use where legally permitted.</p>
          <div className="space-y-3">
            {data.options.map((option) => (
              <div key={option.name} className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
                <div className="text-sm font-medium">{option.name}</div>
                <div className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">{option.description}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 rounded-lg bg-neutral-50 p-4 dark:bg-neutral-900">
            <h4 className="text-sm font-semibold mb-2">What's Included</h4>
            <div className="text-xs text-neutral-600 dark:text-neutral-300 space-y-1">
              • Professional ECU reading and backup<br/>
              • Custom calibration development<br/>
              • Dyno testing and validation<br/>
              • Installation and testing<br/>
              • 12-month warranty on workmanship
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <Link to="/contact" className="rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200">Book your tune</Link>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-32 pb-24">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">Contact</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              const form = e.currentTarget as HTMLFormElement
              const formData = new FormData(form)
              const name = String(formData.get('name') || '').trim()
              const email = String(formData.get('email') || '').trim()
              const message = String(formData.get('message') || '').trim()
              if (!name || !email || !message) {
                alert('Please fill in your name, email, and message.')
                return
              }
              const subject = encodeURIComponent(`New inquiry from ${name}`)
              const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)
              window.location.href = `mailto:info@maphaus.lv?subject=${subject}&body=${body}`
            }}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm text-neutral-600 dark:text-neutral-300">Name</label>
                <input id="name" name="name" required placeholder="Your name" className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-neutral-400 focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-950" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm text-neutral-600 dark:text-neutral-300">Email</label>
                <input id="email" name="email" type="email" required placeholder="you@example.com" className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-neutral-400 focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-950" />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm text-neutral-600 dark:text-neutral-300">Message</label>
              <textarea id="message" name="message" required rows={6} placeholder="Tell us about your car and your goals" className="w-full resize-y rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-neutral-400 focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-950" />
            </div>
            <button type="submit" className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200">Send</button>
          </form>

          <div className="space-y-4">
            <div>
              <div className="text-sm text-neutral-500">Phone</div>
              <a href="tel:+37120000000" className="text-lg font-medium hover:underline">+371 2000 0000</a>
            </div>
            <div>
              <div className="text-sm text-neutral-500">Email</div>
              <a href="mailto:info@maphaus.lv" className="text-lg font-medium hover:underline">info@maphaus.lv</a>
            </div>
            <div>
              <div className="text-sm text-neutral-500">Address</div>
              <div className="text-lg font-medium">University of Latvia</div>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <iframe
            title="University of Latvia Map"
            src="https://www.google.com/maps?q=56.950611,24.115583&hl=en&z=16&output=embed"
            width="100%"
            height="480"
            loading="lazy"
            style={{ border: 0 }}
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  )
}

function Feature(props: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200/20 bg-white/10 p-6 text-left backdrop-blur-sm dark:border-neutral-800/20 dark:bg-neutral-900/10">
      <h3 className="mb-2 text-base font-semibold text-white">{props.title}</h3>
      <p className="text-sm text-neutral-100">{props.description}</p>
    </div>
  )
}

function AboutUs() {
  const visibleElements = useScrollAnimation()

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className={`mb-10 animate-on-scroll ${visibleElements.has('about-header') ? 'visible' : ''}`} data-animate-id="about-header">
        <h2 className="text-2xl font-semibold tracking-tight">About Us</h2>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">Meet the team behind MapHaus ECU tuning.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className={`animate-on-scroll-left ${visibleElements.has('about-content') ? 'visible' : ''}`} data-animate-id="about-content">
          <h3 className="text-lg font-semibold mb-4">Our Story</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4 leading-relaxed">
            We are a small, dedicated team from Latvia specializing in performance cars. Our passion for automotive excellence drives us to deliver the highest quality ECU tuning services.
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4 leading-relaxed">
            With multiple years of experience in the industry, we understand what it takes to extract maximum performance while maintaining reliability and safety.
          </p>
        </div>

        <div className={`animate-on-scroll-right ${visibleElements.has('about-tech') ? 'visible' : ''}`} data-animate-id="about-tech">
          <h3 className="text-lg font-semibold mb-4">Our Approach</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="text-sm font-semibold mb-1">Latest Technology</h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-300">We use the most advanced hardware and software tools available in the industry.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="text-sm font-semibold mb-1">Proven Experience</h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-300">Multiple years of hands-on experience with European performance vehicles.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="text-sm font-semibold mb-1">Performance Focus</h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-300">Specialized in drift cars, track cars, and high-performance street vehicles.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="text-sm font-semibold mb-1">Quality Assurance</h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-300">Every tune is dyno-tested and validated before delivery to ensure optimal results.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  const [openItems, setOpenItems] = React.useState<Set<number>>(new Set())
  const visibleElements = useScrollAnimation()

  const toggleItem = (index: number) => {
    setOpenItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  const faqItems = [
    {
      question: "Is ECU tuning safe for my vehicle?",
      answer: "Yes, our ECU tuning is completely safe when done professionally. We respect factory safety limits and use OEM-safe calibrations. All our tunes are dyno-tested and validated before delivery. We provide a 12-month warranty on our workmanship."
    },
    {
      question: "How much power can I expect to gain?",
      answer: "Power gains vary by vehicle and tuning stage. Stage 1 typically provides 15-25% power increase, while Stage 2 can deliver 25-40% gains. Custom tuning can achieve even higher gains depending on your modifications. We provide specific estimates during consultation."
    },
    {
      question: "Will tuning affect my warranty?",
      answer: "ECU tuning may affect your vehicle's warranty depending on your manufacturer and region. We recommend checking with your dealer first. However, our tunes are designed to be reversible, and we can restore your original ECU file if needed."
    },
    {
      question: "How long does the tuning process take?",
      answer: "Stage 1 tuning typically takes 2-3 hours including dyno testing. Stage 2 may take 4-6 hours depending on modifications. Custom tuning varies based on complexity but usually takes 1-2 days. We'll provide accurate timelines during consultation."
    },
    {
      question: "Do I need any modifications for Stage 1 tuning?",
      answer: "No modifications are required for Stage 1 tuning. It's designed to work with your stock hardware. However, Stage 2 tuning requires intake/exhaust modifications for optimal results. We'll assess your vehicle and recommend the best approach."
    },
    {
      question: "Can you tune any vehicle?",
      answer: "We primarily work on drift cars and track cars, but also frequently tune regular vehicles including BMW, Audi, Mercedes, and Volkswagen. We work with vehicles from 2000 onwards and specialize in European brands. Contact us with your vehicle details and we'll confirm compatibility and provide a quote."
    },
    {
      question: "What's included in the tuning service?",
      answer: "Our service includes: ECU reading and backup, custom calibration development, dyno testing and validation, installation and testing, and a 12-month warranty on workmanship. We also provide ongoing support and can make adjustments if needed."
    },
    {
      question: "How do I book an appointment?",
      answer: "You can book through our contact form, call us directly, or email us. We'll discuss your goals, assess your vehicle, and schedule a convenient time. We recommend bringing your vehicle for assessment before finalizing the tuning approach."
    }
  ]

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className={`mb-10 animate-on-scroll ${visibleElements.has('faq-header') ? 'visible' : ''}`} data-animate-id="faq-header">
        <h2 className="text-2xl font-semibold tracking-tight">Frequently Asked Questions</h2>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">Everything you need to know about ECU tuning and our services.</p>
      </div>

      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <div key={index} className={`rounded-2xl border border-neutral-200 dark:border-neutral-800 animate-on-scroll ${visibleElements.has(`faq-${index}`) ? 'visible' : ''}`} data-animate-id={`faq-${index}`}>
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors rounded-2xl"
            >
              <h3 className="text-base font-semibold pr-4">{item.question}</h3>
              <svg 
                className={`w-5 h-5 text-neutral-500 transition-transform ${openItems.has(index) ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openItems.has(index) && (
              <div className="px-6 pb-4">
                <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
