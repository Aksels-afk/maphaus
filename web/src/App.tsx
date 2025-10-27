import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import * as React from 'react'

export default function App() {
  return (
    <BrowserRouter>
      <main className="min-h-dvh bg-white text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100">
        <Header />
        <Routes>
          <Route path="/" element={<><Home /><ServicesAndPricing /></>} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <footer className="mx-auto max-w-6xl px-6 py-16 text-center text-sm text-neutral-500">
          © {new Date().getFullYear()} MapHaus. All rights reserved.
        </footer>
      </main>
    </BrowserRouter>
  )
}

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-neutral-200/60 bg-white/70 backdrop-blur-md dark:border-neutral-800/60 dark:bg-neutral-950/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-semibold tracking-tight">MapHaus</Link>
        <nav className="hidden gap-8 text-sm md:flex">
          <a className="hover:opacity-80" href="#services">Services & Pricing</a>
          <Link className="hover:opacity-80" to="/contact">Contact</Link>
        </nav>
        <Link to="/contact" className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200">Get a tune</Link>
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
        <h1 className="text-pretty text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
          Precision chiptuning for refined power
        </h1>
        <p className="mx-auto max-w-2xl text-balance text-base text-neutral-200 dark:text-neutral-300">
          Custom ECU calibrations tailored to your vehicle. Smooth power delivery, reliability first, and measurable gains you can feel.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Link to="/contact" className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200">Request a quote</Link>
          <a href="#services" className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200">See services</a>
        </div>
        <div className="mt-10 grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
          <Feature title="Dyno-proven" description="Validated calibrations, not guesses. We verify before delivery." />
          <Feature title="OEM-safe" description="We respect factory limits to preserve drivability and longevity." />
          <Feature title="Tailored" description="No generic maps. We calibrate for your setup and goals." />
        </div>
      </div>
    </section>
  )
}

type Car = {
  make: string
  model: string
  year: number
  engine: string
  stockPower: number
  stockTorque: number
  stages: {
    name: string
    power: number
    torque: number
    price: number
    description: string
  }[]
}

type CarAPIVehicle = {
  id: number
  make: string
  model: string
  year: number
  engine: {
    size: string
    cylinders: number
    fuel_type: string
  }
  horsepower: number
  torque: number
}

type ServicesResponse = {
  cars: Car[]
  options: { name: string; fromPriceEUR: number; description: string }[]
}

