import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Ольга К.',
    text: 'Лучший расслабляющий массаж в городе. Уходила как будто заново родилась. Атмосфера невероятно спокойная.',
  },
  {
    name: 'Дмитрий В.',
    text: 'Хожу на спортивный массаж после тренировок. Мастер профессиональный, спина перестала болеть. Рекомендую!',
  },
  {
    name: 'Мария С.',
    text: 'Ароматерапия — это что-то волшебное. Онлайн-запись удобная, всегда подтверждают заранее. Мой любимый салон.',
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="scroll-mt-20 bg-secondary/50 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            Отзывы
          </p>
          <h2 className="text-balance font-serif text-3xl font-semibold text-foreground md:text-4xl">
            Что говорят наши гости
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6"
            >
              <Quote className="h-7 w-7 text-primary/30" aria-hidden="true" />
              <blockquote className="flex-1 text-pretty leading-relaxed text-foreground">
                {t.text}
              </blockquote>
              <div className="flex items-center gap-1 text-accent">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent" aria-hidden="true" />
                ))}
              </div>
              <figcaption className="text-sm font-medium text-muted-foreground">
                {t.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
