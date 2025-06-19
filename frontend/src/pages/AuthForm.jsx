import React from 'react';

const AuthForm = ({
  type,
  name,
  lastname,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  onSubmit
}) => {
  return (
    <div>
      <form
        onSubmit={onSubmit}
        className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'
      >
        <div className='inline-flex items-center gap-2 mb-2 mt-10'>
          <p className='prata-regular text-3xl'>{type}</p>
          <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
        </div>

      {type === 'Sign Up' && (
        <>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type='text'
            className='w-full px-3 py-2 border border-gray-800'
            placeholder='First Name'
            required
          />
          <input
            value={lastname}
            type='text'
            className='w-full px-3 py-2 border border-gray-800'
            placeholder='Last Name'
            required
          />
        </>
      )}
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type='email'
          className='w-full px-3 py-2 border border-gray-800'
          placeholder='Email'
          required
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type='password'
          className='w-full px-3 py-2 border border-gray-800'
          placeholder='Password'
          required
        />

        <div className='w-full flex justify-between text-sm mt-[-8px]'>
          <p className='hover:text-red-500  cursor-pointer'>Forgot your password?</p>
          {type === 'Login' ? (
            <p onClick={() => window.location.href = '/signup'} className='hover:text-red-500 cursor-pointer'>Create account</p>
          ) : (
            <p onClick={() => window.location.href = '/login'} className='hover:text-red-500 cursor-pointer'>Login Here</p>
          )}
        </div>

        <button 
                      className="relative group overflow-hidden bg-black text-white text-sm my-8 px-8 py-3"
          >
            <span className="absolute inset-0 bg-red-600 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out z-0"></span>
          {type === 'Login' ? (
                <span className="relative z-10">Login</span>
            ) : (
              <span className="relative z-10">Sign Up</span>       
           )}   
      
          
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
