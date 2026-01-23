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
            <img src="https://www.gandiablasco.com/wp-content/uploads/2020/12/onde-lounge-chair-gallery-horizontal-1-1.jpg" />

            {/* <div className="card-content">
              <span className="card-eyebrow">
                STEP TO BUY – SIMPLE & HASSLE-FREE
              </span>
              <h3 className="card-title">
                Elegant Living <br /> Lounge Chairs
              </h3>
            </div> */}

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
              <img src="https://www.ethimo.com/assets/images/collections/xPatio_800x6000.jpg.pagespeed.ic.ct6QVxyHqY.webp" />
            </div>

            <div className="card card-small">
              <img src="https://www.ethimo.com/assets/images/collections/xallaperto-mountain-tartan.jpg.pagespeed.ic.KWCazuhYjo.webp" />
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="right-col">
          <div className="card card-tall">
            <img src="https://www.gandiablasco.com/wp-content/uploads/2020/11/chill-collection-grid.jpg" />
          </div>
        </div>

      </div>
    </section>
  )
}
