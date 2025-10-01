interface Error404Props {
  onNavigateHome?: () => void;
  onNavigateBack?: () => void;
}

const NotFound = ({ onNavigateHome, onNavigateBack }: Error404Props = {}) => {
  const handleGoBack = () => {
    if (onNavigateBack) {
      onNavigateBack();
    } else {
      window.history.back();
    }
  };

  const handleGoHome = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="text-[180px] md:text-[240px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 leading-none">
            404
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4 mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
            Page Not Found
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-md mx-auto">
            Oops! The page you're looking for seems to have wandered off. Let's
            get you back on track.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleGoBack}
            className="px-8 py-3 text-base font-semibold text-gray-100 bg-white border-2 border-gray-300 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Go Back
          </button>
          <button
            onClick={handleGoHome}
            className="px-8 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Back to Home
          </button>
        </div>

        {/* Additional Help Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Need help? Here are some useful links:
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
