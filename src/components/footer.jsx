import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-start">
          <div className="w-full px-4 mb-12 text-slate-500 font-medium md:w-1/2">
            <h2 className="font-bold text-4xl text-slate-500 mb-5">
              Abdurrahman & Friends
            </h2>
            <h3 className="font-bold mb-2 text-2xl">Hubungi Kami</h3>
            <p>5049221005@student.its.ac.id</p>
            <p>Jalan Raya ITS</p>
          </div>
        </div>

        <div className="w-full pt-10 border-t border-slate-700">
          <div className="flex items-center justify-center mb-5">
            {/* YouTube Icon */}
            <a
              href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 mr-3 rounded-full flex justify-center items-center border border-slate-300 hover:bg-primary hover:text-white text-slate-300"
            >
              <svg
                className="fill-current"
                role="img"
                width="20"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>YouTube</title>
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>

            {/* GitHub Icon */}
            <a
              href="https://github.com/4bdurr"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 mr-3 rounded-full flex justify-center items-center border border-slate-300 hover:bg-primary hover:text-white text-slate-300"
            >
              <svg
                role="img"
                width="20"
                className="fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>GitHub</title>
                <path
                  d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 
                  0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 
                  17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 
                  1.205.084 1.838 1.236 1.838 1.236 1.07 
                  1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 
                  0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 
                  0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 
                  3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 
                  3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 
                  3.176.765.84 1.23 1.91 1.23 3.22 0 
                  4.61-2.805 5.625-5.475 5.92.42.36.81 
                  1.096.81 2.22 0 1.606-.015 2.896-.015 
                  3.286 0 .315.21.69.825.57C20.565 22.092 
                  24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                />
              </svg>
            </a>
          </div>
          <p className="text-center text-slate-300">
            &copy; 2025 Abdurrahman & Friends. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
