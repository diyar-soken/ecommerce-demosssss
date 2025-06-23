import { Component, type OnInit, type OnDestroy, type ElementRef, ViewChild, type AfterViewInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { interval, type Subscription } from "rxjs"

interface Dot {
  id: number
  x: number
  y: number
  size: number
  opacity: number
}

interface PearDot {
  x: number
  y: number
}

@Component({
  selector: "app-root",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.css"],
})
export class LandingComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("heroSection") heroSection!: ElementRef
  @ViewChild("productSection") productSection!: ElementRef
  @ViewChild("featuresSection") featuresSection!: ElementRef
  @ViewChild("techSection") techSection!: ElementRef
  @ViewChild("gallerySection") gallerySection!: ElementRef
  @ViewChild("communitySection") communitySection!: ElementRef

  currentTime = new Date()
  private timeSubscription!: Subscription
  private intersectionObserver!: IntersectionObserver

  dots: Dot[] = []
  pearLogoDots: PearDot[] = [
    { x: 50, y: 35 },
    { x: 48, y: 38 },
    { x: 52, y: 38 },
    { x: 46, y: 41 },
    { x: 50, y: 41 },
    { x: 54, y: 41 },
    { x: 44, y: 44 },
    { x: 48, y: 44 },
    { x: 52, y: 44 },
    { x: 56, y: 44 },
    { x: 46, y: 47 },
    { x: 50, y: 47 },
    { x: 54, y: 47 },
    { x: 48, y: 50 },
    { x: 52, y: 50 },
    { x: 50, y: 53 },
    { x: 51, y: 32 },
    { x: 52, y: 30 },
  ]

  features = [
    {
      title: "P1 NEURAL",
      subtitle: "ENGINE",
      desc: "Revolutionary processing power that redefines mobile computing.",
      image: "../assets/images/p2-ultra.png",
    },
    {
      title: "LIQUID",
      subtitle: "RETINA",
      desc: "13.6-inch display with unprecedented color accuracy and brightness.",
      image: "/assets/images/macbook-display.png",
    },
    {
      title: "ULTRA",
      subtitle: "PORTABLE",
      desc: "Impossibly thin design that doesn't compromise on performance.",
      image: "/assets/images/macbook-side.png",
    },
  ]

  techSpecs = [
    { label: "PROCESSOR", value: "P1 Neural Engine" },
    { label: "MEMORY", value: "16GB Unified Memory" },
    { label: "STORAGE", value: "512GB SSD" },
    { label: "DISPLAY", value: "13.6-inch Liquid Retina" },
    { label: "BATTERY", value: "22-hour all-day battery" },
    { label: "WEIGHT", value: "1.24 kg" },
  ]

  galleryItems = [
    { src: "/assets/images/macbook-hero.png", title: "PearBook Air" },
    { src: "/assets/images/macbook-side.png", title: "Ultra Portable" },
    { src: "/assets/images/ipad-pro.png", title: "PearPad Pro" },
    { src: "/assets/images/iphone-15.png", title: "PearPhone" },
    { src: "/assets/images/macbook-display.png", title: "Liquid Retina" },
    { src: "/assets/images/m2-chip.png", title: "P1 Neural Engine" },
  ]

  footerLinks = {
    products: ["PearBook", "PearPad", "PearPhone", "Accessories"],
    support: ["Contact", "Warranty", "Repairs", "Manuals"],
    company: ["About", "Careers", "Press", "Investors"],
    connect: ["Newsletter", "Community", "Social", "Events"],
  }

  ngOnInit() {
    this.generateDots()
    this.startClock()
    this.setupIntersectionObserver()
  }

  ngAfterViewInit() {
    this.observeElements()
  }

  ngOnDestroy() {
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe()
    }
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect()
    }
  }

  trackByDotId(index: number, dot: Dot): number {
    return dot.id
  }

  private generateDots() {
    for (let i = 0; i < 80; i++) {
      this.dots.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.4 + 0.2,
      })
    }
  }

  private startClock() {
    this.timeSubscription = interval(1000).subscribe(() => {
      this.currentTime = new Date()
    })
  }

  private setupIntersectionObserver() {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        })
      },
      { threshold: 0.1, rootMargin: "-100px" },
    )
  }

  private observeElements() {
    const elements = [
      this.productSection,
      this.featuresSection,
      this.techSection,
      this.gallerySection,
      this.communitySection,
    ]

    elements.forEach((element) => {
      if (element) {
        this.intersectionObserver.observe(element.nativeElement)
      }
    })
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
    })
  }

  formatFullDate(date: Date): string {
    return (
      date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }) +
      ", " +
      date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }) +
      " EST"
    )
  }

  getClockRotation(type: "hour" | "minute" | "second"): string {
    const hours = this.currentTime.getHours() % 12
    const minutes = this.currentTime.getMinutes()
    const seconds = this.currentTime.getSeconds()

    switch (type) {
      case "hour":
        return `rotate(${hours * 30 + minutes * 0.5}deg)`
      case "minute":
        return `rotate(${minutes * 6}deg)`
      case "second":
        return `rotate(${seconds * 6}deg)`
      default:
        return "rotate(0deg)"
    }
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }
}
