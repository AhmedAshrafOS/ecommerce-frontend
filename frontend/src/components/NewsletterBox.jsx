import React from 'react'

const NewsletterBox = () => {
    const onSubmitHandler=(event)=>{
        event.preventDefault()
    }
  return (
    <div className='text-center'>
        <p className='text-2xl font-medium text-gray-800'>Subscribe now & get 20% off</p>
        <p className='text-gray-400 mt-3'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Praesentium, libero.</p>
        <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
            <input className='w-full sm:flex-1 outline-none'type="email" placeholder='Enter your email' required/>

            <button
              className="relative group overflow-hidden bg-black text-white text-sm my-8 px-8 py-3"
            >
              <span className="absolute inset-0 bg-red-600 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out z-0"></span>
              <span className="relative z-10">SUBSCRIBE</span>
            </button>

        </form>
    </div>
  )
}

export default NewsletterBox;
