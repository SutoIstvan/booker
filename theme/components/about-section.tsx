import { Leaf, HandHeart, ShieldCheck } from 'lucide-react'

const features = [
  {
    icon: HandHeart,
    title: 'Опытные мастера',
    text: 'Сертифицированные специалисты со стажем от 5 лет и индивидуальным подходом.',
  },
  {
    icon: Leaf,
    title: 'Натуральные масла',
    text: 'Только органическая косметика и эфирные масла премиального качества.',
  },
  {
    icon: ShieldCheck,
    title: 'Чистота и комфорт',
    text: 'Стерильность, свежий текстиль к каждому сеансу и уютная атмосфера покоя.',
  },
]

export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-20 py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2 md:gap-14 md:px-6">
        <div className="overflow-hidden rounded-3xl border border-border/60 shadow-sm">
          <img
            src="/images/about-interior.png"
            alt="Светлый интерьер спа-салона с деревянными акцентами и растениями"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-6">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            О салоне
          </p>
          <h2 className="text-balance font-serif text-3xl font-semibold text-foreground md:text-4xl">
            Пространство, где время замедляется
          </h2>
          <p className="text-pretty leading-relaxed text-muted-foreground">
            «Тишина» — это уютный салон в центре города, созданный для тех, кто хочет
            отдохнуть от суеты. Мягкий свет, тёплые ароматы и внимательные мастера
            помогут вам восстановить силы и вернуть телу гармонию.
          </p>

          <div className="mt-2 flex flex-col gap-5">
            {features.map((f) => (
              <div key={f.title} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-medium text-foreground">{f.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {f.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
