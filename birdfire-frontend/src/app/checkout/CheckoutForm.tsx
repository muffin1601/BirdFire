'use client'

import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import styles from './Checkout.module.css'

export default function CheckoutForm({ cartItems }: { cartItems: any[] }) {
  const stripe = useStripe()
  const elements = useElements()

  const total = cartItems.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`
      }
    })
  }

  return (
    <div className={styles.container}>
      {/* LEFT */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.heading}>Payment</h2>

        <PaymentElement />

        <button
          type="submit"
          className={styles.btnSubmit}
          disabled={!stripe}
        >
          <span>Pay now</span>
        </button>
      </form>

      {/* RIGHT */}
      <aside className={styles.summary}>
        <h3 className={styles.summaryTitle}>Order summary</h3>

        {cartItems.map((item, idx) => {
          const image =
            item.product.product_images?.find((i: any) => i.is_primary)
              ?.image_url

          return (
            <div key={idx} className={styles.item}>
              <img src={image} alt={item.product.name} />
              <div className={styles.itemInfo}>
                <p>{item.product.name}</p>
                <span>Qty {item.quantity}</span>
              </div>
              <strong className={styles.itemPrice}>
                ${(item.product.price * item.quantity).toFixed(2)}
              </strong>
            </div>
          )
        })}

        <div className={styles.total}>
          <span>Total</span>
          <strong>${total.toFixed(2)}</strong>
        </div>
      </aside>
    </div>
  )
}