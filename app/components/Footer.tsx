import React from 'react'

const Footer = () => {
  return (
    <div>
        <footer className="footer footer-center bg-base-300 text-base-content p-4">
  <aside>
    <p>Copyright © {new Date().getFullYear()} - <a href="https://www.linkedin.com/in/quasimkhan/" target='_blank' className='hover:text-indigo-500 underline'>Quasim Khan</a></p>
  </aside>
</footer>
    </div>
  )
}

export default Footer