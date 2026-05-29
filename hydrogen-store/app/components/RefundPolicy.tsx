import React from 'react';
import { ArrowLeft } from 'lucide-react';

export const RefundPolicy: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#faf9f7] py-16 px-6 md:px-16 text-[#1a1a1a]">
      <div className="max-w-3xl mx-auto">

        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[11px] font-mono-street uppercase tracking-widest text-zinc-400 hover:text-zinc-800 transition-colors mb-12"
        >
          <ArrowLeft size={14} /> Back
        </button>

        {/* Header */}
        <span className="text-[11px] font-mono-street tracking-[0.25em] text-zinc-400 uppercase">Policy</span>
        <h1 className="font-heading font-extrabold text-4xl md:text-5xl uppercase text-[#1a1a1a] mt-1 mb-12">
          Refund Policy
        </h1>

        <div className="space-y-10 text-sm text-zinc-600 leading-relaxed">

          {/* Refund Policy */}
          <section>
            <h2 className="font-heading font-bold text-lg uppercase text-[#1a1a1a] mb-3 pb-2 border-b border-zinc-200">
              Refund Policy (With Return and Shipping Fees Deduction)
            </h2>
            <p>
              We accept returns within <strong className="text-[#1a1a1a]">14 days of purchase</strong>, but please note that a return processing fee and the original shipping cost will be deducted from your refund. <strong className="text-[#1a1a1a]">UNLESS</strong> the return is due to our mistake (e.g., providing a wrong or damaged item).
            </p>
            <p className="mt-3">
              To be eligible for a return, the item must be in unused, unwashed condition with original tags attached. Once your return is received and processed, we will issue a refund to your original payment method, or store credit. Please allow <strong className="text-[#1a1a1a]">7-10 business days</strong> for the refund to appear on your account after it has been processed.
            </p>
          </section>

          {/* Exchanges */}
          <section>
            <h2 className="font-heading font-bold text-lg uppercase text-[#1a1a1a] mb-3 pb-2 border-b border-zinc-200">
              Exchanges
            </h2>
            <p>
              We offer exchanges for size. To exchange an item, please return it following our return process and place a new order for the desired item.
            </p>
          </section>

          {/* Non-Returnable Items */}
          <section>
            <h2 className="font-heading font-bold text-lg uppercase text-[#1a1a1a] mb-3 pb-2 border-b border-zinc-200">
              Non-Returnable Items
            </h2>
            <p className="mb-3 text-zinc-600">Certain items cannot be returned, including:</p>
            <ul className="space-y-2 list-none">
              {['Final sale items', 'Worn or Washed Hoodies', 'original tags removed'].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#1a1a1a] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Return Shipping */}
          <section>
            <h2 className="font-heading font-bold text-lg uppercase text-[#1a1a1a] mb-3 pb-2 border-b border-zinc-200">
              Return Shipping
            </h2>
            <p>
              Customers are responsible for the return shipping cost unless the item is defective or incorrect.
            </p>
          </section>

          {/* Damaged or Incorrect Items */}
          <section>
            <h2 className="font-heading font-bold text-lg uppercase text-[#1a1a1a] mb-3 pb-2 border-b border-zinc-200">
              Damaged or Incorrect Items
            </h2>
            <p>
              If you receive a damaged or incorrect item, please contact our customer service team within <strong className="text-[#1a1a1a]">5 days</strong> of receiving your order. To process your request, we will need proof of the damage or incorrect item (e.g., photos). Once we verify the issue, we will send you a replacement or offer a full refund.
            </p>
          </section>

          {/* How to Return or Exchange */}
          <section>
            <h2 className="font-heading font-bold text-lg uppercase text-[#1a1a1a] mb-3 pb-2 border-b border-zinc-200">
              How to Return or Exchange
            </h2>
            <p className="mb-4 font-semibold text-[#1a1a1a]">Submit a return request</p>
            <ol className="space-y-6 list-none">
              <li className="flex gap-4">
                <span className="font-heading font-extrabold text-2xl text-zinc-300 leading-none shrink-0">01</span>
                <div>
                  <a
                    href="https://shopify.com/56972869714/account"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#1a1a1a] underline underline-offset-4 hover:text-zinc-500 transition-colors"
                  >
                    Log in to your account:
                  </a>
                  <ul className="mt-2 space-y-1.5 text-zinc-500 list-disc list-inside pl-1 text-[13px]">
                    <li>In the "Email" field, enter your email address, and then click “Continue”.</li>
                    <li>In your email account, open the email sent from our store and copy the six-digit verification code included in the email.</li>
                    <li>Go back to the online store, and then enter a six-digit verification code.</li>
                  </ul>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-heading font-extrabold text-2xl text-zinc-300 leading-none shrink-0">02</span>
                <div>
                  <p className="font-bold text-[#1a1a1a]">Request return</p>
                  <p className="mt-1 text-zinc-500">Click "Request return" for the order that you want to submit the return for.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-heading font-extrabold text-2xl text-zinc-300 leading-none shrink-0">03</span>
                <div>
                  <p className="font-bold text-[#1a1a1a]">Select items</p>
                  <p className="mt-1 text-zinc-500">If your order contains multiple items, select the items you wish to return.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-heading font-extrabold text-2xl text-zinc-300 leading-none shrink-0">04</span>
                <div>
                  <p className="font-bold text-[#1a1a1a]">Choose a return reason</p>
                  <p className="mt-1 text-zinc-500">Choose a return reason and feel free to add a note for the store.</p>
                </div>
              </li>
            </ol>
          </section>

          {/* Contact */}
          <section className="bg-white border border-zinc-200 p-6 rounded-2xl">
            <h2 className="font-heading font-bold text-lg uppercase text-[#1a1a1a] mb-4">
              Need Help?
            </h2>
            <p className="text-zinc-600 mb-4 text-[13px]">
              If you need any further assistance, please don't hesitate to contact us via:
            </p>
            <ul className="space-y-2.5">
              {[
                { label: 'WhatsApp', value: '+966536470644', href: 'https://wa.me/966536470644' },
                { label: 'Email', value: 'theapricity.officials@gmail.com', href: 'mailto:theapricity.officials@gmail.com' },
                { label: 'Live Chat', value: 'Available on our website', href: null },
              ].map(({ label, value, href }) => (
                <li key={label} className="flex items-center gap-3 text-[11px] font-mono-street uppercase tracking-widest">
                  <span className="text-zinc-400 w-20 shrink-0">{label}</span>
                  {href ? (
                    <a href={href} className="text-[#1a1a1a] hover:text-zinc-500 transition-colors underline underline-offset-2">{value}</a>
                  ) : (
                    <span className="text-[#1a1a1a]">{value}</span>
                  )}
                </li>
              ))}
            </ul>
            <p className="text-zinc-500 mt-4 text-xs italic">
              We’re here to help and will get back to you as soon as possible!
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};