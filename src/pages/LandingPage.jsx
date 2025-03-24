import React from 'react';
import { Link } from 'react-router-dom';
import { usePageAnnouncement } from '@/hooks/usePageAnnouncement';

function LandingPage() {
  usePageAnnouncement('Homepage', []);
  
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800">
        <div className="absolute inset-0 bg-[url('https://cdnjs.cloudflare.com/ajax/libs/pattern.css/1.0.0/pattern.min.css')] opacity-10"></div>
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32 pt-10 sm:pt-16 md:pt-20 lg:pt-24 xl:pt-28">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 bg-opacity-20 text-blue-200 mb-6">
                  <span className="text-xs font-medium tracking-wide">Trusted by over 1 million customers</span>
                </div>
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">Banking Reimagined</span>
                  <span className="block text-blue-200">For Your Digital Life</span>
                </h1>
                <p className="mt-5 text-base text-blue-100 sm:mt-7 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-7 md:text-xl">
                  Experience seamless digital banking with advanced security features, 
                  real-time transactions, and comprehensive financial management tools — all in one place.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full max-w-md">
                  <Link to="/signup" className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-blue-700 bg-white hover:bg-blue-50 transform transition duration-150 hover:scale-105 shadow-xl">
                    <span className="mr-2">Get Started</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                    </svg>
                  </Link>
                  <Link to="/login" className="w-full flex items-center justify-center px-8 py-4 border border-blue-400 text-base font-medium rounded-lg text-white bg-blue-500 bg-opacity-40 hover:bg-opacity-60 backdrop-blur transform transition duration-150 hover:scale-105 shadow-lg">
                    Sign In
                  </Link>
                </div>
                
                {/* Trust indicators */}
                <div className="mt-12 flex flex-wrap justify-center gap-8 items-center opacity-70">
                  <div className="text-white flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-sm">256-bit Encryption</span>
                  </div>
                  <div className="text-white flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-sm">24/7 Support</span>
                  </div>
                  <div className="text-white flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-2xl font-bold">FDIC Insured</span>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 sm:h-20 fill-current text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"></path>
          </svg>
        </div>
      </div>

      {/* Feature section with animated hover effects */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-1 rounded-full bg-blue-100 text-blue-700 mb-3">
              <span className="text-xs font-semibold tracking-wide uppercase">Why Choose Us</span>
            </div>
            <h2 className="text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Banking That Works For You
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Powerful features designed to make your financial life easier.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="group relative p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-blue-100 text-blue-600 mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Advanced Security</h3>
                  <p className="text-base text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                    End-to-end encrypted transactions with biometric authentication and real-time fraud monitoring to keep your money safe.
                  </p>
                  <div className="mt-5 flex items-center text-blue-600 group-hover:text-blue-700">
                    <span className="text-sm font-medium">Learn more</span>
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group relative p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-blue-100 text-blue-600 mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Transfers</h3>
                  <p className="text-base text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                    Send and receive money instantly with real-time notifications and automatic transaction categorization.
                  </p>
                  <div className="mt-5 flex items-center text-blue-600 group-hover:text-blue-700">
                    <span className="text-sm font-medium">Learn more</span>
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group relative p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-blue-100 text-blue-600 mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Insights</h3>
                  <p className="text-base text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                    AI-powered analytics dashboard that tracks spending habits, suggests savings opportunities, and helps you reach financial goals.
                  </p>
                  <div className="mt-5 flex items-center text-blue-600 group-hover:text-blue-700">
                    <span className="text-sm font-medium">Learn more</span>
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* App showcase section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-1 rounded-full bg-blue-100 text-blue-700 mb-3">
                <span className="text-xs font-semibold tracking-wide uppercase">Mobile Banking</span>
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl mb-6">
                Bank Anywhere, Anytime
              </h2>
              <p className="text-lg text-gray-500 mb-8">
                Take control of your finances with our award-winning mobile app. Manage accounts, pay bills, deposit checks, and more — all from your smartphone.
              </p>
              
              <div className="space-y-4">
                {/* Feature list */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-base text-gray-500">Face ID and Touch ID login for secure access</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-base text-gray-500">Mobile check deposit with instant verification</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-base text-gray-500">Card freeze/unfreeze for lost or stolen cards</p>
                </div>
              </div>
              
              <div className="mt-10 flex space-x-4">
                <a href="#" className="flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition duration-150">
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  See Demo
                </a>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative mx-auto w-full max-w-md">
                {/* Phone mockup */}
                <div className="p-4 bg-black rounded-3xl shadow-2xl overflow-hidden">
                  <div className="relative bg-gray-800 rounded-2xl overflow-hidden aspect-w-9 aspect-h-16 h-96">
                    {/* App screen placeholder */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 flex flex-col">
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-center mb-8">
                          <div>
                            <p className="text-blue-100 text-sm">Good morning,</p>
                            <p className="text-white font-bold text-xl">Alex</p>
                          </div>
                          <div className="h-10 w-10 rounded-full bg-white bg-opacity-20"></div>
                        </div>
                        
                        <div className="bg-white bg-opacity-10 p-4 rounded-xl backdrop-blur-sm mb-6">
                          <p className="text-blue-100 text-xs mb-1">Available Balance</p>
                          <p className="text-white font-bold text-2xl">$12,456.78</p>
                          <div className="mt-2 flex space-x-2">
                            <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                              <p className="text-white text-xs">+$250 today</p>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-white text-sm font-medium mb-3">Quick Actions</p>
                        <div className="grid grid-cols-3 gap-3 mb-6">
                          <div className="flex flex-col items-center">
                            <div className="h-12 w-12 rounded-full bg-white bg-opacity-10 flex items-center justify-center mb-1"></div>
                            <p className="text-white text-xs">Send</p>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="h-12 w-12 rounded-full bg-white bg-opacity-10 flex items-center justify-center mb-1"></div>
                            <p className="text-white text-xs">Request</p>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="h-12 w-12 rounded-full bg-white bg-opacity-10 flex items-center justify-center mb-1"></div>
                            <p className="text-white text-xs">Cards</p>
                          </div>
                        </div>
                        
                        <p className="text-white text-sm font-medium mb-3">Recent Transactions</p>
                        <div className="space-y-3">
                          <div className="bg-white bg-opacity-10 p-3 rounded-lg flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-white bg-opacity-20 mr-3"></div>
                              <div>
                                <p className="text-white text-xs font-medium">Coffee Shop</p>
                                <p className="text-blue-100 text-xs">Today</p>
                              </div>
                            </div>
                            <p className="text-white text-xs font-medium">-$4.50</p>
                          </div>
                          <div className="bg-white bg-opacity-10 p-3 rounded-lg flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-white bg-opacity-20 mr-3"></div>
                              <div>
                                <p className="text-white text-xs font-medium">Salary</p>
                                <p className="text-blue-100 text-xs">Today</p>
                              </div>
                            </div>
                            <p className="text-green-300 text-xs font-medium">+$2,500.00</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="h-16 px-6 flex items-center justify-between border-t border-white border-opacity-10">
                        <div className="h-6 w-6 rounded-full bg-white bg-opacity-20"></div>
                        <div className="h-6 w-6 rounded-full bg-white bg-opacity-20"></div>
                        <div className="h-6 w-6 rounded-full bg-white bg-opacity-20"></div>
                        <div className="h-6 w-6 rounded-full bg-white bg-opacity-20"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA section */}
      <div className="bg-blue-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-blue-300">Open an account in minutes.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link to="/signup" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition duration-150">
                Get started
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <a href="#" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 bg-opacity-60 hover:bg-opacity-70 transition duration-150">
                Learn more
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;