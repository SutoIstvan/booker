import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, CheckCircle2, Globe, Calendar as CalendarIcon, ArrowRight, User, Mail, Building2, ChevronLeft } from "lucide-react"
import { format, isSameDay } from "date-fns"

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
]

export function Booking() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [step, setStep] = useState<"datetime" | "details" | "success">("datetime")
  const [formData, setFormData] = useState({ name: "", email: "", company: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize selectedDate on mount to avoid hydration mismatch
  useEffect(() => {
    setSelectedDate(new Date())
  }, [])

  // Generate next 14 days for the horizontal slider
  const dates = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return d
  })

  const handleDateChange = (date: Date) => {
    setSelectedDate(date)
    setSelectedTime(null)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleNextStep = () => {
    if (selectedDate && selectedTime) {
      setStep("details")
    }
  }

  const handleBackStep = () => {
    setStep("datetime")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email) return

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setStep("success")
    }, 1200)
  }

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  return (
    <section id="booking" className="py-24 px-4 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-zinc-800/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-instrument-sans)" }}
          >
            Ready to scale? Book a demo
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-zinc-400 max-w-xl mx-auto"
          >
            Choose a convenient date and time to reserve a personalized walkthrough. Let us show you how we can speed up your workflow.
          </motion.p>
        </div>

        <Card className="border-zinc-800 bg-zinc-900/30 backdrop-blur-xl overflow-hidden rounded-2xl">
          <CardContent className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {step === "datetime" && (
                <motion.div
                  key="datetime"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-10"
                >
                  {/* Date Selector Row */}
                  <div className="flex flex-col w-full">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-zinc-400" />
                      Select Date
                    </h3>
                    
                    <div className="flex gap-3 overflow-x-auto pb-4 pt-1 px-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent w-full">
                      {dates.map((date) => {
                        const isSelected = selectedDate && isSameDay(selectedDate, date);
                        return (
                          <button
                            key={date.toISOString()}
                            onClick={() => handleDateChange(date)}
                            className={`flex flex-col items-center justify-center min-w-[76px] py-4 rounded-xl border transition-all duration-300 ${
                              isSelected
                                ? "bg-white text-zinc-950 border-white shadow-lg shadow-white/5"
                                : "bg-zinc-950/30 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/50"
                            }`}
                          >
                            <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">
                              {format(date, "EEE")}
                            </span>
                            <span className="text-lg font-extrabold mt-1 leading-none">
                              {format(date, "d")}
                            </span>
                            <span className="text-[9px] uppercase tracking-wider opacity-60 mt-1">
                              {format(date, "MMM")}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Divider */}
                  {selectedDate && <hr className="w-full border-zinc-800/60" />}

                  {/* Time Slots Row */}
                  <div className="flex flex-col w-full">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-zinc-400" />
                      Select Time
                    </h3>

                    {selectedDate ? (
                      <div className="w-full">
                        <p className="text-sm text-zinc-400 mb-4 font-medium">
                          Available slots for <span className="text-white">{format(selectedDate, "eeee, MMMM d")}</span>
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                          {timeSlots.map((time) => (
                            <button
                              key={time}
                              onClick={() => handleTimeSelect(time)}
                              className={`py-3 px-4 text-sm font-medium rounded-xl border transition-all duration-300 ${
                                selectedTime === time
                                  ? "bg-white text-zinc-950 border-white shadow-lg shadow-white/5"
                                  : "bg-zinc-950/30 border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-900/50"
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8 pt-6 border-t border-zinc-800/60">
                          <div className="flex items-center gap-2 text-xs text-zinc-500 bg-zinc-950/20 py-2 px-3 rounded-lg border border-zinc-800/40 w-fit">
                            <Globe className="w-3.5 h-3.5" />
                            <span>All times in {timezone}</span>
                          </div>

                          <Button
                            onClick={handleNextStep}
                            disabled={!selectedTime}
                            className="shimmer-btn bg-white text-zinc-950 hover:bg-zinc-200 rounded-xl h-12 px-8 text-sm font-medium flex items-center justify-center gap-2"
                          >
                            Continue to Details
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-xl p-8 text-center bg-zinc-950/10 min-h-[160px]">
                        <Clock className="w-8 h-8 text-zinc-600 mb-3" />
                        <p className="text-zinc-500 text-sm">Please select a date above to view available slots.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {step === "details" && selectedDate && selectedTime && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-md mx-auto"
                >
                  <button
                    onClick={handleBackStep}
                    className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors mb-6 group"
                  >
                    <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                    Back to Date & Time
                  </button>

                  <div className="mb-8 p-4 bg-zinc-950/40 border border-zinc-800 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="text-zinc-400 text-xs uppercase tracking-wider mb-1">Your Selection</h4>
                      <p className="text-white font-medium text-sm sm:text-base">
                        {format(selectedDate, "MMMM d, yyyy")} at {selectedTime}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center border border-zinc-800">
                      <Clock className="w-5 h-5 text-zinc-400" />
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-zinc-300 text-sm font-medium">Full Name</Label>
                      <div className="relative">
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Alex Mercer"
                          className="pl-10 h-11 border-zinc-800 bg-zinc-950/20 text-white rounded-xl focus-visible:border-zinc-700"
                        />
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-zinc-300 text-sm font-medium">Work Email</Label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="alex@company.com"
                          className="pl-10 h-11 border-zinc-800 bg-zinc-950/20 text-white rounded-xl focus-visible:border-zinc-700"
                        />
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-zinc-300 text-sm font-medium">Company Name (Optional)</Label>
                      <div className="relative">
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="Acme Corp"
                          className="pl-10 h-11 border-zinc-800 bg-zinc-950/20 text-white rounded-xl focus-visible:border-zinc-700"
                        />
                        <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting || !formData.name || !formData.email}
                      className="w-full shimmer-btn bg-white text-zinc-950 hover:bg-zinc-200 rounded-xl h-12 text-sm font-medium flex items-center justify-center gap-2 mt-8"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          Confirm Booking
                          <CheckCircle2 className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </motion.div>
              )}

              {step === "success" && selectedDate && selectedTime && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="max-w-md mx-auto text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                    className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/5"
                  >
                    <CheckCircle2 className="w-8 h-8" />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h3>
                  <p className="text-zinc-400 text-sm mb-8">
                    We've sent a confirmation email with call details to <span className="text-zinc-300 font-medium">{formData.email}</span>.
                  </p>

                  <div className="bg-zinc-950/40 border border-zinc-800/80 rounded-xl p-5 mb-8 space-y-3.5 text-left max-w-sm mx-auto shadow-inner">
                    <div className="flex items-start gap-3">
                      <User className="w-4 h-4 text-zinc-500 mt-0.5" />
                      <div>
                        <span className="text-xs text-zinc-500 block">Host & Guest</span>
                        <span className="text-sm font-medium text-zinc-300">{formData.name} & Booker Team</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CalendarIcon className="w-4 h-4 text-zinc-500 mt-0.5" />
                      <div>
                        <span className="text-xs text-zinc-500 block">Date & Time</span>
                        <span className="text-sm font-medium text-zinc-300">
                          {format(selectedDate, "eeee, MMMM d, yyyy")}
                        </span>
                        <span className="text-xs text-zinc-400 block mt-0.5">
                          {selectedTime} ({timezone})
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      setStep("datetime")
                      setSelectedDate(new Date())
                      setSelectedTime(null)
                      setFormData({ name: "", email: "", company: "" })
                    }}
                    className="rounded-xl px-6 h-11 text-xs font-medium border border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white hover:border-zinc-700 bg-transparent"
                  >
                    Schedule Another Demo
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
