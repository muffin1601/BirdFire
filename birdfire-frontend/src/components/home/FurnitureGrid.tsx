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


          <div className="small-row">
            <div className="card card-small card-content-only">

              <div className="card-content">
                <span className="card-eyebrow">DESIGN</span>
                <h3 className="card-title">Allaperto Series</h3>
              </div>

              <Link href="#" className="card-arrow">
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="card card-small">
              <img src="https://www.ethimo.com/assets/images/collections/xallaperto-mountain-tartan.jpg.pagespeed.ic.KWCazuhYjo.webp" />
            </div>
          </div>

          {/* BOTTOM SMALL ROW */}
          <div className="small-row">
            <div className="card card-small">
              <img src="https://www.ethimo.com/assets/images/collections/xPatio_800x6000.jpg.pagespeed.ic.ct6QVxyHqY.webp" />
            </div>

            <div className="card card-small card-content-only">


              <div className="card-content">
                <span className="card-eyebrow">COLLECTION</span>
                <h3 className="card-title">Outdoor Living</h3>
              </div>

              <Link href="#" className="card-arrow">
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="right-col">

          <div className="card card-small card-content-only">

            <div className="card-content">
              <span className="card-eyebrow">OUTDOOR</span>
              <h3 className="card-title">Patio Collection</h3>
            </div>

            <Link href="#" className="card-arrow">
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="card card-tall">
            <img src="https://www.ethimo.com/assets/images/homepage/xSito_Eivissa.jpg,qv=5.pagespeed.ic.SLbuANk_zL.webp" />
          </div>
        </div>

      </div>
    </section>
  )
}
