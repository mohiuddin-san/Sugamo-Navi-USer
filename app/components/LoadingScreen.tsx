export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <div className="flex flex-col items-center gap-8 p-8">
        {/* Main Logo with Animation */}
        <div className="relative">
          <img 
            src="./src/sugamo-navi-text.svg" 
            alt="SUGAMO NAVI" 
            className="w-56 md:w-72 h-auto animate-pulse"
            style={{
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}
          />
          
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-red-500 rounded-full opacity-20 animate-ping"></div>
          <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-black rounded-full opacity-20 animate-ping" 
               style={{ animationDelay: '0.5s' }}></div>
        </div>
        
        {/* Modern Spinner */}
        <div className="relative w-20 h-20">
          {/* Outer ring */}
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
          {/* Spinning arc */}
          <div className="absolute inset-0 border-4 border-transparent border-t-black border-r-black rounded-full animate-spin"></div>
          {/* Inner dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Loading Text with Japanese */}
        <div className="flex flex-col items-center gap-2">
          <p className="font-cousine text-lg md:text-xl font-bold italic tracking-wide animate-pulse">
            LOADING
          </p>
          <p className="font-cairo text-sm text-gray-600 animate-pulse"
             style={{ animationDelay: '0.3s' }}>
            読み込み中...
          </p>
        </div>
        
        {/* Progress bar (optional) */}
        <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-black via-red-500 to-black animate-shimmer"
               style={{
                 width: '50%',
                 animation: 'shimmer 1.5s infinite'
               }}>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}