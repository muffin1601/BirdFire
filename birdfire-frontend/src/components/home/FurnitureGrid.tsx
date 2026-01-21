"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import "./FurnitureGrid.css"

export default function FurnitureGrid() {
  return (
    <section className="furniture-grid">
      <div className="grid">

        {/* LEFT COLUMN */}
        <div className="left-col">

          {/* TOP LARGE CARD */}
          <div className="card card-large">
            <img src="https://nov-minicom.myshopify.com/cdn/shop/files/home4-banner1.jpg?v=1752744309&width=1512" />

            <div className="card-content">
              <span className="card-eyebrow">
                STEP TO BUY – SIMPLE & HASSLE-FREE
              </span>
              <h3 className="card-title">
                Elegant Living <br /> Room Lamps
              </h3>
            </div>

            {/* <Link href="#" className="card-arrow">
              <i className="zmdi zmdi-long-arrow-right"></i>
            </Link> */}
            <Link href="#" className="card-arrow">
              <ArrowRight size={20} />
            </Link>
            
          </div>

          {/* BOTTOM SMALL ROW */}
          <div className="small-row">
            <div className="card card-small">
              <img src="https://nov-minicom.myshopify.com/cdn/shop/files/home4-banner2.jpg?v=1752744308&width=768" />
            </div>

            <div className="card card-small">
              <img src="https://nov-minicom.myshopify.com/cdn/shop/files/home4-banner3.jpg?v=1752744308&width=768" />
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="right-col">
          <div className="card card-tall">
            <img src="https://nov-minicom.myshopify.com/cdn/shop/files/home4-banner4.jpg?v=1752744309&width=1512" />
          </div>
        </div>

      </div>
    </section>
  )
}
