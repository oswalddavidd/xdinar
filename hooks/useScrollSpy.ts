'use client'

import { useEffect, useState } from 'react'

export function useScrollSpy(sectionIds: string[], offset = 80): string {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? '')

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    const callback: IntersectionObserverCallback = (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id)
        }
      }
    }

    const observer = new IntersectionObserver(callback, {
      // Account for fixed navbar height and bottom margin
      rootMargin: `-${offset}px 0px -20% 0px`,
      threshold: 0.3,
    })

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    observers.push(observer)

    return () => {
      observers.forEach((obs) => obs.disconnect())
    }
  }, [sectionIds, offset])

  return activeId
}
