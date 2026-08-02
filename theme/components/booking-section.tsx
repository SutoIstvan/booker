'use client'

import { useMemo, useState } from 'react'
import { Check, CalendarDays, Clock, Sparkles } from 'lucide-react'
import { services, timeSlots, formatPrice } from '@/lib/salon-data'

type DayOption = {
  value: string
  weekday: string
  day: string
  month: string
}

function getUpcomingDays(count: number): DayOption[] {
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ]
  const days: DayOption[] = []
  const today = new Date()
  for (let i = 0; i < count; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    days.push({
      value: date.toISOString().slice(0, 10),
      weekday: i === 0 ? 'Today' : weekdays[date.getDay()],
      day: String(date.getDate()),
      month: months[date.getMonth()],
    })
  }
  return days
}

export function BookingSection() {
  const days = useMemo(() => getUpcomingDays(10), [])

  const [serviceId, setServiceId] = useState(services[0].id)
  const [day, setDay] = useState(days[0].value)
  const [time, setTime] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const selectedService = services.find((s) => s.id === serviceId)
  const selectedDay = days.find((d) => d.value === day)

  const isValid = serviceId && day && time && name.trim() && phone.trim()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) return
    setSubmitted(true)
  }

  function resetForm() {
    setSubmitted(false)
    setTime('')
    setName('')
    setPhone('')
  }

  return (
    <section id="booking" className="scroll-mt-20 bg-secondary/50 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            Online booking
          </p>
          <h2 className="text-balance font-serif text-3xl font-semibold text-foreground md:text-4xl">
            Book a time that works for you
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Choose a service, date and time — we&apos;ll call you back to confirm your appointment.
          </p>
        </div>

        <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm">
          {submitted ? (
            <div className="flex flex-col items-center gap-5 p-10 text-center md:p-14">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Check className="h-8 w-8" aria-hidden="true" />
              </span>
              <h3 className="font-serif text-2xl font-semibold text-foreground">
                Request received, {name}!
              </h3>
              <p className="max-w-md leading-relaxed text-muted-foreground">
                You&apos;re booked for{' '}
                <span className="font-medium text-foreground">
                  {selectedService?.name}
                </span>{' '}
                — {selectedDay?.weekday}, {selectedDay?.month} {selectedDay?.day} at{' '}
                <span className="font-medium text-foreground">{time}</span>. We&apos;ll
                call {phone} to confirm.
              </p>
              <button
                type="button"
                onClick={resetForm}
                className="mt-2 rounded-full border border-border bg-card px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Book again
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-8 p-6 md:p-10">
              {/* Услуга */}
              <fieldset className="flex flex-col gap-3">
                <legend className="mb-1 flex items-center gap-2 text-sm font-medium text-foreground">
                  <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
                  Choose a service
                </legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {services.map((service) => {
                    const active = service.id === serviceId
                    return (
                      <button
                        type="button"
                        key={service.id}
                        onClick={() => setServiceId(service.id)}
                        aria-pressed={active}
                        className={`flex items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                          active
                            ? 'border-primary bg-primary/5 text-foreground'
                            : 'border-border bg-card text-muted-foreground hover:border-primary/40'
                        }`}
                      >
                        <span className="font-medium">{service.name}</span>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {service.duration}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </fieldset>

              {/* Дата */}
              <fieldset className="flex flex-col gap-3">
                <legend className="mb-1 flex items-center gap-2 text-sm font-medium text-foreground">
                  <CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" />
                  Date
                </legend>
                <div className="flex snap-x gap-2 overflow-x-auto pb-2">
                  {days.map((d) => {
                    const active = d.value === day
                    return (
                      <button
                        type="button"
                        key={d.value}
                        onClick={() => setDay(d.value)}
                        aria-pressed={active}
                        className={`flex min-w-16 shrink-0 snap-start flex-col items-center gap-1 rounded-xl border px-3 py-3 transition-colors ${
                          active
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border bg-card text-muted-foreground hover:border-primary/40'
                        }`}
                      >
                        <span className="text-xs">{d.weekday}</span>
                        <span className="text-lg font-semibold">{d.day}</span>
                        <span className="text-xs">{d.month}</span>
                      </button>
                    )
                  })}
                </div>
              </fieldset>

              {/* Время */}
              <fieldset className="flex flex-col gap-3">
                <legend className="mb-1 flex items-center gap-2 text-sm font-medium text-foreground">
                  <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
                  Время
                </legend>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {timeSlots.map((slot) => {
                    const active = slot === time
                    return (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setTime(slot)}
                        aria-pressed={active}
                        className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                          active
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border bg-card text-muted-foreground hover:border-primary/40'
                        }`}
                      >
                        {slot}
                      </button>
                    )
                  })}
                </div>
              </fieldset>

              {/* Контакты */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">
                    Ваше имя
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Анна"
                    className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="text-sm font-medium text-foreground">
                    Телефон
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+7 (900) 000-00-00"
                    className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Итог + отправка */}
              <div className="flex flex-col gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-muted-foreground">
                  {selectedService && (
                    <p>
                      Итого:{' '}
                      <span className="text-base font-semibold text-foreground">
                        {formatPrice(selectedService.price)}
                      </span>{' '}
                      · {selectedService.duration}
                    </p>
                  )}
                  {time && selectedDay && (
                    <p className="mt-0.5">
                      {selectedDay.weekday}, {selectedDay.day} {selectedDay.month} в{' '}
                      {time}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={!isValid}
                  className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Подтвердить запись
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