function ServicesAndPricing() {
  const [data, setData] = React.useState<ServicesResponse | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [selectedCar, setSelectedCar] = React.useState<Car | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let canceled = false
    async function load() {
      try {
        setLoading(true)
        // Fetch popular diesel cars from CarAPI
        const popularCars = [
          'BMW 320d', 'Audi A4 2.0 TDI', 'Volkswagen Golf GTD', 'Mercedes C220d',
          'BMW 330d', 'Audi A6 3.0 TDI', 'Volkswagen Passat 2.0 TDI', 'Mercedes E220d'
        ]
        
        const cars: Car[] = []
        
        for (const carQuery of popularCars) {
          try {
            const [make, model] = carQuery.split(' ', 2)
            const response = await fetch(`https://carapi.app/api/vehicles?make=${make}&model=${model}&year=2020`, {
              headers: {
                'Accept': 'application/json',
                'User-Agent': 'MapHaus/1.0'
              }
            })
            
            if (response.ok) {
              const vehicles = await response.json()
              if (vehicles.length > 0) {
                const vehicle = vehicles[0] as CarAPIVehicle
                const stockPower = vehicle.horsepower || 150
                const stockTorque = vehicle.torque || 320
                
                cars.push({
                  make: vehicle.make,
                  model: vehicle.model,
                  year: vehicle.year,
                  engine: `${vehicle.engine?.size || '2.0L'} ${vehicle.engine?.fuel_type || 'Diesel'}`,
                  stockPower,
                  stockTorque,
                  stages: [
                    {
                      name: 'Stage 1',
                      power: Math.round(stockPower * 1.2),
                      torque: Math.round(stockTorque * 1.18),
                      price: 249,
                      description: 'Safe increase on stock hardware'
                    },
                    {
                      name: 'Stage 2',
                      power: Math.round(stockPower * 1.35),
                      torque: Math.round(stockTorque * 1.32),
                      price: 349,
                      description: 'With intake/exhaust modifications'
                    }
                  ]
                })
              }
            }
          } catch (e) {
            console.warn(`Failed to fetch data for ${carQuery}:`, e)
          }
        }
        
        if (!canceled) {
          if (cars.length > 0) {
            setData({
              cars,
              options: [
                { name: 'DPF OFF (off-road only)', fromPriceEUR: 150, description: 'Disable DPF logic where legally permitted.' },
                { name: 'EGR OFF (off-road only)', fromPriceEUR: 120, description: 'Disable EGR logic where legally permitted.' },
              ]
            })
            setSelectedCar(cars[0])
          } else {
            throw new Error('No car data available')
          }
        }
      } catch (e) {
        if (canceled) return
        setError('Unable to load car data from API. Using fallback data.')
        const fallbackData = {
          cars: [
            {
              make: 'BMW',
              model: '320d',
              year: 2020,
              engine: '2.0L Diesel',
              stockPower: 184,
              stockTorque: 380,
              stages: [
                { name: 'Stage 1', power: 220, torque: 450, price: 249, description: 'Safe increase on stock hardware' },
                { name: 'Stage 2', power: 250, torque: 500, price: 349, description: 'With intake/exhaust modifications' },
              ]
            }
          ],
          options: [
            { name: 'DPF OFF (off-road only)', fromPriceEUR: 150, description: 'Disable DPF logic where legally permitted.' },
            { name: 'EGR OFF (off-road only)', fromPriceEUR: 120, description: 'Disable EGR logic where legally permitted.' },
          ],
        }
        setData(fallbackData)
        setSelectedCar(fallbackData.cars[0])
      } finally {
        if (!canceled) setLoading(false)
      }
    }
    load()
    return () => {
      canceled = true
    }
  }, [])

  if (loading) {
    return (
      <section id="services" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-10">
          <h2 className="text-2xl font-semibold tracking-tight">Services & Pricing</h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">Loading car data from API...</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900 dark:border-neutral-700 dark:border-t-neutral-100"></div>
        </div>
      </section>
    )
  }

  return (
    <section id="services" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-10">
        <h2 className="text-2xl font-semibold tracking-tight">Services & Pricing</h2>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">Select your vehicle to see exact power figures and pricing.</p>
        {error && <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">{error}</p>}
      </div>

      {data && (
        <>
          <div className="mb-8">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">Select Vehicle</label>
            <select
              value={selectedCar ? `${selectedCar.make} ${selectedCar.model}` : ''}
              onChange={(e) => {
                const car = data.cars.find(c => `${c.make} ${c.model}` === e.target.value)
                setSelectedCar(car || null)
              }}
              className="w-full max-w-md rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-950"
            >
              {data.cars.map((car) => (
                <option key={`${car.make} ${car.model}`} value={`${car.make} ${car.model}`}>
                  {car.make} {car.model} ({car.year}) - {car.engine}
                </option>
              ))}
            </select>
          </div>

          {selectedCar && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <div className="mb-6 rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
                  <h3 className="text-lg font-semibold">{selectedCar.make} {selectedCar.model}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">{selectedCar.year} • {selectedCar.engine}</p>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
                      <div className="text-xs text-neutral-500">Stock Power</div>
                      <div className="text-lg font-semibold">{selectedCar.stockPower} HP</div>
                    </div>
                    <div className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
                      <div className="text-xs text-neutral-500">Stock Torque</div>
                      <div className="text-lg font-semibold">{selectedCar.stockTorque} Nm</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {selectedCar.stages.map((stage) => (
                    <div key={stage.name} className="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
                      <div className="flex items-baseline justify-between mb-3">
                        <h4 className="text-base font-semibold">{stage.name}</h4>
                        <div className="text-sm text-neutral-500">€{stage.price}</div>
                      </div>
                      <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-300">{stage.description}</p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
                          <div className="text-xs text-neutral-500">Power</div>
                          <div className="font-medium">{stage.power} HP</div>
                          <div className="text-xs text-green-600">+{stage.power - selectedCar.stockPower} HP</div>
                        </div>
                        <div className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
                          <div className="text-xs text-neutral-500">Torque</div>
                          <div className="font-medium">{stage.torque} Nm</div>
                          <div className="text-xs text-green-600">+{stage.torque - selectedCar.stockTorque} Nm</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
                <h3 className="text-base font-semibold">Additional Options</h3>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">For track/off-road use where legal.</p>
                <div className="mt-4 space-y-3">
                  {(data.options ?? []).map((o) => (
                    <div key={o.name} className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">{o.name}</div>
                        <div className="text-sm text-neutral-500">€{o.fromPriceEUR}</div>
                      </div>
                      <div className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">{o.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

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
    <div className="rounded-2xl border border-neutral-200 p-6 text-left dark:border-neutral-800">
      <h3 className="mb-2 text-base font-semibold">{props.title}</h3>
      <p className="text-sm text-neutral-600 dark:text-neutral-300">{props.description}</p>
    </div>
  )
}
